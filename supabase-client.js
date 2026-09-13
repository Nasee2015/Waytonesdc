/**
 * WAYTONE SKILL DEVELOPMENT CENTRE - ENTERPRISE ERP
 * Centralized Supabase Database & Real-Time Sync Engine
 */

(function (window) {
  'use strict';

  const STORAGE_KEY_URL = 'waytone_supabase_url';
  const STORAGE_KEY_KEY = 'waytone_supabase_anon_key';
  const TABLE_NAME = 'waytone_erp_state';
  const RECORD_ID = 'central_database';

  let supabaseClient = null;
  let realtimeChannel = null;
  let connectionStatus = 'LOCAL_ONLY'; // 'LOCAL_ONLY' | 'CONNECTING' | 'CONNECTED' | 'ERROR'
  let lastSyncTime = null;
  let pushDebounceTimer = null;
  let isReceivingRemoteUpdate = false;

  // 1. Storage Helpers
  function getStoredConfig() {
    return {
      url: localStorage.getItem(STORAGE_KEY_URL) || '',
      anonKey: localStorage.getItem(STORAGE_KEY_KEY) || ''
    };
  }

  function saveStoredConfig(url, anonKey) {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);
  }

  function clearStoredConfig() {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }

  // 2. Client Initialization
  function initSupabase(forceReinit) {
    if (supabaseClient && !forceReinit) return supabaseClient;

    const config = getStoredConfig();
    if (!config.url || !config.anonKey) {
      connectionStatus = 'LOCAL_ONLY';
      broadcastStatusChange({ status: 'LOCAL_ONLY', message: 'Local Cache Mode (Supabase not configured)' });
      return null;
    }

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      console.warn('[SupabaseSync] @supabase/supabase-js library is not yet loaded.');
      connectionStatus = 'ERROR';
      broadcastStatusChange({ status: 'ERROR', message: 'Supabase JS library missing' });
      return null;
    }

    try {
      supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      connectionStatus = 'CONNECTING';
      broadcastStatusChange({ status: 'CONNECTING', message: 'Connecting to Supabase...' });
      
      // Setup real-time subscription
      setupRealtimeSubscription();

      return supabaseClient;
    } catch (err) {
      console.error('[SupabaseSync] Failed to initialize Supabase client:', err);
      connectionStatus = 'ERROR';
      broadcastStatusChange({ status: 'ERROR', message: err.message });
      return null;
    }
  }

  // 3. Test Connection
  async function testConnection(url, anonKey) {
    if (!url || !anonKey) {
      return { success: false, message: 'Please provide both Supabase Project URL and Anon API Key.' };
    }

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      return { success: false, message: 'Supabase JS library not loaded. Check internet connection.' };
    }

    try {
      const testClient = window.supabase.createClient(url.trim(), anonKey.trim(), {
        auth: { persistSession: false }
      });

      // Try reading row
      const { data, error } = await testClient
        .from(TABLE_NAME)
        .select('id, updated_at, updated_by')
        .eq('id', RECORD_ID)
        .maybeSingle();

      if (error) {
        // Check for common error codes (relation does not exist)
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          return {
            success: false,
            tableMissing: true,
            message: `Connected to Supabase, but table "${TABLE_NAME}" was not found. Please execute the SQL setup script in Supabase SQL Editor.`
          };
        }
        return { success: false, message: `Supabase Error (${error.code || 'API'}): ${error.message}` };
      }

      return {
        success: true,
        message: 'Successfully connected to Supabase central database!',
        recordExists: !!data,
        lastUpdated: data ? data.updated_at : null
      };
    } catch (ex) {
      return { success: false, message: `Connection test failed: ${ex.message}` };
    }
  }

  // 4. Fetch Central Database from Supabase
  async function fetchCentralDatabase() {
    const client = initSupabase();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from(TABLE_NAME)
        .select('id, data, updated_at, updated_by')
        .eq('id', RECORD_ID)
        .maybeSingle();

      if (error) {
        console.warn('[SupabaseSync] Error fetching central database:', error);
        connectionStatus = 'ERROR';
        broadcastStatusChange({ status: 'ERROR', message: error.message });
        return null;
      }

      connectionStatus = 'CONNECTED';
      lastSyncTime = new Date();
      broadcastStatusChange({
        status: 'CONNECTED',
        message: 'Connected to Supabase Central Database',
        lastSync: lastSyncTime
      });

      if (data && data.data && typeof data.data === 'object') {
        return {
          payload: data.data,
          updatedAt: data.updated_at,
          updatedBy: data.updated_by
        };
      }

      return null;
    } catch (ex) {
      console.warn('[SupabaseSync] Exception during fetch:', ex);
      connectionStatus = 'ERROR';
      broadcastStatusChange({ status: 'ERROR', message: ex.message });
      return null;
    }
  }

  // 5. Push Central Database to Supabase (Debounced)
  function pushCentralDatabase(erpDataPayload, updatedByUser) {
    const client = initSupabase();
    if (!client) return Promise.resolve(false);
    if (isReceivingRemoteUpdate) {
      // Avoid echo loops when receiving remote real-time updates
      return Promise.resolve(true);
    }

    if (pushDebounceTimer) {
      clearTimeout(pushDebounceTimer);
    }

    return new Promise((resolve) => {
      pushDebounceTimer = setTimeout(async () => {
        try {
          const userStr = updatedByUser || (window.activeAuthSession ? window.activeAuthSession.name : 'System');
          const payloadToSave = erpDataPayload || window.ERP_DATA;

          const row = {
            id: RECORD_ID,
            data: payloadToSave,
            updated_at: new Date().toISOString(),
            updated_by: userStr
          };

          const { error } = await client
            .from(TABLE_NAME)
            .upsert(row, { onConflict: 'id' });

          if (error) {
            console.error('[SupabaseSync] Failed to push update to Supabase:', error);
            connectionStatus = 'ERROR';
            broadcastStatusChange({ status: 'ERROR', message: error.message });
            resolve(false);
          } else {
            connectionStatus = 'CONNECTED';
            lastSyncTime = new Date();
            broadcastStatusChange({
              status: 'CONNECTED',
              message: 'Saved to Supabase Central Database',
              lastSync: lastSyncTime
            });
            resolve(true);
          }
        } catch (ex) {
          console.error('[SupabaseSync] Exception during push:', ex);
          connectionStatus = 'ERROR';
          broadcastStatusChange({ status: 'ERROR', message: ex.message });
          resolve(false);
        }
      }, 350); // 350ms debounce
    });
  }

  // 6. Realtime Subscription
  function setupRealtimeSubscription() {
    if (!supabaseClient) return;

    if (realtimeChannel) {
      supabaseClient.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }

    try {
      realtimeChannel = supabaseClient
        .channel('waytone-central-sync')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: TABLE_NAME,
            filter: `id=eq.${RECORD_ID}`
          },
          (payload) => {
            handleRemoteRecordChange(payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('[SupabaseSync] Realtime sync channel active.');
            connectionStatus = 'CONNECTED';
            broadcastStatusChange({
              status: 'CONNECTED',
              message: 'Realtime Central Database Active',
              lastSync: lastSyncTime
            });
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            console.warn('[SupabaseSync] Realtime channel status:', status);
          }
        });
    } catch (e) {
      console.warn('[SupabaseSync] Could not setup realtime channel:', e);
    }
  }

  // 7. Handle incoming changes from other devices/browsers
  function handleRemoteRecordChange(payload) {
    if (!payload || !payload.new || !payload.new.data) return;

    const remoteData = payload.new.data;
    const updatedBy = payload.new.updated_by || 'Remote User';
    const currentUser = window.activeAuthSession ? window.activeAuthSession.name : '';

    // If change was made by current user in the last few seconds, avoid loop
    if (updatedBy && currentUser && updatedBy === currentUser) {
      return;
    }

    console.log(`[SupabaseSync] ⚡ Remote update received from ${updatedBy}! Synchronizing ERP...`);

    isReceivingRemoteUpdate = true;
    try {
      if (typeof window.applyRemoteDatabaseUpdate === 'function') {
        window.applyRemoteDatabaseUpdate(remoteData, updatedBy);
      } else if (window.ERP_DATA && typeof window.ERP_DATA === 'object') {
        Object.assign(window.ERP_DATA, remoteData);
        if (typeof window.saveDatabase === 'function') {
          // save to localStorage only without echoing back to Supabase
          localStorage.setItem('waytone_erp_database', JSON.stringify(window.ERP_DATA));
        }
        if (typeof window.refreshActiveView === 'function') {
          window.refreshActiveView();
        }
      }

      lastSyncTime = new Date();
      broadcastStatusChange({
        status: 'CONNECTED',
        message: `Synced live data from ${updatedBy}`,
        lastSync: lastSyncTime
      });

      if (typeof window.showToastNotification === 'function') {
        window.showToastNotification(`Live Sync: Central database updated by ${updatedBy}`);
      }
    } finally {
      setTimeout(() => {
        isReceivingRemoteUpdate = false;
      }, 500);
    }
  }

  // 8. Event Broadcast
  function broadcastStatusChange(detail) {
    const event = new CustomEvent('waytone:db-status-change', {
      detail: {
        status: connectionStatus,
        lastSync: lastSyncTime,
        ...detail
      }
    });
    window.dispatchEvent(event);
  }

  // Expose API
  window.WaytoneSupabase = {
    init: initSupabase,
    getStoredConfig: getStoredConfig,
    saveStoredConfig: saveStoredConfig,
    clearStoredConfig: clearStoredConfig,
    testConnection: testConnection,
    fetchCentralDatabase: fetchCentralDatabase,
    pushCentralDatabase: pushCentralDatabase,
    getStatus: () => connectionStatus,
    getLastSyncTime: () => lastSyncTime,
    TABLE_NAME: TABLE_NAME,
    RECORD_ID: RECORD_ID
  };

  // Attempt auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initSupabase());
  } else {
    setTimeout(() => initSupabase(), 50);
  }

})(window);

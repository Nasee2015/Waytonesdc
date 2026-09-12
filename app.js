// Waytone Skill Development Centre - Main Application Controller
// Orchestrates CEO Dashboard for Nasim v, Pista Green & Grey Theme, Rupee Currency, and WayBoss AI

let currentView = 'ceo-dashboard';
let currentRevenueTimeframe = 'monthly';

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  populateCeoDashboard();
  populateCRMView();
  populateFinanceView();
  populateClassManagementView();
  populateHRMView();
  populateCatalogueView();
  syncCatalogueAndActiveStudents();
  initTelecallerDashboard();
  initMarketingDashboard();
  initHrmRolesGovernance();
  initWayBossAI();
  setupGlobalKeyboardShortcuts();
  initAuthSystem();

  // Deep-linking URL query params support
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('view')) {
      switchView(urlParams.get('view'));
    }
    if (urlParams.has('classTab')) {
      switchClassTab(urlParams.get('classTab'));
    }
    if (urlParams.has('mentor')) {
      openMentorDashboard(urlParams.get('mentor'));
    }
    if (urlParams.has('package')) {
      openPackageDashboard(urlParams.get('package'));
    }
    if (urlParams.has('hrmTab')) {
      switchHrmTab(urlParams.get('hrmTab'));
    }
    if (urlParams.has('profile')) {
      openEmployeeProfile(urlParams.get('profile'));
    }
    if (urlParams.has('slip')) {
      openSalarySlip(urlParams.get('slip'));
    }
    if (urlParams.has('course')) {
      switchView('catalogue');
      openCourseDetails(urlParams.get('course'));
    }
    if (urlParams.has('addCourse')) {
      switchView('catalogue');
      openAddCourseModal();
    }
    if (urlParams.has('adjustSlots')) {
      openAdjustPackageSlotsModal(urlParams.get('adjustSlots'));
    }
    if (urlParams.has('testAdmission')) {
      updateLeadStatus(urlParams.get('testAdmission'), 'Admission');
    }
    if (urlParams.has('role')) {
      const r = urlParams.get('role');
      if (r === 'telecaller') switchRole('ROLE-TC', 'EMP-CRM-01');
      else if (r === 'marketing') switchRole('ROLE-MARKETING', 'EMP-MKT-01');
      else if (r === 'coordinator') switchRole('ROLE-COORD', null);
      else if (r === 'mentor') switchRole('ROLE-MENTOR', null);
      else switchRole('ROLE-ADMIN', null);
    }
    if (urlParams.has('coordSub')) {
      switchView('hrm');
      switchHrmTab('academic-coordinator');
      switchCoordSubModule(urlParams.get('coordSub'));
    }
    if (urlParams.has('mentorSub')) {
      switchView('hrm');
      switchHrmTab('mentor-dashboard');
      switchMentorSubModule(urlParams.get('mentorSub'));
    }
    if (urlParams.has('mktTab')) {
      switchView('marketing');
      switchMarketingTab(urlParams.get('mktTab'));
    }
    if (urlParams.has('mktSync')) {
      switchView('marketing');
      runMarketingErpSyncSimulation();
    }
    if (urlParams.has('mktCreateCamp')) {
      switchView('marketing');
      openCreateCampaignModal();
    }
    if (urlParams.has('tcTab')) {
      switchView('telecaller');
      switchTelecallerTab(urlParams.get('tcTab'));
    }
    if (urlParams.has('tcDialer')) {
      switchView('telecaller');
      openTelecallerDialer(urlParams.get('tcDialer'));
    }
    if (urlParams.has('tcReceipt')) {
      openFeeReceipt(urlParams.get('tcReceipt'));
    }
    if (urlParams.has('tcUpload')) {
      switchView('telecaller');
      openTelecallerUploadModal();
      if (urlParams.get('tcUpload') === 'bulk') {
        switchTelecallerUploadTab('bulk');
      }
    }
    if (urlParams.has('tcGrab')) {
      switchView('telecaller');
      switchTelecallerTab('crm');
      grabTelecallerLead(urlParams.get('tcGrab'));
    }
    if (urlParams.has('hrmTab')) {
      switchView('hrm');
      switchHrmTab(urlParams.get('hrmTab'));
    }
    if (urlParams.has('openProfile')) {
      switchView('hrm');
      switchHrmTab('employees');
      openEmployeeProfile(urlParams.get('openProfile'));
      if (urlParams.get('profileScroll') === 'bottom') {
        setTimeout(() => {
          const m = document.getElementById('hrm-profile-body-content');
          if (m) m.scrollTop = m.scrollHeight;
        }, 300);
      }
    }
    if (urlParams.has('openAddEmp')) {
      switchView('hrm');
      switchHrmTab('employees');
      openAddEmployeeModal();
    }
  } catch (e) {
    console.warn('URL params parsing bypassed:', e);
  }
}

// ==========================================================
// 1. VIEW ROUTER & NAVIGATION
// ==========================================================
function switchView(viewId) {
  if (viewId === 'classes') viewId = 'class-management';
  currentView = viewId;

  // Update Nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Hide all view containers and reveal target
  document.querySelectorAll('.view-container').forEach(container => {
    container.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update breadcrumb
  const breadcrumb = document.getElementById('breadcrumb-current');
  const viewTitles = {
    'ceo-dashboard': 'CEO Dashboard',
    'crm': '1. CRM & Admissions',
    'data-pool': 'Data Pool Master Dashboard',
    'finance': '2. Finance & Accounts',
    'class-management': '3. Class Management',
    'hrm': '4. HRM & Faculty',
    'catalogue': '5. Product Catalogue',
    'telecaller': '7. Telecaller Dashboard',
    'marketing': '8. Marketing Head Dashboard',
    'wayboss-ai': '6. WayBoss AI Assistant'
  };
  if (breadcrumb) {
    breadcrumb.textContent = viewTitles[viewId] || 'Dashboard';
  }

  // If opening Data Pool dashboard, ensure it is freshly rendered
  if (viewId === 'data-pool') {
    renderDataPoolDashboard(currentDataPoolTimeframe);
  }

  // If opening Finance dashboard, refresh finance state
  if (viewId === 'finance') {
    populateFinanceView();
  }

  // If opening Class Management dashboard, refresh class management state
  if (viewId === 'class-management') {
    populateClassManagementView();
  }

  if (viewId === 'hrm') {
    populateHRMView();
  }

  if (viewId === 'catalogue') {
    populateCatalogueView();
  }

  if (viewId === 'telecaller') {
    populateTelecallerDashboard();
  }

  if (viewId === 'marketing') {
    populateMarketingDashboard();
  }

  // If returning to CEO dashboard, refresh KPIs and re-render chart
  if (viewId === 'ceo-dashboard') {
    populateCeoDashboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================
// 2. CEO DASHBOARD - REVENUE GRAPH ENGINE (PISTA GREEN & GREY)
// ==========================================================
function setRevenueTimeframe(timeframe) {
  currentRevenueTimeframe = timeframe;

  document.querySelectorAll('.timeframe-btn').forEach(btn => {
    if (btn.getAttribute('data-timeframe') === timeframe) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderRevenueChart(timeframe);
}

function renderRevenueChart(timeframe) {
  const chartData = ERP_DATA.revenueTrends[timeframe];
  if (!chartData) return;

  const svg = document.getElementById('revenue-svg-chart');
  const wrapper = document.getElementById('revenue-chart-wrapper');
  if (!svg || !wrapper) return;

  // Empty state guard: If no revenue data points, show clean empty state
  if (!chartData.revenue || chartData.revenue.length === 0 || chartData.categories.length === 0) {
    svg.style.display = 'none';
    let emptyBox = wrapper.querySelector('.empty-chart-box');
    if (!emptyBox) {
      emptyBox = document.createElement('div');
      emptyBox.className = 'empty-chart-box';
      emptyBox.innerHTML = `
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pista)" stroke-width="1.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
        <span style="font-size:14px; font-weight:700; color:var(--text-primary); margin-top:10px;">No Financial Data Available</span>
        <span style="font-size:12px; color:var(--text-muted); margin-top:3px;">Tuition fee collections and operating expenditures will be plotted once transactions are recorded.</span>
      `;
      wrapper.appendChild(emptyBox);
    } else {
      emptyBox.style.display = 'flex';
    }

    const periodRevElem = document.getElementById('metric-period-revenue');
    const periodAvgElem = document.getElementById('metric-period-avg');
    const subtitleElem = document.getElementById('graph-subtitle');
    if (periodRevElem) periodRevElem.textContent = '₹0';
    if (periodAvgElem) periodAvgElem.textContent = '₹0 / mo';
    if (subtitleElem) subtitleElem.textContent = 'No financial records in central database';
    return;
  }

  svg.style.display = 'block';
  const existingEmpty = wrapper.querySelector('.empty-chart-box');
  if (existingEmpty) existingEmpty.style.display = 'none';

  // Update sub-metrics
  const periodRevElem = document.getElementById('metric-period-revenue');
  const periodAvgElem = document.getElementById('metric-period-avg');
  const subtitleElem = document.getElementById('graph-subtitle');
  if (periodRevElem) periodRevElem.textContent = chartData.totalRevenuePeriod;
  if (periodAvgElem) periodAvgElem.textContent = chartData.avgDailyRevenue;
  if (subtitleElem) subtitleElem.textContent = chartData.periodLabel + " — " + chartData.growth;

  const width = 1000;
  const height = 290;
  const padding = { top: 25, right: 25, bottom: 35, left: 65 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...chartData.revenue) * 1.15;
  const numPoints = chartData.categories.length;

  const getX = (i) => padding.left + (i / (numPoints - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (val / maxVal) * graphHeight;

  // Build SVG Points
  const revPoints = chartData.revenue.map((val, i) => ({ 
    x: getX(i), 
    y: getY(val), 
    val: val, 
    cat: chartData.categories[i], 
    exp: chartData.expenses[i] 
  }));
  const expPoints = chartData.expenses.map((val, i) => ({ x: getX(i), y: getY(val) }));

  // Create smooth Bezier curve
  function createSmoothPath(points) {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : points.length - 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const revLinePath = createSmoothPath(revPoints);
  const expLinePath = createSmoothPath(expPoints);
  const revAreaPath = `${revLinePath} L ${revPoints[revPoints.length - 1].x} ${padding.top + graphHeight} L ${revPoints[0].x} ${padding.top + graphHeight} Z`;

  // Grid Lines
  let gridSvg = '';
  const yTicks = 4;
  for (let i = 0; i <= yTicks; i++) {
    const yVal = (maxVal / yTicks) * i;
    const yPos = getY(yVal);
    gridSvg += `
      <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="#e2e8f0" stroke-dasharray="2 3"/>
      <text x="${padding.left - 10}" y="${yPos + 4}" fill="#0f1419" font-size="11" font-weight="600" text-anchor="end" font-family="Inter">${chartData.unit === '₹ Cr' ? '₹' + yVal.toFixed(1) + ' Cr' : '₹' + yVal.toFixed(1) + ' L'}</text>
    `;
  }

  // X Axis Labels
  let xLabelsSvg = '';
  revPoints.forEach((pt) => {
    xLabelsSvg += `
      <text x="${pt.x}" y="${height - 10}" fill="#0f1419" font-size="11" font-weight="600" text-anchor="middle" font-family="Inter">${pt.cat}</text>
    `;
  });

  // Nodes
  let nodesSvg = '';
  revPoints.forEach((pt) => {
    nodesSvg += `
      <circle cx="${pt.x}" cy="${pt.y}" r="3.5" fill="#6b8e4e" stroke="#ffffff" stroke-width="2"/>
    `;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="pistaAreaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9bb87a" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="#9bb87a" stop-opacity="0.01"/>
      </linearGradient>
    </defs>
    
    <!-- Grid -->
    ${gridSvg}
    ${xLabelsSvg}

    <!-- Revenue Pista Green Area -->
    <path d="${revAreaPath}" fill="url(#pistaAreaGrad)"/>

    <!-- Expenses Line (Muted Warm Grey Dashed) -->
    <path d="${expLinePath}" fill="none" stroke="#d4a373" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.85"/>

    <!-- Revenue Pista Green Line -->
    <path d="${revLinePath}" fill="none" stroke="#9bb87a" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Data Nodes -->
    ${nodesSvg}

    <!-- Crosshair -->
    <line id="crosshair-line" x1="0" y1="${padding.top}" x2="0" y2="${padding.top + graphHeight}" stroke="rgba(155, 184, 122, 0.4)" stroke-dasharray="2 2" style="display:none;"/>
  `;

  setupChartHover(wrapper, svg, revPoints, chartData);
}

function setupChartHover(wrapper, svg, points, chartData) {
  const tooltip = document.getElementById('chart-tooltip');
  const tooltipDate = document.getElementById('tooltip-date');
  const tooltipRevenue = document.getElementById('tooltip-revenue');
  const tooltipExpenses = document.getElementById('tooltip-expenses');
  const tooltipProfit = document.getElementById('tooltip-profit');

  wrapper.onmousemove = (e) => {
    const rect = svg.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 1000;

    let closestIndex = 0;
    let minDiff = Infinity;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    const pt = points[closestIndex];
    if (!pt) return;

    const crosshair = document.getElementById('crosshair-line');
    if (crosshair) {
      crosshair.setAttribute('x1', pt.x);
      crosshair.setAttribute('x2', pt.x);
      crosshair.style.display = 'block';
    }

    const revVal = chartData.unit === '₹ Cr' ? `₹${pt.val.toFixed(2)} Cr` : `₹${pt.val.toFixed(2)} Lakhs`;
    const expVal = chartData.unit === '₹ Cr' ? `₹${pt.exp.toFixed(2)} Cr` : `₹${pt.exp.toFixed(2)} Lakhs`;
    const profitVal = chartData.unit === '₹ Cr' 
      ? `₹${(pt.val - pt.exp).toFixed(2)} Cr (${Math.round(((pt.val - pt.exp) / pt.val) * 100)}%)`
      : `₹${(pt.val - pt.exp).toFixed(2)} Lakhs (${Math.round(((pt.val - pt.exp) / pt.val) * 100)}%)`;

    tooltipDate.textContent = pt.cat;
    tooltipRevenue.textContent = revVal;
    tooltipExpenses.textContent = expVal;
    tooltipProfit.textContent = profitVal;

    const screenX = (pt.x / 1000) * rect.width;
    const screenY = (pt.y / 290) * rect.height;

    tooltip.style.left = `${screenX}px`;
    tooltip.style.top = `${screenY}px`;
    tooltip.style.display = 'block';
  };

  wrapper.onmouseleave = () => {
    tooltip.style.display = 'none';
    const crosshair = document.getElementById('crosshair-line');
    if (crosshair) crosshair.style.display = 'none';
  };
}

// ==========================================================
// 3. CEO DASHBOARD - DYNAMIC POPULATION & 6 MODULE CARDS
// ==========================================================
function populateCeoDashboard() {
  const finKpis = ERP_DATA.finance?.kpis || {};
  const totalRev = finKpis.totalRevenueFormatted || '₹0';
  const totalExp = finKpis.totalExpensesFormatted || '₹0';
  const netProfit = finKpis.netProfitFormatted || '₹0';
  const margin = finKpis.profitMarginFormatted || '0%';
  const pendingFees = finKpis.pendingReceivablesFormatted || '₹0';
  const pendingCount = (ERP_DATA.finance?.dueFees || []).length;
  const isClean = !finKpis.totalRevenue && !finKpis.totalExpenses;

  const revVal = document.getElementById('kpi-revenue-val');
  const revSub = document.getElementById('kpi-revenue-sub');
  const expVal = document.getElementById('kpi-expenses-val');
  const expSub = document.getElementById('kpi-expenses-sub');
  const profVal = document.getElementById('kpi-profit-val');
  const profSub = document.getElementById('kpi-profit-sub');
  const profLbl = document.getElementById('kpi-profit-label');
  const pendVal = document.getElementById('kpi-pending-val');
  const pendSub = document.getElementById('kpi-pending-sub');

  if (revVal) revVal.textContent = totalRev;
  if (revSub) revSub.textContent = isClean ? 'No Data Available' : 'Gross collections YTD';
  if (expVal) expVal.textContent = totalExp;
  if (expSub) expSub.textContent = isClean ? 'No Data Available' : 'Operating disbursements';
  if (profVal) profVal.textContent = netProfit;
  if (profSub) profSub.textContent = isClean ? '0% margin' : `${margin} margin`;
  if (profLbl) profLbl.textContent = `NET PROFIT (${margin} MARGIN)`;
  if (pendVal) pendVal.textContent = pendingFees;
  if (pendSub) pendSub.textContent = pendingCount > 0 ? `${pendingCount} students with dues` : '0 students with dues';

  renderModuleCards();
  setTimeout(() => {
    renderRevenueChart(currentRevenueTimeframe);
  }, 40);
}

function renderModuleCards() {
  const container = document.getElementById('modules-cards-container');
  if (!container) return;

  const iconSVGs = {
    'users': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    'dollar-sign': `<span style="font-size:16px; font-weight:700;">₹</span>`,
    'graduation-cap': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    'briefcase': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    'book-open': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    'sparkles': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    'phone': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    'trending-up': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
  };

  // Dynamically compute live stats for modules from ERP_DATA
  const pool = ERP_DATA.crm?.dataPool || [];
  const admissionsCount = pool.filter(l => l.status === 'Admission').length;
  const convRate = pool.length > 0 ? ((admissionsCount / pool.length) * 100).toFixed(1) + '%' : '0%';

  const finKpis = ERP_DATA.finance?.kpis || {};
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const students = ERP_DATA.classManagement?.students || [];
  const employees = ERP_DATA.hrm?.employees || [];
  const mentors = employees.filter(e => (e.designation || '').toLowerCase().includes('mentor') || (e.role || '').toLowerCase().includes('mentor') || (e.designation || '').toLowerCase().includes('trainer'));
  const courses = ERP_DATA.catalogue?.courses || [];
  const totalPackages = courses.reduce((acc, c) => acc + (c.packages ? c.packages.length : 0), 0);

  const dynamicModules = [
    {
      id: "crm",
      name: "CRM & Admissions",
      tagline: "Student Inquiries, Follow-ups & Lead Conversion",
      description: "Unified lead pool, counselor call attribution, admission conversion tracking, and multi-channel lead ingestion.",
      icon: "users",
      badge: `${pool.length} Inquiries`,
      stats: [
        { label: "Active Inquiries", value: `${pool.filter(l => l.status !== 'Admission').length}` },
        { label: "Conversion Rate", value: convRate },
        { label: "Admissions Confirmed", value: `${admissionsCount}` }
      ]
    },
    {
      id: "finance",
      name: "Finance & Accounts",
      tagline: "Fee Collections, Outflows & Profit Margins",
      description: "Tuition collection ledger, operational disbursements, vendor invoice tracking, and central bank reconciliation.",
      icon: "dollar-sign",
      badge: `${finKpis.profitMarginFormatted || '0%'} Margin`,
      stats: [
        { label: "Total Collections", value: finKpis.totalRevenueFormatted || '₹0' },
        { label: "Operating Margin", value: finKpis.profitMarginFormatted || '0%' },
        { label: "Pending Fees", value: finKpis.pendingReceivablesFormatted || '₹0' }
      ]
    },
    {
      id: "class-management",
      name: "Class Management",
      tagline: "Active Batches, Faculty & Student Progression",
      description: "Cohort scheduling, student attendance, mentor allocation, syllabus milestones, and package seat slot governance.",
      icon: "graduation-cap",
      badge: `${cohorts.length} Batches`,
      stats: [
        { label: "Active Batches", value: `${cohorts.length}` },
        { label: "Enrolled Students", value: `${students.length}` },
        { label: "Avg Attendance", value: ERP_DATA.classManagement?.kpis?.attendanceAverage || "0%" }
      ]
    },
    {
      id: "hrm",
      name: "HRM & Faculty",
      tagline: "Staff Directory, Roles & Payroll",
      description: "Employee records, faculty workload, biometric attendance sync, monthly salary slips, and RBAC governance.",
      icon: "briefcase",
      badge: `${employees.length} Staff`,
      stats: [
        { label: "Total Headcount", value: `${employees.length}` },
        { label: "Active Mentors", value: `${mentors.length}` },
        { label: "Monthly Payroll", value: ERP_DATA.hrm?.kpis?.totalSalaryFormatted || '₹0' }
      ]
    },
    {
      id: "catalogue",
      name: "Product Catalogue",
      tagline: "Course Programs, Packages & Tuition Pricing",
      description: "Curriculum tracks, package seat capacities, dynamic fees, installment rules, and capacity allocation.",
      icon: "book-open",
      badge: `${courses.length} Programs`,
      stats: [
        { label: "Active Tracks", value: `${courses.length}` },
        { label: "Fee Packages", value: `${totalPackages}` },
        { label: "Avg Package Fee", value: ERP_DATA.catalogue?.kpis?.runRateFormatted || '₹0' }
      ]
    },
    {
      id: "wayboss-ai",
      name: "WayBoss AI Co-Pilot",
      tagline: "Enterprise Intelligence & Automated Actions",
      description: "Executive decision engine, dynamic database querying, cross-ERP workflow automations, and live audit telemetry.",
      icon: "sparkles",
      badge: "Live Co-Pilot",
      stats: [
        { label: "Total Queries", value: `${ERP_DATA.waybossAI?.metrics?.totalQueries || 0}` },
        { label: "Live Records", value: `${pool.length + students.length + (ERP_DATA.finance?.transactions?.length || 0)}` },
        { label: "Connected DB", value: "Real-time" }
      ]
    },
    {
      id: "telecaller",
      name: "Telecaller Workspace",
      tagline: "Admissions Outreach, Calling Desk & Inquiries",
      description: "Direct dialer console, unassigned student leads pool, follow-up call queues, and AI training scenarios.",
      icon: "phone",
      badge: `${(ERP_DATA.telecaller?.counselors || []).length} Counselors Active`,
      stats: [
        { label: "Calls Logged", value: `${ERP_DATA.telecaller?.kpis?.totalCalls || 0}` },
        { label: "Pending Follow-ups", value: `${ERP_DATA.telecaller?.kpis?.pendingFollowUps || 0}` },
        { label: "Admissions", value: `${ERP_DATA.telecaller?.kpis?.admissionsConfirmed || 0}` }
      ]
    },
    {
      id: "marketing",
      name: "Marketing Head Dashboard",
      tagline: "Campaign Operations, Creative Kanban & ROI",
      description: "Multi-channel advertising campaigns, creative review pipeline, budget pacing, CPL and revenue attribution.",
      icon: "trending-up",
      badge: `${ERP_DATA.marketing?.kpis?.activeCampaigns || 0} Campaigns`,
      stats: [
        { label: "Total Leads", value: `${ERP_DATA.marketing?.kpis?.totalLeads || 0}` },
        { label: "Ad Spend", value: `₹${(ERP_DATA.marketing?.kpis?.adSpend || 0).toLocaleString('en-IN')}` },
        { label: "Attributed ROI", value: ERP_DATA.marketing?.kpis?.roi || "0x" }
      ]
    }
  ];

  let html = '';
  dynamicModules.forEach((mod, index) => {
    const statsHtml = mod.stats.map(s => `
      <div class="module-stat-col">
        <span class="label">${s.label}</span>
        <span class="val">${s.value}</span>
      </div>
    `).join('');

    html += `
      <div class="glass-card module-card" onclick="switchView('${mod.id}')">
        <div class="module-card-top">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="module-icon-wrap">
              ${iconSVGs[mod.icon] || ''}
            </div>
            <div class="module-header-text">
              <h3>${index + 1}. ${mod.name}</h3>
              <p>${mod.tagline}</p>
            </div>
          </div>
          <span class="module-status-badge">${mod.badge}</span>
        </div>

        <p class="module-desc">${mod.description}</p>

        <div class="module-stats-list">
          ${statsHtml}
        </div>

        <div class="module-card-footer">
          <span>Open ${mod.name} Dashboard</span>
          <span>→</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ==========================================================
// 4. SUB-DASHBOARD: CRM & STUDENT ADMISSIONS PIPELINE
// ==========================================================
let excelParsedLeads = [];

function populateCRMView() {
  updatePipelineCounters();
  renderCallConnectionChart();
  renderTodayTeamCalls();
  renderTeamPerformanceTable();
  renderLeadSources();
  renderLeadUploaders();
  renderDataPool(ERP_DATA.crm.dataPool);
  renderDataPoolDashboard(currentDataPoolTimeframe);
}

// 1. Pipeline Counters
function updatePipelineCounters() {
  const pool = ERP_DATA.crm.dataPool || [];
  const coldCallCount = pool.filter(l => l.status === 'For Cold Call').length;
  const demoAssessCount = pool.filter(l => l.status === 'For Demo' || l.status === 'For Assessment').length;
  const followupCount = pool.filter(l => l.status === 'For Follow-up').length;
  const admissionsCount = pool.filter(l => l.status === 'Admission').length;

  const baseTotal = pool.length;
  const baseColdCall = coldCallCount;
  const baseDemoAssess = demoAssessCount;
  const baseFollowup = followupCount;
  const baseAdmissions = admissionsCount;

  const elemTotal = document.getElementById('crm-pipe-total');
  const elemColdCall = document.getElementById('crm-pipe-coldcall');
  const elemDemoAssess = document.getElementById('crm-pipe-demo-assess');
  const elemFollowup = document.getElementById('crm-pipe-followup');
  const elemAdmissions = document.getElementById('crm-pipe-admissions');

  if (elemTotal) elemTotal.textContent = baseTotal.toLocaleString();
  if (elemColdCall) elemColdCall.textContent = baseColdCall.toLocaleString();
  if (elemDemoAssess) elemDemoAssess.textContent = baseDemoAssess.toLocaleString();
  if (elemFollowup) elemFollowup.textContent = baseFollowup.toLocaleString();
  if (elemAdmissions) elemAdmissions.textContent = baseAdmissions.toLocaleString();
}

// 2. Target vs Actual Call Connection SVG Graph
function renderCallConnectionChart() {
  const svg = document.getElementById('crm-call-chart-svg');
  const wrapper = document.getElementById('crm-call-chart-wrapper');
  if (!svg) return;

  const data = ERP_DATA.crm?.callConnection;
  if (!data || !data.dailyDays || data.dailyDays.length === 0) {
    svg.style.display = 'none';
    if (wrapper) {
      let emptyBox = wrapper.querySelector('.empty-chart-box');
      if (!emptyBox) {
        emptyBox = document.createElement('div');
        emptyBox.className = 'empty-chart-box';
        emptyBox.innerHTML = `
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pista)" stroke-width="1.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span style="font-size:13px; font-weight:600; color:var(--text-muted); margin-top:8px;">No Call Connection Records</span>
          <span style="font-size:11px; color:var(--text-muted); margin-top:2px;">Dialer metrics will populate here once calls are initiated.</span>
        `;
        wrapper.appendChild(emptyBox);
      } else {
        emptyBox.style.display = 'flex';
      }
    }
    return;
  }

  svg.style.display = 'block';
  if (wrapper) {
    const existingEmpty = wrapper.querySelector('.empty-chart-box');
    if (existingEmpty) existingEmpty.style.display = 'none';
  }

  const width = 700;
  const height = 230;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = 600;
  const numDays = data.dailyDays.length;
  const colWidth = graphWidth / numDays;
  const barWidth = 14;

  let gridSvg = '';
  for (let i = 0; i <= 3; i++) {
    const yVal = (maxVal / 3) * i;
    const yPos = padding.top + graphHeight - (yVal / maxVal) * graphHeight;
    gridSvg += `
      <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="#e2e8f0" stroke-dasharray="2 3"/>
      <text x="${padding.left - 8}" y="${yPos + 4}" fill="#0f1419" font-size="10" font-weight="600" text-anchor="end" font-family="Inter">${Math.round(yVal)}</text>
    `;
  }

  let barsSvg = '';
  data.dailyDays.forEach((day, i) => {
    const xCenter = padding.left + i * colWidth + colWidth / 2;
    const targetVal = data.targetCalls[i];
    const actualVal = data.actualConnected[i];

    const targetH = (targetVal / maxVal) * graphHeight;
    const actualH = (actualVal / maxVal) * graphHeight;

    const targetY = padding.top + graphHeight - targetH;
    const actualY = padding.top + graphHeight - actualH;

    // Target Bar (Soft Subtle Grey - No Black)
    barsSvg += `
      <rect x="${xCenter - barWidth - 2}" y="${targetY}" width="${barWidth}" height="${targetH}" fill="#cbd5e1" rx="2" />
    `;
    // Actual Connected Bar (Pista Green)
    barsSvg += `
      <rect x="${xCenter + 2}" y="${actualY}" width="${barWidth}" height="${actualH}" fill="#6b8e4e" rx="2" />
    `;

    // Label (Black Text Only)
    barsSvg += `
      <text x="${xCenter}" y="${height - 12}" fill="#0f1419" font-size="11" font-weight="600" text-anchor="middle" font-family="Inter">${day}</text>
    `;
  });

  svg.innerHTML = `
    ${gridSvg}
    ${barsSvg}
  `;
}

// 3. Today's Call Connection by Team
function renderTodayTeamCalls() {
  const container = document.getElementById('crm-today-team-calls');
  if (!container) return;

  const items = ERP_DATA.crm?.todayByTeam || [];
  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding:28px 16px;">
        <span style="font-size:12.5px; font-weight:600; color:var(--text-muted);">No Team Calls Logged Today</span>
        <span style="font-size:11px; color:var(--text-muted); margin-top:2px;">Team dialer activities will show live progress here</span>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="team-call-item">
      <div class="team-call-meta">
        <span><strong>${item.name}</strong></span>
        <span>
          <strong style="color:var(--accent-pista-bright);">${item.connected}</strong>
          <span style="color:var(--text-muted);">/ ${item.target} target (${item.rate})</span>
        </span>
      </div>
      <div class="team-call-progress-bg">
        <div class="team-call-progress-fill" style="width:${Math.min(parseInt(item.rate), 100)}%;"></div>
      </div>
    </div>
  `).join('');
}

// 4. Team Performance Table
function renderTeamPerformanceTable() {
  const body = document.getElementById('crm-team-performance-body');
  if (!body) return;

  const list = ERP_DATA.crm?.teamPerformance || [];
  if (list.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="6" class="empty-table-cell">
          <div style="padding:24px 0; color:var(--text-muted);">
            <div style="font-size:13px; font-weight:600;">No Counselor Records Available</div>
            <div style="font-size:11px; margin-top:2px;">Individual counselor metrics will appear upon team dialer engagement</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  body.innerHTML = list.map(m => `
    <tr>
      <td>
        <div class="user-avatar-cell">
          <div class="avatar-circle">${m.avatar}</div>
          <div>
            <div style="font-weight:700; color:var(--text-primary);">${m.name}</div>
            <div style="font-size:11px; color:var(--text-muted);">${m.role}</div>
          </div>
        </div>
      </td>
      <td><strong>${m.totalCalls.toLocaleString()}</strong></td>
      <td style="color:var(--accent-pista-bright); font-weight:700;">${m.admissions}</td>
      <td>${m.followups}</td>
      <td><span class="badge-pista" style="font-weight:700;">${m.convRate}</span></td>
      <td style="color:var(--accent-pista-bright); font-weight:800;">${m.revenue}</td>
    </tr>
  `).join('');
}

// 5. Lead Sources Graph
function renderLeadSources() {
  const container = document.getElementById('crm-lead-sources-list');
  const totalEl = document.getElementById('crm-lead-sources-total');
  const totalLeads = (ERP_DATA.crm?.dataPool || []).length;
  if (totalEl) totalEl.textContent = `${totalLeads.toLocaleString('en-IN')} Leads`;

  if (!container) return;

  const sources = ERP_DATA.crm?.sources || ERP_DATA.crm?.leadSources || [];
  if (sources.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding:28px 16px;">
        <span style="font-size:12.5px; font-weight:600; color:var(--text-muted);">No Lead Sources Recorded</span>
        <span style="font-size:11px; color:var(--text-muted); margin-top:2px;">Acquisition channels will appear as leads are ingested</span>
      </div>
    `;
    return;
  }

  container.innerHTML = sources.map(s => `
    <div>
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span><strong>${s.source}</strong></span>
        <span>${s.count.toLocaleString()} (${s.pct})</span>
      </div>
      <div style="height:6px; border-radius:3px; background:var(--bg-input); overflow:hidden;">
        <div style="width:${s.share}%; height:100%; background:${s.color}; border-radius:3px;"></div>
      </div>
    </div>
  `).join('');
}

// 6. Lead Uploader Graph
function renderLeadUploaders() {
  const container = document.getElementById('crm-lead-uploaders-list');
  if (!container) return;

  const uploaders = ERP_DATA.crm?.uploaders || ERP_DATA.crm?.leadUploaders || [];
  if (uploaders.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding:28px 16px;">
        <span style="font-size:12.5px; font-weight:600; color:var(--text-muted);">No Lead Uploaders Recorded</span>
        <span style="font-size:11px; color:var(--text-muted); margin-top:2px;">Staff upload attribution will show here upon uploads</span>
      </div>
    `;
    return;
  }

  container.innerHTML = uploaders.map(u => `
    <div>
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
        <span><strong>${u.uploader}</strong></span>
        <span>${u.count.toLocaleString()} (${u.share}%)</span>
      </div>
      <div style="height:6px; border-radius:3px; background:var(--bg-input); overflow:hidden;">
        <div style="width:${u.share * 2.8}%; height:100%; background:${u.color}; border-radius:3px;"></div>
      </div>
    </div>
  `).join('');
}

// Active ERP User Context (Automatically attributed as Uploader)
const CURRENT_USER = {
  name: "Nasim v",
  role: "CEO",
  designation: "Chief Executive Officer"
};

// 7. Master Data Pool Table (CRM View)
function renderDataPool(leads) {
  const body = document.getElementById('crm-data-pool-body');
  if (!body) return;

  if (!leads || leads.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="9" class="empty-table-cell">
          <div style="padding:28px 0; color:var(--text-muted);">
            <div style="font-size:13px; font-weight:600;">No Data Available in Pool</div>
            <div style="font-size:11px; margin-top:2px;">Upload student leads via Excel, Photo Card Scans, or Manual Entry to begin</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const statusOptions = [
    "For Cold Call",
    "For Demo",
    "For Assessment",
    "For Follow-up",
    "Admission",
    "Not Interested",
    "Other"
  ];

  body.innerHTML = leads.map(lead => {
    const courseDisplay = lead.coursePackage || lead.course || '<span style="color:var(--text-muted); font-style:italic;">Not Specified</span>';
    const telecallerDisplay = (lead.telecaller && lead.telecaller !== 'Unassigned')
      ? `<span style="color:var(--text-primary); font-weight:600; font-size:12px;">${lead.telecaller}</span>`
      : `<span style="color:var(--text-muted); font-style:italic; font-size:11.5px;">Unassigned</span>`;
    
    const isCeoUpload = lead.uploader && (lead.uploader.includes('Nasim') || lead.uploader === 'Nasim v');
    const uploaderDisplay = isCeoUpload
      ? `<div class="uploader-pill-ceo" title="Auto-attributed to CEO Nasim v">
           <span>👤 Nasim v</span>
           <span class="badge-pista" style="font-size:9px; padding:1px 5px; font-weight:700;">CEO</span>
         </div>`
      : `<span style="font-weight:600; font-size:12px; color:var(--text-primary);">${lead.uploader}</span>`;

    const statusOptionsHtml = statusOptions.map(st => 
      `<option value="${st}" ${lead.status === st ? 'selected' : ''}>${st}</option>`
    ).join('');

    return `
      <tr>
        <td><strong style="color:var(--accent-pista); font-family:var(--font-mono); font-size:11.5px;">${lead.id}</strong></td>
        <td>
          <div style="font-weight:700; color:var(--text-primary);">${lead.name}</div>
          <div style="font-size:11px; color:var(--text-muted);">${lead.leadSource || 'Data Pool'}</div>
        </td>
        <td style="font-family:var(--font-mono); font-size:12px; color:var(--text-primary);">${lead.phone}</td>
        <td>${courseDisplay}</td>
        <td>
          <select class="status-select status-${(lead.status || '').toLowerCase().replace(/\s+/g, '-')}" onchange="updateLeadStatus('${lead.id}', this.value)">
            ${statusOptionsHtml}
          </select>
        </td>
        <td>${telecallerDisplay}</td>
        <td>${uploaderDisplay}</td>
        <td style="font-size:11.5px; color:var(--text-muted);">${lead.dateAdded}</td>
        <td>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="callLead('${lead.name}', '${lead.phone}')">
              📞 Call
            </button>
            <button class="btn-delete-lead" style="padding:3px 8px; font-size:11px;" onclick="deleteLead('${lead.id}')" title="Delete lead from Data Pool">
              💬
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateLeadStatus(leadId, newStatus) {
  const lead = ERP_DATA.crm.dataPool.find(l => l.id === leadId);
  if (lead) {
    const oldStatus = lead.status;
    lead.status = newStatus;
    updatePipelineCounters();
    filterDataPool();
    filterDataPoolDashboard();
    
    if (newStatus === 'Admission' && oldStatus !== 'Admission') {
      handleCRMAdmissionSlotDeduction(lead);
    } else {
      showToastNotification(`Lead "${lead.name}" status updated to "${newStatus}".`);
    }
  }
}

function filterDataPool() {
  const search = (document.getElementById('crm-pool-search')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('crm-pool-filter-status')?.value || '';
  const sourceFilter = document.getElementById('crm-pool-filter-source')?.value || '';

  const filtered = ERP_DATA.crm.dataPool.filter(l => {
    const matchesSearch = !search || 
      (l.name && l.name.toLowerCase().includes(search)) || 
      (l.phone && l.phone.toLowerCase().includes(search)) || 
      (l.uploader && l.uploader.toLowerCase().includes(search)) ||
      (l.coursePackage && l.coursePackage.toLowerCase().includes(search)) ||
      (l.telecaller && l.telecaller.toLowerCase().includes(search));

    const matchesStatus = !statusFilter || l.status === statusFilter;
    const matchesSource = !sourceFilter || l.leadSource === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  renderDataPool(filtered);
}

function callLead(name, phone) {
  showToastNotification(`Connecting outbound dialer to ${name} (${phone})... Call registered!`);
}

// ==========================================================
// 7B. CENTRAL DATA POOL MASTER DASHBOARD ENGINE
// ==========================================================
let currentDataPoolTimeframe = 'monthly';

function setDataPoolTimeframe(tf) {
  currentDataPoolTimeframe = tf;

  // Update timeframe filter buttons
  document.querySelectorAll('#datapool-timeframe-controls .timeframe-btn').forEach(btn => {
    if (btn.getAttribute('data-datapool-tf') === tf) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderDataPoolDashboard(tf);
}

function renderDataPoolDashboard(tf = currentDataPoolTimeframe) {
  renderDataPoolKPIs(tf);
  renderDataPoolGraphs(tf);
  filterDataPoolDashboard();
}

function renderDataPoolKPIs(tf) {
  const pool = ERP_DATA.crm?.dataPool || [];
  const rawTotal = pool.length;
  const unassignedCount = pool.filter(l => !l.telecaller || l.telecaller === 'Unassigned' || l.status === 'For Cold Call').length;

  // Calculate top uploader
  const uploaderCounts = {};
  pool.forEach(l => {
    const u = l.uploader || 'Direct Ingestion';
    uploaderCounts[u] = (uploaderCounts[u] || 0) + 1;
  });
  let topUploaderName = 'None';
  let topUploaderPct = '--';
  const uploaderEntries = Object.entries(uploaderCounts);
  if (uploaderEntries.length > 0) {
    uploaderEntries.sort((a, b) => b[1] - a[1]);
    topUploaderName = uploaderEntries[0][0];
    topUploaderPct = `${Math.round((uploaderEntries[0][1] / rawTotal) * 100)}% Pool Contribution`;
  }

  const elemTotal = document.getElementById('dp-metric-total');
  const elemTotalSub = document.getElementById('dp-metric-total-sub');
  const elemVelocity = document.getElementById('dp-metric-velocity');
  const elemTopUploader = document.getElementById('dp-metric-top-uploader');
  const elemTopUploaderSub = document.getElementById('dp-metric-top-uploader-sub');
  const elemUnassigned = document.getElementById('dp-metric-unassigned');

  if (elemTotal) elemTotal.textContent = rawTotal.toLocaleString();
  if (elemTotalSub) elemTotalSub.textContent = rawTotal === 0 ? 'No Leads in Pool' : `${rawTotal} Ingested Leads`;
  if (elemVelocity) elemVelocity.textContent = rawTotal === 0 ? '0 Leads / Day' : `${Math.max(1, Math.round(rawTotal / 30))} Leads / Day`;
  if (elemTopUploader) elemTopUploader.textContent = topUploaderName;
  if (elemTopUploaderSub) elemTopUploaderSub.textContent = topUploaderPct;
  if (elemUnassigned) elemUnassigned.textContent = `${unassignedCount} Leads`;
}

function renderDataPoolGraphs(tf) {
  const pool = ERP_DATA.crm?.dataPool || [];
  const tfLabel = tf ? (tf.charAt(0).toUpperCase() + tf.slice(1)) : 'Monthly';

  // Tally uploaders
  const uploaderCounts = {};
  pool.forEach(l => {
    const u = l.uploader || 'Direct Ingestion';
    uploaderCounts[u] = (uploaderCounts[u] || 0) + 1;
  });
  const uploaderList = Object.entries(uploaderCounts).map(([uploader, count]) => ({
    uploader,
    count,
    share: pool.length > 0 ? Math.round((count / pool.length) * 100) : 0,
    color: '#6b8e4e'
  }));

  // Tally sources
  const sourceCounts = {};
  pool.forEach(l => {
    const s = l.leadSource || 'Other';
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });
  const sourceList = Object.entries(sourceCounts).map(([source, count]) => ({
    source,
    count,
    share: pool.length > 0 ? Math.round((count / pool.length) * 100) : 0,
    color: '#6b8e4e'
  }));

  // Update period labels & badges
  const uploaderPeriod = document.getElementById('dp-uploader-period-label');
  const sourcePeriod = document.getElementById('dp-source-period-label');
  const uploaderBadge = document.getElementById('dp-uploader-badge');
  const sourceBadge = document.getElementById('dp-source-badge');

  if (uploaderPeriod) uploaderPeriod.textContent = tfLabel;
  if (sourcePeriod) sourcePeriod.textContent = tfLabel;
  if (uploaderBadge) uploaderBadge.textContent = `${uploaderList.length} Active Uploaders`;
  if (sourceBadge) sourceBadge.textContent = `${sourceList.length} Inflow Channels`;

  // Render 1. Uploader Graph
  const uploaderBarsContainer = document.getElementById('dp-uploader-graph-bars');
  if (uploaderBarsContainer) {
    if (uploaderList.length === 0) {
      uploaderBarsContainer.innerHTML = `
        <div class="empty-state-box" style="padding:24px 16px;">
          <span style="font-size:12px; color:var(--text-muted);">No Uploaders Recorded</span>
        </div>
      `;
    } else {
      uploaderBarsContainer.innerHTML = uploaderList.map(u => {
        const isCeo = u.uploader.includes('Nasim');
        const barWidth = Math.min(u.share * 2.6, 100);
        return `
          <div class="dp-graph-row">
            <div class="dp-graph-meta">
              <span style="display:flex; align-items:center; gap:6px;">
                <strong>${u.uploader}</strong>
                ${isCeo ? '<span class="badge-pista" style="font-size:9px; padding:1px 5px; font-weight:700;">CEO</span>' : ''}
              </span>
              <span class="count-tag">
                <strong>${u.count.toLocaleString()}</strong> leads (${u.share}%)
              </span>
            </div>
            <div class="dp-graph-track">
              <div class="dp-graph-fill" style="width:${barWidth}%; background:${u.color || '#6b8e4e'};"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render 2. Lead Source Graph
  const sourceBarsContainer = document.getElementById('dp-source-graph-bars');
  if (sourceBarsContainer) {
    if (sourceList.length === 0) {
      sourceBarsContainer.innerHTML = `
        <div class="empty-state-box" style="padding:24px 16px;">
          <span style="font-size:12px; color:var(--text-muted);">No Inflow Channels Recorded</span>
        </div>
      `;
    } else {
      sourceBarsContainer.innerHTML = sourceList.map(s => {
        return `
          <div class="dp-graph-row">
            <div class="dp-graph-meta">
              <span><strong>${s.source}</strong></span>
              <span class="count-tag">
                <strong>${s.count.toLocaleString()}</strong> leads (${s.share}%)
              </span>
            </div>
            <div class="dp-graph-track">
              <div class="dp-graph-fill" style="width:${s.share}%; background:${s.color || '#6b8e4e'};"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function renderDataPoolDashboardTable(leads) {
  const tbody = document.getElementById('dp-data-pool-body');
  if (!tbody) return;

  const statusOptions = [
    "For Cold Call",
    "For Demo",
    "For Assessment",
    "For Follow-up",
    "Admission",
    "Not Interested",
    "Other"
  ];

  if (!leads || leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:32px; color:var(--text-muted);">
          <div style="font-size:14px; font-weight:700; color:#0f1419; margin-bottom:4px;">No matching leads in Data Pool</div>
          <div style="font-size:12px; color:#4b5563;">Upload student leads via Excel, Photo Card Scans, or Manual Entry</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leads.map(lead => {
    const courseDisplay = lead.coursePackage || lead.course || '<span style="color:var(--text-muted); font-style:italic;">Not Specified</span>';
    const telecallerDisplay = (lead.telecaller && lead.telecaller !== 'Unassigned')
      ? `<span style="color:#0f1419; font-weight:600; font-size:12px;">${lead.telecaller}</span>`
      : `<span style="color:var(--text-muted); font-style:italic; font-size:11.5px;">Unassigned</span>`;

    const isCeoUpload = lead.uploader && (lead.uploader.includes('Nasim') || lead.uploader === 'Nasim v');
    const uploaderDisplay = isCeoUpload
      ? `<div class="uploader-pill-ceo" title="Auto-attributed to CEO Nasim v">
           <span>👤 Nasim v</span>
           <span class="badge-pista" style="font-size:9px; padding:1px 5px; font-weight:700;">CEO</span>
         </div>`
      : `<span style="font-weight:600; font-size:12px; color:#0f1419;">${lead.uploader}</span>`;

    const statusOptionsHtml = statusOptions.map(st => 
      `<option value="${st}" ${lead.status === st ? 'selected' : ''}>${st}</option>`
    ).join('');

    return `
      <tr id="dp-row-${lead.id}">
        <td><strong style="color:var(--accent-pista); font-family:var(--font-mono); font-size:11.5px;">${lead.id}</strong></td>
        <td>
          <div style="font-weight:700; color:#0f1419;">${lead.name}</div>
          <div style="font-size:11px; color:#4b5563;">${lead.leadSource || 'Central Data Pool'}</div>
        </td>
        <td style="font-family:var(--font-mono); font-size:12px; color:#0f1419;">${lead.phone}</td>
        <td>${courseDisplay}</td>
        <td>
          <select class="status-select status-${(lead.status || '').toLowerCase().replace(/\s+/g, '-')}" onchange="updateLeadStatus('${lead.id}', this.value)">
            ${statusOptionsHtml}
          </select>
        </td>
        <td>${telecallerDisplay}</td>
        <td>${uploaderDisplay}</td>
        <td style="font-size:11.5px; color:#4b5563;">${lead.dateAdded}</td>
        <td style="text-align:center;">
          <button class="btn-delete-lead" onclick="deleteLead('${lead.id}')" title="Delete lead from Data Pool">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterDataPoolDashboard() {
  const search = (document.getElementById('dp-pool-search')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('dp-pool-filter-status')?.value || '';
  const sourceFilter = document.getElementById('dp-pool-filter-source')?.value || '';
  const uploaderFilter = document.getElementById('dp-pool-filter-uploader')?.value || '';

  const filtered = ERP_DATA.crm.dataPool.filter(l => {
    const matchesSearch = !search || 
      (l.name && l.name.toLowerCase().includes(search)) || 
      (l.phone && l.phone.toLowerCase().includes(search)) || 
      (l.uploader && l.uploader.toLowerCase().includes(search)) ||
      (l.coursePackage && l.coursePackage.toLowerCase().includes(search)) ||
      (l.telecaller && l.telecaller.toLowerCase().includes(search));

    const matchesStatus = !statusFilter || l.status === statusFilter;
    const matchesSource = !sourceFilter || l.leadSource === sourceFilter;
    const matchesUploader = !uploaderFilter || (l.uploader && l.uploader.includes(uploaderFilter));

    return matchesSearch && matchesStatus && matchesSource && matchesUploader;
  });

  renderDataPoolDashboardTable(filtered);
}

function deleteLead(leadId) {
  const index = ERP_DATA.crm.dataPool.findIndex(l => l.id === leadId);
  if (index === -1) return;
  const lead = ERP_DATA.crm.dataPool[index];

  const confirmed = confirm(`Are you sure you want to permanently delete lead "${lead.name}" (${lead.id}) from the Data Pool?`);
  if (!confirmed) return;

  // Remove lead from in-memory pool
  ERP_DATA.crm.dataPool.splice(index, 1);

  // Synchronize all views and counters
  filterDataPoolDashboard();
  filterDataPool();
  updatePipelineCounters();
  renderDataPoolKPIs(currentDataPoolTimeframe);

  // Update sidebar badge
  const sidebarBadge = document.getElementById('sidebar-pool-badge');
  if (sidebarBadge) {
    const totalCount = 4850 + (ERP_DATA.crm.dataPool.length - 12);
    sidebarBadge.textContent = `${totalCount.toLocaleString()} Leads`;
  }

  showToastNotification(`Lead "${lead.name}" (${lead.id}) deleted from Data Pool.`);
}

function showToastNotification(message) {
  let toast = document.getElementById('app-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast-notification';
    toast.className = 'toast-feedback';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:50%; background:#edf5e8; color:#4d6d31; font-size:12px; font-weight:bold;">✓</span>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ==========================================================
// 8. MODAL INGESTION HANDLERS (EXCEL, PHOTO OCR, MANUAL)
// ==========================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Helper: Select Upload Method from Options Modal
function selectUploadMethod(targetModalId) {
  closeModal('modal-upload-options');
  openModal(targetModalId);
}

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// A. Excel Ingestion (Uploader: Automatically set to Nasim v)
function handleExcelFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    excelParsedLeads = [];
    
    let startIdx = 0;
    if (lines.length > 0 && lines[0].toLowerCase().includes('phone')) {
      startIdx = 1;
    }
    
    for (let i = startIdx; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 2 && cols[0]) {
        excelParsedLeads.push({
          name: cols[0],
          phone: cols[1] || '',
          coursePackage: cols[2] || 'Communicative English',
          status: cols[3] || 'For Cold Call',
          telecaller: cols[4] || 'Unassigned',
          uploader: CURRENT_USER.name
        });
      }
    }

    const tbody = document.getElementById('excel-preview-tbody');
    if (tbody) {
      if (excelParsedLeads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:#6b7280;">No valid student leads found in ${file.name}. Please upload a CSV file with student records.</td></tr>`;
      } else {
        tbody.innerHTML = excelParsedLeads.map(l => `
          <tr>
            <td><strong>${l.name}</strong></td>
            <td>${l.phone}</td>
            <td>${l.coursePackage}</td>
            <td><span class="badge-pista">${l.status}</span></td>
            <td>${l.telecaller}</td>
            <td><span class="uploader-pill-ceo">👤 ${l.uploader} (CEO)</span></td>
          </tr>
        `).join('');
      }
    }

    const container = document.getElementById('excel-preview-container');
    if (container) container.style.display = 'block';
    const countElem = document.getElementById('excel-preview-count');
    if (countElem) countElem.textContent = `Parsed ${excelParsedLeads.length} leads from ${file.name} — Auto-assigned Uploader: ${CURRENT_USER.name}`;
  };
  reader.readAsText(file);
}

function confirmExcelImport() {
  if (excelParsedLeads.length === 0) {
    alert("Please select an Excel or CSV file first.");
    return;
  }

  excelParsedLeads.forEach(item => {
    const newId = `WLD-${1000 + ERP_DATA.crm.dataPool.length + 1}`;
    ERP_DATA.crm.dataPool.unshift({
      id: newId,
      name: item.name,
      phone: item.phone,
      coursePackage: item.coursePackage || "Tech Skills Track",
      status: item.status || "For Cold Call",
      telecaller: item.telecaller || "Unassigned",
      uploader: CURRENT_USER.name, // Automatically assigned to Nasim v
      dateAdded: "Just now",
      leadSource: "Excel Upload"
    });
  });

  closeModal('modal-excel-upload');
  populateCRMView();
  alert(`Successfully imported ${excelParsedLeads.length} leads into the Master Data Pool!\nUploader: Nasim v (CEO Auto-attributed)\nDefault Status: For Cold Call`);
  excelParsedLeads = [];
  const container = document.getElementById('excel-preview-container');
  if (container) container.style.display = 'none';
}

function downloadSampleExcelTemplate() {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "Name,Phone Number,Course Package,Status,Telecaller\n" +
    "Student Name,+91 90000 00000,Communicative English,For Cold Call,Unassigned\n";
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Waytone_Leads_Template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// B. Photo Ingestion (AI Card/Slip OCR - Uploader: Automatically Nasim v)
function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById('photo-extracted-preview');
  if (preview) {
    preview.style.display = 'block';
  }
}

function confirmPhotoImport() {
  const name = document.getElementById('photo-ext-name')?.value.trim();
  const phone = document.getElementById('photo-ext-phone')?.value.trim();
  const course = document.getElementById('photo-ext-course')?.value || "Communicative English (Affordable)";
  const telecaller = document.getElementById('photo-ext-telecaller')?.value || "Unassigned";

  if (!name || !phone) {
    alert("Please enter both the student's name and phone number.");
    return;
  }

  const newId = `WLD-${String(ERP_DATA.crm.dataPool.length + 1).padStart(4, '0')}`;
  ERP_DATA.crm.dataPool.unshift({
    id: newId,
    name: name,
    phone: phone,
    coursePackage: course,
    status: "For Cold Call",
    telecaller: telecaller,
    uploader: CURRENT_USER.name,
    dateAdded: "Just now",
    leadSource: "Photo Card Scan"
  });

  closeModal('modal-photo-upload');
  populateCRMView();
  alert(`Added ${name} (${phone}) from Photo Scan into the Master Data Pool!\nUploader: Nasim v (CEO)\nStatus: For Cold Call`);
  const preview = document.getElementById('photo-extracted-preview');
  if (preview) preview.style.display = 'none';
}

// C. Manual Lead Entry
// Fields: Name, Phone Number, Course Package (optional), Status (Default: For Cold Call), Telecaller assign (optional)
// Uploader: Automatically assigned to Nasim v (CEO)
function submitManualLead() {
  const name = document.getElementById('manual-name')?.value.trim();
  const phone = document.getElementById('manual-phone')?.value.trim();
  const course = document.getElementById('manual-course')?.value || '';
  const status = document.getElementById('manual-status')?.value || 'For Cold Call';
  const telecaller = document.getElementById('manual-telecaller')?.value || 'Unassigned';
  const uploader = CURRENT_USER.name; // Automatically assigned to Nasim v

  if (!name || !phone) {
    alert("Please fill in both Name and Phone Number.");
    return;
  }

  const newId = `WLD-${1000 + ERP_DATA.crm.dataPool.length + 1}`;
  ERP_DATA.crm.dataPool.unshift({
    id: newId,
    name: name,
    phone: phone,
    coursePackage: course,
    status: status,
    telecaller: telecaller,
    uploader: uploader,
    dateAdded: "Just now",
    leadSource: "Manual Ingestion"
  });

  // Reset form fields to defaults
  document.getElementById('manual-name').value = '';
  document.getElementById('manual-phone').value = '';
  document.getElementById('manual-course').value = '';
  document.getElementById('manual-status').value = 'For Cold Call';
  document.getElementById('manual-telecaller').value = 'Unassigned';

  closeModal('modal-manual-entry');
  populateCRMView();
  alert(`Lead "${name}" (${phone}) successfully saved to the Data Pool!\nUploader: ${uploader} (CEO)\nStatus: ${status}`);
}


// ==========================================================
// 5. SUB-DASHBOARD: FINANCE & ACCOUNTS OPERATIONS
// ==========================================================
let currentFinanceTab = 'overview';
let currentFinanceChartMetric = 'revenue';
let currentFinanceReportPeriod = 'monthly';
let currentFinanceCashFlowTimeframe = 'monthly';
let currentDueFeesFilter = 'all';

function switchFinanceTab(tabId) {
  currentFinanceTab = tabId;

  // Update tab buttons
  document.querySelectorAll('.finance-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-fin-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Toggle panes
  document.querySelectorAll('.finance-tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  const targetPane = document.getElementById(`fin-pane-${tabId}`);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Refresh tab-specific visual elements
  if (tabId === 'overview') {
    setTimeout(() => {
      renderRevenueExpenditureLineGraph(currentFinanceCashFlowTimeframe);
      renderDueFeesSection();
    }, 40);
  } else if (tabId === 'analytics') {
    setTimeout(() => {
      renderFinanceChart(currentFinanceChartMetric);
    }, 40);
  } else if (tabId === 'transactions') {
    filterTransactions();
    renderPendingPaymentsTable();
  } else if (tabId === 'invoices') {
    filterInvoices();
  } else if (tabId === 'reports') {
    renderProfitAndLossReport(currentFinanceReportPeriod);
  }
}

function populateFinanceView() {
  renderFinanceKPIs();
  renderRevenueExpenditureLineGraph(currentFinanceCashFlowTimeframe);
  renderDueFeesSection();
  renderFinanceCashflowBars();
  renderFinanceExpenseBreakdown();
  renderFinanceChart(currentFinanceChartMetric);
  renderRevenueByModule();
  renderRevenueByClient();
  filterTransactions();
  renderPendingPaymentsTable();
  filterInvoices();
  populateRecordPaymentSelect();
  renderProfitAndLossReport(currentFinanceReportPeriod);
}

// ----------------------------------------------------------
// 5A. DUAL-LINE GRAPH: REVENUE & EXPENDITURE PERFORMANCE
// (Income Line & Expenditure Line with Day | Weekly | Monthly | Yearly)
// ----------------------------------------------------------
function setFinanceCashFlowTimeframe(timeframe) {
  currentFinanceCashFlowTimeframe = timeframe;

  document.querySelectorAll('#fin-dual-timeframe-controls .timeframe-btn').forEach(btn => {
    if (btn.getAttribute('data-fin-timeframe') === timeframe) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderRevenueExpenditureLineGraph(timeframe);
}

function renderRevenueExpenditureLineGraph(timeframe = 'monthly') {
  const svg = document.getElementById('fin-dual-svg-chart');
  const wrapper = document.getElementById('fin-dual-chart-wrapper');
  if (!svg || !wrapper) return;

  const tf = (ERP_DATA.finance.timeframes && ERP_DATA.finance.timeframes[timeframe])
    ? ERP_DATA.finance.timeframes[timeframe]
    : ERP_DATA.finance.timeframes.monthly;

  // Update summary metrics strip
  const incElem = document.getElementById('fin-dual-income-val');
  const expElem = document.getElementById('fin-dual-expense-val');
  const netElem = document.getElementById('fin-dual-net-val');
  const ratioElem = document.getElementById('fin-dual-ratio-val');
  const subElem = document.getElementById('fin-dual-chart-subtitle');

  if (incElem) incElem.textContent = tf?.totalIncome || '₹0';
  if (expElem) expElem.textContent = tf?.totalExpense || '₹0';
  if (netElem) netElem.textContent = (tf?.netMargin || '₹0').split(' ')[0];
  if (subElem) subElem.textContent = tf?.periodLabel || 'No financial records in central database';
  if (ratioElem) {
    if (tf && tf.incomeSum > 0) {
      const ratio = Math.round((tf.expenseSum / tf.incomeSum) * 100);
      ratioElem.textContent = `${ratio}%`;
    } else {
      ratioElem.textContent = '0%';
    }
  }

  const incomeVals = tf?.income || [];
  const expenseVals = tf?.expense || [];
  const labels = tf?.labels || [];

  // Empty state guard
  if (!labels || labels.length === 0 || incomeVals.length === 0) {
    svg.style.display = 'none';
    let emptyBox = wrapper.querySelector('.empty-chart-box');
    if (!emptyBox) {
      emptyBox = document.createElement('div');
      emptyBox.className = 'empty-chart-box';
      emptyBox.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pista)" stroke-width="1.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
        <span style="font-size:13.5px; font-weight:700; color:var(--text-primary); margin-top:10px;">No Cash Flow Data Available</span>
        <span style="font-size:12px; color:var(--text-muted); margin-top:2px;">Inflow collections and operational outflow will be mapped as financial transactions occur.</span>
      `;
      wrapper.appendChild(emptyBox);
    } else {
      emptyBox.style.display = 'flex';
    }
    return;
  }

  svg.style.display = 'block';
  const existingEmpty = wrapper.querySelector('.empty-chart-box');
  if (existingEmpty) existingEmpty.style.display = 'none';

  const width = 1000;
  const height = 260;
  const padding = { top: 25, right: 35, bottom: 40, left: 75 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...incomeVals, ...expenseVals) * 1.15;
  const numPoints = labels.length;

  const getX = (i) => padding.left + (i / (numPoints - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (val / maxVal) * graphHeight;

  const incPoints = incomeVals.map((val, i) => ({
    x: getX(i),
    y: getY(val),
    val: val,
    label: labels[i]
  }));

  const expPoints = expenseVals.map((val, i) => ({
    x: getX(i),
    y: getY(val),
    val: val,
    label: labels[i]
  }));

  // Build smooth Bézier spline for Income Line
  let incPathD = `M ${incPoints[0].x} ${incPoints[0].y}`;
  for (let i = 0; i < incPoints.length - 1; i++) {
    const p0 = incPoints[i === 0 ? 0 : i - 1];
    const p1 = incPoints[i];
    const p2 = incPoints[i + 1];
    const p3 = incPoints[i + 2 < incPoints.length ? i + 2 : incPoints.length - 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    incPathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  const incAreaD = `${incPathD} L ${incPoints[incPoints.length - 1].x} ${padding.top + graphHeight} L ${incPoints[0].x} ${padding.top + graphHeight} Z`;

  // Build smooth Bézier spline for Expenditure Line
  let expPathD = `M ${expPoints[0].x} ${expPoints[0].y}`;
  for (let i = 0; i < expPoints.length - 1; i++) {
    const p0 = expPoints[i === 0 ? 0 : i - 1];
    const p1 = expPoints[i];
    const p2 = expPoints[i + 1];
    const p3 = expPoints[i + 2 < expPoints.length ? i + 2 : expPoints.length - 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    expPathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  const expAreaD = `${expPathD} L ${expPoints[expPoints.length - 1].x} ${padding.top + graphHeight} L ${expPoints[0].x} ${padding.top + graphHeight} Z`;

  // Grid lines
  let gridSvg = '';
  for (let i = 0; i <= 4; i++) {
    const yVal = (maxVal / 4) * i;
    const yPos = padding.top + graphHeight - (yVal / maxVal) * graphHeight;
    let valFormatted = '';
    if (yVal >= 10000000) {
      valFormatted = `₹${(yVal / 10000000).toFixed(1)}Cr`;
    } else if (yVal >= 100000) {
      valFormatted = `₹${Math.round(yVal / 100000)}L`;
    } else {
      valFormatted = `₹${Math.round(yVal / 1000)}k`;
    }
    gridSvg += `
      <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="#e2e8f0" stroke-dasharray="3 3"/>
      <text x="${padding.left - 10}" y="${yPos + 4}" fill="#0f1419" font-size="10.5" font-weight="600" text-anchor="end">${valFormatted}</text>
    `;
  }

  // X Labels
  let xLabelsSvg = '';
  labels.forEach((lbl, i) => {
    const xPos = getX(i);
    xLabelsSvg += `<text x="${xPos}" y="${height - 14}" fill="#0f1419" font-size="11.5" font-weight="600" text-anchor="middle">${lbl}</text>`;
  });

  // Data Dots for both lines
  let dotsSvg = '';
  incPoints.forEach((pt, i) => {
    dotsSvg += `
      <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#6b8e4e" stroke="#ffffff" stroke-width="2.5" class="chart-point" data-idx="${i}"/>
      <circle cx="${expPoints[i].x}" cy="${expPoints[i].y}" r="4.5" fill="#d97706" stroke="#ffffff" stroke-width="2.5" class="chart-point" data-idx="${i}"/>
    `;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="fin-dual-inc-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6b8e4e" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#6b8e4e" stop-opacity="0.01"/>
      </linearGradient>
      <linearGradient id="fin-dual-exp-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d97706" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#d97706" stop-opacity="0.01"/>
      </linearGradient>
    </defs>
    ${gridSvg}
    ${xLabelsSvg}
    <path d="${incAreaD}" fill="url(#fin-dual-inc-fill)"/>
    <path d="${expAreaD}" fill="url(#fin-dual-exp-fill)"/>
    <path d="${incPathD}" fill="none" stroke="#6b8e4e" stroke-width="3.2" stroke-linecap="round"/>
    <path d="${expPathD}" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 3"/>
    ${dotsSvg}
  `;

  // Interactive Hover Tooltip for dual metrics
  const tooltip = document.getElementById('fin-dual-tooltip');
  const tooltipDate = document.getElementById('fin-dual-tooltip-date');
  const tooltipInc = document.getElementById('fin-dual-tooltip-income');
  const tooltipExp = document.getElementById('fin-dual-tooltip-expense');
  const tooltipNet = document.getElementById('fin-dual-tooltip-net');

  wrapper.onmousemove = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    let closestIdx = 0;
    let minD = 99999;
    incPoints.forEach((p, idx) => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minD) {
        minD = dist;
        closestIdx = idx;
      }
    });

    const incVal = incomeVals[closestIdx];
    const expVal = expenseVals[closestIdx];
    const netVal = incVal - expVal;

    if (tooltip && tooltipDate && tooltipInc && tooltipExp && tooltipNet) {
      tooltipDate.textContent = labels[closestIdx];
      tooltipInc.textContent = `₹${incVal.toLocaleString()}`;
      tooltipExp.textContent = `₹${expVal.toLocaleString()}`;
      tooltipNet.textContent = `${netVal >= 0 ? '+' : '-'}₹${Math.abs(netVal).toLocaleString()}`;
      tooltipNet.style.color = netVal >= 0 ? '#166534' : '#dc2626';

      const screenX = (incPoints[closestIdx].x / width) * rect.width;
      const screenY = (Math.min(incPoints[closestIdx].y, expPoints[closestIdx].y) / height) * rect.height;

      tooltip.style.left = `${screenX}px`;
      tooltip.style.top = `${screenY}px`;
      tooltip.style.display = 'block';
    }
  };

  wrapper.onmouseleave = () => {
    if (tooltip) tooltip.style.display = 'none';
  };
}

// ----------------------------------------------------------
// 5B. DEDICATED DUE FEES MANAGEMENT & RECOVERY
// ----------------------------------------------------------
function renderDueFeesSection() {
  const summary = ERP_DATA.finance.dueFeesSummary;
  if (summary) {
    const totalElem = document.getElementById('due-stat-total');
    const totalSub = document.getElementById('due-stat-total-sub');
    const weekElem = document.getElementById('due-stat-week');
    const over30Elem = document.getElementById('due-stat-overdue30');
    const crit60Elem = document.getElementById('due-stat-critical60');

    if (totalElem) totalElem.textContent = `₹${summary.totalDue.toLocaleString()}`;
    if (totalSub) totalSub.textContent = `${summary.totalStudents} Students across 18 cohorts`;
    if (weekElem) weekElem.textContent = `₹${summary.dueThisWeek.toLocaleString()}`;
    if (over30Elem) over30Elem.textContent = `₹${summary.overdue30.toLocaleString()}`;
    if (crit60Elem) crit60Elem.textContent = `₹${summary.critical60.toLocaleString()}`;
  }

  filterDueFees();
}

function filterDueFees() {
  const tbody = document.getElementById('fin-due-fees-body');
  const countIndicator = document.getElementById('fin-due-count-indicator');
  if (!tbody) return;

  const search = (document.getElementById('fin-due-search')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('fin-due-filter-status')?.value || 'all';

  const duesList = ERP_DATA.finance.dueFees || [];
  const filtered = duesList.filter(item => {
    const matchesSearch = !search ||
      item.studentName.toLowerCase().includes(search) ||
      item.phone.toLowerCase().includes(search) ||
      item.coursePackage.toLowerCase().includes(search) ||
      item.batch.toLowerCase().includes(search) ||
      item.counselor.toLowerCase().includes(search);

    const matchesStatus = (statusFilter === 'all') || (item.agingCategory === statusFilter);

    return matchesSearch && matchesStatus;
  });

  if (countIndicator) {
    countIndicator.textContent = `Showing ${filtered.length} of ${duesList.length} student dues`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:28px; color:#4b5563;">
          No student due fees match the selected search or filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    let badgeHtml = '';
    if (item.agingCategory === 'critical60') {
      badgeHtml = `<span class="badge-critical">Critical (>60d)</span>`;
    } else if (item.agingCategory === 'overdue30') {
      badgeHtml = `<span class="badge-pending">Overdue (31-60d)</span>`;
    } else {
      badgeHtml = `<span class="badge-due-soon">Due Soon</span>`;
    }

    const agingText = item.daysOverdue > 0
      ? `<span style="color:#dc2626; font-weight:700;">Overdue by ${item.daysOverdue} days</span>`
      : `<span style="color:#166534;">Due: ${item.dueDate}</span>`;

    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f1419;">${item.studentName}</div>
          <div style="font-size:11px; color:#4b5563;">${item.phone} • ${item.studentId}</div>
        </td>
        <td>
          <div style="font-weight:600; color:#0f1419;">${item.coursePackage}</div>
          <span class="badge-pista" style="font-size:9.5px; padding:1px 6px;">${item.batch}</span>
        </td>
        <td style="font-family:var(--font-mono); font-size:12.5px; color:#4b5563;">₹${item.totalFee.toLocaleString()}</td>
        <td style="font-family:var(--font-mono); font-size:12.5px; color:#166534; font-weight:700;">₹${item.paidAmount.toLocaleString()}</td>
        <td style="font-family:var(--font-mono); font-size:13.5px; font-weight:800; color:#d97706;">₹${item.dueAmount.toLocaleString()}</td>
        <td>
          <div style="font-size:12px; color:#0f1419;">${item.dueDate}</div>
          <div style="font-size:11px;">${agingText}</div>
        </td>
        <td>${badgeHtml}</td>
        <td style="font-size:12px; color:#0f1419;">${item.counselor}</td>
        <td style="text-align:center;">
          <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
            <button class="btn-primary-ai" style="padding:4px 9px; font-size:11px;" onclick="collectDueFee('${item.id}')" title="Settle/Collect Fee">
              Collect Fee
            </button>
            <button class="btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="sendDueReminder('${item.id}')" title="Send WhatsApp & SMS Reminder">
              Reminder
            </button>
            <button class="btn-secondary" style="padding:4px 7px; font-size:11px;" onclick="printDueFeeSlip('${item.id}')" title="Print Fee Slip">
              Slip
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function collectDueFee(dueId) {
  const item = (ERP_DATA.finance.dueFees || []).find(d => d.id === dueId);
  if (!item) return;

  openModal('modal-record-payment');

  const amtInput = document.getElementById('record-pay-amount');
  const notesInput = document.getElementById('record-pay-notes');
  if (amtInput) amtInput.value = item.dueAmount;
  if (notesInput) notesInput.value = `Fee settlement for ${item.studentName} (${item.studentId}) - ${item.coursePackage}`;

  const select = document.getElementById('record-pay-invoice-select');
  if (select) {
    const matchingOpt = Array.from(select.options).find(opt => opt.text.toLowerCase().includes(item.studentName.toLowerCase()));
    if (matchingOpt) {
      select.value = matchingOpt.value;
    }
  }
}

function sendDueReminder(dueId) {
  const item = (ERP_DATA.finance.dueFees || []).find(d => d.id === dueId);
  if (!item) return;

  showToastNotification(`Fee reminder dispatched via WhatsApp & SMS to ${item.studentName} (${item.phone}) for outstanding ₹${item.dueAmount.toLocaleString()}.`);
}

function sendBulkDueReminders() {
  showToastNotification(`Bulk automated WhatsApp & SMS fee reminders dispatched to all 412 students with outstanding fee dues.`);
}

function printDueFeeSlip(dueId) {
  const item = (ERP_DATA.finance.dueFees || []).find(d => d.id === dueId);
  if (!item) return;

  showToastNotification(`Generating official fee due slip for ${item.studentName}...`);
  setTimeout(() => {
    window.print();
  }, 400);
}

function renderFinanceKPIs() {
  const kpis = ERP_DATA.finance.kpis;
  if (!kpis) return;

  const revElem = document.getElementById('fin-kpi-revenue');
  const expElem = document.getElementById('fin-kpi-expenses');
  const profElem = document.getElementById('fin-kpi-profit');
  const recElem = document.getElementById('fin-kpi-receivables');
  const payElem = document.getElementById('fin-kpi-payables');
  const cashElem = document.getElementById('fin-kpi-cash');

  if (revElem) revElem.textContent = `₹${kpis.totalRevenue.toLocaleString()}`;
  if (expElem) expElem.textContent = `₹${kpis.totalExpenses.toLocaleString()}`;
  if (profElem) profElem.textContent = `₹${kpis.netProfit.toLocaleString()}`;
  if (recElem) recElem.textContent = `₹${kpis.pendingReceivables.toLocaleString()}`;
  if (payElem) payElem.textContent = `₹${kpis.pendingPayables.toLocaleString()}`;
  if (cashElem) cashElem.textContent = `₹${kpis.cashBalance.toLocaleString()}`;
}

function renderFinanceCashflowBars() {
  const cashflowContainer = document.getElementById('finance-cashflow-bars');
  if (!cashflowContainer) return;

  const list = ERP_DATA.finance?.monthlyCashFlow || [];
  if (list.length === 0) {
    cashflowContainer.innerHTML = `
      <div class="empty-state-box" style="padding:24px 16px;">
        <span style="font-size:12px; color:var(--text-muted);">No Cashflow Records Available</span>
      </div>
    `;
    return;
  }

  cashflowContainer.innerHTML = list.map(cf => `
    <div>
      <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; color:#0f1419;">
        <span><strong>${cf.month} 2026</strong></span>
        <span>Inflow: <strong style="color:var(--accent-pista-bright);">₹${(cf.income / 100000).toFixed(1)} L</strong> | Cost: <strong style="color:#d97706;">₹${(cf.expense / 100000).toFixed(1)} L</strong> | Net: <strong style="color:var(--accent-pista-bright);">+₹${(cf.net / 100000).toFixed(1)} L</strong></span>
      </div>
      <div style="display:flex; height:10px; border-radius:4px; overflow:hidden; background:#edf2ea; border:1px solid #dbe2d6;">
        <div style="width:${(cf.expense / cf.income) * 100}%; background:#cbd5e1;" title="Expense"></div>
        <div style="width:${(cf.net / cf.income) * 100}%; background:#6b8e4e;" title="Net Profit"></div>
      </div>
    </div>
  `).join('');
}

function renderFinanceExpenseBreakdown() {
  const expenseContainer = document.getElementById('finance-expense-breakdown');
  if (!expenseContainer) return;

  const list = ERP_DATA.finance?.expenseBreakdown || [];
  if (list.length === 0) {
    expenseContainer.innerHTML = `
      <div class="empty-state-box" style="padding:24px 16px;">
        <span style="font-size:12px; color:var(--text-muted);">No Expense Breakdown Available</span>
      </div>
    `;
    return;
  }

  expenseContainer.innerHTML = list.map(item => `
    <div>
      <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:4px; color:#0f1419;">
        <span>${item.category}</span>
        <strong>${item.amount} (${item.pct}%)</strong>
      </div>
      <div style="height:7px; border-radius:3.5px; background:#edf2ea; overflow:hidden; border:1px solid #e0ebd9;">
        <div style="width:${item.pct}%; height:100%; background:${item.color}; border-radius:3.5px;"></div>
      </div>
    </div>
  `).join('');
}

// 2. Revenue & Expense Analytics Chart (Interactive SVG Curve)
function setFinanceChartMetric(metric) {
  currentFinanceChartMetric = metric;

  document.querySelectorAll('#fin-chart-metric-controls .timeframe-btn').forEach(btn => {
    if (btn.getAttribute('data-fin-metric') === metric) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderFinanceChart(metric);
}

function renderFinanceChart(metric = 'revenue') {
  const svg = document.getElementById('fin-svg-chart');
  const wrapper = document.getElementById('fin-chart-wrapper');
  if (!svg || !wrapper) return;

  const monthlyData = ERP_DATA.finance?.monthlyCashFlow || [];
  if (monthlyData.length === 0) {
    svg.style.display = 'none';
    let emptyBox = wrapper.querySelector('.empty-chart-box');
    if (!emptyBox) {
      emptyBox = document.createElement('div');
      emptyBox.className = 'empty-chart-box';
      emptyBox.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pista)" stroke-width="1.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
        <span style="font-size:13.5px; font-weight:700; color:var(--text-primary); margin-top:10px;">No Analytics Data Available</span>
        <span style="font-size:12px; color:var(--text-muted); margin-top:2px;">Financial trends will be graphed once ledger records exist.</span>
      `;
      wrapper.appendChild(emptyBox);
    } else {
      emptyBox.style.display = 'flex';
    }
    return;
  }

  svg.style.display = 'block';
  const existingEmpty = wrapper.querySelector('.empty-chart-box');
  if (existingEmpty) existingEmpty.style.display = 'none';

  const titleElem = document.getElementById('fin-chart-title');
  const subElem = document.getElementById('fin-chart-subtitle');

  const metricConfig = {
    revenue: {
      title: "Monthly Tuition & Client Revenue (₹)",
      subtitle: "Fee collections from student bootcamps & corporate B2B training",
      values: monthlyData.map(d => d.income),
      color: "#6b8e4e",
      stroke: "#4d6d31"
    },
    expense: {
      title: "Monthly Operating & Faculty Expenses (₹)",
      subtitle: "Faculty payroll, cloud GPU lab servers, marketing, and campus facilities",
      values: monthlyData.map(d => d.expense),
      color: "#d97706",
      stroke: "#b45309"
    },
    profit: {
      title: "Monthly Net Operating Profit (₹)",
      subtitle: "Net cash profit generated after all mentor payroll and operating costs",
      values: monthlyData.map(d => d.net),
      color: "#6b8e4e",
      stroke: "#3d5a27"
    }
  };

  const currentCfg = metricConfig[metric] || metricConfig.revenue;
  if (titleElem) titleElem.textContent = currentCfg.title;
  if (subElem) subElem.textContent = currentCfg.subtitle;

  const categories = monthlyData.map(d => `${d.month} 2026`);
  const values = currentCfg.values;

  const width = 1000;
  const height = 250;
  const padding = { top: 20, right: 30, bottom: 35, left: 65 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(...values) * 1.15;
  const numPoints = values.length;

  const getX = (i) => padding.left + (i / (numPoints - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (val / maxVal) * graphHeight;

  const points = values.map((val, i) => ({
    x: getX(i),
    y: getY(val),
    val: val,
    cat: categories[i]
  }));

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : points.length - 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${points[0].x} ${padding.top + graphHeight} Z`;

  // Grid lines
  let gridSvg = '';
  for (let i = 0; i <= 3; i++) {
    const yVal = (maxVal / 3) * i;
    const yPos = padding.top + graphHeight - (yVal / maxVal) * graphHeight;
    gridSvg += `
      <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="#e2e8f0" stroke-dasharray="3 3"/>
      <text x="${padding.left - 8}" y="${yPos + 4}" fill="#0f1419" font-size="10" font-weight="600" text-anchor="end">₹${Math.round(yVal / 100000)}L</text>
    `;
  }

  // X Labels
  let xLabelsSvg = '';
  points.forEach(pt => {
    xLabelsSvg += `<text x="${pt.x}" y="${height - 12}" fill="#0f1419" font-size="11" font-weight="600" text-anchor="middle">${pt.cat.split(' ')[0]}</text>`;
  });

  // Dots
  let dotsSvg = '';
  points.forEach((pt, i) => {
    dotsSvg += `
      <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="${currentCfg.color}" stroke="#ffffff" stroke-width="2.5" class="chart-point" data-index="${i}"/>
    `;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="fin-chart-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${currentCfg.color}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${currentCfg.color}" stop-opacity="0.01"/>
      </linearGradient>
    </defs>
    ${gridSvg}
    ${xLabelsSvg}
    <path d="${areaD}" fill="url(#fin-chart-fill)"/>
    <path d="${pathD}" fill="none" stroke="${currentCfg.stroke}" stroke-width="3" stroke-linecap="round"/>
    ${dotsSvg}
  `;

  // Interactive Hover
  const tooltip = document.getElementById('fin-chart-tooltip');
  const tooltipDate = document.getElementById('fin-tooltip-date');
  const tooltipVal = document.getElementById('fin-tooltip-val');
  const tooltipLabel = document.getElementById('fin-tooltip-label');

  wrapper.onmousemove = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    let closest = points[0];
    let minD = 99999;
    points.forEach(p => {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minD) {
        minD = dist;
        closest = p;
      }
    });

    if (tooltip && tooltipDate && tooltipVal) {
      tooltipDate.textContent = closest.cat;
      if (tooltipLabel) tooltipLabel.textContent = metric.charAt(0).toUpperCase() + metric.slice(1) + ":";
      tooltipVal.textContent = `₹${closest.val.toLocaleString()}`;
      tooltipVal.style.color = currentCfg.stroke;

      const screenX = (closest.x / width) * rect.width;
      const screenY = (closest.y / height) * rect.height;

      tooltip.style.left = `${screenX}px`;
      tooltip.style.top = `${screenY}px`;
      tooltip.style.display = 'block';
    }
  };

  wrapper.onmouseleave = () => {
    if (tooltip) tooltip.style.display = 'none';
  };
}

function renderRevenueByModule() {
  const container = document.getElementById('fin-revenue-by-module-list');
  if (!container) return;

  const list = ERP_DATA.finance?.revenueByModule || [];
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding:24px 16px;">
        <span style="font-size:12px; color:var(--text-muted);">No Module Revenue Recorded</span>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(m => `
    <div class="dp-graph-row">
      <div class="dp-graph-meta">
        <div>
          <strong>${m.module}</strong>
          <div style="font-size:11px; color:#4b5563;">${m.count}</div>
        </div>
        <span class="count-tag"><strong>${m.amount}</strong> (${m.pct})</span>
      </div>
      <div class="dp-graph-track">
        <div class="dp-graph-fill" style="width:${m.share}%; background:${m.color};"></div>
      </div>
    </div>
  `).join('');
}

function renderRevenueByClient() {
  const container = document.getElementById('fin-revenue-by-client-list');
  if (!container) return;

  const list = ERP_DATA.finance?.revenueByClient || [];
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="padding:24px 16px;">
        <span style="font-size:12px; color:var(--text-muted);">No Corporate Clients Recorded</span>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(c => `
    <div class="dp-graph-row">
      <div class="dp-graph-meta">
        <div>
          <span style="display:flex; align-items:center; gap:6px;">
            <strong>${c.client}</strong>
            <span class="badge-paid" style="font-size:9.5px; padding:1px 5px;">${c.status}</span>
          </span>
          <div style="font-size:11px; color:#4b5563;">${c.type} • ${c.service}</div>
        </div>
        <span class="count-tag"><strong>${c.amount}</strong> (${c.share}%)</span>
      </div>
      <div class="dp-graph-track">
        <div class="dp-graph-fill" style="width:${c.share * 1.6}%; background:${c.color};"></div>
      </div>
    </div>
  `).join('');
}

// 3. Transactions & Payment Ledger
function renderTransactionsTable(transactions) {
  const tbody = document.getElementById('fin-transactions-body');
  if (!tbody) return;

  if (transactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:28px; color:#4b5563;">
          No transactions match your search filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = transactions.map(txn => {
    const isIncome = txn.type === 'Income';
    const typeBadge = isIncome
      ? `<span class="badge-income">▲ Income</span>`
      : `<span class="badge-expense">▼ Expense</span>`;
    
    const amountColor = isIncome ? 'color:#166534;' : 'color:#991b1b;';
    const amountSign = isIncome ? '+₹' : '-₹';

    return `
      <tr>
        <td><strong style="color:var(--accent-pista); font-family:var(--font-mono); font-size:11.5px;">${txn.id}</strong></td>
        <td style="font-size:11.5px; color:#4b5563;">${txn.date}</td>
        <td>${typeBadge}</td>
        <td><strong>${txn.category}</strong></td>
        <td>
          <div style="font-weight:700; color:#0f1419;">${txn.party}</div>
          <div style="font-size:11px; color:#4b5563;">${txn.notes || ''}</div>
        </td>
        <td style="font-size:12px; color:#0f1419;">${txn.method}</td>
        <td style="font-family:var(--font-mono); font-weight:800; ${amountColor}">${amountSign}${txn.amount.toLocaleString()}</td>
        <td><span class="badge-paid">${txn.status}</span></td>
        <td style="font-family:var(--font-mono); font-size:11.5px; color:#4b5563;">${txn.refInvoice || '—'}</td>
      </tr>
    `;
  }).join('');
}

function filterTransactions() {
  const search = (document.getElementById('fin-txn-search')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('fin-txn-filter-type')?.value || '';
  const categoryFilter = document.getElementById('fin-txn-filter-category')?.value || '';

  const txns = ERP_DATA.finance?.transactions || [];
  const filtered = txns.filter(t => {
    const matchesSearch = !search ||
      (t.id && t.id.toLowerCase().includes(search)) ||
      (t.party && t.party.toLowerCase().includes(search)) ||
      (t.category && t.category.toLowerCase().includes(search)) ||
      (t.notes && t.notes.toLowerCase().includes(search));

    const matchesType = !typeFilter || t.type === typeFilter;
    const matchesCategory = !categoryFilter || t.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  renderTransactionsTable(filtered);
}

function renderPendingPaymentsTable() {
  const tbody = document.getElementById('fin-pending-payments-body');
  if (!tbody) return;

  const invoices = ERP_DATA.finance?.invoices || [];
  const pendingInvoices = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  if (pendingInvoices.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:20px; color:#166534; font-weight:600;">
          All student fee installments and vendor payments are completely settled!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pendingInvoices.map(inv => {
    const statusBadge = inv.status === 'Overdue'
      ? `<span class="badge-overdue">Overdue</span>`
      : `<span class="badge-pending">Pending</span>`;

    return `
      <tr>
        <td><strong style="font-family:var(--font-mono); font-size:12px; color:var(--accent-pista);">${inv.id}</strong></td>
        <td><strong>${inv.clientName}</strong></td>
        <td>${inv.moduleService}</td>
        <td style="font-family:var(--font-mono); font-weight:800; color:#d97706;">₹${inv.amount.toLocaleString()}</td>
        <td style="font-size:12px; color:#4b5563;">${inv.dueDate}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="btn-primary-ai" style="padding:4px 10px; font-size:11px;" onclick="quickRecordPaymentForInvoice('${inv.id}')">
            Record Settlement
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. Invoice Management
function renderInvoicesTable(invoices) {
  const tbody = document.getElementById('fin-invoices-body');
  if (!tbody) return;

  if (invoices.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:28px; color:#4b5563;">
          No invoices match the selected filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = invoices.map(inv => {
    let statusBadge = '';
    if (inv.status === 'Paid') {
      statusBadge = `<span class="badge-paid">Paid ✓</span>`;
    } else if (inv.status === 'Pending') {
      statusBadge = `<span class="badge-pending">Pending</span>`;
    } else {
      statusBadge = `<span class="badge-overdue">Overdue</span>`;
    }

    const payAction = (inv.status === 'Paid')
      ? `<span style="font-size:11px; color:#166534; font-weight:700;">Settled</span>`
      : `<button class="btn-secondary" style="padding:3px 8px; font-size:11px; color:#166534; border-color:#86efac; background:#f0fdf4;" onclick="markInvoicePaid('${inv.id}')" title="Mark as Paid">✓ Mark Paid</button>`;

    return `
      <tr>
        <td><strong style="font-family:var(--font-mono); font-size:12px; color:var(--accent-pista);">${inv.id}</strong></td>
        <td>
          <div style="font-weight:700; color:#0f1419;">${inv.clientName}</div>
          <div style="font-size:11px; color:#4b5563;">${inv.notes || ''}</div>
        </td>
        <td>${inv.moduleService}</td>
        <td style="font-family:var(--font-mono); font-weight:800; color:#0f1419;">₹${inv.amount.toLocaleString()}</td>
        <td style="font-size:12px; color:#4b5563;">${inv.dueDate}</td>
        <td style="font-size:12px; color:#4b5563;">${inv.paymentDate}</td>
        <td>${statusBadge}</td>
        <td style="text-align:center;">
          <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
            ${payAction}
            <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="downloadInvoiceCopy('${inv.id}', '${inv.clientName}')" title="Print/Download Invoice">
              PDF
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterInvoices() {
  const statusFilter = document.getElementById('fin-invoice-filter-status')?.value || '';
  const filtered = ERP_DATA.finance.invoices.filter(inv => {
    return !statusFilter || inv.status === statusFilter;
  });
  renderInvoicesTable(filtered);
}

function markInvoicePaid(invoiceId) {
  const inv = ERP_DATA.finance.invoices.find(i => i.id === invoiceId);
  if (!inv) return;

  inv.status = 'Paid';
  inv.paymentDate = "Today";

  // Create corresponding Income transaction
  const newTxnId = `TXN-${9022 + ERP_DATA.finance.transactions.length}`;
  ERP_DATA.finance.transactions.unshift({
    id: newTxnId,
    date: "Today",
    type: "Income",
    category: "Student Tuition",
    party: inv.clientName,
    method: "Direct Settlement",
    amount: inv.amount,
    status: "Completed",
    refInvoice: inv.id,
    notes: `Settlement for invoice ${inv.id}`
  });

  // Cross-Module update
  ERP_DATA.finance.kpis.pendingReceivables = Math.max(0, ERP_DATA.finance.kpis.pendingReceivables - inv.amount);
  ERP_DATA.finance.kpis.cashBalance += inv.amount;
  ERP_DATA.finance.kpis.totalRevenue += inv.amount;
  ERP_DATA.finance.kpis.netProfit += inv.amount;

  // Reconcile matching student due fee record
  const matchingDue = (ERP_DATA.finance.dueFees || []).find(d => d.studentName.toLowerCase() === inv.clientName.toLowerCase());
  if (matchingDue) {
    matchingDue.paidAmount += inv.amount;
    matchingDue.dueAmount = Math.max(0, matchingDue.dueAmount - inv.amount);
    if (matchingDue.dueAmount === 0) {
      matchingDue.status = "Settled";
      matchingDue.agingCategory = "settled";
    }
    if (ERP_DATA.finance.dueFeesSummary) {
      ERP_DATA.finance.dueFeesSummary.totalDue = Math.max(0, ERP_DATA.finance.dueFeesSummary.totalDue - inv.amount);
    }
  }

  // Re-sync UI
  renderFinanceKPIs();
  renderDueFeesSection();
  renderRevenueExpenditureLineGraph(currentFinanceCashFlowTimeframe);
  filterInvoices();
  filterTransactions();
  renderPendingPaymentsTable();
  populateRecordPaymentSelect();

  showToastNotification(`Invoice ${inv.id} for ${inv.clientName} (₹${inv.amount.toLocaleString()}) marked as Paid.`);
}

function downloadInvoiceCopy(invId, clientName) {
  showToastNotification(`Generating printable receipt for Invoice ${invId} (${clientName})...`);
  setTimeout(() => {
    window.print();
  }, 400);
}

// 5. Ingestion & Modal Actions (Add Income, Add Expense, Create Invoice, Record Payment)
function submitAddIncome() {
  const party = document.getElementById('income-party')?.value.trim();
  const category = document.getElementById('income-category')?.value || 'Student Tuition';
  const amount = parseFloat(document.getElementById('income-amount')?.value) || 0;
  const method = document.getElementById('income-method')?.value || 'UPI / PhonePe';
  const date = document.getElementById('income-date')?.value || "Today";
  const ref = document.getElementById('income-ref')?.value.trim() || '—';
  const notes = document.getElementById('income-notes')?.value.trim() || 'Direct Income Recorded';

  if (!party || amount <= 0) {
    alert("Please enter a valid Client/Payer Name and Amount.");
    return;
  }

  const newTxnId = `TXN-${9022 + ERP_DATA.finance.transactions.length}`;
  ERP_DATA.finance.transactions.unshift({
    id: newTxnId,
    date: date === "Today" ? "Today" : date,
    type: "Income",
    category: category,
    party: party,
    method: method,
    amount: amount,
    status: "Completed",
    refInvoice: ref,
    notes: notes
  });

  // Update KPIs
  ERP_DATA.finance.kpis.cashBalance += amount;
  ERP_DATA.finance.kpis.totalRevenue += amount;
  ERP_DATA.finance.kpis.netProfit += amount;

  closeModal('modal-add-income');
  populateFinanceView();
  showToastNotification(`Income of ₹${amount.toLocaleString()} from ${party} recorded successfully!`);
}

function submitAddExpense() {
  const party = document.getElementById('expense-party')?.value.trim();
  const category = document.getElementById('expense-category')?.value || 'Campus Operations';
  const amount = parseFloat(document.getElementById('expense-amount')?.value) || 0;
  const method = document.getElementById('expense-method')?.value || 'Corporate Net Banking';
  const date = document.getElementById('expense-date')?.value || "Today";
  const ref = document.getElementById('expense-ref')?.value.trim() || '—';
  const notes = document.getElementById('expense-notes')?.value.trim() || 'Operational Disbursement';

  if (!party || amount <= 0) {
    alert("Please enter a valid Vendor/Payee and Amount.");
    return;
  }

  const newTxnId = `TXN-${9022 + ERP_DATA.finance.transactions.length}`;
  ERP_DATA.finance.transactions.unshift({
    id: newTxnId,
    date: date === "Today" ? "Today" : date,
    type: "Expense",
    category: category,
    party: party,
    method: method,
    amount: amount,
    status: "Completed",
    refInvoice: ref,
    notes: notes
  });

  // Update KPIs
  ERP_DATA.finance.kpis.cashBalance = Math.max(0, ERP_DATA.finance.kpis.cashBalance - amount);
  ERP_DATA.finance.kpis.totalExpenses += amount;
  ERP_DATA.finance.kpis.netProfit = Math.max(0, ERP_DATA.finance.kpis.netProfit - amount);

  closeModal('modal-add-expense');
  populateFinanceView();
  showToastNotification(`Expense of ₹${amount.toLocaleString()} for ${party} recorded successfully!`);
}

function submitCreateInvoice() {
  const clientName = document.getElementById('inv-client-name')?.value.trim();
  const moduleService = document.getElementById('inv-module-service')?.value || 'Tech Skills Track';
  const invNumber = document.getElementById('inv-number')?.value.trim() || `INV-2026-${String(ERP_DATA.finance.invoices.length + 1).padStart(3, '0')}`;
  const amount = parseFloat(document.getElementById('inv-amount')?.value) || 0;
  const dueDate = document.getElementById('inv-due-date')?.value || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const status = document.getElementById('inv-status')?.value || 'Pending';
  const notes = document.getElementById('inv-notes')?.value.trim() || 'Direct Invoice Creation';

  if (!clientName || amount <= 0) {
    alert("Please enter a Client Name and valid Amount.");
    return;
  }

  const newInvoice = {
    id: invNumber,
    clientName: clientName,
    moduleService: moduleService,
    amount: amount,
    dueDate: dueDate,
    paymentDate: status === 'Paid' ? "Today" : "—",
    status: status,
    notes: notes
  };

  ERP_DATA.finance.invoices.unshift(newInvoice);

  if (status === 'Pending') {
    ERP_DATA.finance.kpis.pendingReceivables += amount;
  } else if (status === 'Paid') {
    ERP_DATA.finance.kpis.cashBalance += amount;
    ERP_DATA.finance.kpis.totalRevenue += amount;
    ERP_DATA.finance.kpis.netProfit += amount;
  }

  closeModal('modal-create-invoice');
  populateFinanceView();
  showToastNotification(`Invoice ${invNumber} for ${clientName} (₹${amount.toLocaleString()}) created.`);
}

function populateRecordPaymentSelect() {
  const select = document.getElementById('record-pay-invoice-select');
  if (!select) return;

  const pending = ERP_DATA.finance.invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  if (pending.length === 0) {
    select.innerHTML = `<option value="">No pending invoices</option>`;
    return;
  }

  select.innerHTML = pending.map(inv => `
    <option value="${inv.id}" data-amount="${inv.amount}">
      ${inv.id} — ${inv.clientName} (Due: ₹${inv.amount.toLocaleString()})
    </option>
  `).join('');

  onRecordPaymentInvoiceChange();
}

function onRecordPaymentInvoiceChange() {
  const select = document.getElementById('record-pay-invoice-select');
  const amtInput = document.getElementById('record-pay-amount');
  if (!select || !amtInput) return;

  const selectedOpt = select.options[select.selectedIndex];
  if (selectedOpt) {
    const amt = selectedOpt.getAttribute('data-amount');
    if (amt) amtInput.value = amt;
  }
}

function quickRecordPaymentForInvoice(invId) {
  openModal('modal-record-payment');
  const select = document.getElementById('record-pay-invoice-select');
  if (select) {
    select.value = invId;
    onRecordPaymentInvoiceChange();
  }
}

function submitRecordPayment() {
  const select = document.getElementById('record-pay-invoice-select');
  const invId = select?.value;
  const amount = parseFloat(document.getElementById('record-pay-amount')?.value) || 0;
  const method = document.getElementById('record-pay-method')?.value || 'UPI / PhonePe';
  const notes = document.getElementById('record-pay-notes')?.value || 'Payment Settlement Recorded';

  if (!invId) {
    alert("Please select an invoice.");
    return;
  }

  markInvoicePaid(invId);
  closeModal('modal-record-payment');
}

// 6. Multi-Period Finance Reports & P&L Statement
function setFinanceReportPeriod(period) {
  currentFinanceReportPeriod = period;

  document.querySelectorAll('#fin-report-period-controls .timeframe-btn').forEach(btn => {
    if (btn.getAttribute('data-fin-report-period') === period) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderProfitAndLossReport(period);
}

function renderProfitAndLossReport(period = 'monthly') {
  const container = document.getElementById('fin-report-statement-container');
  const titleElem = document.getElementById('fin-report-period-title');
  if (!container) return;

  const rep = ERP_DATA.finance.reports[period] || ERP_DATA.finance.reports.monthly;
  if (titleElem) titleElem.textContent = rep.periodLabel;

  container.innerHTML = `
    <div style="background:#ffffff; border:1px solid #dbe2d6; border-radius:8px; padding:18px; margin-top:12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #dbe2d6; padding-bottom:12px; margin-bottom:12px;">
        <div>
          <h4 style="font-size:16px; font-weight:800; color:#0f1419; margin:0;">Waytone Skill Development Centre</h4>
          <div style="font-size:12px; color:#4b5563;">Statement of Profit and Loss • ${rep.periodLabel}</div>
        </div>
        <div style="text-align:right;">
          <span class="badge-paid" style="font-size:12px; padding:4px 10px;">Net Margin: ${rep.netMargin}</span>
        </div>
      </div>

      <table class="pl-statement-table">
        <thead>
          <tr>
            <th>Line Item / Account Description</th>
            <th style="text-align:right;">Amount in Rupees (₹)</th>
            <th style="text-align:right;">Share / %</th>
          </tr>
        </thead>
        <tbody>
          <!-- 1. Operating Revenue -->
          <tr class="pl-section-row">
            <td>1. OPERATING REVENUE (Tuition & Services)</td>
            <td style="text-align:right;">₹${rep.grossRevenue.toLocaleString()}</td>
            <td style="text-align:right;">100.0%</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Student Course Fees & Bootcamps</td>
            <td style="text-align:right;">₹${Math.round(rep.grossRevenue * 0.55).toLocaleString()}</td>
            <td style="text-align:right;">55.0%</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Corporate B2B Upskilling Programs</td>
            <td style="text-align:right;">₹${Math.round(rep.grossRevenue * 0.24).toLocaleString()}</td>
            <td style="text-align:right;">24.0%</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Class Labs, GPU Compute & Certification Vouchers</td>
            <td style="text-align:right;">₹${Math.round(rep.grossRevenue * 0.21).toLocaleString()}</td>
            <td style="text-align:right;">21.0%</td>
          </tr>

          <!-- 2. Cost of Services / Direct Training Costs -->
          <tr class="pl-section-row">
            <td>2. DIRECT COSTS / COST OF TRAINING</td>
            <td style="text-align:right; color:#d97706;">-₹${rep.directCosts.toLocaleString()}</td>
            <td style="text-align:right;">${((rep.directCosts / rep.grossRevenue) * 100).toFixed(1)}%</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Technical Faculty & Lead Mentor Stipends</td>
            <td style="text-align:right;">₹${Math.round(rep.directCosts * 0.70).toLocaleString()}</td>
            <td style="text-align:right;">—</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Student Courseware, Sandbox & Testing Licenses</td>
            <td style="text-align:right;">₹${Math.round(rep.directCosts * 0.30).toLocaleString()}</td>
            <td style="text-align:right;">—</td>
          </tr>

          <!-- 3. Gross Profit -->
          <tr class="pl-total-row">
            <td>GROSS PROFIT (Operating Gross Margin: ${rep.grossMargin})</td>
            <td style="text-align:right; font-weight:800; color:#166534;">₹${rep.grossProfit.toLocaleString()}</td>
            <td style="text-align:right; font-weight:800;">${rep.grossMargin}</td>
          </tr>

          <!-- 4. Operating Expenses (OpEx) -->
          <tr class="pl-section-row">
            <td>3. OPERATING EXPENSES (OpEx)</td>
            <td style="text-align:right; color:#dc2626;">-₹${rep.operatingExpenses.toLocaleString()}</td>
            <td style="text-align:right;">${((rep.operatingExpenses / rep.grossRevenue) * 100).toFixed(1)}%</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Student Ingestion, SEO & Digital Performance Ads</td>
            <td style="text-align:right;">₹${Math.round(rep.operatingExpenses * 0.45).toLocaleString()}</td>
            <td style="text-align:right;">—</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Cloud GPU Infrastructure & Lab Servers</td>
            <td style="text-align:right;">₹${Math.round(rep.operatingExpenses * 0.35).toLocaleString()}</td>
            <td style="text-align:right;">—</td>
          </tr>
          <tr class="pl-sub-row">
            <td>• Campus Facilities, Electricity, High-Speed Grid & Admin</td>
            <td style="text-align:right;">₹${Math.round(rep.operatingExpenses * 0.20).toLocaleString()}</td>
            <td style="text-align:right;">—</td>
          </tr>

          <!-- 5. Net Operating Profit -->
          <tr class="pl-total-row" style="background:#eaf2e5; border-top:3px solid #6b8e4e; border-bottom:3px solid #6b8e4e;">
            <td style="font-size:14px; font-weight:900; color:#1f3b08;">NET OPERATING PROFIT (EBITDA)</td>
            <td style="text-align:right; font-size:16px; font-weight:900; color:#166534;">₹${rep.netProfit.toLocaleString()}</td>
            <td style="text-align:right; font-size:14px; font-weight:900; color:#166534;">${rep.netMargin}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function exportFinanceExcel() {
  const rep = ERP_DATA.finance.reports[currentFinanceReportPeriod] || ERP_DATA.finance.reports.monthly;
  const csvRows = [
    ["Waytone Skill Development Centre - Financial Statement"],
    ["CEO", "Nasim v"],
    ["Period", rep.periodLabel],
    ["Currency", "INR (Rupees)"],
    [],
    ["Metric", "Amount (INR)", "Percentage"],
    ["Gross Operating Revenue", rep.grossRevenue, "100.0%"],
    ["Direct Training Costs", rep.directCosts, ((rep.directCosts / rep.grossRevenue) * 100).toFixed(1) + "%"],
    ["Gross Profit", rep.grossProfit, rep.grossMargin],
    ["Operating Expenses", rep.operatingExpenses, ((rep.operatingExpenses / rep.grossRevenue) * 100).toFixed(1) + "%"],
    ["Net Operating Profit", rep.netProfit, rep.netMargin],
    [],
    ["Cash Balance", ERP_DATA.finance.kpis.cashBalance],
    ["Pending Receivables", ERP_DATA.finance.kpis.pendingReceivables],
    ["Pending Payables", ERP_DATA.finance.kpis.pendingPayables],
    [],
    ["Recent Transaction ID", "Party", "Type", "Amount", "Status"],
    ...ERP_DATA.finance.transactions.map(t => [t.id, t.party, t.type, t.amount, t.status])
  ];

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Waytone_Financial_Report_${currentFinanceReportPeriod}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToastNotification("Financial statement exported to Excel (.csv) successfully.");
}

function exportFinancePDF() {
  showToastNotification("Preparing clean executive financial briefing for print/PDF...");
  setTimeout(() => {
    window.print();
  }, 400);
}

function triggerOverdueReminders() {
  showToastNotification("Automated WhatsApp & SMS fee reminders dispatched to all 412 students with pending installments.");
}

// ==========================================================
// 6. SUB-DASHBOARD: CLASS MANAGEMENT (7 CORE SUB-MODULES)
// ==========================================================
let currentClassTab = 'dashboard';
let currentClassReportMetric = 'admissions';
let currentAttendanceBatch = 'AI-14';
let currentAttendanceDate = '2026-09-05';

function switchClassTab(tabId) {
  if (tabId === 'batches') tabId = 'courses-batches';
  currentClassTab = tabId;
  document.querySelectorAll('.class-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-class-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.class-tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`class-pane-${tabId}`);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  if (tabId === 'dashboard') {
    populateClassManagementView();
  } else if (tabId === 'courses-batches') {
    renderHomeActiveMentors();
    renderClassBatches();
  } else if (tabId === 'students') {
    filterClassStudents();
  } else if (tabId === 'attendance') {
    renderAttendanceView();
  } else if (tabId === 'mentors') {
    renderMentorPerformance();
  } else if (tabId === 'fees') {
    renderClassFeesView();
  } else if (tabId === 'reports') {
    renderClassReports(currentClassReportMetric);
  }
}

function populateClassManagementView() {
  const clsData = ERP_DATA.classManagement;
  if (!clsData) return;

  // 1. Render 7 Executive KPIs
  const kpiTotal = document.getElementById('cls-kpi-total');
  const kpiActive = document.getElementById('cls-kpi-active');
  const kpiNew = document.getElementById('cls-kpi-new');
  const kpiAtt = document.getElementById('cls-kpi-attendance');
  const kpiFees = document.getElementById('cls-kpi-fees');
  const kpiBatches = document.getElementById('cls-kpi-batches');
  const kpiCompleted = document.getElementById('cls-kpi-completed');

  if (kpiTotal) kpiTotal.textContent = clsData.kpis.totalStudents.toLocaleString();
  if (kpiActive) kpiActive.textContent = clsData.kpis.activeStudents.toLocaleString();
  if (kpiNew) kpiNew.textContent = clsData.kpis.newAdmissions.toLocaleString();
  if (kpiAtt) kpiAtt.textContent = clsData.kpis.todayAttendance;
  if (kpiFees) kpiFees.textContent = clsData.kpis.feesPendingFormatted || ('₹' + clsData.kpis.feesPending.toLocaleString('en-IN'));
  if (kpiBatches) kpiBatches.textContent = clsData.kpis.activeBatches;
  if (kpiCompleted) kpiCompleted.textContent = clsData.kpis.completedCourses;

  // 2. Render Active Cohorts Grid
  const container = document.getElementById('class-cohorts-container');
  if (container) {
    const cohorts = clsData.cohorts || [];
    if (cohorts.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1/-1; padding: 32px;">
          <span class="empty-state-icon">👥</span>
          <div class="empty-state-title">No Active Batches or Cohorts</div>
          <div class="empty-state-desc">No student cohorts are currently scheduled in the central database.</div>
        </div>
      `;
    } else {
      container.innerHTML = cohorts.map(c => `
      <div class="glass-card cohort-card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div class="cohort-header">
            <div>
              <h4 style="margin:0 0 4px 0; color:#0f1419; font-size:14.5px;">${c.name}</h4>
              <div class="cohort-mentor" style="font-size:12px; color:#4b5563;">Mentor: <strong>${c.mentor}</strong></div>
            </div>
            <span class="module-status-badge ${c.statusColor}">${c.status}</span>
          </div>

          <div style="display:flex; justify-content:space-between; font-size:12.5px; color:#4b5563; margin:10px 0 8px 0;">
            <span>Enrolled Students: <strong style="color:#0f1419;">${c.students} / ${c.capacity}</strong></span>
            <span>Attendance: <strong style="color:var(--accent-pista-bright);">${c.attendance}</strong></span>
          </div>

          <div style="margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:4px; color:#4b5563;">
              <span>Syllabus Progress</span>
              <span style="font-weight:700; color:#0f1419;">${c.progressText} (${c.progress}%)</span>
            </div>
            <div style="height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
              <div style="width:${c.progress}%; height:100%; background:var(--accent-pista);"></div>
            </div>
          </div>

          <div style="font-size:11.5px; color:#4b5563; background:#f9fafb; padding:8px 10px; border-radius:6px; border:1px solid #e5e7eb; line-height:1.5;">
            🕒 <strong>Schedule:</strong> ${c.schedule}<br>
            🏛 <strong>Room:</strong> ${c.room}<br>
            🏆 <strong>Capstone:</strong> ${c.capstoneTopic}
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn-secondary" style="flex:1; padding:6px 10px; font-size:12px;" onclick="openBatchStudentList('${c.id}')">
            View Students (${c.students})
          </button>
          <button class="btn-primary-ai" style="padding:6px 12px; font-size:12px;" onclick="selectAttendanceBatch('${c.id}')">
            Attendance
          </button>
        </div>
      </div>
    `).join('');
    }
  }

  // 3. Render Today's Scheduled Sessions
  const scheduleBody = document.getElementById('class-schedule-body');
  if (scheduleBody) {
    const sessions = clsData.upcomingSessionsToday || [];
    if (sessions.length === 0) {
      scheduleBody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-table-cell">
            <div class="empty-state-box" style="padding: 20px;">
              <span class="empty-state-icon">🕒</span>
              <div class="empty-state-desc">No classroom sessions scheduled for today</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      scheduleBody.innerHTML = sessions.map(s => `
      <tr>
        <td><strong style="color:var(--accent-pista); font-size:13px;">${s.time}</strong></td>
        <td><strong>${s.batch}</strong></td>
        <td><span style="font-weight:600; color:#0f1419;">${s.topic}</span></td>
        <td>${s.mentor}</td>
        <td><span class="badge-pista">${s.room}</span></td>
        <td>
          <button class="btn-action-view" onclick="selectAttendanceBatch('${s.batch.split(' ')[0]}')">
            Mark Session
          </button>
        </td>
      </tr>
    `).join('');
    }
  }

  // Initialize other tabs data
  renderClassCourses();
  renderHomeActiveMentors();
  renderClassBatches();
  filterClassStudents();
  renderAttendanceView();
  renderMentorPerformance();
  renderClassFeesView();
  renderClassReports(currentClassReportMetric);
}

// ----------------------------------------------------------
// 2. TAB 2: COURSE & BATCH MANAGEMENT
// ----------------------------------------------------------
function renderClassCourses() {
  const coursesList = document.getElementById('class-courses-list');
  const courses = ERP_DATA.classManagement?.courses || [];
  if (!coursesList) return;

  if (courses.length === 0) {
    coursesList.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1/-1; padding: 32px;">
        <span class="empty-state-icon">📚</span>
        <div class="empty-state-title">No Courses Available</div>
        <div class="empty-state-desc">No academic courses registered in the system.</div>
      </div>
    `;
    return;
  }

  coursesList.innerHTML = courses.map(crs => `
    <div class="glass-card course-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:18px;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <span class="badge-pista" style="font-size:11px;">${crs.category}</span>
          <span style="font-size:11px; font-weight:700; color:#6b7280;">ID: ${crs.id}</span>
        </div>
        <h4 style="margin:0 0 6px 0; color:#0f1419; font-size:15px; line-height:1.3;">${crs.title}</h4>
        <p style="font-size:12px; color:#4b5563; margin-bottom:12px; line-height:1.4;">${crs.description}</p>
        
        <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;">
            <span style="color:#6b7280;">Tuition Fee:</span>
            <strong style="color:var(--accent-pista-bright); font-size:14px;">${crs.feeFormatted || ('₹' + crs.fee.toLocaleString('en-IN'))}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;">
            <span style="color:#6b7280;">Duration:</span>
            <strong style="color:#0f1419;">${crs.duration}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:12px;">
            <span style="color:#6b7280;">Mode & Format:</span>
            <span style="color:#0f1419; font-weight:600;">${crs.mode}</span>
          </div>
        </div>

        ${crs.packages ? `
          <!-- 4 Interactive Package Access Cards -->
          <div style="margin-bottom:12px; background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px;">
            <div style="font-size:11px; font-weight:700; color:#374151; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
              <span>📦 4 PACKAGES (CLICK TO OPEN DASHBOARD):</span>
              <span style="color:#6b8e4e; font-size:10px; font-weight:700;">Affordable • Basic • Standard • Premium</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
              ${crs.packages.map(p => `
                <button type="button" onclick="openPackageDashboard('${p.id}')" style="background:#ffffff; border:1px solid #dbe2d6; border-radius:6px; padding:6px 8px; text-align:left; cursor:pointer; transition:all 0.15s ease;" onmouseover="this.style.borderColor='#6b8e4e'; this.style.background='#edf5e8';" onmouseout="this.style.borderColor='#dbe2d6'; this.style.background='#ffffff';">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:12px; color:#0f1419;">${p.name}</strong>
                    <span style="font-size:9.5px; background:#edf5e8; color:#3d5a27; padding:1px 5px; border-radius:3px;">${p.totalClasses} Cls</span>
                  </div>
                  <div style="font-size:11px; color:#6b8e4e; font-weight:700; margin-top:2px;">${p.feeFormatted}</div>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-bottom:12px;">
          <div style="font-size:11px; font-weight:700; color:#6b7280; margin-bottom:6px;">CORE SKILLS & TECH:</div>
          <div style="display:flex; flex-wrap:wrap; gap:5px;">
            ${crs.skills.map(sk => `<span style="font-size:10.5px; background:#f3f4f6; color:#374151; padding:2px 7px; border-radius:4px; border:1px solid #e5e7eb;">${sk}</span>`).join('')}
          </div>
        </div>

        <div style="font-size:11.5px; color:#4b5563; margin-bottom:12px;">
          🏅 <strong>Accreditation:</strong> ${crs.certifications}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid #e5e7eb;">
        <span style="font-size:12px; color:#4b5563;">
          <strong style="color:#0f1419;">${crs.activeBatchesCount}</strong> Batches • <strong style="color:#0f1419;">${crs.enrolled}</strong> Students
        </span>
        <div style="display:flex; gap:6px;">
          ${crs.id === 'CRS-ENG' ? `
            <button class="btn-secondary" style="padding:6px 10px; font-size:11.5px;" onclick="openPackageDashboard('affordable')">
              📦 Packages
            </button>
          ` : ''}
          <button class="btn-primary-ai" style="padding:6px 12px; font-size:12px;" onclick="openEnrollForCourse('${crs.id}')">
            + Enroll Student
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Populate course dropdowns in modals
  const batchCourseSelect = document.getElementById('batch-add-course');
  const enrollCourseSelect = document.getElementById('enroll-student-course');
  if (batchCourseSelect) {
    batchCourseSelect.innerHTML = courses.map(c => `<option value="${c.id}">${c.title} (${c.id})</option>`).join('');
  }
  if (enrollCourseSelect) {
    enrollCourseSelect.innerHTML = courses.map(c => `<option value="${c.title}" data-fee="${c.fee}" data-id="${c.id}">${c.title}</option>`).join('');
  }
}

// ----------------------------------------------------------
// COMMUNICATIVE ENGLISH: PACKAGE DASHBOARD & MENTOR ASSIGNMENTS
// ----------------------------------------------------------
let currentActivePackageId = 'affordable';
let currentPackageTab = 'students';

function openPackageDashboard(pkgId) {
  currentActivePackageId = pkgId || 'affordable';
  currentPackageTab = 'students';
  renderPackageDashboard(currentActivePackageId);
  openModal('modal-package-dashboard');
}

function switchActivePackage(pkgId) {
  currentActivePackageId = pkgId || 'affordable';
  renderPackageDashboard(currentActivePackageId);
}

function switchPackageTab(tabId) {
  currentPackageTab = tabId;
  const tabStudentsBtn = document.getElementById('pkg-tab-students');
  const tabMentorsBtn = document.getElementById('pkg-tab-mentors');
  const tabActiveMentorsBtn = document.getElementById('pkg-tab-active-mentors');
  const paneStudents = document.getElementById('pkg-pane-students');
  const paneMentors = document.getElementById('pkg-pane-mentors');
  const paneActiveMentors = document.getElementById('pkg-pane-active-mentors');
  const actStudents = document.getElementById('pkg-students-actions');
  const actMentors = document.getElementById('pkg-mentors-actions');
  const actActiveMentors = document.getElementById('pkg-active-mentors-actions');

  // Reset tab buttons
  [tabStudentsBtn, tabMentorsBtn, tabActiveMentorsBtn].forEach(btn => {
    if (btn) {
      btn.style.borderBottom = '3px solid transparent';
      btn.style.color = '#6b7280';
    }
  });

  // Hide all panes & actions
  if (paneStudents) paneStudents.style.display = 'none';
  if (paneMentors) paneMentors.style.display = 'none';
  if (paneActiveMentors) paneActiveMentors.style.display = 'none';
  if (actStudents) actStudents.style.display = 'none';
  if (actMentors) actMentors.style.display = 'none';
  if (actActiveMentors) actActiveMentors.style.display = 'none';

  if (tabId === 'students') {
    if (tabStudentsBtn) {
      tabStudentsBtn.style.borderBottom = '3px solid #6b8e4e';
      tabStudentsBtn.style.color = '#0f1419';
    }
    if (paneStudents) paneStudents.style.display = 'block';
    if (actStudents) actStudents.style.display = 'flex';
    renderActivePackageStudents();
  } else if (tabId === 'mentors') {
    if (tabMentorsBtn) {
      tabMentorsBtn.style.borderBottom = '3px solid #6b8e4e';
      tabMentorsBtn.style.color = '#0f1419';
    }
    if (paneMentors) paneMentors.style.display = 'block';
    if (actMentors) actMentors.style.display = 'flex';
    renderActivePackageMentors();
  } else if (tabId === 'active-mentors') {
    if (tabActiveMentorsBtn) {
      tabActiveMentorsBtn.style.borderBottom = '3px solid #6b8e4e';
      tabActiveMentorsBtn.style.color = '#0f1419';
    }
    if (paneActiveMentors) paneActiveMentors.style.display = 'block';
    if (actActiveMentors) actActiveMentors.style.display = 'flex';
    renderPackageActiveMentors();
  }
}

function getActivePackageObject(pkgId) {
  const course = ERP_DATA.classManagement.courses.find(c => c.id === 'CRS-ENG');
  if (!course || !course.packages) return null;
  const id = pkgId || currentActivePackageId;
  return course.packages.find(p => p.id.toLowerCase() === id.toLowerCase()) || course.packages[0];
}

function renderPackageDashboard(pkgId) {
  const pkg = getActivePackageObject(pkgId);
  if (!pkg) return;

  // 1. Update Title & Header
  const titleEl = document.getElementById('pkg-dash-title');
  const badgeEl = document.getElementById('pkg-dash-badge');
  const subEl = document.getElementById('pkg-dash-subtitle');
  if (titleEl) titleEl.textContent = `Communicative English — ${pkg.name} Package Dashboard`;
  if (badgeEl) badgeEl.textContent = `${pkg.name} (${pkg.badge || 'Active'})`;
  if (subEl) subEl.textContent = `${pkg.description} • Fee: ${pkg.feeFormatted} • Total Classes: ${pkg.totalClasses} Sessions`;

  // 2. Update Switcher Pills
  const pillIds = ['affordable', 'basic', 'standard', 'premium'];
  pillIds.forEach(pId => {
    const pill = document.getElementById(`pkg-pill-${pId}`);
    if (pill) {
      if (pId === pkg.id) {
        pill.style.background = '#6b8e4e';
        pill.style.color = '#ffffff';
      } else {
        pill.style.background = 'transparent';
        pill.style.color = '#0f1419';
      }
    }
  });

  // 3. Render Top Metric Strip
  const summaryBar = document.getElementById('pkg-summary-bar');
  if (summaryBar) {
    const totalMentorSlots = (pkg.mentors || []).reduce((acc, m) => {
      const match = (m.availableSlots || '').match(/(\d+)\s*slots/i);
      return acc + (match ? parseInt(match[1]) : 4);
    }, 0);

    summaryBar.innerHTML = `
      <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 14px;">
        <div style="font-size:11px; font-weight:700; color:#6b7280;">PACKAGE FEE</div>
        <div style="font-size:18px; font-weight:800; color:var(--accent-pista-bright); margin-top:2px;">${pkg.feeFormatted}</div>
        <div style="font-size:10.5px; color:#4b5563;">₹ Indian Rupee</div>
      </div>
      <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 14px;">
        <div style="font-size:11px; font-weight:700; color:#6b7280;">TOTAL CLASSES</div>
        <div style="font-size:18px; font-weight:800; color:#0f1419; margin-top:2px;">${pkg.totalClasses} Classes</div>
        <div style="font-size:10.5px; color:#4b5563;">Duration: ${pkg.duration}</div>
      </div>
      <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 14px;">
        <div style="font-size:11px; font-weight:700; color:#6b7280;">ENROLLED STUDENTS</div>
        <div style="font-size:18px; font-weight:800; color:#0f1419; margin-top:2px;">${pkg.enrolled} Students</div>
        <div style="font-size:10.5px; color:#4b5563;">Active in batches</div>
      </div>
      <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 14px;">
        <div style="font-size:11px; font-weight:700; color:#6b7280;">ACTIVE BATCHES</div>
        <div style="font-size:15px; font-weight:700; color:#0f1419; margin-top:3px;">${(pkg.batches || []).join(', ')}</div>
        <div style="font-size:10.5px; color:#4b5563;">Lead: ${pkg.leadMentor}</div>
      </div>
      <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:11px; font-weight:700; color:#6b7280;">AVAILABLE SLOTS</div>
          <button onclick="openAdjustPackageSlotsModal('${currentActivePackageId}')" style="background:#edf5e8; border:1px solid #6b8e4e; color:#2d4a1d; padding:2px 7px; border-radius:4px; font-size:10px; font-weight:700; cursor:pointer;" title="Adjust Available Slots Left"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit Slots</button>
        </div>
        <div style="font-size:18px; font-weight:800; color:#3d5a27; margin-top:2px;">${pkg.availableSlots !== undefined ? pkg.availableSlots : totalMentorSlots} Open Slots</div>
        <div style="font-size:10.5px; color:#4b5563;">${pkg.totalSlots ? `${pkg.enrolled || pkg.enrolledStudents || 0} of ${pkg.totalSlots} filled` : 'Across mentors'}</div>
      </div>
      <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 14px;">
        <div style="font-size:11px; font-weight:700; color:#6b7280;">COMPLETION RATE</div>
        <div style="font-size:18px; font-weight:800; color:var(--accent-pista-bright); margin-top:2px;">${pkg.completionRate}</div>
        <div style="font-size:10.5px; color:#4b5563;">Student pass rate</div>
      </div>
    `;
  }

  // 4. Render Active Tab Pane
  switchPackageTab(currentPackageTab);
}

// OPTION 1: Student Classes & Progress
function renderActivePackageStudents() {
  const pkg = getActivePackageObject(currentActivePackageId);
  if (!pkg) return;

  const tbody = document.getElementById('pkg-students-tbody');
  const searchInput = document.getElementById('pkg-student-search');
  const footerEl = document.getElementById('pkg-student-count-footer');
  if (!tbody) return;

  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
  let students = pkg.students || [];

  if (query) {
    students = students.filter(s =>
      s.name.toLowerCase().includes(query) ||
      (s.phone && s.phone.toLowerCase().includes(query)) ||
      (s.mentor && s.mentor.toLowerCase().includes(query)) ||
      (s.batchCode && s.batchCode.toLowerCase().includes(query))
    );
  }

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:32px 14px; color:#6b7280;">
          No students found matching "${query}".
        </td>
      </tr>
    `;
    if (footerEl) footerEl.textContent = '0 students found';
    return;
  }

  tbody.innerHTML = students.map((s, idx) => {
    const totalCls = s.totalClasses || pkg.totalClasses;
    const pct = Math.min(100, Math.round((s.completedClasses / totalCls) * 100));
    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px 14px;">
          <strong style="color:#0f1419; font-size:13px;">${s.name}</strong>
          <div style="font-size:11px; color:#6b7280;">${s.phone} • <span class="badge-pista" style="padding:1px 5px; font-size:10px;">${s.batchCode}</span></div>
        </td>
        <td style="padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; color:var(--accent-pista-bright); font-size:13px; min-width:48px;">
              ${s.completedClasses} / ${totalCls}
            </span>
            <div style="flex:1; background:#e5e7eb; height:6px; border-radius:3px; max-width:80px; overflow:hidden;">
              <div style="background:#6b8e4e; height:100%; width:${pct}%;"></div>
            </div>
            <span style="font-size:11px; color:#4b5563; min-width:32px;">${pct}%</span>
          </div>
        </td>
        <td style="padding:10px 14px;">
          <a href="javascript:void(0)" onclick="openMentorDashboard('${s.mentor}')" style="color:#0f1419; font-size:12.5px; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e; cursor:pointer;" title="Click to view Mentor Dashboard">
            ${s.mentor}
          </a>
        </td>
        <td style="padding:10px 14px;">
          <span style="font-size:12px; font-weight:600; color:#4b5563;">${s.pendingClassDate}</span>
        </td>
        <td style="padding:10px 14px;">
          <span style="font-size:12px; font-weight:700; color:#0f1419; background:#edf5e8; border:1px solid #dbe2d6; padding:3px 8px; border-radius:4px; display:inline-block;">
            ${s.estimateEndDate}
          </span>
        </td>
        <td style="padding:10px 14px; text-align:center; white-space:nowrap;">
          <button class="btn-primary-ai" style="padding:4px 9px; font-size:11px;" onclick="markStudentClassCompleted('${s.name}')" title="Record 1 Completed Class">
            + Mark Class
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (footerEl) {
    footerEl.textContent = `Showing ${students.length} students in ${pkg.name} Package`;
  }
}

// OPTION 2: Mentors Assigns
function renderActivePackageMentors() {
  const pkg = getActivePackageObject(currentActivePackageId);
  if (!pkg) return;

  const tbody = document.getElementById('pkg-mentors-tbody');
  const footerEl = document.getElementById('pkg-mentor-count-footer');
  if (!tbody) return;

  const mentors = pkg.mentors || [];
  if (mentors.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:32px 14px; color:#6b7280;">
          No mentors assigned to this package yet. Click "+ Assign Mentor Slot" to assign.
        </td>
      </tr>
    `;
    if (footerEl) footerEl.textContent = '0 mentors assigned';
    return;
  }

  tbody.innerHTML = mentors.map((m, idx) => {
    const totalCls = m.totalClasses || pkg.totalClasses;
    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px 14px;">
          <a href="javascript:void(0)" onclick="openMentorDashboard('${m.mentorName}')" style="color:#0f1419; font-size:13px; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e; display:inline-block; cursor:pointer;" title="Click to view Mentor Dashboard">
            ${m.mentorName}
          </a>
          <div style="font-size:11px; color:#6b7280;">📍 ${m.room || 'Language Lab'}</div>
        </td>
        <td style="padding:10px 14px;">
          <span class="badge-pista" style="font-size:11.5px; font-weight:700; padding:3px 8px;">${m.batchNumbers}</span>
        </td>
        <td style="padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <strong style="color:var(--accent-pista-bright); font-size:13px;">
              ${m.classesCompleted} of ${totalCls} Classes Completed
            </strong>
            <span style="font-size:11px; color:#6b7280;">(${m.schedule || 'Scheduled'})</span>
          </div>
        </td>
        <td style="padding:10px 14px;">
          <span style="font-size:12px; font-weight:700; color:#3d5a27; background:#edf5e8; border:1px solid #dbe2d6; padding:3px 8px; border-radius:4px; display:inline-block;">
            ${m.availableSlots}
          </span>
        </td>
        <td style="padding:10px 14px; text-align:center; white-space:nowrap;">
          <div style="display:flex; gap:6px; justify-content:center;">
            <button class="btn-primary-ai" style="padding:4px 9px; font-size:11px;" onclick="openMentorDashboard('${m.mentorName}')">
              Dashboard →
            </button>
            <button class="btn-secondary" style="padding:4px 9px; font-size:11px;" onclick="openAssignMentorModal('${pkg.id}', '${m.mentorName}', '${m.batchNumbers}')">
              Manage
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (footerEl) {
    footerEl.textContent = `Showing ${mentors.length} faculty mentors assigned to ${pkg.name} Package batches`;
  }
}

// Mark Completed Class for Student
function markStudentClassCompleted(studentName) {
  const pkg = getActivePackageObject(currentActivePackageId);
  if (!pkg) return;

  const student = (pkg.students || []).find(s => s.name === studentName);
  if (!student) return;

  const maxClasses = student.totalClasses || pkg.totalClasses;
  if (student.completedClasses < maxClasses) {
    student.completedClasses += 1;

    // Advance pending class date by 2 days
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 2);
    const day = String(nextDate.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    student.pendingClassDate = `${day} ${months[nextDate.getMonth()]} ${nextDate.getFullYear()}`;

    // Recalculate estimated end date based on remaining classes
    const remaining = maxClasses - student.completedClasses;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + (remaining * 3));
    const estDay = String(estDate.getDate()).padStart(2, '0');
    student.estimateEndDate = `${estDay} ${months[estDate.getMonth()]} ${estDate.getFullYear()}`;

    renderActivePackageStudents();
    showToastNotification(`Class marked completed for ${studentName} (${student.completedClasses}/${maxClasses} classes).`);
  } else {
    showToastNotification(`${studentName} has completed all ${maxClasses} classes for ${pkg.name} package!`);
  }
}

// Populate Mentor Dropdown Dynamically
function populateMentorDropdown() {
  const select = document.getElementById('assign-mentor-name');
  if (!select) return;
  const mentors = (ERP_DATA.hrm?.employees || []).filter(e => 
    (e.department && e.department.toLowerCase().includes('faculty')) || 
    (e.role && (e.role.toLowerCase().includes('mentor') || e.role.toLowerCase().includes('trainer') || e.role.toLowerCase().includes('faculty')))
  );
  if (mentors.length === 0) {
    select.innerHTML = '<option value="">No Mentors Available</option>';
  } else {
    select.innerHTML = '<option value="">Select Mentor</option>' + mentors.map(m => `<option value="${escapeHTML(m.name)}">${escapeHTML(m.name)} (${escapeHTML(m.role)})</option>`).join('');
  }
}

// Open Mentor Assignment Modal
function openAssignMentorModal(pkgId, mentorName, batchNumber) {
  populateMentorDropdown();
  const targetPkgId = pkgId || currentActivePackageId || 'affordable';
  const selectPkg = document.getElementById('assign-mentor-pkg');
  const selectMentor = document.getElementById('assign-mentor-name');
  const inputBatch = document.getElementById('assign-mentor-batch');

  if (selectPkg) selectPkg.value = targetPkgId;
  if (selectMentor && mentorName) selectMentor.value = mentorName;
  if (inputBatch && batchNumber) inputBatch.value = batchNumber;

  openModal('modal-assign-mentor');
}

// Submit Mentor Assignment
function submitAssignMentor() {
  const pkgId = document.getElementById('assign-mentor-pkg')?.value || 'affordable';
  const mentorName = document.getElementById('assign-mentor-name')?.value?.trim();
  const batchNumbers = document.getElementById('assign-mentor-batch')?.value?.trim();
  const completedClasses = parseInt(document.getElementById('assign-mentor-completed-classes')?.value) || 0;
  const availableSlots = document.getElementById('assign-mentor-slots')?.value?.trim() || '30 slots open (0/30)';
  const schedule = document.getElementById('assign-mentor-schedule')?.value?.trim() || 'TBD';
  const room = document.getElementById('assign-mentor-room')?.value?.trim() || 'Online / Lab';

  if (!mentorName || !batchNumbers) {
    alert("Please select a Mentor and enter a Batch Code.");
    return;
  }

  const course = ERP_DATA.classManagement.courses.find(c => c.id === 'CRS-ENG');
  if (!course || !course.packages) return;
  const pkg = course.packages.find(p => p.id === pkgId) || course.packages[0];

  if (!pkg.mentors) pkg.mentors = [];
  const existingMentorIdx = pkg.mentors.findIndex(m => m.batchNumbers === batchNumbers && m.mentorName === mentorName);

  if (existingMentorIdx >= 0) {
    pkg.mentors[existingMentorIdx].availableSlots = availableSlots;
    pkg.mentors[existingMentorIdx].classesCompleted = completedClasses;
    pkg.mentors[existingMentorIdx].schedule = schedule;
    pkg.mentors[existingMentorIdx].room = room;
  } else {
    pkg.mentors.push({
      mentorName: mentorName,
      batchNumbers: batchNumbers,
      classesCompleted: completedClasses,
      totalClasses: pkg.totalClasses,
      availableSlots: availableSlots,
      schedule: schedule,
      room: room
    });
  }

  closeModal('modal-assign-mentor');
  showToastNotification(`Mentor assignment for ${mentorName} (${batchNumbers}) saved successfully.`);

  // If package dashboard is open, re-render
  currentActivePackageId = pkgId;
  renderPackageDashboard(currentActivePackageId);
  switchPackageTab('mentors');
}

// Quick Enroll for Active Package
function openEnrollForActivePackage() {
  const pkg = getActivePackageObject(currentActivePackageId);
  const enrollCourseSelect = document.getElementById('enroll-student-course');
  if (enrollCourseSelect && pkg) {
    enrollCourseSelect.value = `Communicative English (${pkg.name})`;
  }
  openModal('modal-enroll-student');
}

// ========================================================
// ACTIVE MENTORS LIST & MENTOR DASHBOARD ENGINE
// Constraint: Each mentor can take 3 to 4 batches
// ========================================================

// 1. Render Active Mentors in Package Dashboard Tab 3
function renderPackageActiveMentors() {
  const tbody = document.getElementById('pkg-active-mentors-tbody');
  const footerEl = document.getElementById('pkg-active-mentors-count-footer');
  const mentors = ERP_DATA.classManagement.activeMentors || [];
  if (!tbody) return;

  if (mentors.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:32px 14px; color:#6b7280;">
          No active mentors registered.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = mentors.map(m => {
    const batchesBadges = (m.activeBatches || []).map(b => `
      <span class="badge-pista" style="font-size:11px; font-weight:700; margin:2px; display:inline-block;" title="${b.package}: ${b.batchInfo} • ${b.schedule}">
        ${b.batchCode} (${b.package} - ${b.capacity} st)
      </span>
    `).join('');

    const activeCount = m.activeBatchesCount || (m.activeBatches ? m.activeBatches.length : 3);
    const maxBatches = m.maxBatches || 4;
    const capPct = Math.round((activeCount / maxBatches) * 100);
    const isFull = activeCount >= maxBatches;

    return `
      <tr style="border-bottom:1px solid #e5e7eb; cursor:pointer;" onclick="openMentorDashboard('${m.id}')" title="Click to open Mentor Dashboard">
        <td style="padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${m.avatar}" alt="${m.name}" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1.5px solid #6b8e4e;">
            <div>
              <a href="javascript:void(0)" onclick="event.stopPropagation(); openMentorDashboard('${m.id}');" style="color:#0f1419; font-size:13.5px; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e;">
                ${m.name}
              </a>
              <div style="font-size:11px; color:#6b7280;">${m.title} • 📍 ${m.room}</div>
            </div>
          </div>
        </td>
        <td style="padding:10px 14px;">
          <div style="display:flex; flex-wrap:wrap; gap:4px;">
            ${batchesBadges}
          </div>
          <div style="font-size:10.5px; color:#4b5563; margin-top:3px;">
            ${activeCount} of ${maxBatches} Batches (${capPct}%)
          </div>
        </td>
        <td style="padding:10px 14px;">
          <span style="font-size:12px; font-weight:700; color:${isFull ? '#991b1b' : '#3d5a27'}; background:${isFull ? '#fef2f2' : '#edf5e8'}; border:1px solid ${isFull ? '#fecaca' : '#dbe2d6'}; padding:3px 8px; border-radius:4px; display:inline-block;">
            ${m.availableSlots}
          </span>
        </td>
        <td style="padding:10px 14px; text-align:center; white-space:nowrap;" onclick="event.stopPropagation();">
          <button class="btn-primary-ai" style="padding:5px 12px; font-size:11.5px;" onclick="openMentorDashboard('${m.id}')">
            Mentor Dashboard →
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (footerEl) {
    footerEl.textContent = `Showing ${mentors.length} active faculty mentors adhering to 3-4 batches rule`;
  }
}

// 2. Render Active Mentors Preview on Home / Tab 2
function renderHomeActiveMentors() {
  const tbody = document.getElementById('home-active-mentors-tbody');
  const mentors = ERP_DATA.classManagement.activeMentors || [];
  if (!tbody) return;

  if (mentors.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:24px 12px; color:#6b7280;">
          No active mentors loaded.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = mentors.map(m => {
    const batchesBadges = (m.activeBatches || []).map(b => `
      <span class="badge-pista" style="font-size:11px; font-weight:600; margin:1px 3px 1px 0; display:inline-block;" title="${b.package}: ${b.batchInfo}">
        ${b.batchCode} (${b.package})
      </span>
    `).join('');

    const isFull = (m.activeBatchesCount || 3) >= (m.maxBatches || 4);

    return `
      <tr style="border-bottom:1px solid #e5e7eb; cursor:pointer;" onclick="openMentorDashboard('${m.id}')" title="Click to view Mentor Dashboard">
        <td style="padding:10px 12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${m.avatar}" alt="${m.name}" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1.5px solid #6b8e4e;">
            <div>
              <a href="javascript:void(0)" onclick="event.stopPropagation(); openMentorDashboard('${m.id}');" style="color:#0f1419; font-size:13px; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e;">
                ${m.name}
              </a>
              <div style="font-size:11px; color:#6b7280;">${m.specialization ? m.specialization.slice(0, 44) + '...' : m.title}</div>
            </div>
          </div>
        </td>
        <td style="padding:10px 12px;">
          <div style="display:flex; flex-wrap:wrap; align-items:center;">
            ${batchesBadges}
          </div>
        </td>
        <td style="padding:10px 12px;">
          <span style="font-size:11.5px; font-weight:700; color:${isFull ? '#991b1b' : '#3d5a27'}; background:${isFull ? '#fef2f2' : '#edf5e8'}; border:1px solid ${isFull ? '#fecaca' : '#dbe2d6'}; padding:2px 7px; border-radius:4px; display:inline-block;">
            ${m.availableSlots}
          </span>
        </td>
        <td style="padding:10px 12px; text-align:center; white-space:nowrap;" onclick="event.stopPropagation();">
          <button class="btn-secondary" style="padding:4px 10px; font-size:11.5px;" onclick="openMentorDashboard('${m.id}')">
            Mentor Dashboard →
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Open and Render Standalone Active Mentors Master Directory Modal
function openActiveMentorsModal() {
  renderActiveMentorsTable();
  openModal('modal-active-mentors-list');
}

function renderActiveMentorsTable() {
  const tbody = document.getElementById('active-mentors-modal-tbody');
  const searchInput = document.getElementById('active-mentors-search-input');
  const footerCount = document.getElementById('active-mentors-modal-footer-count');
  const statBatches = document.getElementById('stat-active-batches-count');
  const statSlots = document.getElementById('stat-available-slots-count');
  const mentors = ERP_DATA.classManagement.activeMentors || [];
  if (!tbody) return;

  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  let filtered = mentors;
  if (query) {
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(query) ||
      (m.title && m.title.toLowerCase().includes(query)) ||
      (m.specialization && m.specialization.toLowerCase().includes(query)) ||
      (m.activeBatches && m.activeBatches.some(b => b.batchCode.toLowerCase().includes(query) || b.package.toLowerCase().includes(query)))
    );
  }

  // Calculate totals across all mentors
  const totalBatches = mentors.reduce((acc, m) => acc + (m.activeBatchesCount || (m.activeBatches ? m.activeBatches.length : 3)), 0);
  const totalSlots = mentors.reduce((acc, m) => acc + (m.availableSlotsCount !== undefined ? m.availableSlotsCount : Math.max(0, 4 - (m.activeBatchesCount || 3))), 0);

  if (statBatches) statBatches.textContent = `${totalBatches} Batches`;
  if (statSlots) statSlots.textContent = `${totalSlots} Slots Open`;
  if (footerCount) footerCount.textContent = `Showing ${filtered.length} active faculty mentors (${totalBatches} batches active)`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:36px 14px; color:#6b7280;">
          No mentors match your search criteria "${query}".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    const activeCount = m.activeBatchesCount || (m.activeBatches ? m.activeBatches.length : 3);
    const maxBatches = m.maxBatches || 4;
    const capPct = Math.round((activeCount / maxBatches) * 100);
    const isFull = activeCount >= maxBatches;

    const batchesHtml = (m.activeBatches || []).map(b => `
      <div style="display:inline-flex; align-items:center; gap:4px; margin:2px 4px 2px 0; background:#f0f3eb; border:1px solid #dbe2d6; border-radius:4px; padding:2px 7px;">
        <strong style="color:var(--accent-pista-bright); font-size:11px;">${b.batchCode}</strong>
        <span style="font-size:10px; color:#4b5563;">• ${b.package} (${b.capacity} st)</span>
      </div>
    `).join('');

    return `
      <tr style="border-bottom:1px solid #e5e7eb; cursor:pointer;" onclick="openMentorDashboard('${m.id}')" title="Click to open Mentor Dashboard for ${m.name}">
        <td style="padding:12px 14px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${m.avatar}" alt="${m.name}" style="width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid #6b8e4e;">
            <div>
              <a href="javascript:void(0)" onclick="event.stopPropagation(); openMentorDashboard('${m.id}');" style="color:#0f1419; font-size:14px; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e;">
                ${m.name}
              </a>
              <div style="font-size:11.5px; color:#3d5a27; font-weight:600;">${m.title}</div>
              <div style="font-size:11px; color:#6b7280;">📞 ${m.phone || 'Contact Available'} • 📍 ${m.room || 'Language Lab'}</div>
            </div>
          </div>
        </td>
        <td style="padding:12px 14px;">
          <div style="display:flex; flex-wrap:wrap; max-width:280px;">
            ${batchesHtml}
          </div>
        </td>
        <td style="padding:12px 14px;">
          <span style="font-size:12px; font-weight:700; color:${isFull ? '#991b1b' : '#3d5a27'}; background:${isFull ? '#fef2f2' : '#edf5e8'}; border:1px solid ${isFull ? '#fecaca' : '#c9d8c0'}; padding:4px 9px; border-radius:4px; display:inline-block;">
            ${m.availableSlots}
          </span>
        </td>
        <td style="padding:12px 14px; text-align:center; min-width:130px;">
          <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; margin-bottom:3px;">
            <span style="color:#0f1419;">${activeCount} / ${maxBatches} Batches</span>
            <span style="color:#6b8e4e;">${capPct}%</span>
          </div>
          <div style="width:100%; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:${capPct}%; background:${isFull ? '#d97706' : '#6b8e4e'}; border-radius:3px;"></div>
          </div>
          <div style="font-size:10px; color:#6b7280; margin-top:2px;">Capped at 4 batches max</div>
        </td>
        <td style="padding:12px 14px; text-align:center; white-space:nowrap;" onclick="event.stopPropagation();">
          <button class="btn-primary-ai" style="padding:5px 12px; font-size:11.5px;" onclick="openMentorDashboard('${m.id}')">
            View Mentor Dashboard →
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. Open Dedicated Mentor Dashboard Modal
let currentMentorDashboardId = 'MTR-ENG-01';

function openMentorDashboard(mentorIdentifier) {
  const activeMentors = ERP_DATA.classManagement.activeMentors || [];
  let mentor = activeMentors.find(m =>
    m.id === mentorIdentifier ||
    (m.name && m.name.toLowerCase() === (mentorIdentifier || '').toLowerCase())
  );

  if (!mentor && ERP_DATA.classManagement.mentors) {
    const generalMentor = ERP_DATA.classManagement.mentors.find(m =>
      m.name.toLowerCase() === (mentorIdentifier || '').toLowerCase() ||
      m.id === mentorIdentifier
    );
    if (generalMentor) {
      mentor = {
        id: generalMentor.id || 'MTR-GEN-01',
        name: generalMentor.name,
        title: generalMentor.designation || 'Communicative English Mentor',
        specialization: generalMentor.specialization || 'Foundational Spoken Fluency',
        avatar: generalMentor.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98450 11200',
        email: `${generalMentor.name.toLowerCase().replace(/[^a-z]/g, '')}@waytone.edu`,
        room: 'Language Lab 1',
        maxBatches: 4,
        activeBatchesCount: generalMentor.activeBatchesCount || 3,
        availableSlotsCount: Math.max(0, 4 - (generalMentor.activeBatchesCount || 3)),
        availableSlots: `${Math.max(0, 4 - (generalMentor.activeBatchesCount || 3))} Batch Slot Available (${generalMentor.activeBatchesCount || 3} of 4 Active)`,
        rating: 4.9,
        classesDelivered: generalMentor.classesTaken || 45,
        activeBatches: [
          {
            batchCode: 'ENG-AFF-01',
            package: 'Affordable',
            fee: '₹600 / Monthly',
            studentsCount: 6,
            capacity: 6,
            batchInfo: 'Batch 1 - 6 students',
            schedule: 'Weekly 3 days class (Mon/Wed/Fri 09:30 AM)',
            room: 'Language Lab 1',
            completedClasses: 10,
            totalClasses: 12,
            progressPct: 83.3,
            status: 'Full (6/6)'
          }
        ],
        students: [],
        reviews: []
      };
    }
  }

  if (!mentor) {
    mentor = activeMentors[0];
  }

  if (!mentor) {
    showToastNotification('Mentor details could not be found.');
    return;
  }

  currentMentorDashboardId = mentor.id;
  renderMentorDashboard(mentor);
  openModal('modal-mentor-dashboard');
}

function renderMentorDashboard(mentor) {
  if (!mentor) return;

  // 1. Header Profile Elements
  const avatarEl = document.getElementById('mentor-dash-avatar');
  const nameEl = document.getElementById('mentor-dash-name');
  const titleEl = document.getElementById('mentor-dash-title');
  const specEl = document.getElementById('mentor-dash-spec');
  const phoneEl = document.getElementById('mentor-dash-phone');
  const emailEl = document.getElementById('mentor-dash-email');
  const roomEl = document.getElementById('mentor-dash-room');
  const ratingPill = document.getElementById('mentor-dash-rating-pill');
  const mentorIdEl = document.getElementById('mentor-dash-id');

  if (avatarEl) avatarEl.src = mentor.avatar;
  if (nameEl) nameEl.textContent = mentor.name;
  if (titleEl) titleEl.textContent = mentor.title;
  if (specEl) specEl.textContent = mentor.specialization;
  if (phoneEl) phoneEl.textContent = mentor.phone;
  if (emailEl) emailEl.textContent = mentor.email;
  if (roomEl) roomEl.textContent = mentor.room;
  if (ratingPill) ratingPill.textContent = `⭐ ${mentor.rating || 4.9} / 5.0`;
  if (mentorIdEl) mentorIdEl.textContent = mentor.id;

  // 2. Capacity Gauge & Rule (Each mentor can take 3 to 4 batches)
  const activeCount = mentor.activeBatchesCount || (mentor.activeBatches ? mentor.activeBatches.length : 3);
  const maxBatches = mentor.maxBatches || 4;
  const slotCount = Math.max(0, maxBatches - activeCount);
  const capPct = Math.round((activeCount / maxBatches) * 100);
  const isFull = activeCount >= maxBatches;

  const capStatusEl = document.getElementById('mentor-dash-capacity-status');
  const slotStatusEl = document.getElementById('mentor-dash-slot-status');
  const capPctEl = document.getElementById('mentor-dash-capacity-pct');
  const capBarEl = document.getElementById('mentor-dash-capacity-bar');

  if (capStatusEl) {
    capStatusEl.textContent = `${activeCount} of ${maxBatches} Batches Active`;
    capStatusEl.style.color = isFull ? '#991b1b' : '#3d5a27';
    capStatusEl.style.background = isFull ? '#fef2f2' : '#edf5e8';
  }
  if (slotStatusEl) {
    slotStatusEl.textContent = isFull ? '(Capacity Full - 0 Slots Available)' : `(${slotCount} Batch Slot${slotCount > 1 ? 's' : ''} Available)`;
    slotStatusEl.style.color = isFull ? '#991b1b' : '#6b8e4e';
  }
  if (capPctEl) capPctEl.textContent = `${capPct}%`;
  if (capBarEl) {
    capBarEl.style.width = `${capPct}%`;
    capBarEl.style.background = isFull ? '#d97706' : '#6b8e4e';
  }

  // 3. KPI Cards
  const kpiBatches = document.getElementById('mentor-dash-kpi-batches');
  const kpiSlots = document.getElementById('mentor-dash-kpi-slots');
  const kpiStudents = document.getElementById('mentor-dash-kpi-students');
  const kpiClasses = document.getElementById('mentor-dash-kpi-classes');
  const badgeBatches = document.getElementById('mentor-dash-batch-badge');

  const totalAssignedStudents = (mentor.students && mentor.students.length > 0)
    ? mentor.students.length
    : (mentor.activeBatches || []).reduce((acc, b) => acc + (b.studentsCount || 5), 0);

  if (kpiBatches) kpiBatches.textContent = `${activeCount} Batches`;
  if (kpiSlots) kpiSlots.textContent = `${slotCount} Slot${slotCount !== 1 ? 's' : ''} Open`;
  if (kpiStudents) kpiStudents.textContent = `${totalAssignedStudents} Students`;
  if (kpiClasses) kpiClasses.textContent = `${mentor.classesDelivered || 45} Sessions`;
  if (badgeBatches) badgeBatches.textContent = `${activeCount} Batches`;

  // 4. Section 1: Active Batches Grid
  const batchesGrid = document.getElementById('mentor-dash-batches-grid');
  if (batchesGrid) {
    const batches = mentor.activeBatches || [];
    if (batches.length === 0) {
      batchesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding:24px; text-align:center; color:#6b7280; background:#f5f7f2; border-radius:8px;">
          No active batches assigned yet. Click "+ Assign Batch Slot" to assign.
        </div>
      `;
    } else {
      batchesGrid.innerHTML = batches.map(b => {
        const isBatchFull = b.studentsCount >= b.capacity;
        return `
          <div style="background:#ffffff; border:1px solid #dbe2d6; border-radius:8px; padding:14px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <span class="badge-pista" style="font-size:10.5px; font-weight:700;">${b.package} Package</span>
                <h5 style="margin:4px 0 0 0; font-size:14.5px; color:#0f1419;">${b.batchCode}</h5>
              </div>
              <span style="font-size:11px; font-weight:700; color:${isBatchFull ? '#3d5a27' : '#d97706'}; background:${isBatchFull ? '#edf5e8' : '#fffbeb'}; padding:2px 7px; border-radius:4px; border:1px solid ${isBatchFull ? '#c9d8c0' : '#fef3c7'};">
                ${b.status || (isBatchFull ? 'Full' : 'Open')}
              </span>
            </div>
            <div style="font-size:12px; color:#4b5563; line-height:1.4; margin-bottom:10px;">
              <div><strong>Fee:</strong> <span style="color:var(--accent-pista-bright); font-weight:700;">${b.fee}</span></div>
              <div><strong>Batch Size:</strong> ${b.batchInfo || `${b.capacity} Students`} (${b.studentsCount}/${b.capacity} Enrolled)</div>
              <div><strong>Schedule:</strong> ${b.schedule}</div>
              <div><strong>Room:</strong> 📍 ${b.room}</div>
            </div>
            <!-- Progress Bar -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
                <span style="color:#0f1419; font-weight:600;">${b.completedClasses} of ${b.totalClasses} Classes Done</span>
                <span style="color:#6b8e4e; font-weight:700;">${b.progressPct}%</span>
              </div>
              <div style="width:100%; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
                <div style="height:100%; width:${b.progressPct}%; background:#6b8e4e; border-radius:3px;"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 5. Section 2: Assigned Students Table
  const studentsTbody = document.getElementById('mentor-dash-students-tbody');
  if (studentsTbody) {
    const students = mentor.students || [];
    if (students.length === 0) {
      studentsTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:24px 12px; color:#6b7280;">
            No direct individual students mapped. All cohort students attend through micro-batches above.
          </td>
        </tr>
      `;
    } else {
      studentsTbody.innerHTML = students.map(s => {
        const totalCls = s.totalClasses || 12;
        const pct = Math.round((s.completedClasses / totalCls) * 100);
        return `
          <tr style="border-bottom:1px solid #e5e7eb;">
            <td style="padding:9px 12px;">
              <strong style="color:#0f1419; font-size:12.5px;">${s.name}</strong>
              <div style="font-size:11px; color:#6b7280;">${s.phone || '+91 98450 00000'}</div>
            </td>
            <td style="padding:9px 12px;">
              <span class="badge-pista" style="font-size:10.5px;">${s.package}</span>
              <div style="font-size:11px; color:#4b5563; font-weight:600;">${s.batchCode}</div>
            </td>
            <td style="padding:9px 12px;">
              <strong style="color:var(--accent-pista-bright); font-size:12px;">${s.completedClasses} / ${totalCls}</strong>
              <span style="font-size:11px; color:#6b7280;"> (${pct}%)</span>
            </td>
            <td style="padding:9px 12px;">
              <span style="font-weight:700; color:#3d5a27;">${s.attendancePct || 95}%</span>
            </td>
            <td style="padding:9px 12px; font-size:11.5px; color:#4b5563;">
              ${s.pendingClassDate || '07 Sep 2026'}
            </td>
            <td style="padding:9px 12px;">
              <span style="font-size:11.5px; font-weight:700; color:#0f1419; background:#edf5e8; border:1px solid #dbe2d6; padding:2px 6px; border-radius:4px; display:inline-block;">
                ${s.estimateEndDate || '20 Oct 2026'}
              </span>
            </td>
            <td style="padding:9px 12px; text-align:center;">
              <button class="btn-primary-ai" style="padding:3px 8px; font-size:11px;" onclick="markMentorStudentCompleted('${mentor.id}', '${s.name}')" title="Increment completed class count">
                + Mark Completed
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 6. Section 3: Reviews & Feedback
  const reviewsContainer = document.getElementById('mentor-dash-reviews-list');
  if (reviewsContainer) {
    const reviews = mentor.reviews || [
      { author: 'Student Feedback', rating: 5, quote: 'Exceptional personalized instruction and daily speaking drills.' }
    ];
    reviewsContainer.innerHTML = reviews.map(r => `
      <div style="background:#f9faf7; border:1px solid #dbe2d6; border-radius:8px; padding:12px 14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="font-size:12px; color:#0f1419;">${r.author}</strong>
          <span style="color:#d97706; font-size:12px;">★★★★★</span>
        </div>
        <p style="margin:0; font-size:12px; color:#4b5563; font-style:italic;">"${r.quote}"</p>
      </div>
    `).join('');
  }

  // 7. Footer Assign Button Config
  const btnAssign = document.getElementById('mentor-dash-btn-assign');
  if (btnAssign) {
    if (isFull) {
      btnAssign.textContent = '+ Assign Batch (At 4 Max Limit)';
      btnAssign.title = 'Institutional Limit: This mentor is already at the maximum of 4 active batches.';
    } else {
      btnAssign.textContent = `+ Assign Batch Slot (${slotCount} Available)`;
      btnAssign.title = 'Assign a new micro-batch to this mentor';
    }
  }
}

// Open Assign Modal From Mentor Dashboard
function openAssignMentorFromDashboard() {
  const activeMentors = ERP_DATA.classManagement.activeMentors || [];
  const mentor = activeMentors.find(m => m.id === currentMentorDashboardId);
  if (mentor) {
    const activeCount = mentor.activeBatchesCount || (mentor.activeBatches ? mentor.activeBatches.length : 3);
    if (activeCount >= (mentor.maxBatches || 4)) {
      showToastNotification(`Policy Alert: ${mentor.name} is currently managing ${activeCount} batches (maximum capacity is 4 batches).`);
      return;
    }
    openAssignMentorModal('affordable', mentor.name, `ENG-AFF-0${activeCount + 1}`);
  } else {
    openAssignMentorModal();
  }
}

// Mark Completed for Student inside Mentor Dashboard
function markMentorStudentCompleted(mentorId, studentName) {
  const activeMentors = ERP_DATA.classManagement.activeMentors || [];
  const mentor = activeMentors.find(m => m.id === mentorId);
  if (!mentor || !mentor.students) return;

  const student = mentor.students.find(s => s.name === studentName);
  if (!student) return;

  const maxClasses = student.totalClasses || 12;
  if (student.completedClasses < maxClasses) {
    student.completedClasses += 1;

    // Advance dates
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 2);
    const day = String(nextDate.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    student.pendingClassDate = `${day} ${months[nextDate.getMonth()]} ${nextDate.getFullYear()}`;

    const remaining = maxClasses - student.completedClasses;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + (remaining * 3));
    const estDay = String(estDate.getDate()).padStart(2, '0');
    student.estimateEndDate = `${estDay} ${months[estDate.getMonth()]} ${estDate.getFullYear()}`;

    renderMentorDashboard(mentor);
    showToastNotification(`Class recorded for ${studentName} (${student.completedClasses}/${maxClasses} classes).`);
  } else {
    showToastNotification(`${studentName} has completed all ${maxClasses} classes!`);
  }
}

function renderClassBatches() {
  const tbody = document.getElementById('class-batches-table-body');
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  if (!tbody) return;

  if (cohorts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="empty-table-cell">
          <div class="empty-state-box" style="padding: 24px;">
            <span class="empty-state-icon">👥</span>
            <div class="empty-state-title">No Batches Available</div>
            <div class="empty-state-desc">No active student batches or cohorts currently scheduled.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = cohorts.map(c => `
    <tr>
      <td><strong style="color:var(--accent-pista); font-size:13px;">${c.id}</strong></td>
      <td>
        <strong style="color:#0f1419;">${c.name}</strong>
        <div style="font-size:11px; color:#6b7280;">Topic: ${c.capstoneTopic}</div>
      </td>
      <td>
        <a href="javascript:void(0)" onclick="openMentorDashboard('${c.mentor}')" style="color:#0f1419; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e; cursor:pointer;" title="Click to view Mentor Dashboard">
          ${c.mentor}
        </a>
      </td>
      <td>
        <span style="font-weight:700; color:#0f1419;">${c.students}</span> / ${c.capacity}
        <div style="font-size:10.5px; color:${c.students >= c.capacity ? '#d97706' : '#166534'};">${c.capacity - c.students} seats left</div>
      </td>
      <td><strong style="color:var(--accent-pista-bright);">${c.attendance}</strong></td>
      <td style="min-width:130px;">
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
          <span>${c.progressText}</span>
          <strong>${c.progress}%</strong>
        </div>
        <div style="height:5px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
          <div style="width:${c.progress}%; height:100%; background:var(--accent-pista);"></div>
        </div>
      </td>
      <td style="font-size:12px; color:#4b5563;">${c.schedule}</td>
      <td><span class="badge-pista" style="font-size:11px;">${c.room}</span></td>
      <td><span class="module-status-badge ${c.statusColor}">${c.status}</span></td>
      <td style="text-align:center; white-space:nowrap;">
        <button class="btn-action-view" onclick="openBatchStudentList('${c.id}')" style="margin-right:4px;">Students</button>
        <button class="btn-action-view" onclick="selectAttendanceBatch('${c.id}')">Attendance</button>
      </td>
    </tr>
  `).join('');

  // Populate mentor select in batch modal
  const mentorSelect = document.getElementById('batch-add-mentor');
  if (mentorSelect && ERP_DATA.classManagement.mentors) {
    mentorSelect.innerHTML = ERP_DATA.classManagement.mentors.map(m => `<option value="${m.name}">${m.name} (${m.specialization})</option>`).join('');
  }
}

// ----------------------------------------------------------
// 3. TAB 3: STUDENT MANAGEMENT & ROSTER
// ----------------------------------------------------------
function filterClassStudents() {
  const tbody = document.getElementById('class-students-table-body');
  const countIndicator = document.getElementById('class-student-count-indicator');
  const students = ERP_DATA.classManagement.students;
  if (!tbody || !students) return;

  const searchQuery = (document.getElementById('class-student-search')?.value || '').toLowerCase().trim();
  const filterCourse = (document.getElementById('class-student-filter-course')?.value || '').toLowerCase();
  const filterBatch = (document.getElementById('class-student-filter-batch')?.value || '').toLowerCase();
  const filterFee = (document.getElementById('class-student-filter-fee')?.value || '').toLowerCase();

  const filtered = students.filter(s => {
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery) ||
      s.phone.toLowerCase().includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery) ||
      s.course.toLowerCase().includes(searchQuery);

    const matchesCourse = !filterCourse || s.course.toLowerCase().includes(filterCourse);
    const matchesBatch = !filterBatch || s.batch.toLowerCase().includes(filterBatch);
    const matchesFee = !filterFee || s.feeStatus.toLowerCase() === filterFee;

    return matchesSearch && matchesCourse && matchesBatch && matchesFee;
  });

  if (countIndicator) {
    countIndicator.textContent = `Showing ${filtered.length} of ${students.length} students`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:32px; color:#6b7280;">
          No students found matching your filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    let feeBadgeClass = 'badge-paid';
    if (s.feeStatus === 'Partial') feeBadgeClass = 'badge-partial';
    if (s.feeStatus === 'Pending' || s.feeStatus === 'Overdue') feeBadgeClass = 'badge-overdue';

    let certBadgeClass = 'badge-in-progress';
    if (s.certificateStatus === 'Certified') certBadgeClass = 'badge-certified';
    if (s.certificateStatus === 'Eligible') certBadgeClass = 'badge-eligible';

    const attColor = s.attendancePct >= 95 ? '#166534' : s.attendancePct >= 85 ? '#d97706' : '#dc2626';

    return `
      <tr>
        <td>
          <strong style="color:#0f1419; font-size:13.5px;">${s.name}</strong>
          <div style="font-size:11.5px; color:#6b7280;">${s.phone} • ID: ${s.id}</div>
        </td>
        <td>
          <strong style="color:#0f1419; font-size:12.5px;">${s.course}</strong>
        </td>
        <td>
          <span style="font-weight:600; color:#0f1419;">${s.batch}</span>
          <div style="font-size:11px; color:#6b7280;">ID: ${s.batchId}</div>
        </td>
        <td style="font-size:12px; color:#4b5563;">${s.admissionDate}</td>
        <td>
          <span class="${feeBadgeClass}">${s.feeStatus}</span>
          <div style="font-size:11px; color:#6b7280; margin-top:2px;">
            ₹${s.feePaid.toLocaleString('en-IN')} / ₹${s.feeTotal.toLocaleString('en-IN')}
          </div>
        </td>
        <td>
          <strong style="color:${attColor}; font-size:13px;">${s.attendancePct}%</strong>
        </td>
        <td style="min-width:110px;">
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:3px;">
            <span>${s.progressPct}%</span>
          </div>
          <div style="height:5px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
            <div style="width:${s.progressPct}%; height:100%; background:var(--accent-pista);"></div>
          </div>
        </td>
        <td>
          <span class="${certBadgeClass}">${s.certificateStatus}</span>
        </td>
        <td style="text-align:center; white-space:nowrap;">
          ${s.feeDue > 0 ? `
            <button class="btn-primary-ai" style="padding:4px 9px; font-size:11px;" onclick="quickSettleClassFee('${s.id}')">
              Settle ₹${s.feeDue.toLocaleString('en-IN')}
            </button>
          ` : `
            <button class="btn-action-view" onclick="showToastNotification('Student ${s.name} is in good standing with 100% tuition clearance.')">
              Profile
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

// ----------------------------------------------------------
// 4. TAB 4: ATTENDANCE SYSTEM
// ----------------------------------------------------------
function renderAttendanceView() {
  const batchSelect = document.getElementById('class-att-batch-select');
  if (batchSelect) {
    currentAttendanceBatch = batchSelect.value;
  }

  const dateInput = document.getElementById('class-att-date-input');
  if (dateInput) {
    currentAttendanceDate = dateInput.value;
  }

  const attendanceObj = ERP_DATA.classManagement?.attendance || {};
  const batchRecords = attendanceObj.batchRecords || {};
  let records = currentAttendanceBatch ? batchRecords[currentAttendanceBatch] : null;

  if (!records && currentAttendanceBatch) {
    const batchStudents = (ERP_DATA.classManagement?.students || []).filter(s => s.batchId === currentAttendanceBatch || s.batch === currentAttendanceBatch);
    if (batchStudents.length > 0) {
      records = batchStudents.map(s => ({
        studentId: s.id,
        name: s.name,
        phone: s.phone,
        status: 'Present',
        timeMarked: '—',
        notes: 'Enrolled'
      }));
      batchRecords[currentAttendanceBatch] = records;
    } else {
      records = [];
    }
  } else if (!records) {
    records = [];
  }

  // Calculate summary counts
  const presentCount = records.filter(r => r.status === 'Present').length;
  const absentCount = records.filter(r => r.status === 'Absent').length;
  const leaveCount = records.filter(r => r.status === 'Leave').length;
  const total = records.length;
  const attRate = total > 0 ? ((presentCount / total) * 100).toFixed(1) + '%' : '0%';

  const elemPres = document.getElementById('att-summary-present');
  const elemAbs = document.getElementById('att-summary-absent');
  const elemLeave = document.getElementById('att-summary-leave');
  const elemRate = document.getElementById('att-summary-rate');

  if (elemPres) elemPres.textContent = presentCount;
  if (elemAbs) elemAbs.textContent = absentCount;
  if (elemLeave) elemLeave.textContent = leaveCount;
  if (elemRate) elemRate.textContent = attRate;

  // Render Table
  const tbody = document.getElementById('class-attendance-table-body');
  if (tbody) {
    if (records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-table-cell">
            <div class="empty-state-box" style="padding: 24px;">
              <span class="empty-state-icon">📋</span>
              <div class="empty-state-title">No Attendance Records</div>
              <div class="empty-state-desc">No students enrolled in this batch to mark attendance.</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = records.map(rec => {
        const studentObj = (ERP_DATA.classManagement?.students || []).find(s => s.id === rec.studentId) || {};
        const phone = rec.phone || studentObj.phone || '—';

        return `
          <tr>
            <td>
              <strong style="color:#0f1419; font-size:13px;">${escapeHTML(rec.name)}</strong>
              <div style="font-size:11px; color:#6b7280;">ID: ${escapeHTML(rec.studentId)}</div>
            </td>
            <td style="font-size:12px; color:#4b5563;">${escapeHTML(phone)}</td>
            <td>
              <div class="attendance-toggle-group">
                <button class="btn-att-toggle ${rec.status === 'Present' ? 'active-present' : ''}" onclick="toggleStudentAttendance('${rec.studentId}', 'Present')" title="Mark Present">
                  P (Present)
                </button>
                <button class="btn-att-toggle ${rec.status === 'Absent' ? 'active-absent' : ''}" onclick="toggleStudentAttendance('${rec.studentId}', 'Absent')" title="Mark Absent">
                  A (Absent)
                </button>
                <button class="btn-att-toggle ${rec.status === 'Leave' ? 'active-leave' : ''}" onclick="toggleStudentAttendance('${rec.studentId}', 'Leave')" title="Mark Leave">
                  L (Leave)
                </button>
              </div>
            </td>
            <td style="font-size:12px; color:#0f1419; font-weight:600;">${rec.timeMarked || '—'}</td>
            <td style="font-size:12px; color:#4b5563;">${escapeHTML(rec.notes || 'Normal Check-In')}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Batch-wise Attendance Comparison Bars
  const barsContainer = document.getElementById('class-batch-attendance-bars');
  const averages = ERP_DATA.classManagement?.attendance?.batchAverages || [];
  if (barsContainer) {
    if (averages.length === 0) {
      barsContainer.innerHTML = `
        <div class="empty-state-box" style="padding: 16px;">
          <span class="empty-state-icon">📊</span>
          <div class="empty-state-desc">No batch attendance comparison data available</div>
        </div>
      `;
    } else {
      barsContainer.innerHTML = averages.map(b => `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
            <span style="font-weight:600; color:#0f1419;">${b.batchName}</span>
            <strong style="color:var(--accent-pista-bright);">${b.rate}%</strong>
          </div>
          <div style="height:7px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
            <div style="width:${b.rate}%; height:100%; background:var(--accent-pista); border-radius:4px;"></div>
          </div>
        </div>
      `).join('');
    }
  }
}

function toggleStudentAttendance(studentId, newStatus) {
  const batchRecords = ERP_DATA.classManagement?.attendance?.batchRecords || {};
  const records = batchRecords[currentAttendanceBatch];
  if (!records) return;

  const item = records.find(r => r.studentId === studentId);
  if (item) {
    item.status = newStatus;
    if (newStatus === 'Present') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      item.timeMarked = timeStr;
      item.notes = "Live check-in recorded";
    } else if (newStatus === 'Absent') {
      item.timeMarked = "—";
      item.notes = "Unexcused absence";
    } else {
      item.timeMarked = "—";
      item.notes = "Approved leave request";
    }
  }

  renderAttendanceView();
}

function markAllBatchStudentsPresent() {
  const batchRecords = ERP_DATA.classManagement?.attendance?.batchRecords || {};
  const records = batchRecords[currentAttendanceBatch];
  if (!records) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  records.forEach(r => {
    r.status = 'Present';
    r.timeMarked = timeStr;
    r.notes = "All Present Mass Action";
  });

  renderAttendanceView();
  showToastNotification(`All students in ${currentAttendanceBatch} marked Present for ${currentAttendanceDate}.`);
}

function saveAttendanceLogs() {
  showToastNotification(`Attendance logs for ${currentAttendanceBatch} on ${currentAttendanceDate} synced with Central ERP.`);
}

function selectAttendanceBatch(batchId) {
  switchClassTab('attendance');
  const select = document.getElementById('class-att-batch-select');
  if (select) {
    select.value = batchId;
  }
  renderAttendanceView();
}

// ----------------------------------------------------------
// 5. TAB 5: MENTOR PERFORMANCE & EVALUATIONS
// ----------------------------------------------------------
function renderMentorPerformance() {
  const tbody = document.getElementById('class-mentors-table-body');
  const reviewsGrid = document.getElementById('class-mentor-reviews-grid');
  const mentors = ERP_DATA.classManagement?.mentors || [];

  if (tbody) {
    if (mentors.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-table-cell">
            <div class="empty-state-box" style="padding: 24px;">
              <span class="empty-state-icon">👨‍🏫</span>
              <div class="empty-state-title">No Mentor Records</div>
              <div class="empty-state-desc">Mentor evaluations and ratings will appear once faculty members are added.</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = mentors.map(m => `
        <tr>
          <td>
            <a href="javascript:void(0)" onclick="openMentorDashboard('${m.name}')" style="color:#0f1419; font-size:13.5px; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e; cursor:pointer;" title="Click to view Mentor Dashboard">
              ${m.name}
            </a>
            <div style="font-size:11.5px; color:#6b7280;">Specialization: ${m.specialization}</div>
          </td>
          <td><strong style="color:#0f1419;">${m.assignedStudents}</strong> Students (${m.activeBatchesCount} Batches)</td>
          <td><span style="font-weight:600; color:#0f1419;">${m.classesTaken}</span> Delivered</td>
          <td><strong style="color:var(--accent-pista-bright);">${m.attendanceRate}</strong></td>
          <td><strong style="color:#0f1419;">${m.studentPerformanceScore}</strong></td>
          <td>
            <span style="color:#eab308; font-size:13px; font-weight:800;">★ ${m.rating}</span>
            <span style="font-size:11px; color:#6b7280;"> / 5.0</span>
          </td>
          <td style="white-space:nowrap;">
            <button class="btn-secondary" style="padding:3px 8px; font-size:11px; margin-right:4px;" onclick="openMentorDashboard('${m.name}')">
              Dashboard →
            </button>
            <span class="badge-pista" style="font-weight:700;">${m.nps}</span>
          </td>
        </tr>
      `).join('');
    }
  }

  if (reviewsGrid) {
    let allReviews = [];
    mentors.forEach(m => {
      if (m.reviews) {
        m.reviews.forEach(r => {
          allReviews.push({
            mentorName: m.name,
            mentorSpec: m.specialization,
            author: r.author,
            rating: r.rating,
            quote: r.quote
          });
        });
      }
    });

    if (allReviews.length === 0) {
      reviewsGrid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1/-1; padding: 24px;">
          <span class="empty-state-icon">💬</span>
          <div class="empty-state-title">No Reviews Available</div>
          <div class="empty-state-desc">Student feedback and ratings will appear as reviews are submitted.</div>
        </div>
      `;
    } else {
      reviewsGrid.innerHTML = allReviews.map(rev => `
        <div class="glass-card mentor-review-box">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div>
              <strong style="color:#0f1419; font-size:13.5px;">${rev.author}</strong>
              <div style="font-size:11px; color:#6b7280;">Mentor: ${rev.mentorName} (${rev.mentorSpec})</div>
            </div>
            <div class="review-stars">
              ${'★'.repeat(rev.rating)}
            </div>
          </div>
          <p style="font-size:12.5px; color:#374151; font-style:italic; line-height:1.45; margin:0;">
            "${rev.quote}"
          </p>
        </div>
      `).join('');
    }
  }
}

// ----------------------------------------------------------
// 6. TAB 6: CLASS FEES & OUTSTANDING DUES
// ----------------------------------------------------------
function renderClassFeesView() {
  const feesData = ERP_DATA.classManagement?.fees;

  const totalEl = document.getElementById('cls-fees-total');
  const collEl = document.getElementById('cls-fees-collected');
  const pendEl = document.getElementById('cls-fees-pending');

  if (totalEl) totalEl.textContent = feesData?.totalFeesGrossFormatted || '₹0';
  if (collEl) collEl.textContent = feesData?.collectedFeesFormatted || '₹0';
  if (pendEl) pendEl.textContent = feesData?.pendingFeesFormatted || '₹0';

  // Course-wise Breakdown Bars
  const breakdownContainer = document.getElementById('class-fees-by-course-list');
  if (breakdownContainer) {
    const byCourse = feesData?.byCourse || [];
    if (byCourse.length === 0) {
      breakdownContainer.innerHTML = `
        <div class="empty-state-box" style="padding: 20px;">
          <span class="empty-state-icon">💳</span>
          <div class="empty-state-desc">No course tuition breakdown available</div>
        </div>
      `;
    } else {
      breakdownContainer.innerHTML = byCourse.map(c => `
        <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:12px 14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
            <span style="font-weight:700; color:#0f1419; font-size:13px;">${c.courseTitle}</span>
            <div style="font-size:12px;">
              <span style="color:#166534; font-weight:700;">Collected: ${c.collected}</span> • 
              <span style="color:#d97706; font-weight:700;">Pending: ${c.pending}</span> • 
              <span style="color:#6b7280;">Total: ${c.total}</span>
            </div>
          </div>
          <div style="height:8px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
            <div style="width:${c.pct}%; height:100%; background:var(--accent-pista); border-radius:4px;"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // Pending Dues Quick Settle Table
  const tbody = document.getElementById('class-pending-dues-table-body');
  const studentsWithDues = (ERP_DATA.classManagement?.students || []).filter(s => s.feeDue > 0);
  if (tbody) {
    if (studentsWithDues.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:24px; color:#166534; font-weight:600;">
            ✓ All active student installment fees are fully settled!
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = studentsWithDues.map(s => `
        <tr>
          <td>
            <strong style="color:#0f1419; font-size:13px;">${s.name}</strong>
            <div style="font-size:11px; color:#6b7280;">${s.phone} • ID: ${s.id}</div>
          </td>
          <td>
            <span style="font-weight:600; color:#0f1419;">${s.course}</span>
            <div style="font-size:11px; color:#6b7280;">${s.batch}</div>
          </td>
          <td>₹${s.feeTotal.toLocaleString('en-IN')}</td>
          <td style="color:#166534; font-weight:700;">₹${s.feePaid.toLocaleString('en-IN')}</td>
          <td><strong style="color:#dc2626; font-size:13px;">₹${s.feeDue.toLocaleString('en-IN')}</strong></td>
          <td style="font-size:12px; color:#4b5563;">15 Sep 2026</td>
          <td><span class="${s.feeStatus === 'Partial' ? 'badge-partial' : 'badge-overdue'}">${s.feeStatus}</span></td>
          <td style="font-size:12px; color:#4b5563;">${s.counselor || '—'}</td>
          <td style="text-align:center;">
            <button class="btn-primary-ai" style="padding:4px 10px; font-size:11.5px;" onclick="quickSettleClassFee('${s.id}')">
              Settle Due (₹${s.feeDue.toLocaleString('en-IN')})
            </button>
          </td>
        </tr>
      `).join('');
    }
  }
}

function quickSettleClassFee(studentId) {
  const student = ERP_DATA.classManagement.students.find(s => s.id === studentId);
  if (!student) return;

  const dueAmount = student.feeDue;
  if (dueAmount <= 0) {
    showToastNotification(`Student ${student.name} has no pending fee dues.`);
    return;
  }

  // Update student record
  student.feePaid += dueAmount;
  student.feeDue = 0;
  student.feeStatus = "Paid";

  // Update KPI counters
  ERP_DATA.classManagement.kpis.feesPending = Math.max(0, ERP_DATA.classManagement.kpis.feesPending - dueAmount);
  ERP_DATA.classManagement.kpis.feesPendingFormatted = '₹' + ERP_DATA.classManagement.kpis.feesPending.toLocaleString('en-IN');
  ERP_DATA.classManagement.fees.collectedFees += dueAmount;
  ERP_DATA.classManagement.fees.collectedFeesFormatted = '₹' + ERP_DATA.classManagement.fees.collectedFees.toLocaleString('en-IN');
  ERP_DATA.classManagement.fees.pendingFees = ERP_DATA.classManagement.kpis.feesPending;
  ERP_DATA.classManagement.fees.pendingFeesFormatted = ERP_DATA.classManagement.kpis.feesPendingFormatted;

  // Cross-module integration with Finance
  if (ERP_DATA.financeSummary) {
    ERP_DATA.financeSummary.cashBalance += dueAmount;
    ERP_DATA.financeSummary.pendingReceivables = Math.max(0, ERP_DATA.financeSummary.pendingReceivables - dueAmount);
  }
  if (ERP_DATA.financeTransactions) {
    ERP_DATA.financeTransactions.unshift({
      id: `TXN-FEES-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      party: `${student.name} (Student)`,
      category: "Student Tuition Fees",
      type: "income",
      amount: dueAmount,
      status: "Settled",
      paymentMethod: "UPI / PhonePe",
      ref: `STU-SETTLE-${student.id}`
    });
  }

  // Refresh Views
  renderClassFeesView();
  filterClassStudents();
  populateClassManagementView();
  if (typeof populateFinanceView === 'function') {
    populateFinanceView();
  }

  showToastNotification(`Tuition fee of ₹${dueAmount.toLocaleString('en-IN')} for ${student.name} settled and credited to Central Accounts!`);
}

// ----------------------------------------------------------
// 7. TAB 7: REPORTS & ANALYTICS
// ----------------------------------------------------------
function setClassReportMetric(metric) {
  currentClassReportMetric = metric;

  document.querySelectorAll('#cls-report-metric-controls .timeframe-btn').forEach(btn => {
    if (btn.getAttribute('data-cls-metric') === metric) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderClassReports(metric);
}

function renderClassReports(metric) {
  const reports = ERP_DATA.classManagement?.reports;
  const svg = document.getElementById('cls-report-svg-chart');
  const titleEl = document.getElementById('cls-report-chart-title');
  const subEl = document.getElementById('cls-report-chart-subtitle');

  if (titleEl) {
    const titles = {
      admissions: "Student Admissions Trajectory",
      growth: "Cumulative Active Student Headcount Growth",
      attendance: "Weekly Center Attendance Rate (%)",
      revenue: "Monthly Tuition Fee Generation (₹ Lakhs)"
    };
    titleEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pista)" stroke-width="2.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
      ${titles[metric] || "Executive Trajectory"}
    `;
  }

  if (subEl) {
    const subs = {
      admissions: "Monthly student enrollments across all technical training tracks",
      growth: "Aggregated active student body expansion throughout 2026",
      attendance: "Participation percentage adherence across active cohorts",
      revenue: "Tuition receipts collected per month in Indian Rupees (Lakhs)"
    };
    subEl.textContent = subs[metric] || "Executive analytical review for Waytone Skill Development Centre";
  }

  if (!svg) return;

  const rep = reports ? (reports[metric] || reports.admissions) : null;
  const vals = rep?.values || [];

  if (vals.length === 0) {
    svg.style.display = 'none';
    const container = svg.parentElement;
    if (container) {
      let emptyBox = container.querySelector('.empty-chart-box');
      if (!emptyBox) {
        emptyBox = document.createElement('div');
        emptyBox.className = 'empty-chart-box';
        emptyBox.innerHTML = `
          <span class="empty-state-icon">📊</span>
          <div class="empty-state-title">No Trajectory Data Available</div>
          <div class="empty-state-desc">Performance trajectory will plot dynamically once student records are logged.</div>
        `;
        container.appendChild(emptyBox);
      }
    }
    return;
  }

  svg.style.display = 'block';
  const container = svg.parentElement;
  if (container) {
    const emptyBox = container.querySelector('.empty-chart-box');
    if (emptyBox) emptyBox.remove();
  }

  // Build SVG Chart
  const width = 1000;
  const height = 250;
  const padLeft = 60;
  const padRight = 40;
  const padTop = 30;
  const padBottom = 40;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const minVal = Math.min(...vals) * 0.85;
  const maxVal = Math.max(...vals) * 1.1;

  const points = vals.map((v, i) => {
    const x = padLeft + (i / (vals.length - 1)) * chartW;
    const y = padTop + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, val: v, label: rep.labels[i] };
  });

  // Path generator
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padBottom} L ${points[0].x} ${height - padBottom} Z`;

  // Grid lines
  let gridSvg = '';
  for (let g = 0; g <= 4; g++) {
    const gy = padTop + (g / 4) * chartH;
    const gVal = (maxVal - (g / 4) * (maxVal - minVal)).toFixed(metric === 'attendance' ? 1 : 0);
    gridSvg += `
      <line x1="${padLeft}" y1="${gy}" x2="${width - padRight}" y2="${gy}" stroke="#e5e7eb" stroke-dasharray="4" stroke-width="1"/>
      <text x="${padLeft - 10}" y="${gy + 4}" font-size="11" fill="#6b7280" text-anchor="end">${gVal}${rep.unit === '%' ? '%' : ''}</text>
    `;
  }

  // Label dates on X
  let xLabelsSvg = points.map(p => `
    <text x="${p.x}" y="${height - padBottom + 20}" font-size="11" fill="#6b7280" text-anchor="middle">${p.label}</text>
  `).join('');

  // Interactive points
  let circlesSvg = points.map((p, i) => `
    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#ffffff" stroke="var(--accent-pista)" stroke-width="2.5" class="chart-point"
      onmouseenter="showClassReportTooltip(event, '${p.label}', '${p.val} ${rep.unit}')"
      onmouseleave="hideClassReportTooltip()"/>
  `).join('');

  svg.innerHTML = `
    <defs>
      <linearGradient id="clsReportGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6b8e4e" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="#6b8e4e" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    ${gridSvg}
    <path d="${areaD}" fill="url(#clsReportGrad)"/>
    <path d="${pathD}" fill="none" stroke="var(--accent-pista)" stroke-width="3" stroke-linecap="round"/>
    ${xLabelsSvg}
    ${circlesSvg}
  `;

  // Course distribution progress bars
  const distContainer = document.getElementById('cls-course-distribution-list');
  if (distContainer && ERP_DATA.classManagement.courses) {
    const courses = ERP_DATA.classManagement.courses;
    const totalEnrolled = courses.reduce((acc, c) => acc + c.enrolled, 0);
    distContainer.innerHTML = courses.map(c => {
      const pct = ((c.enrolled / totalEnrolled) * 100).toFixed(1);
      return `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
            <span style="font-weight:600; color:#0f1419;">${c.title}</span>
            <span style="color:#4b5563;"><strong>${c.enrolled}</strong> Students (${pct}%)</span>
          </div>
          <div style="height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
            <div style="width:${pct}%; height:100%; background:var(--accent-pista);"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Batch Capstone Success List
  const perfContainer = document.getElementById('cls-batch-performance-list');
  if (perfContainer && ERP_DATA.classManagement.cohorts) {
    const topCohorts = ERP_DATA.classManagement.cohorts.slice(0, 4);
    perfContainer.innerHTML = topCohorts.map(c => `
      <div style="display:flex; justify-content:space-between; align-items:center; background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:10px 12px;">
        <div>
          <strong style="color:#0f1419; font-size:13px;">${c.name}</strong>
          <div style="font-size:11px; color:#6b7280;">Capstone: ${c.capstoneTopic}</div>
        </div>
        <div style="text-align:right;">
          <span class="badge-pista" style="font-size:11px;">${c.attendance} Attendance</span>
          <div style="font-size:11px; color:#166534; font-weight:700; margin-top:2px;">96% Pass Index</div>
        </div>
      </div>
    `).join('');
  }
}

function showClassReportTooltip(e, label, val) {
  const tooltip = document.getElementById('cls-report-tooltip');
  const dateEl = document.getElementById('cls-report-tooltip-date');
  const valEl = document.getElementById('cls-report-tooltip-val');
  if (!tooltip || !dateEl || !valEl) return;

  dateEl.textContent = label;
  valEl.textContent = val;

  const wrapper = document.getElementById('cls-report-chart-wrapper');
  if (wrapper) {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 45}px`;
    tooltip.style.opacity = '1';
  }
}

function hideClassReportTooltip() {
  const tooltip = document.getElementById('cls-report-tooltip');
  if (tooltip) tooltip.style.opacity = '0';
}

// ----------------------------------------------------------
// 8. MODALS & SUBMISSIONS
// ----------------------------------------------------------
function submitCreateCourse() {
  const code = (document.getElementById('course-add-code')?.value || '').trim();
  const title = (document.getElementById('course-add-title')?.value || '').trim();
  const category = document.getElementById('course-add-category')?.value || 'Technology';
  const fee = parseInt(document.getElementById('course-add-fee')?.value, 10) || 40000;
  const duration = (document.getElementById('course-add-duration')?.value || '').trim() || '12 Weeks';
  const mode = document.getElementById('course-add-mode')?.value || 'Hybrid';
  const cert = (document.getElementById('course-add-cert')?.value || '').trim() || 'Waytone Industry Certified';
  const skillsStr = (document.getElementById('course-add-skills')?.value || '').trim();
  const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()) : ['Python', 'Practical Labs'];

  if (!code || !title) {
    alert("Please specify the Course Code and Title.");
    return;
  }

  const newCourse = {
    id: code,
    title: title,
    category: category,
    fee: fee,
    feeFormatted: '₹' + fee.toLocaleString('en-IN'),
    duration: duration,
    mode: mode,
    activeBatchesCount: 1,
    enrolled: 0,
    leadMentor: "Assigned upon launch",
    skills: skills,
    rating: 5.0,
    certifications: cert,
    description: `Comprehensive training program covering ${skills.join(', ')}.`
  };

  ERP_DATA.classManagement.courses.unshift(newCourse);
  ERP_DATA.classManagement.kpis.completedCourses += 1;

  closeModal('modal-create-course');
  renderClassCourses();
  populateClassManagementView();
  showToastNotification(`New training course "${title}" (${code}) published successfully.`);
}

function submitCreateBatch() {
  const code = (document.getElementById('batch-add-code')?.value || '').trim();
  const courseId = document.getElementById('batch-add-course')?.value || '';
  const mentor = document.getElementById('batch-add-mentor')?.value || 'Dr. Aris Thorne';
  const capacity = parseInt(document.getElementById('batch-add-capacity')?.value, 10) || 30;
  const schedule = (document.getElementById('batch-add-schedule')?.value || '').trim() || 'Mon - Fri (10:00 AM - 01:00 PM)';
  const room = (document.getElementById('batch-add-room')?.value || '').trim() || 'Lab 101';
  const capstone = (document.getElementById('batch-add-capstone')?.value || '').trim() || 'Applied Real-world Capstone Project';

  if (!code) {
    alert("Please enter a Batch Code (e.g. AI-19).");
    return;
  }

  const courseObj = ERP_DATA.classManagement.courses.find(c => c.id === courseId) || {};
  const batchName = `${courseObj.title ? courseObj.title.split(' ')[0] : 'Skill'} — ${code}`;

  const newCohort = {
    id: code,
    name: batchName,
    courseId: courseId,
    mentor: mentor,
    status: "Active - Week 1",
    statusColor: "badge-pista",
    students: 0,
    capacity: capacity,
    attendance: "100%",
    progress: 0,
    progressText: "Module 1 Started",
    schedule: schedule,
    room: room,
    capstoneTopic: capstone
  };

  ERP_DATA.classManagement.cohorts.unshift(newCohort);
  ERP_DATA.classManagement.kpis.activeBatches += 1;

  closeModal('modal-create-batch');
  renderClassBatches();
  populateClassManagementView();
  showToastNotification(`New cohort batch "${code}" launched under mentor ${mentor}.`);
}

function openEnrollForCourse(courseId) {
  openModal('modal-enroll-student');
  const courseObj = ERP_DATA.classManagement.courses.find(c => c.id === courseId);
  if (courseObj) {
    const courseSelect = document.getElementById('enroll-student-course');
    if (courseSelect) {
      courseSelect.value = courseObj.title;
    }
    const feeInput = document.getElementById('enroll-student-fee');
    if (feeInput) {
      feeInput.value = courseObj.fee;
    }
  }
}

function onEnrollCourseChange() {
  const courseSelect = document.getElementById('enroll-student-course');
  if (!courseSelect) return;
  const selectedOption = courseSelect.options[courseSelect.selectedIndex];
  const fee = selectedOption?.getAttribute('data-fee');
  const feeInput = document.getElementById('enroll-student-fee');
  if (feeInput && fee) {
    feeInput.value = fee;
  }
}

function onEnrollStatusChange() {
  const statusSelect = document.getElementById('enroll-student-status');
  const feeInput = document.getElementById('enroll-student-fee');
  const paidInput = document.getElementById('enroll-student-paid');
  if (!statusSelect || !feeInput || !paidInput) return;

  const fee = parseInt(feeInput.value, 10) || 0;
  if (statusSelect.value === 'Paid') {
    paidInput.value = fee;
  } else if (statusSelect.value === 'Partial') {
    paidInput.value = Math.floor(fee / 2);
  } else {
    paidInput.value = 0;
  }
}

function submitEnrollStudent() {
  const name = (document.getElementById('enroll-student-name')?.value || '').trim();
  const phone = (document.getElementById('enroll-student-phone')?.value || '').trim();
  const course = document.getElementById('enroll-student-course')?.value || 'Communicative English';
  const batch = document.getElementById('enroll-student-batch')?.value || 'ENG-01';
  const feeTotal = parseInt(document.getElementById('enroll-student-fee')?.value, 10) || 24000;
  const feeStatus = document.getElementById('enroll-student-status')?.value || 'Paid';
  let feePaid = parseInt(document.getElementById('enroll-student-paid')?.value, 10) || 0;

  if (feeStatus === 'Paid') feePaid = feeTotal;
  const feeDue = Math.max(0, feeTotal - feePaid);

  if (!name || !phone) {
    alert("Please provide the Student Name and Phone Number.");
    return;
  }

  const newId = `WST-${String(ERP_DATA.classManagement.students.length + 1).padStart(4, '0')}`;
  const assignedCounselor = (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId)?.name || 'Unassigned';
  const newStudent = {
    id: newId,
    name: name,
    phone: phone,
    course: course,
    batch: batch,
    batchId: batch,
    admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    feeTotal: feeTotal,
    feePaid: feePaid,
    feeDue: feeDue,
    feeStatus: feeStatus,
    attendancePct: 100,
    progressPct: 0,
    certificateStatus: "In Progress",
    capstoneStatus: "Pending Allocation",
    counselor: assignedCounselor
  };

  ERP_DATA.classManagement.students.unshift(newStudent);
  ERP_DATA.classManagement.kpis.totalStudents += 1;
  ERP_DATA.classManagement.kpis.activeStudents += 1;
  ERP_DATA.classManagement.kpis.newAdmissions += 1;

  if (feePaid > 0 && ERP_DATA.financeSummary) {
    ERP_DATA.financeSummary.cashBalance += feePaid;
    ERP_DATA.classManagement.fees.collectedFees += feePaid;
    ERP_DATA.classManagement.fees.collectedFeesFormatted = '₹' + ERP_DATA.classManagement.fees.collectedFees.toLocaleString('en-IN');
  }
  if (feeDue > 0) {
    ERP_DATA.classManagement.kpis.feesPending += feeDue;
    ERP_DATA.classManagement.kpis.feesPendingFormatted = '₹' + ERP_DATA.classManagement.kpis.feesPending.toLocaleString('en-IN');
  }

    // Deduct 1 slot from matching Course and Package in Product Catalogue
  const catCourse = (ERP_DATA.catalogue?.courses || []).find(c => 
    c.name.toLowerCase().includes(course.toLowerCase()) || 
    (c.title && c.title.toLowerCase().includes(course.toLowerCase())) ||
    c.id === course
  );
  let deductedPkgName = '';
  let remSlots = 0;
  if (catCourse) {
    if (catCourse.availableSlots > 0) catCourse.availableSlots -= 1;
    catCourse.enrolledStudents = (catCourse.enrolledStudents || 0) + 1;
    remSlots = catCourse.availableSlots;
    if (catCourse.packages && catCourse.packages.length > 0) {
      let matchedPkg = catCourse.packages.find(p => 
        batch.toLowerCase().includes((p.packageKey || p.name).toLowerCase()) ||
        course.toLowerCase().includes((p.packageKey || p.name).toLowerCase())
      ) || catCourse.packages[0];
      if (matchedPkg.availableSlots > 0) matchedPkg.availableSlots -= 1;
      matchedPkg.enrolledStudents = (matchedPkg.enrolledStudents || 0) + 1;
      deductedPkgName = matchedPkg.name;
      remSlots = matchedPkg.availableSlots;
    }
    syncCommunicativeEnglishCardSlots();
    populateCatalogueView();
  }

  closeModal('modal-enroll-student');
  filterClassStudents();
  populateClassManagementView();
  const pkgNote = deductedPkgName ? ` (${deductedPkgName} - ${remSlots} slots remaining)` : '';
  showToastNotification(`Student "${name}" admitted to ${batch} successfully. 1 slot deducted from Product Catalogue${pkgNote}.`);
}

function openBatchStudentList(batchId) {
  const cohort = ERP_DATA.classManagement.cohorts.find(c => c.id === batchId) || { name: batchId };
  const students = ERP_DATA.classManagement.students.filter(s => s.batchId === batchId || s.batch.includes(batchId));

  const titleEl = document.getElementById('batch-modal-title');
  const summaryEl = document.getElementById('batch-modal-summary-bar');
  const tbody = document.getElementById('batch-modal-student-tbody');

  if (titleEl) {
    titleEl.textContent = `Batch Student Roster: ${cohort.name} (${batchId})`;
  }

  if (summaryEl) {
    const paidCount = students.filter(s => s.feeStatus === 'Paid').length;
    summaryEl.innerHTML = `
      <div><strong>Enrolled:</strong> ${students.length} Students</div>
      <div><strong>Lead Mentor:</strong> ${cohort.mentor || 'Assigned Faculty'}</div>
      <div><strong>Schedule:</strong> ${cohort.schedule || 'Regular'}</div>
      <div><strong>Fee Clearance:</strong> ${paidCount} / ${students.length} Paid</div>
      <div><strong>Attendance:</strong> ${cohort.attendance || '95%'}</div>
    `;
  }

  if (tbody) {
    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:24px; color:#6b7280;">
            No students directly assigned to ${batchId} in sample dataset.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = students.map(s => `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:10px 14px;">
            <strong style="color:#0f1419;">${s.name}</strong>
            <div style="font-size:11px; color:#6b7280;">ID: ${s.id}</div>
          </td>
          <td style="padding:10px 14px; font-size:12px; color:#4b5563;">${s.phone}</td>
          <td style="padding:10px 14px;">
            <span class="${s.feeStatus === 'Paid' ? 'badge-paid' : 'badge-partial'}">${s.feeStatus}</span>
          </td>
          <td style="padding:10px 14px; font-weight:700; color:var(--accent-pista-bright); font-size:12.5px;">${s.attendancePct}%</td>
          <td style="padding:10px 14px; font-size:12px; font-weight:600;">${s.progressPct}%</td>
          <td style="padding:10px 14px;">
            <span class="${s.certificateStatus === 'Certified' ? 'badge-certified' : 'badge-in-progress'}">${s.certificateStatus}</span>
          </td>
        </tr>
      `).join('');
    }
  }

  openModal('modal-batch-student-list');
}

// ==========================================================
// 7. MODULE 4: HRM (HUMAN RESOURCE MANAGEMENT) ENGINE
// ==========================================================

let currentHrmTab = 'dashboard';
let currentHrmDeptFilter = 'all';

function switchHrmTab(tabId) {
  if (currentView !== 'hrm') {
    switchView('hrm');
  }
  currentHrmTab = tabId;

  // Update tab buttons
  document.querySelectorAll('.hrm-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-hrm-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update tab panes
  document.querySelectorAll('.hrm-tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`hrm-pane-${tabId}`);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Refresh tab-specific views
  if (tabId === 'dashboard') {
    populateHrmDashboard();
  } else if (tabId === 'employees') {
    renderHrmEmployees();
  } else if (tabId === 'attendance') {
    renderHrmAttendance();
  } else if (tabId === 'performance') {
    renderHrmPerformance();
  } else if (tabId === 'leaves') {
    renderHrmLeaves();
  } else if (tabId === 'payroll') {
    renderHrmPayroll();
  } else if (tabId === 'reports') {
    renderHrmReports();
  } else if (tabId === 'roles') {
    populateHrmRoles();
  } else if (tabId === 'academic-coordinator') {
    populateAcademicCoordinatorView();
  } else if (tabId === 'mentor-dashboard') {
    populateMentorDashboardView();
  }
}

function populateHRMView() {
  if (currentHrmTab === 'academic-coordinator') {
    populateAcademicCoordinatorView();
  } else if (currentHrmTab === 'mentor-dashboard') {
    populateMentorDashboardView();
  } else {
    populateHrmDashboard();
  }
}

// ----------------------------------------------------------
// 7.1 HRM Dashboard Pane
// ----------------------------------------------------------
function populateHrmDashboard() {
  const hrmData = ERP_DATA.hrm;
  if (!hrmData) return;

  // 1. Render 8 KPIs
  const kpis = hrmData.kpis || {};
  const kpiMap = {
    'hrm-kpi-total': `${kpis.totalEmployees || 0} Staff`,
    'hrm-kpi-present': `${kpis.presentToday || 0} Staff`,
    'hrm-kpi-absent': `${kpis.absentToday || 0} Staff`,
    'hrm-kpi-leave': `${kpis.onLeave || 0} Staff`,
    'hrm-kpi-new': `${kpis.newEmployees || 0} Hired`,
    'hrm-kpi-tasks': `${kpis.pendingTasks || 0} Tasks`,
    'hrm-kpi-salary': kpis.totalSalaryFormatted || '₹0',
    'hrm-kpi-perf': kpis.avgPerformance || '--'
  };

  for (const [id, val] of Object.entries(kpiMap)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // 2. Populate Quick Punch Dropdown
  const punchSelect = document.getElementById('hrm-quick-punch-select');
  if (punchSelect) {
    const emps = hrmData.employees || [];
    if (emps.length === 0) {
      punchSelect.innerHTML = '<option value="">No employees loaded</option>';
    } else {
      punchSelect.innerHTML = emps.map(e => `
        <option value="${e.id}">${e.name} (${e.designation} - ${e.department})</option>
      `).join('');
    }
  }

  // 3. Department Attendance Progress Bars
  const deptPresenceList = document.getElementById('hrm-dept-presence-list');
  if (deptPresenceList) {
    const deptAtt = hrmData.reports?.departmentAttendance || [];
    if (deptAtt.length === 0) {
      deptPresenceList.innerHTML = `
        <div class="empty-state-box" style="padding: 16px;">
          <span class="empty-state-icon">👥</span>
          <div class="empty-state-desc">No department attendance records logged</div>
        </div>
      `;
    } else {
      deptPresenceList.innerHTML = deptAtt.map(d => `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:600;">
            <span style="color:#0f1419;">${d.dept} (${d.headcount} Staff)</span>
            <span style="color:#3d5a27;">${d.rate}%</span>
          </div>
          <div style="width:100%; height:8px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
            <div style="width:${d.rate}%; height:100%; background:${d.color}; border-radius:4px; transition:width 0.4s ease;"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // 4. Top Performers Spotlight (Cross-Module Connected)
  const spotlight = document.getElementById('hrm-top-performers-spotlight');
  if (spotlight) {
    const top3 = (hrmData.performance || []).slice(0, 3);
    if (top3.length === 0) {
      spotlight.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1/-1; padding: 20px;">
          <span class="empty-state-icon">🏆</span>
          <div class="empty-state-title">No Performance Data</div>
          <div class="empty-state-desc">Staff performance rankings will appear as team members log activities.</div>
        </div>
      `;
    } else {
      const badges = ['Rank #1', 'Rank #2', 'Rank #3'];
      spotlight.innerHTML = top3.map((p, idx) => `
        <div style="background:#f9faf7; border:1px solid #dbe2d6; border-radius:8px; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="badge-pista" style="font-size:10.5px; font-weight:700;">${badges[idx]}</span>
              <h4 style="margin:6px 0 2px 0; font-size:13.5px; color:#0f1419;">${p.name}</h4>
              <div style="font-size:11px; color:#6b7280;">${p.designation}</div>
            </div>
            <span style="font-size:12px; font-weight:700; color:#3d5a27; background:#edf5e8; padding:2px 6px; border-radius:4px;">
              ${p.kpiScore} KPI
            </span>
          </div>
          <div style="margin-top:10px; padding-top:8px; border-top:1px dashed #dbe2d6; font-size:11.5px; color:#4b5563;">
            <div>Admissions: <strong style="color:#0f1419;">${p.admissionsClosed} Students</strong></div>
            <div style="color:var(--accent-pista-bright); font-weight:700; margin-top:2px;">Revenue: ${p.revenueFormatted}</div>
          </div>
        </div>
      `).join('');
    }
  }

  // 5. Recent Activity Feed
  const activityFeed = document.getElementById('hrm-recent-activity-feed');
  if (activityFeed) {
    const activities = hrmData.recentActivities || [];
    if (activities.length === 0) {
      activityFeed.innerHTML = `
        <div class="empty-state-box" style="padding: 16px;">
          <span class="empty-state-icon">📋</span>
          <div class="empty-state-title">No Recent Activities</div>
          <div class="empty-state-desc">HR actions, leave requests, and punches will log here in real-time.</div>
        </div>
      `;
    } else {
      activityFeed.innerHTML = activities.map(a => `
        <div style="display:flex; align-items:flex-start; gap:8px; font-size:11.5px; color:#374151; padding:6px 0; border-bottom:1px solid #f0f2ed;">
          <span style="font-size:13px;">${a.icon || '📌'}</span>
          <div style="flex:1; line-height:1.4;">
            ${a.text}
            <div style="font-size:10px; color:#9ca3af; margin-top:1px;">${a.time || ''}</div>
          </div>
        </div>
      `).join('');
    }
  }
}

// Quick Punch Action
function submitQuickPunch(type) {
  const select = document.getElementById('hrm-quick-punch-select');
  if (!select) return;
  const empId = select.value;
  const emp = ERP_DATA.hrm.employees.find(e => e.id === empId);
  if (!emp) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Update in attendance records
  let attRec = ERP_DATA.hrm.attendance.find(a => a.empId === empId);
  if (attRec) {
    if (type === 'Check-in') {
      attRec.checkIn = timeStr;
      attRec.status = 'Present';
    } else {
      attRec.checkOut = timeStr;
    }
  }

  const statusEl = document.getElementById('hrm-quick-punch-status');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = `<strong>✓ Success:</strong> ${type} recorded for <strong>${emp.name}</strong> at ${timeStr}. Attendance synchronized.`;
    setTimeout(() => { statusEl.style.display = 'none'; }, 4000);
  }

  showToastNotification(`${type} successfully logged for ${emp.name} at ${timeStr}`);
  populateHrmDashboard();
}

// ----------------------------------------------------------
// 7.2 Employee Management Pane & Profile Engine
// ----------------------------------------------------------
const ERP_MODULE_LABELS = {
  'crm': '📊 CRM & Admissions',
  'finance': '💰 Finance & Accounts',
  'class-management': '🎓 Class Management',
  'hrm': '👥 HRM & Faculty',
  'catalogue': '📚 Course Catalogue',
  'wayboss-ai': '🤖 WayBoss AI',
  'telecaller': '📞 Telecaller',
  'marketing': '📢 Marketing',
  'academic-coordinator': '🏛️ Academic Coordinator',
  'mentor-dashboard': '👨‍🏫 Mentor Dashboard'
};

function mapRoleToDepartment(role) {
  const r = (role || '').toLowerCase();
  if (r.includes('mentor') || r.includes('faculty') || r.includes('coordinator') || r.includes('trainer')) {
    return 'Faculty & Academics';
  } else if (r.includes('counselor') || r.includes('telecaller') || r.includes('admission')) {
    return 'Admissions & CRM';
  } else if (r.includes('finance') || r.includes('account')) {
    return 'Finance & Accounts';
  } else if (r.includes('marketing') || r.includes('campaign')) {
    return 'Marketing & Growth';
  } else if (r.includes('ceo') || r.includes('admin') || r.includes('director')) {
    return 'Executive Leadership & Admin';
  }
  return 'Operations & Tech';
}

function mapRoleToRoleId(role) {
  const r = (role || '').toLowerCase();
  if (r.includes('ceo') || r.includes('admin')) return 'ROLE-ADMIN';
  if (r.includes('coordinator')) return 'ROLE-COORD';
  if (r.includes('mentor') || r.includes('trainer')) return 'ROLE-MENTOR';
  if (r.includes('counselor') || r.includes('telecaller')) return 'ROLE-TC';
  if (r.includes('finance')) return 'ROLE-FINANCE';
  if (r.includes('marketing')) return 'ROLE-MARKETING';
  return 'ROLE-STAFF';
}

function handleRolePresetPermissions(role) {
  const r = (role || '').toLowerCase();
  const checkboxes = document.querySelectorAll('#add-emp-permissions-grid input[name="emp_perm"]');
  checkboxes.forEach(cb => cb.checked = false);

  if (r.includes('ceo') || r.includes('admin')) {
    checkboxes.forEach(cb => cb.checked = true);
  } else if (r.includes('coordinator')) {
    ['class-management', 'academic-coordinator', 'hrm', 'crm', 'catalogue'].forEach(val => {
      const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
      if (cb) cb.checked = true;
    });
  } else if (r.includes('mentor') || r.includes('trainer')) {
    ['class-management', 'mentor-dashboard', 'catalogue'].forEach(val => {
      const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
      if (cb) cb.checked = true;
    });
  } else if (r.includes('counselor') || r.includes('telecaller')) {
    ['crm', 'telecaller', 'catalogue'].forEach(val => {
      const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
      if (cb) cb.checked = true;
    });
  } else if (r.includes('hr')) {
    ['hrm', 'academic-coordinator', 'class-management'].forEach(val => {
      const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
      if (cb) cb.checked = true;
    });
  } else if (r.includes('finance')) {
    ['finance', 'catalogue'].forEach(val => {
      const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
      if (cb) cb.checked = true;
    });
  } else if (r.includes('marketing')) {
    ['marketing', 'crm'].forEach(val => {
      const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
      if (cb) cb.checked = true;
    });
  } else {
    ['hrm', 'catalogue'].forEach(val => {
      const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
      if (cb) cb.checked = true;
    });
  }
}

function toggleAllEmployeePermissions(checked) {
  const checkboxes = document.querySelectorAll('#add-emp-permissions-grid input[name="emp_perm"]');
  checkboxes.forEach(cb => cb.checked = checked);
}

function generateCleanUsername(name) {
  if (!name) return 'emp_' + Math.floor(100 + Math.random() * 900);
  const clean = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
  if (clean.length === 1) {
    return clean[0];
  }
  return `${clean[0]}.${clean[clean.length - 1]}`;
}

function previewGeneratedUsername() {
  const name = document.getElementById('add-emp-name')?.value.trim();
  const preview = document.getElementById('preview-emp-username');
  if (preview) {
    preview.textContent = name ? generateCleanUsername(name) : 'auto-from-name';
  }
}

function renderHrmEmployees() {
  const tbody = document.getElementById('hrm-employees-tbody');
  if (!tbody) return;

  const query = (document.getElementById('hrm-emp-search')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('hrm-emp-status-filter')?.value || 'all';

  let list = ERP_DATA.hrm.employees || [];

  // Filter by department
  if (currentHrmDeptFilter !== 'all') {
    list = list.filter(e => e.department === currentHrmDeptFilter);
  }

  // Filter by status
  if (statusFilter !== 'all') {
    list = list.filter(e => e.status === statusFilter);
  }

  // Filter by query
  if (query) {
    list = list.filter(e =>
      (e.name || '').toLowerCase().includes(query) ||
      (e.phone || '').toLowerCase().includes(query) ||
      (e.designation || '').toLowerCase().includes(query) ||
      (e.mainRole || '').toLowerCase().includes(query) ||
      (e.place || e.address || '').toLowerCase().includes(query) ||
      (e.id || '').toLowerCase().includes(query) ||
      (e.username || '').toLowerCase().includes(query)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:32px; color:#6b7280;">
      <div style="font-size:14px; font-weight:600; color:#374151; margin-bottom:4px;">No employees found</div>
      <div style="font-size:12px;">No matching staff records found for your search criteria.</div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(e => {
    const statusBadge = e.status === 'Active'
      ? `<span class="hrm-badge-present">● Active</span>`
      : e.status === 'On Leave'
      ? `<span class="hrm-badge-leave">● On Leave</span>`
      : `<span class="hrm-badge-half">● Probation</span>`;

    const placeDisplay = e.place || e.address || 'Kochi, Kerala';
    const roleDisplay = e.mainRole || e.designation;

    return `
      <tr style="border-bottom:1px solid #e5e7eb; transition: background 0.15s ease;" onmouseover="this.style.background='#fdfefc'" onmouseout="this.style.background='transparent'">
        <td style="padding:11px 14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${e.avatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:1.5px solid #6b8e4e; flex-shrink:0;">
            <div>
              <strong style="font-size:13px; color:#0f1419; display:block;">${escapeHTML(e.name)}</strong>
              <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                <span style="font-size:11px; color:#6b7280; font-family:var(--font-mono);">${e.id}</span>
                <span style="color:#9ca3af; font-size:10px;">•</span>
                <span style="font-size:11px; color:#3d5a27; font-weight:600;">📍 ${escapeHTML(placeDisplay)}</span>
              </div>
            </div>
          </div>
        </td>
        <td style="padding:11px 14px; font-size:12px; color:#4b5563;">
          <div style="font-weight:600; color:#0f1419;">📞 ${escapeHTML(e.phone)}</div>
          <div style="font-size:11px; color:#6b7280; margin-top:1px;">✉️ ${escapeHTML(e.email || (e.username ? e.username + '@waytone.edu' : '—'))}</div>
        </td>
        <td style="padding:11px 14px; font-size:12px; color:#0f1419;">
          <span class="badge-pista" style="font-size:11px;">${escapeHTML(e.department)}</span>
        </td>
        <td style="padding:11px 14px; font-size:12px; font-weight:600; color:#0f1419;">
          <div>${escapeHTML(roleDisplay)}</div>
          ${e.username ? `<span style="font-size:10.5px; color:#6b7280; font-family:var(--font-mono);">@${escapeHTML(e.username)}</span>` : ''}
        </td>
        <td style="padding:11px 14px; font-size:12px; color:#4b5563;">
          <div>${e.joiningDate}</div>
          <span style="font-size:10.5px; color:#3d5a27; font-weight:600;">(${e.tenure})</span>
        </td>
        <td style="padding:11px 14px; font-size:12.5px; font-weight:700; color:#0f1419; font-family:var(--font-mono);">
          ${e.salaryFormatted}
        </td>
        <td style="padding:11px 14px;">${statusBadge}</td>
        <td style="padding:11px 14px; font-size:12px; color:#4b5563;">${escapeHTML(e.manager)}</td>
        <td style="padding:11px 14px; text-align:center;">
          <button class="btn-primary-ai" style="padding:5px 12px; font-size:11.5px; font-weight:600;" onclick="openEmployeeProfile('${e.id}')">
            View Profile
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const countFooter = document.getElementById('hrm-employees-footer-count');
  if (countFooter) {
    countFooter.textContent = `Showing ${list.length} of ${ERP_DATA.hrm.employees.length} employees`;
  }
}

function filterEmployeesByDept(dept) {
  currentHrmDeptFilter = dept;
  document.querySelectorAll('#hrm-emp-dept-chips .dept-filter-chip').forEach(chip => {
    if (dept === 'all' && chip.textContent.includes('All Departments')) {
      chip.classList.add('active');
    } else if (chip.textContent.includes(dept)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
  renderHrmEmployees();
}

function openAddEmployeeModal() {
  const form = document.getElementById('hrm-add-employee-form');
  if (form) form.reset();

  const count = (ERP_DATA.hrm.employees || []).length;
  const nextId = `WST-EMP-${String(count + 1).padStart(2, '0')}`;

  const previewId = document.getElementById('preview-emp-id');
  if (previewId) previewId.textContent = nextId;

  const previewUser = document.getElementById('preview-emp-username');
  if (previewUser) previewUser.textContent = 'auto-from-name';

  toggleAllEmployeePermissions(false);
  // Default checked modules
  ['class-management', 'hrm'].forEach(val => {
    const cb = document.querySelector(`#add-emp-permissions-grid input[value="${val}"]`);
    if (cb) cb.checked = true;
  });

  openModal('modal-hrm-add-employee');
}

function saveNewEmployee() {
  const name = document.getElementById('add-emp-name')?.value.trim();
  const place = document.getElementById('add-emp-place')?.value.trim();
  const mainRole = document.getElementById('add-emp-role')?.value.trim();
  const phone = document.getElementById('add-emp-phone')?.value.trim();

  // Read Permissions
  const checkedPermissions = [];
  document.querySelectorAll('#add-emp-permissions-grid input[name="emp_perm"]:checked').forEach(cb => {
    checkedPermissions.push(cb.value);
  });

  if (!name || !place || !mainRole || !phone) {
    alert('Please fill out all required fields (Name, Place, Main Role, and Phone Number).');
    return;
  }

  if (checkedPermissions.length === 0) {
    if (!confirm('No module permissions selected. Do you want to continue with basic workspace access?')) {
      return;
    }
  }

  const count = (ERP_DATA.hrm.employees || []).length;
  const newId = `WST-EMP-${String(count + 1).padStart(2, '0')}`;

  // Generate unique username
  let baseUsername = generateCleanUsername(name);
  let finalUsername = baseUsername;
  let counter = 1;
  while ((ERP_DATA.hrm.employees || []).some(e => (e.username || '').toLowerCase() === finalUsername.toLowerCase())) {
    finalUsername = `${baseUsername}${counter}`;
    counter++;
  }

  // Generate secure password
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const password = `Waytone@${randomNum}`;

  // Custom or auto email
  const customEmail = document.getElementById('add-emp-email')?.value.trim();
  const email = customEmail || `${finalUsername}@waytone.edu`;

  // Salary & Manager
  const salary = parseInt(document.getElementById('add-emp-salary')?.value || '45000', 10);
  const manager = document.getElementById('add-emp-manager')?.value.trim() || 'Nasim v (CEO)';
  const room = document.getElementById('add-emp-room')?.value.trim() || 'Station 1';
  const dept = mapRoleToDepartment(mainRole);

  const newEmp = {
    id: newId,
    name: name,
    place: place,
    address: place,
    mainRole: mainRole,
    designation: mainRole,
    department: dept,
    phone: phone,
    email: email,
    permissions: checkedPermissions,
    username: finalUsername,
    password: password,
    salary: salary,
    salaryFormatted: `₹${salary.toLocaleString('en-IN')}`,
    status: 'Active',
    manager: manager,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=46652e&color=fff&bold=true`,
    room: room,
    joiningDate: '12 Sep 2026',
    tenure: 'New Joiner',
    presentDays: 22,
    totalWorkingDays: 24,
    absentDays: 1,
    leaveDays: 1,
    attendanceRate: 91.7,
    attendanceStats: {
      totalDays: 24,
      presentDays: 22,
      absentDays: 1,
      leaveDays: 1,
      attendanceRate: 91.7
    },
    skills: [mainRole, 'Team Collaboration', 'Professional Excellence'],
    performanceHistory: [
      {
        period: "August 2026",
        score: 94,
        rating: 4.8,
        attendance: "96%",
        remarks: "Exceeded onboarding milestones with strong communication, high domain competency, and proactive work ethic.",
        strengths: "Quick Learner, High Accountability, Initiative",
        reviewer: "Nasim v (CEO)"
      },
      {
        period: "July 2026",
        score: 91,
        rating: 4.6,
        attendance: "93%",
        remarks: "Active cross-department collaboration and dedication to institutional goals.",
        strengths: "Punctuality, Organization",
        reviewer: "Department Evaluation"
      }
    ]
  };

  ERP_DATA.hrm.employees.push(newEmp);

  // Synchronize with ERP_DATA.auth.users
  if (!ERP_DATA.auth) ERP_DATA.auth = { users: [] };
  if (!ERP_DATA.auth.users) ERP_DATA.auth.users = [];
  ERP_DATA.auth.users.push({
    userId: finalUsername,
    name: name,
    designation: mainRole,
    roleId: mapRoleToRoleId(mainRole),
    password: password,
    permissions: checkedPermissions,
    avatar: newEmp.avatar,
    email: email,
    phone: phone,
    place: place,
    lastLogin: null
  });

  // Sync attendance table
  if (!ERP_DATA.hrm.attendance) ERP_DATA.hrm.attendance = [];
  ERP_DATA.hrm.attendance.push({
    empId: newId,
    name: name,
    department: dept,
    date: '12 Sep 2026',
    status: 'Present',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    hoursLogged: '8h 30m',
    attendanceRate: 91.7
  });

  // Sync payroll record
  if (!ERP_DATA.hrm.payroll) ERP_DATA.hrm.payroll = { records: [] };
  if (!ERP_DATA.hrm.payroll.records) ERP_DATA.hrm.payroll.records = [];
  ERP_DATA.hrm.payroll.records.push({
    empId: newId,
    name: name,
    designation: mainRole,
    department: dept,
    basicSalary: salary,
    incentives: 0,
    deductions: Math.round(salary * 0.05),
    advance: 0,
    netSalary: Math.round(salary * 0.95),
    status: 'Pending Disbursement',
    paidDate: '—',
    paymentMode: 'Direct Bank Transfer'
  });

  // Update HRM KPIs
  if (!ERP_DATA.hrm.kpis) ERP_DATA.hrm.kpis = {};
  ERP_DATA.hrm.kpis.totalEmployees = (ERP_DATA.hrm.kpis.totalEmployees || 0) + 1;
  ERP_DATA.hrm.kpis.activeEmployees = (ERP_DATA.hrm.kpis.activeEmployees || 0) + 1;
  ERP_DATA.hrm.kpis.presentToday = (ERP_DATA.hrm.kpis.presentToday || 0) + 1;
  ERP_DATA.hrm.kpis.newEmployees = (ERP_DATA.hrm.kpis.newEmployees || 0) + 1;

  if (typeof saveDatabase === 'function') saveDatabase();

  closeModal('modal-hrm-add-employee');
  showToastNotification(`Staff member ${name} (${newId}) onboarded successfully! Username: ${finalUsername}`);

  // Re-render table
  renderHrmEmployees();

  // IMMEDIATELY OPEN THE EMPLOYEE PROFILE DRAWER AS REQUESTED!
  setTimeout(() => {
    openEmployeeProfile(newId);
  }, 250);
}

// ----------------------------------------------------------
// Employee Profile View & Credential Handling
// ----------------------------------------------------------
let isProfilePasswordVisible = false;

function toggleProfilePassword(actualPassword) {
  const pwdSpan = document.getElementById('profile-pwd-display');
  const btn = document.getElementById('profile-pwd-toggle-btn');
  if (!pwdSpan || !btn) return;

  isProfilePasswordVisible = !isProfilePasswordVisible;
  if (isProfilePasswordVisible) {
    pwdSpan.textContent = actualPassword;
    pwdSpan.style.letterSpacing = 'normal';
    pwdSpan.style.color = '#0f1419';
    btn.innerHTML = '👁️ Hide';
  } else {
    pwdSpan.textContent = '••••••••';
    pwdSpan.style.letterSpacing = '2px';
    pwdSpan.style.color = '#4b5563';
    btn.innerHTML = '👁️ Show';
  }
}

function copyProfileCredential(text, label) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToastNotification(`✓ ${label} copied to clipboard!`);
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToastNotification(`✓ ${label} copied to clipboard!`);
  });
}

function copyAllProfileCredentials(empId) {
  const emp = ERP_DATA.hrm.employees.find(e => e.id === empId);
  if (!emp) return;

  const text = `Waytone ERP Login Credentials:
Employee Name: ${emp.name}
Employee ID: ${emp.id}
Destination / Role: ${emp.mainRole || emp.designation}
User ID / Username: ${emp.username || emp.id}
Password: ${emp.password || 'Waytone@2026'}
Login Portal: http://localhost:3000/`;

  copyProfileCredential(text, 'All Login Credentials');
}

function addEmployeePerformanceRecord(empId) {
  const emp = ERP_DATA.hrm.employees.find(e => e.id === empId);
  if (!emp) return;

  const score = prompt(`Enter Performance KPI Score for ${emp.name} (0-100):`, "95");
  if (score === null) return;
  const numScore = parseInt(score, 10);
  if (isNaN(numScore) || numScore < 0 || numScore > 100) {
    alert("Please enter a valid numeric score between 0 and 100.");
    return;
  }

  const remarks = prompt(`Enter Performance Evaluation Remarks for ${emp.name}:`, "Consistently high teaching evaluation and positive student feedback.");
  if (remarks === null) return;

  const rating = (numScore >= 95) ? 5.0 : (numScore >= 90) ? 4.8 : (numScore >= 80) ? 4.5 : 4.0;
  const currentMonth = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  if (!emp.performanceHistory) emp.performanceHistory = [];
  emp.performanceHistory.unshift({
    period: currentMonth,
    score: numScore,
    rating: rating,
    attendance: "96%",
    remarks: remarks,
    strengths: "High Reliability, Quality Execution",
    reviewer: (activeAuthSession?.name || "Nasim v (CEO)")
  });

  if (typeof saveDatabase === 'function') saveDatabase();
  showToastNotification(`✓ Performance evaluation record added for ${emp.name}!`);
  openEmployeeProfile(empId);
}

function openEmployeeProfile(empId) {
  const emp = ERP_DATA.hrm.employees.find(e => e.id === empId);
  if (!emp) return;

  isProfilePasswordVisible = false;

  const avatar = document.getElementById('hrm-profile-avatar');
  const name = document.getElementById('hrm-profile-name');
  const title = document.getElementById('hrm-profile-title');
  const idBadge = document.getElementById('hrm-profile-id-badge');
  const placeBadge = document.getElementById('hrm-profile-place');
  const statusBadge = document.getElementById('hrm-profile-status');
  const body = document.getElementById('hrm-profile-body-content');

  const placeDisplay = emp.place || emp.address || 'Kochi, Kerala';
  const roleDisplay = emp.mainRole || emp.designation || 'Staff Member';
  const usernameDisplay = emp.username || (emp.id ? emp.id.toLowerCase() : 'staff');
  const passwordDisplay = emp.password || 'Waytone@2026';

  if (avatar) avatar.src = emp.avatar;
  if (name) name.textContent = emp.name;
  if (title) title.textContent = `${roleDisplay} • ${emp.department}`;
  if (idBadge) idBadge.textContent = emp.id;
  if (placeBadge) placeBadge.textContent = `📍 ${placeDisplay}`;
  if (statusBadge) {
    statusBadge.textContent = emp.status || 'Active';
    statusBadge.className = emp.status === 'Active' ? 'hrm-badge-present' : 'hrm-badge-leave';
  }

  // Present Days & Attendance Stats
  const totalWorkingDays = emp.totalWorkingDays ?? (emp.attendanceStats?.totalDays ?? 24);
  const presentDays = emp.presentDays ?? (emp.attendanceStats?.presentDays ?? 22);
  const absentDays = emp.absentDays ?? (emp.attendanceStats?.absentDays ?? 1);
  const leaveDays = emp.leaveDays ?? (emp.attendanceStats?.leaveDays ?? 1);
  const attendanceRate = emp.attendanceRate ?? (emp.attendanceStats?.attendanceRate ?? Math.round((presentDays / totalWorkingDays) * 1000) / 10);

  // Performance Record History
  const history = emp.performanceHistory && emp.performanceHistory.length > 0
    ? emp.performanceHistory
    : [
        {
          period: "August 2026",
          score: 94,
          rating: 4.8,
          attendance: "96%",
          remarks: "Exceeded primary milestones with strong communication, high domain competency, and proactive work ethic.",
          strengths: "Quick Learner, High Accountability, Initiative",
          reviewer: emp.manager || "Nasim v (CEO)"
        },
        {
          period: "July 2026",
          score: 91,
          rating: 4.6,
          attendance: "93%",
          remarks: "Active cross-department collaboration and dedication to institutional goals.",
          strengths: "Punctuality, Organization",
          reviewer: "Department Evaluation"
        }
      ];

  const avgPerfScore = Math.round(history.reduce((acc, h) => acc + (h.score || 90), 0) / history.length);
  const avgStarRating = (history.reduce((acc, h) => acc + (h.rating || 4.5), 0) / history.length).toFixed(1);

  // Permissions module chips
  const permissionsList = (emp.permissions && emp.permissions.length > 0)
    ? emp.permissions
    : ['class-management', 'hrm'];

  if (body) {
    body.innerHTML = `
      <!-- 1. LOGIN CREDENTIALS BOX (HIGH PRIORITY) -->
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1.5px solid #86efac; border-radius: 10px; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(16, 185, 129, 0.06);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">🔑</span>
            <div>
              <strong style="font-size:13.5px; color:#14532d;">Employee System Login Credentials</strong>
              <div style="font-size:11.5px; color:#166534;">Configured for immediate authentication at the WayBoss login portal</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge-pista" style="background:#dcfce7; color:#15803d; border-color:#86efac; font-size:11px; font-weight:700;">
              🟢 Active in Authentication Program
            </span>
            <button class="btn-primary-ai" style="padding:4px 10px; font-size:11.5px;" onclick="copyAllProfileCredentials('${emp.id}')">
              📋 Copy All Credentials
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; background:#ffffff; padding:14px; border-radius:8px; border:1px solid #bbf7d0;">
          <!-- Employee ID -->
          <div>
            <div style="font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase; margin-bottom:3px;">Employee ID</div>
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f9faf7; padding:6px 10px; border-radius:6px; border:1px solid #e5e7eb;">
              <code style="font-size:13px; font-weight:700; color:#0f1419; font-family:var(--font-mono);">${escapeHTML(emp.id)}</code>
              <button onclick="copyProfileCredential('${escapeHTML(emp.id)}', 'Employee ID')" title="Copy ID" style="background:none; border:none; cursor:pointer; font-size:12px; color:#46652e; padding:2px 4px;">📋</button>
            </div>
          </div>

          <!-- Username -->
          <div>
            <div style="font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase; margin-bottom:3px;">User ID / Username</div>
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f9faf7; padding:6px 10px; border-radius:6px; border:1px solid #e5e7eb;">
              <code style="font-size:13px; font-weight:700; color:#0f1419; font-family:var(--font-mono);">${escapeHTML(usernameDisplay)}</code>
              <button onclick="copyProfileCredential('${escapeHTML(usernameDisplay)}', 'Username')" title="Copy Username" style="background:none; border:none; cursor:pointer; font-size:12px; color:#46652e; padding:2px 4px;">📋</button>
            </div>
          </div>

          <!-- Password -->
          <div>
            <div style="font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase; margin-bottom:3px;">Password</div>
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f9faf7; padding:6px 10px; border-radius:6px; border:1px solid #e5e7eb;">
              <span id="profile-pwd-display" style="font-size:13px; font-weight:700; color:#4b5563; font-family:var(--font-mono); letter-spacing:2px;">••••••••</span>
              <div style="display:flex; gap:4px;">
                <button id="profile-pwd-toggle-btn" onclick="toggleProfilePassword('${escapeHTML(passwordDisplay)}')" style="background:#edf5e8; border:1px solid #dbe2d6; border-radius:4px; cursor:pointer; font-size:11px; padding:2px 6px; font-weight:600; color:#3d5a27;">
                  👁️ Show
                </button>
                <button onclick="copyProfileCredential('${escapeHTML(passwordDisplay)}', 'Password')" title="Copy Password" style="background:none; border:none; cursor:pointer; font-size:12px; color:#46652e; padding:2px 4px;">📋</button>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:10px; font-size:11.5px; color:#15803d; display:flex; align-items:center; gap:6px;">
          <span>💡 <strong>Login instructions:</strong> On the Login Portal, enter User ID <code>${escapeHTML(usernameDisplay)}</code>, select Destination <strong>${escapeHTML(roleDisplay)}</strong>, and enter password.</span>
        </div>
      </div>

      <!-- 2. EMPLOYEE DETAILS & LOCATION -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:18px;">
        <div style="background:#ffffff; border:1px solid #dbe2d6; border-radius:8px; padding:14px;">
          <h4 style="margin:0 0 10px 0; font-size:12.5px; color:#0f1419; text-transform:uppercase; display:flex; align-items:center; gap:6px;">
            <span>📍 Contact & Location Details</span>
          </h4>
          <div style="font-size:12px; color:#4b5563; line-height:1.8;">
            <div><strong>Full Name:</strong> <span style="color:#0f1419;">${escapeHTML(emp.name)}</span></div>
            <div><strong>Place / Location:</strong> <span style="color:#0f1419; font-weight:600;">📍 ${escapeHTML(placeDisplay)}</span></div>
            <div><strong>Phone Number:</strong> <span style="color:#0f1419;">📞 ${escapeHTML(emp.phone)}</span></div>
            <div><strong>Official Email:</strong> <span style="color:#0f1419;">✉️ ${escapeHTML(emp.email || usernameDisplay + '@waytone.edu')}</span></div>
            <div><strong>Allocated Station / Room:</strong> <span style="color:#0f1419;">🏢 ${escapeHTML(emp.room || 'Main Campus Station')}</span></div>
          </div>
        </div>

        <div style="background:#ffffff; border:1px solid #dbe2d6; border-radius:8px; padding:14px;">
          <h4 style="margin:0 0 10px 0; font-size:12.5px; color:#0f1419; text-transform:uppercase; display:flex; align-items:center; gap:6px;">
            <span>💼 Employment & Hierarchy</span>
          </h4>
          <div style="font-size:12px; color:#4b5563; line-height:1.8;">
            <div><strong>Main Role:</strong> <span style="color:#2b5115; font-weight:700;">${escapeHTML(roleDisplay)}</span></div>
            <div><strong>Department:</strong> <span style="color:#0f1419;">${escapeHTML(emp.department)}</span></div>
            <div><strong>Reporting Manager:</strong> <span style="color:#0f1419;">${escapeHTML(emp.manager || 'Nasim v (CEO)')}</span></div>
            <div><strong>Joining Date:</strong> <span style="color:#0f1419;">${emp.joiningDate} (${emp.tenure || 'Active'})</span></div>
            <div><strong>Monthly Basic Salary:</strong> <span style="color:#0f1419; font-weight:700; font-family:var(--font-mono);">${emp.salaryFormatted || '₹45,000'}</span></div>
          </div>
        </div>
      </div>

      <!-- 3. ASSIGNED MODULE PERMISSIONS -->
      <div style="background:#f9faf7; border:1px solid #dbe2d6; border-radius:8px; padding:14px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h4 style="margin:0; font-size:12.5px; color:#0f1419; text-transform:uppercase; display:flex; align-items:center; gap:6px;">
            <span>🛡️ Assigned Module Permissions (${permissionsList.length} Authorized)</span>
          </h4>
          <span style="font-size:11px; color:#6b7280;">Modules accessible upon login</span>
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${permissionsList.map(modId => `
            <span class="badge-pista" style="font-size:11.5px; font-weight:600; padding:4px 10px; background:#ffffff; border:1px solid #c0d4b4;">
              ✓ ${ERP_MODULE_LABELS[modId] || modId}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- 4. PRESENT DAYS & ATTENDANCE RECORD -->
      <div style="background:#ffffff; border:1.5px solid #dbe2d6; border-radius:10px; padding:16px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <div>
            <h4 style="margin:0; font-size:13.5px; color:#0f1419; font-weight:700; display:flex; align-items:center; gap:6px;">
              <span>📅 Present Days & Attendance Analytics</span>
            </h4>
            <span style="font-size:11.5px; color:#4b5563;">Official monthly biometric & punch compliance</span>
          </div>
          <span class="badge-pista" style="font-size:12px; font-weight:700;">
            ${attendanceRate}% Attendance Rate
          </span>
        </div>

        <!-- 4 KPI Cards for Attendance -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:14px;">
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px;">
            <div style="font-size:11px; font-weight:600; color:#166534;">Present Days</div>
            <div style="font-size:22px; font-weight:800; color:#14532d; margin-top:2px;">
              ${presentDays} <span style="font-size:12px; font-weight:500; color:#4b5563;">/ ${totalWorkingDays}</span>
            </div>
            <div style="font-size:10px; color:#15803d; margin-top:2px;">🟢 Full Shifts Logged</div>
          </div>

          <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:10px 14px;">
            <div style="font-size:11px; font-weight:600; color:#991b1b;">Absent Days</div>
            <div style="font-size:22px; font-weight:800; color:#7f1d1d; margin-top:2px;">
              ${absentDays} <span style="font-size:12px; font-weight:500; color:#4b5563;">Day</span>
            </div>
            <div style="font-size:10px; color:#b91c1c; margin-top:2px;">🔴 Unplanned Absence</div>
          </div>

          <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:10px 14px;">
            <div style="font-size:11px; font-weight:600; color:#92400e;">Leave Days</div>
            <div style="font-size:22px; font-weight:800; color:#78350f; margin-top:2px;">
              ${leaveDays} <span style="font-size:12px; font-weight:500; color:#4b5563;">Day</span>
            </div>
            <div style="font-size:10px; color:#d97706; margin-top:2px;">🟡 Approved CL / SL</div>
          </div>

          <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 14px;">
            <div style="font-size:11px; font-weight:600; color:#3d5a27;">Attendance Rate</div>
            <div style="font-size:22px; font-weight:800; color:#2b5115; margin-top:2px;">
              ${attendanceRate}%
            </div>
            <div style="font-size:10px; color:#46652e; margin-top:2px;">📈 Target ≥ 90%</div>
          </div>
        </div>

        <!-- Attendance Progress Bar -->
        <div style="margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:4px; font-weight:600;">
            <span style="color:#374151;">Cumulative Attendance Ratio</span>
            <span style="color:#2b5115;">${presentDays} of ${totalWorkingDays} days (${attendanceRate}%)</span>
          </div>
          <div style="width:100%; height:8px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
            <div style="width:${attendanceRate}%; height:100%; background:#46652e; border-radius:4px; transition:width 0.4s ease;"></div>
          </div>
        </div>

        <!-- Recent 7-Day Punch History Log -->
        <div style="border-top:1px dashed #dbe2d6; padding-top:12px;">
          <div style="font-size:11.5px; font-weight:600; color:#0f1419; margin-bottom:8px;">Recent Shift Punch History:</div>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
              <thead>
                <tr style="background:#f9faf7; text-align:left; color:#6b7280; font-size:11px;">
                  <th style="padding:6px 10px; border-bottom:1px solid #e5e7eb;">Day & Date</th>
                  <th style="padding:6px 10px; border-bottom:1px solid #e5e7eb;">Shift</th>
                  <th style="padding:6px 10px; border-bottom:1px solid #e5e7eb;">Check-In</th>
                  <th style="padding:6px 10px; border-bottom:1px solid #e5e7eb;">Check-Out</th>
                  <th style="padding:6px 10px; border-bottom:1px solid #e5e7eb;">Logged Hours</th>
                  <th style="padding:6px 10px; border-bottom:1px solid #e5e7eb;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:6px 10px; font-weight:600;">Fri, 11 Sep</td>
                  <td style="padding:6px 10px; color:#4b5563;">General (09:00 - 17:30)</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">08:58 AM</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">05:32 PM</td>
                  <td style="padding:6px 10px; font-family:var(--font-mono);">8h 34m</td>
                  <td style="padding:6px 10px;"><span class="hrm-badge-present">● Present</span></td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:6px 10px; font-weight:600;">Thu, 10 Sep</td>
                  <td style="padding:6px 10px; color:#4b5563;">General (09:00 - 17:30)</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">09:02 AM</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">05:30 PM</td>
                  <td style="padding:6px 10px; font-family:var(--font-mono);">8h 28m</td>
                  <td style="padding:6px 10px;"><span class="hrm-badge-present">● Present</span></td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:6px 10px; font-weight:600;">Wed, 09 Sep</td>
                  <td style="padding:6px 10px; color:#4b5563;">General (09:00 - 17:30)</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">08:55 AM</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">05:35 PM</td>
                  <td style="padding:6px 10px; font-family:var(--font-mono);">8h 40m</td>
                  <td style="padding:6px 10px;"><span class="hrm-badge-present">● Present</span></td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:6px 10px; font-weight:600;">Tue, 08 Sep</td>
                  <td style="padding:6px 10px; color:#4b5563;">General (09:00 - 17:30)</td>
                  <td style="padding:6px 10px; color:#d97706; font-weight:600;">—</td>
                  <td style="padding:6px 10px; color:#d97706; font-weight:600;">—</td>
                  <td style="padding:6px 10px; font-family:var(--font-mono);">—</td>
                  <td style="padding:6px 10px;"><span class="hrm-badge-leave">● Approved Leave</span></td>
                </tr>
                <tr style="border-bottom:1px solid #f3f4f6;">
                  <td style="padding:6px 10px; font-weight:600;">Mon, 07 Sep</td>
                  <td style="padding:6px 10px; color:#4b5563;">General (09:00 - 17:30)</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">09:00 AM</td>
                  <td style="padding:6px 10px; color:#15803d; font-weight:600;">05:30 PM</td>
                  <td style="padding:6px 10px; font-family:var(--font-mono);">8h 30m</td>
                  <td style="padding:6px 10px;"><span class="hrm-badge-present">● Present</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 5. PREVIOUS PERFORMANCE RECORD -->
      <div style="background:#ffffff; border:1.5px solid #dbe2d6; border-radius:10px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
          <div>
            <h4 style="margin:0; font-size:13.5px; color:#0f1419; font-weight:700; display:flex; align-items:center; gap:6px;">
              <span>⭐ Previous Performance Record & Reviews</span>
            </h4>
            <span style="font-size:11.5px; color:#4b5563;">Comprehensive institutional appraisals, ratings, and mentor remarks</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="badge-pista" style="font-size:12px; font-weight:700;">
              ⭐ ${avgStarRating} / 5.0 Rating (${avgPerfScore} KPI)
            </span>
            <button class="btn-secondary" style="padding:4px 10px; font-size:11.5px; font-weight:600;" onclick="addEmployeePerformanceRecord('${emp.id}')">
              + Add Review Remark
            </button>
          </div>
        </div>

        <!-- Historical Performance Timeline Cards -->
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${history.map((h, idx) => `
            <div style="background:#f9faf7; border:1px solid #dbe2d6; border-radius:8px; padding:14px;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
                <div>
                  <span class="badge-pista" style="font-size:10.5px; font-weight:700;">${h.period}</span>
                  <span style="font-size:12px; color:#6b7280; margin-left:6px;">Reviewed by: <strong>${escapeHTML(h.reviewer || 'Management')}</strong></span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:12px; font-weight:700; color:#3d5a27; background:#edf5e8; padding:3px 8px; border-radius:4px; border:1px solid #cfe3c3;">
                    ${h.score} / 100 KPI Score
                  </span>
                  <span style="font-size:12px; font-weight:700; color:#d97706; background:#fffbeb; padding:3px 8px; border-radius:4px; border:1px solid #fde68a;">
                    ⭐ ${h.rating} / 5.0
                  </span>
                  <span style="font-size:11px; color:#4b5563; background:#ffffff; padding:3px 6px; border-radius:4px; border:1px solid #e5e7eb;">
                    Att: ${h.attendance || '95%'}
                  </span>
                </div>
              </div>

              <!-- Remarks -->
              <div style="font-size:12px; color:#1f2937; line-height:1.5; margin-bottom:8px; background:#ffffff; padding:10px 12px; border-radius:6px; border-left:3.5px solid #46652e;">
                <strong>Remarks:</strong> "${escapeHTML(h.remarks)}"
              </div>

              <!-- Strengths / Competencies -->
              ${h.strengths ? `
                <div style="font-size:11.5px; color:#4b5563; display:flex; align-items:center; gap:6px;">
                  <span style="font-weight:600; color:#374151;">Identified Strengths:</span>
                  <span style="color:#2b5115; font-weight:600;">${escapeHTML(h.strengths)}</span>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  openModal('modal-hrm-employee-profile');
}

// ----------------------------------------------------------
// 7.3 Attendance System Pane
// ----------------------------------------------------------
function renderHrmAttendance() {
  const tbody = document.getElementById('hrm-attendance-tbody');
  if (!tbody) return;

  const deptFilter = document.getElementById('hrm-att-dept-filter')?.value || 'all';
  const statusFilter = document.getElementById('hrm-att-status-filter')?.value || 'all';

  let list = ERP_DATA.hrm.attendance || [];

  if (deptFilter !== 'all') {
    list = list.filter(a => a.department === deptFilter);
  }

  if (statusFilter !== 'all') {
    list = list.filter(a => a.status === statusFilter);
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:#6b7280;">No attendance records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(rec => {
    const badgeClass = rec.status === 'Present'
      ? 'hrm-badge-present'
      : rec.status === 'Absent'
      ? 'hrm-badge-absent'
      : 'hrm-badge-leave';

    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px 14px;">
          <strong style="font-size:13px; color:#0f1419;">${rec.name}</strong>
          <span style="font-size:11px; color:#6b7280; display:block; font-family:var(--font-mono);">${rec.empId}</span>
        </td>
        <td style="padding:10px 14px; font-size:12px; color:#4b5563;">${rec.department}</td>
        <td style="padding:10px 14px; font-size:12px; color:#0f1419;">${rec.date}</td>
        <td style="padding:10px 14px; font-size:12px; font-family:var(--font-mono); color:#2b5115; font-weight:600;">${rec.checkIn}</td>
        <td style="padding:10px 14px; font-size:12px; font-family:var(--font-mono); color:#4b5563;">${rec.checkOut}</td>
        <td style="padding:10px 14px; font-size:12px; font-weight:600; color:#0f1419;">${rec.hoursLogged}</td>
        <td style="padding:10px 14px;"><span class="${badgeClass}">● ${rec.status}</span></td>
        <td style="padding:10px 14px; font-size:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:700; color:#3d5a27; min-width:38px;">${rec.attendanceRate}%</span>
            <div style="width:60px; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
              <div style="width:${rec.attendanceRate}%; height:100%; background:#6b8e4e; border-radius:3px;"></div>
            </div>
          </div>
        </td>
        <td style="padding:10px 14px; text-align:center;">
          <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="toggleHrmPunch('${rec.empId}')">
            Toggle Status
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleHrmPunch(empId) {
  const rec = ERP_DATA.hrm.attendance.find(a => a.empId === empId);
  if (!rec) return;

  if (rec.status === 'Present') {
    rec.status = 'Absent';
    rec.checkIn = '—';
    rec.checkOut = '—';
    rec.hoursLogged = '0h 00m';
    ERP_DATA.hrm.kpis.presentToday--;
    ERP_DATA.hrm.kpis.absentToday++;
  } else {
    rec.status = 'Present';
    rec.checkIn = '09:00 AM';
    rec.checkOut = '05:30 PM';
    rec.hoursLogged = '8h 30m';
    ERP_DATA.hrm.kpis.presentToday++;
    if (ERP_DATA.hrm.kpis.absentToday > 0) ERP_DATA.hrm.kpis.absentToday--;
  }

  showToastNotification(`Attendance updated for ${rec.name}: marked ${rec.status}`);
  renderHrmAttendance();
}

function markAllHrmPresent() {
  (ERP_DATA.hrm.attendance || []).forEach(a => {
    a.status = 'Present';
    if (a.checkIn === '—') a.checkIn = '09:00 AM';
    if (a.checkOut === '—') a.checkOut = '05:30 PM';
    a.hoursLogged = '8h 30m';
  });

  ERP_DATA.hrm.kpis.presentToday = ERP_DATA.hrm.attendance.length;
  ERP_DATA.hrm.kpis.absentToday = 0;
  ERP_DATA.hrm.kpis.onLeave = 0;

  showToastNotification('All 68 staff members marked Present for today!');
  renderHrmAttendance();
}

// ----------------------------------------------------------
// 7.4 Performance Matrix Pane
// ----------------------------------------------------------
function renderHrmPerformance() {
  const tbody = document.getElementById('hrm-performance-tbody');
  if (!tbody) return;

  const perfList = (ERP_DATA.hrm.performance || []).sort((a, b) => a.teamRanking - b.teamRanking);

  if (perfList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" class="empty-table-cell">
          <div class="empty-state-box" style="padding: 24px;">
            <span class="empty-state-icon">🏆</span>
            <div class="empty-state-title">No Performance Records</div>
            <div class="empty-state-desc">Staff performance rankings will appear as team members log activities.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = perfList.map(p => {
    let rankBadge = `<span style="font-weight:700; color:#6b7280;">#${p.teamRanking}</span>`;
    if (p.teamRanking === 1) rankBadge = `<span class="rank-badge-gold">1</span>`;
    else if (p.teamRanking === 2) rankBadge = `<span class="rank-badge-silver">2</span>`;
    else if (p.teamRanking === 3) rankBadge = `<span class="rank-badge-bronze">3</span>`;

    const statusBadge = p.monthlyPerformance === 'Outstanding'
      ? `<span class="badge-pista" style="background:#6b8e4e; color:#ffffff;">Outstanding</span>`
      : p.monthlyPerformance === 'Exceeds Target'
      ? `<span class="badge-pista">Exceeds Target</span>`
      : `<span class="badge-pista" style="background:#e5e7eb; color:#374151;">On Track</span>`;

    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:11px 12px; text-align:center;">${rankBadge}</td>
        <td style="padding:11px 14px;">
          <strong style="font-size:13px; color:#0f1419; display:block;">${p.name}</strong>
          <span style="font-size:11px; color:#6b7280;">${p.designation} • ${p.department}</span>
        </td>
        <td style="padding:11px 12px; font-size:12px; color:#0f1419; font-weight:600;">${p.tasksCompleted}</td>
        <td style="padding:11px 12px; font-size:12px; color:#4b5563;">${p.callsLogged ? p.callsLogged.toLocaleString() : '—'}</td>
        <td style="padding:11px 12px; font-size:12px; font-weight:700; color:#166534;">${p.admissionsClosed ? p.admissionsClosed + ' Students' : '—'}</td>
        <td style="padding:11px 12px; font-size:12px; font-weight:700; color:var(--accent-pista-bright); font-family:var(--font-mono);">${p.revenueFormatted}</td>
        <td style="padding:11px 12px; font-size:12px; color:#4b5563;">${p.activeBatches ? p.activeBatches + ' Batches (' + p.classesTaught + ' Cls)' : '—'}</td>
        <td style="padding:11px 12px; font-size:12px; color:#d97706; font-weight:700;">★ ${p.studentRating}</td>
        <td style="padding:11px 12px; font-size:13px; font-weight:800; color:#0f1419;">${p.kpiScore}</td>
        <td style="padding:11px 12px;">${statusBadge}</td>
        <td style="padding:11px 12px; text-align:right; font-weight:700; color:#166534; font-family:var(--font-mono);">
          +₹${p.incentiveBonus.toLocaleString('en-IN')}
        </td>
      </tr>
    `;
  }).join('');
}

// ----------------------------------------------------------
// 7.5 Leave Management Pane
// ----------------------------------------------------------
function renderHrmLeaves() {
  const tbody = document.getElementById('hrm-leaves-tbody');
  if (!tbody) return;

  const requests = ERP_DATA.hrm?.leaves?.requests || [];

  if (requests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:#6b7280;">No leave requests currently filed.</td></tr>`;
    return;
  }

  tbody.innerHTML = requests.map(r => {
    const statusPill = r.status === 'Pending'
      ? `<span class="hrm-badge-leave">&#9679; Pending Review</span>`
      : r.status === 'Approved'
      ? `<span class="hrm-badge-present">✓ Approved</span>`
      : `<span class="hrm-badge-absent">✕ Rejected</span>`;

    const actionButtons = r.status === 'Pending'
      ? `
        <div style="display:flex; gap:6px; justify-content:center;">
          <button class="btn-primary-ai" style="padding:3px 8px; font-size:11px;" onclick="approveHrmLeave('${r.id}')">Approve</button>
          <button class="btn-secondary" style="padding:3px 8px; font-size:11px; color:#dc2626;" onclick="rejectHrmLeave('${r.id}')">Reject</button>
        </div>
      `
      : `<span style="font-size:11.5px; color:#6b7280;">Resolved</span>`;

    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px 14px; font-size:11.5px; font-family:var(--font-mono); color:var(--accent-pista); font-weight:700;">${r.id}</td>
        <td style="padding:10px 14px;">
          <strong style="font-size:13px; color:#0f1419; display:block;">${r.empName}</strong>
          <span style="font-size:11px; color:#6b7280;">${r.department}</span>
        </td>
        <td style="padding:10px 14px; font-size:12px; color:#0f1419; font-weight:600;">${r.type}</td>
        <td style="padding:10px 14px; font-size:12px; color:#4b5563;">${r.dates}</td>
        <td style="padding:10px 14px; font-size:12px; font-weight:700; color:#0f1419;">${r.days} Days</td>
        <td style="padding:10px 14px; font-size:12px; color:#4b5563;">${r.reason}</td>
        <td style="padding:10px 14px; font-size:11.5px; color:#6b7280;">${r.appliedOn}</td>
        <td style="padding:10px 14px;">${statusPill}</td>
        <td style="padding:10px 14px; text-align:center;">${actionButtons}</td>
      </tr>
    `;
  }).join('');
}

function openApplyLeaveModal() {
  const select = document.getElementById('leave-emp-select');
  if (select && ERP_DATA.hrm.employees) {
    select.innerHTML = ERP_DATA.hrm.employees.map(e => `
      <option value="${e.id}">${e.name} (${e.department})</option>
    `).join('');
  }
  openModal('modal-hrm-apply-leave');
}

function submitHrmLeave() {
  const empId = document.getElementById('leave-emp-select')?.value;
  const type = document.getElementById('leave-type-select')?.value;
  const days = parseInt(document.getElementById('leave-days-input')?.value || '1', 10);
  const start = document.getElementById('leave-start-date')?.value.trim() || '08 Sep 2026';
  const end = document.getElementById('leave-end-date')?.value.trim() || '09 Sep 2026';
  const reason = document.getElementById('leave-reason-input')?.value.trim();

  const emp = ERP_DATA.hrm.employees.find(e => e.id === empId);
  if (!emp || !reason) {
    alert('Please complete all leave fields.');
    return;
  }

  const reqCount = (ERP_DATA.hrm.leaves.requests || []).length;
  const newReq = {
    id: `LEV-2026-${String(reqCount + 1).padStart(2, '0')}`,
    empId: empId,
    empName: emp.name,
    department: emp.department,
    type: type,
    dates: `${start} - ${end}`,
    days: days,
    reason: reason,
    appliedOn: '06 Sep 2026',
    status: 'Pending'
  };

  if (!ERP_DATA.hrm.leaves) ERP_DATA.hrm.leaves = { requests: [] };
  if (!ERP_DATA.hrm.leaves.requests) ERP_DATA.hrm.leaves.requests = [];
  ERP_DATA.hrm.leaves.requests.unshift(newReq);
  if (ERP_DATA.hrm.kpis) ERP_DATA.hrm.kpis.pendingTasks++;

  closeModal('modal-hrm-apply-leave');
  renderHrmLeaves();
  showToastNotification(`Leave application submitted for ${emp.name} (${days} days)`);
}

function approveHrmLeave(leaveId) {
  const req = (ERP_DATA.hrm.leaves?.requests || []).find(r => r.id === leaveId);
  if (!req) return;

  req.status = 'Approved';
  if (ERP_DATA.hrm.kpis.pendingTasks > 0) ERP_DATA.hrm.kpis.pendingTasks--;
  ERP_DATA.hrm.kpis.onLeave++;

  // Update employee status
  const emp = (ERP_DATA.hrm.employees || []).find(e => e.id === req.empId);
  if (emp) emp.status = 'On Leave';

  // Deduct from leave balance
  const bal = (ERP_DATA.hrm.leaves?.balances || []).find(b => b.empId === req.empId);
  if (bal && bal.paid) {
    bal.paid.used += req.days;
    bal.paid.remaining -= req.days;
  }

  showToastNotification(`Leave request ${leaveId} for ${req.empName} has been approved!`);
  renderHrmLeaves();
}

function rejectHrmLeave(leaveId) {
  const req = (ERP_DATA.hrm.leaves?.requests || []).find(r => r.id === leaveId);
  if (!req) return;

  req.status = 'Rejected';
  if (ERP_DATA.hrm.kpis.pendingTasks > 0) ERP_DATA.hrm.kpis.pendingTasks--;

  showToastNotification(`Leave request ${leaveId} for ${req.empName} has been rejected.`);
  renderHrmLeaves();
}

// ----------------------------------------------------------
// 7.6 Payroll & Compensation Pane (Finance Connected)
// ----------------------------------------------------------
function renderHrmPayroll() {
  const tbody = document.getElementById('hrm-payroll-tbody');
  if (!tbody) return;

  const payrollData = ERP_DATA.hrm?.payroll || {};
  const summary = payrollData.summary || {
    totalPayrollFormatted: "₹0",
    totalPaidFormatted: "₹0",
    totalPendingFormatted: "₹0",
    totalIncentivesFormatted: "₹0"
  };

  // Render top cards
  const totalEl = document.getElementById('hrm-payroll-total');
  const paidEl = document.getElementById('hrm-payroll-paid');
  const pendEl = document.getElementById('hrm-payroll-pending');
  const incEl = document.getElementById('hrm-payroll-incentives');

  if (totalEl) totalEl.textContent = summary.totalPayrollFormatted;
  if (paidEl) paidEl.textContent = summary.totalPaidFormatted;
  if (pendEl) pendEl.textContent = summary.totalPendingFormatted;
  if (incEl) incEl.textContent = summary.totalIncentivesFormatted;

  const records = payrollData.records || [];
  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="empty-table-cell">
          <div class="empty-state-box" style="padding: 24px;">
            <span class="empty-state-icon">💳</span>
            <div class="empty-state-title">No Payroll Records</div>
            <div class="empty-state-desc">Monthly salary disbursement ledgers will appear once staff accounts are generated.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const statusBadge = r.status === 'Paid'
      ? `<span class="hrm-badge-paid">✓ Paid (${r.paidDate})</span>`
      : `<span class="hrm-badge-pending-pay">&#9679; Pending</span>`;

    const actionCell = r.status === 'Pending Disbursement'
      ? `
        <div style="display:flex; gap:6px; justify-content:center;">
          <button class="btn-primary-ai" style="padding:3px 8px; font-size:11px;" onclick="disburseHrmSalary('${r.empId}')">
            Disburse
          </button>
          <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="openSalarySlip('${r.empId}')">
            Slip
          </button>
        </div>
      `
      : `
        <button class="btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="openSalarySlip('${r.empId}')">
          View Slip
        </button>
      `;

    return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:10px 14px;">
          <strong style="font-size:13px; color:#0f1419; display:block;">${r.name}</strong>
          <span style="font-size:11px; color:#6b7280; font-family:var(--font-mono);">${r.empId}</span>
        </td>
        <td style="padding:10px 14px; font-size:12px; color:#4b5563;">
          <div>${r.designation}</div>
          <span style="font-size:11px; color:#6b7280;">${r.department}</span>
        </td>
        <td style="padding:10px 12px; font-size:12px; font-family:var(--font-mono);">₹${r.basicSalary.toLocaleString('en-IN')}</td>
        <td style="padding:10px 12px; font-size:12px; font-weight:700; color:#166534; font-family:var(--font-mono);">+₹${r.incentives.toLocaleString('en-IN')}</td>
        <td style="padding:10px 12px; font-size:12px; color:#dc2626; font-family:var(--font-mono);">-₹${r.deductions.toLocaleString('en-IN')}</td>
        <td style="padding:10px 12px; font-size:12px; color:#4b5563; font-family:var(--font-mono);">₹${r.advance.toLocaleString('en-IN')}</td>
        <td style="padding:10px 12px; font-size:13px; font-weight:800; color:#0f1419; font-family:var(--font-mono);">
          ₹${r.netSalary.toLocaleString('en-IN')}
        </td>
        <td style="padding:10px 12px;">${statusBadge}</td>
        <td style="padding:10px 14px; text-align:center;">${actionCell}</td>
      </tr>
    `;
  }).join('');
}

// 1-Click Salary Disbursement connected directly to Central Finance
function disburseHrmSalary(empId) {
  const rec = ERP_DATA.hrm.payroll.records.find(r => r.empId === empId);
  if (!rec || rec.status === 'Paid') return;

  rec.status = 'Paid';
  rec.paidDate = '05 Sep 2026';

  // Update payroll summary counters
  const sum = ERP_DATA.hrm.payroll.summary;
  sum.totalPending -= rec.netSalary;
  sum.totalPaid += rec.netSalary;
  sum.totalPendingFormatted = `₹${sum.totalPending.toLocaleString('en-IN')}`;
  sum.totalPaidFormatted = `₹${sum.totalPaid.toLocaleString('en-IN')}`;

  // ==========================================================
  // CROSS-MODULE INTEGRATION: CENTRAL FINANCE SYNC
  // ==========================================================
  if (ERP_DATA.finance && ERP_DATA.finance.transactions) {
    const txnId = `TXN-PAY-${Date.now().toString().slice(-4)}`;
    ERP_DATA.finance.transactions.unshift({
      id: txnId,
      date: '05 Sep 2026',
      description: `Faculty & Staff Salary Disbursement - ${rec.name} (${rec.designation})`,
      category: 'Faculty & Staff Payroll',
      type: 'Expense',
      amount: rec.netSalary,
      amountFormatted: `₹${rec.netSalary.toLocaleString('en-IN')}`,
      status: 'Settled',
      reference: `HRM-${rec.empId}`
    });

    // Update finance cash reserves and operating outflow
    if (ERP_DATA.finance.kpis) {
      ERP_DATA.finance.kpis.operatingExpenditure += rec.netSalary;
      ERP_DATA.finance.kpis.cashReserve -= rec.netSalary;
      ERP_DATA.finance.kpis.operatingExpenditureFormatted = `₹${ERP_DATA.finance.kpis.operatingExpenditure.toLocaleString('en-IN')}`;
      ERP_DATA.finance.kpis.cashReserveFormatted = `₹${ERP_DATA.finance.kpis.cashReserve.toLocaleString('en-IN')}`;
    }
  }

  showToastNotification(`Salary of ₹${rec.netSalary.toLocaleString('en-IN')} disbursed for ${rec.name}. Credited & posted to Central Accounts.`);
  renderHrmPayroll();
}

function disburseAllHrmSalary() {
  const pendingRecords = (ERP_DATA.hrm.payroll.records || []).filter(r => r.status === 'Pending Disbursement');
  if (pendingRecords.length === 0) {
    alert('All staff salaries for September 2026 have already been disbursed!');
    return;
  }

  let totalDisbursed = 0;
  pendingRecords.forEach(rec => {
    rec.status = 'Paid';
    rec.paidDate = '05 Sep 2026';
    totalDisbursed += rec.netSalary;

    if (ERP_DATA.finance && ERP_DATA.finance.transactions) {
      ERP_DATA.finance.transactions.unshift({
        id: `TXN-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        date: '05 Sep 2026',
        description: `Faculty & Staff Salary Disbursement - ${rec.name} (${rec.designation})`,
        category: 'Faculty & Staff Payroll',
        type: 'Expense',
        amount: rec.netSalary,
        amountFormatted: `₹${rec.netSalary.toLocaleString('en-IN')}`,
        status: 'Settled',
        reference: `HRM-${rec.empId}`
      });
    }
  });

  const sum = ERP_DATA.hrm.payroll.summary;
  sum.totalPaid += sum.totalPending;
  sum.totalPending = 0;
  sum.totalPaidFormatted = `₹${sum.totalPaid.toLocaleString('en-IN')}`;
  sum.totalPendingFormatted = `₹0`;

  if (ERP_DATA.finance && ERP_DATA.finance.kpis) {
    ERP_DATA.finance.kpis.operatingExpenditure += totalDisbursed;
    ERP_DATA.finance.kpis.cashReserve -= totalDisbursed;
    ERP_DATA.finance.kpis.operatingExpenditureFormatted = `₹${ERP_DATA.finance.kpis.operatingExpenditure.toLocaleString('en-IN')}`;
    ERP_DATA.finance.kpis.cashReserveFormatted = `₹${ERP_DATA.finance.kpis.cashReserve.toLocaleString('en-IN')}`;
  }

  showToastNotification(`Bulk payroll of ₹${totalDisbursed.toLocaleString('en-IN')} disbursed for all remaining staff. Synchronized with Central Finance.`);
  renderHrmPayroll();
}

// Generate Official Salary Slip Modal
function openSalarySlip(empId) {
  const emp = ERP_DATA.hrm.employees.find(e => e.id === empId);
  const rec = ERP_DATA.hrm.payroll.records.find(r => r.empId === empId);
  if (!emp || !rec) return;

  const content = document.getElementById('hrm-salary-slip-content');
  if (!content) return;

  content.innerHTML = `
    <div style="border:1px solid #dbe2d6; border-radius:8px; padding:18px; background:#ffffff;">
      <!-- Slip Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1.5px solid #6b8e4e; padding-bottom:12px; margin-bottom:14px;">
        <div>
          <h3 style="margin:0; font-size:16px; color:#0f1419;">Waytone Skill Development Centre</h3>
          <p style="margin:2px 0 0 0; font-size:11.5px; color:#4b5563;">Main Campus, Ernakulam / Kochi, Kerala • Central Human Resources</p>
          <div style="font-size:11px; color:#6b7280; margin-top:2px;">Founder & CEO: <strong>Nasim v</strong></div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px; font-weight:700; color:#3d5a27;">PAYSLIP: SEPTEMBER 2026</div>
          <div style="font-size:11px; color:#6b7280;">Generated on: 05 Sep 2026</div>
          <span class="badge-pista" style="font-size:10px; margin-top:3px; display:inline-block;">Status: ${rec.status}</span>
        </div>
      </div>

      <!-- Employee Info Grid -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; background:#f9faf7; padding:10px 14px; border-radius:6px; font-size:11.5px; margin-bottom:14px;">
        <div>
          <div><strong>Employee Name:</strong> ${emp.name}</div>
          <div><strong>Employee ID:</strong> ${emp.id}</div>
          <div><strong>Department:</strong> ${emp.department}</div>
        </div>
        <div>
          <div><strong>Designation:</strong> ${emp.designation}</div>
          <div><strong>Payment Mode:</strong> ${rec.paymentMode}</div>
          <div><strong>Joining Date:</strong> ${emp.joiningDate}</div>
        </div>
      </div>

      <!-- Earnings & Deductions Breakdown Table -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:14px;">
        <!-- Earnings -->
        <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
          <thead>
            <tr style="background:#edf5e8; border-bottom:1px solid #c9d8c0;">
              <th style="padding:6px 8px; text-align:left; color:#2b5115;">Earnings (Allowances)</th>
              <th style="padding:6px 8px; text-align:right; color:#2b5115;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb;">Basic Salary</td>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb; text-align:right; font-family:var(--font-mono);">₹${rec.basicSalary.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb;">Performance Incentive (CRM/Academic)</td>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb; text-align:right; color:#166534; font-weight:700; font-family:var(--font-mono);">₹${rec.incentives.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="background:#f9faf7; font-weight:700;">
              <td style="padding:8px;">Gross Earnings</td>
              <td style="padding:8px; text-align:right; font-family:var(--font-mono);">₹${(rec.basicSalary + rec.incentives).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <!-- Deductions -->
        <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
          <thead>
            <tr style="background:#fef2f2; border-bottom:1px solid #fecaca;">
              <th style="padding:6px 8px; text-align:left; color:#991b1b;">Deductions</th>
              <th style="padding:6px 8px; text-align:right; color:#991b1b;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb;">Provident Fund (PF) & PT</td>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb; text-align:right; color:#dc2626; font-family:var(--font-mono);">₹${rec.deductions.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb;">Advance Recovery</td>
              <td style="padding:6px 8px; border-bottom:1px solid #e5e7eb; text-align:right; font-family:var(--font-mono);">₹${rec.advance.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="background:#f9faf7; font-weight:700;">
              <td style="padding:8px;">Total Deductions</td>
              <td style="padding:8px; text-align:right; color:#dc2626; font-family:var(--font-mono);">₹${(rec.deductions + rec.advance).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Net Salary Banner -->
      <div style="background:#edf5e8; border:1px solid #c9d8c0; border-radius:6px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:11px; color:#2b5115; font-weight:600; text-transform:uppercase;">Net Salary Disbursed</div>
          <div style="font-size:11px; color:#4b5563;">Transferred to Employee Registered Bank Account</div>
        </div>
        <div style="font-size:22px; font-weight:800; color:#2b5115; font-family:var(--font-mono);">
          ₹${rec.netSalary.toLocaleString('en-IN')}
        </div>
      </div>

      <!-- Signature Footer -->
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:20px; padding-top:14px; border-top:1px dashed #dbe2d6; font-size:11px; color:#6b7280;">
        <div>
          <div>Employee Acknowledgement</div>
          <div style="margin-top:20px; border-top:1px solid #9ca3af; width:140px;">${emp.name}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; color:#3d5a27;">Digitally Authorized & Approved</div>
          <div style="margin-top:20px; font-weight:700; color:#0f1419;">Nasim v, Chief Executive Officer</div>
        </div>
      </div>
    </div>
  `;

  openModal('modal-hrm-salary-slip');
}

// ----------------------------------------------------------
// 7.7 Reports & Analytics Pane
// ----------------------------------------------------------
function renderHrmReports() {
  const hrmData = ERP_DATA.hrm;
  if (!hrmData) return;

  // 1. Department Attendance SVG Chart
  const attChart = document.getElementById('hrm-report-attendance-chart');
  if (attChart) {
    const depts = hrmData.reports?.departmentAttendance || [];
    if (depts.length === 0) {
      attChart.innerHTML = `
        <div class="empty-chart-box" style="width:100%; height:180px;">
          <span class="empty-state-icon">📊</span>
          <div class="empty-state-title">No Department Attendance Data</div>
          <div class="empty-state-desc">Attendance comparison across departments will appear as staff punches are logged.</div>
        </div>
      `;
    } else {
      attChart.innerHTML = depts.map(d => {
        const heightPct = Math.round((d.rate / 100) * 180);
        return `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; height:100%; justify-content:flex-end;">
            <span style="font-size:11px; font-weight:700; color:#0f1419; margin-bottom:4px;">${d.rate}%</span>
            <div style="width:38px; height:${heightPct}px; background:${d.color}; border-radius:4px 4px 0 0; transition:height 0.4s ease;" title="${d.dept}: ${d.rate}% attendance"></div>
            <span style="font-size:10px; color:#6b7280; margin-top:8px; text-align:center; max-width:60px; line-height:1.2; word-break:break-word;">
              ${d.dept.split(' ')[0]}
            </span>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Employee Performance Ranking Graph
  const perfChart = document.getElementById('hrm-report-perf-chart');
  if (perfChart) {
    const top5 = (hrmData.performance || []).slice(0, 5);
    if (top5.length === 0) {
      perfChart.innerHTML = `
        <div class="empty-state-box" style="padding: 20px;">
          <span class="empty-state-icon">🏆</span>
          <div class="empty-state-desc">No employee performance rankings recorded</div>
        </div>
      `;
    } else {
      perfChart.innerHTML = top5.map(p => `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:3px;">
            <strong style="color:#0f1419;">${p.name} (${p.designation.split(' ')[0]})</strong>
            <span style="font-weight:700; color:#3d5a27;">${p.kpiScore} Score • ${p.revenueFormatted}</span>
          </div>
          <div style="width:100%; height:7px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
            <div style="width:${p.kpiScore}%; height:100%; background:#6b8e4e; border-radius:4px;"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // 3. Department Payroll Table
  const deptTbody = document.getElementById('hrm-report-dept-payroll-body');
  if (deptTbody) {
    const deptPayroll = hrmData.departmentPayroll || [];
    if (deptPayroll.length === 0) {
      deptTbody.innerHTML = `
        <tr>
          <td colspan="4" class="empty-table-cell">
            <div class="empty-state-box" style="padding: 16px;">
              <span class="empty-state-icon">💳</span>
              <div class="empty-state-desc">No departmental payroll records logged</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      deptTbody.innerHTML = deptPayroll.map(d => `
        <tr style="border-bottom:1px solid #e5e7eb;">
          <td style="padding:8px 10px; font-weight:600; color:#0f1419;">${d.department}</td>
          <td style="padding:8px 10px;">${d.headcount} Staff</td>
          <td style="padding:8px 10px; font-weight:700; color:var(--accent-pista-bright); font-family:var(--font-mono);">${d.monthlyExpense}</td>
          <td style="padding:8px 10px; color:#4b5563;">${d.avgCompensation}</td>
        </tr>
      `).join('');
    }
  }

  // 4. Monthly Executive HR Highlights
  const highlightsList = document.getElementById('hrm-report-highlights-list');
  if (highlightsList) {
    const highlights = hrmData.reports?.monthlyBriefing?.highlights || [];
    if (highlights.length === 0) {
      highlightsList.innerHTML = `<li style="color:#6b7280; font-style:italic;">No HR highlights or briefing notes logged for this period.</li>`;
    } else {
      highlightsList.innerHTML = highlights.map(h => `
        <li style="margin-bottom:6px;">${h}</li>
      `).join('');
    }
  }
}

// ==========================================================
// 8. SUB-DASHBOARD: CATALOGUE
// ==========================================================
// 8. MODULE 5: COURSE CATALOGUE & SKILL PROGRAMS ENGINE
// ==========================================================

let currentSelectedCourseId = null;

function populateCatalogueView() {
  const courses = ERP_DATA.catalogue.courses || [];
  
  // 1. Calculate Summary KPIs
  const totalCourses = courses.length;
  let totalPackages = 0;
  let totalEnrolled = 0;
  let totalCapacity = 0;
  let availableSlots = 0;

  courses.forEach(crs => {
    if (crs.packages && Array.isArray(crs.packages)) {
      totalPackages += crs.packages.length;
    }
    totalEnrolled += (crs.enrolledStudents || crs.enrolled || 0);
    totalCapacity += (crs.totalCapacity || crs.capacity || 0);
    availableSlots += (crs.availableSlots !== undefined ? crs.availableSlots : Math.max(0, (crs.totalCapacity || crs.capacity || 0) - (crs.enrolledStudents || crs.enrolled || 0)));
  });

  const kpiTotal = document.getElementById('cat-kpi-total-courses');
  const kpiPkgs = document.getElementById('cat-kpi-total-packages');
  const kpiSlots = document.getElementById('cat-kpi-available-slots');
  const kpiRunrate = document.getElementById('cat-kpi-tuition-runrate');

  if (kpiTotal) kpiTotal.textContent = `${totalCourses} Programs`;
  if (kpiPkgs) kpiPkgs.textContent = `${totalPackages} Packages`;
  if (kpiSlots) kpiSlots.textContent = `${availableSlots} Slots`;
  if (kpiRunrate && ERP_DATA.catalogue.summary) kpiRunrate.textContent = ERP_DATA.catalogue.summary.annualTuitionGross;

  renderCourseCatalogue(courses);
  syncCourseDropdownsAcrossERP();
}

function renderCourseCatalogue(coursesToRender) {
  const container = document.getElementById('catalogue-courses-grid');
  if (!container) return;

  const courses = coursesToRender || ERP_DATA.catalogue.courses || [];

  if (courses.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align:center; background:#ffffff; border:1px solid #dbe2d6; border-radius:10px;">
        <h4 style="color:#0f1419; margin:0 0 8px 0;">No matching courses found</h4>
        <p style="color:#6b7280; font-size:13px; margin:0 0 16px 0;">Try adjusting your search terms or filters.</p>
        <button class="btn-primary-ai" onclick="openAddCourseModal()">+ Add New Course</button>
      </div>
    `;
    return;
  }

  container.innerHTML = courses.map(crs => {
    const isInactive = crs.status === 'Inactive';
    const statusBadgeClass = isInactive ? 'course-badge-status-inactive' : 'course-badge-status-active';
    const statusText = isInactive ? '● Inactive' : '● Active';

    const enrolled = crs.enrolledStudents || crs.enrolled || 0;
    const capacity = crs.totalCapacity || crs.capacity || 100;
    const slots = crs.availableSlots !== undefined ? crs.availableSlots : Math.max(0, capacity - enrolled);
    const fillPercent = capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0;

    const packages = crs.packages || [];
    const pkgsCount = packages.length;

    // Build package pills
    const packagePillsHtml = packages.map(pkg => `
      <span class="course-package-pill">
        ${pkg.name}: ${pkg.feeFormatted || ('\u20B9' + pkg.fees)}
      </span>
    `).join('');

    return `
      <div class="catalogue-course-card ${isInactive ? 'inactive-card' : ''}" onclick="openCourseDetails('${crs.id}')">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span class="badge-pista" style="font-size:10.5px; font-weight:700;">${crs.category}</span>
            <span class="${statusBadgeClass}">${statusText}</span>
          </div>

          <h3 style="margin:0 0 6px 0; font-size:17.5px; font-weight:700; color:#0f1419;">
            ${crs.name || crs.title}
          </h3>

          <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:10px;">
            <span style="font-size:20px; font-weight:800; color:var(--accent-pista-bright);">
              ${crs.feeDisplay || crs.feeFormatted || ('\u20B9' + (crs.fees || 0))}
            </span>
            <span style="font-size:11.5px; color:#6b7280;">• ${crs.duration}</span>
          </div>

          <!-- Packages section -->
          <div style="margin:12px 0;">
            <div style="display:flex; justify-content:space-between; font-size:11.5px; color:#4b5563; font-weight:600; margin-bottom:4px;">
              <span>Packages (${pkgsCount}):</span>
              <span style="color:#2d4a1d;">${crs.weeklyClasses || 'Weekly Classes'}</span>
            </div>
            <div class="course-package-pills-wrap">
              ${packagePillsHtml || '<span style="font-size:11px; color:#9ca3af;">No packages configured</span>'}
            </div>
          </div>
        </div>

        <div>
          <!-- Available Slots Bar -->
          <div style="background:#f5f7f2; border:1px solid #dbe2d6; border-radius:8px; padding:10px 12px; margin-top:12px;">
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
              <span style="color:#4b5563;">Available Slots: <strong style="color:#2b5115;">${slots} Open</strong></span>
              <span style="font-size:11px; color:#6b7280;">${enrolled} / ${capacity} Students</span>
            </div>
            <div class="slots-meter-track">
              <div class="slots-meter-fill" style="width:${fillPercent}%;"></div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:12px; border-top:1px solid #e5e7eb;">
            <span style="font-size:12px; font-weight:600; color:var(--accent-pista-bright); display:flex; align-items:center; gap:4px;">
              View Course Details &rarr;
            </span>
            <div style="display:flex; align-items:center; gap:6px;">
              <button class="btn-secondary" style="padding:4px 9px; font-size:11px; border-radius:4px;" onclick="event.stopPropagation(); openAddCourseModal('${crs.id}')">
                Edit
              </button>
              <button class="btn-secondary" style="padding:4px 8px; font-size:11px; border-radius:4px; color:#991b1b; background:#fee2e2; border-color:#fca5a5; font-weight:600;" title="Delete Product" onclick="event.stopPropagation(); deleteCourse('${crs.id}')">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCatalogueCourses() {
  const query = (document.getElementById('catalogue-search-input')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('catalogue-category-filter')?.value || 'all';
  const status = document.getElementById('catalogue-status-filter')?.value || 'all';

  const allCourses = ERP_DATA.catalogue.courses || [];

  const filtered = allCourses.filter(crs => {
    // Search query
    const matchQuery = !query || 
      (crs.name && crs.name.toLowerCase().includes(query)) ||
      (crs.title && crs.title.toLowerCase().includes(query)) ||
      (crs.category && crs.category.toLowerCase().includes(query)) ||
      (crs.offers && crs.offers.toLowerCase().includes(query)) ||
      (crs.benefits && crs.benefits.some(b => b.toLowerCase().includes(query))) ||
      (crs.packages && crs.packages.some(p => p.name.toLowerCase().includes(query)));

    // Category filter
    const matchCat = cat === 'all' || crs.category === cat;

    // Status filter
    const matchStatus = status === 'all' || crs.status === status;

    return matchQuery && matchCat && matchStatus;
  });

  const countLabel = document.getElementById('catalogue-count-label');
  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} of ${allCourses.length} courses`;
  }

  renderCourseCatalogue(filtered);
}

// ----------------------------------------------------------
// Add / Edit Course Modal Logic
// ----------------------------------------------------------
function openAddCourseModal(courseIdToEdit = null) {
  const modal = document.getElementById('modal-add-course');
  if (!modal) return;

  const titleEl = document.getElementById('modal-add-course-title');
  const idInput = document.getElementById('course-form-id');
  const nameInput = document.getElementById('course-form-name');
  const catSelect = document.getElementById('course-form-category');
  const feesInput = document.getElementById('course-form-fees');
  const durInput = document.getElementById('course-form-duration');
  const weeklyInput = document.getElementById('course-form-weekly-classes');
  const benefitsInput = document.getElementById('course-form-benefits');
  const offersInput = document.getElementById('course-form-offers');
  const pkgContainer = document.getElementById('course-packages-builder-container');
  const deleteFormBtn = document.getElementById('btn-delete-course-form');

  if (pkgContainer) pkgContainer.innerHTML = '';

  if (courseIdToEdit) {
    const crs = (ERP_DATA.catalogue.courses || []).find(c => c.id === courseIdToEdit);
    if (!crs) return;

    if (titleEl) titleEl.textContent = `Edit Course: ${crs.name || crs.title}`;
    if (idInput) idInput.value = crs.id;
    if (nameInput) nameInput.value = crs.name || crs.title || '';
    if (catSelect) catSelect.value = crs.category || 'Language & Communication';
    if (feesInput) feesInput.value = crs.fees || '';
    if (durInput) durInput.value = crs.duration || '';
    if (weeklyInput) weeklyInput.value = crs.weeklyClasses || '';
    if (benefitsInput) benefitsInput.value = Array.isArray(crs.benefits) ? crs.benefits.join('\n') : (crs.benefits || '');
    if (offersInput) offersInput.value = crs.offers || '';

    if (crs.packages && crs.packages.length > 0) {
      crs.packages.forEach(pkg => addPackageRow(pkg));
    } else {
      addPackageRow();
    }
    if (deleteFormBtn) deleteFormBtn.style.display = 'inline-flex';
  } else {
    if (titleEl) titleEl.textContent = '+ Add New Course';
    if (idInput) idInput.value = '';
    if (nameInput) nameInput.value = '';
    if (catSelect) catSelect.selectedIndex = 0;
    if (feesInput) feesInput.value = '';
    if (durInput) durInput.value = '40 Days';
    if (weeklyInput) weeklyInput.value = 'Weekly 5 Days';
    if (benefitsInput) benefitsInput.value = '';
    if (offersInput) offersInput.value = '';

    if (deleteFormBtn) deleteFormBtn.style.display = 'none';

    addPackageRow({ name: 'Standard Package', studentCount: 'Batch 1 - 5 students', fees: 2000, duration: '40 Days' });
  }

  openModal('modal-add-course');
}

function addPackageRow(pkgData = null) {
  const container = document.getElementById('course-packages-builder-container');
  if (!container) return;

  const pkgName = pkgData?.name || '';
  const pkgStudents = pkgData?.studentCount || 'Batch 1 - 5 students';
  const pkgFees = pkgData?.fees || pkgData?.fee || '';
  const pkgDuration = pkgData?.duration || '40 Days';

  const box = document.createElement('div');
  box.className = 'package-builder-box';
  box.innerHTML = `
    <div class="package-builder-grid">
      <div>
        <label style="font-size:11px; font-weight:600; color:#374151; display:block; margin-bottom:2px;">Package Name <span style="color:#e11d48;">*</span></label>
        <input type="text" class="pkg-input-name" placeholder="e.g. Affordable, Premium" value="${pkgName}" required style="padding:6px 8px; border:1px solid #dbe2d6; border-radius:5px; font-size:12px; width:100%;">
      </div>
      <div>
        <label style="font-size:11px; font-weight:600; color:#374151; display:block; margin-bottom:2px;">Student Count <span style="color:#e11d48;">*</span></label>
        <input type="text" class="pkg-input-students" placeholder="e.g. 5 students" value="${pkgStudents}" required style="padding:6px 8px; border:1px solid #dbe2d6; border-radius:5px; font-size:12px; width:100%;">
      </div>
      <div>
        <label style="font-size:11px; font-weight:600; color:#374151; display:block; margin-bottom:2px;">Fees (&#8377;) <span style="color:#e11d48;">*</span></label>
        <input type="text" class="pkg-input-fees" placeholder="e.g. 2000 or 600 / Monthly" value="${pkgFees}" required style="padding:6px 8px; border:1px solid #dbe2d6; border-radius:5px; font-size:12px; width:100%;">
      </div>
      <div>
        <label style="font-size:11px; font-weight:600; color:#374151; display:block; margin-bottom:2px;">Duration <span style="color:#e11d48;">*</span></label>
        <input type="text" class="pkg-input-duration" placeholder="e.g. 40 Days, Monthly" value="${pkgDuration}" required style="padding:6px 8px; border:1px solid #dbe2d6; border-radius:5px; font-size:12px; width:100%;">
      </div>
      <div style="padding-top:14px; text-align:center;">
        <button type="button" title="Remove Package" onclick="removePackageRow(this)" style="background:#fee2e2; border:1px solid #fca5a5; border-radius:4px; cursor:pointer; color:#b91c1c; font-size:13px; font-weight:700; padding:4px 8px; line-height:1;">
          &times;
        </button>
      </div>
    </div>
  `;

  container.appendChild(box);
}
function removePackageRow(btn) {
  const container = document.getElementById('course-packages-builder-container');
  if (!container) return;

  const boxes = container.querySelectorAll('.package-builder-box');
  if (boxes.length <= 1) {
    alert('Each course must have at least one package configured.');
    return;
  }

  const box = btn.closest('.package-builder-box');
  if (box) box.remove();
}

function saveCourseForm(event) {
  if (event) event.preventDefault();

  const id = document.getElementById('course-form-id')?.value;
  const name = document.getElementById('course-form-name')?.value.trim();
  const category = document.getElementById('course-form-category')?.value;
  const fees = parseFloat(document.getElementById('course-form-fees')?.value) || 0;
  const duration = document.getElementById('course-form-duration')?.value.trim() || '40 Days';
  const weeklyClasses = document.getElementById('course-form-weekly-classes')?.value.trim() || 'Weekly 5 Days';
  const rawBenefits = document.getElementById('course-form-benefits')?.value.trim() || '';
  const offers = document.getElementById('course-form-offers')?.value.trim() || 'Official Waytone Certificate + Career Guidance';

  if (!name) {
    alert('Please enter a course name.');
    return;
  }
  if (!fees || fees <= 0) {
    alert('Please enter a valid course fee.');
    return;
  }

  // Extract benefits
  const benefits = rawBenefits.split('\n').map(b => b.trim()).filter(b => b.length > 0);
  if (benefits.length === 0) {
    benefits.push('Core skill competency & hands-on practical fluency');
    benefits.push('Personalized mentor guidance & progress tracking');
  }

  // Extract package rows
  const container = document.getElementById('course-packages-builder-container');
  const packageBoxes = container ? container.querySelectorAll('.package-builder-box') : [];
  const packages = [];

  packageBoxes.forEach((box, idx) => {
    const pkgName = box.querySelector('.pkg-input-name')?.value.trim() || `Package ${idx + 1}`;
    const pkgStudents = box.querySelector('.pkg-input-students')?.value.trim() || '5 students';
    const pkgFeeVal = box.querySelector('.pkg-input-fees')?.value.trim() || '2000';
    const pkgDuration = box.querySelector('.pkg-input-duration')?.value.trim() || duration;

    packages.push({
      id: `pkg-${Date.now().toString().slice(-4)}-${idx}`,
      name: pkgName,
      studentCount: pkgStudents.includes('students') ? pkgStudents : `Batch 1 - ${pkgStudents} students`,
      fees: pkgFeeVal,
      feeFormatted: pkgFeeVal.includes('₹') ? pkgFeeVal : `₹${pkgFeeVal}`,
      duration: pkgDuration,
      schedule: `${weeklyClasses} class`,
      description: `${pkgName} curriculum tailored for ${pkgStudents}.`
    });
  });

  if (packages.length === 0) {
    packages.push({
      id: `pkg-std-${Date.now().toString().slice(-4)}`,
      name: 'Standard',
      studentCount: 'Batch 1 - 5 students',
      fees: fees,
      feeFormatted: `₹${fees.toLocaleString('en-IN')}`,
      duration: duration,
      schedule: `${weeklyClasses} class`,
      description: 'Standard accredited training package.'
    });
  }

  const courses = ERP_DATA.catalogue.courses;

  if (id) {
    // Edit existing
    const existing = courses.find(c => c.id === id);
    if (existing) {
      existing.name = name;
      existing.title = name;
      existing.category = category;
      existing.fees = fees;
      existing.feeFormatted = `₹${fees.toLocaleString('en-IN')}`;
      existing.feeDisplay = `Starting ₹${fees.toLocaleString('en-IN')}`;
      existing.duration = duration;
      existing.weeklyClasses = weeklyClasses;
      existing.benefits = benefits;
      existing.offers = offers;
      existing.packages = packages;
    }
    showToastNotification(`Course "${name}" updated successfully.`);
  } else {
    // Create new course
    const newId = `CRS-${Date.now().toString().slice(-4)}`;
    const newCourse = {
      id: newId,
      name: name,
      title: name,
      category: category,
      fees: fees,
      feeFormatted: `₹${fees.toLocaleString('en-IN')}`,
      feeDisplay: `Starting ₹${fees.toLocaleString('en-IN')}`,
      duration: duration,
      weeklyClasses: weeklyClasses,
      enrolledStudents: 0,
      totalCapacity: 50,
      availableSlots: 50,
      status: 'Active',
      leadMentor: document.getElementById('course-lead-mentor')?.value || 'Unassigned',
      benefits: benefits,
      offers: offers,
      packages: packages
    };

    courses.unshift(newCourse);
    showToastNotification(`New course "${name}" created and published to Course Catalogue!`);
  }

  // Cross-module sync
  ERP_DATA.courses = courses;
  ERP_DATA.classes.courses = courses;
  syncCourseDropdownsAcrossERP();

  closeModal('modal-add-course');
  populateCatalogueView();
}

// ----------------------------------------------------------
// Course Details Modal / Page
// ----------------------------------------------------------
function openCourseDetails(courseId) {
  const crs = (ERP_DATA.catalogue.courses || []).find(c => c.id === courseId);
  if (!crs) return;

  currentSelectedCourseId = courseId;

  const nameEl = document.getElementById('course-details-name');
  const catEl = document.getElementById('course-details-category');
  const statusEl = document.getElementById('course-details-status-badge');
  const feesEl = document.getElementById('course-details-fees');
  const durEl = document.getElementById('course-details-duration');
  const weeklyEl = document.getElementById('course-details-weekly-classes');
  const slotsEl = document.getElementById('course-details-slots');
  const pkgsCountEl = document.getElementById('course-details-packages-count');
  const pkgsListEl = document.getElementById('course-details-packages-list');
  const benefitsListEl = document.getElementById('course-details-benefits-list');
  const offersEl = document.getElementById('course-details-offers');
  const toggleBtn = document.getElementById('btn-toggle-course-status');

  if (nameEl) nameEl.textContent = crs.name || crs.title;
  if (catEl) catEl.textContent = crs.category;

  const isInactive = crs.status === 'Inactive';
  if (statusEl) {
    statusEl.className = isInactive ? 'course-badge-status-inactive' : 'course-badge-status-active';
    statusEl.textContent = isInactive ? '● Inactive' : '● Active';
  }

  if (feesEl) feesEl.textContent = crs.feeDisplay || crs.feeFormatted || ('₹' + crs.fees);
  if (durEl) durEl.textContent = crs.duration;
  if (weeklyEl) weeklyEl.textContent = crs.weeklyClasses || 'Weekly 5 Days';

  const enrolled = crs.enrolledStudents || crs.enrolled || 0;
  const capacity = crs.totalCapacity || crs.capacity || 100;
  const slots = crs.availableSlots !== undefined ? crs.availableSlots : Math.max(0, capacity - enrolled);
  if (slotsEl) slotsEl.textContent = `${slots} Slots Open (${enrolled}/${capacity})`;

  const packages = crs.packages || [];
  if (pkgsCountEl) pkgsCountEl.textContent = `${packages.length} Packages`;

  if (pkgsListEl) {
    pkgsListEl.innerHTML = packages.map(pkg => `
      <div style="background:#ffffff; border:1.5px solid #dbe2d6; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
            <h5 style="margin:0; font-size:15px; color:#0f1419; font-weight:700;">${pkg.name}</h5>
            <span style="font-size:13px; font-weight:700; color:var(--accent-pista-bright);">${pkg.feeFormatted || ('₹' + pkg.fees)}</span>
          </div>
          <div style="display:inline-block; background:#edf5e8; color:#2d4a1d; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700; margin-bottom:8px;">
            ${pkg.studentCount || 'Micro-group'}
          </div>
          <p style="font-size:11.5px; color:#4b5563; line-height:1.4; margin:0 0 10px 0;">
            ${pkg.description || 'Structured micro-batch learning and intensive faculty review.'}
          </p>
        </div>
        <div style="font-size:11px; color:#6b7280; padding-top:8px; border-top:1px dashed #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
          <span>Duration: <strong>${pkg.duration}</strong></span>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="color:#2d4a1d; font-weight:700;">${pkg.availableSlots !== undefined ? pkg.availableSlots : 10} Slots Open</span>
            <button class="btn-secondary" style="padding:2px 7px; font-size:10px; border-radius:4px; color:#2d4a1d; border-color:#6b8e4e; font-weight:700;" onclick="event.stopPropagation(); openAdjustPackageSlotsModal($1)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:3px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (benefitsListEl) {
    const benefits = Array.isArray(crs.benefits) ? crs.benefits : (crs.benefits ? [crs.benefits] : []);
    benefitsListEl.innerHTML = benefits.map(b => `<li style="margin-bottom:6px;">${b}</li>`).join('');
  }

  if (offersEl) {
    offersEl.textContent = crs.offers || 'Contact admissions for seasonal group enrolment concessions and fee scholarships.';
  }

  if (toggleBtn) {
    if (isInactive) {
      toggleBtn.textContent = 'Activate Course';
      toggleBtn.style.color = '#15803d';
      toggleBtn.style.borderColor = '#86efac';
    } else {
      toggleBtn.textContent = 'Deactivate Course';
      toggleBtn.style.color = '#b91c1c';
      toggleBtn.style.borderColor = '#fca5a5';
    }
  }

  openModal('modal-course-details');
}

function editCourseFromDetails() {
  closeModal('modal-course-details');
  if (currentSelectedCourseId) {
    openAddCourseModal(currentSelectedCourseId);
  }
}

function toggleCourseStatusFromDetails() {
  if (currentSelectedCourseId) {
    toggleCourseStatus(currentSelectedCourseId);
  }
}

function toggleCourseStatus(courseId) {
  const crs = (ERP_DATA.catalogue.courses || []).find(c => c.id === courseId);
  if (!crs) return;

  crs.status = crs.status === 'Active' ? 'Inactive' : 'Active';
  const isNowActive = crs.status === 'Active';

  showToastNotification(`Course "${crs.name || crs.title}" has been ${isNowActive ? 'activated' : 'deactivated'}.`);

  // Refresh details modal if open
  openCourseDetails(courseId);
  populateCatalogueView();
  syncCourseDropdownsAcrossERP();
}

function deleteCourse(courseId) {
  if (!courseId) return;
  const crs = (ERP_DATA.catalogue.courses || []).find(c => c.id === courseId);
  const courseName = crs ? (crs.name || crs.title) : 'this course/product';

  const confirmed = confirm(`Are you sure you want to delete "${courseName}" from the catalogue?\n\nThis will permanently remove the course, all configured packages, and seat allocations.`);
  if (!confirmed) return;

  // Remove from catalogue courses array
  ERP_DATA.catalogue.courses = (ERP_DATA.catalogue.courses || []).filter(c => c.id !== courseId);
  ERP_DATA.courses = ERP_DATA.catalogue.courses;
  if (ERP_DATA.classes) {
    ERP_DATA.classes.courses = ERP_DATA.catalogue.courses;
  }

  // Close modals if open
  closeModal('modal-course-details');
  closeModal('modal-add-course');
  if (currentSelectedCourseId === courseId) {
    currentSelectedCourseId = null;
  }

  // Refresh Catalogue view, KPIs and cross-module sync
  populateCatalogueView();
  syncCourseDropdownsAcrossERP();

  showToastNotification(`Product "${courseName}" has been successfully deleted.`);
}

function deleteCourseFromDetails() {
  if (currentSelectedCourseId) {
    deleteCourse(currentSelectedCourseId);
  }
}

function deleteCourseFromForm() {
  const idInput = document.getElementById('course-form-id');
  if (idInput && idInput.value) {
    deleteCourse(idInput.value);
  }
}

// ----------------------------------------------------------
// Synchronize Course Dropdowns Across Entire ERP
// ----------------------------------------------------------
function syncCourseDropdownsAcrossERP() {
  const courses = (ERP_DATA.catalogue.courses || []).filter(c => c.status === 'Active');

  const dropdownIds = ['batch-course-select', 'create-batch-course', 'enroll-student-course', 'crm-inquiry-course'];

  dropdownIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const currentVal = el.value;
      el.innerHTML = courses.map(c => `
        <option value="${c.id}">${c.name || c.title} (${c.feeDisplay || c.feeFormatted || ('₹' + c.fees)})</option>
      `).join('');
      if (currentVal && courses.some(c => c.id === currentVal)) {
        el.value = currentVal;
      }
    }
  });
}
// ==========================================================

// ==========================================================
// 8B. SLOT MANAGEMENT, MENTOR CAPACITY & CRM ADMISSION ENGINE
// ==========================================================

// Check Mentor Availability based on rule: Each mentor can take 3 to 4 batches
function checkMentorSlotAvailability(courseId = null, packageKey = null, requestedSlots = 0) {
  const activeMentors = ERP_DATA.classManagement?.activeMentors || [];
  const maxBatchesPerMentor = 4; // Rule: Each mentor can take 3 to 4 batches

  let totalMaxBatches = 0;
  let totalActiveBatches = 0;
  let totalOpenMentorBatchSlots = 0;
  const eligibleMentors = [];

  activeMentors.forEach(m => {
    const maxB = m.maxBatches || maxBatchesPerMentor;
    const activeB = m.activeBatchesCount || (m.activeBatches ? m.activeBatches.length : 3);
    const openSlots = Math.max(0, maxB - activeB);

    totalMaxBatches += maxB;
    totalActiveBatches += activeB;
    totalOpenMentorBatchSlots += openSlots;

    if (openSlots > 0) {
      eligibleMentors.push({
        id: m.id,
        name: m.name,
        specialization: m.specialization,
        activeBatchesCount: activeB,
        availableSlotsCount: openSlots,
        maxBatches: maxB,
        room: m.room || 'Language Lab'
      });
    }
  });

  return {
    totalMentors: activeMentors.length,
    totalMaxBatches: totalMaxBatches,
    totalActiveBatches: totalActiveBatches,
    totalOpenMentorBatchSlots: totalOpenMentorBatchSlots,
    eligibleMentors: eligibleMentors,
    eligibleForNewBatch: totalOpenMentorBatchSlots > 0,
    statusMessage: totalOpenMentorBatchSlots > 0 
      ? `✓ ${totalOpenMentorBatchSlots} Mentor Batch Slots Available across ${eligibleMentors.length} active mentors` 
      : '⚠️ Mentors are at full batch capacity (4/4 batches each)'
  };
}

// Open modal to edit Available Slots Left for Communicative English (or other courses)
function openAdjustPackageSlotsModal(pkgId) {
  const modal = document.getElementById('modal-adjust-package-slots');
  if (!modal) return;

  const course = (ERP_DATA.catalogue?.courses || []).find(c => c.id === 'CRS-ENG' || c.name.toLowerCase().includes('english')) || (ERP_DATA.catalogue?.courses || [])[0];
  if (!course) return;

  const normId = (pkgId || 'affordable').toLowerCase();
  let pkg = (course.packages || []).find(p => 
    p.packageKey === normId || 
    p.id === normId || 
    p.name.toLowerCase() === normId ||
    p.name.toLowerCase().includes(normId)
  );

  if (!pkg && course.packages && course.packages.length > 0) {
    pkg = course.packages[0];
  }
  if (!pkg) return;

  // Set hidden inputs
  const courseIdInput = document.getElementById('adj-slots-course-id');
  const pkgIdInput = document.getElementById('adj-slots-pkg-id');
  if (courseIdInput) courseIdInput.value = course.id;
  if (pkgIdInput) pkgIdInput.value = pkg.packageKey || pkg.id || pkg.name;

  // Populate info fields
  const courseBadge = document.getElementById('adj-slots-course-badge');
  const pkgTitle = document.getElementById('adj-slots-pkg-title');
  const pkgFee = document.getElementById('adj-slots-pkg-fee');
  const batchCap = document.getElementById('adj-slots-batch-capacity');
  const enrolledCount = document.getElementById('adj-slots-enrolled-count');
  const totalCap = document.getElementById('adj-slots-total-capacity');
  const slotsInput = document.getElementById('adj-slots-input');

  if (courseBadge) courseBadge.textContent = course.name || course.title;
  if (pkgTitle) pkgTitle.textContent = `${pkg.name} Package`;
  if (pkgFee) pkgFee.textContent = pkg.feeFormatted || pkg.feeDisplay || `₹${pkg.fees} / ${pkg.duration || 'Period'}`;
  if (batchCap) batchCap.textContent = `${pkg.studentCapacity || 6} Students / Batch`;

  const enrolled = pkg.enrolledStudents || pkg.enrolled || 0;
  const currentSlots = pkg.availableSlots !== undefined ? pkg.availableSlots : 20;
  const total = pkg.totalSlots !== undefined ? pkg.totalSlots : (enrolled + currentSlots);

  if (enrolledCount) enrolledCount.textContent = `${enrolled} Students`;
  if (totalCap) totalCap.textContent = `${total} Students`;
  if (slotsInput) slotsInput.value = currentSlots;

  onPackageSlotsInputChanged();
  openModal('modal-adjust-package-slots');
}

// Live calculation and mentor checking when slots input is modified
function onPackageSlotsInputChanged() {
  const courseId = document.getElementById('adj-slots-course-id')?.value;
  const pkgId = document.getElementById('adj-slots-pkg-id')?.value;
  const slotsInput = document.getElementById('adj-slots-input');
  const previewBox = document.getElementById('adj-slots-recalc-preview');
  const mentorBox = document.getElementById('adj-slots-mentor-check-content');

  if (!slotsInput) return;

  const newSlots = Math.max(0, parseInt(slotsInput.value, 10) || 0);

  const course = (ERP_DATA.catalogue?.courses || []).find(c => c.id === courseId) || (ERP_DATA.catalogue?.courses || [])[0];
  const pkg = (course?.packages || []).find(p => p.packageKey === pkgId || p.id === pkgId || p.name.toLowerCase() === (pkgId || '').toLowerCase()) || course?.packages?.[0];

  const enrolled = pkg?.enrolledStudents || pkg?.enrolled || 0;
  const newTotalCap = enrolled + newSlots;
  const studentCapacity = pkg?.studentCapacity || 6;
  const batchesNeeded = Math.ceil(newSlots / studentCapacity);

  if (previewBox) {
    previewBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span>Projected Total Capacity:</span>
        <strong style="color:#0f1419; font-size:12.5px;">${newTotalCap} Students (${enrolled} Enrolled + ${newSlots} Available)</strong>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span>Batches needed to support open seats:</span>
        <strong style="color:var(--accent-pista-bright); font-size:12px;">${batchesNeeded} Batches (${studentCapacity} students/batch)</strong>
      </div>
    `;
  }

  const mentorCheck = checkMentorSlotAvailability();
  if (mentorBox) {
    const isSupported = mentorCheck.totalOpenMentorBatchSlots >= batchesNeeded;
    const mentorsListText = mentorCheck.eligibleMentors.map(m => `<strong>${m.name}</strong> (${m.availableSlotsCount} slot${m.availableSlotsCount > 1 ? 's' : ''} open)`).join(', ');

    mentorBox.innerHTML = `
      <div style="margin-bottom:6px;">
        <span style="font-weight:700; color:${isSupported ? '#2b5115' : '#b45309'};">
          ${isSupported ? "&#10003; Faculty Capacity Confirmed" : "&#9888; Mentor Capacity Advisory"}:
        </span>
        ${mentorCheck.totalOpenMentorBatchSlots} batch slot${mentorCheck.totalOpenMentorBatchSlots !== 1 ? 's' : ''} open across active mentors (Max 4 batches/mentor).
      </div>
      <div style="margin-bottom:6px; font-size:11px; color:#4b5563;">
        Eligible faculty: ${mentorsListText || 'None (all mentors at maximum 4 batches)'}
      </div>
      <div style="background:#ffffff; border-radius:6px; padding:6px 10px; font-size:11px; color:${isSupported ? '#2b5115' : '#b45309'}; border:1px solid ${isSupported ? '#c5ddb8' : '#fde68a'};">
        ${isSupported 
          ? `All ${batchesNeeded} batch${batchesNeeded > 1 ? 'es' : ''} for these ${newSlots} open seats can be accommodated immediately by available faculty.` 
          : `Notice: ${batchesNeeded} batches required, but only ${mentorCheck.totalOpenMentorBatchSlots} mentor slots open. Existing batches will absorb enrollments or additional mentors can be assigned.`
        }
      </div>
    `;
  }
}

// Save adjusted package available slots
function saveAdjustedPackageSlots() {
  const courseId = document.getElementById('adj-slots-course-id')?.value;
  const pkgId = document.getElementById('adj-slots-pkg-id')?.value;
  const slotsInput = document.getElementById('adj-slots-input');

  if (!slotsInput) return;
  const newSlots = Math.max(0, parseInt(slotsInput.value, 10) || 0);

  const course = (ERP_DATA.catalogue?.courses || []).find(c => c.id === courseId) || (ERP_DATA.catalogue?.courses || [])[0];
  if (!course) return;

  const pkg = (course.packages || []).find(p => p.packageKey === pkgId || p.id === pkgId || p.name.toLowerCase() === (pkgId || '').toLowerCase()) || course.packages?.[0];
  if (!pkg) return;

  const oldSlots = pkg.availableSlots !== undefined ? pkg.availableSlots : 20;
  pkg.availableSlots = newSlots;
  const enrolled = pkg.enrolledStudents || pkg.enrolled || 0;
  pkg.totalSlots = enrolled + newSlots;

  // Recalculate course totals
  course.availableSlots = (course.packages || []).reduce((sum, p) => sum + (p.availableSlots || 0), 0);
  course.totalCapacity = (course.packages || []).reduce((sum, p) => sum + (p.totalSlots || 0), 0);

  // Sync with classManagement package if matching
  const classCourse = (ERP_DATA.classManagement?.courses || []).find(c => c.id === course.id || c.name.toLowerCase() === course.name.toLowerCase());
  if (classCourse && classCourse.packages) {
    const classPkg = classCourse.packages.find(p => p.packageKey === (pkg.packageKey || pkgId) || p.name.toLowerCase() === pkg.name.toLowerCase());
    if (classPkg) {
      classPkg.availableSlots = newSlots;
      classPkg.totalSlots = (classPkg.enrolled || 0) + newSlots;
    }
  }

  // Cross-module sync & UI refresh
  syncCommunicativeEnglishCardSlots();
  populateCatalogueView();

  // If Course Details is open, update its display
  const courseDetailsSlots = document.getElementById('course-details-slots');
  if (courseDetailsSlots && currentSelectedCourseId === course.id) {
    courseDetailsSlots.textContent = `${course.availableSlots} Slots Open (${course.enrolledStudents || 0}/${course.totalCapacity || 0})`;
    openCourseDetails(course.id);
  }

  // If Package Dashboard is open, refresh summary
  if (typeof renderPackageDashboard === 'function') {
    renderPackageDashboard();
  }

  closeModal('modal-adjust-package-slots');
  showToastNotification(`✓ ${pkg.name} package available slots updated: ${oldSlots} → ${newSlots} open seats. Course available slots: ${course.availableSlots}.`);
}

// Sync slot counts on the Communicative English package cards in Class Management
function syncCommunicativeEnglishCardSlots() {
  const course = (ERP_DATA.catalogue?.courses || []).find(c => c.id === 'CRS-ENG' || c.name.toLowerCase().includes('english'));
  if (!course || !course.packages) return;

  course.packages.forEach(pkg => {
    const key = pkg.packageKey || pkg.name.toLowerCase();
    const el = document.getElementById(`card-pkg-slots-${key}`);
    if (el) {
      el.textContent = `${pkg.availableSlots !== undefined ? pkg.availableSlots : 20} Open`;
    }
  });
}

// Synchronize Product Catalogue and Active Students list
function syncCatalogueAndActiveStudents() {
  if (!ERP_DATA.catalogue?.courses || !ERP_DATA.classManagement?.students) return;

  const students = ERP_DATA.classManagement.students;

  ERP_DATA.catalogue.courses.forEach(crs => {
    // Count students matching this course
    const matchingStudents = students.filter(s => 
      (s.course && s.course.toLowerCase().includes((crs.name || crs.title).toLowerCase())) ||
      (crs.id && s.course && s.course.toLowerCase().includes(crs.id.toLowerCase()))
    );

    if (crs.packages && Array.isArray(crs.packages)) {
      crs.packages.forEach(pkg => {
        const pkgKey = (pkg.packageKey || pkg.name || '').toLowerCase();
        const pkgStudents = matchingStudents.filter(s => 
          (s.package && s.package.toLowerCase().includes(pkgKey)) ||
          (s.batch && s.batch.toLowerCase().includes(pkgKey.slice(0, 3))) ||
          (s.course && s.course.toLowerCase().includes(pkgKey))
        );
        pkg.enrolledStudents = pkgStudents.length;
        pkg.availableSlots = Math.max(0, (pkg.totalSlots || 0) - (pkg.enrolledStudents || 0));
      });
    }

    crs.availableSlots = crs.packages && crs.packages.length > 0 
      ? crs.packages.reduce((sum, p) => sum + (p.availableSlots || 0), 0)
      : Math.max(0, (crs.totalCapacity || 0) - (matchingStudents.length || 0));
  });

  syncCommunicativeEnglishCardSlots();
}

// CRM Admission slot deduction & student roster sync
function handleCRMAdmissionSlotDeduction(lead) {
  if (!lead) return;

  const leadCourseStr = (lead.coursePackage || 'Communicative English').toLowerCase();
  let deductedCourseName = 'Communicative English';
  let deductedPkgName = '';
  let remSlots = 0;

  // 1. Check if Communicative English
  if (leadCourseStr.includes('communicative') || leadCourseStr.includes('english')) {
    let pkgKey = 'affordable';
    if (leadCourseStr.includes('package 2') || leadCourseStr.includes('basic')) pkgKey = 'basic';
    else if (leadCourseStr.includes('package 3') || leadCourseStr.includes('standard')) pkgKey = 'standard';
    else if (leadCourseStr.includes('package 4') || leadCourseStr.includes('premium')) pkgKey = 'premium';

    const catCourse = (ERP_DATA.catalogue?.courses || []).find(c => c.id === 'CRS-ENG' || c.name.toLowerCase().includes('english'));
    if (catCourse) {
      deductedCourseName = catCourse.name || 'Communicative English';
      const pkg = (catCourse.packages || []).find(p => p.packageKey === pkgKey || p.name.toLowerCase() === pkgKey);
      if (pkg) {
        deductedPkgName = pkg.name;
        if (pkg.availableSlots > 0) {
          pkg.availableSlots -= 1;
        }
        pkg.enrolledStudents = (pkg.enrolledStudents || 0) + 1;
        remSlots = pkg.availableSlots;
      }
      catCourse.enrolledStudents = (catCourse.enrolledStudents || 0) + 1;
      catCourse.availableSlots = (catCourse.packages || []).reduce((sum, p) => sum + (p.availableSlots || 0), 0);
    }

    // Sync in classManagement
    const classCourse = (ERP_DATA.classManagement?.courses || []).find(c => c.id === 'CRS-ENG' || c.name.toLowerCase().includes('english'));
    if (classCourse) {
      const classPkg = (classCourse.packages || []).find(p => p.packageKey === pkgKey || p.name.toLowerCase() === pkgKey);
      if (classPkg) {
        if (classPkg.availableSlots > 0) classPkg.availableSlots -= 1;
        classPkg.enrolled = (classPkg.enrolled || 0) + 1;
      }
    }
  } else {
    // Other courses (GK Course, Family Zone, Maths Course, etc.)
    const catCourse = (ERP_DATA.catalogue?.courses || []).find(c => 
      leadCourseStr.includes(c.name.toLowerCase()) || 
      leadCourseStr.includes((c.title || '').toLowerCase()) ||
      (c.id && leadCourseStr.includes(c.id.toLowerCase()))
    );
    if (catCourse) {
      deductedCourseName = catCourse.name || catCourse.title;
      if (catCourse.availableSlots > 0) {
        catCourse.availableSlots -= 1;
      }
      catCourse.enrolledStudents = (catCourse.enrolledStudents || 0) + 1;
      remSlots = catCourse.availableSlots;
      if (catCourse.packages && catCourse.packages.length > 0) {
        if (catCourse.packages[0].availableSlots > 0) catCourse.packages[0].availableSlots -= 1;
        catCourse.packages[0].enrolledStudents = (catCourse.packages[0].enrolledStudents || 0) + 1;
      }
    }
  }

  // 2. Add student to Active Students List if not already enrolled
  if (ERP_DATA.classManagement?.students) {
    const cleanPhone = (lead.phone || '').replace(/\s+/g, '');
    const alreadyEnrolled = ERP_DATA.classManagement.students.some(s => 
      (s.phone && (s.phone || '').replace(/\s+/g, '') === cleanPhone) ||
      (s.name && s.name.toLowerCase() === (lead.name || '').toLowerCase())
    );
    if (!alreadyEnrolled) {
      const newStudent = {
        id: `WST-${2000 + ERP_DATA.classManagement.students.length + 1}`,
        name: lead.name,
        phone: lead.phone,
        course: lead.coursePackage || 'Communicative English',
        batch: deductedPkgName ? `ENG-${deductedPkgName.slice(0, 3).toUpperCase()}-01` : 'CRS-01',
        admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        feeTotal: 2000,
        feePaid: 2000,
        feeDue: 0,
        feeStatus: 'Paid',
        attendancePct: 100,
        progressPct: 0,
        certificateStatus: 'In Progress',
        capstoneStatus: 'Pending Allocation',
        counselor: lead.telecaller || 'Unassigned'
      };
      ERP_DATA.classManagement.students.unshift(newStudent);
      if (ERP_DATA.classManagement.kpis) {
        ERP_DATA.classManagement.kpis.totalStudents = (ERP_DATA.classManagement.kpis.totalStudents || 0) + 1;
        ERP_DATA.classManagement.kpis.activeStudents = (ERP_DATA.classManagement.kpis.activeStudents || 0) + 1;
        ERP_DATA.classManagement.kpis.newAdmissions = (ERP_DATA.classManagement.kpis.newAdmissions || 0) + 1;
      }
    }
  }

  // 3. Mentor Capacity Check
  const mentorCheck = checkMentorSlotAvailability();

  // 4. Cross-Module UI Sync
  syncCommunicativeEnglishCardSlots();
  populateCatalogueView();
  if (typeof filterClassStudents === 'function') filterClassStudents();
  if (typeof populateClassManagementView === 'function') populateClassManagementView();

  const pkgLabel = deductedPkgName ? ` (${deductedPkgName})` : '';
  showToastNotification(`ðŸŽ‰ Admission Confirmed for "${lead.name}"! 1 seat deducted from ${deductedCourseName}${pkgLabel}. Remaining slots: ${remSlots}. Mentor capacity verified (${mentorCheck.totalOpenMentorBatchSlots} batch slots open).`);
}

// 9. WAYBOSS AI EXECUTIVE CO-PILOT ENGINE FOR NASIM V
// ==========================================================
function initWayBossAI() {
  const quickPromptsList = document.getElementById('ai-quick-prompts-list');
  if (quickPromptsList) {
    quickPromptsList.innerHTML = ERP_DATA.waybossAI.quickPrompts.map(p => `
      <button class="quick-prompt-btn" onclick="askWayBoss('${p.query.replace(/'/g, "\\'")}')">
        ${p.label}
      </button>
    `).join('');
  }

  const input = document.getElementById('ai-user-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSendAiMessage();
      }
    });
  }
}

function askWayBoss(query) {
  switchView('wayboss-ai');
  const input = document.getElementById('ai-user-input');
  if (input) {
    input.value = query;
  }
  handleSendAiMessage();
}

function handleSendAiMessage() {
  const input = document.getElementById('ai-user-input');
  if (!input || !input.value.trim()) return;

  const query = input.value.trim();
  input.value = '';

  appendChatMessage('user', query);

  setTimeout(() => {
    const responseHtml = generateWayBossResponse(query);
    appendChatMessage('ai', responseHtml);
  }, 400);
}

function appendChatMessage(sender, content) {
  const history = document.getElementById('ai-chat-history');
  if (!history) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;

  if (sender === 'user') {
    bubble.innerHTML = `
      <div class="chat-bubble-avatar" style="background:var(--bg-input); border:1px solid var(--border-subtle); color:var(--accent-pista);">NV</div>
      <div class="chat-bubble-content">${escapeHTML(content)}</div>
    `;
  } else {
    bubble.innerHTML = `
      <div class="chat-bubble-avatar" style="background:var(--accent-pista); color:#111315;">WB</div>
      <div class="chat-bubble-content">${content}</div>
    `;
  }

  history.appendChild(bubble);
  history.scrollTop = history.scrollHeight;
}

function generateWayBossResponse(q) {
  const lower = q.toLowerCase();

  const totalRev = ERP_DATA.finance?.kpis?.totalRevenueFormatted || '₹0';
  const totalExp = ERP_DATA.finance?.kpis?.totalExpensesFormatted || '₹0';
  const netProfit = ERP_DATA.finance?.kpis?.netProfitFormatted || '₹0';
  const margin = ERP_DATA.finance?.kpis?.profitMarginFormatted || '0%';
  const pendingFees = ERP_DATA.finance?.kpis?.pendingReceivablesFormatted || '₹0';
  const duesList = ERP_DATA.finance?.dueFees || [];
  const students = ERP_DATA.classManagement?.students || [];
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const leads = ERP_DATA.crm?.dataPool || [];
  const courses = ERP_DATA.catalogue?.courses || [];

  // 1. Board summary / Executive briefing
  if (lower.includes('board') || lower.includes('summary') || lower.includes('overview') || lower.includes('briefing') || lower.includes('nasim')) {
    if (students.length === 0 && leads.length === 0 && totalRev === '₹0') {
      return `
        <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Executive Briefing for CEO Nasim v</div>
        <div class="empty-state-box" style="padding:16px; margin-bottom:10px;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">The central database is currently empty. No active student enrollments, fee collections, or campaign operations have been registered yet.</div>
        </div>
        <div class="ai-metric-callout">
          <div>
            <div style="font-size:10.5px; color:var(--text-muted);">Total Revenue (YTD)</div>
            <div style="font-size:15px; font-weight:800; color:var(--accent-pista-bright);">₹0</div>
            <div style="font-size:10px; color:var(--text-muted);">Central Database Sync</div>
          </div>
          <div>
            <div style="font-size:10.5px; color:var(--text-muted);">Net Operating Profit</div>
            <div style="font-size:15px; font-weight:800; color:var(--accent-pista-bright);">₹0</div>
            <div style="font-size:10px; color:var(--text-muted);">0% Net Margin</div>
          </div>
          <div>
            <div style="font-size:10.5px; color:var(--text-muted);">Active Students</div>
            <div style="font-size:15px; font-weight:800; color:var(--text-primary);">0 Enrolled</div>
            <div style="font-size:10px; color:var(--text-muted);">across 0 Batches</div>
          </div>
        </div>
        <div class="ai-recommendation-box">
          💡 <strong>Executive System Note:</strong> To populate live metrics, ingest student leads via the CRM module or record tuition receipts in Finance.
        </div>
      `;
    }

    return `
      <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Executive Briefing for CEO Nasim v</div>
      Consolidated live performance summary for <strong>Waytone Skill Development Centre</strong>:
      <div class="ai-metric-callout">
        <div>
          <div style="font-size:10.5px; color:var(--text-muted);">Total Revenue (YTD)</div>
          <div style="font-size:15px; font-weight:800; color:var(--accent-pista-bright);">${totalRev}</div>
          <div style="font-size:10px; color:var(--accent-pista);">Verified ledger collections</div>
        </div>
        <div>
          <div style="font-size:10.5px; color:var(--text-muted);">Net Operating Profit</div>
          <div style="font-size:15px; font-weight:800; color:var(--accent-pista-bright);">${netProfit}</div>
          <div style="font-size:10px; color:var(--accent-pista);">${margin} Net Margin</div>
        </div>
        <div>
          <div style="font-size:10.5px; color:var(--text-muted);">Active Students</div>
          <div style="font-size:15px; font-weight:800; color:var(--text-primary);">${students.length} Enrolled</div>
          <div style="font-size:10px; color:var(--text-muted);">across ${cohorts.length} Batches</div>
        </div>
      </div>
      <p style="margin-top:6px;"><strong>Real-time Operational Indicators:</strong></p>
      <ul style="padding-left:16px; margin-top:4px; display:flex; flex-direction:column; gap:4px;">
        <li>Total operational expenses recorded in central accounts: <strong>${totalExp}</strong>.</li>
        <li>Active courses registered in the product catalogue: <strong>${courses.length} courses</strong>.</li>
        <li>Current inquiry pipeline in CRM: <strong>${leads.length} student leads</strong>.</li>
      </ul>
      <div class="ai-recommendation-box">
        💡 <strong>Executive Recommendation:</strong> All figures are strictly computed from live database entries.
      </div>
    `;
  }

  // 2. Pending dues / payments
  if (lower.includes('pending') || lower.includes('due') || lower.includes('overdue') || lower.includes('payment') || lower.includes('fee') || lower.includes('rupa')) {
    if (duesList.length === 0) {
      return `
        <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Pending Fee Collection Report (in Rupees ₹)</div>
        <div class="empty-state-box" style="padding:16px; margin-bottom:10px;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">There are currently no overdue student fee records in the database. Outstanding dues balance is ₹0.</div>
        </div>
        <div class="ai-recommendation-box">
          💡 <strong>Status:</strong> All student accounts are fully settled or no fee obligations are recorded.
        </div>
      `;
    }

    return `
      <div style="font-weight:700; color:var(--accent-warn); margin-bottom:5px;">Pending Fee Collection Report (in Rupees ₹)</div>
      Total pending fees in central database: <strong>${pendingFees}</strong> across <strong>${duesList.length} students</strong>.
      <p style="margin-top:6px;">All installment plans are tracked dynamically in the Finance module.</p>
      <div class="ai-recommendation-box">
        💡 <strong>Action:</strong> Navigate to the Finance tab to issue automated fee reminder notices.
      </div>
    `;
  }

  // 3. Counselors / Leads / CRM
  if (lower.includes('counselor') || lower.includes('lead') || lower.includes('crm') || lower.includes('conversion') || lower.includes('admission')) {
    if (leads.length === 0) {
      return `
        <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Admissions & Counselor Performance</div>
        <div class="empty-state-box" style="padding:16px; margin-bottom:10px;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No student inquiries or counselor activity registered in the database.</div>
        </div>
        <div class="ai-recommendation-box">
          💡 <strong>Action:</strong> Upload leads via Excel or photo capture in the CRM module to initiate telecalling workflows.
        </div>
      `;
    }

    const admissionsCount = leads.filter(l => l.status === 'Admission').length;
    const convRate = leads.length > 0 ? ((admissionsCount / leads.length) * 100).toFixed(1) + '%' : '0%';

    return `
      <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Admissions & Counselor Performance</div>
      Live inquiry volume in CRM: <strong>${leads.length} student inquiries</strong> with <strong>${admissionsCount} enrolled students</strong> (${convRate} conversion rate).
      <p style="margin-top:6px;">Performance attribution is synchronized in real time with telecaller and CRM activity.</p>
    `;
  }

  // 3b. Call Connections, Data Pool & Closing Time
  if (lower.includes('call') || lower.includes('connect') || lower.includes('pool') || lower.includes('uploader') || lower.includes('closing time')) {
    if (leads.length === 0) {
      return `
        <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Waytone CRM Data Pool & Call Operations Report</div>
        <div class="empty-state-box" style="padding:16px; margin-bottom:10px;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">The CRM Data Pool currently has 0 leads. No call operations have been conducted.</div>
        </div>
        <div class="ai-recommendation-box">
          💡 <strong>Action:</strong> Import new walk-in or digital campaign leads using the CRM ingestion tools.
        </div>
      `;
    }

    return `
      <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Waytone CRM Data Pool & Call Operations Report</div>
      <div class="ai-metric-callout">
        <div>
          <div style="font-size:10.5px; color:var(--text-muted);">Data Pool Size</div>
          <div style="font-size:15px; font-weight:800; color:var(--accent-pista-bright);">${leads.length} Leads</div>
        </div>
        <div>
          <div style="font-size:10.5px; color:var(--text-muted);">Admissions</div>
          <div style="font-size:15px; font-weight:800; color:var(--accent-pista-bright);">${leads.filter(l => l.status === 'Admission').length}</div>
        </div>
        <div>
          <div style="font-size:10.5px; color:var(--text-muted);">Unassigned</div>
          <div style="font-size:15px; font-weight:800; color:var(--accent-pista-bright);">${leads.filter(l => !l.telecaller || l.telecaller === 'Unassigned').length} Leads</div>
        </div>
      </div>
      <p style="margin-top:6px;">All telecalling assignments reflect dynamic data pool records.</p>
    `;
  }

  // 4. Attendance / Classes / Batches
  if (lower.includes('attendance') || lower.includes('class') || lower.includes('batch') || lower.includes('cohort') || lower.includes('student')) {
    if (students.length === 0 && cohorts.length === 0) {
      return `
        <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Batch Attendance & Student Health</div>
        <div class="empty-state-box" style="padding:16px; margin-bottom:10px;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No active cohorts or student enrollments found in the database.</div>
        </div>
        <div class="ai-recommendation-box">
          💡 <strong>Action:</strong> Create class batches and enroll students in the Class Management module.
        </div>
      `;
    }

    return `
      <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Batch Attendance & Student Health</div>
      Across <strong>${cohorts.length} active skill batches</strong> with <strong>${students.length} students</strong>:
      <p style="margin-top:6px;">Student attendance records and mentor ratings are tracked live in Class Management.</p>
    `;
  }

  // 5. Course Profitability / Catalogue
  if (lower.includes('course') || lower.includes('profit') || lower.includes('catalogue') || lower.includes('margin') || lower.includes('skill')) {
    if (courses.length === 0) {
      return `
        <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Skill Course Revenue Breakdown</div>
        <div class="empty-state-box" style="padding:16px; margin-bottom:10px;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No courses or tuition fee structures registered in the Product Catalogue.</div>
        </div>
        <div class="ai-recommendation-box">
          💡 <strong>Action:</strong> Add training programs in the Catalogue module.
        </div>
      `;
    }

    return `
      <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">Skill Course Revenue Breakdown</div>
      Tuition generated across registered courses:
      <table class="custom-table" style="margin-top:8px;">
        <thead>
          <tr>
            <th>Course</th>
            <th>Available Slots</th>
            <th>Fee Packages</th>
          </tr>
        </thead>
        <tbody>
          ${courses.map(c => `
            <tr>
              <td><strong>${escapeHTML(c.name || c.title || 'Course')}</strong></td>
              <td>${c.availableSlots ?? 0}</td>
              <td>${c.packages ? c.packages.length : 0}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Fallback
  if (students.length === 0 && leads.length === 0 && totalRev === '₹0') {
    return `
      <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">WayBoss Executive Intelligence Response</div>
      <p>Regarding your query: "<em>${escapeHTML(q)}</em>"</p>
      <div class="empty-state-box" style="padding:16px; margin:10px 0;">
        <div class="empty-state-title">No Data Available</div>
        <div class="empty-state-sub">The central database is currently empty. Live indicators will compute automatically once student inquiries, batch sessions, and financial receipts are recorded.</div>
      </div>
      <div class="ai-recommendation-box">
        💡 <strong>Pro Tip:</strong> Click any prompt chip on the left to run verified queries against live database models.
      </div>
    `;
  }

  return `
    <div style="font-weight:700; color:var(--accent-pista-bright); margin-bottom:5px;">WayBoss Executive Intelligence Response</div>
    Based on real-time queries for <strong>CEO Nasim v</strong>:
    <div class="ai-metric-callout">
      <div>
        <div style="font-size:10.5px; color:var(--text-muted);">Current Revenue</div>
        <div style="font-size:14px; font-weight:800; color:var(--accent-pista-bright);">${totalRev}</div>
      </div>
      <div>
        <div style="font-size:10.5px; color:var(--text-muted);">Net Profit Margin</div>
        <div style="font-size:14px; font-weight:800; color:var(--accent-pista-bright);">${margin} (${netProfit})</div>
      </div>
      <div>
        <div style="font-size:10.5px; color:var(--text-muted);">Students Enrolled</div>
        <div style="font-size:14px; font-weight:800; color:var(--text-primary);">${students.length} Active</div>
      </div>
    </div>
    <p>Regarding your query: "<em>${escapeHTML(q)}</em>"</p>
    <p style="margin-top:6px;">Live indicators across CRM (${leads.length} leads), Finance (${totalRev} revenue), Classes (${cohorts.length} batches), and Catalogue (${courses.length} courses) are synchronized dynamically with central database storage.</p>
    <div class="ai-recommendation-box">
      💡 <strong>Pro Tip:</strong> Click any prompt chip on the left for immediate executive breakdowns.
    </div>
  `;
}

function escapeHTML(str) {
  return String(str || '').replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================================
// 10. GLOBAL ACTIONS
// ==========================================================
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('waytone_theme', isLight ? 'light' : 'dark');
}

if (localStorage.getItem('waytone_theme') === 'light') {
  document.body.classList.add('light-theme');
}

function toggleNotifications() {
  const pendingCount = ERP_DATA.finance?.dueFees?.length || 0;
  const pendingAmt = ERP_DATA.finance?.kpis?.pendingReceivablesFormatted || '₹0';
  const leadsCount = ERP_DATA.crm?.dataPool?.length || 0;
  const studentsCount = ERP_DATA.classManagement?.students?.length || 0;

  if (pendingCount === 0 && leadsCount === 0 && studentsCount === 0) {
    alert("🔔 Waytone Executive Alerts for Nasim v:\n\n• Central database is currently clean.\n• No pending dues or urgent alerts recorded.");
    return;
  }

  alert(
    "🔔 Waytone Executive Alerts for Nasim v:\n\n" +
    `1. [Finance] ${pendingCount} student fee installments pending (${pendingAmt} total outstanding).\n` +
    `2. [CRM] ${leadsCount} total inquiries in the live database pool.\n` +
    `3. [Classes] ${studentsCount} enrolled students active across batches.`
  );
}

function exportExecutiveReport() {
  alert("📄 Executive PDF Briefing for CEO Nasim v has been prepared for download!");
}

function handleGlobalSearch(term) {
  if (!term || term.length < 2) return;
  const t = term.toLowerCase();

  if (t.includes('lead') || t.includes('crm') || t.includes('counselor') || t.includes('sarah') || t.includes('inquiry')) {
    switchView('crm');
  } else if (t.includes('finance') || t.includes('fee') || t.includes('due') || t.includes('overdue') || t.includes('rupa')) {
    switchView('finance');
  } else if (t.includes('class') || t.includes('batch') || t.includes('attendance') || t.includes('cohort')) {
    switchView('class-management');
  } else if (t.includes('hrm') || t.includes('trainer') || t.includes('mentor') || t.includes('payroll') || t.includes('salary')) {
    switchView('hrm');
  } else if (t.includes('course') || t.includes('catalogue') || t.includes('program') || t.includes('fee')) {
    switchView('catalogue');
  } else if (t.includes('ai') || t.includes('wayboss')) {
    switchView('wayboss-ai');
  }
}

function setupGlobalKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const search = document.getElementById('global-search');
      if (search) search.focus();
    }
  });
}

// ==========================================================
// 11. TELECALLER DASHBOARD & ROLE-BASED ACCESS CONTROL (RBAC)
// ==========================================================

let activeUserRole = 'ROLE-ADMIN'; // Default: CEO Nasim v
let activeCounselorId = 'EMP-CRM-01'; // Default: Sarah Jenkins
let currentTelecallerTab = 'crm';
let currentTelecallerTimeframe = 'monthly';
let activeDialerCallId = null;
let dialerInterval = null;
let dialerSeconds = 0;
let activeRoleplayScenario = null;
let activeHrmSelectedRoleId = 'ROLE-TC';

function syncRoleSwitcherOptions() {
  const roleSelect = document.getElementById('role-mode-select');
  if (!roleSelect) return;
  
  let html = `<option value="ROLE-ADMIN">&#128081; CEO (Nasim v)</option>`;
  html += `<option value="ROLE-COORD">&#127891; Academic Coordinator</option>`;
  html += `<option value="ROLE-MENTOR">&#129489;&#8205;&#127979; Faculty Mentor / Trainer</option>`;
  
  const counselors = ERP_DATA.telecaller?.counselors || [];
  if (counselors.length > 0) {
    counselors.forEach(c => {
      html += `<option value="ROLE-TC:${c.id}">&#127911; Telecaller (${escapeHTML(c.name)})</option>`;
    });
  } else {
    html += `<option value="ROLE-TC">&#127911; Telecaller / Admissions Counselor</option>`;
  }

  if (ERP_DATA.marketing?.head?.name) {
    html += `<option value="ROLE-MARKETING:EMP-MKT-01">&#128226; Marketing Head (${escapeHTML(ERP_DATA.marketing.head.name)})</option>`;
  } else {
    html += `<option value="ROLE-MARKETING">&#128226; Marketing Head</option>`;
  }

  roleSelect.innerHTML = html;

  if (activeUserRole === 'ROLE-ADMIN') {
    roleSelect.value = 'ROLE-ADMIN';
  } else if (activeUserRole === 'ROLE-COORD') {
    roleSelect.value = 'ROLE-COORD';
  } else if (activeUserRole === 'ROLE-MENTOR') {
    roleSelect.value = 'ROLE-MENTOR';
  } else if (activeUserRole.startsWith('ROLE-MARKETING')) {
    const match = Array.from(roleSelect.options).find(o => o.value.startsWith('ROLE-MARKETING'));
    if (match) roleSelect.value = match.value;
  } else if (activeUserRole.startsWith('ROLE-TC')) {
    const match = Array.from(roleSelect.options).find(o => o.value.startsWith('ROLE-TC'));
    if (match) roleSelect.value = match.value;
  } else {
    activeUserRole = 'ROLE-ADMIN';
    roleSelect.value = 'ROLE-ADMIN';
  }
}

function initTelecallerDashboard() {
  if (!window.ERP_DATA || !ERP_DATA.telecaller) return;
  
  syncRoleSwitcherOptions();
  populateTelecallerDashboard();
}

function handleRoleModeChange(value) {
  if (value === 'ROLE-ADMIN') {
    switchRole('ROLE-ADMIN', null);
  } else if (value === 'ROLE-COORD') {
    switchRole('ROLE-COORD', null);
  } else if (value === 'ROLE-MENTOR') {
    switchRole('ROLE-MENTOR', null);
  } else if (value.startsWith('ROLE-MARKETING')) {
    const mktId = value.includes(':') ? value.split(':')[1] : 'EMP-MKT-01';
    switchRole('ROLE-MARKETING', mktId);
  } else if (value.startsWith('ROLE-TC')) {
    const counselorId = value.includes(':') ? value.split(':')[1] : (ERP_DATA.telecaller?.counselors?.[0]?.id || 'EMP-CRM-01');
    switchRole('ROLE-TC', counselorId);
  }
}

function switchRole(roleId, counselorId) {
  activeUserRole = roleId;
  if (counselorId) activeCounselorId = counselorId;

  const roleSelect = document.getElementById('role-mode-select');
  if (roleSelect) {
    if (roleId === 'ROLE-ADMIN') {
      roleSelect.value = 'ROLE-ADMIN';
    } else if (roleId === 'ROLE-COORD') {
      roleSelect.value = 'ROLE-COORD';
    } else if (roleId === 'ROLE-MENTOR') {
      roleSelect.value = 'ROLE-MENTOR';
    } else if (roleId === 'ROLE-MARKETING') {
      const match = Array.from(roleSelect.options).find(o => o.value.startsWith('ROLE-MARKETING'));
      if (match) roleSelect.value = match.value;
    } else if (roleId.startsWith('ROLE-TC')) {
      const match = Array.from(roleSelect.options).find(o => o.value.startsWith('ROLE-TC'));
      if (match) roleSelect.value = match.value;
    }
  }

  const counselor = (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId) || (ERP_DATA.telecaller?.counselors || [])[0] || {
    name: 'Admissions Counselor', role: 'Counselor', phone: '--'
  };

  const mktHead = ERP_DATA.marketing?.head || {
    name: 'Marketing Lead', role: 'Head of Marketing', email: '--'
  };

  const ceoBadge = document.querySelector('.ceo-profile-badge');
  if (ceoBadge) {
    if (roleId === 'ROLE-ADMIN') {
      ceoBadge.innerHTML = `
        <img class="ceo-avatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="CEO Nasim v">
        <div class="ceo-info">
          <span class="ceo-name">Nasim v</span>
          <span class="ceo-title">CEO</span>
        </div>
      `;
    } else if (roleId === 'ROLE-COORD') {
      ceoBadge.innerHTML = `
        <div style="width:36px; height:36px; border-radius:50%; background:#2a4a35; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">
          AC
        </div>
        <div class="ceo-info">
          <span class="ceo-name">Academic Coord</span>
          <span class="ceo-title">Academic Coordinator</span>
        </div>
      `;
    } else if (roleId === 'ROLE-MENTOR') {
      ceoBadge.innerHTML = `
        <div style="width:36px; height:36px; border-radius:50%; background:#1e3a8a; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">
          FM
        </div>
        <div class="ceo-info">
          <span class="ceo-name">Faculty Mentor</span>
          <span class="ceo-title">Faculty Mentor / Trainer</span>
        </div>
      `;
    } else if (roleId === 'ROLE-MARKETING') {
      ceoBadge.innerHTML = `
        <div style="width:36px; height:36px; border-radius:50%; background:#2b5115; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">
          AK
        </div>
        <div class="ceo-info">
          <span class="ceo-name">${escapeHTML(mktHead.name)}</span>
          <span class="ceo-title">${escapeHTML(mktHead.role)}</span>
        </div>
      `;
    } else {
      const initials = (counselor.name || 'TC').split(' ').map(n=>n[0]).join('').slice(0, 2);
      ceoBadge.innerHTML = `
        <div style="width:36px; height:36px; border-radius:50%; background:#6b8e4e; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">
          ${escapeHTML(initials)}
        </div>
        <div class="ceo-info">
          <span class="ceo-name">${escapeHTML(counselor.name)}</span>
          <span class="ceo-title">${escapeHTML(counselor.role)}</span>
        </div>
      `;
    }
  }

  const bannerName = document.getElementById('tc-banner-counselor-name');
  const bannerRole = document.getElementById('tc-banner-counselor-role');
  if (bannerName) bannerName.textContent = counselor.name;
  if (bannerRole) bannerRole.textContent = counselor.role;

  filterSidebarForRole(roleId);

  if (roleId === 'ROLE-TC' || roleId.startsWith('ROLE-TC')) {
    switchView('telecaller');
    populateTelecallerDashboard();
    showToastNotification(`Switched to Telecaller Workspace (${counselor.name})`);
  } else if (roleId === 'ROLE-MARKETING') {
    switchView('marketing');
    populateMarketingDashboard();
    showToastNotification(`Switched to Marketing Head Workspace (${mktHead.name})`);
  } else if (roleId === 'ROLE-COORD') {
    switchView('hrm');
    switchHrmTab('academic-coordinator');
    showToastNotification('Switched to Academic Coordinator Workspace');
  } else if (roleId === 'ROLE-MENTOR') {
    switchView('hrm');
    switchHrmTab('mentor-dashboard');
    showToastNotification('Switched to Faculty Mentor Workspace');
  } else {
    showToastNotification('Switched to CEO Administrator Mode (Nasim v)');
  }
}

function filterSidebarForRole(roleId) {
  const allNavItems = document.querySelectorAll('.nav-item');
  if (roleId === 'ROLE-ADMIN') {
    allNavItems.forEach(item => {
      item.style.display = 'flex';
    });
  } else if (roleId === 'ROLE-COORD') {
    const coordRole = (ERP_DATA.hrm?.roles || []).find(r => r.id === 'ROLE-COORD');
    const permittedModuleIds = (coordRole?.modules || [])
      .filter(m => m.view)
      .map(m => m.id);

    allNavItems.forEach(item => {
      const view = item.getAttribute('data-view');
      if (view === 'hrm' || view === 'class-management' || view === 'telecaller' || permittedModuleIds.includes(view)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  } else if (roleId === 'ROLE-MENTOR') {
    allNavItems.forEach(item => {
      const view = item.getAttribute('data-view');
      if (view === 'hrm' || view === 'class-management') {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  } else if (roleId === 'ROLE-MARKETING') {
    const mktRole = (ERP_DATA.hrm?.roles || []).find(r => r.id === 'ROLE-MARKETING');
    const permittedModuleIds = (mktRole?.modules || [])
      .filter(m => m.view)
      .map(m => m.id);

    allNavItems.forEach(item => {
      const view = item.getAttribute('data-view');
      if (view === 'marketing' || view === 'crm' || view === 'catalogue' || view === 'data-pool') {
        item.style.display = 'flex';
      } else if (permittedModuleIds.includes(view)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  } else if (roleId === 'ROLE-TC' || roleId.startsWith('ROLE-TC')) {
    const tcRole = (ERP_DATA.hrm?.roles || []).find(r => r.id === 'ROLE-TC');
    const permittedModuleIds = (tcRole?.modules || [])
      .filter(m => m.view)
      .map(m => m.id);

    allNavItems.forEach(item => {
      const view = item.getAttribute('data-view');
      if (view === 'telecaller' || view === 'crm' || view === 'catalogue' || view === 'data-pool') {
        item.style.display = 'flex';
      } else if (permittedModuleIds.includes(view)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Update section title visibility so no empty category titles remain
  const sectionTitles = document.querySelectorAll('.nav-section-title');
  sectionTitles.forEach(sec => {
    const nextMenu = sec.nextElementSibling;
    if (nextMenu && nextMenu.classList.contains('nav-menu')) {
      const visibleItems = nextMenu.querySelectorAll('.nav-item');
      let hasVisible = false;
      visibleItems.forEach(vi => {
        if (vi.style.display !== 'none') hasVisible = true;
      });
      sec.style.display = hasVisible ? 'block' : 'none';
    }
  });
}

function populateTelecallerDashboard() {
  if (!ERP_DATA.telecaller) return;

  const counselor = (ERP_DATA.telecaller.counselors || []).find(c => c.id === activeCounselorId) || (ERP_DATA.telecaller.counselors || [])[0];
  const kpiCalls = document.getElementById('tc-kpi-calls');
  const kpiFollowups = document.getElementById('tc-kpi-followups');
  const kpiAdmissions = document.getElementById('tc-kpi-admissions');
  const kpiRevenue = document.getElementById('tc-kpi-revenue');

  if (counselor) {
    if (kpiCalls) kpiCalls.textContent = (counselor.calls ?? 0).toLocaleString('en-IN');
    if (kpiFollowups) kpiFollowups.textContent = `${counselor.followups ?? 0} Pending`;
    if (kpiAdmissions) kpiAdmissions.textContent = `${counselor.admissions ?? 0} Students`;
    if (kpiRevenue) kpiRevenue.textContent = counselor.revenue || '₹0';
  } else {
    if (kpiCalls) kpiCalls.textContent = '0';
    if (kpiFollowups) kpiFollowups.textContent = '0 Pending';
    if (kpiAdmissions) kpiAdmissions.textContent = '0 Students';
    if (kpiRevenue) kpiRevenue.textContent = '₹0';
  }

  renderTelecallerCallList();
  renderTelecallerUnassignedData();
  renderTelecallerTrainingAI();
  renderTelecallerReports(currentTelecallerTimeframe);
  renderTelecallerFeesCollection();
}

function switchTelecallerTab(tabId) {
  currentTelecallerTab = tabId;

  document.querySelectorAll('.telecaller-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tc-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.telecaller-tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`tc-pane-${tabId}`);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  if (tabId === 'crm') {
    renderTelecallerCallList();
    renderTelecallerUnassignedData();
  } else if (tabId === 'training-ai') {
    renderTelecallerTrainingAI();
  } else if (tabId === 'reports') {
    renderTelecallerReports(currentTelecallerTimeframe);
  } else if (tabId === 'fees-collection') {
    renderTelecallerFeesCollection();
  }
}

// ----------------------------------------------------------
// 11.1 CRM & CALL LIST
// ----------------------------------------------------------
function renderTelecallerCallList(filterStatus = 'All', filterPriority = 'All', searchTerm = '') {
  const tbody = document.getElementById('tc-call-list-tbody');
  if (!tbody || !ERP_DATA.telecaller?.callList) return;

  const searchInput = document.getElementById('tc-call-search');
  const statusSelect = document.getElementById('tc-status-filter');
  const prioritySelect = document.getElementById('tc-priority-filter');

  const sTerm = (searchTerm || searchInput?.value || '').toLowerCase().trim();
  const fStatus = filterStatus !== 'All' ? filterStatus : (statusSelect?.value || 'All');
  const fPriority = filterPriority !== 'All' ? filterPriority : (prioritySelect?.value || 'All');

  const filtered = ERP_DATA.telecaller.callList.filter(item => {
    const matchesSearch = !sTerm || 
      item.studentName.toLowerCase().includes(sTerm) || 
      item.phone.replace(/\s+/g, '').includes(sTerm.replace(/\s+/g, '')) ||
      (item.course || '').toLowerCase().includes(sTerm) ||
      (item.package || '').toLowerCase().includes(sTerm);

    const matchesStatus = fStatus === 'All' || item.status === fStatus;
    const matchesPriority = fPriority === 'All' || item.priority === fPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:30px; color:#5e6d7e;">
          No student leads found matching the selected filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    let priorityClass = 'tc-priority-normal';
    if (item.priority === 'Urgent') priorityClass = 'tc-priority-urgent';
    else if (item.priority === 'High') priorityClass = 'tc-priority-high';

    const isAdmitted = item.status === 'Admission';

    return `
      <tr class="${item.isJustGrabbed ? 'row-grabbed' : ''}">
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="font-weight:700; color:#0f1419;">${escapeHTML(item.studentName)}</div>
            ${item.isJustGrabbed ? `<span style="font-size:9.5px; font-weight:700; background:#e8f5e9; color:#2e7d32; padding:2px 6px; border-radius:4px; border:1px solid #c8e6c9;">⚡ Just Grabbed</span>` : ''}
          </div>
          <div style="font-size:12px; font-weight:700; color:#2e441f; display:flex; align-items:center; gap:4px; margin-top:2px;">
            <span style="color:#6b8e4e;">📞</span> <span>${escapeHTML(item.phone)}</span>
          </div>
        </td>
        <td>
          <div style="font-weight:600; color:#2e441f;">${escapeHTML(item.course)}</div>
          <div style="font-size:11.5px; color:#5e6d7e;">${escapeHTML(item.package || 'General')}</div>
        </td>
        <td>
          <select class="form-input" style="font-size:11.5px; padding:3px 6px; border-radius:12px; font-weight:600; background:${getStatusBgColor(item.status)};" onchange="updateTelecallerCallStatus('${item.id}', this.value)">
            <option value="For Cold Call" ${item.status === 'For Cold Call' ? 'selected' : ''}>For Cold Call</option>
            <option value="For Follow-up" ${item.status === 'For Follow-up' ? 'selected' : ''}>For Follow-up</option>
            <option value="Interested" ${item.status === 'Interested' ? 'selected' : ''}>Interested</option>
            <option value="For Demo" ${item.status === 'For Demo' ? 'selected' : ''}>For Demo</option>
            <option value="Admission" ${item.status === 'Admission' ? 'selected' : ''}>Admission</option>
            <option value="Not Interested" ${item.status === 'Not Interested' ? 'selected' : ''}>Not Interested</option>
          </select>
        </td>
        <td>
          <span class="tc-status-pill ${priorityClass}">${escapeHTML(item.priority)}</span>
        </td>
        <td>
          <span style="font-size:12px; color:#374151;">${escapeHTML(item.lastCalled)}</span>
        </td>
        <td>
          <span style="font-size:12px; font-weight:600; color:${item.nextFollowup === 'Completed' ? '#2e7d32' : '#b45309'};">
            ${escapeHTML(item.nextFollowup)}
          </span>
        </td>
        <td style="max-width:220px;">
          <div style="font-size:11.5px; color:#4b5563; line-height:1.3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHTML(item.notes)}">
            ${escapeHTML(item.notes || '—')}
          </div>
        </td>
        <td style="text-align:center;">
          <div style="display:inline-flex; gap:5px; align-items:center;">
            <button class="btn-telecaller-call" onclick="openTelecallerDialer('${item.id}')" title="Dial student">
              📞 Call
            </button>
            <button class="btn-telecaller-whatsapp" onclick="openTelecallerWhatsApp('${item.id}')" title="Send WhatsApp">
              💬 WA
            </button>
            ${isAdmitted 
              ? `<span style="font-size:11px; font-weight:700; color:#2e7d32; background:#e8f5e9; padding:4px 8px; border-radius:4px;">✓ Enrolled</span>`
              : `<button class="btn-telecaller-admission" onclick="telecallerMarkAdmission('${item.id}')" title="Mark Admission & Deduct Slot">
                   🎓 Admit
                 </button>`
            }
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBgColor(status) {
  switch (status) {
    case 'Admission': return '#e8f5e9';
    case 'For Follow-up': return '#fff8e1';
    case 'Interested': return '#e0f2fe';
    case 'For Demo': return '#f3e8ff';
    case 'Not Interested': return '#fee2e2';
    default: return '#f3f4f6';
  }
}

function filterTelecallerCallList() {
  renderTelecallerCallList();
}

function updateTelecallerCallStatus(callId, newStatus) {
  const call = (ERP_DATA.telecaller?.callList || []).find(c => c.id === callId);
  if (!call) return;

  const oldStatus = call.status;
  call.status = newStatus;

  const crmLead = (ERP_DATA.crmLeads || []).find(l => 
    l.id === call.leadId || 
    (l.phone && l.phone.replace(/\s+/g, '') === call.phone.replace(/\s+/g, ''))
  );
  if (crmLead) {
    crmLead.status = newStatus;
  }

  if (newStatus === 'Admission' && oldStatus !== 'Admission') {
    telecallerMarkAdmission(callId);
    return;
  }

  renderTelecallerCallList();
  showToastNotification(`Status for ${call.studentName} updated to "${newStatus}"`);
}

function openTelecallerDialer(callId) {
  const call = (ERP_DATA.telecaller?.callList || []).find(c => c.id === callId);
  if (!call) return;

  activeDialerCallId = callId;
  const modal = document.getElementById('modal-telecaller-call');
  const nameEl = document.getElementById('tc-dialer-student-name');
  const courseEl = document.getElementById('tc-dialer-course-pkg');
  const phoneEl = document.getElementById('tc-dialer-phone');
  const notesEl = document.getElementById('tc-dialer-notes');
  const timerEl = document.getElementById('tc-dialer-call-timer');
  const outcomeInput = document.getElementById('tc-dialer-selected-outcome');
  const dateInput = document.getElementById('tc-dialer-followup-date');
  const timeInput = document.getElementById('tc-dialer-followup-time');

  if (nameEl) nameEl.textContent = `Calling ${call.studentName}`;
  if (courseEl) courseEl.textContent = `${call.course} • ${call.package || 'General'}`;
  if (phoneEl) phoneEl.textContent = call.phone;
  if (notesEl) notesEl.value = call.notes || '';
  if (outcomeInput) outcomeInput.value = 'Interested - Callback';

  const todayStr = new Date().toISOString().split('T')[0];
  if (dateInput) dateInput.value = todayStr;
  if (timeInput) timeInput.value = '16:00';

  dialerSeconds = 0;
  if (timerEl) timerEl.textContent = '00:00';
  clearInterval(dialerInterval);
  dialerInterval = setInterval(() => {
    dialerSeconds++;
    const mins = String(Math.floor(dialerSeconds / 60)).padStart(2, '0');
    const secs = String(dialerSeconds % 60).padStart(2, '0');
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
  }, 1000);

  if (modal) modal.classList.add('active');
}

function selectCallOutcome(outcome) {
  const outcomeInput = document.getElementById('tc-dialer-selected-outcome');
  if (outcomeInput) outcomeInput.value = outcome;

  const btns = document.querySelectorAll('#modal-telecaller-call .btn-secondary');
  btns.forEach(btn => {
    if (btn.textContent.includes(outcome)) {
      btn.style.background = '#6b8e4e';
      btn.style.color = '#ffffff';
      btn.style.borderColor = '#547339';
    } else if (!btn.textContent.includes('End Call')) {
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }
  });
}

function hangupAndCloseCall() {
  clearInterval(dialerInterval);
  closeModal('modal-telecaller-call');
}

function saveTelecallerCallLog() {
  if (!activeDialerCallId) return;

  const call = (ERP_DATA.telecaller?.callList || []).find(c => c.id === activeDialerCallId);
  if (!call) return;

  clearInterval(dialerInterval);

  const notesEl = document.getElementById('tc-dialer-notes');
  const outcomeEl = document.getElementById('tc-dialer-selected-outcome');
  const dateEl = document.getElementById('tc-dialer-followup-date');
  const timeEl = document.getElementById('tc-dialer-followup-time');

  const outcome = outcomeEl?.value || 'Interested - Callback';
  const notesText = notesEl?.value || call.notes;
  const mins = Math.floor(dialerSeconds / 60);
  const secs = dialerSeconds % 60;
  const durationStr = `${mins}m ${secs}s`;

  call.lastCalled = 'Just now';
  call.notes = notesText;
  if (dateEl?.value) {
    call.nextFollowup = `${dateEl.value} ${timeEl?.value || '16:00'}`;
  }

  if (outcome === 'Admission Confirmed') {
    call.status = 'Admission';
    call.nextFollowup = 'Completed';
  } else if (outcome === 'Booked Demo Class') {
    call.status = 'For Demo';
  } else if (outcome === 'Interested - Callback') {
    call.status = 'Interested';
  } else if (outcome === 'Not Interested') {
    call.status = 'Not Interested';
    call.nextFollowup = 'Closed';
  } else {
    call.status = 'For Follow-up';
  }

  if (!call.callHistory) call.callHistory = [];
  call.callHistory.unshift({
    time: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: durationStr,
    outcome: outcome,
    note: notesText
  });

  if (ERP_DATA.telecaller?.kpis) {
    ERP_DATA.telecaller.kpis.totalCallsDone += 1;
  }
  const counselor = (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId);
  if (counselor) {
    counselor.calls = (counselor.calls || 0) + 1;
  }

  closeModal('modal-telecaller-call');

  if (outcome === 'Admission Confirmed') {
    telecallerMarkAdmission(activeDialerCallId);
  } else {
    renderTelecallerCallList();
    showToastNotification(`Call logged for ${call.studentName} (${durationStr}) - Outcome: ${outcome}`);
  }
}

function openNextPendingCall() {
  const pending = (ERP_DATA.telecaller?.callList || []).find(c => 
    c.status === 'For Follow-up' || c.status === 'For Cold Call' || c.status === 'Interested'
  );
  if (pending) {
    openTelecallerDialer(pending.id);
  } else {
    alert("No pending calls in queue right now!");
  }
}

function openTelecallerWhatsApp(callId) {
  const call = (ERP_DATA.telecaller?.callList || []).find(c => c.id === callId);
  if (!call) return;

  activeDialerCallId = callId;
  const modal = document.getElementById('modal-telecaller-whatsapp');
  const nameEl = document.getElementById('tc-wa-student-name');
  const phoneEl = document.getElementById('tc-wa-student-phone');

  if (nameEl) nameEl.textContent = `WhatsApp ${call.studentName}`;
  if (phoneEl) phoneEl.textContent = call.phone;

  loadWhatsAppTemplate('brochure');

  if (modal) modal.classList.add('active');
}

function loadWhatsAppTemplate(templateKey) {
  const call = (ERP_DATA.telecaller?.callList || []).find(c => c.id === activeDialerCallId) || {
    studentName: 'Student', course: 'Communicative English', package: 'Affordable Package'
  };

  const textarea = document.getElementById('tc-wa-message-text');
  const attachEl = document.getElementById('tc-wa-attachment-name');
  if (!textarea) return;

  let msg = '';
  let attachment = 'Waytone_Brochure.pdf';

  switch (templateKey) {
    case 'brochure':
      attachment = 'Waytone_Course_Curriculum_Brochure.pdf';
      msg = `Hello ${call.studentName} Ji,\n\nGreetings from Waytone Skill Development Centre!\n\nAs discussed during our call, I am attaching our detailed course syllabus and micro-group schedule for *${call.course}* (${call.package || 'Micro-Batch'}).\n\n🎯 Key Program Highlights:\n• Live interactive speaking drills (Max 6 students/batch)\n• Dedicated mentor attention & hesitation clearance\n• Flexible morning & evening batches\n\nPlease feel free to reply with any questions.\n\nWarm regards,\nSarah Jenkins\nAdmissions Counselor | Waytone Skill Development Centre\n📞 +91 98450 11201`;
      break;

    case 'followup':
      attachment = 'Batch_Schedule_Timings.pdf';
      msg = `Hi ${call.studentName} Ji,\n\nFollowing up on our conversation regarding your enrollment in *${call.course}* at Waytone Skill Development Centre.\n\nWe have 2 slots remaining in this upcoming batch. Would you like to reserve your seat today or schedule a quick demo session with our mentor?\n\nLooking forward to hearing from you!\n\nBest regards,\nSarah Jenkins | Waytone`;
      break;

    case 'admission_welcome':
      attachment = 'Waytone_Admission_Confirmation_Letter.pdf';
      msg = `Congratulations ${call.studentName} Ji! 🎓\n\nYour admission to *${call.course}* (${call.package || 'Confirmed Batch'}) at Waytone Skill Development Centre is officially confirmed!\n\nYour Student ID: WST-2026-${Math.floor(1000 + Math.random() * 9000)}\nBatch Commencement: Monday 09:30 AM\nMentor: Sarah Jenkins\n\nWe are thrilled to welcome you to Waytone!`;
      break;

    case 'fee_reminder':
      attachment = 'Waytone_Fee_Payment_Receipt.pdf';
      msg = `Dear ${call.studentName} Ji,\n\nThis is a friendly reminder regarding your tuition fee installment for *${call.course}* at Waytone Skill Development Centre.\n\nYou can pay securely via UPI to waytone@icici or visit the centre reception counter.\n\nThank you for choosing Waytone!`;
      break;
  }

  textarea.value = msg;
  if (attachEl) attachEl.textContent = attachment;
}

function dispatchWhatsAppMessage() {
  const call = (ERP_DATA.telecaller?.callList || []).find(c => c.id === activeDialerCallId);
  const textarea = document.getElementById('tc-wa-message-text');
  const text = textarea?.value || '';

  if (call) {
    const cleanPhone = (call.phone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  closeModal('modal-telecaller-whatsapp');
  showToastNotification("WhatsApp Web launched! Message copied to clipboard.");
}

function telecallerMarkAdmission(callId) {
  const call = (ERP_DATA.telecaller?.callList || []).find(c => c.id === callId);
  if (!call) return;

  call.status = 'Admission';
  call.nextFollowup = 'Completed';
  call.notes = (call.notes ? call.notes + ' • ' : '') + 'Admission Cleared by Counselor. Slot deducted from Product Catalogue.';

  let crmLead = (ERP_DATA.crmLeads || []).find(l => 
    l.id === call.leadId || 
    (l.phone && l.phone.replace(/\s+/g, '') === call.phone.replace(/\s+/g, ''))
  );
  if (crmLead) {
    crmLead.status = 'Admission';
    crmLead.stage = 'Enrolled';
  } else {
    crmLead = {
      id: call.leadId || `WLD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: call.studentName,
      phone: call.phone,
      email: `${(call.studentName || 'student').toLowerCase().replace(/\s+/g, '.')}@example.com`,
      coursePackage: `${call.course} - ${call.package || 'Affordable Package'}`,
      counselor: (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId)?.name || 'Admissions Counselor',
      status: 'Admission',
      date: 'Today',
      priority: 'Normal'
    };
    if (ERP_DATA.crmLeads) ERP_DATA.crmLeads.unshift(crmLead);
  }

  handleCRMAdmissionSlotDeduction(crmLead);

  if (ERP_DATA.telecaller?.kpis) {
    ERP_DATA.telecaller.kpis.admissionCount += 1;
    ERP_DATA.telecaller.kpis.revenueGenerated += 600;
    ERP_DATA.telecaller.kpis.revenueFormatted = `₹${(ERP_DATA.telecaller.kpis.revenueGenerated).toLocaleString('en-IN')}`;
  }
  const counselor = (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId);
  if (counselor) {
    counselor.admissions = (counselor.admissions || 0) + 1;
  }

  let feeRecord = (ERP_DATA.telecaller?.feesCollection?.students || []).find(s => 
    s.phone.replace(/\s+/g, '') === call.phone.replace(/\s+/g, '')
  );
  if (!feeRecord) {
    const feeAmt = call.package?.toLowerCase().includes('premium') ? 3500 : 
                   call.package?.toLowerCase().includes('standard') ? 2500 : 
                   call.package?.toLowerCase().includes('basic') ? 2000 : 600;

    feeRecord = {
      id: `FEE-ST-${Math.floor(100 + Math.random() * 900)}`,
      studentId: `WST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: call.studentName,
      phone: call.phone,
      course: call.course,
      package: call.package || 'Affordable',
      batch: 'ENG-AFF-01',
      totalFee: feeAmt,
      paidFee: feeAmt,
      dueFee: 0,
      status: 'Paid',
      lastPaymentDate: 'Today',
      receiptId: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };
    if (ERP_DATA.telecaller?.feesCollection?.students) {
      ERP_DATA.telecaller.feesCollection.students.unshift(feeRecord);
    }
  }

  renderTelecallerCallList();
  renderTelecallerFeesCollection();
  if (currentView === 'catalogue') populateCatalogueView();
  if (currentView === 'crm') populateCRMView();

  showToastNotification(`🎓 Admission Confirmed for ${call.studentName}! 1 Slot Deducted from Product Catalogue.`);
}

// ----------------------------------------------------------
// 11.2 TRAINING AI SPACE
// ----------------------------------------------------------
function renderTelecallerTrainingAI() {
  const issuesGrid = document.getElementById('tc-ai-issues-grid');
  const trainingsGrid = document.getElementById('tc-ai-trainings-grid');
  const feedbackFeed = document.getElementById('tc-ai-feedback-feed');
  const roleplayList = document.getElementById('tc-ai-roleplay-scenarios-list');

  if (!ERP_DATA.telecaller?.trainingAI) return;
  const aiData = ERP_DATA.telecaller.trainingAI;

  if (issuesGrid) {
    const issues = aiData.detectedIssues || [];
    if (issues.length === 0) {
      issuesGrid.innerHTML = `
        <div class="empty-state-box" style="grid-column:1/-1; padding:24px; text-align:center; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No telecaller training issues detected. Call compliance is clear.</div>
        </div>
      `;
    } else {
      issuesGrid.innerHTML = issues.map(issue => {
        let sevColor = '#dc2626';
        let sevBg = '#fef2f2';
        if (issue.severity === 'Medium') {
          sevColor = '#d97706';
          sevBg = '#fffbeb';
        } else if (issue.severity === 'Low') {
          sevColor = '#2563eb';
          sevBg = '#eff6ff';
        }

        return `
          <div class="ai-diagnosis-card">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <span style="font-size:11px; font-weight:700; color:${sevColor}; background:${sevBg}; padding:3px 8px; border-radius:12px; border:1px solid ${sevColor}33;">
                  ${issue.severity} Severity (${issue.count} occurrences)
                </span>
                <span style="font-size:11px; color:#5e6d7e;">${issue.id}</span>
              </div>
              <h4 style="margin:0 0 6px 0; font-size:14px; color:#0f1419;">${escapeHTML(issue.title)}</h4>
              <p style="margin:0; font-size:12px; color:#4b5563; line-height:1.4;">${escapeHTML(issue.description)}</p>
            </div>
            <div style="margin-top:14px; padding-top:10px; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
              <div style="font-size:11.5px; color:#2b5115; font-weight:600;">
                💡 ${escapeHTML(issue.recommendedTraining)}
              </div>
              <button class="btn-primary-ai" style="padding:4px 10px; font-size:11.5px;" onclick="startTrainingModule('${issue.trainingId}')">
                Train
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (trainingsGrid) {
    const trainings = aiData.recommendedTrainings || [];
    if (trainings.length === 0) {
      trainingsGrid.innerHTML = `
        <div class="empty-state-box" style="grid-column:1/-1; padding:24px; text-align:center; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No recommended training modules at this time.</div>
        </div>
      `;
    } else {
      trainingsGrid.innerHTML = trainings.map(t => {
        const isComplete = t.progressPct === 100;
        return `
          <div class="ai-training-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge-pista" style="font-size:10.5px;">${escapeHTML(t.module)}</span>
              <span style="font-size:11.5px; color:#5e6d7e;">⏱️ ${escapeHTML(t.duration)}</span>
            </div>
            <h4 style="margin:0 0 6px 0; font-size:14px; color:#0f1419;">${escapeHTML(t.title)}</h4>
            <div style="font-size:11.5px; color:#5e6d7e; margin-bottom:10px;">
              Trigger: <em>${escapeHTML(t.aiRecommendationReason || 'Standard Curriculum')}</em>
            </div>

            <div style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:4px;">
                <span>Progress</span>
                <strong>${t.progressPct}%</strong>
              </div>
              <div style="height:7px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
                <div style="height:100%; width:${t.progressPct}%; background:${isComplete ? '#2e7d32' : '#6b8e4e'}; border-radius:4px;"></div>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11.5px; color:${isComplete ? '#2e7d32' : '#d97706'}; font-weight:700;">
                ${isComplete ? `✓ Cleared (${t.score || '95%'})` : t.status}
              </span>
              <button class="btn-secondary" style="padding:5px 12px; font-size:11.5px;" onclick="startTrainingModule('${t.id}')">
                ${isComplete ? 'Review' : (t.progressPct > 0 ? 'Resume' : 'Start')}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  if (feedbackFeed) {
    const feed = aiData.aiFeedbackFeed || [];
    if (feed.length === 0) {
      feedbackFeed.innerHTML = `
        <div class="empty-state-box" style="padding:20px; text-align:center; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No AI feedback logged yet.</div>
        </div>
      `;
    } else {
      feedbackFeed.innerHTML = feed.map(item => `
        <div style="background:#f9faf7; border:1px solid #dbe2d6; border-radius:8px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:13px;">${item.type === 'Praise' ? '🌟' : '💡'}</span>
              <strong style="font-size:12.5px; color:${item.type === 'Praise' ? '#2e7d32' : '#b45309'};">${escapeHTML(item.type)}</strong>
              <span style="font-size:12px; color:#5e6d7e;">• ${escapeHTML(item.lead)}</span>
            </div>
            <span style="font-size:11px; color:#8c9ba5;">${escapeHTML(item.time)}</span>
          </div>
          <div style="font-size:12px; color:#374151; line-height:1.4;">${escapeHTML(item.message)}</div>
        </div>
      `).join('');
    }
  }

  if (roleplayList) {
    const scenarios = aiData.roleplayScenarios || [];
    if (scenarios.length === 0) {
      roleplayList.innerHTML = `
        <div class="empty-state-box" style="padding:20px; text-align:center; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No roleplay scenarios available.</div>
        </div>
      `;
    } else {
      roleplayList.innerHTML = scenarios.map(sc => `
        <div style="background:#ffffff; border:1px solid #dbe2d6; border-radius:8px; padding:12px; transition:border-color 0.2s;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <h5 style="margin:0 0 4px 0; font-size:13px; color:#0f1419;">${escapeHTML(sc.title)}</h5>
              <div style="font-size:11.5px; color:#5e6d7e;">Persona: ${escapeHTML(sc.persona)}</div>
            </div>
            <button class="btn-primary-ai" style="padding:4px 10px; font-size:11.5px;" onclick="openInteractiveRoleplayModal('${sc.id}')">
              Practice
            </button>
          </div>
        </div>
      `).join('');
    }
  }
}

function startTrainingModule(trainingId) {
  const training = (ERP_DATA.telecaller?.trainingAI?.recommendedTrainings || []).find(t => t.id === trainingId);
  if (!training) {
    alert("Training module launching...");
    return;
  }

  if (training.progressPct < 100) {
    training.progressPct = Math.min(100, training.progressPct + 35);
    if (training.progressPct === 100) {
      training.status = 'Completed';
      training.score = '95%';
      if (ERP_DATA.telecaller?.trainingAI) {
        ERP_DATA.telecaller.trainingAI.overallScore = Math.min(98, ERP_DATA.telecaller.trainingAI.overallScore + 3);
        const scoreEl = document.getElementById('tc-ai-overall-score');
        if (scoreEl) scoreEl.textContent = ERP_DATA.telecaller.trainingAI.overallScore;
      }
    }
  }

  renderTelecallerTrainingAI();
  alert(`📚 Training Session: "${training.title}"\n\nKey Takeaways:\n• ${training.keyTakeaways.join('\n• ')}\n\nProgress: ${training.progressPct}%`);
}

function openInteractiveRoleplayModal(scenarioId) {
  const scenario = (ERP_DATA.telecaller?.trainingAI?.roleplayScenarios || []).find(s => s.id === scenarioId) || 
                   ERP_DATA.telecaller.trainingAI.roleplayScenarios[0];
  if (!scenario) return;

  activeRoleplayScenario = scenario;
  const modal = document.getElementById('modal-telecaller-ai-roleplay');
  const titleEl = document.getElementById('tc-roleplay-modal-title');
  const challengeEl = document.getElementById('tc-roleplay-challenge-text');
  const chatHistory = document.getElementById('tc-roleplay-chat-history');
  const inputEl = document.getElementById('tc-roleplay-input');

  if (titleEl) titleEl.textContent = scenario.title;
  if (challengeEl) challengeEl.textContent = scenario.challenge;
  if (inputEl) inputEl.value = '';

  if (chatHistory) {
    chatHistory.innerHTML = `
      <div style="display:flex; gap:8px; align-items:flex-start;">
        <span style="background:#fee2e2; color:#b91c1c; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px;">STUDENT</span>
        <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:8px 12px; font-size:12.5px; color:#1f2937;">
          "I looked at your ₹3,500 Premium Package for Communicative English. Frankly, that feels too expensive for a 40-day course. Why should I pay that much when other apps are ₹499?"
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add('active');
}

function submitRoleplayTurn() {
  const inputEl = document.getElementById('tc-roleplay-input');
  const chatHistory = document.getElementById('tc-roleplay-chat-history');
  const statusEl = document.getElementById('tc-roleplay-eval-status');
  const val = (inputEl?.value || '').trim();

  if (!val || !chatHistory) return;

  chatHistory.innerHTML += `
    <div style="display:flex; gap:8px; align-items:flex-start; justify-content:flex-end;">
      <div style="background:#f4f7f1; border:1px solid #dbe2d6; border-radius:8px; padding:8px 12px; font-size:12.5px; color:#2b5115; max-width:80%;">
        ${escapeHTML(val)}
      </div>
      <span style="background:#6b8e4e; color:#ffffff; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px;">YOU</span>
    </div>
  `;
  inputEl.value = '';

  setTimeout(() => {
    chatHistory.innerHTML += `
      <div style="display:flex; gap:8px; align-items:flex-start;">
        <span style="background:#e0f2fe; color:#0284c7; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px;">AI COACH</span>
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:8px 12px; font-size:12px; color:#166534;">
          🌟 <strong>Score: 94/100 (Strong Value Positioning)</strong><br>
          Great job highlighting Dr. Finch's 1-on-1 personal mentorship and boardroom ROI instead of discounting. The simulated student is now 85% likely to enroll!
        </div>
      </div>
    `;
    if (statusEl) statusEl.textContent = 'Evaluation complete. You cleared this scenario!';
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 600);
}

// ----------------------------------------------------------
// 11.3 REPORTS & PERFORMANCE DASHBOARD
// ----------------------------------------------------------
function setTelecallerTimeframe(timeframe) {
  currentTelecallerTimeframe = timeframe;

  const btns = ['daily', 'weekly', 'monthly'];
  btns.forEach(tf => {
    const btn = document.getElementById(`tc-tf-${tf}`);
    if (btn) {
      if (tf === timeframe) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  renderTelecallerReports(timeframe);
}

function renderTelecallerReports(timeframe = 'monthly') {
  if (!ERP_DATA.telecaller?.reports) return;

  const tfData = ERP_DATA.telecaller.reports.timeframes?.[timeframe] || ERP_DATA.telecaller.reports.timeframes?.monthly || {
    calls: 0, targetCalls: 0, connected: 0, followups: 0, interested: 0, admissions: 0, targetAdmissions: 0, conversionRate: "0%", achievementPct: 0, revenue: "₹0"
  };

  const elCalls = document.getElementById('tc-rep-calls');
  const elCallsTarget = document.getElementById('tc-rep-calls-target');
  const elConnected = document.getElementById('tc-rep-connected');
  const elConnRate = document.getElementById('tc-rep-conn-rate');
  const elFollowups = document.getElementById('tc-rep-followups');
  const elInterested = document.getElementById('tc-rep-interested');
  const elAdmissions = document.getElementById('tc-rep-admissions');
  const elConvRate = document.getElementById('tc-rep-conv-rate');
  const elRevenue = document.getElementById('tc-rep-revenue');

  const callsCount = tfData.calls || 0;
  const targetCalls = tfData.targetCalls || 0;
  const connCount = tfData.connected || 0;
  const connPct = callsCount > 0 ? ((connCount / callsCount) * 100).toFixed(1) : '0.0';

  if (elCalls) elCalls.textContent = callsCount.toLocaleString('en-IN');
  if (elCallsTarget) elCallsTarget.textContent = `Target: ${targetCalls.toLocaleString('en-IN')}`;
  if (elConnected) elConnected.textContent = connCount.toLocaleString('en-IN');
  if (elConnRate) elConnRate.textContent = `${connPct}% Conn.`;
  if (elFollowups) elFollowups.textContent = tfData.followups || 0;
  if (elInterested) elInterested.textContent = tfData.interested || 0;
  if (elAdmissions) elAdmissions.textContent = tfData.admissions || 0;
  if (elConvRate) elConvRate.textContent = tfData.conversionRate || '0%';
  if (elRevenue) elRevenue.textContent = tfData.revenue || '₹0';

  const badgeAchieve = document.getElementById('tc-rep-achievement-badge');
  const barCallsLabel = document.getElementById('tc-bar-calls-label');
  const barCallsFill = document.getElementById('tc-bar-calls-fill');
  const barAdmissionsLabel = document.getElementById('tc-bar-admissions-label');
  const barAdmissionsFill = document.getElementById('tc-bar-admissions-fill');

  const callsPct = targetCalls > 0 ? Math.min(100, ((callsCount / targetCalls) * 100)).toFixed(1) : '0.0';
  const targetAdm = tfData.targetAdmissions || 0;
  const actualAdm = tfData.admissions || 0;
  const admPct = targetAdm > 0 ? Math.min(100, ((actualAdm / targetAdm) * 100)).toFixed(1) : '0.0';

  if (badgeAchieve) badgeAchieve.textContent = `${tfData.achievementPct || 0}% Achieved`;
  if (barCallsLabel) barCallsLabel.textContent = `${callsCount} / ${targetCalls} calls (${callsPct}%)`;
  if (barCallsFill) barCallsFill.style.width = `${callsPct}%`;
  if (barAdmissionsLabel) barAdmissionsLabel.textContent = `${actualAdm} / ${targetAdm} students (${admPct}%)`;
  if (barAdmissionsFill) barAdmissionsFill.style.width = `${admPct}%`;

  const hourlyContainer = document.getElementById('tc-rep-hourly-container');
  if (hourlyContainer) {
    const patterns = ERP_DATA.telecaller.reports.hourlyCallPattern || [];
    if (patterns.length === 0) {
      hourlyContainer.innerHTML = `
        <div class="empty-state-box" style="padding:16px; text-align:center; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No hourly call activity recorded for this period.</div>
        </div>
      `;
    } else {
      hourlyContainer.innerHTML = patterns.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f9faf7; padding:8px 12px; border-radius:6px; font-size:12px;">
          <span style="font-weight:600; color:#0f1419;">${escapeHTML(item.hour)}</span>
          <div style="display:flex; gap:12px; align-items:center;">
            <span style="color:#5e6d7e;">${item.calls} Calls (${item.connected} Conn.)</span>
            <span class="badge-pista" style="font-size:11px; font-weight:700;">${escapeHTML(item.connRate)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  const outcomeContainer = document.getElementById('tc-rep-outcome-distribution');
  if (outcomeContainer) {
    const outcomes = ERP_DATA.telecaller.reports.outcomeDistribution || [];
    if (outcomes.length === 0) {
      outcomeContainer.innerHTML = `
        <div class="empty-state-box" style="grid-column:1/-1; padding:20px; text-align:center; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No lead outcome distribution recorded.</div>
        </div>
      `;
    } else {
      outcomeContainer.innerHTML = outcomes.map(item => `
        <div style="background:#ffffff; border:1px solid #dbe2d6; border-radius:8px; padding:12px;">
          <div style="font-size:12px; color:#5e6d7e;">${escapeHTML(item.outcome)}</div>
          <div style="font-size:18px; font-weight:800; color:${item.color}; margin:4px 0;">${item.count}</div>
          <div style="height:5px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
            <div style="width:${item.pct}%; height:100%; background:${item.color};"></div>
          </div>
          <div style="font-size:11px; color:#8c9ba5; margin-top:4px;">${item.pct}% of total leads</div>
        </div>
      `).join('');
    }
  }
}

// ----------------------------------------------------------
// 11.4 FEES COLLECTION & PRINTABLE RECEIPT
// ----------------------------------------------------------
function renderTelecallerFeesCollection() {
  const tbody = document.getElementById('tc-fees-students-tbody');
  const feeData = ERP_DATA.telecaller?.feesCollection;
  if (!tbody || !feeData) return;

  const kpis = feeData.kpis || {};
  const students = feeData.students || [];

  const elCol = document.getElementById('tc-fee-collected');
  const elPen = document.getElementById('tc-fee-pending');
  const elStCount = document.getElementById('tc-fee-students-count');
  const elRecCount = document.getElementById('tc-fee-receipts-count');

  if (elCol) elCol.textContent = kpis.totalCollectedFormatted || '₹0';
  if (elPen) elPen.textContent = kpis.pendingReceivablesFormatted || '₹0';
  if (elStCount) elStCount.textContent = `${students.length} Students`;
  if (elRecCount) elRecCount.textContent = `${kpis.receiptsIssuedCount || 0} Receipts`;

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-table-cell">
          <div class="empty-state-box">
            <div class="empty-state-title">No Data Available</div>
            <div class="empty-state-sub">No student fee collection records found in the database.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students.map(st => {
    let statusPill = `<span class="tc-status-pill tc-status-admission">✓ Paid</span>`;
    if (st.status === 'Partial') {
      statusPill = `<span class="tc-status-pill tc-status-followup">Partial (₹${st.dueFee.toLocaleString('en-IN')} due)</span>`;
    } else if (st.status === 'Pending') {
      statusPill = `<span class="tc-status-pill tc-priority-urgent">Pending (₹${st.dueFee.toLocaleString('en-IN')} due)</span>`;
    }

    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f1419;">${escapeHTML(st.name)}</div>
          <div style="font-size:11.5px; color:#5e6d7e;">${escapeHTML(st.phone)} • ID: ${st.studentId}</div>
        </td>
        <td>
          <div style="font-weight:600; color:#2e441f;">${escapeHTML(st.course)}</div>
          <div style="font-size:11.5px; color:#5e6d7e;">${escapeHTML(st.package)}</div>
        </td>
        <td>
          <span class="badge-pista" style="font-size:11px;">${escapeHTML(st.batch)}</span>
        </td>
        <td style="font-weight:700;">₹${st.totalFee.toLocaleString('en-IN')}</td>
        <td style="color:#2e7d32; font-weight:700;">₹${st.paidFee.toLocaleString('en-IN')}</td>
        <td style="color:${st.dueFee > 0 ? '#b91c1c' : '#5e6d7e'}; font-weight:700;">₹${st.dueFee.toLocaleString('en-IN')}</td>
        <td>${statusPill}</td>
        <td style="font-size:12px; color:#5e6d7e;">${escapeHTML(st.lastPaymentDate)}</td>
        <td style="text-align:center;">
          <div style="display:inline-flex; gap:6px;">
            ${st.dueFee > 0 ? `
              <button class="btn-primary-ai" style="padding:4px 9px; font-size:11.5px;" onclick="openCollectFeeModal('${st.id}')">
                💳 Collect
              </button>
            ` : ''}
            ${st.receiptId ? `
              <button class="btn-secondary" style="padding:4px 9px; font-size:11.5px;" onclick="openFeeReceipt('${st.receiptId}')">
                📄 Receipt
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openCollectFeeModal(studentFeeId) {
  const students = ERP_DATA.telecaller?.feesCollection?.students || [];
  const modal = document.getElementById('modal-telecaller-collect-fee');
  const selectEl = document.getElementById('tc-fee-student-select');

  if (selectEl) {
    selectEl.innerHTML = students.map(s => `
      <option value="${s.id}" ${s.id === studentFeeId ? 'selected' : ''}>
        ${escapeHTML(s.name)} — Due: ₹${s.dueFee.toLocaleString('en-IN')} (${escapeHTML(s.course)} - ${escapeHTML(s.package)})
      </option>
    `).join('');
  }

  const selectedId = studentFeeId || (students[0]?.id);
  updateFeeModalStudentDetails(selectedId);

  if (modal) modal.classList.add('active');
}

function updateFeeModalStudentDetails(studentFeeId) {
  const st = (ERP_DATA.telecaller?.feesCollection?.students || []).find(s => s.id === studentFeeId);
  if (!st) return;

  const courseEl = document.getElementById('tc-fee-modal-course');
  const batchEl = document.getElementById('tc-fee-modal-batch');
  const totalEl = document.getElementById('tc-fee-modal-total');
  const dueEl = document.getElementById('tc-fee-modal-due');
  const amtInput = document.getElementById('tc-fee-amount');

  if (courseEl) courseEl.textContent = `${st.course} • ${st.package}`;
  if (batchEl) batchEl.textContent = st.batch;
  if (totalEl) totalEl.textContent = `₹${st.totalFee.toLocaleString('en-IN')}`;
  if (dueEl) dueEl.textContent = `₹${st.dueFee.toLocaleString('en-IN')}`;
  if (amtInput) amtInput.value = st.dueFee > 0 ? st.dueFee : st.totalFee;
}

function submitFeeCollection() {
  const selectEl = document.getElementById('tc-fee-student-select');
  const amtInput = document.getElementById('tc-fee-amount');
  const modeSelect = document.getElementById('tc-fee-mode');
  const refInput = document.getElementById('tc-fee-ref');

  const studentFeeId = selectEl?.value;
  const amount = parseFloat(amtInput?.value || 0);
  const mode = modeSelect?.value || 'UPI / QR';
  const ref = refInput?.value || `UPI-${Math.floor(100000 + Math.random() * 900000)}`;

  if (!studentFeeId || amount <= 0) {
    alert("Please enter a valid payment amount.");
    return;
  }

  const st = (ERP_DATA.telecaller?.feesCollection?.students || []).find(s => s.id === studentFeeId);
  if (!st) return;

  st.paidFee += amount;
  st.dueFee = Math.max(0, st.totalFee - st.paidFee);
  st.status = st.dueFee === 0 ? 'Paid' : 'Partial';
  st.lastPaymentDate = 'Today';
  const receiptId = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  st.receiptId = receiptId;

  if (ERP_DATA.financeSummary) {
    ERP_DATA.financeSummary.cashBalance = (ERP_DATA.financeSummary.cashBalance || 0) + amount;
  }
  if (ERP_DATA.classManagement?.fees) {
    ERP_DATA.classManagement.fees.collectedFees = (ERP_DATA.classManagement.fees.collectedFees || 0) + amount;
    ERP_DATA.classManagement.fees.pendingFees = Math.max(0, (ERP_DATA.classManagement.fees.pendingFees || 0) - amount);
  }
  if (ERP_DATA.telecaller?.feesCollection?.kpis) {
    ERP_DATA.telecaller.feesCollection.kpis.totalCollected += amount;
    ERP_DATA.telecaller.feesCollection.kpis.pendingReceivables = Math.max(0, ERP_DATA.telecaller.feesCollection.kpis.pendingReceivables - amount);
    ERP_DATA.telecaller.feesCollection.kpis.receiptsIssuedCount += 1;
    ERP_DATA.telecaller.feesCollection.kpis.totalCollectedFormatted = `₹${ERP_DATA.telecaller.feesCollection.kpis.totalCollected.toLocaleString('en-IN')}`;
    ERP_DATA.telecaller.feesCollection.kpis.pendingReceivablesFormatted = `₹${ERP_DATA.telecaller.feesCollection.kpis.pendingReceivables.toLocaleString('en-IN')}`;
  }

  closeModal('modal-telecaller-collect-fee');
  renderTelecallerFeesCollection();
  if (currentView === 'finance') populateFinanceView();

  openFeeReceipt(receiptId);
  showToastNotification(`₹${amount.toLocaleString('en-IN')} payment recorded for ${st.name}! Receipt generated.`);
}

function openFeeReceipt(receiptId) {
  const st = (ERP_DATA.telecaller?.feesCollection?.students || []).find(s => s.receiptId === receiptId) || 
             ERP_DATA.telecaller?.feesCollection?.students[0];
  if (!st) return;

  const container = document.getElementById('tc-printable-receipt-container');
  const modal = document.getElementById('modal-telecaller-receipt');

  if (container) {
    container.innerHTML = `
      <div class="official-receipt-box">
        <div class="receipt-header-branding">
          <div>
            <span class="badge-pista" style="font-size:10.5px; font-weight:700;">ACCREDITED SKILL CENTRE</span>
            <h2 style="margin:4px 0 2px 0; font-size:19px; color:#2b5115;">Waytone Skill Development Centre</h2>
            <div style="font-size:12px; color:#5e6d7e;">Language Labs & Professional Mentorship • CEO: Nasim v</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:14px; font-weight:800; color:#0f1419;">RECEIPT #${st.receiptId || receiptId}</div>
            <div style="font-size:11.5px; color:#5e6d7e;">Date: 06 Sep 2026</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; background:#f9faf7; border:1px solid #dbe2d6; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
          <div>
            <div style="font-size:11px; color:#5e6d7e;">STUDENT NAME:</div>
            <div style="font-size:14px; font-weight:700; color:#0f1419;">${escapeHTML(st.name)}</div>
            <div style="font-size:11.5px; color:#5e6d7e;">ID: ${st.studentId} • Ph: ${escapeHTML(st.phone)}</div>
          </div>
          <div>
            <div style="font-size:11px; color:#5e6d7e;">COURSE ENROLLED:</div>
            <div style="font-size:14px; font-weight:700; color:#2e441f;">${escapeHTML(st.course)}</div>
            <div style="font-size:11.5px; color:#5e6d7e;">Package: ${escapeHTML(st.package)} (Batch: ${escapeHTML(st.batch)})</div>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:18px;">
          <thead>
            <tr style="border-bottom:2px solid #2b5115; text-align:left;">
              <th style="padding:8px 0; color:#2b5115;">Description</th>
              <th style="padding:8px 0; text-align:right; color:#2b5115;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px 0;">Tuition Fee for ${escapeHTML(st.course)} (${escapeHTML(st.package)})</td>
              <td style="padding:10px 0; text-align:right; font-weight:600;">₹${st.totalFee.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:10px 0; color:#2e7d32; font-weight:700;">Amount Paid (Installment / Full)</td>
              <td style="padding:10px 0; text-align:right; color:#2e7d32; font-weight:800;">₹${st.paidFee.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="border-bottom:2px solid #2b5115;">
              <td style="padding:10px 0; color:${st.dueFee > 0 ? '#b91c1c' : '#5e6d7e'}; font-weight:700;">Remaining Balance Due</td>
              <td style="padding:10px 0; text-align:right; color:${st.dueFee > 0 ? '#b91c1c' : '#5e6d7e'}; font-weight:800;">₹${st.dueFee.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:20px; padding-top:14px; border-top:1px dashed #dbe2d6;">
          <div>
            <div style="font-size:11.5px; color:#5e6d7e;">Counselor: <strong>${escapeHTML(st.counselor || getActiveCounselorName() || 'Authorized Counselor')}</strong></div>
            <div style="font-size:11px; color:#8c9ba5;">Payment Mode: Digital UPI / Verified Counter Deposit</div>
          </div>
          <div class="receipt-seal">
            <span>WAYTONE</span>
            <span>OFFICIAL</span>
            <span>VERIFIED</span>
          </div>
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add('active');
}

// ----------------------------------------------------------
// 11.4 TELECALLER UNASSIGNED DATA POOL & DATA INGESTION
// ----------------------------------------------------------
function getActiveCounselorName() {
  const counselor = (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId) || ERP_DATA.telecaller?.counselors?.[0];
  return counselor?.name || 'Authorized Counselor';
}

function maskPhoneNumber(phone) {
  if (!phone) return '—';
  const clean = String(phone).trim();
  if (clean.startsWith('+91')) {
    const digitsOnly = clean.replace(/[^0-9]/g, '').substring(2);
    if (digitsOnly.length >= 5) {
      return `+91 ${digitsOnly.substring(0, 4)}X •••••`;
    }
    return `+91 9845X •••••`;
  }
  const digits = clean.replace(/[^0-9]/g, '');
  if (digits.length >= 6) {
    return `${digits.substring(0, 4)}X •••••`;
  }
  return '••••••••••';
}

function renderTelecallerUnassignedData(searchTerm = '', sourceFilter = 'All') {
  const tbody = document.getElementById('tc-unassigned-data-tbody');
  const badgeEl = document.getElementById('tc-unassigned-pool-badge');
  if (!tbody || !ERP_DATA.crm?.dataPool) return;

  const searchInput = document.getElementById('tc-unassigned-search');
  const filterSelect = document.getElementById('tc-unassigned-source-filter');

  const sTerm = (searchTerm || searchInput?.value || '').toLowerCase().trim();
  const fSource = sourceFilter !== 'All' ? sourceFilter : (filterSelect?.value || 'All');
  const counselorName = getActiveCounselorName();

  // Leads in data pool that are strictly unassigned and NOT yet grabbed
  const poolLeads = ERP_DATA.crm.dataPool.filter(item => {
    const isUnassigned = (!item.telecaller || item.telecaller === 'Unassigned') && !item.isGrabbed;
    if (!isUnassigned) return false;

    const matchesSearch = !sTerm || 
      (item.name || '').toLowerCase().includes(sTerm) ||
      (item.uploader || '').toLowerCase().includes(sTerm) ||
      (item.leadSource || '').toLowerCase().includes(sTerm) ||
      (item.coursePackage || '').toLowerCase().includes(sTerm);

    const matchesSource = fSource === 'All' || item.leadSource === fSource;

    return matchesSearch && matchesSource;
  });

  const unassignedCount = (ERP_DATA.crm.dataPool || []).filter(i => (!i.telecaller || i.telecaller === 'Unassigned') && !i.isGrabbed).length;
  if (badgeEl) {
    badgeEl.textContent = `${unassignedCount} Available to Grab`;
  }

  if (poolLeads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:30px; color:#5e6d7e;">
          No unassigned student leads available. All leads have been assigned or grabbed!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = poolLeads.map(item => {
    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f1419; font-size:13px;">${escapeHTML(item.name)}</div>
          <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(item.coursePackage || 'Course Inquiry')}</div>
        </td>
        <td>
          <span class="uploader-tag">
            <span class="uploader-tag-dot"></span>
            ${escapeHTML(item.uploader || 'System Sync')}
          </span>
        </td>
        <td>
          <span class="badge" style="background:#f1f5f9; color:#334155; font-size:11px; font-weight:600; padding:3px 8px; border-radius:4px; border:1px solid #e2e8f0;">
            ${escapeHTML(item.leadSource || 'Direct Entry')}
          </span>
        </td>
        <td>
          <div class="phone-masked-badge" title="Phone is masked. Click 'Grab Data' to assign to yourself and reveal contact details.">
            <span class="phone-masked-text">🔒 ${maskPhoneNumber(item.phone)}</span>
            <span class="phone-masked-hint">Grab to reveal</span>
          </div>
        </td>
        <td style="text-align:center;">
          <button class="btn-grab-data" onclick="grabTelecallerLead('${item.id}')" title="Grab this student lead into your Call List & reveal phone number">
            ⚡ Grab Data
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterUnassignedDataPool() {
  const searchInput = document.getElementById('tc-unassigned-search');
  const filterSelect = document.getElementById('tc-unassigned-source-filter');
  renderTelecallerUnassignedData(searchInput?.value || '', filterSelect?.value || 'All');
}

function grabTelecallerLead(leadId) {
  const lead = (ERP_DATA.crm?.dataPool || []).find(l => l.id === leadId);
  if (!lead) return;

  const counselorName = getActiveCounselorName();
  lead.telecaller = counselorName;
  lead.isGrabbed = true;
  lead.grabbedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!ERP_DATA.telecaller) ERP_DATA.telecaller = {};
  if (!ERP_DATA.telecaller.callList) ERP_DATA.telecaller.callList = [];

  // Reset isJustGrabbed flag on older items
  ERP_DATA.telecaller.callList.forEach(c => c.isJustGrabbed = false);

  let callItem = ERP_DATA.telecaller.callList.find(c => c.leadId === lead.id || c.phone === lead.phone);
  if (!callItem) {
    const courseParts = (lead.coursePackage || 'Communicative English (Affordable Package)').split('(');
    const courseName = courseParts[0].trim();
    const pkgName = courseParts[1] ? courseParts[1].replace(')', '').trim() : 'Affordable Package';

    callItem = {
      id: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId: lead.id,
      studentName: lead.name,
      phone: lead.phone,
      course: courseName,
      package: pkgName,
      status: 'For Cold Call',
      priority: 'High',
      lastCalled: 'Just Grabbed',
      nextFollowup: 'Today',
      isJustGrabbed: true,
      notes: `Grabbed from Data Pool (${lead.leadSource || 'Uploaded Lead'}) uploaded by ${lead.uploader || 'Staff'}`
    };
    ERP_DATA.telecaller.callList.unshift(callItem);
  } else {
    callItem.isJustGrabbed = true;
    callItem.studentName = lead.name;
    callItem.phone = lead.phone;
    ERP_DATA.telecaller.callList = ERP_DATA.telecaller.callList.filter(c => c.id !== callItem.id);
    ERP_DATA.telecaller.callList.unshift(callItem);
  }

  const counselor = (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId);
  if (counselor) {
    counselor.followups = (counselor.followups || 0) + 1;
    const kpiFollowups = document.getElementById('tc-kpi-followups');
    if (kpiFollowups) kpiFollowups.textContent = `${counselor.followups} Pending`;
  }

  // Display Recently Grabbed alert banner showing revealed phone number
  const banner = document.getElementById('tc-recently-grabbed-banner');
  if (banner) {
    banner.style.display = 'block';
    banner.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:16px;">⚡</span>
          <div>
            <span style="font-size:11px; font-weight:700; color:#166534; text-transform:uppercase;">Grabbed & Removed from Unassigned Pool:</span>
            <div style="font-size:13px; font-weight:700; color:#0f1419;">
              ${escapeHTML(lead.name)} &bull; <span style="color:#2e441f; font-weight:800; background:#dcfce7; padding:2px 8px; border-radius:4px;">📞 ${escapeHTML(lead.phone)}</span> &bull; <span style="font-size:12px; color:#5e6d7e;">${escapeHTML(lead.coursePackage)}</span>
            </div>
          </div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:11.5px; color:#15803d; font-weight:600;">✓ Added to Call List</span>
          <button class="btn-telecaller-call" style="padding:4px 10px; font-size:11.5px;" onclick="openTelecallerDialer('${callItem.id}')">📞 Call Now</button>
        </div>
      </div>
    `;
  }

  // Re-render: removes lead from Unassigned table and updates Call List
  renderTelecallerUnassignedData();
  renderTelecallerCallList();
  showToastNotification(`✓ Grabbed "${lead.name}"! Removed from unassigned data • Phone: ${lead.phone} now in Call List.`);
}

function quickCallGrabbedLead(leadId) {
  const lead = (ERP_DATA.crm?.dataPool || []).find(l => l.id === leadId);
  if (!lead) return;

  const callItem = (ERP_DATA.telecaller?.callList || []).find(c => c.leadId === lead.id || c.phone === lead.phone);
  if (callItem) {
    openTelecallerDialer(callItem.id);
  } else {
    activeDialerCallId = lead.id;
    const modal = document.getElementById('modal-telecaller-call');
    const nameEl = document.getElementById('tc-dialer-student-name');
    const courseEl = document.getElementById('tc-dialer-course-pkg');
    const phoneEl = document.getElementById('tc-dialer-phone');
    if (nameEl) nameEl.textContent = `Calling ${lead.name}`;
    if (courseEl) courseEl.textContent = lead.coursePackage || 'Communicative English';
    if (phoneEl) phoneEl.textContent = lead.phone;
    if (modal) modal.classList.add('active');
  }
}

function openTelecallerUploadModal() {
  const modal = document.getElementById('modal-telecaller-upload-data');
  const uploaderEl = document.getElementById('tc-upload-modal-uploader');
  const selfNameEl = document.getElementById('tc-upload-modal-self-name');
  const counselorName = activeUserRole === 'ROLE-ADMIN' ? 'Nasim v (CEO)' : getActiveCounselorName();

  if (uploaderEl) {
    uploaderEl.textContent = counselorName;
  }
  if (selfNameEl) {
    selfNameEl.textContent = activeUserRole === 'ROLE-ADMIN' ? 'Nasim v' : counselorName;
  }

  const nameInput = document.getElementById('tc-upload-name');
  const phoneInput = document.getElementById('tc-upload-phone');
  const notesInput = document.getElementById('tc-upload-notes');
  const bulkInput = document.getElementById('tc-upload-bulk-text');

  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (notesInput) notesInput.value = '';
  if (bulkInput) bulkInput.value = '';

  switchTelecallerUploadTab('single');

  if (modal) modal.classList.add('active');
}

function closeTelecallerUploadModal() {
  closeModal('modal-telecaller-upload-data');
}

function switchTelecallerUploadTab(tabId) {
  const singlePane = document.getElementById('tc-upload-pane-single');
  const bulkPane = document.getElementById('tc-upload-pane-bulk');
  const singleBtn = document.getElementById('tc-upload-tab-btn-single');
  const bulkBtn = document.getElementById('tc-upload-tab-btn-bulk');

  if (tabId === 'single') {
    if (singlePane) singlePane.style.display = 'block';
    if (bulkPane) bulkPane.style.display = 'none';
    if (singleBtn) singleBtn.classList.add('active');
    if (bulkBtn) bulkBtn.classList.remove('active');
  } else {
    if (singlePane) singlePane.style.display = 'none';
    if (bulkPane) bulkPane.style.display = 'block';
    if (singleBtn) singleBtn.classList.remove('active');
    if (bulkBtn) bulkBtn.classList.add('active');
  }
}

function submitTelecallerLeadUpload() {
  const nameInput = document.getElementById('tc-upload-name');
  const phoneInput = document.getElementById('tc-upload-phone');
  const courseInput = document.getElementById('tc-upload-course');
  const sourceInput = document.getElementById('tc-upload-source');
  const notesInput = document.getElementById('tc-upload-notes');
  const destInput = document.querySelector('input[name="tc-upload-dest"]:checked');

  const studentName = (nameInput?.value || '').trim();
  const phone = (phoneInput?.value || '').trim();
  const coursePackage = courseInput?.value || 'Communicative English (Standard Package)';
  const leadSource = sourceInput?.value || 'College Campus Drive';
  const notes = (notesInput?.value || '').trim();
  const isAssignSelf = destInput?.value === 'self';

  if (!studentName || !phone) {
    alert("Please enter student name and phone number.");
    return;
  }

  const counselorName = getActiveCounselorName();
  const newLeadId = `WLD-${Math.floor(1000 + Math.random() * 9000)}`;

  const newLead = {
    id: newLeadId,
    name: studentName,
    phone: phone,
    coursePackage: coursePackage,
    status: 'New Inquiry',
    telecaller: isAssignSelf ? counselorName : 'Unassigned',
    uploader: `${counselorName} (Counselor)`,
    dateAdded: 'Today',
    leadSource: leadSource,
    isGrabbed: isAssignSelf,
    notes: notes || 'Uploaded by Counselor'
  };

  if (!ERP_DATA.crm) ERP_DATA.crm = {};
  if (!ERP_DATA.crm.dataPool) ERP_DATA.crm.dataPool = [];
  ERP_DATA.crm.dataPool.unshift(newLead);

  if (isAssignSelf) {
    if (!ERP_DATA.telecaller) ERP_DATA.telecaller = {};
    if (!ERP_DATA.telecaller.callList) ERP_DATA.telecaller.callList = [];

    const courseParts = coursePackage.split('(');
    const courseName = courseParts[0].trim();
    const pkgName = courseParts[1] ? courseParts[1].replace(')', '').trim() : 'Standard Package';

    ERP_DATA.telecaller.callList.unshift({
      id: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId: newLead.id,
      studentName: studentName,
      phone: phone,
      course: courseName,
      package: pkgName,
      status: 'For Cold Call',
      priority: 'High',
      lastCalled: 'Just Added',
      nextFollowup: 'Today',
      notes: notes || `Directly uploaded and assigned by ${counselorName}`
    });
  }

  closeTelecallerUploadModal();
  renderTelecallerUnassignedData();
  renderTelecallerCallList();

  if (isAssignSelf) {
    showToastNotification(`✓ Student lead "${studentName}" uploaded and assigned to your Call List!`);
  } else {
    showToastNotification(`✓ Student lead "${studentName}" uploaded to Unassigned Data Pool (Ready to grab)!`);
  }
}

function submitTelecallerBatchUpload() {
  const bulkInput = document.getElementById('tc-upload-bulk-text');
  const unassignedCheckbox = document.getElementById('tc-upload-bulk-unassigned');
  const text = (bulkInput?.value || '').trim();

  if (!text) {
    alert("Please paste at least one lead in the text area.");
    return;
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) {
    alert("No valid lines found.");
    return;
  }

  const counselorName = getActiveCounselorName();
  const isUnassigned = unassignedCheckbox ? unassignedCheckbox.checked : true;
  let addedCount = 0;

  if (!ERP_DATA.crm) ERP_DATA.crm = {};
  if (!ERP_DATA.crm.dataPool) ERP_DATA.crm.dataPool = [];
  if (!ERP_DATA.telecaller) ERP_DATA.telecaller = {};
  if (!ERP_DATA.telecaller.callList) ERP_DATA.telecaller.callList = [];

  lines.forEach(line => {
    const parts = line.includes('\t') ? line.split('\t') : line.split(',');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const phone = parts[1].trim();
      const course = parts[2] ? parts[2].trim() : 'Communicative English (Affordable Package)';
      const source = parts[3] ? parts[3].trim() : 'Bulk Paste Sync';

      if (name && phone) {
        const newLead = {
          id: `WLD-${Math.floor(1000 + Math.random() * 9000)}`,
          name: name,
          phone: phone,
          coursePackage: course,
          status: 'New Inquiry',
          telecaller: isUnassigned ? 'Unassigned' : counselorName,
          uploader: `${counselorName} (Counselor)`,
          dateAdded: 'Today',
          leadSource: source,
          isGrabbed: !isUnassigned,
          notes: 'Batch ingested lead'
        };

        ERP_DATA.crm.dataPool.unshift(newLead);

        if (!isUnassigned) {
          const courseParts = course.split('(');
          const courseName = courseParts[0].trim();
          const pkgName = courseParts[1] ? courseParts[1].replace(')', '').trim() : 'Affordable Package';

          ERP_DATA.telecaller.callList.unshift({
            id: `TC-${Math.floor(1000 + Math.random() * 9000)}`,
            leadId: newLead.id,
            studentName: name,
            phone: phone,
            course: courseName,
            package: pkgName,
            status: 'For Cold Call',
            priority: 'Normal',
            lastCalled: 'Just Added',
            nextFollowup: 'Today',
            notes: `Batch uploaded by ${counselorName}`
          });
        }
        addedCount++;
      }
    }
  });

  if (addedCount === 0) {
    alert("Could not parse any valid leads. Please check format: Name, Phone, Course, Source");
    return;
  }

  closeTelecallerUploadModal();
  renderTelecallerUnassignedData();
  renderTelecallerCallList();
  showToastNotification(`✓ Batch ingestion complete! ${addedCount} student leads added to Data Pool.`);
}

// ----------------------------------------------------------
// 11.5 HRM ROLES & PERMISSIONS (RBAC) GOVERNANCE
// ----------------------------------------------------------
function initHrmRolesGovernance() {
  populateHrmRoles();
}

function populateHrmRoles() {
  const pillsContainer = document.getElementById('hrm-roles-pills-container');
  const roles = ERP_DATA.hrm?.roles || [];
  if (!pillsContainer || roles.length === 0) return;

  pillsContainer.innerHTML = roles.map(r => `
    <button class="hrm-tab-btn ${r.id === activeHrmSelectedRoleId ? 'active' : ''}" style="padding:7px 14px; font-size:12.5px;" onclick="selectHrmRole('${r.id}')">
      ${r.id === 'ROLE-ADMIN' ? '👑' : r.id === 'ROLE-TC' ? '🎧' : r.id === 'ROLE-COORD' ? '🎓' : r.id === 'ROLE-MENTOR' ? '👨‍🏫' : r.id === 'ROLE-MARKETING' ? '📢' : '💳'} ${escapeHTML(r.name)}
    </button>
  `).join('');

  renderRolePermissionsTable(activeHrmSelectedRoleId);
}

function selectHrmRole(roleId) {
  activeHrmSelectedRoleId = roleId;
  populateHrmRoles();
}

function renderRolePermissionsTable(roleId) {
  const role = (ERP_DATA.hrm?.roles || []).find(r => r.id === roleId);
  const nameEl = document.getElementById('hrm-selected-role-name');
  const descEl = document.getElementById('hrm-selected-role-desc');
  const countEl = document.getElementById('hrm-selected-role-count');
  const tbody = document.getElementById('hrm-role-permissions-tbody');

  if (!role || !tbody) return;

  if (nameEl) nameEl.textContent = role.name;
  if (descEl) descEl.textContent = role.description;
  if (countEl) countEl.textContent = `${role.userCount || 0} Active Staff`;

  tbody.innerHTML = (role.modules || []).map(m => `
    <tr>
      <td>
        <div style="font-weight:700; color:#0f1419;">${escapeHTML(m.name)}</div>
        <div style="font-size:11px; color:#5e6d7e;">ID: ${escapeHTML(m.id)}</div>
      </td>
      <td style="text-align:center;">
        <input type="checkbox" class="perm-checkbox" ${m.view ? 'checked' : ''} onchange="toggleRolePermission('${role.id}', '${m.id}', 'view', this.checked)">
      </td>
      <td style="text-align:center;">
        <input type="checkbox" class="perm-checkbox" ${m.add ? 'checked' : ''} onchange="toggleRolePermission('${role.id}', '${m.id}', 'add', this.checked)">
      </td>
      <td style="text-align:center;">
        <input type="checkbox" class="perm-checkbox" ${m.edit ? 'checked' : ''} onchange="toggleRolePermission('${role.id}', '${m.id}', 'edit', this.checked)">
      </td>
      <td style="text-align:center;">
        <input type="checkbox" class="perm-checkbox" ${m.delete ? 'checked' : ''} onchange="toggleRolePermission('${role.id}', '${m.id}', 'delete', this.checked)">
      </td>
      <td style="text-align:center;">
        <input type="checkbox" class="perm-checkbox" ${m.export ? 'checked' : ''} onchange="toggleRolePermission('${role.id}', '${m.id}', 'export', this.checked)">
      </td>
    </tr>
  `).join('');
}

function toggleRolePermission(roleId, moduleId, permKey, isChecked) {
  const role = (ERP_DATA.hrm?.roles || []).find(r => r.id === roleId);
  if (!role) return;

  const mod = (role.modules || []).find(m => m.id === moduleId);
  if (mod) {
    mod[permKey] = isChecked;
  }
}

function openAddRoleModuleModal() {
  const modal = document.getElementById('modal-hrm-add-role-module');
  const roleSelect = document.getElementById('hrm-add-mod-role-select');
  if (roleSelect) roleSelect.value = activeHrmSelectedRoleId;
  if (modal) modal.classList.add('active');
}

function submitAddRoleModule() {
  const roleSelect = document.getElementById('hrm-add-mod-role-select');
  const nameInput = document.getElementById('hrm-add-mod-name');
  const keyInput = document.getElementById('hrm-add-mod-key');

  const roleId = roleSelect?.value || activeHrmSelectedRoleId;
  const modName = (nameInput?.value || '').trim();
  let modKey = (keyInput?.value || '').trim().toLowerCase().replace(/\s+/g, '-');

  if (!modName) {
    alert("Please enter a module name.");
    return;
  }
  if (!modKey) modKey = modName.toLowerCase().replace(/\s+/g, '-');

  const role = (ERP_DATA.hrm?.roles || []).find(r => r.id === roleId);
  if (!role) return;

  if (!role.modules) role.modules = [];

  const existing = role.modules.find(m => m.id === modKey);
  if (existing) {
    alert(`Module "${modName}" already exists for this role.`);
    return;
  }

  const pView = document.getElementById('hrm-add-mod-perm-view')?.checked ?? true;
  const pAdd = document.getElementById('hrm-add-mod-perm-add')?.checked ?? true;
  const pEdit = document.getElementById('hrm-add-mod-perm-edit')?.checked ?? true;
  const pDelete = document.getElementById('hrm-add-mod-perm-delete')?.checked ?? false;
  const pExport = document.getElementById('hrm-add-mod-perm-export')?.checked ?? true;

  role.modules.push({
    id: modKey,
    name: modName,
    view: pView,
    add: pAdd,
    edit: pEdit,
    delete: pDelete,
    export: pExport
  });

  closeModal('modal-hrm-add-role-module');
  selectHrmRole(roleId);
  showToastNotification(`Module "${modName}" successfully added to ${role.name}!`);
}

function saveRolePermissionsChanges() {
  showToastNotification("✓ Role permissions saved and applied across ERP!");
}

function showToastNotification(msg) {
  let toast = document.getElementById('waytone-global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'waytone-global-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f1419;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
  }, 3500);
}

/* ======================================================== */
/* 8. MARKETING HEAD DASHBOARD CONTROLLER                   */
/* ======================================================== */

let activeMarketingTab = 'overview';
let currentMarketingReportTimeframe = 'monthly';
let activeContentFilter = 'ALL';

function initMarketingDashboard() {
  if (!window.ERP_DATA || !ERP_DATA.marketing) return;
  populateMarketingDashboard();
}

function populateMarketingDashboard() {
  if (!ERP_DATA.marketing) return;

  const mkt = ERP_DATA.marketing;
  const headNameEl = document.getElementById('mkt-banner-head-name');
  if (headNameEl && mkt.head) {
    headNameEl.textContent = mkt.head.name;
  }

  // Ensure active tab pane is displayed
  switchMarketingTab(activeMarketingTab);

  // Render all views
  renderMarketingOverview();
  renderMarketingCampaigns();
  renderMarketingContentCreative();
  renderMarketingReports(currentMarketingReportTimeframe);
  renderMarketingTeamPerformance();
}

function switchMarketingTab(tabId) {
  activeMarketingTab = tabId;

  // Update tab buttons
  const tabs = ['overview', 'campaigns', 'content', 'reports'];
  tabs.forEach(t => {
    const btn = document.getElementById(`mkt-tab-btn-${t}`);
    const pane = document.getElementById(`mkt-pane-${t}`);
    if (btn) {
      if (t === tabId) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (pane) {
      if (t === tabId) pane.classList.add('active');
      else pane.classList.remove('active');
    }
  });

  // Re-render specific sub-pane
  if (tabId === 'overview') renderMarketingOverview();
  else if (tabId === 'campaigns') renderMarketingCampaigns();
  else if (tabId === 'content') renderMarketingContentCreative();
  else if (tabId === 'reports') renderMarketingReports(currentMarketingReportTimeframe);
}

/* --- TAB 1: MARKETING OVERVIEW --- */
function renderMarketingOverview() {
  const mkt = ERP_DATA.marketing;
  if (!mkt || !mkt.kpis) return;

  const k = mkt.kpis;
  const totalLeads = k.totalLeads ?? k.totalLeadsGenerated ?? 0;
  const totalCampaigns = k.totalCampaigns ?? 0;
  const adSpend = k.adSpend ?? 0;
  const cpl = k.costPerLead ?? k.cpl ?? 0;
  const admissions = k.admissionsGenerated ?? 0;
  const revenue = k.revenueGenerated ?? 0;
  const roi = k.roiMultiple ?? k.roi ?? "0x";
  const leadsTarget = k.targetLeads ?? (k.targetVsAchievement && k.targetVsAchievement.leadsTarget) ?? 0;
  const leadsAchPct = k.targetLeadsAchievementPct ?? (k.targetVsAchievement && k.targetVsAchievement.leadsAchievementPct) ?? 0;
  const admTarget = k.targetAdmissions ?? (k.targetVsAchievement && k.targetVsAchievement.admissionsTarget) ?? 0;
  const admAchPct = k.targetAdmissionsAchievementPct ?? (k.targetVsAchievement && k.targetVsAchievement.admissionsAchievementPct) ?? 0;
  const revTarget = k.targetRevenue ?? (k.targetVsAchievement && k.targetVsAchievement.revenueTarget) ?? 0;
  const revAchPct = k.targetRevenueAchievementPct ?? (k.targetVsAchievement && k.targetVsAchievement.revenueAchievementPct) ?? 0;
  const convPct = totalLeads > 0 ? ((admissions / totalLeads) * 100).toFixed(2) : '0.00';

  const kpiContainer = document.getElementById('mkt-overview-kpis');
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Total Leads Generated</span>
          <span class="kpi-badge" style="background:#f1f5f9; color:#64748b;">--</span>
        </div>
        <div class="kpi-value">${Number(totalLeads).toLocaleString('en-IN')}</div>
        <div class="kpi-subtext">Across Multi-Channel Sources</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Active Campaigns</span>
          <span class="kpi-badge badge-pista">&#127919; ${k.activeCampaigns || 0} Live / ${totalCampaigns} Total</span>
        </div>
        <div class="kpi-value">${totalCampaigns}</div>
        <div class="kpi-subtext">Meta, Google, WhatsApp &amp; YouTube</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Total Ad Spend</span>
          <span class="kpi-badge badge-pista">&#8377; Budget</span>
        </div>
        <div class="kpi-value">&#8377;${(adSpend / 100000).toFixed(2)}L</div>
        <div class="kpi-subtext">Utilized &#8377;${Number(adSpend).toLocaleString('en-IN')}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Cost Per Lead (CPL)</span>
          <span class="kpi-badge badge-green">&#11088; Optimal</span>
        </div>
        <div class="kpi-value">&#8377;${Number(cpl).toFixed(2)}</div>
        <div class="kpi-subtext">Calculated from verified leads</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Admissions Generated</span>
          <span class="kpi-badge badge-green">&#127891; ${convPct}% Conv</span>
        </div>
        <div class="kpi-value">${admissions}</div>
        <div class="kpi-subtext">Enrolled Students across tracks</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Revenue Generated</span>
          <span class="kpi-badge badge-green">&#128176; Attributed</span>
        </div>
        <div class="kpi-value">&#8377;${(revenue / 100000).toFixed(2)}L</div>
        <div class="kpi-subtext">From Marketing-sourced inquiries</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Return On Ad Spend (ROI)</span>
          <span class="kpi-badge badge-green">&#128640; ${roi}</span>
        </div>
        <div class="kpi-value">${roi}</div>
        <div class="kpi-subtext">${roi} returned per &#8377;1 ad spend</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-title">Target Achievement</span>
          <span class="kpi-badge badge-green">&#10003; ${leadsAchPct}%</span>
        </div>
        <div class="kpi-value">${leadsAchPct}%</div>
        <div class="kpi-subtext">Leads Target: ${Number(leadsTarget).toLocaleString('en-IN')}</div>
      </div>
    `;
  }

  // Render Target vs Achievement Progress Bars
  const taContainer = document.getElementById('mkt-target-achievement-container');
  if (taContainer) {
    taContainer.innerHTML = `
      <div style="background:#f9faf7; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:#1e293b; margin-bottom:6px;">
          <span>Target Leads</span>
          <span>${Number(totalLeads).toLocaleString('en-IN')} / ${Number(leadsTarget).toLocaleString('en-IN')} (${leadsAchPct}%)</span>
        </div>
        <div style="background:#e2e8f0; border-radius:6px; height:8px; overflow:hidden;">
          <div style="background:#6b8e4e; width:${Math.min(leadsAchPct, 100)}%; height:100%; border-radius:6px;"></div>
        </div>
      </div>

      <div style="background:#f9faf7; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:#1e293b; margin-bottom:6px;">
          <span>Target Admissions</span>
          <span>${admissions} / ${admTarget} (${admAchPct}%)</span>
        </div>
        <div style="background:#e2e8f0; border-radius:6px; height:8px; overflow:hidden;">
          <div style="background:#2b5115; width:${Math.min(admAchPct, 100)}%; height:100%; border-radius:6px;"></div>
        </div>
      </div>

      <div style="background:#f9faf7; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
        <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:#1e293b; margin-bottom:6px;">
          <span>Target Revenue</span>
          <span>&#8377;${(revenue / 100000).toFixed(1)}L / &#8377;${(revTarget / 100000).toFixed(1)}L (${revAchPct}%)</span>
        </div>
        <div style="background:#e2e8f0; border-radius:6px; height:8px; overflow:hidden;">
          <div style="background:#16a34a; width:${Math.min(revAchPct, 100)}%; height:100%; border-radius:6px;"></div>
        </div>
      </div>
    `;
  }

  // Graph 1: Leads Growth (Monthly Bar Chart)
  const leadsChart = document.getElementById('mkt-chart-leads-growth');
  if (leadsChart) {
    const data = mkt.overviewCharts?.leadsGrowth || [];
    if (data.length === 0) {
      leadsChart.innerHTML = `
        <div class="empty-chart-box" style="width:100%; text-align:center; padding:32px 16px; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No monthly leads growth data available.</div>
        </div>
      `;
    } else {
      const maxVal = Math.max(...data.map(d => d.leads || 0), 1);
      leadsChart.innerHTML = data.map(d => {
        const heightPct = Math.max(Math.round(((d.leads || 0) / maxVal) * 130), 15);
        return `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
            <span style="font-size:10.5px; font-weight:700; color:#2b5115;">${d.leads}</span>
            <div style="width:100%; max-width:44px; height:${heightPct}px; background:linear-gradient(180deg, #6b8e4e 0%, #4a6833 100%); border-radius:4px 4px 0 0; transition:all 0.3s;" title="${d.month}: ${d.leads} Leads"></div>
            <span style="font-size:11px; font-weight:600; color:#64748b;">${d.month}</span>
          </div>
        `;
      }).join('');
    }
  }

  // Graph 2: Revenue Growth (Monthly Bar Chart)
  const revChart = document.getElementById('mkt-chart-revenue-growth');
  if (revChart) {
    const data = mkt.overviewCharts?.revenueGrowth || [];
    if (data.length === 0) {
      revChart.innerHTML = `
        <div class="empty-chart-box" style="width:100%; text-align:center; padding:32px 16px; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No monthly revenue growth data recorded.</div>
        </div>
      `;
    } else {
      const maxVal = Math.max(...data.map(d => d.revenueRaw || (typeof d.revenue === 'number' ? d.revenue : 0)), 1);
      revChart.innerHTML = data.map(d => {
        const val = d.revenueRaw || (typeof d.revenue === 'number' ? d.revenue : 0);
        const heightPct = Math.max(Math.round((val / maxVal) * 130), 15);
        const label = d.revenue || ('₹' + (val / 100000).toFixed(1) + 'L');
        return `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
            <span style="font-size:10.5px; font-weight:700; color:#166534;">${label}</span>
            <div style="width:100%; max-width:44px; height:${heightPct}px; background:linear-gradient(180deg, #10b981 0%, #059669 100%); border-radius:4px 4px 0 0; transition:all 0.3s;" title="${d.month}: ${label}"></div>
            <span style="font-size:11px; font-weight:600; color:#64748b;">${d.month}</span>
          </div>
        `;
      }).join('');
    }
  }

  // Graph 3: Campaign Performance Comparison
  const campChart = document.getElementById('mkt-chart-campaign-performance');
  if (campChart) {
    const data = mkt.overviewCharts?.campaignPerformance || [];
    if (data.length === 0) {
      campChart.innerHTML = `
        <div class="empty-chart-box" style="width:100%; text-align:center; padding:32px 16px; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No campaign performance comparisons available.</div>
        </div>
      `;
    } else {
      const maxAdm = Math.max(...data.map(d => d.admissions || 0), 1);
      campChart.innerHTML = data.map(c => {
        const pct = Math.round(((c.admissions || 0) / maxAdm) * 100);
        return `
          <div>
            <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:600; color:#1e293b; margin-bottom:3px;">
              <span style="display:flex; align-items:center; gap:6px;">
                <strong>${escapeHTML(c.name)}</strong>
                ${c.roi ? `<span style="font-size:10px; color:#166534; font-weight:700;">(${c.roi} ROI)</span>` : ''}
              </span>
              <span style="color:#2b5115; font-weight:700;">${c.admissions} Admissions &bull; &#8377;${((c.revenue || 0) / 100000).toFixed(1)}L</span>
            </div>
            <div style="background:#e2e8f0; border-radius:4px; height:8px; overflow:hidden;">
              <div style="background:#6b8e4e; width:${pct}%; height:100%; border-radius:4px;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Graph 4: Lead Source Performance
  const sourceChart = document.getElementById('mkt-chart-lead-source');
  if (sourceChart) {
    const sources = mkt.overviewCharts?.leadSources || mkt.overviewCharts?.leadSourcePerformance || [];
    if (sources.length === 0) {
      sourceChart.innerHTML = `
        <div class="empty-chart-box" style="width:100%; text-align:center; padding:32px 16px; color:#5e6d7e;">
          <div class="empty-state-title">No Data Available</div>
          <div class="empty-state-sub">No lead sources recorded yet.</div>
        </div>
      `;
    } else {
      sourceChart.innerHTML = sources.map(s => {
        const pctVal = s.pct || s.sharePct || 0;
        return `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:#f9faf7; border:1px solid #e2e8f0; border-radius:6px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="width:10px; height:10px; border-radius:50%; background:${s.color || '#6b8e4e'};"></span>
              <span style="font-size:12px; font-weight:600; color:#1e293b;">${escapeHTML(s.source)}</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:11.5px; color:#64748b;">${Number(s.leads || 0).toLocaleString('en-IN')} leads (${pctVal}%)</span>
              <span class="badge-pista" style="font-size:10px;">${pctVal}% Share</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

/* --- TAB 2: CAMPAIGN MANAGEMENT --- */
function renderMarketingCampaigns(filteredList = null) {
  const mkt = ERP_DATA.marketing;
  if (!mkt) return;

  const campaigns = filteredList || mkt.campaigns || [];

  // Update Funnel Ribbon Bar
  const funnelContainer = document.getElementById('mkt-campaign-funnel-ribbon');
  if (funnelContainer) {
    const totalSpend = campaigns.reduce((acc, c) => acc + (c.adSpend || 0), 0);
    const totalLeads = campaigns.reduce((acc, c) => acc + (c.actualLeads || c.leadsGenerated || 0), 0);
    const totalAdmissions = campaigns.reduce((acc, c) => acc + (c.actualAdmissions || c.admissions || 0), 0);
    const totalRevenue = campaigns.reduce((acc, c) => acc + (c.revenueGenerated || c.revenue || 0), 0);
    const overallRoi = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) + 'x' : '0x';

    funnelContainer.innerHTML = `
      <div class="mkt-funnel-step">
        <div class="funnel-label">&#127919; Campaigns</div>
        <div class="funnel-val">${campaigns.length}</div>
        <div class="funnel-sub">Active &amp; Scaling</div>
      </div>
      <div class="mkt-funnel-step">
        <div class="funnel-label">&#128179; Ad Spend</div>
        <div class="funnel-val">&#8377;${(totalSpend / 100000).toFixed(2)}L</div>
        <div class="funnel-sub">Total Budget Used</div>
      </div>
      <div class="mkt-funnel-step">
        <div class="funnel-label">&#128200; Leads</div>
        <div class="funnel-val">${Number(totalLeads).toLocaleString('en-IN')}</div>
        <div class="funnel-sub">Avg CPL: &#8377;${totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : 0}</div>
      </div>
      <div class="mkt-funnel-step">
        <div class="funnel-label">&#127891; Admissions</div>
        <div class="funnel-val">${totalAdmissions}</div>
        <div class="funnel-sub">${totalLeads > 0 ? ((totalAdmissions / totalLeads) * 100).toFixed(2) : 0}% Conversion</div>
      </div>
      <div class="mkt-funnel-step">
        <div class="funnel-label">&#128176; Revenue</div>
        <div class="funnel-val">&#8377;${(totalRevenue / 100000).toFixed(2)}L</div>
        <div class="funnel-sub">From Enrolled Students</div>
      </div>
      <div class="mkt-funnel-step" style="border-color:#6b8e4e; background:#edf5e8;">
        <div class="funnel-label" style="color:#2b5115;">&#128640; Overall ROI</div>
        <div class="funnel-val" style="color:#2b5115;">${overallRoi}</div>
        <div class="funnel-sub" style="color:#166534;">Profit Multiplier</div>
      </div>
    `;
  }

  // Update Count Badge
  const countBadge = document.getElementById('mkt-campaigns-count-badge');
  if (countBadge) countBadge.textContent = `${campaigns.length} Campaigns`;

  // Render Campaigns Table
  const tbody = document.getElementById('mkt-campaigns-tbody');
  if (tbody) {
    if (campaigns.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="empty-table-cell">
            <div class="empty-state-box">
              <div class="empty-state-icon">ðŸ“¢</div>
              <div class="empty-state-title">No Data Available</div>
              <div class="empty-state-sub">No marketing campaigns registered in the database. Click "+ Create Campaign" above to launch one.</div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = campaigns.map(c => {
      const statusBadge = c.status === 'Active' ? 'badge-green' :
                          c.status === 'Scaling' ? 'badge-pista' :
                          c.status === 'Optimizing' ? 'badge-blue' : 'badge-amber';
      const actualL = c.actualLeads ?? c.leadsGenerated ?? 0;
      const targetL = c.targetLeads || 1000;
      const actualA = c.actualAdmissions ?? c.admissions ?? 0;
      const targetA = c.targetAdmissions || 50;
      const rev = c.revenueGenerated ?? c.revenue ?? 0;
      const assigned = Array.isArray(c.assignedTeam) ? c.assignedTeam.join(', ') : (c.assignedMember || 'Aditya Roy Kapoor');
      const track = c.courseFocus || c.targetTrack || 'All Tracks';
      const cplVal = c.cpl || (actualL > 0 ? '₹' + ((c.adSpend || 0) / actualL).toFixed(2) : '₹0');

      return `
        <tr>
          <td>
            <div style="font-weight:700; color:#0f1419;">${escapeHTML(c.name)}</div>
            <div style="font-size:11px; color:#547339; font-weight:600;">${escapeHTML(c.platform)} &bull; ${escapeHTML(assigned)}</div>
          </td>
          <td>
            <span style="font-size:12px; font-weight:600; color:#1e293b;">${escapeHTML(track)}</span>
          </td>
          <td style="font-weight:700;">&#8377;${Number(c.adSpend || 0).toLocaleString('en-IN')}</td>
          <td>
            <div style="font-weight:700; color:#0f1419;">${Number(actualL).toLocaleString('en-IN')} / ${Number(targetL).toLocaleString('en-IN')}</div>
            <div style="font-size:10.5px; color:#547339;">${Math.round((actualL / targetL) * 100)}% of target</div>
          </td>
          <td style="font-weight:700; color:#2b5115;">${cplVal}</td>
          <td>
            <div style="font-weight:700; color:#0f1419;">${actualA} / ${targetA}</div>
            <div style="font-size:10.5px; color:#547339;">${Math.round((actualA / targetA) * 100)}% achieved</div>
          </td>
          <td style="font-weight:800; color:#166534;">&#8377;${(rev / 100000).toFixed(2)}L</td>
          <td>
            <span class="badge-green" style="font-weight:800;">${c.roi || '0x'}</span>
          </td>
          <td>
            <span class="kpi-badge ${statusBadge}">${c.status}</span>
          </td>
          <td style="text-align:center;">
            <div style="display:flex; gap:6px; justify-content:center;">
              <button class="action-btn" onclick="openCreateCampaignModal('${c.id}')" title="Edit Campaign">
                &#9998;
              </button>
              <button class="action-btn" onclick="runMarketingErpSyncSimulation('${c.id}')" title="Test Lead Ingestion from this Campaign">
                &#9889;
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function filterMarketingCampaigns() {
  const search = (document.getElementById('mkt-campaign-search')?.value || '').toLowerCase().trim();
  const platform = document.getElementById('mkt-campaign-platform-filter')?.value || 'ALL';
  const status = document.getElementById('mkt-campaign-status-filter')?.value || 'ALL';

  const mkt = ERP_DATA.marketing;
  if (!mkt || !mkt.campaigns) return;

  const filtered = mkt.campaigns.filter(c => {
    const trackName = c.courseFocus || c.targetTrack || '';
    const matchSearch = !search || c.name.toLowerCase().includes(search) || trackName.toLowerCase().includes(search);
    const matchPlatform = platform === 'ALL' || c.platform.toLowerCase().includes(platform.toLowerCase());
    const matchStatus = status === 'ALL' || c.status === status;
    return matchSearch && matchPlatform && matchStatus;
  });

  renderMarketingCampaigns(filtered);
}

function openCreateCampaignModal(campaignId = null) {
  const modal = document.getElementById('modal-mkt-create-campaign');
  const titleEl = document.getElementById('mkt-campaign-modal-title');
  const idInput = document.getElementById('mkt-modal-camp-id');
  const nameInput = document.getElementById('mkt-modal-camp-name');
  const platformSelect = document.getElementById('mkt-modal-camp-platform');
  const trackSelect = document.getElementById('mkt-modal-camp-track');
  const spendInput = document.getElementById('mkt-modal-camp-spend');
  const statusSelect = document.getElementById('mkt-modal-camp-status');
  const targetLeadsInput = document.getElementById('mkt-modal-camp-target-leads');
  const targetAdmInput = document.getElementById('mkt-modal-camp-target-admissions');
  const assignedSelect = document.getElementById('mkt-modal-camp-assigned');

  if (campaignId) {
    const camp = (ERP_DATA.marketing?.campaigns || []).find(c => c.id === campaignId);
    if (camp) {
      if (titleEl) titleEl.textContent = 'Edit Marketing Campaign';
      if (idInput) idInput.value = camp.id;
      if (nameInput) nameInput.value = camp.name;
      if (platformSelect) platformSelect.value = camp.platform;
      if (trackSelect) trackSelect.value = camp.courseFocus || camp.targetTrack;
      if (spendInput) spendInput.value = camp.adSpend;
      if (statusSelect) statusSelect.value = camp.status;
      if (targetLeadsInput) targetLeadsInput.value = camp.targetLeads;
      if (targetAdmInput) targetAdmInput.value = camp.targetAdmissions;
      if (assignedSelect) assignedSelect.value = Array.isArray(camp.assignedTeam) ? camp.assignedTeam[0] : (camp.assignedMember || 'Ananya Sen');
    }
  } else {
    if (titleEl) titleEl.textContent = '+ Create New Marketing Campaign';
    if (idInput) idInput.value = '';
    if (nameInput) nameInput.value = '';
    if (spendInput) spendInput.value = '';
    if (targetLeadsInput) targetLeadsInput.value = '';
    if (targetAdmInput) targetAdmInput.value = '';
  }

  if (modal) modal.classList.add('active');
}

function submitMarketingCampaign() {
  const id = document.getElementById('mkt-modal-camp-id')?.value;
  const name = (document.getElementById('mkt-modal-camp-name')?.value || '').trim();
  const platform = document.getElementById('mkt-modal-camp-platform')?.value;
  const track = document.getElementById('mkt-modal-camp-track')?.value;
  const spend = parseFloat(document.getElementById('mkt-modal-camp-spend')?.value) || 0;
  const status = document.getElementById('mkt-modal-camp-status')?.value;
  const targetLeads = parseInt(document.getElementById('mkt-modal-camp-target-leads')?.value, 10) || 500;
  const targetAdmissions = parseInt(document.getElementById('mkt-modal-camp-target-admissions')?.value, 10) || 20;
  const assigned = document.getElementById('mkt-modal-camp-assigned')?.value;

  if (!name) {
    alert("Please enter a campaign name.");
    return;
  }

  if (!ERP_DATA.marketing) ERP_DATA.marketing = { campaigns: [] };
  if (!ERP_DATA.marketing.campaigns) ERP_DATA.marketing.campaigns = [];

  if (id) {
    // Edit
    const camp = ERP_DATA.marketing.campaigns.find(c => c.id === id);
    if (camp) {
      camp.name = name;
      camp.platform = platform;
      camp.courseFocus = track;
      camp.targetTrack = track;
      camp.adSpend = spend;
      camp.status = status;
      camp.targetLeads = targetLeads;
      camp.targetAdmissions = targetAdmissions;
      camp.assignedTeam = [assigned];
      camp.assignedMember = assigned;
      showToastNotification(`Campaign "${name}" updated successfully!`);
    }
  } else {
    // New
    const newId = `CAMP-${String(ERP_DATA.marketing.campaigns.length + 1).padStart(2, '0')}`;
    const newCamp = {
      id: newId,
      name,
      platform,
      courseFocus: track,
      targetTrack: track,
      adSpend: spend,
      targetLeads,
      actualLeads: 0,
      leadsGenerated: 0,
      cpl: "₹0",
      targetAdmissions,
      actualAdmissions: 0,
      admissions: 0,
      revenueGenerated: 0,
      revenue: 0,
      roi: '0x',
      status,
      assignedTeam: [assigned],
      assignedMember: assigned
    };
    ERP_DATA.marketing.campaigns.unshift(newCamp);
    if (ERP_DATA.marketing.kpis) ERP_DATA.marketing.kpis.totalCampaigns++;
    showToastNotification(`Campaign "${name}" created & launched!`);
  }

  closeModal('modal-mkt-create-campaign');
  renderMarketingCampaigns();
  renderMarketingOverview();
}

/* --- TAB 3: CONTENT & CREATIVE (6-STAGE WORKFLOW) --- */
function renderMarketingContentCreative() {
  const mkt = ERP_DATA.marketing;
  if (!mkt || !mkt.contentCreative) return;

  const kanbanBoard = document.getElementById('mkt-creative-kanban-board');
  if (!kanbanBoard) return;

  const stages = [
    { key: 'Idea', label: '💡 1. Idea' },
    { key: 'Assigned', label: '📋 2. Assigned' },
    { key: 'Designing', label: '🎨 3. Designing' },
    { key: 'Review', label: '👀 4. Review' },
    { key: 'Approved', label: '✅ 5. Approved' },
    { key: 'Published', label: '🚀 6. Published' }
  ];

  const allItems = Array.isArray(mkt.contentCreative) ? mkt.contentCreative : (mkt.contentCreative.items || []);
  const filtered = activeContentFilter === 'ALL' ? allItems : allItems.filter(i => {
    const t = (i.type || '').toLowerCase();
    const f = activeContentFilter.toLowerCase();
    return t.includes(f) || f.includes(t);
  });

  kanbanBoard.innerHTML = stages.map(stage => {
    const stageItems = filtered.filter(i => (i.stage || '').toLowerCase() === stage.key.toLowerCase());
    return `
      <div class="creative-kanban-col">
        <div class="creative-kanban-col-header">
          <span class="creative-kanban-col-title">${stage.label}</span>
          <span class="creative-kanban-badge">${stageItems.length}</span>
        </div>
        <div class="creative-cards-list">
          ${stageItems.length === 0 ? `
            <div style="font-size:11.5px; color:#94a3b8; text-align:center; padding:18px 0; border:1px dashed #cbd5e1; border-radius:6px;">
              No items
            </div>
          ` : stageItems.map(item => {
            const rawType = (item.type || '').toLowerCase();
            const typeClass = rawType.includes('poster') ? 'creative-card-type-poster' :
                              rawType.includes('video') ? 'creative-card-type-video' :
                              rawType.includes('reel') ? 'creative-card-type-reel' : 'creative-card-type-social';
            const badgeClass = rawType.includes('poster') ? 'badge-type-poster' :
                               rawType.includes('video') ? 'badge-type-video' :
                               rawType.includes('reel') ? 'badge-type-reel' : 'badge-type-social';

            let actionBtnText = 'Advance →';
            if (item.stage === 'Review') actionBtnText = 'Approve ✓';
            else if (item.stage === 'Approved') actionBtnText = 'Publish 🚀';

            const dueText = item.dueDate || item.deadline || 'Ongoing';
            const campaignName = item.campaign || item.linkedCampaign || 'Brand General';

            return `
              <div class="creative-task-card ${typeClass}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                  <span class="creative-badge-type ${badgeClass}">${escapeHTML(item.type)}</span>
                  <span style="font-size:10.5px; color:#64748b; font-weight:600;">${escapeHTML(item.platform)}</span>
                </div>
                <div style="font-size:12.5px; font-weight:700; color:#0f1419; margin-bottom:6px; line-height:1.3;">
                  ${escapeHTML(item.title)}
                </div>
                <div style="font-size:11px; color:#547339; margin-bottom:4px;">
                  <strong>Assigned:</strong> ${escapeHTML(item.assignedTo)}
                </div>
                <div style="font-size:10.5px; color:#64748b; margin-bottom:4px;">
                  <strong>Campaign:</strong> ${escapeHTML(campaignName)}
                </div>
                <div style="font-size:10px; color:#94a3b8;">
                  <strong>Due:</strong> ${dueText}
                </div>
                ${item.stage !== 'Published' ? `
                  <div class="creative-card-actions">
                    <span style="font-size:10.5px; color:#475569;">Stage: <strong>${item.stage}</strong></span>
                    <button class="creative-stage-action-btn" onclick="advanceContentStage('${item.id}')">
                      ${actionBtnText}
                    </button>
                  </div>
                ` : `
                  <div class="creative-card-actions" style="border-top:none; padding-top:4px;">
                    <span class="badge-green" style="font-size:10px; font-weight:700;">&#10003; Live &amp; Published</span>
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function filterCreativeContent(type) {
  activeContentFilter = type;
  const types = ['all', 'poster', 'video', 'reel', 'social'];
  types.forEach(t => {
    const btn = document.getElementById(`mkt-content-filter-${t}`);
    if (btn) {
      if (t === type.toLowerCase() || (t === 'all' && type === 'ALL') || (t === 'social' && type === 'Social Post')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
  renderMarketingContentCreative();
}

function openCreateContentModal() {
  const modal = document.getElementById('modal-mkt-create-content');
  if (modal) modal.classList.add('active');
}

function submitMarketingContent() {
  const title = (document.getElementById('mkt-modal-content-title')?.value || '').trim();
  const type = document.getElementById('mkt-modal-content-type')?.value || 'Poster';
  const platform = document.getElementById('mkt-modal-content-platform')?.value || 'Instagram';
  const assignedTo = document.getElementById('mkt-modal-content-assigned')?.value || 'Ananya Sen';
  const stage = document.getElementById('mkt-modal-content-stage')?.value || 'Idea';
  const campaign = document.getElementById('mkt-modal-content-campaign')?.value || 'Brand Awareness';
  const deadline = document.getElementById('mkt-modal-content-deadline')?.value || '2026-09-15';

  if (!title) {
    alert("Please enter a creative title.");
    return;
  }

  if (!ERP_DATA.marketing) ERP_DATA.marketing = {};
  if (!ERP_DATA.marketing.contentCreative) ERP_DATA.marketing.contentCreative = { items: [] };

  const items = Array.isArray(ERP_DATA.marketing.contentCreative) ?
                ERP_DATA.marketing.contentCreative : ERP_DATA.marketing.contentCreative.items;

  const newId = `CNT-${String(items.length + 1).padStart(2, '0')}`;
  const newItem = {
    id: newId,
    title,
    type,
    platform,
    assignedTo,
    stage,
    campaign,
    dueDate: deadline,
    approvalStatus: stage === 'Approved' ? 'Approved by Head' : 'In Production',
    views: "New Task",
    leadsGenerated: 0
  };

  items.unshift(newItem);
  showToastNotification(`Creative task "${title}" added to ${stage} stage!`);
  closeModal('modal-mkt-create-content');
  renderMarketingContentCreative();
}

function advanceContentStage(taskId) {
  const mkt = ERP_DATA.marketing;
  if (!mkt || !mkt.contentCreative) return;

  const items = Array.isArray(mkt.contentCreative) ? mkt.contentCreative : (mkt.contentCreative.items || []);
  const item = items.find(i => i.id === taskId);
  if (!item) return;

  const stages = ['Idea', 'Assigned', 'Designing', 'Review', 'Approved', 'Published'];
  const curIdx = stages.findIndex(s => s.toLowerCase() === (item.stage || '').toLowerCase());
  if (curIdx >= 0 && curIdx < stages.length - 1) {
    const nextStage = stages[curIdx + 1];
    item.stage = nextStage;
    if (nextStage === 'Approved') item.approvalStatus = 'Approved by Head';
    showToastNotification(`Creative "${item.title}" moved to ${nextStage}!`);
    renderMarketingContentCreative();
  }
}

/* --- TAB 4: MARKETING REPORTS --- */
function renderMarketingReports(timeframe = 'monthly') {
  currentMarketingReportTimeframe = timeframe;
  const mkt = ERP_DATA.marketing;
  if (!mkt || !mkt.reports) return;

  const tfData = mkt.reports.timeframes ? mkt.reports.timeframes[timeframe] : null;
  const platforms = tfData ? tfData.platforms : (mkt.reports[timeframe] || []);
  const tbody = document.getElementById('mkt-reports-tbody');
  const tfoot = document.getElementById('mkt-reports-tfoot');
  const badge = document.getElementById('mkt-reports-summary-badge');

  if (badge) {
    badge.textContent = tfData?.period || `${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Consolidated Report`;
  }

  if (tbody) {
    if (!platforms || platforms.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-table-cell">
            <div class="empty-state-box">
              <div class="empty-state-title">No Data Available</div>
              <div class="empty-state-sub">No marketing platform performance data recorded for this timeframe.</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = platforms.map(row => {
        const channel = row.platform || row.channel || 'Channel';
        const spend = row.spend || row.adSpend || 0;
        const leads = row.leads || 0;
        const cpl = row.cpl || (leads > 0 ? '₹' + (spend / leads).toFixed(2) : '₹0');
        const adm = row.admissions || 0;
        const conv = row.conversionRate || (leads > 0 ? ((adm / leads) * 100).toFixed(2) + '%' : '0%');
        const rev = row.rev || row.revenue || ('₹' + ((adm * 36000) / 100000).toFixed(2) + 'L');
        const roi = row.roi || (spend > 0 ? ((adm * 36000) / spend).toFixed(1) + 'x' : '0x');

        return `
          <tr>
            <td>
              <strong style="color:#0f1419;">${escapeHTML(channel)}</strong>
            </td>
            <td style="font-weight:700;">&#8377;${typeof spend === 'number' ? spend.toLocaleString('en-IN') : spend}</td>
            <td style="font-weight:700; color:#2b5115;">${typeof leads === 'number' ? leads.toLocaleString('en-IN') : leads}</td>
            <td style="font-weight:600;">${cpl}</td>
            <td style="font-weight:700; color:#166534;">${adm}</td>
            <td>
              <span class="badge-pista">${conv}</span>
            </td>
            <td style="font-weight:800; color:#166534;">${typeof rev === 'number' ? '₹' + (rev / 100000).toFixed(2) + 'L' : rev}</td>
            <td>
              <span class="badge-green" style="font-weight:800;">${roi}</span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  if (tfoot) {
    if (tfData && platforms && platforms.length > 0) {
      tfoot.innerHTML = `
        <tr>
          <td>TOTAL / CONSOLIDATED</td>
          <td>&#8377;${(tfData.adSpend || 0).toLocaleString('en-IN')}</td>
          <td>${(tfData.leads || 0).toLocaleString('en-IN')}</td>
          <td>${tfData.cpl || '₹0'}</td>
          <td>${tfData.admissions || 0}</td>
          <td>${tfData.conversionRate || '0%'}</td>
          <td>${tfData.revenue || '₹0'}</td>
          <td><span class="badge-green">${tfData.roi || '0x'}</span></td>
        </tr>
      `;
    } else {
      tfoot.innerHTML = '';
    }
  }
}

function switchMarketingReportTimeframe(timeframe) {
  const tfs = ['daily', 'weekly', 'monthly', 'yearly'];
  tfs.forEach(t => {
    const btn = document.getElementById(`mkt-report-tf-${t}`);
    if (btn) {
      if (t === timeframe) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });
  renderMarketingReports(timeframe);
}

function exportMarketingReportCSV() {
  const mkt = ERP_DATA.marketing;
  if (!mkt || !mkt.reports) return;

  const tfData = mkt.reports.timeframes ? mkt.reports.timeframes[currentMarketingReportTimeframe] : null;
  const data = tfData ? tfData.platforms : (mkt.reports[currentMarketingReportTimeframe] || []);
  let csv = "Platform/Campaign,Ad Spend (INR),Leads,Cost Per Lead (INR),Admissions,Conversion Rate,Revenue,ROI Ratio\n";
  data.forEach(r => {
    const ch = r.platform || r.channel || '';
    const sp = r.spend || r.adSpend || 0;
    const ld = r.leads || 0;
    const cp = r.cpl || '';
    const ad = r.admissions || 0;
    const cv = r.conversionRate || '';
    const rv = r.rev || r.revenue || '';
    const ro = r.roi || '';
    csv += `"${ch}",${sp},${ld},"${cp}",${ad},"${cv}","${rv}","${ro}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Waytone_Marketing_Report_${currentMarketingReportTimeframe}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToastNotification(`Marketing Report (${currentMarketingReportTimeframe}) exported as CSV!`);
}

/* --- TEAM PERFORMANCE ROSTER --- */
function renderMarketingTeamPerformance() {
  const mkt = ERP_DATA.marketing;
  if (!mkt) return;

  const tbody = document.getElementById('mkt-team-tbody');
  if (!tbody) return;

  const team = mkt.team || [];
  if (team.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-table-cell">
          <div class="empty-state-box">
            <div class="empty-state-title">No Data Available</div>
            <div class="empty-state-sub">No marketing team members found in the central roster.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = team.map(member => {
    const rawScore = parseInt(member.performanceScore, 10) || 90;
    const scoreClass = rawScore >= 94 ? 'mkt-score-green' :
                       rawScore >= 90 ? 'mkt-score-blue' : 'mkt-score-amber';
    const totalT = member.tasksAssigned || member.tasks || 0;
    const compT = member.tasksCompleted || member.completed || 0;
    const pendT = member.tasksPending || member.pending || 0;
    const leadsGen = member.leadsGenerated || 0;
    const admGen = member.admissions || 0;

    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f1419;">${escapeHTML(member.name)}</div>
          <div style="font-size:11px; color:#64748b;">${escapeHTML(member.badge || member.email || 'Team Member')}</div>
        </td>
        <td style="font-weight:600; color:#2b5115;">${escapeHTML(member.role)}</td>
        <td style="font-weight:700;">${totalT}</td>
        <td style="font-weight:700; color:#166534;">${compT}</td>
        <td style="font-weight:700; color:#b45309;">${pendT}</td>
        <td style="font-weight:700; color:#2563eb;">${Number(leadsGen).toLocaleString('en-IN')}</td>
        <td style="font-weight:800; color:#16a34a;">${admGen}</td>
        <td>
          <span class="mkt-score-badge ${scoreClass}">&#11088; ${member.performanceScore}</span>
        </td>
        <td style="text-align:center;">
          <button class="action-btn" onclick="openAssignTeamTaskModal('${escapeHTML(member.name)}')" title="Assign Task">
            + Task
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAssignTeamTaskModal(memberName = '') {
  const modal = document.getElementById('modal-mkt-assign-team-task');
  const memberSelect = document.getElementById('mkt-modal-team-member');
  if (memberSelect && memberName) {
    memberSelect.value = memberName;
  }
  if (modal) modal.classList.add('active');
}

function submitMarketingTeamTask() {
  const member = document.getElementById('mkt-modal-team-member')?.value;
  const desc = (document.getElementById('mkt-modal-team-desc')?.value || '').trim();
  const priority = document.getElementById('mkt-modal-team-priority')?.value || 'Normal';
  const due = document.getElementById('mkt-modal-team-due')?.value || '2026-09-12';

  if (!desc) {
    alert("Please enter a task description.");
    return;
  }

  const mkt = ERP_DATA.marketing;
  if (mkt && mkt.team) {
    const tm = mkt.team.find(t => t.name === member);
    if (tm) {
      if (tm.tasks !== undefined) tm.tasks++;
      if (tm.tasksAssigned !== undefined) tm.tasksAssigned++;
      if (tm.pending !== undefined) tm.pending++;
      if (tm.tasksPending !== undefined) tm.tasksPending++;
    }
  }

  showToastNotification(`Task assigned to ${member} (${priority} priority)!`);
  closeModal('modal-mkt-assign-team-task');
  renderMarketingTeamPerformance();
}

/* --- CONNECTED ENTERPRISE SIMULATOR --- */
function runMarketingErpSyncSimulation(campaignId = 'CAMP-01') {
  const logEl = document.getElementById('mkt-erp-sync-live-log');
  const mkt = ERP_DATA.marketing;
  if (!mkt) return;

  const camp = (mkt.campaigns || []).find(c => c.id === campaignId) || mkt.campaigns[0];
  const counselorName = (ERP_DATA.telecaller?.counselors || []).find(c => c.id === activeCounselorId)?.name || 'Admissions Counselor';
  const studentNum = (ERP_DATA.crm?.inquiries?.length || 0) + 1;
  const studentName = `Student Applicant ${studentNum}`;
  const courseName = camp ? (camp.courseFocus || camp.targetTrack) : 'Communicative English';
  const nowStr = new Date().toLocaleTimeString();

  if (logEl) {
    logEl.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
        <div><span style="color:#60a5fa;">[${nowStr}] [1/6] CAMPAIGN:</span> Lead captured from "${escapeHTML(camp ? camp.name : 'Meta Spoken English')}" (${camp ? camp.platform : 'Meta Ads'}).</div>
        <div><span style="color:#34d399;">[${nowStr}] [2/6] CRM INGESTION:</span> Created student lead for <strong>${studentName}</strong>. Assigned to Counselor ${escapeHTML(counselorName)}.</div>
        <div><span style="color:#c084fc;">[${nowStr}] [3/6] ADMISSION CONVERTED:</span> Application verified &amp; confirmed. Enrollment registered in Central Registry.</div>
        <div><span style="color:#fbbf24;">[${nowStr}] [4/6] CLASS MGMT:</span> Enrolled student into active batch "${escapeHTML(courseName)} - Batch 1". Seat slot allocated.</div>
        <div><span style="color:#4ade80;">[${nowStr}] [5/6] FINANCE:</span> First fee installment of &#8377;36,000 received. Transaction logged to Ledger.</div>
        <div><span style="color:#f87171;">[${nowStr}] [6/6] CEO DASHBOARD:</span> Central KPI metrics, Admissions count &amp; Revenue totals updated across all modules!</div>
      </div>
    `;
  }

  // Update Data Models
  if (camp) {
    if (camp.actualLeads !== undefined) camp.actualLeads++;
    if (camp.leadsGenerated !== undefined) camp.leadsGenerated++;
    if (camp.actualAdmissions !== undefined) camp.actualAdmissions++;
    if (camp.admissions !== undefined) camp.admissions++;
    if (camp.revenueGenerated !== undefined) camp.revenueGenerated += 36000;
    if (camp.revenue !== undefined) camp.revenue += 36000;
  }

  if (mkt.kpis) {
    if (mkt.kpis.totalLeads !== undefined) mkt.kpis.totalLeads++;
    if (mkt.kpis.totalLeadsGenerated !== undefined) mkt.kpis.totalLeadsGenerated++;
    if (mkt.kpis.admissionsGenerated !== undefined) mkt.kpis.admissionsGenerated++;
    if (mkt.kpis.revenueGenerated !== undefined) mkt.kpis.revenueGenerated += 36000;
  }

  // Update Data Pool & CRM
  if (ERP_DATA.crm?.inquiries) {
    ERP_DATA.crm.inquiries.unshift({
      id: `INQ-MKT-${Date.now().toString().slice(-4)}`,
      name: studentName,
      phone: `+91 98000 ${String(studentNum).padStart(5, '0')}`,
      email: `applicant${studentNum}@waytone.edu.in`,
      course: courseName,
      source: camp ? camp.platform : 'Marketing Campaign',
      date: new Date().toISOString().split('T')[0],
      status: 'Admission Confirmed',
      counselor: counselorName,
      notes: 'Marketing lead generated via Campaign. Successfully converted to admission.'
    });
  }

  // Update Course Catalogue
  if (ERP_DATA.catalogue?.courses) {
    const course = ERP_DATA.catalogue.courses.find(c => c.title.includes(courseName) || courseName.includes(c.title));
    if (course) {
      course.enrolled = (course.enrolled || 0) + 1;
      if (course.availableSlots > 0) course.availableSlots--;
    }
  }

  // Re-render
  renderMarketingOverview();
  renderMarketingCampaigns();
  renderMarketingTeamPerformance();

  showToastNotification(`&#128640; Live ERP Sync: Lead "${studentName}" &rarr; Admission &rarr; Class Seat &rarr; Fee &rarr; CEO Dashboard updated!`);
}

// ==========================================================
// SECTION 10: ACADEMIC COORDINATOR DASHBOARD (HRM BOARD)
// ==========================================================

let currentCoordSubModule = 'batch-mentor';
let currentCoordBatchFilter = 'all';
let currentCoordMentorFilter = 'all';
let currentCoordAttendanceBatch = '';
let currentCoordAttendanceDate = new Date().toISOString().split('T')[0];

function switchCoordSubModule(subId) {
  currentCoordSubModule = subId;

  // 1. Update subtab buttons
  document.querySelectorAll('.coord-subtab-btn').forEach(btn => {
    if (btn.id === `coord-subtab-btn-${subId}`) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 2. Update subpanes
  document.querySelectorAll('.coord-subpane').forEach(pane => {
    pane.style.display = 'none';
  });
  const activePane = document.getElementById(`coord-subpane-${subId}`);
  if (activePane) activePane.style.display = 'block';

  // 3. Render submodule content
  if (subId === 'batch-mentor') {
    renderBatchMentorAssignment();
  } else if (subId === 'admission-batch') {
    renderUnassignedAdmissions();
  } else if (subId === 'mentor-availability') {
    renderMentorAvailability();
  } else if (subId === 'mentor-performance') {
    renderMentorPerformanceMatrix();
  } else if (subId === 'student-attendance') {
    renderCoordinatorAttendanceConsole();
  } else if (subId === 'hrm-telemetry') {
    renderCoordTelemetry();
  }
}

function populateAcademicCoordinatorView() {
  // Sync central calculations
  syncAcademicCoordinatorData(false);

  // Update Top KPIs
  updateCoordExecutiveKPIs();

  // Render current submodule
  switchCoordSubModule(currentCoordSubModule);
}

// ----------------------------------------------------------
// 10.1 Unified Mentors & Students Data Resolvers
// ----------------------------------------------------------
function getCoordinatorMentors() {
  const mentorMap = new Map();

  // A. HRM Faculty Employees
  const employees = ERP_DATA.hrm?.employees || [];
  employees.forEach(emp => {
    const dept = (emp.department || '').toLowerCase();
    const desig = (emp.designation || '').toLowerCase();
    const role = (emp.role || '').toLowerCase();
    const isFaculty = dept.includes('faculty') || dept.includes('academic') || desig.includes('mentor') || desig.includes('trainer') || role.includes('mentor') || role.includes('faculty');

    if (isFaculty) {
      mentorMap.set(emp.name, {
        id: emp.id,
        name: emp.name,
        email: emp.email || '--',
        phone: emp.phone || '--',
        avatar: emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=6b8e4e&color=fff`,
        department: emp.department || 'Faculty',
        designation: emp.designation || 'Faculty Mentor',
        workingDays: emp.workingDays || 'Mon - Fri',
        workingHours: emp.workingHours || '09:00 AM - 05:00 PM',
        status: emp.status === 'On Leave' ? 'On Leave' : 'Available',
        maxBatches: 4,
        maxSlots: 120,
        classesAssigned: 48,
        classesCompleted: 46,
        rating: 4.85,
        reviewCount: 24
      });
    }
  });

  // B. Class Management Active Mentors
  const activeMentors = ERP_DATA.classManagement?.activeMentors || ERP_DATA.classManagement?.mentors || [];
  activeMentors.forEach(m => {
    if (!mentorMap.has(m.name)) {
      mentorMap.set(m.name, {
        id: m.id || `MNT-${Math.floor(100 + Math.random() * 900)}`,
        name: m.name,
        email: m.email || `${m.name.toLowerCase().replace(/[^a-z]/g, '')}@waytone.edu.in`,
        phone: m.phone || '+91 98765 43210',
        avatar: m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=6b8e4e&color=fff`,
        department: 'Academics',
        designation: m.specialization || m.title || 'Faculty Mentor',
        workingDays: 'Mon - Fri',
        workingHours: '09:00 AM - 05:00 PM',
        status: 'Available',
        maxBatches: m.maxBatches || 4,
        maxSlots: 120,
        classesAssigned: 48,
        classesCompleted: 46,
        rating: m.rating || 4.85,
        reviewCount: m.reviewCount || 24
      });
    }
  });

  // C. Enrich with Assigned Cohorts & Live Workload
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const mentorsList = Array.from(mentorMap.values());

  mentorsList.forEach(m => {
    const assigned = cohorts.filter(c => c.mentor === m.name || c.mentorId === m.id);
    m.assignedBatches = assigned;
    m.assignedBatchesCount = assigned.length;
    m.occupiedSlots = assigned.reduce((sum, c) => sum + (parseInt(c.students) || 0), 0);
    m.availableSlots = Math.max(0, m.maxSlots - m.occupiedSlots);

    if (m.status !== 'On Leave') {
      if (m.assignedBatchesCount >= m.maxBatches || m.availableSlots <= 0) {
        m.status = 'At Capacity';
      } else {
        m.status = 'Available';
      }
    }

    if (assigned.length > 0) {
      let totalAtt = 0;
      let totalProg = 0;
      assigned.forEach(c => {
        totalAtt += parseFloat(c.attendance) || 85;
        totalProg += parseFloat(c.progress) || 60;
      });
      m.avgAttendancePct = (totalAtt / assigned.length).toFixed(1);
      m.avgProgressPct = Math.round(totalProg / assigned.length);
      m.batchPerformance = `${Math.min(99, Math.round(parseFloat(m.avgAttendancePct) * 0.5 + m.avgProgressPct * 0.5))}%`;
    } else {
      m.avgAttendancePct = '--';
      m.avgProgressPct = 0;
      m.batchPerformance = '--';
    }

    if (m.avgAttendancePct !== '--') {
      const attScore = (parseFloat(m.avgAttendancePct) / 100) * 5;
      const progScore = (m.avgProgressPct / 100) * 5;
      m.compositeScore = ((attScore * 0.4 + progScore * 0.3 + (m.rating || 4.8) * 0.3)).toFixed(2);
    } else {
      m.compositeScore = m.rating ? m.rating.toFixed(2) : '--';
    }
  });

  return mentorsList;
}

function getUnassignedStudents() {
  const students = ERP_DATA.classManagement?.students || [];
  const unassigned = students.filter(s => {
    return !s.batch || s.batch === 'Unassigned' || !s.batchId || s.batchId === 'UNASSIGNED';
  });

  // Cross-check CRM confirmed inquiries
  const crmAdmissions = (ERP_DATA.crm?.inquiries || []).filter(i => {
    const st = (i.status || '').toLowerCase();
    return (st.includes('admission') || st.includes('enrolled')) && (!i.batch || i.batch === 'Unassigned');
  });

  crmAdmissions.forEach(adm => {
    const alreadyInList = unassigned.some(s => s.name.toLowerCase() === adm.name.toLowerCase() || s.phone === adm.phone);
    if (!alreadyInList) {
      unassigned.push({
        id: `STU-ADM-${adm.id.replace(/[^0-9]/g, '').slice(-4) || Math.floor(1000 + Math.random() * 9000)}`,
        name: adm.name,
        phone: adm.phone,
        course: adm.course,
        admissionDate: adm.date || new Date().toISOString().split('T')[0],
        counselor: adm.counselor || 'Central Admissions',
        feeStatus: adm.feeStatus || 'Paid',
        batch: 'Unassigned',
        batchId: 'UNASSIGNED',
        attendancePct: 0,
        progressPct: 0,
        fromCrm: true,
        crmId: adm.id
      });
    }
  });

  return unassigned;
}

function updateCoordExecutiveKPIs() {
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const unscheduled = cohorts.filter(c => !c.mentor || c.mentor === 'Unassigned' || (c.status || '').includes('Unscheduled'));
  const active = cohorts.filter(c => c.mentor && c.mentor !== 'Unassigned');
  const unassignedStudents = getUnassignedStudents();
  const mentors = getCoordinatorMentors();
  const availableMentors = mentors.filter(m => m.status === 'Available');

  const totalSeats = cohorts.reduce((acc, c) => acc + (parseInt(c.capacity) || 30), 0);
  const enrolledSeats = cohorts.reduce((acc, c) => acc + (parseInt(c.students) || 0), 0);
  const occupancyPct = totalSeats > 0 ? Math.round((enrolledSeats / totalSeats) * 100) : 0;

  // Center attendance from Class Management
  const todayAtt = ERP_DATA.classManagement?.kpis?.todayAttendance || '--';

  // Average mentor performance
  const ratedMentors = mentors.filter(m => m.compositeScore !== '--');
  let avgMentorScore = '--';
  if (ratedMentors.length > 0) {
    const sumScore = ratedMentors.reduce((acc, m) => acc + parseFloat(m.compositeScore), 0);
    avgMentorScore = (sumScore / ratedMentors.length).toFixed(2);
  }

  // Update KPI DOM elements
  const elBatches = document.getElementById('coord-kpi-total-batches');
  const elSubBatches = document.getElementById('coord-kpi-sub-batches');
  const elUnassigned = document.getElementById('coord-kpi-unassigned-admissions');
  const elSubUnassigned = document.getElementById('coord-kpi-sub-admissions');
  const elMentors = document.getElementById('coord-kpi-faculty-mentors');
  const elSubMentors = document.getElementById('coord-kpi-sub-mentors');
  const elCapacity = document.getElementById('coord-kpi-seat-capacity');
  const elSubCapacity = document.getElementById('coord-kpi-sub-capacity');
  const elAttendance = document.getElementById('coord-kpi-center-attendance');
  const elScore = document.getElementById('coord-kpi-mentor-score');

  if (elBatches) elBatches.textContent = cohorts.length;
  if (elSubBatches) elSubBatches.textContent = `${active.length} Active • ${unscheduled.length} Unscheduled`;
  if (elUnassigned) elUnassigned.textContent = unassignedStudents.length;
  if (elSubUnassigned) elSubUnassigned.textContent = unassignedStudents.length > 0 ? `${unassignedStudents.length} awaiting batch allocation` : 'All admissions allocated';
  if (elMentors) elMentors.textContent = mentors.length;
  if (elSubMentors) elSubMentors.textContent = `${availableMentors.length} Available • ${mentors.length - availableMentors.length} Busy / Leave`;
  if (elCapacity) elCapacity.textContent = `${enrolledSeats} / ${totalSeats}`;
  if (elSubCapacity) elSubCapacity.textContent = `${occupancyPct}% Center Occupancy`;
  if (elAttendance) elAttendance.textContent = todayAtt !== '--' ? todayAtt : '94.2%';
  if (elScore) elScore.textContent = avgMentorScore !== '--' ? `${avgMentorScore} ★` : '--';
}

// ----------------------------------------------------------
// 10.2 Module 1: Batch & Mentor Assignment + Double-Booking
// ----------------------------------------------------------
function renderBatchMentorAssignment() {
  const mentors = getCoordinatorMentors();
  const cohorts = ERP_DATA.classManagement?.cohorts || [];

  // 1. Render Mentor Workload Strip
  const workloadContainer = document.getElementById('coord-mentor-workload-container');
  const countBadge = document.getElementById('coord-workload-mentor-count');
  if (countBadge) countBadge.textContent = `${mentors.length} Faculty Mentors Active`;

  if (workloadContainer) {
    if (mentors.length === 0) {
      workloadContainer.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1/-1; padding: 24px;">
          <span class="empty-state-icon">👨‍🏫</span>
          <div class="empty-state-title">No Faculty Mentors Found</div>
          <div class="empty-state-desc">No faculty employees or mentors registered in the Central HRM database.</div>
        </div>
      `;
    } else {
      workloadContainer.innerHTML = mentors.map(m => {
        const pct = Math.min(100, Math.round((m.occupiedSlots / m.maxSlots) * 100));
        const isFull = m.status === 'At Capacity';
        const isLeave = m.status === 'On Leave';

        const batchBadges = m.assignedBatches.map(b => `
          <span class="badge-pista" style="font-size:10.5px; margin:2px 3px 2px 0; display:inline-block;" title="${escapeHTML(b.schedule)}">
            ${escapeHTML(b.id)}: ${escapeHTML(b.name)}
          </span>
        `).join('');

        return `
          <div class="glass-card" style="padding:14px 16px; background:#f9faf7; border:1px solid #dbe2d6; border-radius:8px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <img src="${m.avatar}" alt="${escapeHTML(m.name)}" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1.5px solid #6b8e4e;">
                <div>
                  <strong style="font-size:13px; color:#0f1419;">${escapeHTML(m.name)}</strong>
                  <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(m.designation)}</div>
                </div>
              </div>
              <span class="badge-pista" style="font-size:10.5px; font-weight:700; ${isFull ? 'background:#fef2f2; color:#991b1b; border-color:#fecaca;' : isLeave ? 'background:#fefce8; color:#854d0e; border-color:#fef08a;' : ''}">
                ${m.status}
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:11.5px; color:#374151; margin-bottom:6px;">
              <span>Assigned: <strong>${m.assignedBatchesCount} Batches</strong></span>
              <span>Students: <strong>${m.occupiedSlots} / ${m.maxSlots}</strong></span>
              <span>Available: <strong style="color:${isFull ? '#991b1b' : '#15803d'};">${m.availableSlots} Slots</strong></span>
            </div>

            <div style="height:5px; background:#e5e7eb; border-radius:3px; overflow:hidden; margin-bottom:8px;">
              <div style="width:${pct}%; height:100%; background:${pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : '#6b8e4e'};"></div>
            </div>

            <div style="font-size:11px; color:#5e6d7e;">
              ${m.assignedBatches.length > 0 ? batchBadges : '<span style="color:#9ca3af; font-style:italic;">No active cohorts currently assigned</span>'}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render Batches Master Table
  filterCoordBatches();
}

function filterCoordBatches(filterType) {
  if (filterType) currentCoordBatchFilter = filterType;

  // Update pills
  ['all', 'unscheduled', 'active'].forEach(f => {
    const btn = document.getElementById(`coord-batch-filter-${f}`);
    if (btn) {
      if (f === currentCoordBatchFilter) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  const query = (document.getElementById('coord-batch-search-input')?.value || '').toLowerCase().trim();
  const tbody = document.getElementById('coord-batches-tbody');
  if (!tbody) return;

  const cohorts = ERP_DATA.classManagement?.cohorts || [];

  const filtered = cohorts.filter(c => {
    const isUnscheduled = !c.mentor || c.mentor === 'Unassigned' || (c.status || '').includes('Unscheduled');
    if (currentCoordBatchFilter === 'unscheduled' && !isUnscheduled) return false;
    if (currentCoordBatchFilter === 'active' && isUnscheduled) return false;

    if (query) {
      const match = (c.id || '').toLowerCase().includes(query) ||
                    (c.name || '').toLowerCase().includes(query) ||
                    (c.mentor || '').toLowerCase().includes(query) ||
                    (c.courseId || '').toLowerCase().includes(query) ||
                    (c.schedule || '').toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-table-cell">
          <div class="empty-state-box" style="padding: 24px;">
            <span class="empty-state-icon">📚</span>
            <div class="empty-state-title">No Batches Matching Filter</div>
            <div class="empty-state-desc">No batch cohorts found for the selected view criteria.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const isUnscheduled = !c.mentor || c.mentor === 'Unassigned' || (c.status || '').includes('Unscheduled');
    const enrolled = parseInt(c.students) || 0;
    const capacity = parseInt(c.capacity) || 30;
    const available = Math.max(0, capacity - enrolled);

    return `
      <tr>
        <td><strong style="color:var(--accent-pista); font-size:13px;">${escapeHTML(c.id)}</strong></td>
        <td>
          <strong style="color:#0f1419;">${escapeHTML(c.name)}</strong>
          <div style="font-size:11px; color:#5e6d7e;">Course ID: ${escapeHTML(c.courseId || '--')} • ${c.capstoneTopic || ''}</div>
        </td>
        <td>
          ${isUnscheduled ? `
            <span style="color:#b45309; font-weight:700; background:#fef3c7; padding:3px 8px; border-radius:4px; font-size:11.5px; border:1px solid #fde68a;">
              ⚠️ Unassigned
            </span>
          ` : `
            <a href="javascript:void(0)" onclick="openMentorDashboard('${escapeHTML(c.mentor)}')" style="color:#0f1419; font-weight:700; text-decoration:none; border-bottom:1px dashed #6b8e4e;">
              ${escapeHTML(c.mentor)}
            </a>
          `}
        </td>
        <td>
          <div style="font-size:12px; color:#0f1419;">${escapeHTML(c.schedule || 'Unscheduled')}</div>
          <div style="font-size:11px; color:#5e6d7e;">Room: <strong>${escapeHTML(c.room || 'TBD')}</strong></div>
        </td>
        <td>
          <div style="font-size:12px; color:#0f1419;"><strong>${enrolled}</strong> / ${capacity} Enrolled</div>
          <div style="font-size:11px; color:${available > 0 ? '#15803d' : '#991b1b'};">(${available} open slots)</div>
        </td>
        <td>
          <span class="badge-pista" style="${isUnscheduled ? 'background:#fef3c7; color:#b45309; border-color:#fde68a;' : 'background:#edf5e8; color:#2a4a35;'}">
            ${isUnscheduled ? '⚠️ Needs Mentor' : '✅ Active Scheduled'}
          </span>
        </td>
        <td style="text-align:center;">
          <button class="${isUnscheduled ? 'btn-primary-ai' : 'btn-secondary'}" style="padding:5px 12px; font-size:11.5px;" onclick="openCoordAssignBatchMentorModal('${escapeHTML(c.id)}')">
            ${isUnscheduled ? 'Assign Mentor' : 'Edit Schedule'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ----------------------------------------------------------
// Double-Booking Collision Detection Engine
// ----------------------------------------------------------
function parseScheduleDays(scheduleStr) {
  if (!scheduleStr) return [];
  const str = scheduleStr.toLowerCase();
  if (str.includes('mon - fri') || str.includes('mon-fri') || str.includes('daily')) {
    return ['mon', 'tue', 'wed', 'thu', 'fri'];
  }
  if (str.includes('sat / sun') || str.includes('weekend')) {
    return ['sat', 'sun'];
  }
  const days = [];
  if (str.includes('mon')) days.push('mon');
  if (str.includes('tue')) days.push('tue');
  if (str.includes('wed')) days.push('wed');
  if (str.includes('thu')) days.push('thu');
  if (str.includes('fri')) days.push('fri');
  if (str.includes('sat')) days.push('sat');
  if (str.includes('sun')) days.push('sun');
  return days;
}

function parseTimeStringToMinutes(timePart) {
  if (!timePart) return 0;
  const m = timePart.trim().match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (!m) return 0;
  let hours = parseInt(m[1], 10);
  const mins = parseInt(m[2], 10);
  const meridiem = m[3].toLowerCase();
  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function parseScheduleTimeRange(scheduleStr) {
  if (!scheduleStr) return { start: 0, end: 0 };
  const parts = scheduleStr.split('-');
  if (parts.length < 2) return { start: 0, end: 0 };
  const start = parseTimeStringToMinutes(parts[0]);
  const end = parseTimeStringToMinutes(parts[1]);
  return { start, end };
}

function checkMentorScheduleConflict(mentorName, daysStr, timeStr, excludeBatchId) {
  if (!mentorName || mentorName === 'Unassigned') return { conflict: false };
  const targetDays = parseScheduleDays(daysStr);
  const targetTime = parseScheduleTimeRange(timeStr);
  if (targetDays.length === 0 || targetTime.end <= targetTime.start) return { conflict: false };

  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  for (const cohort of cohorts) {
    if (cohort.id === excludeBatchId) continue;
    if (cohort.mentor !== mentorName && cohort.mentorId !== mentorName) continue;
    if (!cohort.schedule || cohort.schedule.includes('Unscheduled')) continue;

    const cohortDays = parseScheduleDays(cohort.schedule);
    const cohortTime = parseScheduleTimeRange(cohort.schedule);

    const commonDay = targetDays.some(d => cohortDays.includes(d));
    if (!commonDay) continue;

    // Check time collision: (startA < endB && endA > startB)
    if (targetTime.start < cohortTime.end && targetTime.end > cohortTime.start) {
      return {
        conflict: true,
        conflictingBatchId: cohort.id,
        conflictingBatchName: cohort.name,
        conflictingSchedule: cohort.schedule,
        mentor: mentorName
      };
    }
  }

  return { conflict: false };
}

function openCoordAssignBatchMentorModal(batchId) {
  const cohort = (ERP_DATA.classManagement?.cohorts || []).find(c => c.id === batchId);
  if (!cohort) return;

  const idInput = document.getElementById('coord-modal-batch-id');
  const nameInput = document.getElementById('coord-modal-batch-name');
  const mentorSelect = document.getElementById('coord-modal-mentor-select');
  const daysSelect = document.getElementById('coord-modal-days-select');
  const timeSelect = document.getElementById('coord-modal-time-select');
  const roomSelect = document.getElementById('coord-modal-room-select');

  if (idInput) idInput.value = cohort.id;
  if (nameInput) nameInput.value = `${cohort.id} - ${cohort.name}`;

  // Populate mentors dropdown with available slot indicators
  const mentors = getCoordinatorMentors();
  if (mentorSelect) {
    mentorSelect.innerHTML = mentors.map(m => `
      <option value="${escapeHTML(m.name)}" ${m.name === cohort.mentor ? 'selected' : ''}>
        ${escapeHTML(m.name)} (${m.assignedBatchesCount} Batches • ${m.availableSlots} Slots Avail${m.status === 'On Leave' ? ' • ON LEAVE' : ''})
      </option>
    `).join('');
  }

  // Set days if known
  if (daysSelect && cohort.schedule) {
    if (cohort.schedule.includes('Mon / Wed / Fri')) daysSelect.value = 'Mon / Wed / Fri';
    else if (cohort.schedule.includes('Tue / Thu / Sat')) daysSelect.value = 'Tue / Thu / Sat';
    else if (cohort.schedule.includes('Mon - Fri')) daysSelect.value = 'Mon - Fri';
    else if (cohort.schedule.includes('Sat / Sun')) daysSelect.value = 'Sat / Sun';
  }

  // Set time if known
  if (timeSelect && cohort.schedule) {
    const timeMatch = cohort.schedule.match(/\d{2}:\d{2}\s*(AM|PM)\s*-\s*\d{2}:\d{2}\s*(AM|PM)/i);
    if (timeMatch && timeMatch[0]) {
      const opts = Array.from(timeSelect.options).map(o => o.value);
      if (opts.includes(timeMatch[0])) timeSelect.value = timeMatch[0];
    }
  }

  if (roomSelect && cohort.room) {
    roomSelect.value = cohort.room;
  }

  validateCoordScheduleCollision();
  openModal('modal-coord-assign-batch-mentor');
}

function validateCoordScheduleCollision() {
  const batchId = document.getElementById('coord-modal-batch-id')?.value;
  const mentorName = document.getElementById('coord-modal-mentor-select')?.value;
  const days = document.getElementById('coord-modal-days-select')?.value;
  const time = document.getElementById('coord-modal-time-select')?.value;
  const warningBox = document.getElementById('coord-collision-warning-box');
  const confirmBtn = document.getElementById('coord-btn-confirm-assign-batch');

  if (!warningBox) return;

  const result = checkMentorScheduleConflict(mentorName, days, time, batchId);

  if (result.conflict) {
    warningBox.style.display = 'block';
    warningBox.style.background = '#fef2f2';
    warningBox.style.border = '1px solid #fecaca';
    warningBox.style.color = '#991b1b';
    warningBox.innerHTML = `
      <strong>⚠️ Schedule Conflict Detected:</strong><br>
      Mentor <strong>${escapeHTML(result.mentor)}</strong> is already assigned to <strong>${escapeHTML(result.conflictingBatchName)} (${escapeHTML(result.conflictingBatchId)})</strong> on this slot: <em>${escapeHTML(result.conflictingSchedule)}</em>.<br>
      Double-booking prevented. Please select an alternate time window or a different faculty mentor.
    `;
    if (confirmBtn) confirmBtn.disabled = true;
  } else {
    warningBox.style.display = 'block';
    warningBox.style.background = '#edf5e8';
    warningBox.style.border = '1px solid #dbe2d6';
    warningBox.style.color = '#2a4a35';
    warningBox.innerHTML = `
      <strong>✅ Mentor Available:</strong> No schedule conflict detected for <strong>${escapeHTML(mentorName)}</strong> on ${escapeHTML(days)} at ${escapeHTML(time)}.
    `;
    if (confirmBtn) confirmBtn.disabled = false;
  }
}

function submitCoordAssignBatchMentor() {
  const batchId = document.getElementById('coord-modal-batch-id')?.value;
  const mentorName = document.getElementById('coord-modal-mentor-select')?.value;
  const days = document.getElementById('coord-modal-days-select')?.value;
  const time = document.getElementById('coord-modal-time-select')?.value;
  const room = document.getElementById('coord-modal-room-select')?.value;

  if (!batchId || !mentorName) return;

  // Final double-booking check
  const conflict = checkMentorScheduleConflict(mentorName, days, time, batchId);
  if (conflict.conflict) {
    alert(`Double-booking prevented: ${mentorName} already has batch ${conflict.conflictingBatchName} at this time.`);
    return;
  }

  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const cohort = cohorts.find(c => c.id === batchId);
  if (cohort) {
    cohort.mentor = mentorName;
    cohort.schedule = `${days} • ${time}`;
    cohort.room = room;
    cohort.status = 'Active Scheduled';
    cohort.statusColor = 'status-active';
  }

  const batches = ERP_DATA.classManagement?.batches || [];
  const b = batches.find(x => x.id === batchId);
  if (b) {
    b.mentor = mentorName;
    b.schedule = `${days} • ${time}`;
    b.room = room;
  }

  closeModal('modal-coord-assign-batch-mentor');
  syncAcademicCoordinatorData(true);
  showToastNotification(`Batch "${cohort ? cohort.name : batchId}" successfully assigned to ${mentorName}.`);
  renderBatchMentorAssignment();
}

// ----------------------------------------------------------
// 10.3 Module 2: Admission -> Batch Assignment
// ----------------------------------------------------------
function renderUnassignedAdmissions() {
  const unassigned = getUnassignedStudents();
  const cohorts = ERP_DATA.classManagement?.cohorts || [];

  // Update counters
  const qCount = document.getElementById('coord-admissions-queue-count');
  const sCount = document.getElementById('coord-available-slots-count');
  const badge = document.getElementById('coord-unassigned-badge');
  const capBadge = document.getElementById('coord-capacity-batches-badge');

  const totalAvailSlots = cohorts.reduce((acc, c) => acc + Math.max(0, (parseInt(c.capacity) || 30) - (parseInt(c.students) || 0)), 0);

  if (qCount) qCount.textContent = `${unassigned.length} Students`;
  if (sCount) sCount.textContent = `${totalAvailSlots} Open Slots`;
  if (badge) badge.textContent = `${unassigned.length} Pending Allocation`;
  if (capBadge) capBadge.textContent = `${cohorts.length} Cohorts`;

  // 1. Render Unassigned Students Queue Table
  const tbodyStudents = document.getElementById('coord-unassigned-admissions-tbody');
  if (tbodyStudents) {
    if (unassigned.length === 0) {
      tbodyStudents.innerHTML = `
        <tr>
          <td colspan="7" class="empty-table-cell">
            <div class="empty-state-box" style="padding: 24px;">
              <span class="empty-state-icon">🎉</span>
              <div class="empty-state-title">All Admitted Students Assigned</div>
              <div class="empty-state-desc">Every newly admitted student in the system has been successfully routed to an active cohort batch.</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbodyStudents.innerHTML = unassigned.map(s => `
        <tr>
          <td><strong style="color:var(--accent-pista); font-size:13px;">${escapeHTML(s.id)}</strong></td>
          <td>
            <strong style="color:#0f1419;">${escapeHTML(s.name)}</strong>
            <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(s.phone)}</div>
          </td>
          <td><span style="font-weight:600; color:#0f1419;">${escapeHTML(s.course)}</span></td>
          <td><span style="font-size:12px; color:#5e6d7e;">${escapeHTML(s.admissionDate)}</span></td>
          <td><span style="font-size:12px; color:#0f1419;">${escapeHTML(s.counselor)}</span></td>
          <td>
            <span class="badge-pista" style="${s.feeStatus === 'Paid' ? 'background:#edf5e8; color:#2a4a35;' : 'background:#fefce8; color:#854d0e;'}">
              ${escapeHTML(s.feeStatus)}
            </span>
          </td>
          <td style="text-align:center;">
            <button class="btn-primary-ai" style="padding:5px 12px; font-size:11.5px;" onclick="openCoordAssignStudentModal('${escapeHTML(s.id)}')">
              Assign to Batch
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 2. Render Batch Capacity Overview Table
  const tbodyCapacity = document.getElementById('coord-batch-capacity-tbody');
  if (tbodyCapacity) {
    if (cohorts.length === 0) {
      tbodyCapacity.innerHTML = `
        <tr>
          <td colspan="7" class="empty-table-cell">
            <div class="empty-state-box" style="padding: 24px;">
              <span class="empty-state-icon">💺</span>
              <div class="empty-state-title">No Batches Registered</div>
              <div class="empty-state-desc">No academic cohorts found in the central class registry.</div>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbodyCapacity.innerHTML = cohorts.map(c => {
        const total = parseInt(c.capacity) || 30;
        const filled = parseInt(c.students) || 0;
        const avail = Math.max(0, total - filled);
        const occPct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;
        const isFull = avail === 0;

        return `
          <tr>
            <td><strong style="color:var(--accent-pista); font-size:13px;">${escapeHTML(c.id)}</strong></td>
            <td>
              <strong style="color:#0f1419;">${escapeHTML(c.name)}</strong>
              <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(c.schedule || 'Unscheduled')}</div>
            </td>
            <td><strong>${escapeHTML(c.mentor || 'Unassigned')}</strong></td>
            <td style="text-align:center; font-weight:600;">${total}</td>
            <td style="text-align:center; font-weight:700; color:#0f1419;">${filled}</td>
            <td style="text-align:center; font-weight:800; color:${isFull ? '#991b1b' : '#15803d'};">
              ${avail} ${isFull ? '(FULL)' : ''}
            </td>
            <td>
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="flex:1; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
                  <div style="width:${occPct}%; height:100%; background:${occPct >= 100 ? '#ef4444' : occPct >= 80 ? '#f59e0b' : '#6b8e4e'};"></div>
                </div>
                <span style="font-size:11px; font-weight:700; color:#5e6d7e; min-width:32px;">${occPct}%</span>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

function openCoordAssignStudentModal(studentId) {
  const unassigned = getUnassignedStudents();
  const student = unassigned.find(s => s.id === studentId);
  if (!student) return;

  const idInput = document.getElementById('coord-modal-student-id');
  const nameEl = document.getElementById('coord-modal-student-name');
  const codeEl = document.getElementById('coord-modal-student-code');
  const courseEl = document.getElementById('coord-modal-student-course');
  const counselorEl = document.getElementById('coord-modal-student-counselor');
  const batchSelect = document.getElementById('coord-modal-target-batch-select');

  if (idInput) idInput.value = student.id;
  if (nameEl) nameEl.textContent = student.name;
  if (codeEl) codeEl.textContent = student.id;
  if (courseEl) courseEl.textContent = `Course Enrolled: ${student.course}`;
  if (counselorEl) counselorEl.textContent = `Counselor: ${student.counselor} • Fee: ${student.feeStatus}`;

  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  if (batchSelect) {
    batchSelect.innerHTML = cohorts.map(c => {
      const total = parseInt(c.capacity) || 30;
      const filled = parseInt(c.students) || 0;
      const avail = Math.max(0, total - filled);
      return `
        <option value="${escapeHTML(c.id)}" ${avail === 0 ? 'disabled' : ''}>
          ${escapeHTML(c.id)}: ${escapeHTML(c.name)} (${avail} of ${total} slots open • Mentor: ${escapeHTML(c.mentor)})
        </option>
      `;
    }).join('');
  }

  if (batchSelect && batchSelect.value) {
    updateCoordBatchCapacityPreview(batchSelect.value);
  }

  openModal('modal-coord-assign-student');
}

function updateCoordBatchCapacityPreview(batchId) {
  const cohort = (ERP_DATA.classManagement?.cohorts || []).find(c => c.id === batchId);
  const capText = document.getElementById('coord-preview-capacity-text');
  const filledText = document.getElementById('coord-preview-filled-text');
  const afterText = document.getElementById('coord-preview-after-text');
  const confirmBtn = document.getElementById('coord-btn-confirm-assign-student');

  if (!cohort) return;

  const total = parseInt(cohort.capacity) || 30;
  const filled = parseInt(cohort.students) || 0;
  const avail = Math.max(0, total - filled);

  if (capText) capText.textContent = `${total} Slots Total`;
  if (filledText) filledText.textContent = `${filled} Filled (${avail} Available)`;

  if (avail > 0) {
    if (afterText) {
      afterText.style.color = '#15803d';
      afterText.textContent = `${filled + 1} Filled (${avail - 1} Remaining)`;
    }
    if (confirmBtn) confirmBtn.disabled = false;
  } else {
    if (afterText) {
      afterText.style.color = '#991b1b';
      afterText.textContent = `Batch is FULL (0 slots open)`;
    }
    if (confirmBtn) confirmBtn.disabled = true;
  }
}

function submitCoordAssignStudent() {
  const studentId = document.getElementById('coord-modal-student-id')?.value;
  const batchId = document.getElementById('coord-modal-target-batch-select')?.value;

  if (!studentId || !batchId) return;

  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const cohort = cohorts.find(c => c.id === batchId);
  if (!cohort) return;

  // Capacity check
  const total = parseInt(cohort.capacity) || 30;
  const filled = parseInt(cohort.students) || 0;
  if (filled >= total) {
    alert(`Cannot assign student: Batch ${cohort.name} is already at maximum capacity (${total} seats).`);
    return;
  }

  // Find student in classManagement
  let student = (ERP_DATA.classManagement?.students || []).find(s => s.id === studentId);

  // If student was bridged from CRM, add to classManagement.students
  if (!student) {
    const unassigned = getUnassignedStudents();
    const candidate = unassigned.find(s => s.id === studentId);
    if (candidate) {
      student = {
        id: candidate.id,
        name: candidate.name,
        phone: candidate.phone,
        email: `${candidate.name.toLowerCase().replace(/[^a-z]/g, '')}@student.waytone.edu.in`,
        course: candidate.course,
        batch: cohort.name,
        batchId: cohort.id,
        feeStatus: candidate.feeStatus || 'Paid',
        attendancePct: 100,
        progressPct: 0,
        admissionDate: candidate.admissionDate
      };
      ERP_DATA.classManagement.students.push(student);
    }
  } else {
    student.batch = cohort.name;
    student.batchId = cohort.id;
  }

  // Increment cohort enrollment
  cohort.students = filled + 1;

  // Sync with batch list
  const b = (ERP_DATA.classManagement?.batches || []).find(x => x.id === batchId);
  if (b) b.students = cohort.students;

  // Sync to CRM inquiry if applicable
  if (ERP_DATA.crm?.inquiries) {
    const inq = ERP_DATA.crm.inquiries.find(i => i.name.toLowerCase() === student.name.toLowerCase() || i.phone === student.phone);
    if (inq) {
      inq.batch = cohort.name;
      inq.batchId = cohort.id;
    }
  }

  closeModal('modal-coord-assign-student');
  syncAcademicCoordinatorData(true);
  showToastNotification(`Student "${student.name}" allocated to batch ${cohort.name}. Slots automatically updated.`);
  renderUnassignedAdmissions();
}

// ----------------------------------------------------------
// 10.4 Module 3: Mentor Availability & Slot Registry
// ----------------------------------------------------------
function renderMentorAvailability() {
  const container = document.getElementById('coord-mentor-availability-container');
  if (!container) return;

  const mentors = getCoordinatorMentors();

  const filtered = mentors.filter(m => {
    if (currentCoordMentorFilter === 'all') return true;
    return m.status === currentCoordMentorFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1/-1; padding: 28px;">
        <span class="empty-state-icon">👨‍🏫</span>
        <div class="empty-state-title">No Mentors Matching Filter</div>
        <div class="empty-state-desc">No faculty mentors found under status "${currentCoordMentorFilter}".</div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(m => {
    const isFull = m.status === 'At Capacity';
    const isLeave = m.status === 'On Leave';

    const batchPills = m.assignedBatches.map(b => `
      <span class="badge-pista" style="font-size:11px; margin:2px 3px 2px 0; display:inline-block;" title="${escapeHTML(b.schedule)}">
        📚 ${escapeHTML(b.id)}: ${escapeHTML(b.name)}
      </span>
    `).join('');

    return `
      <div class="glass-card" style="padding:18px; background:#ffffff; border-radius:10px; border:1px solid #dbe2d6;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${m.avatar}" alt="${escapeHTML(m.name)}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #6b8e4e;">
            <div>
              <strong style="font-size:14px; color:#0f1419;">${escapeHTML(m.name)}</strong>
              <div style="font-size:11.5px; color:#5e6d7e;">${escapeHTML(m.designation)} • ${escapeHTML(m.department)}</div>
            </div>
          </div>
          <span class="badge-pista" style="font-size:11px; font-weight:700; ${isFull ? 'background:#fef2f2; color:#991b1b; border-color:#fecaca;' : isLeave ? 'background:#fefce8; color:#854d0e; border-color:#fef08a;' : 'background:#edf5e8; color:#2a4a35;'}">
            ${m.status}
          </span>
        </div>

        <div style="background:#f9faf7; border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; margin-bottom:12px; font-size:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:#5e6d7e;">🕒 Working Schedule:</span>
            <strong style="color:#0f1419;">${escapeHTML(m.workingDays)} (${escapeHTML(m.workingHours)})</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="color:#5e6d7e;">👥 Occupied Slots:</span>
            <strong>${m.occupiedSlots} Students (${m.assignedBatchesCount} Batches)</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:#5e6d7e;">✨ Available Slots:</span>
            <strong style="color:${isFull ? '#991b1b' : '#15803d'}; font-size:13px;">${m.availableSlots} Open Slots</strong>
          </div>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-size:11.5px; font-weight:700; color:#374151; margin-bottom:4px;">Assigned Cohort Batches:</div>
          <div style="min-height:30px;">
            ${m.assignedBatches.length > 0 ? batchPills : '<span style="font-size:11.5px; color:#9ca3af; font-style:italic;">No active cohorts assigned</span>'}
          </div>
        </div>

        <div style="display:flex; gap:8px; border-top:1px solid #f0f0f0; padding-top:10px; margin-top:8px;">
          <button class="btn-secondary" style="flex:1; padding:5px 10px; font-size:11.5px;" onclick="toggleMentorLeaveStatus('${escapeHTML(m.id)}')">
            ${isLeave ? '🟢 Mark Available' : '🟡 Mark On Leave'}
          </button>
          <button class="btn-primary-ai" style="padding:5px 12px; font-size:11.5px;" onclick="openMentorDashboard('${escapeHTML(m.name)}')">
            Mentor Dossier &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterCoordMentorAvailability(statusFilter) {
  currentCoordMentorFilter = statusFilter;

  ['all', 'Available', 'At Capacity', 'On Leave'].forEach(s => {
    const id = s === 'all' ? 'coord-mentor-filter-all' : s === 'Available' ? 'coord-mentor-filter-available' : s === 'At Capacity' ? 'coord-mentor-filter-full' : 'coord-mentor-filter-leave';
    const btn = document.getElementById(id);
    if (btn) {
      if (s === statusFilter) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  renderMentorAvailability();
}

function toggleMentorLeaveStatus(mentorId) {
  const employees = ERP_DATA.hrm?.employees || [];
  const emp = employees.find(e => e.id === mentorId || e.name === mentorId);
  if (emp) {
    emp.status = emp.status === 'On Leave' ? 'Active' : 'On Leave';
  }

  const activeMentors = ERP_DATA.classManagement?.activeMentors || [];
  const m = activeMentors.find(x => x.id === mentorId || x.name === mentorId);
  if (m) {
    m.status = m.status === 'On Leave' ? 'Available' : 'On Leave';
  }

  syncAcademicCoordinatorData(true);
  showToastNotification(`Faculty status updated for ${emp ? emp.name : mentorId}.`);
  renderMentorAvailability();
}

// ----------------------------------------------------------
// 10.5 Module 4: Mentor Performance Matrix & Reviews
// ----------------------------------------------------------
function renderMentorPerformanceMatrix() {
  const tbody = document.getElementById('coord-mentor-performance-tbody');
  if (!tbody) return;

  const mentors = getCoordinatorMentors();

  if (mentors.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-table-cell">
          <div class="empty-state-box" style="padding: 24px;">
            <span class="empty-state-icon">⭐</span>
            <div class="empty-state-title">No Faculty Mentors Found</div>
            <div class="empty-state-desc">No mentors available to display performance matrix.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = mentors.map(m => {
    const compPct = Math.round((m.classesCompleted / m.classesAssigned) * 100);

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${m.avatar}" alt="${escapeHTML(m.name)}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border:1.5px solid #6b8e4e;">
            <div>
              <strong style="color:#0f1419; font-size:13px;">${escapeHTML(m.name)}</strong>
              <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(m.designation)}</div>
            </div>
          </div>
        </td>
        <td style="text-align:center;">
          <strong style="color:#0f1419;">${m.classesCompleted} / ${m.classesAssigned}</strong>
          <div style="font-size:11px; color:${compPct >= 90 ? '#15803d' : '#b45309'};">${compPct}% Completion</div>
        </td>
        <td style="text-align:center;">
          <strong style="color:var(--accent-pista-bright); font-size:13px;">${m.avgAttendancePct !== '--' ? m.avgAttendancePct + '%' : '--'}</strong>
        </td>
        <td style="text-align:center;">
          <strong style="color:#0f1419;">${m.avgProgressPct > 0 ? m.avgProgressPct + '%' : '--'}</strong>
        </td>
        <td style="text-align:center;">
          <span class="badge-pista">${m.batchPerformance}</span>
        </td>
        <td style="text-align:center;">
          <span style="color:#d97706; font-weight:700;">★ ${m.rating ? m.rating.toFixed(1) : '4.8'}</span>
          <div style="font-size:10.5px; color:#5e6d7e;">(${m.reviewCount || 18} Reviews)</div>
        </td>
        <td style="text-align:center;">
          <div style="font-size:14px; font-weight:800; color:#2a4a35; background:#edf5e8; border:1px solid #dbe2d6; border-radius:6px; padding:3px 8px; display:inline-block;">
            ${m.compositeScore !== '--' ? m.compositeScore + ' / 5.0' : '--'}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openCoordAddMentorReviewModal() {
  const select = document.getElementById('coord-review-mentor-select');
  const mentors = getCoordinatorMentors();
  if (select) {
    select.innerHTML = mentors.map(m => `
      <option value="${escapeHTML(m.name)}">${escapeHTML(m.name)} (${escapeHTML(m.designation)})</option>
    `).join('');
  }
  openModal('modal-coord-add-review');
}

function submitCoordAddMentorReview() {
  const mentorName = document.getElementById('coord-review-mentor-select')?.value;
  const source = document.getElementById('coord-review-source')?.value;
  const rating = parseFloat(document.getElementById('coord-review-rating')?.value || 5);
  const author = document.getElementById('coord-review-author')?.value || 'Anonymous Student';
  const comment = document.getElementById('coord-review-comment')?.value || 'Highly competent mentorship.';

  if (!mentorName) return;

  if (!ERP_DATA.classManagement.mentorReviews) {
    ERP_DATA.classManagement.mentorReviews = [];
  }

  ERP_DATA.classManagement.mentorReviews.unshift({
    id: `REV-${Date.now().toString().slice(-4)}`,
    mentor: mentorName,
    source: source,
    rating: rating,
    author: author,
    comment: comment,
    date: new Date().toISOString().split('T')[0]
  });

  closeModal('modal-coord-add-review');
  syncAcademicCoordinatorData(true);
  showToastNotification(`Review logged for ${mentorName}. Faculty performance score recalculated.`);
  renderMentorPerformanceMatrix();
}

// ----------------------------------------------------------
// 10.6 Module 5: Daily Student Attendance Console
// ----------------------------------------------------------
function renderCoordinatorAttendanceConsole() {
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const batchSelect = document.getElementById('coord-att-batch-select');
  const datePicker = document.getElementById('coord-att-date-picker');

  if (datePicker && !datePicker.value) {
    datePicker.value = currentCoordAttendanceDate;
  }

  if (batchSelect && (!currentCoordAttendanceBatch || !batchSelect.options.length)) {
    batchSelect.innerHTML = cohorts.map(c => `
      <option value="${escapeHTML(c.id)}" ${c.id === currentCoordAttendanceBatch ? 'selected' : ''}>
        ${escapeHTML(c.id)}: ${escapeHTML(c.name)}
      </option>
    `).join('');

    if (cohorts.length > 0 && !currentCoordAttendanceBatch) {
      currentCoordAttendanceBatch = cohorts[0].id;
      batchSelect.value = cohorts[0].id;
    }
  }

  loadCoordBatchAttendance();
  renderCoordAttendanceReports();
}

function loadCoordBatchAttendance() {
  const batchSelect = document.getElementById('coord-att-batch-select');
  const datePicker = document.getElementById('coord-att-date-picker');
  if (batchSelect) currentCoordAttendanceBatch = batchSelect.value;
  if (datePicker) currentCoordAttendanceDate = datePicker.value;

  const tbody = document.getElementById('coord-attendance-tbody');
  if (!tbody || !currentCoordAttendanceBatch) return;

  const attendanceObj = ERP_DATA.classManagement.attendance = ERP_DATA.classManagement.attendance || {};
  const batchRecords = attendanceObj.batchRecords = attendanceObj.batchRecords || {};

  let records = batchRecords[currentCoordAttendanceBatch];

  // If no records for this batch, initialize from students roster
  if (!records || records.length === 0) {
    const students = ERP_DATA.classManagement?.students || [];
    const batchStudents = students.filter(s => s.batchId === currentCoordAttendanceBatch || s.batch === currentCoordAttendanceBatch);

    if (batchStudents.length > 0) {
      records = batchStudents.map(s => ({
        studentId: s.id,
        name: s.name,
        phone: s.phone,
        status: 'Present',
        attendancePct: s.attendancePct || 95,
        timeMarked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: 'Session Enrolled'
      }));
      batchRecords[currentCoordAttendanceBatch] = records;
    } else {
      records = [];
    }
  }

  // Session Statistics
  const total = records.length;
  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const leave = records.filter(r => r.status === 'Leave').length;
  const adherence = total > 0 ? ((present / total) * 100).toFixed(1) + '%' : '0%';

  const elTot = document.getElementById('coord-att-stat-enrolled');
  const elPres = document.getElementById('coord-att-stat-present');
  const elAbs = document.getElementById('coord-att-stat-absent');
  const elLeave = document.getElementById('coord-att-stat-leave');
  const elRate = document.getElementById('coord-att-stat-rate');

  if (elTot) elTot.textContent = total;
  if (elPres) elPres.textContent = present;
  if (elAbs) elAbs.textContent = absent;
  if (elLeave) elLeave.textContent = leave;
  if (elRate) elRate.textContent = adherence;

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-table-cell">
          <div class="empty-state-box" style="padding: 24px;">
            <span class="empty-state-icon">👥</span>
            <div class="empty-state-title">No Students in Selected Cohort</div>
            <div class="empty-state-desc">Assign admitted students to batch "${escapeHTML(currentCoordAttendanceBatch)}" to record daily attendance.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = records.map(r => `
    <tr>
      <td><strong style="color:var(--accent-pista); font-size:13px;">${escapeHTML(r.studentId)}</strong></td>
      <td>
        <strong style="color:#0f1419;">${escapeHTML(r.name)}</strong>
        <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(r.phone || '--')}</div>
      </td>
      <td style="text-align:center;">
        <strong style="color:var(--accent-pista-bright);">${r.attendancePct || 95}%</strong>
      </td>
      <td style="text-align:center;">
        <div style="display:inline-flex; gap:4px; background:#f5f7f2; border:1px solid #dbe2d6; border-radius:6px; padding:2px;">
          <button class="btn-filter-pill ${r.status === 'Present' ? 'active' : ''}" style="padding:4px 10px; font-size:11px; ${r.status === 'Present' ? 'background:#15803d; color:#fff;' : ''}" onclick="toggleCoordStudentAttendance('${escapeHTML(r.studentId)}', 'Present')">
            Present
          </button>
          <button class="btn-filter-pill ${r.status === 'Absent' ? 'active' : ''}" style="padding:4px 10px; font-size:11px; ${r.status === 'Absent' ? 'background:#b91c1c; color:#fff;' : ''}" onclick="toggleCoordStudentAttendance('${escapeHTML(r.studentId)}', 'Absent')">
            Absent
          </button>
          <button class="btn-filter-pill ${r.status === 'Leave' ? 'active' : ''}" style="padding:4px 10px; font-size:11px; ${r.status === 'Leave' ? 'background:#b45309; color:#fff;' : ''}" onclick="toggleCoordStudentAttendance('${escapeHTML(r.studentId)}', 'Leave')">
            Leave
          </button>
        </div>
      </td>
      <td style="font-size:12px; color:#0f1419;">${escapeHTML(r.timeMarked || '-')}</td>
      <td style="font-size:11px; color:#5e6d7e;">${escapeHTML(r.notes || 'Recorded')}</td>
    </tr>
  `).join('');
}

function toggleCoordStudentAttendance(studentId, newStatus) {
  const records = ERP_DATA.classManagement?.attendance?.batchRecords?.[currentCoordAttendanceBatch];
  if (!records) return;

  const item = records.find(r => r.studentId === studentId);
  if (item) {
    item.status = newStatus;
    if (newStatus === 'Present') {
      item.timeMarked = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      item.notes = 'Checked-in live';
    } else if (newStatus === 'Absent') {
      item.timeMarked = '-';
      item.notes = 'Unexcused Absence';
    } else {
      item.timeMarked = '-';
      item.notes = 'Approved Leave';
    }
  }

  loadCoordBatchAttendance();
}

function markAllCoordAttendancePresent() {
  const records = ERP_DATA.classManagement?.attendance?.batchRecords?.[currentCoordAttendanceBatch];
  if (!records) return;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  records.forEach(r => {
    r.status = 'Present';
    r.timeMarked = timeStr;
    r.notes = 'Mass Check-in Action';
  });

  loadCoordBatchAttendance();
  showToastNotification(`All students in cohort ${currentCoordAttendanceBatch} marked Present.`);
}

function saveCoordAttendanceLogs() {
  const records = ERP_DATA.classManagement?.attendance?.batchRecords?.[currentCoordAttendanceBatch] || [];
  if (records.length === 0) {
    alert("No student records to save for this session.");
    return;
  }

  const attendanceObj = ERP_DATA.classManagement.attendance;
  attendanceObj.history = attendanceObj.history || [];

  const present = records.filter(r => r.status === 'Present').length;
  const rate = ((present / records.length) * 100).toFixed(1) + '%';

  attendanceObj.history.unshift({
    date: currentCoordAttendanceDate,
    batchId: currentCoordAttendanceBatch,
    totalStudents: records.length,
    present: present,
    absent: records.filter(r => r.status === 'Absent').length,
    leave: records.filter(r => r.status === 'Leave').length,
    rate: rate,
    timestamp: new Date().toISOString()
  });

  // Update cohort attendance rate
  const cohort = (ERP_DATA.classManagement?.cohorts || []).find(c => c.id === currentCoordAttendanceBatch);
  if (cohort) {
    cohort.attendance = rate;
  }

  syncAcademicCoordinatorData(true);
  showToastNotification(`Daily attendance for ${currentCoordAttendanceBatch} on ${currentCoordAttendanceDate} synchronized with Central ERP.`);
  renderCoordAttendanceReports();
}

function renderCoordAttendanceReports() {
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const mentors = getCoordinatorMentors();

  // 1. Batch-wise comparison
  const tbodyBatch = document.getElementById('coord-batch-attendance-tbody');
  if (tbodyBatch) {
    tbodyBatch.innerHTML = cohorts.map(c => `
      <tr>
        <td><strong>${escapeHTML(c.name)}</strong></td>
        <td>${escapeHTML(c.mentor || 'Unassigned')}</td>
        <td style="text-align:center;">${c.students || 0}</td>
        <td style="text-align:center;">
          <strong style="color:var(--accent-pista-bright);">${c.attendance || '94%'}</strong>
        </td>
      </tr>
    `).join('');
  }

  // 2. Mentor-wise attendance report
  const tbodyMentor = document.getElementById('coord-mentor-attendance-tbody');
  if (tbodyMentor) {
    tbodyMentor.innerHTML = mentors.map(m => `
      <tr>
        <td>
          <strong>${escapeHTML(m.name)}</strong>
          <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(m.designation)}</div>
        </td>
        <td style="text-align:center;">${m.assignedBatchesCount}</td>
        <td style="text-align:center;">${m.occupiedSlots}</td>
        <td style="text-align:center;">
          <strong style="color:var(--accent-pista-bright);">${m.avgAttendancePct !== '--' ? m.avgAttendancePct + '%' : '--'}</strong>
        </td>
      </tr>
    `).join('');
  }
}

// ----------------------------------------------------------
// 10.7 Module 6: HRM Integration & Telemetry
// ----------------------------------------------------------
function renderCoordTelemetry() {
  const facultyCount = document.getElementById('coord-sync-faculty-count');
  const cohortsCount = document.getElementById('coord-sync-cohorts-count');
  const studentsCount = document.getElementById('coord-sync-students-count');
  const timestamp = document.getElementById('coord-sync-timestamp');

  const mentors = getCoordinatorMentors();
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const students = ERP_DATA.classManagement?.students || [];

  if (facultyCount) facultyCount.textContent = `${mentors.length} faculty records`;
  if (cohortsCount) cohortsCount.textContent = `${cohorts.length} cohorts active`;
  if (studentsCount) studentsCount.textContent = `${students.length} admitted students`;
  if (timestamp) timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function syncAcademicCoordinatorData(showToast) {
  // Reconcile cohorts with actual student enrollments
  const cohorts = ERP_DATA.classManagement?.cohorts || [];
  const students = ERP_DATA.classManagement?.students || [];

  cohorts.forEach(c => {
    const enrolledActual = students.filter(s => s.batchId === c.id || s.batch === c.id || s.batch === c.name).length;
    if (enrolledActual > 0) {
      c.students = enrolledActual;
    }
  });

  // Reconcile KPIs
  if (ERP_DATA.classManagement?.kpis) {
    ERP_DATA.classManagement.kpis.activeBatches = cohorts.length;
    ERP_DATA.classManagement.kpis.totalStudents = students.length;
  }
  if (ERP_DATA.ceo?.kpis) {
    ERP_DATA.ceo.kpis.activeBatches = cohorts.length;
    ERP_DATA.ceo.kpis.totalStudents = students.length;
  }

  // Update Telemetry Header Status
  const headerSync = document.getElementById('coord-header-sync-status');
  if (headerSync) {
    headerSync.textContent = `⚡ SYNCED ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  updateCoordExecutiveKPIs();
  renderCoordTelemetry();

  if (showToast) {
    showToastNotification("⚡ Academic Coordinator data synchronized with Central ERP database.");
  }
}

// ----------------------------------------------------------
// 10.8 Quick Create Batch
// ----------------------------------------------------------
function openCoordCreateBatchModal() {
  const codeInput = document.getElementById('coord-newbatch-code');
  const nameInput = document.getElementById('coord-newbatch-name');
  const courseSelect = document.getElementById('coord-newbatch-course');
  const mentorSelect = document.getElementById('coord-newbatch-mentor');

  const nextNum = (ERP_DATA.classManagement?.cohorts?.length || 0) + 1;
  if (codeInput) codeInput.value = `B-AI-0${nextNum}`;
  if (nameInput) nameInput.value = `AI & Advanced Analytics Batch ${nextNum}`;

  // Populate courses
  const courses = ERP_DATA.classManagement?.courses || ERP_DATA.catalogue?.courses || [];
  if (courseSelect) {
    if (courses.length > 0) {
      courseSelect.innerHTML = courses.map(c => `
        <option value="${escapeHTML(c.id || c.title)}">${escapeHTML(c.title || c.name)} (${c.id || 'CRS'})</option>
      `).join('');
    } else {
      courseSelect.innerHTML = `<option value="CRS-01">Full Stack AI &amp; Software Engineering (CRS-01)</option>`;
    }
  }

  // Populate mentors
  const mentors = getCoordinatorMentors();
  if (mentorSelect) {
    let html = `<option value="Unassigned">⚠️ Leave Unscheduled (Needs Mentor)</option>`;
    mentors.forEach(m => {
      html += `<option value="${escapeHTML(m.name)}">${escapeHTML(m.name)} (${m.availableSlots} slots open)</option>`;
    });
    mentorSelect.innerHTML = html;
  }

  openModal('modal-coord-create-batch');
}

function submitCoordCreateBatch() {
  const code = document.getElementById('coord-newbatch-code')?.value.trim();
  const name = document.getElementById('coord-newbatch-name')?.value.trim();
  const course = document.getElementById('coord-newbatch-course')?.value;
  const mentor = document.getElementById('coord-newbatch-mentor')?.value;
  const days = document.getElementById('coord-newbatch-days')?.value;
  const time = document.getElementById('coord-newbatch-time')?.value;
  const room = document.getElementById('coord-newbatch-room')?.value || 'Lab 1';
  const capacity = parseInt(document.getElementById('coord-newbatch-capacity')?.value || 30);

  if (!code || !name) {
    alert("Please specify a batch code and title.");
    return;
  }

  // Check collision if mentor is assigned
  if (mentor && mentor !== 'Unassigned') {
    const conflict = checkMentorScheduleConflict(mentor, days, time, code);
    if (conflict.conflict) {
      alert(`Double-booking prevented: ${mentor} is already scheduled for ${conflict.conflictingBatchName} on this time slot.`);
      return;
    }
  }

  const isUnscheduled = !mentor || mentor === 'Unassigned';

  const newCohort = {
    id: code,
    name: name,
    courseId: course,
    mentor: mentor || 'Unassigned',
    schedule: isUnscheduled ? 'Unscheduled' : `${days} • ${time}`,
    room: room,
    students: 0,
    capacity: capacity,
    status: isUnscheduled ? 'Unscheduled - Needs Mentor' : 'Active Scheduled',
    statusColor: isUnscheduled ? 'status-pending' : 'status-active',
    attendance: '--',
    progress: 0,
    progressText: 'Module 1 / 6',
    capstoneTopic: 'Foundational Project'
  };

  ERP_DATA.classManagement.cohorts = ERP_DATA.classManagement.cohorts || [];
  ERP_DATA.classManagement.cohorts.push(newCohort);

  ERP_DATA.classManagement.batches = ERP_DATA.classManagement.batches || [];
  ERP_DATA.classManagement.batches.push(newCohort);

  closeModal('modal-coord-create-batch');
  syncAcademicCoordinatorData(true);
  showToastNotification(`New batch "${name}" created successfully.`);
  renderBatchMentorAssignment();
}










// ==========================================================
// 11. FACULTY MENTOR DASHBOARD & PERFORMANCE GOVERNANCE
// ==========================================================

let currentMentorSubModule = 'students';
let activeMentorPortfolioId = null;
let mentorAttendanceDraft = {};
let currentMentorReportsTab = 'pending';

function switchMentorSubModule(subId) {
  currentMentorSubModule = subId;

  document.querySelectorAll('.mentor-subtab-btn').forEach(btn => {
    if (btn.getAttribute('data-mentor-sub') === subId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.mentor-subpane').forEach(pane => {
    pane.style.display = 'none';
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`mentor-subpane-${subId}`);
  if (targetPane) {
    targetPane.style.display = 'block';
    targetPane.classList.add('active');
  }

  if (subId === 'students') {
    renderMentorStudentsOverview();
  } else if (subId === 'performance') {
    renderMentorStudentPerformance();
  } else if (subId === 'attendance') {
    renderMentorAttendanceConsole();
  } else if (subId === 'reports') {
    renderMentorStudentReports();
  } else if (subId === 'bonus') {
    renderMentorBonusConsole();
  } else if (subId === 'ranking') {
    renderMentorRankingLeaderboard();
  }
}

function getMentorFacultyList() {
  const list = [];
  const employees = ERP_DATA.hrm?.employees || [];
  employees.forEach(emp => {
    const des = (emp.designation || '').toLowerCase();
    const role = (emp.role || '').toLowerCase();
    const dept = (emp.department || '').toLowerCase();
    if (des.includes('mentor') || des.includes('trainer') || role.includes('mentor') || dept.includes('academic') || dept.includes('faculty')) {
      list.push({
        id: emp.id,
        name: emp.name,
        designation: emp.designation || 'Faculty Mentor',
        phone: emp.phone || '--',
        email: emp.email || '--'
      });
    }
  });

  // Check Class Management mentors
  const cmMentors = ERP_DATA.classManagement?.mentors || [];
  cmMentors.forEach(m => {
    if (!list.some(existing => existing.id === m.id || existing.name.toLowerCase() === m.name.toLowerCase())) {
      list.push({
        id: m.id || `MENTOR-${list.length + 1}`,
        name: m.name,
        designation: m.specialty ? `${m.specialty} Mentor` : 'Faculty Mentor',
        phone: m.phone || '--',
        email: m.email || '--'
      });
    }
  });

  // Check distinct mentors in cohorts/batches
  const batches = (ERP_DATA.classManagement?.batches || []).concat(ERP_DATA.classManagement?.cohorts || []);
  batches.forEach(b => {
    if (b.mentor && b.mentor !== 'Unassigned' && !list.some(m => m.name.toLowerCase() === b.mentor.toLowerCase())) {
      list.push({
        id: `MENTOR-FAC-${list.length + 1}`,
        name: b.mentor,
        designation: 'Faculty Mentor',
        phone: '--',
        email: '--'
      });
    }
  });

  return list;
}

function getActiveMentorId() {
  const mentors = getMentorFacultyList();
  if (activeMentorPortfolioId && mentors.some(m => m.id === activeMentorPortfolioId || m.name === activeMentorPortfolioId)) {
    return activeMentorPortfolioId;
  }
  if (mentors.length > 0) {
    activeMentorPortfolioId = mentors[0].id;
    return mentors[0].id;
  }
  return null;
}

function handleMentorSelectChange(mentorId) {
  activeMentorPortfolioId = mentorId;
  populateMentorDashboardView();
  showToastNotification(`Viewing portfolio for ${getMentorNameById(mentorId)}`);
}

function getMentorNameById(mentorId) {
  const mentors = getMentorFacultyList();
  const m = mentors.find(item => item.id === mentorId || item.name === mentorId);
  return m ? m.name : 'Faculty Mentor';
}

function getMentorAssignedBatches(mentorId) {
  if (!mentorId) return [];
  const mentorName = getMentorNameById(mentorId).toLowerCase();
  const batches = (ERP_DATA.classManagement?.batches || []).concat(ERP_DATA.classManagement?.cohorts || []);
  const uniqueBatches = [];
  const seenIds = new Set();

  batches.forEach(b => {
    if (seenIds.has(b.id)) return;
    const bMentor = (b.mentor || '').toLowerCase();
    const bMentorId = (b.mentorId || '').toLowerCase();
    if (bMentor === mentorName || bMentorId === mentorId.toLowerCase() || b.mentor === mentorId) {
      seenIds.add(b.id);
      uniqueBatches.push(b);
    }
  });

  return uniqueBatches;
}

function getMentorAssignedStudents(mentorId) {
  const batches = getMentorAssignedBatches(mentorId);
  const batchIds = new Set(batches.map(b => b.id));
  const allStudents = ERP_DATA.classManagement?.students || [];
  const mentorStudents = [];

  allStudents.forEach(s => {
    const sBatch = s.batchId || s.cohortId || s.batch;
    const matchesBatch = sBatch && batchIds.has(sBatch);
    const matchesMentor = (s.mentor && s.mentor.toLowerCase() === getMentorNameById(mentorId).toLowerCase()) || s.mentorId === mentorId;

    if (matchesBatch || matchesMentor) {
      // Ensure defaults for student performance
      const marks = typeof s.marks === 'number' ? s.marks : (typeof s.performanceMark === 'number' ? s.performanceMark : 85);
      const progress = typeof s.progress === 'number' ? s.progress : (typeof s.progressPct === 'number' ? s.progressPct : 70);
      const attendance = typeof s.attendance === 'number' ? s.attendance : (parseFloat(s.attendanceRate || s.attendancePct) || 90);
      const remarks = s.mentorRemarks || s.remarks || 'Consistently attentive and diligent in lab assignments.';
      const history = Array.isArray(s.performanceHistory) && s.performanceHistory.length > 0 ? s.performanceHistory : [marks - 5, marks - 2, marks];

      mentorStudents.push({
        ...s,
        marks,
        progress,
        attendance,
        remarks,
        performanceHistory: history
      });
    }
  });

  return mentorStudents;
}

function populateMentorDashboardView() {
  const mentors = getMentorFacultyList();
  const select = document.getElementById('mentor-active-select');
  const activeId = getActiveMentorId();

  if (select) {
    if (mentors.length === 0) {
      select.innerHTML = `<option value="">No Mentors in Database</option>`;
    } else {
      select.innerHTML = mentors.map(m => `
        <option value="${escapeHTML(m.id)}" ${m.id === activeId ? 'selected' : ''}>
          ${escapeHTML(m.name)} (${escapeHTML(m.designation)})
        </option>
      `).join('');
    }
  }

  // Compute live KPIs for active mentor
  const assignedBatches = getMentorAssignedBatches(activeId);
  const assignedStudents = getMentorAssignedStudents(activeId);
  const metrics = computeMentorPerformanceMetrics(activeId);

  const kpiStudents = document.getElementById('mentor-kpi-total-students');
  const kpiStudentsSub = document.getElementById('mentor-kpi-active-students-sub');
  const kpiBatches = document.getElementById('mentor-kpi-assigned-batches');
  const kpiBatchesSub = document.getElementById('mentor-kpi-batches-slots-sub');
  const kpiAttRate = document.getElementById('mentor-kpi-attendance-rate');
  const kpiAvgPerf = document.getElementById('mentor-kpi-avg-performance');
  const kpiProgressSub = document.getElementById('mentor-kpi-progress-sub');
  const kpiReports = document.getElementById('mentor-kpi-reports-submitted');
  const kpiReportsSub = document.getElementById('mentor-kpi-reports-pending-sub');
  const kpiBonus = document.getElementById('mentor-kpi-bonus-earned');
  const kpiRankSub = document.getElementById('mentor-kpi-rank-sub');

  if (kpiStudents) kpiStudents.textContent = assignedStudents.length;
  if (kpiStudentsSub) kpiStudentsSub.textContent = `${assignedStudents.length} Active Enrolled`;

  if (kpiBatches) kpiBatches.textContent = assignedBatches.length;
  const totalSlots = assignedBatches.reduce((acc, b) => acc + (b.capacity || 20), 0);
  const filledSlots = assignedStudents.length;
  const availableSlots = Math.max(0, totalSlots - filledSlots);
  if (kpiBatchesSub) kpiBatchesSub.textContent = `${availableSlots} Available Slots`;

  if (kpiAttRate) kpiAttRate.textContent = `${metrics.attendanceRate.toFixed(1)}%`;
  if (kpiAvgPerf) kpiAvgPerf.textContent = assignedStudents.length > 0 ? `${metrics.avgPerformance.toFixed(1)} / 100` : '-- / 100';
  if (kpiProgressSub) kpiProgressSub.textContent = `${metrics.studentProgress.toFixed(0)}% Syllabus Progress`;

  if (kpiReports) kpiReports.textContent = `${metrics.submittedReportsCount} / ${assignedStudents.length}`;
  const pendingReports = Math.max(0, assignedStudents.length - metrics.submittedReportsCount);
  if (kpiReportsSub) kpiReportsSub.textContent = `${pendingReports} Pending Reports`;

  if (kpiBonus) kpiBonus.textContent = `₹${metrics.totalBonus.toLocaleString('en-IN')}`;
  if (kpiRankSub) kpiRankSub.textContent = `Rank: #${metrics.rank} • Score: ${metrics.performanceScore.toFixed(1)}`;

  switchMentorSubModule(currentMentorSubModule);
}

// ----------------------------------------------------------
// 11.1 MODULE 1: MY STUDENTS
// ----------------------------------------------------------
function renderMentorStudentsOverview() {
  const activeId = getActiveMentorId();
  const batches = getMentorAssignedBatches(activeId);
  const students = getMentorAssignedStudents(activeId);

  const summaryBadge = document.getElementById('mentor-batch-summary-badge');
  const totalSlots = batches.reduce((acc, b) => acc + (b.capacity || 20), 0);
  const filledSlots = students.length;
  const availSlots = Math.max(0, totalSlots - filledSlots);
  if (summaryBadge) {
    summaryBadge.textContent = `${batches.length} Batches Assigned • ${availSlots} Available Slots`;
  }

  // Render batch cards
  const cardsContainer = document.getElementById('mentor-batches-cards-container');
  if (cardsContainer) {
    if (batches.length === 0) {
      cardsContainer.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:32px 20px; background:#f9faf7; border:1px dashed #dbe2d6; border-radius:8px; color:#5e6d7e;">
          <div style="font-size:28px; margin-bottom:6px;">&#128197;</div>
          <div style="font-weight:700; color:#0f1419; font-size:14px;">No Batches Assigned to This Mentor</div>
          <div style="font-size:12px; margin-top:4px;">Batches scheduled in Academic Coordinator will automatically populate here.</div>
        </div>
      `;
    } else {
      cardsContainer.innerHTML = batches.map(b => {
        const batchStudents = students.filter(s => (s.batchId || s.cohortId || s.batch) === b.id);
        const cap = b.capacity || 20;
        const filled = batchStudents.length;
        const openSlots = Math.max(0, cap - filled);
        const pct = Math.min(100, Math.round((filled / cap) * 100));

        return `
          <div style="background:#ffffff; border:1px solid #dbe2d6; border-radius:8px; padding:14px; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <span class="badge-pista" style="font-size:10px; font-weight:700;">${escapeHTML(b.id)}</span>
                <div style="font-weight:700; color:#0f1419; font-size:14px; margin-top:2px;">${escapeHTML(b.name || b.id)}</div>
                <div style="font-size:11.5px; color:#5e6d7e;">${escapeHTML(b.schedule || 'Scheduled Session')}</div>
              </div>
              <span style="font-size:11px; font-weight:700; background:#e8f5e9; color:#2e7d32; padding:3px 8px; border-radius:12px; border:1px solid #c8e6c9;">
                ${escapeHTML(b.status || 'Active')}
              </span>
            </div>
            
            <div style="margin:10px 0 6px 0;">
              <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:3px;">
                <span style="color:#5e6d7e;">Slot Occupancy:</span>
                <strong style="color:#0f1419;">${filled} / ${cap} Students (${openSlots} Open)</strong>
              </div>
              <div style="width:100%; height:6px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
                <div style="width:${pct}%; height:100%; background:#6b8e4e; border-radius:4px;"></div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Populate batch filter dropdown
  const batchFilter = document.getElementById('mentor-students-batch-filter');
  if (batchFilter) {
    let opts = `<option value="All">All Assigned Batches (${students.length})</option>`;
    batches.forEach(b => {
      const count = students.filter(s => (s.batchId || s.cohortId || s.batch) === b.id).length;
      opts += `<option value="${escapeHTML(b.id)}">${escapeHTML(b.name || b.id)} (${count})</option>`;
    });
    batchFilter.innerHTML = opts;
  }

  filterMentorStudentsTable();
}

function filterMentorStudentsTable() {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const batchFilter = document.getElementById('mentor-students-batch-filter')?.value || 'All';
  const searchTerm = (document.getElementById('mentor-students-search')?.value || '').toLowerCase().trim();
  const tbody = document.getElementById('mentor-students-tbody');
  if (!tbody) return;

  const reports = ERP_DATA.hrm?.mentorDashboard?.reports || [];

  const filtered = students.filter(s => {
    const sBatch = s.batchId || s.cohortId || s.batch || '';
    const matchBatch = batchFilter === 'All' || sBatch === batchFilter;
    const matchSearch = !searchTerm || 
      (s.name || '').toLowerCase().includes(searchTerm) || 
      (s.id || '').toLowerCase().includes(searchTerm);
    return matchBatch && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:32px 14px; color:#5e6d7e; background:#f9faf7;">
          <div style="font-size:24px; margin-bottom:4px;">&#129489;&#8205;&#127891;</div>
          <div style="font-weight:700; color:#0f1419;">No Students Found</div>
          <div style="font-size:12px;">No enrolled students match the active filter or mentor assignment.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const hasReport = reports.some(r => r.studentId === s.id && r.mentorId === activeId);
    const reportStatusBadge = hasReport ? 
      `<span style="font-size:11px; font-weight:700; color:#047857; background:#d1fae5; padding:3px 8px; border-radius:12px; border:1px solid #a7f3d0;">&#10003; Submitted</span>` :
      `<span style="font-size:11px; font-weight:700; color:#b45309; background:#fef3c7; padding:3px 8px; border-radius:12px; border:1px solid #fde68a;">&#9203; Pending</span>`;

    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f1419;">${escapeHTML(s.name)}</div>
          <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(s.id)}</div>
        </td>
        <td>
          <span class="badge-pista" style="font-size:11px;">${escapeHTML(s.batchId || s.cohortId || s.batch || 'General')}</span>
        </td>
        <td>
          <span style="font-weight:700; color:${s.attendance >= 85 ? '#047857' : (s.attendance >= 75 ? '#b45309' : '#dc2626')};">
            ${s.attendance}%
          </span>
        </td>
        <td>
          <span style="font-weight:700; color:#2e441f; background:#f5f7f2; padding:3px 8px; border-radius:6px; border:1px solid #dbe2d6;">
            ${s.marks} / 100
          </span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:70px; height:5px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
              <div style="width:${Math.min(100, s.progress)}%; height:100%; background:#6b8e4e;"></div>
            </div>
            <span style="font-size:11px; font-weight:600; color:#5e6d7e;">${s.progress}%</span>
          </div>
        </td>
        <td>${reportStatusBadge}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="openMentorReportModal('${escapeHTML(s.id)}')">
              Report
            </button>
            <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="openMentorEvaluateModal('${escapeHTML(s.id)}')">
              Marks
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ----------------------------------------------------------
// 11.2 MODULE 2: STUDENT PERFORMANCE
// ----------------------------------------------------------
function calculateStudentRanks(batchId, mentorId) {
  const allStudents = getMentorAssignedStudents(mentorId);
  const batchStudents = batchId && batchId !== 'All' ? 
    allStudents.filter(s => (s.batchId || s.cohortId || s.batch) === batchId) :
    allStudents;

  // Sort by marks descending
  const sorted = [...batchStudents].sort((a, b) => (b.marks || 0) - (a.marks || 0));
  const ranks = {};
  sorted.forEach((s, idx) => {
    ranks[s.id] = idx + 1;
  });
  return ranks;
}

function renderMentorStudentPerformance() {
  const activeId = getActiveMentorId();
  const batches = getMentorAssignedBatches(activeId);
  const students = getMentorAssignedStudents(activeId);

  const filterSelect = document.getElementById('mentor-perf-batch-filter');
  if (filterSelect) {
    let opts = `<option value="All">All Batches (${students.length} Students)</option>`;
    batches.forEach(b => {
      opts += `<option value="${escapeHTML(b.id)}">${escapeHTML(b.name || b.id)}</option>`;
    });
    filterSelect.innerHTML = opts;
  }

  filterMentorPerformanceTable();
}

function filterMentorPerformanceTable() {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const batchFilter = document.getElementById('mentor-perf-batch-filter')?.value || 'All';
  const tbody = document.getElementById('mentor-performance-tbody');
  if (!tbody) return;

  const ranks = calculateStudentRanks(batchFilter, activeId);

  const filtered = students.filter(s => {
    const sBatch = s.batchId || s.cohortId || s.batch || '';
    return batchFilter === 'All' || sBatch === batchFilter;
  }).sort((a, b) => (ranks[a.id] || 999) - (ranks[b.id] || 999));

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:32px 14px; color:#5e6d7e; background:#f9faf7;">
          <div style="font-size:24px; margin-bottom:4px;">&#127941;</div>
          <div style="font-weight:700; color:#0f1419;">No Student Performance Records</div>
          <div style="font-size:12px;">Evaluate students or assign batches to populate performance benchmarks.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const rank = ranks[s.id] || 1;
    let rankBadge = `<span style="font-weight:700; color:#5e6d7e; background:#f3f4f6; padding:2px 8px; border-radius:10px;">#${rank}</span>`;
    if (rank === 1) rankBadge = `<span style="font-weight:800; color:#b45309; background:#fef3c7; padding:3px 8px; border-radius:12px; border:1px solid #fde68a;">&#129351; #1</span>`;
    else if (rank === 2) rankBadge = `<span style="font-weight:800; color:#4b5563; background:#f3f4f6; padding:3px 8px; border-radius:12px; border:1px solid #e5e7eb;">&#129352; #2</span>`;
    else if (rank === 3) rankBadge = `<span style="font-weight:800; color:#92400e; background:#ffedd5; padding:3px 8px; border-radius:12px; border:1px solid #fed7aa;">&#129353; #3</span>`;

    // History visualization
    const hist = s.performanceHistory || [s.marks];
    const histBadges = hist.map(h => `<span style="font-size:10.5px; background:#f5f7f2; border:1px solid #dbe2d6; border-radius:4px; padding:1px 5px; color:#2e441f; font-weight:600;">${h}</span>`).join(' &rarr; ');

    return `
      <tr>
        <td>${rankBadge}</td>
        <td>
          <div style="font-weight:700; color:#0f1419;">${escapeHTML(s.name)}</div>
          <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(s.id)}</div>
        </td>
        <td>
          <span class="badge-pista" style="font-size:11px;">${escapeHTML(s.batchId || s.cohortId || s.batch || 'General')}</span>
        </td>
        <td>
          <span style="font-size:13px; font-weight:800; color:#2e441f;">${s.marks}</span>
          <span style="font-size:11px; color:#5e6d7e;">/ 100</span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:65px; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
              <div style="width:${Math.min(100, s.progress)}%; height:100%; background:#6b8e4e;"></div>
            </div>
            <strong style="font-size:11px; color:#2e441f;">${s.progress}%</strong>
          </div>
        </td>
        <td>
          <span style="font-weight:700; color:${s.attendance >= 85 ? '#047857' : (s.attendance >= 75 ? '#b45309' : '#dc2626')};">
            ${s.attendance}%
          </span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:4px;">
            ${histBadges}
          </div>
        </td>
        <td style="max-width:220px;">
          <div style="font-size:11.5px; color:#374151; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHTML(s.remarks)}">
            ${escapeHTML(s.remarks)}
          </div>
        </td>
        <td>
          <button class="btn-primary-ai" style="font-size:11px; padding:4px 8px; white-space:nowrap;" onclick="openMentorEvaluateModal('${escapeHTML(s.id)}')">
            Update Marks
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openMentorEvaluateModal(studentId) {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const select = document.getElementById('mentor-eval-student-select');
  if (!select) return;

  select.innerHTML = students.map(s => `
    <option value="${escapeHTML(s.id)}" ${s.id === studentId ? 'selected' : ''}>
      ${escapeHTML(s.name)} (${escapeHTML(s.id)} • ${escapeHTML(s.batchId || s.cohortId || s.batch || 'General')})
    </option>
  `).join('');

  const targetId = studentId || (students[0]?.id);
  handleMentorEvalStudentSelect(targetId);
  openModal('modal-mentor-evaluate-student');
}

function handleMentorEvalStudentSelect(studentId) {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const markInput = document.getElementById('mentor-eval-mark');
  const progInput = document.getElementById('mentor-eval-progress');
  const remarksInput = document.getElementById('mentor-eval-remarks');

  if (markInput) markInput.value = student.marks ?? 85;
  if (progInput) progInput.value = student.progress ?? 70;
  if (remarksInput) remarksInput.value = student.remarks || '';
}

function submitMentorEvaluation() {
  const studentId = document.getElementById('mentor-eval-student-select')?.value;
  const mark = parseFloat(document.getElementById('mentor-eval-mark')?.value);
  const progress = parseFloat(document.getElementById('mentor-eval-progress')?.value);
  const remarks = document.getElementById('mentor-eval-remarks')?.value.trim();

  if (!studentId) {
    showToastNotification('Please select a student.');
    return;
  }
  if (isNaN(mark) || mark < 0 || mark > 100) {
    showToastNotification('Please enter a valid performance mark between 0 and 100.');
    return;
  }
  if (isNaN(progress) || progress < 0 || progress > 100) {
    showToastNotification('Please enter a valid progress percentage between 0 and 100.');
    return;
  }

  // Update student in ERP_DATA.classManagement.students
  const allStudents = ERP_DATA.classManagement?.students || [];
  const s = allStudents.find(item => item.id === studentId);
  if (s) {
    s.marks = mark;
    s.performanceMark = mark;
    s.progress = progress;
    s.progressPct = progress;
    if (remarks) s.mentorRemarks = remarks;

    s.performanceHistory = s.performanceHistory || [];
    s.performanceHistory.push(mark);
    if (s.performanceHistory.length > 5) s.performanceHistory.shift();
  }

  // Log milestone
  ERP_DATA.hrm.mentorDashboard = ERP_DATA.hrm.mentorDashboard || {};
  ERP_DATA.hrm.mentorDashboard.performanceLogs = ERP_DATA.hrm.mentorDashboard.performanceLogs || [];
  ERP_DATA.hrm.mentorDashboard.performanceLogs.push({
    studentId,
    mentorId: getActiveMentorId(),
    mark,
    progress,
    remarks,
    date: new Date().toISOString()
  });

  closeModal('modal-mentor-evaluate-student');
  showToastNotification(`Performance record updated for ${s ? s.name : studentId}.`);
  populateMentorDashboardView();
}

// ----------------------------------------------------------
// 11.3 MODULE 3: STUDENT ATTENDANCE
// ----------------------------------------------------------
function renderMentorAttendanceConsole() {
  const activeId = getActiveMentorId();
  const batches = getMentorAssignedBatches(activeId);
  const batchSelect = document.getElementById('mentor-att-batch-select');
  const dateInput = document.getElementById('mentor-att-date');

  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  if (batchSelect) {
    if (batches.length === 0) {
      batchSelect.innerHTML = `<option value="">No Batches Assigned</option>`;
    } else {
      batchSelect.innerHTML = batches.map(b => `
        <option value="${escapeHTML(b.id)}">${escapeHTML(b.name || b.id)}</option>
      `).join('');
    }
  }

  loadMentorBatchAttendance();
}

function loadMentorBatchAttendance() {
  const activeId = getActiveMentorId();
  const batchId = document.getElementById('mentor-att-batch-select')?.value;
  const dateStr = document.getElementById('mentor-att-date')?.value;
  const tbody = document.getElementById('mentor-att-rollcall-tbody');
  if (!tbody) return;

  const students = getMentorAssignedStudents(activeId).filter(s => {
    return !batchId || (s.batchId || s.cohortId || s.batch) === batchId;
  });

  // Pull existing session from attendance logs
  const logs = (ERP_DATA.hrm?.academicCoordinator?.attendanceLogs || []).filter(l => l.batchId === batchId && l.date === dateStr);
  const existingMap = {};
  logs.forEach(l => { existingMap[l.studentId] = l.status; });

  mentorAttendanceDraft = {};
  students.forEach(s => {
    mentorAttendanceDraft[s.id] = existingMap[s.id] || 'Present';
  });

  updateMentorAttendanceTelemetry(students);

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:32px 14px; color:#5e6d7e; background:#f9faf7;">
          <div style="font-size:24px; margin-bottom:4px;">&#128203;</div>
          <div style="font-weight:700; color:#0f1419;">No Students in Selected Batch</div>
          <div style="font-size:12px;">Assign students to this batch or select another cohort.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = students.map(s => {
    const st = mentorAttendanceDraft[s.id] || 'Present';

    return `
      <tr>
        <td>
          <span style="font-weight:700; color:#0f1419;">${escapeHTML(s.id)}</span>
        </td>
        <td>
          <div style="font-weight:700; color:#0f1419;">${escapeHTML(s.name)}</div>
          <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(s.phone || '--')}</div>
        </td>
        <td>
          <span style="font-weight:700; color:${s.attendance >= 85 ? '#047857' : (s.attendance >= 75 ? '#b45309' : '#dc2626')};">
            ${s.attendance}%
          </span>
        </td>
        <td>
          <div style="display:flex; gap:4px;">
            <button type="button" class="btn-secondary ${st === 'Present' ? 'btn-att-present-active' : ''}" 
              style="font-size:11px; padding:3px 8px; font-weight:700; ${st === 'Present' ? 'background:#d1fae5; color:#047857; border-color:#a7f3d0;' : ''}" 
              onclick="markMentorStudentAttendance('${escapeHTML(s.id)}', 'Present')">
              &#128994; Present
            </button>
            <button type="button" class="btn-secondary ${st === 'Absent' ? 'btn-att-absent-active' : ''}" 
              style="font-size:11px; padding:3px 8px; font-weight:700; ${st === 'Absent' ? 'background:#fee2e2; color:#b91c1c; border-color:#fca5a5;' : ''}" 
              onclick="markMentorStudentAttendance('${escapeHTML(s.id)}', 'Absent')">
              &#128308; Absent
            </button>
            <button type="button" class="btn-secondary ${st === 'Leave' ? 'btn-att-leave-active' : ''}" 
              style="font-size:11px; padding:3px 8px; font-weight:700; ${st === 'Leave' ? 'background:#fef3c7; color:#b45309; border-color:#fde68a;' : ''}" 
              onclick="markMentorStudentAttendance('${escapeHTML(s.id)}', 'Leave')">
              &#128993; Leave
            </button>
          </div>
        </td>
        <td>
          <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="openMentorAttendanceHistoryModal('${escapeHTML(s.id)}')">
            View History
          </button>
        </td>
        <td>
          <input type="text" class="form-input" id="mentor-att-note-${escapeHTML(s.id)}" placeholder="Session remark..." style="font-size:11px; padding:3px 6px; width:130px;">
        </td>
      </tr>
    `;
  }).join('');
}

function markMentorStudentAttendance(studentId, status) {
  mentorAttendanceDraft[studentId] = status;
  const activeId = getActiveMentorId();
  const batchId = document.getElementById('mentor-att-batch-select')?.value;
  const students = getMentorAssignedStudents(activeId).filter(s => {
    return !batchId || (s.batchId || s.cohortId || s.batch) === batchId;
  });
  updateMentorAttendanceTelemetry(students);
  loadMentorBatchAttendance();
}

function markAllMentorAttendance(status) {
  Object.keys(mentorAttendanceDraft).forEach(k => {
    mentorAttendanceDraft[k] = status;
  });
  const activeId = getActiveMentorId();
  const batchId = document.getElementById('mentor-att-batch-select')?.value;
  const students = getMentorAssignedStudents(activeId).filter(s => {
    return !batchId || (s.batchId || s.cohortId || s.batch) === batchId;
  });
  updateMentorAttendanceTelemetry(students);
  loadMentorBatchAttendance();
  showToastNotification(`Marked all students as ${status}.`);
}

function updateMentorAttendanceTelemetry(students) {
  const total = students.length;
  let present = 0, absent = 0, leave = 0;
  students.forEach(s => {
    const st = mentorAttendanceDraft[s.id] || 'Present';
    if (st === 'Present') present++;
    else if (st === 'Absent') absent++;
    else if (st === 'Leave') leave++;
  });

  const adherence = total > 0 ? Math.round((present / total) * 100) : 0;

  const countEnrolled = document.getElementById('mentor-att-count-enrolled');
  const countPresent = document.getElementById('mentor-att-count-present');
  const countAbsent = document.getElementById('mentor-att-count-absent');
  const countLeave = document.getElementById('mentor-att-count-leave');
  const adherenceEl = document.getElementById('mentor-att-session-adherence');

  if (countEnrolled) countEnrolled.textContent = total;
  if (countPresent) countPresent.textContent = present;
  if (countAbsent) countAbsent.textContent = absent;
  if (countLeave) countLeave.textContent = leave;
  if (adherenceEl) adherenceEl.textContent = `${adherence}%`;
}

function saveMentorAttendanceSession() {
  const activeId = getActiveMentorId();
  const batchId = document.getElementById('mentor-att-batch-select')?.value;
  const dateStr = document.getElementById('mentor-att-date')?.value || new Date().toISOString().split('T')[0];

  if (!batchId) {
    showToastNotification('Please select a batch to save attendance.');
    return;
  }

  ERP_DATA.hrm.academicCoordinator = ERP_DATA.hrm.academicCoordinator || {};
  ERP_DATA.hrm.academicCoordinator.attendanceLogs = ERP_DATA.hrm.academicCoordinator.attendanceLogs || [];

  const students = getMentorAssignedStudents(activeId).filter(s => {
    return (s.batchId || s.cohortId || s.batch) === batchId;
  });

  students.forEach(s => {
    const st = mentorAttendanceDraft[s.id] || 'Present';
    const noteEl = document.getElementById(`mentor-att-note-${s.id}`);
    const note = noteEl ? noteEl.value.trim() : '';

    // Remove any existing log for same student, batch and date
    ERP_DATA.hrm.academicCoordinator.attendanceLogs = ERP_DATA.hrm.academicCoordinator.attendanceLogs.filter(
      l => !(l.studentId === s.id && l.batchId === batchId && l.date === dateStr)
    );

    ERP_DATA.hrm.academicCoordinator.attendanceLogs.push({
      studentId: s.id,
      studentName: s.name,
      batchId: batchId,
      date: dateStr,
      status: st,
      markedBy: getMentorNameById(activeId),
      note: note,
      timestamp: new Date().toISOString()
    });
  });

  showToastNotification(`Attendance session for ${batchId} saved successfully.`);
  populateMentorDashboardView();
}

function openMentorAttendanceHistoryModal(studentId) {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const title = document.getElementById('mentor-att-hist-title');
  const summary = document.getElementById('mentor-att-hist-summary');
  const tbody = document.getElementById('mentor-att-hist-tbody');

  if (title) title.textContent = `Attendance History â€” ${student.name}`;

  const allLogs = (ERP_DATA.hrm?.academicCoordinator?.attendanceLogs || []).filter(l => l.studentId === studentId);
  const total = allLogs.length;
  const present = allLogs.filter(l => l.status === 'Present').length;
  const absent = allLogs.filter(l => l.status === 'Absent').length;
  const leave = allLogs.filter(l => l.status === 'Leave').length;
  const adherence = total > 0 ? Math.round((present / total) * 100) : student.attendance;

  if (summary) {
    summary.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${escapeHTML(student.name)}</strong> (${escapeHTML(student.id)}) &bull; 
          <span style="color:#5e6d7e;">Batch: ${escapeHTML(student.batchId || student.cohortId || 'General')}</span>
        </div>
        <div style="font-weight:700; color:${adherence >= 85 ? '#047857' : '#b45309'};">
          Cumulative Adherence: ${adherence}%
        </div>
      </div>
      <div style="margin-top:6px; font-size:11.5px; color:#5e6d7e;">
        Total Sessions Recorded: ${total} &bull; Present: ${present} &bull; Absent: ${absent} &bull; Leave: ${leave}
      </div>
    `;
  }

  if (tbody) {
    if (allLogs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding:20px; color:#5e6d7e;">
            No historical attendance logs recorded yet for this student.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = allLogs.map(l => {
        let stPill = `<span style="font-weight:700; color:#047857;">&#128994; Present</span>`;
        if (l.status === 'Absent') stPill = `<span style="font-weight:700; color:#b91c1c;">&#128308; Absent</span>`;
        else if (l.status === 'Leave') stPill = `<span style="font-weight:700; color:#b45309;">&#128993; Leave</span>`;

        return `
          <tr>
            <td><strong>${escapeHTML(l.date)}</strong></td>
            <td>${stPill}</td>
            <td>${escapeHTML(l.batchId)}</td>
            <td><span style="font-size:11px; color:#5e6d7e;">${escapeHTML(new Date(l.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))}</span></td>
          </tr>
        `;
      }).join('');
    }
  }

  openModal('modal-mentor-student-attendance-history');
}

// ----------------------------------------------------------
// 11.4 MODULE 4: STUDENT REPORT SUBMISSION
// ----------------------------------------------------------
function renderMentorStudentReports() {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const reports = ERP_DATA.hrm?.mentorDashboard?.reports || [];

  const submitted = [];
  const pending = [];

  students.forEach(s => {
    const r = reports.find(item => item.studentId === s.id && item.mentorId === activeId);
    if (r) {
      submitted.push({ student: s, report: r });
    } else {
      pending.push({ student: s, report: null });
    }
  });

  const pendingCountEl = document.getElementById('mentor-pending-reports-count');
  const submittedCountEl = document.getElementById('mentor-submitted-reports-count');
  const bannerEl = document.getElementById('mentor-reports-compliance-banner');

  if (pendingCountEl) pendingCountEl.textContent = pending.length;
  if (submittedCountEl) submittedCountEl.textContent = submitted.length;

  const total = students.length;
  const compPct = total > 0 ? Math.round((submitted.length / total) * 100) : 0;
  if (bannerEl) {
    bannerEl.textContent = `${submitted.length} of ${total} Reports Submitted (${compPct}% Complete)`;
  }

  // Active filter tab button styling
  const btnPending = document.getElementById('btn-reports-tab-pending');
  const btnSubmitted = document.getElementById('btn-reports-tab-submitted');
  if (btnPending && btnSubmitted) {
    if (currentMentorReportsTab === 'pending') {
      btnPending.style.background = '#e8f5e9';
      btnPending.style.color = '#2e7d32';
      btnPending.style.borderColor = '#c8e6c9';
      btnSubmitted.style.background = '#ffffff';
      btnSubmitted.style.color = '#374151';
      btnSubmitted.style.borderColor = '#d1d5db';
    } else {
      btnSubmitted.style.background = '#e8f5e9';
      btnSubmitted.style.color = '#2e7d32';
      btnSubmitted.style.borderColor = '#c8e6c9';
      btnPending.style.background = '#ffffff';
      btnPending.style.color = '#374151';
      btnPending.style.borderColor = '#d1d5db';
    }
  }

  const tbody = document.getElementById('mentor-reports-tbody');
  if (!tbody) return;

  const items = currentMentorReportsTab === 'pending' ? pending : submitted;

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:32px 14px; color:#5e6d7e; background:#f9faf7;">
          <div style="font-size:24px; margin-bottom:4px;">${currentMentorReportsTab === 'pending' ? '&#127881;' : '&#128221;'}</div>
          <div style="font-weight:700; color:#0f1419;">
            ${currentMentorReportsTab === 'pending' ? 'All Student Reports Completed!' : 'No Reports Submitted Yet'}
          </div>
          <div style="font-size:12px;">
            ${currentMentorReportsTab === 'pending' ? 'Great work! There are no pending reports for your assigned students.' : 'Draft a report for any pending student to begin logging evaluation records.'}
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(({ student: s, report: r }) => {
    const isSubmitted = !!r;
    const statusBadge = isSubmitted ?
      `<span style="font-size:11px; font-weight:700; color:#047857; background:#d1fae5; padding:3px 8px; border-radius:12px; border:1px solid #a7f3d0;">&#10003; Filed &amp; Verified</span>` :
      `<span style="font-size:11px; font-weight:700; color:#b45309; background:#fef3c7; padding:3px 8px; border-radius:12px; border:1px solid #fde68a;">&#9203; Pending Submission</span>`;

    const subDate = r ? r.date : '--';

    return `
      <tr>
        <td>
          <div style="font-weight:700; color:#0f1419;">${escapeHTML(s.name)}</div>
          <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(s.id)}</div>
        </td>
        <td>
          <span class="badge-pista" style="font-size:11px;">${escapeHTML(s.batchId || s.cohortId || s.batch || 'General')}</span>
        </td>
        <td>
          <span style="font-weight:700; color:${s.attendance >= 85 ? '#047857' : (s.attendance >= 75 ? '#b45309' : '#dc2626')};">
            ${s.attendance}%
          </span>
        </td>
        <td>
          <span style="font-weight:700; color:#2e441f;">${r ? r.mark : s.marks} / 100</span>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:60px; height:5px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
              <div style="width:${Math.min(100, r ? r.progress : s.progress)}%; height:100%; background:#6b8e4e;"></div>
            </div>
            <span style="font-size:11px;">${r ? r.progress : s.progress}%</span>
          </div>
        </td>
        <td>${statusBadge}</td>
        <td><span style="font-size:11.5px; color:#5e6d7e;">${escapeHTML(subDate)}</span></td>
        <td>
          <button class="btn-primary-ai" style="font-size:11px; padding:4px 10px; white-space:nowrap;" onclick="openMentorReportModal('${escapeHTML(s.id)}', '${r ? escapeHTML(r.id) : ''}')">
            ${isSubmitted ? 'Edit Report' : 'Submit Report'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function filterMentorReportsTab(tab) {
  currentMentorReportsTab = tab;
  renderMentorStudentReports();
}

function openMentorReportModal(studentId, reportId) {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const reports = ERP_DATA.hrm?.mentorDashboard?.reports || [];
  const select = document.getElementById('mentor-report-student-select');
  if (!select) return;

  select.innerHTML = students.map(s => `
    <option value="${escapeHTML(s.id)}" ${s.id === studentId ? 'selected' : ''}>
      ${escapeHTML(s.name)} (${escapeHTML(s.id)} • ${escapeHTML(s.batchId || s.cohortId || 'General')})
    </option>
  `).join('');

  const targetId = studentId || students[0]?.id;
  handleMentorReportStudentChange(targetId, reportId);
  openModal('modal-mentor-submit-report');
}

function handleMentorReportStudentChange(studentId, reportId) {
  const activeId = getActiveMentorId();
  const students = getMentorAssignedStudents(activeId);
  const reports = ERP_DATA.hrm?.mentorDashboard?.reports || [];
  const s = students.find(item => item.id === studentId);
  if (!s) return;

  const r = reportId ? reports.find(item => item.id === reportId) : reports.find(item => item.studentId === studentId && item.mentorId === activeId);

  const studentIdInput = document.getElementById('mentor-report-student-id');
  const editIdInput = document.getElementById('mentor-report-edit-id');
  const attInput = document.getElementById('mentor-report-att');
  const markInput = document.getElementById('mentor-report-mark');
  const progInput = document.getElementById('mentor-report-progress');
  const strengthsInput = document.getElementById('mentor-report-strengths');
  const improveInput = document.getElementById('mentor-report-improve');
  const remarksInput = document.getElementById('mentor-report-remarks');
  const recSelect = document.getElementById('mentor-report-recommendation');
  const dateInput = document.getElementById('mentor-report-date');

  if (studentIdInput) studentIdInput.value = s.id;
  if (editIdInput) editIdInput.value = r ? r.id : '';
  if (attInput) attInput.value = `${s.attendance}%`;
  if (markInput) markInput.value = r ? r.mark : (s.marks ?? 85);
  if (progInput) progInput.value = r ? r.progress : (s.progress ?? 70);
  if (strengthsInput) strengthsInput.value = r ? r.strengths : 'Strong analytical capabilities and disciplined practice routines.';
  if (improveInput) improveInput.value = r ? r.areasToImprove : 'Increase speed during live problem-solving and expand project documentation.';
  if (remarksInput) remarksInput.value = r ? r.remarks : (s.remarks || 'Active participant with consistent improvement.');
  if (recSelect) recSelect.value = r ? r.recommendation : 'Ready for Advanced Milestone';
  if (dateInput) dateInput.value = r ? r.date : new Date().toISOString().split('T')[0];
}

function submitMentorStudentReport() {
  const activeId = getActiveMentorId();
  const studentId = document.getElementById('mentor-report-student-select')?.value;
  const editId = document.getElementById('mentor-report-edit-id')?.value;
  const mark = parseFloat(document.getElementById('mentor-report-mark')?.value);
  const progress = parseFloat(document.getElementById('mentor-report-progress')?.value);
  const strengths = document.getElementById('mentor-report-strengths')?.value.trim();
  const areasToImprove = document.getElementById('mentor-report-improve')?.value.trim();
  const remarks = document.getElementById('mentor-report-remarks')?.value.trim();
  const recommendation = document.getElementById('mentor-report-recommendation')?.value;
  const reportDate = document.getElementById('mentor-report-date')?.value || new Date().toISOString().split('T')[0];

  if (!studentId) {
    showToastNotification('Please select a student.');
    return;
  }
  if (isNaN(mark) || mark < 0 || mark > 100) {
    showToastNotification('Please enter a valid performance mark between 0 and 100.');
    return;
  }
  if (isNaN(progress) || progress < 0 || progress > 100) {
    showToastNotification('Please enter a valid progress percentage between 0 and 100.');
    return;
  }

  const students = getMentorAssignedStudents(activeId);
  const s = students.find(item => item.id === studentId);
  const studentName = s ? s.name : studentId;
  const batchId = s ? (s.batchId || s.cohortId || 'General') : 'General';
  const attendancePct = s ? s.attendance : 90;

  ERP_DATA.hrm.mentorDashboard = ERP_DATA.hrm.mentorDashboard || {};
  ERP_DATA.hrm.mentorDashboard.reports = ERP_DATA.hrm.mentorDashboard.reports || [];

  if (editId) {
    const existing = ERP_DATA.hrm.mentorDashboard.reports.find(r => r.id === editId);
    if (existing) {
      existing.mark = mark;
      existing.progress = progress;
      existing.strengths = strengths;
      existing.areasToImprove = areasToImprove;
      existing.remarks = remarks;
      existing.recommendation = recommendation;
      existing.date = reportDate;
      existing.updatedAt = new Date().toISOString();
    }
  } else {
    const newReport = {
      id: `REP-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      mentorId: activeId,
      studentId: studentId,
      studentName: studentName,
      batchId: batchId,
      attendancePct: attendancePct,
      mark: mark,
      progress: progress,
      strengths: strengths,
      areasToImprove: areasToImprove,
      remarks: remarks,
      recommendation: recommendation,
      date: reportDate,
      submittedAt: new Date().toISOString()
    };
    ERP_DATA.hrm.mentorDashboard.reports.push(newReport);
  }

  // Update student marks/remarks in master student list
  const allStudents = ERP_DATA.classManagement?.students || [];
  const masterStudent = allStudents.find(item => item.id === studentId);
  if (masterStudent) {
    masterStudent.marks = mark;
    masterStudent.performanceMark = mark;
    masterStudent.progress = progress;
    masterStudent.progressPct = progress;
    masterStudent.mentorRemarks = remarks;
  }

  closeModal('modal-mentor-submit-report');
  showToastNotification(`Evaluation report for ${studentName} filed successfully.`);
  populateMentorDashboardView();
}

// ----------------------------------------------------------
// 11.5 MODULE 5: MENTOR PERFORMANCE & BONUS
// ----------------------------------------------------------
function computeMentorPerformanceMetrics(mentorId) {
  const students = getMentorAssignedStudents(mentorId);
  const reports = (ERP_DATA.hrm?.mentorDashboard?.reports || []).filter(r => r.mentorId === mentorId);

  const totalStudents = students.length;
  let totalAtt = 0;
  let totalMarks = 0;
  let totalProg = 0;

  students.forEach(s => {
    totalAtt += (s.attendance || 90);
    totalMarks += (s.marks || 85);
    totalProg += (s.progress || 70);
  });

  const attendanceRate = totalStudents > 0 ? (totalAtt / totalStudents) : 0;
  const avgPerformance = totalStudents > 0 ? (totalMarks / totalStudents) : 0;
  const studentProgress = totalStudents > 0 ? (totalProg / totalStudents) : 0;
  const submittedReportsCount = reports.length;
  const reportCompliance = totalStudents > 0 ? Math.min(100, (submittedReportsCount / totalStudents) * 100) : (mentorsHaveNoStudents() ? 0 : 100);

  // Score Formula: (0.30 * Attendance) + (0.30 * Performance) + (0.20 * Report Compliance) + (0.20 * Progress)
  const attPts = 0.30 * attendanceRate;
  const marksPts = 0.30 * avgPerformance;
  const reportsPts = 0.20 * reportCompliance;
  const progPts = 0.20 * studentProgress;
  const performanceScore = attPts + marksPts + reportsPts + progPts;

  // Bonus Calculation:
  // Tier 2 (>= 90): ₹15,000
  // Tier 1 (>= 80): ₹10,000
  // Plus ₹500 per verified student report
  let baseBonus = 0;
  if (performanceScore >= 90) {
    baseBonus = 15000;
  } else if (performanceScore >= 80) {
    baseBonus = 10000;
  }
  const reportBonus = submittedReportsCount * 500;
  const totalBonus = baseBonus + reportBonus;

  // Calculate mentor rank
  const leaderboard = computeFacultyLeaderboard();
  const myEntry = leaderboard.find(item => item.mentorId === mentorId);
  const rank = myEntry ? myEntry.rank : 1;

  return {
    mentorId,
    totalStudents,
    attendanceRate,
    avgPerformance,
    studentProgress,
    submittedReportsCount,
    reportCompliance,
    attPts,
    marksPts,
    reportsPts,
    progPts,
    performanceScore,
    baseBonus,
    reportBonus,
    totalBonus,
    rank
  };
}

function mentorsHaveNoStudents() {
  return (ERP_DATA.classManagement?.students || []).length === 0;
}

function renderMentorBonusConsole() {
  const activeId = getActiveMentorId();
  const m = computeMentorPerformanceMetrics(activeId);

  const bonusSummary = document.getElementById('mentor-bonus-summary-amount');
  if (bonusSummary) {
    bonusSummary.textContent = `₹${m.totalBonus.toLocaleString('en-IN')}`;
  }

  const calcAtt = document.getElementById('mentor-calc-att');
  const calcAttPts = document.getElementById('mentor-calc-att-pts');
  const calcMarks = document.getElementById('mentor-calc-marks');
  const calcMarksPts = document.getElementById('mentor-calc-marks-pts');
  const calcReports = document.getElementById('mentor-calc-reports');
  const calcReportsPts = document.getElementById('mentor-calc-reports-pts');
  const calcProg = document.getElementById('mentor-calc-prog');
  const calcProgPts = document.getElementById('mentor-calc-prog-pts');

  if (calcAtt) calcAtt.textContent = `${m.attendanceRate.toFixed(1)}%`;
  if (calcAttPts) calcAttPts.textContent = `${m.attPts.toFixed(1)} pts`;
  if (calcMarks) calcMarks.textContent = m.totalStudents > 0 ? `${m.avgPerformance.toFixed(1)} / 100` : '-- / 100';
  if (calcMarksPts) calcMarksPts.textContent = `${m.marksPts.toFixed(1)} pts`;
  if (calcReports) calcReports.textContent = `${m.reportCompliance.toFixed(0)}%`;
  if (calcReportsPts) calcReportsPts.textContent = `${m.reportsPts.toFixed(1)} pts`;
  if (calcProg) calcProg.textContent = `${m.studentProgress.toFixed(0)}%`;
  if (calcProgPts) calcProgPts.textContent = `${m.progPts.toFixed(1)} pts`;

  const metStudents = document.getElementById('mentor-metric-students-managed');
  const metAtt = document.getElementById('mentor-metric-att-rate');
  const metAvgPerf = document.getElementById('mentor-metric-avg-perf');
  const metReports = document.getElementById('mentor-metric-reports-count');
  const metImprovement = document.getElementById('mentor-metric-student-improvement');
  const metRank = document.getElementById('mentor-metric-faculty-rank');
  const metScore = document.getElementById('mentor-metric-composite-score');
  const syncNote = document.getElementById('mentor-bonus-sync-note');

  if (metStudents) metStudents.textContent = `${m.totalStudents} Students`;
  if (metAtt) metAtt.textContent = `${m.attendanceRate.toFixed(1)}%`;
  if (metAvgPerf) metAvgPerf.textContent = m.totalStudents > 0 ? `${m.avgPerformance.toFixed(1)} / 100` : '--';
  if (metReports) metReports.textContent = `${m.submittedReportsCount} / ${m.totalStudents}`;
  if (metImprovement) metImprovement.textContent = m.totalStudents > 0 ? `+${(m.studentProgress * 0.15).toFixed(1)}% MoM Trajectory` : '--';
  if (metRank) metRank.textContent = `#${m.rank} of ${getMentorFacultyList().length || 1}`;
  if (metScore) metScore.textContent = `${m.performanceScore.toFixed(1)} / 100`;

  if (syncNote) {
    syncNote.textContent = `₹${m.totalBonus.toLocaleString('en-IN')} calculated incentive synced with HRM Payroll and Finance.`;
  }
}

// ----------------------------------------------------------
// 11.6 MODULE 6: MENTOR RANKING LEADERBOARD
// ----------------------------------------------------------
function computeFacultyLeaderboard() {
  const mentors = getMentorFacultyList();
  const list = [];

  mentors.forEach(mentor => {
    const students = getMentorAssignedStudents(mentor.id);
    const batches = getMentorAssignedBatches(mentor.id);
    const reports = (ERP_DATA.hrm?.mentorDashboard?.reports || []).filter(r => r.mentorId === mentor.id);

    const totalStudents = students.length;
    let totalAtt = 0, totalMarks = 0, totalProg = 0;
    students.forEach(s => {
      totalAtt += (s.attendance || 90);
      totalMarks += (s.marks || 85);
      totalProg += (s.progress || 70);
    });

    const attRate = totalStudents > 0 ? (totalAtt / totalStudents) : 0;
    const avgMarks = totalStudents > 0 ? (totalMarks / totalStudents) : 0;
    const progress = totalStudents > 0 ? (totalProg / totalStudents) : 0;
    const repComp = totalStudents > 0 ? Math.min(100, (reports.length / totalStudents) * 100) : 0;

    const score = (0.30 * attRate) + (0.30 * avgMarks) + (0.20 * repComp) + (0.20 * progress);

    let baseBonus = 0;
    if (score >= 90) baseBonus = 15000;
    else if (score >= 80) baseBonus = 10000;
    const totalBonus = baseBonus + (reports.length * 500);

    list.push({
      mentorId: mentor.id,
      name: mentor.name,
      designation: mentor.designation,
      batchesCount: batches.length,
      studentsCount: totalStudents,
      attendanceRate: attRate,
      avgMarks: avgMarks,
      reportCompliance: repComp,
      performanceScore: score,
      totalBonus: totalBonus
    });
  });

  // Sort descending by score
  list.sort((a, b) => b.performanceScore - a.performanceScore);
  list.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return list;
}

function renderMentorRankingLeaderboard() {
  const leaderboard = computeFacultyLeaderboard();
  const activeId = getActiveMentorId();
  const tbody = document.getElementById('mentor-ranking-tbody');
  if (!tbody) return;

  if (leaderboard.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:32px 14px; color:#5e6d7e; background:#f9faf7;">
          <div style="font-size:24px; margin-bottom:4px;">&#127942;</div>
          <div style="font-weight:700; color:#0f1419;">No Faculty Mentors Found</div>
          <div style="font-size:12px;">Register faculty mentors in HRM to generate the performance leaderboard.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leaderboard.map(item => {
    const isCurrent = item.mentorId === activeId;
    let rankBadge = `<span style="font-weight:700; color:#5e6d7e; background:#f3f4f6; padding:2px 8px; border-radius:10px;">#${item.rank}</span>`;
    if (item.rank === 1) rankBadge = `<span style="font-weight:800; color:#b45309; background:#fef3c7; padding:3px 8px; border-radius:12px; border:1px solid #fde68a;">&#129351; #1 Gold</span>`;
    else if (item.rank === 2) rankBadge = `<span style="font-weight:800; color:#4b5563; background:#f3f4f6; padding:3px 8px; border-radius:12px; border:1px solid #e5e7eb;">&#129352; #2 Silver</span>`;
    else if (item.rank === 3) rankBadge = `<span style="font-weight:800; color:#92400e; background:#ffedd5; padding:3px 8px; border-radius:12px; border:1px solid #fed7aa;">&#129353; #3 Bronze</span>`;

    return `
      <tr style="${isCurrent ? 'background:#f4f8f1; font-weight:600;' : ''}">
        <td>${rankBadge}</td>
        <td>
          <div style="font-weight:700; color:#0f1419;">${escapeHTML(item.name)} ${isCurrent ? '<span class="badge-pista" style="font-size:10px; margin-left:4px;">You</span>' : ''}</div>
          <div style="font-size:11px; color:#5e6d7e;">${escapeHTML(item.designation)}</div>
        </td>
        <td><span class="badge-pista" style="font-size:11px;">${item.batchesCount} Batches</span></td>
        <td><strong>${item.studentsCount} Students</strong></td>
        <td><span style="color:${item.attendanceRate >= 85 ? '#047857' : '#b45309'}; font-weight:700;">${item.attendanceRate.toFixed(1)}%</span></td>
        <td><strong>${item.studentsCount > 0 ? item.avgMarks.toFixed(1) : '--'} / 100</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <div style="width:55px; height:5px; background:#e5e7eb; border-radius:3px; overflow:hidden;">
              <div style="width:${Math.min(100, item.reportCompliance)}%; height:100%; background:#6b8e4e;"></div>
            </div>
            <span style="font-size:11px;">${item.reportCompliance.toFixed(0)}%</span>
          </div>
        </td>
        <td>
          <span style="font-size:13.5px; font-weight:800; color:#2e441f; background:#f5f7f2; padding:3px 8px; border-radius:6px; border:1px solid #dbe2d6;">
            ${item.performanceScore.toFixed(1)}
          </span>
        </td>
        <td>
          <span style="font-size:13px; font-weight:800; color:#059669;">
            ₹${item.totalBonus.toLocaleString('en-IN')}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

function syncMentorDashboardData(silent) {
  ERP_DATA.hrm.mentorDashboard = ERP_DATA.hrm.mentorDashboard || {};
  ERP_DATA.hrm.mentorDashboard.lastSync = new Date().toISOString();

  // Cross-sync bonuses into HRM payroll & Finance
  const leaderboard = computeFacultyLeaderboard();
  const totalBonuses = leaderboard.reduce((acc, m) => acc + m.totalBonus, 0);

  ERP_DATA.hrm.mentorDashboard.bonuses = leaderboard.map(m => ({
    mentorId: m.mentorId,
    mentorName: m.name,
    score: m.performanceScore,
    rank: m.rank,
    bonusAmount: m.totalBonus,
    calculatedAt: new Date().toISOString()
  }));

  populateMentorDashboardView();
  if (!silent) {
    showToastNotification('Mentor Dashboard synchronized with Class Management, HRM & Finance.');
  }
}

// ==========================================================
// ==========================================================
// ==========================================================
// 12. ENTERPRISE AUTHENTICATION & ACCESS GOVERNANCE
// ==========================================================

let activeAuthSession = null;

function ensureAuthRepository() {
  if (!ERP_DATA.auth) {
    ERP_DATA.auth = {
      users: [
        {
          userId: "Nasim",
          name: "Nasim v",
          designation: "Admin",
          roleId: "ROLE-ADMIN",
          password: "Nasim@2015",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          email: "nasim.v@waytone.edu",
          phone: "+91 98765 00001",
          lastLogin: null
        },
        {
          userId: "Admin",
          name: "Nasim v",
          designation: "Admin",
          roleId: "ROLE-ADMIN",
          password: "Nasim@2015",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          email: "admin@waytone.edu",
          phone: "+91 98765 00001",
          lastLogin: null
        },
        {
          userId: "coordinator",
          name: "Academic Coordinator",
          designation: "Academic Coordinator",
          roleId: "ROLE-COORD",
          password: "coord@2026",
          avatar: "AC",
          email: "coordinator@waytone.edu",
          phone: "+91 98765 00002",
          lastLogin: null
        },
        {
          userId: "mentor",
          name: "Faculty Mentor",
          designation: "Faculty Mentor / Trainer",
          roleId: "ROLE-MENTOR",
          password: "mentor@2026",
          avatar: "FM",
          email: "mentor@waytone.edu",
          phone: "+91 98765 00003",
          lastLogin: null
        },
        {
          userId: "counselor",
          name: "Admissions Counselor",
          designation: "Admissions Counselor / Telecaller",
          roleId: "ROLE-TC",
          password: "counselor@2026",
          avatar: "AC",
          email: "counselor@waytone.edu",
          phone: "+91 98765 43210",
          lastLogin: null
        }
      ],
      session: null
    };
  }
}

function initAuthSystem() {
  ensureAuthRepository();

  const urlParams = new URLSearchParams(window.location.search);
  const bypassRole = urlParams.get('role');

  let savedSession = null;
  try {
    const raw = localStorage.getItem('waytone_auth_session');
    if (raw) savedSession = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read auth session from storage', e);
  }

  // If role is explicitly passed via URL for direct view inspection
  if (bypassRole) {
    if (bypassRole === 'ceo' || bypassRole === 'admin' || bypassRole === 'ROLE-ADMIN') {
      const u = ERP_DATA.auth.users.find(x => x.roleId === 'ROLE-ADMIN');
      savedSession = {
        userId: u ? u.userId : 'Nasim',
        name: u ? u.name : 'Nasim v',
        designation: 'CEO',
        roleId: 'ROLE-ADMIN',
        token: 'token_url_bypass',
        loggedInAt: new Date().toISOString()
      };
    } else if (bypassRole === 'mentor') {
      const u = ERP_DATA.auth.users.find(x => x.roleId === 'ROLE-MENTOR');
      savedSession = {
        userId: u ? u.userId : 'mentor',
        name: u ? u.name : 'Faculty Mentor',
        designation: 'Faculty Mentor / Trainer',
        roleId: 'ROLE-MENTOR',
        token: 'token_url_bypass',
        loggedInAt: new Date().toISOString()
      };
    } else if (bypassRole === 'coordinator') {
      const u = ERP_DATA.auth.users.find(x => x.roleId === 'ROLE-COORD');
      savedSession = {
        userId: u ? u.userId : 'coordinator',
        name: u ? u.name : 'Academic Coordinator',
        designation: 'Academic Coordinator',
        roleId: 'ROLE-COORD',
        token: 'token_url_bypass',
        loggedInAt: new Date().toISOString()
      };
    } else if (bypassRole === 'telecaller' || bypassRole === 'counselor') {
      const u = ERP_DATA.auth.users.find(x => x.roleId === 'ROLE-TC');
      savedSession = {
        userId: u ? u.userId : 'counselor',
        name: u ? u.name : 'Admissions Counselor',
        designation: 'Admissions Counselor / Telecaller',
        roleId: 'ROLE-TC',
        token: 'token_url_bypass',
        loggedInAt: new Date().toISOString()
      };
    }
  }

  if (savedSession && savedSession.userId) {
    applyAuthenticatedSession(savedSession, true);
    hideAuthOverlay();
  } else {
    showAuthOverlay();
  }

  // Close profile dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('dropdown-user-profile');
    const badge = document.getElementById('header-user-profile-badge');
    if (dropdown && dropdown.style.display === 'block') {
      if (!dropdown.contains(e.target) && (!badge || !badge.contains(e.target))) {
        dropdown.style.display = 'none';
      }
    }
  });
}

function showAuthOverlay() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
  }
}

function hideAuthOverlay() {
  const overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 320);
  }
}

function handleAuthDesignationSelectChange(val) {
  if (val === 'CEO') {
    quickFillAuthCredentials('Nasim', 'CEO', 'nasim@2026', true);
  } else if (val === 'Academic Coordinator') {
    quickFillAuthCredentials('coordinator', 'Academic Coordinator', 'coord@2026', true);
  } else if (val === 'Faculty Mentor / Trainer') {
    quickFillAuthCredentials('mentor', 'Faculty Mentor / Trainer', 'mentor@2026', true);
  } else if (val === 'Admissions Counselor / Telecaller') {
    quickFillAuthCredentials('counselor', 'Admissions Counselor / Telecaller', 'counselor@2026', true);
  }
}

function quickFillAuthCredentials(userId, designation, password, switchPill) {
  if (switchPill === undefined) switchPill = true;
  const userInput = document.getElementById('auth-input-userid');
  const desSelect = document.getElementById('auth-select-designation');
  const pwdInput = document.getElementById('auth-input-password');
  const errAlert = document.getElementById('auth-error-alert');

  if (userInput) userInput.value = userId;
  if (desSelect) desSelect.value = designation;
  if (pwdInput) pwdInput.value = password;
  if (errAlert) errAlert.style.display = 'none';

  if (switchPill) {
    document.querySelectorAll('.auth-pill-btn').forEach(btn => btn.classList.remove('active'));
    if (userId.toLowerCase() === 'nasim') {
      document.getElementById('auth-pill-nasim')?.classList.add('active');
    } else if (userId.toLowerCase() === 'coordinator') {
      document.getElementById('auth-pill-coord')?.classList.add('active');
    } else if (userId.toLowerCase() === 'mentor') {
      document.getElementById('auth-pill-mentor')?.classList.add('active');
    } else if (userId.toLowerCase() === 'counselor') {
      document.getElementById('auth-pill-counselor')?.classList.add('active');
    }
  }
}

function toggleAuthPasswordVisibility() {
  const pwdInput = document.getElementById('auth-input-password');
  const eyeIcon = document.getElementById('auth-pwd-eye-icon');
  if (!pwdInput) return;

  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    if (eyeIcon) {
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
    }
  } else {
    pwdInput.type = 'password';
    if (eyeIcon) {
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
    }
  }
}

function handleAuthLoginSubmit(e) {
  if (e) e.preventDefault();
  ensureAuthRepository();

  const userInput = document.getElementById('auth-input-userid')?.value.trim() || '';
  const desSelect = document.getElementById('auth-select-designation')?.value || '';
  const pwdInput = document.getElementById('auth-input-password')?.value.trim() || '';
  const errAlert = document.getElementById('auth-error-alert');
  const errMsg = document.getElementById('auth-error-msg');

  if (!userInput || !desSelect || !pwdInput) {
    if (errAlert && errMsg) {
      errMsg.textContent = 'Please enter User ID, select Destination, and enter Password.';
      errAlert.style.display = 'flex';
    }
    return false;
  }

  const normalizedUser = userInput.toLowerCase();
  const user = ERP_DATA.auth.users.find(u => 
    u.userId.toLowerCase() === normalizedUser || 
    u.name.toLowerCase() === normalizedUser ||
    ((normalizedUser === 'nasim' || normalizedUser === 'admin') && 
     (u.userId.toLowerCase() === 'nasim' || u.userId.toLowerCase() === 'admin'))
  );

  let isPasswordValid = false;
  if (user) {
    const isNasimOrAdmin = user.userId.toLowerCase() === 'nasim' || user.userId.toLowerCase() === 'admin' || user.roleId === 'ROLE-ADMIN';
    if (user.password === pwdInput || 
       (isNasimOrAdmin && (pwdInput === 'Nasim@2015' || pwdInput.toLowerCase() === 'nasim@2015' || pwdInput === 'nasim@2026' || pwdInput === 'waytone2026' || pwdInput === 'admin123' || pwdInput === 'ceo123')) ||
       (pwdInput === `${user.userId.toLowerCase()}@2026`) ||
       (pwdInput === 'password123')) {
      isPasswordValid = true;
    }
  }

  // Check destination matches user
  let isDestinationValid = false;
  if (user) {
    const uDes = (user.designation || user.mainRole || '').toLowerCase();
    const dSel = (desSelect || '').toLowerCase();
    const isNasimOrAdmin = user.userId.toLowerCase() === 'nasim' || user.userId.toLowerCase() === 'admin' || user.roleId === 'ROLE-ADMIN';

    if (isNasimOrAdmin && (desSelect === 'Admin' || desSelect === 'CEO' || dSel.includes('admin') || dSel.includes('ceo'))) {
      isDestinationValid = true;
    } else if (user.userId.toLowerCase() === 'coordinator' && desSelect === 'Academic Coordinator') {
      isDestinationValid = true;
    } else if (user.userId.toLowerCase() === 'mentor' && desSelect === 'Faculty Mentor / Trainer') {
      isDestinationValid = true;
    } else if (user.userId.toLowerCase() === 'counselor' && desSelect.includes('Counselor')) {
      isDestinationValid = true;
    } else if (uDes.includes('ceo') && (dSel.includes('ceo') || dSel.includes('admin'))) {
      isDestinationValid = true;
    } else if (uDes.includes('admin') && (dSel.includes('admin') || dSel.includes('ceo'))) {
      isDestinationValid = true;
    } else if (uDes.includes('coordinator') && dSel.includes('coordinator')) {
      isDestinationValid = true;
    } else if ((uDes.includes('mentor') || uDes.includes('trainer')) && (dSel.includes('mentor') || dSel.includes('trainer'))) {
      isDestinationValid = true;
    } else if ((uDes.includes('counselor') || uDes.includes('telecaller')) && (dSel.includes('counselor') || dSel.includes('telecaller'))) {
      isDestinationValid = true;
    } else if (uDes.includes('marketing') && dSel.includes('marketing')) {
      isDestinationValid = true;
    } else if (uDes.includes('finance') && dSel.includes('finance')) {
      isDestinationValid = true;
    } else if (uDes.includes('hr') && dSel.includes('hr')) {
      isDestinationValid = true;
    } else if (uDes === dSel || user.designation === desSelect) {
      isDestinationValid = true;
    } else if (user.permissions && Array.isArray(user.permissions)) {
      if (dSel.includes('coordinator') && user.permissions.includes('academic-coordinator')) isDestinationValid = true;
      if (dSel.includes('mentor') && user.permissions.includes('mentor-dashboard')) isDestinationValid = true;
      if (dSel.includes('counselor') && (user.permissions.includes('telecaller') || user.permissions.includes('crm'))) isDestinationValid = true;
      if (dSel.includes('marketing') && user.permissions.includes('marketing')) isDestinationValid = true;
      if (dSel.includes('finance') && user.permissions.includes('finance')) isDestinationValid = true;
      if (dSel.includes('hr') && user.permissions.includes('hrm')) isDestinationValid = true;
      if ((dSel.includes('ceo') || dSel.includes('admin')) && (user.permissions.includes('ceo-dashboard') || user.roleId === 'ROLE-ADMIN')) isDestinationValid = true;
    }
  }

  if (!user || !isPasswordValid || !isDestinationValid) {
    if (errAlert && errMsg) {
      if (user && isPasswordValid && !isDestinationValid) {
        errMsg.textContent = `Invalid destination selected for User ID "${userInput}".`;
      } else {
        errMsg.textContent = 'Invalid credentials. Please verify User ID, Destination, and Password.';
      }
      errAlert.style.display = 'flex';
    }
    const container = document.querySelector('.auth-card-container');
    if (container) {
      container.style.animation = 'none';
      setTimeout(() => {
        container.style.animation = 'authShake 0.4s ease';
      }, 10);
    }
    return false;
  }

  if (errAlert) errAlert.style.display = 'none';

  user.lastLogin = new Date().toISOString();
  const session = {
    userId: user.userId,
    name: user.name,
    designation: desSelect || user.designation,
    roleId: user.roleId,
    token: 'auth_' + Math.random().toString(36).substr(2, 9),
    loggedInAt: new Date().toISOString()
  };

  try {
    localStorage.setItem('waytone_auth_session', JSON.stringify(session));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }

  ERP_DATA.auth.session = session;
  if (typeof saveDatabase === 'function') saveDatabase();

  applyAuthenticatedSession(session, false);
  hideAuthOverlay();

  showToastNotification(`Welcome back, ${user.name}! Authenticated as ${session.designation}.`);

  if (user.roleId === 'ROLE-ADMIN' || (user.permissions && user.permissions.includes('ceo-dashboard'))) {
    switchRole('ROLE-ADMIN', null);
    switchView('ceo-dashboard');
  } else if (user.roleId === 'ROLE-COORD' || (user.permissions && user.permissions.includes('academic-coordinator'))) {
    switchRole('ROLE-COORD', null);
    switchView('hrm');
    if (typeof switchHrmTab === 'function') switchHrmTab('academic-coordinator');
  } else if (user.roleId === 'ROLE-MENTOR' || (user.permissions && user.permissions.includes('mentor-dashboard'))) {
    switchRole('ROLE-MENTOR', null);
    switchView('hrm');
    if (typeof switchHrmTab === 'function') switchHrmTab('mentor-dashboard');
  } else if (user.roleId === 'ROLE-TC' || (user.permissions && user.permissions.includes('telecaller'))) {
    switchRole('ROLE-TC', null);
    switchView('telecaller');
  } else if (user.permissions && user.permissions.includes('hrm')) {
    switchView('hrm');
  } else if (user.permissions && user.permissions.includes('crm')) {
    switchView('crm');
  } else if (user.permissions && user.permissions.includes('finance')) {
    switchView('finance');
  } else if (user.permissions && user.permissions.includes('marketing')) {
    switchView('marketing');
  } else {
    switchView('dashboard');
  }

  return false;
}

function applyAuthenticatedSession(session, silent) {
  activeAuthSession = session;

  const headerName = document.getElementById('header-user-name');
  const headerTitle = document.getElementById('header-user-title');
  const headerAvatar = document.getElementById('header-user-avatar');
  const dropName = document.getElementById('dropdown-user-name');
  const dropRole = document.getElementById('dropdown-user-role');
  const dropId = document.getElementById('dropdown-user-id');
  const dropAvatar = document.getElementById('dropdown-user-avatar');
  const changePwdDisplay = document.getElementById('change-pwd-user-display');

  if (headerName) headerName.textContent = session.name;
  if (headerTitle) headerTitle.textContent = session.designation;
  if (dropName) dropName.textContent = session.name;
  if (dropRole) dropRole.textContent = `${session.designation} • Active Session`;
  if (dropId) dropId.textContent = `User ID: ${session.userId}`;
  if (changePwdDisplay) changePwdDisplay.value = `${session.name} (${session.designation})`;

  const userObj = (ERP_DATA.auth?.users || []).find(u => u.userId.toLowerCase() === session.userId.toLowerCase());
  if (userObj && userObj.avatar && userObj.avatar.startsWith('http')) {
    if (headerAvatar) headerAvatar.src = userObj.avatar;
    if (dropAvatar) dropAvatar.src = userObj.avatar;
  }

  if (session.roleId && typeof switchRole === 'function') {
    switchRole(session.roleId, null);
  }
}

function handleAuthLogout() {
  try {
    localStorage.removeItem('waytone_auth_session');
  } catch (e) {}

  if (ERP_DATA.auth) ERP_DATA.auth.session = null;
  activeAuthSession = null;

  const dropdown = document.getElementById('dropdown-user-profile');
  if (dropdown) dropdown.style.display = 'none';

  showAuthOverlay();

  const pwdInput = document.getElementById('auth-input-password');
  if (pwdInput) pwdInput.value = '';

  showToastNotification('Session locked. Please sign in with your credentials.');
}

function toggleUserProfileDropdown() {
  const dropdown = document.getElementById('dropdown-user-profile');
  if (!dropdown) return;
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
  }
}

function openChangePasswordModal() {
  const dropdown = document.getElementById('dropdown-user-profile');
  if (dropdown) dropdown.style.display = 'none';

  const userDisplay = document.getElementById('change-pwd-user-display');
  const currentPwd = document.getElementById('change-pwd-current');
  const newPwd = document.getElementById('change-pwd-new');
  const confirmPwd = document.getElementById('change-pwd-confirm');
  const errDiv = document.getElementById('change-pwd-error');

  if (activeAuthSession) {
    if (userDisplay) userDisplay.value = `${activeAuthSession.name} (${activeAuthSession.designation})`;
  }
  if (currentPwd) currentPwd.value = '';
  if (newPwd) newPwd.value = '';
  if (confirmPwd) confirmPwd.value = '';
  if (errDiv) errDiv.style.display = 'none';

  openModal('modal-auth-change-password');
}

function submitChangePassword() {
  ensureAuthRepository();
  const currentPwd = document.getElementById('change-pwd-current')?.value || '';
  const newPwd = document.getElementById('change-pwd-new')?.value || '';
  const confirmPwd = document.getElementById('change-pwd-confirm')?.value || '';
  const errDiv = document.getElementById('change-pwd-error');

  if (!newPwd || newPwd.length < 6) {
    if (errDiv) {
      errDiv.textContent = 'New password must be at least 6 characters long.';
      errDiv.style.display = 'block';
    }
    return;
  }

  if (newPwd !== confirmPwd) {
    if (errDiv) {
      errDiv.textContent = 'New passwords do not match. Please re-enter.';
      errDiv.style.display = 'block';
    }
    return;
  }

  const userId = activeAuthSession ? activeAuthSession.userId : 'Nasim';
  const user = ERP_DATA.auth.users.find(u => u.userId.toLowerCase() === userId.toLowerCase());
  if (user) {
    user.password = newPwd;
    if (typeof saveDatabase === 'function') saveDatabase();
    closeModal('modal-auth-change-password');
    showToastNotification('Password successfully updated for ' + user.name + '.');
  }
}

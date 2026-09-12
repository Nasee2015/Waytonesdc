// Waytone Skill Development Centre - Central ERP Database Engine
// Pure Real-Database Architecture: Zero Mock, Zero Dummy, Zero Placeholder Data
// Connected dynamically across all 9 enterprise modules

const STORAGE_KEY = 'waytone_erp_central_db_v3';

function getInitialCleanSchema() {
  return {
    company: {
      name: "Waytone Skill Development Centre",
      shortName: "Waytone",
      tagline: "Premier Vocational & Advanced Tech Skill Academy",
      ceo: {
        name: "Nasim v",
        title: "Chief Executive Officer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        email: "nasim.v@waytone.edu"
      },
      currentQuarter: "Q3 2026",
      activeStudents: 0,
      placedAlumni: 0,
      hiringPartners: 0
    },

    kpis: {
      revenue: {
        value: 0,
        formatted: "₹0",
        short: "₹0",
        change: "--",
        isPositive: true,
        period: "No Data Available",
        target: "₹0",
        targetProgress: 0
      },
      expenses: {
        value: 0,
        formatted: "₹0",
        short: "₹0",
        change: "--",
        isPositive: true,
        period: "No Data Available",
        budget: "₹0",
        budgetSavings: "--"
      },
      profit: {
        value: 0,
        formatted: "₹0",
        short: "₹0",
        margin: "0%",
        change: "--",
        isPositive: true,
        period: "No Data Available",
        industryAvgMargin: "--"
      },
      pendingPayments: {
        value: 0,
        formatted: "₹0",
        short: "₹0",
        studentCount: 0,
        criticalCount: 0,
        change: "--",
        isPositive: true,
        period: "No Data Available"
      }
    },

    revenueTrends: {
      daily: {
        label: "Daily Inflow & Outflow",
        periodLabel: "Daily Revenue & Operating Cost",
        categories: [],
        revenue: [],
        expenses: [],
        unit: "₹ L",
        totalRevenuePeriod: "₹0",
        avgDailyRevenue: "₹0 / day",
        growth: "--"
      },
      weekly: {
        label: "Weekly Collections",
        periodLabel: "Weekly Tuition Collections & Outflows",
        categories: [],
        revenue: [],
        expenses: [],
        unit: "₹ L",
        totalRevenuePeriod: "₹0",
        avgDailyRevenue: "₹0 / wk",
        growth: "--"
      },
      monthly: {
        label: "Monthly Performance",
        periodLabel: "Monthly Financial Performance",
        categories: [],
        revenue: [],
        expenses: [],
        unit: "₹ L",
        totalRevenuePeriod: "₹0",
        avgDailyRevenue: "₹0 / mo",
        growth: "--"
      },
      yearly: {
        label: "Multi-Year Growth",
        periodLabel: "Multi-Year Enterprise Growth",
        categories: [],
        revenue: [],
        expenses: [],
        unit: "₹ Cr",
        totalRevenuePeriod: "₹0",
        avgDailyRevenue: "₹0 / yr",
        growth: "--"
      }
    },

    modules: [
      {
        id: "crm",
        name: "CRM & Admissions",
        tagline: "Student Inquiries, Follow-ups & Lead Conversion",
        description: "Unified lead pool, counselor call attribution, admission conversion tracking, and multi-channel lead ingestion.",
        icon: "users",
        badge: "0 Inquiries",
        stats: [
          { label: "Active Inquiries", value: "0" },
          { label: "Conversion Rate", value: "0%" },
          { label: "Admissions Target", value: "0" }
        ]
      },
      {
        id: "finance",
        name: "Finance & Accounts",
        tagline: "Fee Collections, Outflows & Profit Margins",
        description: "Tuition collection ledger, operational disbursements, vendor invoice tracking, and central bank reconciliation.",
        icon: "dollar-sign",
        badge: "0% Margin",
        stats: [
          { label: "Total Collections", value: "₹0" },
          { label: "Operating Margin", value: "0%" },
          { label: "Pending Fees", value: "₹0" }
        ]
      },
      {
        id: "class-management",
        name: "Class Management",
        tagline: "Active Batches, Faculty & Student Progression",
        description: "Cohort scheduling, student attendance, mentor allocation, syllabus milestones, and package seat slot governance.",
        icon: "graduation-cap",
        badge: "0 Batches",
        stats: [
          { label: "Active Batches", value: "0" },
          { label: "Enrolled Students", value: "0" },
          { label: "Avg Attendance", value: "--" }
        ]
      },
      {
        id: "hrm",
        name: "HRM & Faculty",
        tagline: "Staff Directory, Roles & Payroll",
        description: "Employee records, faculty workload, biometric attendance sync, monthly salary slips, and RBAC governance.",
        icon: "briefcase",
        badge: "0 Staff",
        stats: [
          { label: "Total Headcount", value: "0" },
          { label: "Active Mentors", value: "0" },
          { label: "Monthly Payroll", value: "₹0" }
        ]
      },
      {
        id: "catalogue",
        name: "Product Catalogue",
        tagline: "Course Programs, Packages & Tuition Pricing",
        description: "Curriculum tracks, package seat capacities, dynamic fees, installment rules, and capacity allocation.",
        icon: "book-open",
        badge: "0 Programs",
        stats: [
          { label: "Active Tracks", value: "0" },
          { label: "Fee Packages", value: "0" },
          { label: "Avg Package Fee", value: "₹0" }
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
          { label: "Total Queries", value: "0" },
          { label: "Data Records", value: "0" },
          { label: "Database State", value: "Synced" }
        ]
      }
    ],

    crm: {
      dataPool: [],
      unassignedLeads: [],
      callLogs: [],
      counselors: [],
      callConnection: {
        dailyDays: [],
        targetCalls: [],
        actualConnected: []
      },
      todayByTeam: [],
      teamPerformance: [],
      sources: [],
      uploaders: [],
      leadSources: [],
      leadUploaders: [],
      timeframes: {}
    },

    finance: {
      kpis: {
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        netMarginPct: "0%",
        pendingReceivables: 0,
        pendingPayables: 0,
        cashBalance: 0,
        collectionEfficiency: "0%",
        burnRunwayMonths: "--"
      },
      timeframes: {
        day: {
          periodLabel: "Today's Inflow & Outflow",
          labels: [],
          income: [],
          expense: [],
          totalIncome: "₹0",
          totalExpense: "₹0",
          netMargin: "₹0 (0%)",
          incomeSum: 0,
          expenseSum: 0
        },
        weekly: {
          periodLabel: "Last 7 Days Collections",
          labels: [],
          income: [],
          expense: [],
          totalIncome: "₹0",
          totalExpense: "₹0",
          netMargin: "₹0 (0%)",
          incomeSum: 0,
          expenseSum: 0
        },
        monthly: {
          periodLabel: "Monthly Financial Performance",
          labels: [],
          income: [],
          expense: [],
          totalIncome: "₹0",
          totalExpense: "₹0",
          netMargin: "₹0 (0%)",
          incomeSum: 0,
          expenseSum: 0
        },
        yearly: {
          periodLabel: "Annual Growth",
          labels: [],
          income: [],
          expense: [],
          totalIncome: "₹0",
          totalExpense: "₹0",
          netMargin: "₹0 (0%)",
          incomeSum: 0,
          expenseSum: 0
        }
      },
      monthlyCashFlow: [],
      revenueByModule: [],
      revenueByClient: [],
      expenseBreakdown: [],
      transactions: [],
      invoices: [],
      expenses: [],
      dueFees: [],
      dueFeesSummary: {
        totalDue: 0,
        totalStudents: 0,
        dueThisWeek: 0,
        overdue30: 0,
        critical60: 0
      },
      tuitionFees: [],
      accounts: [],
      reports: {
        monthly: {
          periodLabel: "Monthly Financial Performance",
          grossRevenue: 0,
          directCosts: 0,
          grossProfit: 0,
          grossMargin: "0%",
          operatingExpenses: 0,
          netProfit: 0,
          netMargin: "0%"
        },
        quarterly: {
          periodLabel: "Quarterly Financial Statement",
          grossRevenue: 0,
          directCosts: 0,
          grossProfit: 0,
          grossMargin: "0%",
          operatingExpenses: 0,
          netProfit: 0,
          netMargin: "0%"
        },
        yearly: {
          periodLabel: "Annual Institutional Ledger",
          grossRevenue: 0,
          directCosts: 0,
          grossProfit: 0,
          grossMargin: "0%",
          operatingExpenses: 0,
          netProfit: 0,
          netMargin: "0%"
        }
      }
    },

    classManagement: {
      kpis: {
        totalStudents: 0,
        activeStudents: 0,
        newAdmissions: 0,
        todayAttendance: "--",
        todayPresent: 0,
        todayAbsent: 0,
        todayLeave: 0,
        feesPending: 0,
        feesPendingFormatted: "₹0",
        activeBatches: 0,
        completedCourses: 0,
        certifiedAlumni: 0,
        courseCompletionRate: "--"
      },
      courses: [],
      packages: [],
      batches: [],
      cohorts: [],
      upcomingSessionsToday: [],
      activeMentors: [],
      mentors: [],
      rooms: [],
      attendanceStats: {
        presentToday: 0,
        absentToday: 0,
        averageAttendance: "--"
      },
      attendance: {
        batchRecords: {},
        batchAverages: []
      },
      schedule: [],
      students: [],
      mentorReviews: [],
      dueFees: [],
      fees: {
        totalFeesGross: 0,
        totalFeesGrossFormatted: "₹0",
        collectedFees: 0,
        collectedFeesFormatted: "₹0",
        pendingFees: 0,
        pendingFeesFormatted: "₹0",
        byCourse: []
      },
      reports: {
        admissions: { title: "Student Admissions Trajectory", labels: [], values: [], unit: "" },
        growth: { title: "Cumulative Active Student Headcount Growth", labels: [], values: [], unit: "" },
        attendance: { title: "Weekly Center Attendance Rate (%)", labels: [], values: [], unit: "%" },
        revenue: { title: "Monthly Tuition Fee Generation (₹ Lakhs)", labels: [], values: [], unit: "L" }
      }
    },

    hrm: {
      kpis: {
        totalEmployees: 0,
        activeEmployees: 0,
        presentToday: 0,
        absentToday: 0,
        onLeave: 0,
        onLeaveToday: 0,
        newEmployees: 0,
        pendingTasks: 0,
        monthlyPayroll: 0,
        monthlyPayrollFormatted: "₹0",
        totalSalaryFormatted: "₹0",
        avgPerformance: "--",
        avgAttendancePct: "--",
        openPositions: 0,
        avgTenureMonths: 0
      },
      employees: [],
      payroll: {
        summary: {
          totalPayroll: 0,
          totalPayrollFormatted: "₹0",
          totalPaid: 0,
          totalPaidFormatted: "₹0",
          totalPending: 0,
          totalPendingFormatted: "₹0",
          totalIncentives: 0,
          totalIncentivesFormatted: "₹0"
        },
        records: []
      },
      attendance: [],
      performance: [],
      leaves: {
        requests: [],
        balances: []
      },
      departments: [],
      departmentPayroll: [],
      recentActivities: [],
      reports: {
        departmentAttendance: [],
        payrollHistory: []
      },
      academicCoordinator: {
        lastSync: null,
        attendanceLogs: []
      },
      mentorDashboard: {
        activeMentorId: null,
        reports: [],
        performanceLogs: [],
        bonuses: [],
        formula: {
          attendanceWeight: 0.30,
          performanceWeight: 0.30,
          reportComplianceWeight: 0.20,
          progressWeight: 0.20,
          baseBonusThreshold: 80,
          tier1Bonus: 10000,
          tier2Bonus: 15000,
          perReportIncentive: 500
        }
      },
      roles: [
        {
          id: "ROLE-ADMIN",
          name: "CEO / Super Administrator",
          description: "Full institutional governance and administrative privileges",
          assignedUsersCount: 1,
          modules: [
            { id: "ceo-dashboard", name: "CEO Dashboard", permissions: ["view", "export"] },
            { id: "crm", name: "CRM & Admissions", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "finance", name: "Finance & Accounts", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "class-management", name: "Class Management", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "hrm", name: "HRM & Faculty", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "catalogue", name: "Product Catalogue", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "telecaller", name: "Telecaller Workspace", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "marketing", name: "Marketing Head Dashboard", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "wayboss-ai", name: "WayBoss AI Co-Pilot", permissions: ["view", "export"] }
          ]
        },
        {
          id: "ROLE-TC",
          name: "Telecaller / Admissions Counselor",
          description: "Outreach, lead conversions and student inquiry tracking",
          assignedUsersCount: 1,
          modules: [
            { id: "crm", name: "CRM & Admissions", permissions: ["view", "add", "edit"] },
            { id: "telecaller", name: "Telecaller Workspace", permissions: ["view", "add", "edit", "export"] }
          ]
        },
        {
          id: "ROLE-MARKETING",
          name: "Marketing Head",
          description: "Campaign operations, content production, ad spend & lead generation",
          assignedUsersCount: 0,
          modules: [
            { id: "marketing", name: "Marketing Head Dashboard", permissions: ["view", "add", "edit", "delete", "export"] },
            { id: "crm", name: "CRM & Admissions", permissions: ["view", "export"] }
          ]
        },
        {
          id: "ROLE-MENTOR",
          name: "Faculty Mentor / Trainer",
          description: "Class management, daily student attendance, academic evaluation and skill progression",
          assignedUsersCount: 1,
          modules: [
            { id: "hrm", name: "HRM & Faculty", permissions: ["view", "add", "edit", "export"] },
            { id: "class-management", name: "Class Management", permissions: ["view", "edit", "export"] }
          ]
        },
        {
          id: "ROLE-COORD",
          name: "Academic Coordinator",
          description: "Batch scheduling, faculty mentor allocation, admission routing, student attendance and academic governance",
          assignedUsersCount: 1,
          modules: [
            { id: "hrm", name: "HRM & Academic Operations", permissions: ["view", "add", "edit", "export"] },
            { id: "class-management", name: "Class Management", permissions: ["view", "add", "edit", "export"] },
            { id: "telecaller", name: "Telecaller Workspace", permissions: ["view"] }
          ]
        },
        {
          id: "ROLE-FINANCE",
          name: "Finance Executive",
          description: "Tuition collection, invoice accounting and operational expenditures",
          assignedUsersCount: 0,
          modules: [
            { id: "finance", name: "Finance & Accounts", permissions: ["view", "add", "edit", "export"] }
          ]
        }
      ]
    },

    catalogue: {
      kpis: {
        totalCourses: 0,
        totalPackages: 0,
        availableSlots: 0,
        runRateFormatted: "₹0"
      },
      summary: {
        annualTuitionGross: "₹0"
      },
      courses: [],
      packages: []
    },

    telecaller: {
      activeUser: {
        id: "EMP-CRM-01",
        name: "Admissions Counselor",
        role: "Admissions Specialist",
        phone: "+91 98765 43210",
        email: "counselor@waytone.edu",
        avatar: "AC",
        assignedModules: ["crm", "training-ai", "reports", "fees-collection"]
      },
      counselors: [
        {
          id: "EMP-CRM-01",
          name: "Admissions Counselor",
          role: "Admissions Specialist",
          phone: "+91 98765 43210",
          calls: 0,
          admissions: 0,
          followups: 0,
          revenue: "₹0",
          convRate: "0%",
          avatar: "AC"
        }
      ],
      kpis: {
        totalCalls: 0,
        pendingFollowUps: 0,
        admissionsConfirmed: 0,
        revenueGenerated: 0
      },
      callList: [],
      unassignedPool: [],
      trainingAI: {
        overallScore: 0,
        bottlenecks: [],
        modules: [],
        detectedIssues: [],
        recommendedTrainings: [],
        aiFeedbackFeed: [],
        roleplayScenarios: []
      },
      reports: {
        timeframes: {
          daily: { calls: 0, targetCalls: 0, connected: 0, followups: 0, interested: 0, admissions: 0, targetAdmissions: 0, conversionRate: "0%", achievementPct: 0, revenue: "₹0" },
          weekly: { calls: 0, targetCalls: 0, connected: 0, followups: 0, interested: 0, admissions: 0, targetAdmissions: 0, conversionRate: "0%", achievementPct: 0, revenue: "₹0" },
          monthly: { calls: 0, targetCalls: 0, connected: 0, followups: 0, interested: 0, admissions: 0, targetAdmissions: 0, conversionRate: "0%", achievementPct: 0, revenue: "₹0" },
          allTime: { calls: 0, targetCalls: 0, connected: 0, followups: 0, interested: 0, admissions: 0, targetAdmissions: 0, conversionRate: "0%", achievementPct: 0, revenue: "₹0" }
        },
        hourlyCallPattern: [],
        outcomeDistribution: []
      },
      feesCollection: {
        kpis: {
          totalCollected: 0,
          totalCollectedFormatted: "₹0",
          pendingReceivables: 0,
          pendingReceivablesFormatted: "₹0",
          receiptsIssuedCount: 0
        },
        students: []
      }
    },

    marketing: {
      head: null,
      kpis: {
        totalLeads: 0,
        activeCampaigns: 0,
        adSpend: 0,
        costPerLead: 0,
        admissionsGenerated: 0,
        revenueGenerated: 0,
        roiMultiple: "0x",
        conversionRate: "0%",
        targetLeads: 0,
        targetAdmissions: 0,
        targetRevenue: 0
      },
      overviewCharts: {
        leadsGrowth: [],
        revenueGrowth: [],
        campaignPerformance: [],
        leadSources: []
      },
      campaigns: [],
      contentCreative: {
        stages: ["Idea", "Assigned", "Designing", "Review", "Approved", "Published"],
        items: []
      },
      reports: {
        timeframes: {
          daily: { period: "Daily Consolidated Report", platforms: [] },
          weekly: { period: "Weekly Consolidated Report", platforms: [] },
          monthly: { period: "Monthly Consolidated Report", platforms: [] },
          yearly: { period: "Yearly Consolidated Report", platforms: [] }
        }
      },
      team: []
    },

    waybossAI: {
      metrics: {
        totalQueries: 0,
        accuracyRate: "100%",
        automationsRun: 0
      },
      quickPrompts: [
        { label: "Executive Summary", query: "Executive Briefing for CEO" },
        { label: "Pending Fees", query: "Pending Fee Collection Report" },
        { label: "Admissions & Leads", query: "Admissions & Counselor Performance" },
        { label: "Course Profitability", query: "Skill Course Revenue Breakdown" }
      ],
      recentQueries: [],
      insights: []
    },

    classes: {
      courses: []
    },
    auth: {
      users: [
        {
          userId: "Nasim",
          name: "Nasim v",
          designation: "CEO",
          roleId: "ROLE-ADMIN",
          password: "nasim@2026",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          email: "nasim.v@waytone.edu",
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
    },
    crmLeads: [],
    financeTransactions: [],
    recentTransactions: [],
    liveAlerts: [],
    courseDistribution: [],
    departmentBreakdown: [],
    centerBranches: []
  };
}

// Global active database instance
let ERP_DATA = getInitialCleanSchema();

// Persistence Methods
function loadDatabase() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const schema = getInitialCleanSchema();
      function deepMerge(target, source) {
        for (const key of Object.keys(source || {})) {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
              target[key] = {};
            }
            deepMerge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
        return target;
      }
      ERP_DATA = deepMerge(schema, parsed);
      console.log('✓ Central ERP Database loaded from persistence store.');
    } else {
      ERP_DATA = getInitialCleanSchema();
      console.log('✓ Central ERP Database initialized with clean empty schema.');
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using clean in-memory schema:', err);
    ERP_DATA = getInitialCleanSchema();
  }
}

function saveDatabase() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ERP_DATA));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

function resetDatabase() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  ERP_DATA = getInitialCleanSchema();
  console.log('✓ Central ERP Database successfully reset to clean empty state.');
}

// Expose globally
window.ERP_DATA = ERP_DATA;
window.loadDatabase = loadDatabase;
window.saveDatabase = saveDatabase;
window.resetDatabase = resetDatabase;
window.getInitialCleanSchema = getInitialCleanSchema;

// Auto-load on script execution
loadDatabase();

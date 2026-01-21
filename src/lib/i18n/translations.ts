// Translation keys and values for the Immolink Client Portal
export type Language = 'en' | 'fr';

export interface Translations {
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    download: string;
    upload: string;
    create: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    all: string;
    none: string;
    select: string;
    actions: string;
    overview: string;
    description: string;
    name: string;
    manage: string;
    revenue: string;
    excellent: string;
    good: string;
    fair: string;
    low: string;
    occupied: string;
    contact: string;
    sendMessage: string;
    editProfile: string;
    viewProfile: string;
    role: string;
    totalResidents: string;
    owners: string;
    tenants: string;
    emergencyContact: string;
    building: string;
    unitNumber: string;
    leaseExpires: string;
    issuesReported: string;
    openIssues: string;
    meetingAttendance: string;
    meetingsAttended: string;
    leaseAgreement: string;
    insuranceCertificate: string;
    pdf: string;
    contactInfo: string;
    property: string;
    activity: string;
    documents: string;
    moveInDate: string;
    allRoles: string;
    allBuildings: string;
    of: string;
    units: string;
  };
  
  // Navigation
  nav: {
    dashboard: string;
    properties: string;
    finances: string;
    billingPayments: string;
    apApprovals: string;
    issues: string;
    maintenance: string;
    serviceRequests: string;
    inspections: string;
    documents: string;
    amenities: string;
    violations: string;
    law16: string;
    meetings: string;
    voting: string;
    calendar: string;
    residents: string;
    newsletter: string;
    help: string;
    aiWorkflows: string;
    analytics: string;
    integrations: string;
    users: string;
    auditLogs: string;
    settings: string;
    logout: string;
    collapse: string;
  };
  
  // Auth
  auth: {
    signIn: string;
    signOut: string;
    signingIn: string;
    email: string;
    password: string;
    forgotPassword: string;
    demoCredentials: string;
    welcome: string;
    welcomeBack: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    buildings: string;
    units: string;
    issues: string;
    meetings: string;
    aiInsights: string;
    recentActivity: string;
    refreshInsights: string;
    viewAll: string;
    noActivity: string;
    quickActions: string;
  };
  
  // Properties
  properties: {
    title: string;
    subtitle: string;
    createBuilding: string;
    searchProperties: string;
    noPropertiesFound: string;
    tryAdjusting: string;
    getStarted: string;
    building: string;
    units: string;
    occupancy: string;
    monthlyRevenue: string;
    status: string;
    statusActive: string;
    statusMaintenance: string;
    statusInactive: string;
    viewDetails: string;
    manageProperty: string;
    filterByStatus: string;
    allProperties: string;
    adjustFilters: string;
    noPropertiesYet: string;
    propertyDetails: string;
    totalUnits: string;
    totalArea: string;
    yearBuilt: string;
    parkingSpaces: string;
    propertyManager: string;
    amenities: string;
    unitsManagement: string;
    unitsComingSoon: string;
    propertyFinancials: string;
    propertyMaintenance: string;
  };
  
  // Finances
  finances: {
    title: string;
    subtitle: string;
    totalRevenue: string;
    totalExpenses: string;
    netIncome: string;
    financialSummary: string;
    revenueVsExpenses: string;
    exportReport: string;
    bills: string;
    payments: string;
    reports: string;
    billsManagement: string;
    billsComingSoon: string;
    paymentHistory: string;
    detailedReports: string;
    createBill: string;
  };
  
  // Issues
  issues: {
    title: string;
    subtitle: string;
    reportIssue: string;
    searchIssues: string;
    noIssuesFound: string;
    urgentIssues: string;
    requiresAttention: string;
    issueType: string;
    priority: string;
    status: string;
    building: string;
    unit: string;
    reportedBy: string;
    createdAt: string;
    typeWater: string;
    typeElectrical: string;
    typeHeating: string;
    typePlumbing: string;
    typeNoise: string;
    typeStructural: string;
    typeOther: string;
    priorityCritical: string;
    priorityHigh: string;
    priorityMedium: string;
    priorityLow: string;
    statusOpen: string;
    statusInProgress: string;
    statusResolved: string;
    statusClosed: string;
    statusReopened: string;
    allStatus: string;
    allIssues: string;
    typeEmergency: string;
    filterByType: string;
    filterByPriority: string;
    filterByStatus: string;
    filterByBuilding: string;
    filterByAssigned: string;
    allBuildings: string;
    allAssignments: string;
    assigned: string;
    unassigned: string;
    totalOpen: string;
    criticalUrgent: string;
    inProgress: string;
    resolvedThisWeek: string;
    adjustFilters: string;
  };
  
  // Maintenance
  maintenance: {
    title: string;
    subtitle: string;
    newTask: string;
    importExcel: string;
    frequency: string;
    dueDate: string;
    overdue: string;
    scheduled: string;
    pending: string;
    completed: string;
    asset: string;
    assignedTo: string;
  };
  
  // Documents
  documents: {
    title: string;
    subtitle: string;
    uploadDocument: string;
    uploadDocuments: string;
    uploadDescription: string;
    dragAndDrop: string;
    supportedFormats: string;
    browseFiles: string;
    searchDocuments: string;
    noDocumentsFound: string;
    uploadFirst: string;
    fileName: string;
    fileSize: string;
    uploadedBy: string;
    category: string;
    categoryFinance: string;
    categoryMaintenance: string;
    categoryGovernance: string;
    categoryLegal: string;
    typeReport: string;
    typeContract: string;
    typeInvoice: string;
    typeMeetingMinutes: string;
    typeOther: string;
    categoryGeneral: string;
    description: string;
    tags: string;
    property: string;
    files: string;
    upload: string;
    allTypes: string;
    allCategories: string;
    allBuildings: string;
    totalDocuments: string;
    addedThisMonth: string;
    totalStorage: string;
    importFromEmail: string;
    newestFirst: string;
    oldestFirst: string;
    nameAZ: string;
    nameZA: string;
    allTime: string;
    last30Days: string;
    last90Days: string;
    thisYear: string;
    sortBy: string;
    dateRange: string;
    noMatchFilters: string;
    used: string;
  };
  
  // Law 16 Compliance
  law16: {
    title: string;
    subtitle: string;
    overallCompliance: string;
    alerts: string;
    requiresAttention: string;
    goodCompliance: string;
    needsAttention: string;
    maintenanceLogbook: string;
    maintenanceLogbookDesc: string;
    contingencyFund: string;
    contingencyFundDesc: string;
    salesCertificates: string;
    salesCertificatesDesc: string;
    commonSystems: string;
    commonSystemsDesc: string;
    ownerResponsibilities: string;
    ownerResponsibilitiesDesc: string;
    entriesCount: string;
    lastUpdated: string;
  };
  
  // Meetings
  meetings: {
    title: string;
    subtitle: string;
    scheduleMeeting: string;
    typeBoard: string;
    typeGeneral: string;
    typeCommittee: string;
    typeEmergency: string;
    statusScheduled: string;
    statusInProgress: string;
    statusCompleted: string;
    statusCancelled: string;
    allMeetings: string;
    date: string;
    duration: string;
    location: string;
    virtual: string;
    inPerson: string;
    attendees: string;
    organizer: string;
    agenda: string;
    minutes: string;
    hasAgenda: string;
    hasMinutes: string;
    noMeetings: string;
  };
  
  // Voting
  voting: {
    title: string;
    subtitle: string;
    createVote: string;
    activeVotes: string;
    pastVotes: string;
    typeSimple: string;
    typeMajority: string;
    typeUnanimous: string;
    statusActive: string;
    statusPassed: string;
    statusFailed: string;
    votesFor: string;
    votesAgainst: string;
    votesAbstain: string;
    totalVoters: string;
    requiredThreshold: string;
    hasVoted: string;
    notVoted: string;
    yourVote: string;
    voteFor: string;
    voteAgainst: string;
    abstain: string;
    endDate: string;
    daysRemaining: string;
    votingClosed: string;
  };
  
  // Residents
  residents: {
    title: string;
    subtitle: string;
    addResident: string;
    searchResidents: string;
    noResidentsFound: string;
    typeOwner: string;
    typeTenant: string;
    typeBoardMember: string;
    statusActive: string;
    statusInactive: string;
    name: string;
    email: string;
    phone: string;
    unit: string;
    moveInDate: string;
    boardPosition: string;
    pendingIssues: string;
    outstandingBalance: string;
    contactInfo: string;
  };
  
  // Forms
  forms: {
    required: string;
    optional: string;
    selectOption: string;
    enterValue: string;
    selectDate: string;
    selectTime: string;
    addAttachment: string;
    removeAttachment: string;
  };
  
  // Time & Date
  time: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    weeksAgo: string;
    monthsAgo: string;
    yearsAgo: string;
    minutes: string;
    hours: string;
    days: string;
    months: string;
    weeks: string;
    years: string;
  };
  
  // Messages & Alerts
  messages: {
    saved: string;
    deleted: string;
    updated: string;
    created: string;
    error: string;
    success: string;
    warning: string;
    confirmDelete: string;
    unsavedChanges: string;
    noData: string;
  };

  // AI Assistant
  ai: {
    title: string;
    online: string;
    offline: string;
    askAnything: string;
    poweredBy: string;
    pressEnter: string;
    greeting: string;
  };

  // Calendar & Events
  calendar: {
    eventType: string;
    typeMeeting: string;
    typeMaintenance: string;
    typeVotingDeadline: string;
    typePaymentDue: string;
    typeInspection: string;
    typeOther: string;
    virtualEvent: string;
  };

  // Property Form
  propertyForm: {
    title: string;
    editTitle: string;
    propertyName: string;
    streetAddress: string;
    city: string;
    province: string;
    postalCode: string;
    buildingType: string;
    yearBuilt: string;
    totalUnits: string;
    occupiedUnits: string;
    monthlyFee: string;
    description: string;
    typeResidential: string;
    typeCommercial: string;
    typeMixed: string;
    addProperty: string;
    updateProperty: string;
    errorNameRequired: string;
    errorAddressRequired: string;
    errorCityRequired: string;
    errorPostalRequired: string;
    errorUnitsInvalid: string;
    errorOccupancyInvalid: string;
    errorFeeInvalid: string;
  };

  // Issue Form
  issueForm: {
    title: string;
    issueTitle: string;
    titlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    issueType: string;
    priority: string;
    building: string;
    buildingPlaceholder: string;
    unitNumber: string;
    unitPlaceholder: string;
    markUrgent: string;
    urgentDescription: string;
    submitIssue: string;
    typeWater: string;
    typeHeating: string;
    typeElectric: string;
    typeNoise: string;
    typeEmergency: string;
    typeOther: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    priorityCritical: string;
    errorTitleRequired: string;
    errorDescriptionRequired: string;
    errorBuildingRequired: string;
  };

  // Maintenance Form
  maintenanceForm: {
    title: string;
    taskTitle: string;
    titlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    taskType: string;
    priority: string;
    building: string;
    buildingPlaceholder: string;
    scheduledDate: string;
    recurrence: string;
    estimatedCost: string;
    assignTo: string;
    assignPlaceholder: string;
    scheduleTask: string;
    typeGeneral: string;
    typePlumbing: string;
    typeElectrical: string;
    typeHVAC: string;
    typeLandscaping: string;
    typeCleaning: string;
    typeInspection: string;
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;
    priorityUrgent: string;
    recurrenceOnce: string;
    recurrenceWeekly: string;
    recurrenceBiweekly: string;
    recurrenceMonthly: string;
    recurrenceQuarterly: string;
    recurrenceAnnually: string;
    errorTitleRequired: string;
    errorDescriptionRequired: string;
    errorBuildingRequired: string;
    errorCostNegative: string;
  };

  // Meeting Form
  meetingForm: {
    title: string;
    meetingTitle: string;
    titlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    meetingType: string;
    building: string;
    buildingAll: string;
    date: string;
    time: string;
    duration: string;
    maxAttendees: string;
    maxAttendeesPlaceholder: string;
    virtualMeeting: string;
    virtualDescription: string;
    location: string;
    locationPlaceholder: string;
    scheduleMeeting: string;
    typeBoard: string;
    typeGeneral: string;
    typeSpecial: string;
    typeCommittee: string;
    errorTitleRequired: string;
    errorLocationRequired: string;
  };

  // Resident Form
  residentForm: {
    title: string;
    fullName: string;
    namePlaceholder: string;
    emailAddress: string;
    emailPlaceholder: string;
    phoneNumber: string;
    phonePlaceholder: string;
    residentType: string;
    building: string;
    buildingPlaceholder: string;
    unitNumber: string;
    unitPlaceholder: string;
    moveInDate: string;
    selectDate: string;
    boardMember: string;
    boardMemberDescription: string;
    boardPosition: string;
    positionPlaceholder: string;
    addResident: string;
    typeOwner: string;
    typeTenant: string;
    typeBoardMember: string;
    positionPresident: string;
    positionVicePresident: string;
    positionTreasurer: string;
    positionSecretary: string;
    positionDirector: string;
    errorNameRequired: string;
    errorEmailRequired: string;
    errorEmailInvalid: string;
    errorBuildingRequired: string;
    errorUnitRequired: string;
    errorPositionRequired: string;
  };

  // Vote Form
  voteForm: {
    title: string;
    proposalTitle: string;
    titlePlaceholder: string;
    detailedDescription: string;
    descriptionPlaceholder: string;
    voteType: string;
    building: string;
    buildingAll: string;
    startDate: string;
    endDate: string;
    createProposal: string;
    typeSimple: string;
    typeMajority: string;
    typeUnanimous: string;
    requiredThreshold: string;
    votingGuidelines: string;
    guidelineOne: string;
    guidelineTwo: string;
    guidelineThree: string;
    guidelineFour: string;
    errorTitleRequired: string;
    errorDescriptionRequired: string;
    errorEndDateInvalid: string;
  };

  // Notifications
  notifications: {
    title: string;
    all: string;
    markAllRead: string;
    markRead: string;
    clearAll: string;
    noNotifications: string;
  };

  // Global Search
  search: {
    placeholder: string;
    emptyState: string;
    emptyStateHint: string;
    noResults: string;
    noResultsHint: string;
    navigate: string;
    select: string;
    results: string;
  };

  // AI & Automation
  ai: {
    activeWorkflows: string;
    totalExecutions: string;
    avgSuccessRate: string;
    aiTools: string;
    communication: string;
    automation: string;
    analysis: string;
    compliance: string;
    executions: string;
    successRate: string;
    lastRun: string;
    tools: string;
    triggers: string;
  };

  // Users & Permissions
  users: {
    title: string;
    subtitle: string;
    createUser: string;
    editUser: string;
    totalUsers: string;
    activeUsers: string;
    pendingUsers: string;
    roles: string;
    allUsers: string;
    roleOverview: string;
    permissions: string;
    searchUsers: string;
    user: string;
    role: string;
    access: string;
    status: string;
    lastLogin: string;
    users: string;
    permissionMatrix: string;
    permissionMatrixDescription: string;
    permissionMatrixPlaceholder: string;
    userFormDescription: string;
    name: string;
    email: string;
    phone: string;
    propertyAccess: string;
    allProperties: string;
  };

  // Settings
  settings: {
    title: string;
    subtitle: string;
    general: string;
    notifications: string;
    appearance: string;
    security: string;
    integrations: string;
    language: string;
    theme: string;
    timezone: string;
    emailNotifications: string;
    pushNotifications: string;
    smsNotifications: string;
    saveChanges: string;
  };

  // Calendar
  calendarPage: {
    title: string;
    subtitle: string;
    today: string;
    month: string;
    week: string;
    day: string;
    agenda: string;
    addEvent: string;
    noEvents: string;
  };

  // Analytics
  analytics: {
    title: string;
    subtitle: string;
    overview: string;
    occupancyRate: string;
    collectionRate: string;
    maintenanceRequests: string;
    residentSatisfaction: string;
    trend: string;
    upFromLastMonth: string;
    downFromLastMonth: string;
  };

  // Amenities
  amenities: {
    title: string;
    subtitle: string;
    addAmenity: string;
    searchAmenities: string;
    noAmenities: string;
    bookAmenity: string;
    available: string;
    booked: string;
    unavailable: string;
  };

  // Violations
  violations: {
    title: string;
    subtitle: string;
    recordViolation: string;
    searchViolations: string;
    noViolations: string;
    typeNoise: string;
    typeParking: string;
    typePets: string;
    typeOther: string;
    statusOpen: string;
    statusWarned: string;
    statusResolved: string;
  };

  // Billing & Payments
  billing: {
    title: string;
    subtitle: string;
    recordPayment: string;
    generateStatement: string;
    searchBills: string;
    noBills: string;
    paid: string;
    unpaid: string;
    overdue: string;
    amount: string;
    dueDate: string;
    paymentDate: string;
  };

  // Dashboard specific
  dashboardSpecific: {
    pendingVotes: string;
    viewAllVotes: string;
    documentsToApprove: string;
    reviewDocuments: string;
    financialApprovals: string;
    viewFinances: string;
    viewAllMeetings: string;
    upcomingMeetings: string;
    boardMeeting: string;
    annualGeneralMeeting: string;
    totalRevenue: string;
    thisMonth: string;
    totalExpenses: string;
    pendingInvoices: string;
    review: string;
    overduePayments: string;
    recentTransactions: string;
    viewAllTransactions: string;
    myUnit: string;
    unit: string;
    monthlyFees: string;
    paid: string;
    myIssues: string;
    viewIssues: string;
    voteNow: string;
    recentDocuments: string;
    viewAllDocuments: string;
    buildingAnnouncements: string;
    assignedTasks: string;
    viewTasks: string;
    completedTasks: string;
    urgent: string;
    viewUrgent: string;
    viewAllTasks: string;
    emergencyIssues: string;
    activeEmergencies: string;
    responseTime: string;
    hours: string;
    quickAccess: string;
    quickActions: string;
    recentIssues: string;
    propertiesMonitored: string;
    viewProperties: string;
    upcomingMaintenanceTasks: string;
    emergencyContacts: string;
    allClear: string;
  };

  // Community News
  communityNews: {
    title: string;
    createPost: string;
    postTitle: string;
    postMessage: string;
    category: string;
    categoryAnnouncement: string;
    categoryQuestion: string;
    categoryService: string;
    post: string;
    noPosts: string;
    enterTitle: string;
    enterMessage: string;
  };

  // Community Ads
  communityAds: {
    title: string;
    submitAd: string;
    requestAd: string;
    adTitle: string;
    adDescription: string;
    category: string;
    categoryService: string;
    categoryProduct: string;
    categoryEvent: string;
    startDate: string;
    endDate: string;
    submit: string;
    noAds: string;
    enterTitle: string;
    enterDescription: string;
  };
}

// English translations
export const en: Translations = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    create: 'Create',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
    select: 'Select',
    actions: 'Actions',
    overview: 'Overview',
    description: 'Description',
    name: 'Name',
    manage: 'Manage',
    revenue: 'Revenue',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    low: 'Low',
    occupied: 'occupied',
    contact: 'Contact',
    sendMessage: 'Send Message',
    editProfile: 'Edit Profile',
    viewProfile: 'View Profile',
    role: 'Role',
    totalResidents: 'Total Residents',
    owners: 'Owners',
    tenants: 'Tenants',
    emergencyContact: 'Emergency Contact',
    building: 'Building',
    unitNumber: 'Unit Number',
    leaseExpires: 'Lease Expires',
    issuesReported: 'Issues Reported',
    openIssues: 'open issues',
    meetingAttendance: 'Meeting Attendance',
    meetingsAttended: 'meetings attended',
    leaseAgreement: 'Lease Agreement',
    insuranceCertificate: 'Insurance Certificate',
    pdf: 'PDF',
    contactInfo: 'Contact Info',
    property: 'Property',
    activity: 'Activity',
    documents: 'Documents',
    moveInDate: 'Move-in Date',
    allRoles: 'All Roles',
    allBuildings: 'All Buildings',
    of: 'of',
    units: 'units',
  },
  nav: {
    dashboard: 'Dashboard',
    properties: 'Properties',
    finances: 'Finances',
    billingPayments: 'Billing & Payments',
    apApprovals: 'AP Approvals',
    issues: 'Issues',
    maintenance: 'Maintenance',
    serviceRequests: 'Service Requests',
    inspections: 'Inspections',
    documents: 'Documents',
    amenities: 'Amenities',
    violations: 'Rules & Violations',
    law16: 'Law 16',
    meetings: 'Meetings',
    voting: 'Voting',
    calendar: 'Calendar',
    residents: 'Residents',
    newsletter: 'Newsletter',
    help: 'Help',
    aiWorkflows: 'AI Workflows',
    analytics: 'Analytics',
    integrations: 'Integrations',
    users: 'Users',
    auditLogs: 'Audit Logs',
    settings: 'Settings',
    logout: 'Logout',
    collapse: 'Collapse',
  },
  auth: {
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signingIn: 'Signing in...',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    demoCredentials: 'Demo credentials pre-filled for testing',
    welcome: 'Welcome to Immolink Portal',
    welcomeBack: 'Welcome back!',
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: "Welcome back! Here's an overview of your properties.",
    buildings: 'Buildings',
    units: 'Units',
    issues: 'Issues',
    meetings: 'Meetings',
    aiInsights: 'AI Insights',
    recentActivity: 'Recent Activity',
    refreshInsights: 'Refresh Insights',
    viewAll: 'View All',
    noActivity: 'No recent activity',
    quickActions: 'Quick Actions',
  },
  properties: {
    title: 'Properties',
    subtitle: 'Manage your condominium buildings',
    createBuilding: 'Create Building',
    searchProperties: 'Search properties...',
    noPropertiesFound: 'No properties found',
    tryAdjusting: 'Try adjusting your search',
    getStarted: 'Get started by creating your first building',
    building: 'Building',
    units: 'units',
    occupancy: 'Occupancy',
    monthlyRevenue: 'Monthly Revenue',
    status: 'Status',
    statusActive: 'Active',
    statusMaintenance: 'Maintenance',
    statusInactive: 'Inactive',
    viewDetails: 'View Details',
    manageProperty: 'Manage Property',
    filterByStatus: 'Filter by status',
    allProperties: 'All Properties',
    adjustFilters: 'Try adjusting your search or filters',
    noPropertiesYet: 'No properties yet',
    propertyDetails: 'Property Details',
    totalUnits: 'Total Units',
    totalArea: 'Total Area',
    yearBuilt: 'Year Built',
    parkingSpaces: 'Parking Spaces',
    propertyManager: 'Property Manager',
    amenities: 'Amenities',
    unitsManagement: 'Units Management',
    unitsComingSoon: 'Unit management features coming soon',
    propertyFinancials: 'Property financial details coming soon',
    propertyMaintenance: 'Property maintenance schedule coming soon',
  },
  finances: {
    title: 'Finances',
    subtitle: 'Financial overview and reporting',
    totalRevenue: 'Total Revenue',
    totalExpenses: 'Total Expenses',
    netIncome: 'Net Income',
    financialSummary: 'Financial Summary',
    revenueVsExpenses: 'Revenue vs Expenses',
    exportReport: 'Export Report',
    bills: 'Bills',
    payments: 'Payments',
    reports: 'Reports',
    billsManagement: 'Bills Management',
    billsComingSoon: 'Bill tracking and payment management coming soon',
    paymentHistory: 'Payment history coming soon',
    detailedReports: 'Detailed reports coming soon',
    createBill: 'Create Bill',
  },
  issues: {
    title: 'Issues',
    subtitle: 'Track and manage property issues',
    reportIssue: 'Report Issue',
    searchIssues: 'Search issues...',
    noIssuesFound: 'No issues found',
    urgentIssues: 'Urgent Issues Require Immediate Attention',
    requiresAttention: 'These issues have been marked as urgent and should be addressed immediately',
    issueType: 'Issue Type',
    priority: 'Priority',
    status: 'Status',
    building: 'Building',
    unit: 'Unit',
    reportedBy: 'Reported By',
    createdAt: 'Created',
    typeWater: 'Water',
    typeElectrical: 'Electrical',
    typeHeating: 'Heating',
    typePlumbing: 'Plumbing',
    typeNoise: 'Noise',
    typeStructural: 'Structural',
    typeOther: 'Other',
    priorityCritical: 'Critical',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    statusOpen: 'Open',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    statusClosed: 'Closed',
    statusReopened: 'Reopened',
    allStatus: 'All Status',
    allIssues: 'All Issues',
    typeEmergency: 'Emergency',
    filterByType: 'Filter by type',
    filterByPriority: 'Filter by priority',
    filterByStatus: 'Filter by status',
    filterByBuilding: 'Filter by building',
    filterByAssigned: 'Filter by assigned',
    allBuildings: 'All Buildings',
    allAssignments: 'All Assignments',
    assigned: 'Assigned',
    unassigned: 'Unassigned',
    totalOpen: 'Total Open',
    criticalUrgent: 'Critical/Urgent',
    inProgress: 'In Progress',
    resolvedThisWeek: 'Resolved This Week',
    adjustFilters: 'Try adjusting your filters',
  },
  maintenance: {
    title: 'Maintenance',
    subtitle: 'Schedule and track maintenance tasks',
    newTask: 'New Task',
    importExcel: 'Import Excel',
    frequency: 'Frequency',
    dueDate: 'Due Date',
    overdue: 'Overdue',
    scheduled: 'Scheduled',
    pending: 'Pending',
    completed: 'Completed',
    asset: 'Asset',
    assignedTo: 'Assigned To',
  },
  documents: {
    title: 'Documents',
    subtitle: 'Manage property documents and files',
    uploadDocument: 'Upload Document',
    uploadDocuments: 'Upload Documents',
    uploadDescription: 'Add documents to your property management system',
    dragAndDrop: 'Drag and drop files here',
    supportedFormats: 'Supports PDF, Word, Excel, and images up to 10MB',
    browseFiles: 'Browse Files',
    searchDocuments: 'Search documents...',
    noDocumentsFound: 'No documents found',
    uploadFirst: 'Upload your first document to get started',
    fileName: 'File Name',
    fileSize: 'File Size',
    uploadedBy: 'Uploaded By',
    category: 'Category',
    categoryFinance: 'Finance',
    categoryMaintenance: 'Maintenance',
    categoryGovernance: 'Governance',
    categoryLegal: 'Legal',
    typeReport: 'Report',
    typeContract: 'Contract',
    typeInvoice: 'Invoice',
    typeMeetingMinutes: 'Meeting Minutes',
    typeOther: 'Other',
    categoryGeneral: 'General',
    description: 'Description',
    tags: 'Tags',
    property: 'Property',
    files: 'Files',
    upload: 'Upload',
    allTypes: 'All Types',
    allCategories: 'All Categories',
    allBuildings: 'All Buildings',
    totalDocuments: 'Total Documents',
    addedThisMonth: 'Added This Month',
    totalStorage: 'Total Storage',
    importFromEmail: 'Import from Email',
    newestFirst: 'Newest first',
    oldestFirst: 'Oldest first',
    nameAZ: 'Name A-Z',
    nameZA: 'Name Z-A',
    allTime: 'All Time',
    last30Days: 'Last 30 days',
    last90Days: 'Last 90 days',
    thisYear: 'This year',
    sortBy: 'Sort by',
    dateRange: 'Date Range',
    noMatchFilters: 'No documents match your filters',
    used: 'used',
  },
  law16: {
    title: 'Law 16 Compliance',
    subtitle: 'Quebec condominium law compliance tracking',
    overallCompliance: 'Overall Compliance Score',
    alerts: 'Alerts',
    requiresAttention: 'Requires attention',
    goodCompliance: 'Your properties are in good compliance with Law 16 requirements.',
    needsAttention: 'Some modules require attention to achieve full compliance.',
    maintenanceLogbook: 'Maintenance Logbook',
    maintenanceLogbookDesc: 'Track all maintenance work and repairs',
    contingencyFund: 'Contingency Fund',
    contingencyFundDesc: '5-year fund planning and studies',
    salesCertificates: 'Sales Certificates',
    salesCertificatesDesc: 'Property sales documentation',
    commonSystems: 'Common Systems',
    commonSystemsDesc: 'Shared building systems inventory',
    ownerResponsibilities: 'Owner Responsibilities',
    ownerResponsibilitiesDesc: 'Unit owner obligations and requirements',
    entriesCount: 'Entries',
    lastUpdated: 'Last Updated',
  },
  meetings: {
    title: 'Meetings',
    subtitle: 'Schedule and manage meetings',
    scheduleMeeting: 'Schedule Meeting',
    typeBoard: 'Board',
    typeGeneral: 'General',
    typeCommittee: 'Committee',
    typeEmergency: 'Emergency',
    statusScheduled: 'Scheduled',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    allMeetings: 'All Meetings',
    date: 'Date',
    duration: 'Duration',
    location: 'Location',
    virtual: 'Virtual',
    inPerson: 'In-Person',
    attendees: 'Attendees',
    organizer: 'Organizer',
    agenda: 'Agenda',
    minutes: 'Minutes',
    hasAgenda: 'Agenda Available',
    hasMinutes: 'Minutes Available',
    noMeetings: 'No meetings scheduled',
  },
  voting: {
    title: 'Voting',
    subtitle: 'Participate in property votes and decisions',
    createVote: 'Create Vote',
    activeVotes: 'Active Votes',
    pastVotes: 'Past Votes',
    typeSimple: 'Simple Majority',
    typeMajority: 'Absolute Majority',
    typeUnanimous: 'Unanimous',
    statusActive: 'Active',
    statusPassed: 'Passed',
    statusFailed: 'Failed',
    votesFor: 'For',
    votesAgainst: 'Against',
    votesAbstain: 'Abstain',
    totalVoters: 'Total Voters',
    requiredThreshold: 'Required',
    hasVoted: 'You voted',
    notVoted: 'Vote now',
    yourVote: 'Your Vote',
    voteFor: 'Vote For',
    voteAgainst: 'Vote Against',
    abstain: 'Abstain',
    endDate: 'Ends',
    daysRemaining: 'days remaining',
    votingClosed: 'Voting closed',
  },
  residents: {
    title: 'Residents',
    subtitle: 'Manage building residents and owners',
    addResident: 'Add Resident',
    searchResidents: 'Search residents...',
    noResidentsFound: 'No residents found',
    typeOwner: 'Owner',
    typeTenant: 'Tenant',
    typeBoardMember: 'Board Member',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    unit: 'Unit',
    moveInDate: 'Move-in Date',
    boardPosition: 'Board Position',
    pendingIssues: 'Pending Issues',
    outstandingBalance: 'Outstanding Balance',
    contactInfo: 'Contact Information',
  },
  forms: {
    required: 'Required',
    optional: 'Optional',
    selectOption: 'Select an option',
    enterValue: 'Enter value',
    selectDate: 'Select date',
    selectTime: 'Select time',
    addAttachment: 'Add Attachment',
    removeAttachment: 'Remove',
  },
  time: {
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
    monthsAgo: 'months ago',
    yearsAgo: 'years ago',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
  },
  messages: {
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
    created: 'Created successfully',
    error: 'An error occurred',
    success: 'Success',
    warning: 'Warning',
    confirmDelete: 'Are you sure you want to delete this?',
    unsavedChanges: 'You have unsaved changes',
    noData: 'No data available',
  },
  ai: {
    title: 'Immolink AI Assistant',
    online: 'Online',
    offline: 'Offline',
    askAnything: 'Ask me anything...',
    poweredBy: 'Powered by AI',
    pressEnter: 'Press Enter to send',
    greeting: 'Hello! I\'m your Immolink AI assistant. I can help you with property information, financial reports, maintenance scheduling, and more. How can I assist you today?',
  },
  calendar: {
    eventType: 'Event Type',
    typeMeeting: 'Meeting',
    typeMaintenance: 'Maintenance',
    typeVotingDeadline: 'Voting Deadline',
    typePaymentDue: 'Payment Due',
    typeInspection: 'Inspection',
    typeOther: 'Event',
    virtualEvent: 'Virtual Event',
  },
  propertyForm: {
    title: 'Add New Property',
    editTitle: 'Edit Property',
    propertyName: 'Property Name',
    streetAddress: 'Street Address',
    city: 'City',
    province: 'Province',
    postalCode: 'Postal Code',
    buildingType: 'Building Type',
    yearBuilt: 'Year Built',
    totalUnits: 'Total Units',
    occupiedUnits: 'Occupied Units',
    monthlyFee: 'Monthly Fee (CAD)',
    description: 'Description',
    typeResidential: 'Residential',
    typeCommercial: 'Commercial',
    typeMixed: 'Mixed Use',
    addProperty: 'Add Property',
    updateProperty: 'Update Property',
    errorNameRequired: 'Property name is required',
    errorAddressRequired: 'Address is required',
    errorCityRequired: 'City is required',
    errorPostalRequired: 'Postal code is required',
    errorUnitsInvalid: 'Total units must be greater than 0',
    errorOccupancyInvalid: 'Occupied units cannot exceed total units',
    errorFeeInvalid: 'Management fee cannot be negative',
  },
  issueForm: {
    title: 'Report New Issue',
    issueTitle: 'Issue Title',
    titlePlaceholder: 'e.g., Water leak in bathroom',
    description: 'Description',
    descriptionPlaceholder: 'Provide detailed description of the issue...',
    issueType: 'Issue Type',
    priority: 'Priority',
    building: 'Building',
    buildingPlaceholder: 'Select building',
    unitNumber: 'Unit Number (Optional)',
    unitPlaceholder: 'e.g., 305',
    markUrgent: 'Mark as Urgent',
    urgentDescription: 'Urgent issues require immediate attention',
    submitIssue: 'Submit Issue',
    typeWater: 'Water',
    typeHeating: 'Heating',
    typeElectric: 'Electric',
    typeNoise: 'Noise',
    typeEmergency: 'Emergency',
    typeOther: 'Other',
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    priorityCritical: 'Critical',
    errorTitleRequired: 'Title is required',
    errorDescriptionRequired: 'Description is required',
    errorBuildingRequired: 'Building is required',
  },
  maintenanceForm: {
    title: 'Schedule Maintenance Task',
    taskTitle: 'Task Title',
    titlePlaceholder: 'e.g., Replace HVAC filters',
    description: 'Description',
    descriptionPlaceholder: 'Provide detailed task description...',
    taskType: 'Task Type',
    priority: 'Priority',
    building: 'Building',
    buildingPlaceholder: 'Select building',
    scheduledDate: 'Scheduled Date',
    recurrence: 'Recurrence',
    estimatedCost: 'Estimated Cost (CAD)',
    assignTo: 'Assign To (Optional)',
    assignPlaceholder: 'Contractor or staff member name',
    scheduleTask: 'Schedule Task',
    typeGeneral: 'General',
    typePlumbing: 'Plumbing',
    typeElectrical: 'Electrical',
    typeHVAC: 'HVAC',
    typeLandscaping: 'Landscaping',
    typeCleaning: 'Cleaning',
    typeInspection: 'Inspection',
    priorityLow: 'Low',
    priorityMedium: 'Medium',
    priorityHigh: 'High',
    priorityUrgent: 'Urgent',
    recurrenceOnce: 'One-time',
    recurrenceWeekly: 'Weekly',
    recurrenceBiweekly: 'Bi-weekly',
    recurrenceMonthly: 'Monthly',
    recurrenceQuarterly: 'Quarterly',
    recurrenceAnnually: 'Annually',
    errorTitleRequired: 'Title is required',
    errorDescriptionRequired: 'Description is required',
    errorBuildingRequired: 'Building is required',
    errorCostNegative: 'Cost cannot be negative',
  },
  meetingForm: {
    title: 'Schedule New Meeting',
    meetingTitle: 'Meeting Title',
    titlePlaceholder: 'e.g., Monthly Board Meeting',
    description: 'Description (Optional)',
    descriptionPlaceholder: 'Provide meeting agenda or description...',
    meetingType: 'Meeting Type',
    building: 'Building (Optional)',
    buildingAll: 'All buildings',
    date: 'Date',
    time: 'Time',
    duration: 'Duration (minutes)',
    maxAttendees: 'Max Attendees (Optional)',
    maxAttendeesPlaceholder: 'Unlimited',
    virtualMeeting: 'Virtual Meeting',
    virtualDescription: 'Host meeting online via video conference',
    location: 'Location',
    locationPlaceholder: 'e.g., Community Room, Building A',
    scheduleMeeting: 'Schedule Meeting',
    typeBoard: 'Board Meeting',
    typeGeneral: 'General Assembly',
    typeSpecial: 'Special Meeting',
    typeCommittee: 'Committee',
    errorTitleRequired: 'Title is required',
    errorLocationRequired: 'Location is required for in-person meetings',
  },
  residentForm: {
    title: 'Add New Resident',
    fullName: 'Full Name',
    namePlaceholder: 'e.g., Marie Dubois',
    emailAddress: 'Email Address',
    emailPlaceholder: 'email@example.com',
    phoneNumber: 'Phone Number',
    phonePlaceholder: '+1 (514) 555-0123',
    residentType: 'Resident Type',
    building: 'Building',
    buildingPlaceholder: 'Select building',
    unitNumber: 'Unit Number',
    unitPlaceholder: 'e.g., 305',
    moveInDate: 'Move-in Date',
    selectDate: 'Select date',
    boardMember: 'Board Member',
    boardMemberDescription: 'This resident is a member of the board',
    boardPosition: 'Board Position',
    positionPlaceholder: 'Select position',
    addResident: 'Add Resident',
    typeOwner: 'Owner',
    typeTenant: 'Tenant',
    typeBoardMember: 'Board Member',
    positionPresident: 'President',
    positionVicePresident: 'Vice President',
    positionTreasurer: 'Treasurer',
    positionSecretary: 'Secretary',
    positionDirector: 'Director',
    errorNameRequired: 'Name is required',
    errorEmailRequired: 'Email is required',
    errorEmailInvalid: 'Invalid email format',
    errorBuildingRequired: 'Building is required',
    errorUnitRequired: 'Unit number is required',
    errorPositionRequired: 'Board position is required for board members',
  },
  voteForm: {
    title: 'Create Voting Proposal',
    proposalTitle: 'Proposal Title',
    titlePlaceholder: 'e.g., Approve New Landscaping Contract',
    detailedDescription: 'Detailed Description',
    descriptionPlaceholder: 'Provide full details of the proposal for voters to review...',
    voteType: 'Vote Type',
    building: 'Building (Optional)',
    buildingAll: 'All buildings',
    startDate: 'Start Date',
    endDate: 'End Date',
    createProposal: 'Create Proposal',
    typeSimple: 'Simple Majority (50%)',
    typeMajority: 'Absolute Majority (67%)',
    typeUnanimous: 'Unanimous (100%)',
    requiredThreshold: 'Required approval threshold',
    votingGuidelines: 'Voting Guidelines',
    guidelineOne: 'Ensure the description is clear and comprehensive',
    guidelineTwo: 'Allow sufficient time for residents to review and vote',
    guidelineThree: 'Required threshold is based on vote type selected',
    guidelineFour: 'All eligible residents will be notified when voting opens',
    errorTitleRequired: 'Title is required',
    errorDescriptionRequired: 'Description is required',
    errorEndDateInvalid: 'End date must be after start date',
  },
  time: {
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
    monthsAgo: 'months ago',
    yearsAgo: 'years ago',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    months: 'months',
    weeks: 'weeks',
    years: 'years',
  },
  messages: {
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    updated: 'Updated successfully',
    created: 'Created successfully',
    error: 'An error occurred',
    success: 'Success',
    warning: 'Warning',
    confirmDelete: 'Are you sure you want to delete this?',
    unsavedChanges: 'You have unsaved changes',
    noData: 'No data available',
  },
  notifications: {
    title: 'Notifications',
    all: 'All',
    markAllRead: 'Mark all as read',
    markRead: 'Mark as read',
    clearAll: 'Clear all',
    noNotifications: 'No notifications',
  },
  search: {
    placeholder: 'Search properties, issues, residents, documents...',
    emptyState: 'Start typing to search',
    emptyStateHint: 'Try searching for properties, issues, residents, or documents',
    noResults: 'No results found',
    noResultsHint: 'Try adjusting your search terms',
    navigate: 'Navigate',
    select: 'Select',
    results: 'results',
  },
  ai: {
    activeWorkflows: 'Active Workflows',
    totalExecutions: 'Total Executions',
    avgSuccessRate: 'Avg Success Rate',
    aiTools: 'AI Tools',
    communication: 'Communication',
    automation: 'Automation',
    analysis: 'Analysis',
    compliance: 'Compliance',
    executions: 'Executions',
    successRate: 'Success Rate',
    lastRun: 'Last Run',
    tools: 'Tools',
    triggers: 'Triggers',
  },
  users: {
    title: 'User Management',
    subtitle: 'Manage users, roles, and permissions',
    createUser: 'Create User',
    editUser: 'Edit User',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    pendingUsers: 'Pending Users',
    roles: 'Roles',
    allUsers: 'All Users',
    roleOverview: 'Role Overview',
    permissions: 'Permissions',
    searchUsers: 'Search users...',
    user: 'User',
    role: 'Role',
    access: 'Access',
    status: 'Status',
    lastLogin: 'Last Login',
    users: 'users',
    permissionMatrix: 'Permission Matrix',
    permissionMatrixDescription: 'View detailed permissions for each role',
    permissionMatrixPlaceholder: 'Permission matrix visualization coming soon',
    userFormDescription: 'Fill in the user details and assign appropriate access',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    propertyAccess: 'Property Access',
    allProperties: 'All Properties',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your preferences and account settings',
    general: 'General',
    notifications: 'Notifications',
    appearance: 'Appearance',
    security: 'Security',
    integrations: 'Integrations',
    language: 'Language',
    theme: 'Theme',
    timezone: 'Timezone',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    smsNotifications: 'SMS Notifications',
    saveChanges: 'Save Changes',
  },
  calendarPage: {
    title: 'Calendar',
    subtitle: 'View and manage events and schedules',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
    addEvent: 'Add Event',
    noEvents: 'No events scheduled',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Performance metrics and insights',
    overview: 'Overview',
    occupancyRate: 'Occupancy Rate',
    collectionRate: 'Collection Rate',
    maintenanceRequests: 'Maintenance Requests',
    residentSatisfaction: 'Resident Satisfaction',
    trend: 'Trend',
    upFromLastMonth: 'up from last month',
    downFromLastMonth: 'down from last month',
  },
  amenities: {
    title: 'Amenities',
    subtitle: 'Manage building amenities and bookings',
    addAmenity: 'Add Amenity',
    searchAmenities: 'Search amenities...',
    noAmenities: 'No amenities found',
    bookAmenity: 'Book Amenity',
    available: 'Available',
    booked: 'Booked',
    unavailable: 'Unavailable',
  },
  violations: {
    title: 'Rules & Violations',
    subtitle: 'Track and manage building rule violations',
    recordViolation: 'Record Violation',
    searchViolations: 'Search violations...',
    noViolations: 'No violations found',
    typeNoise: 'Noise',
    typeParking: 'Parking',
    typePets: 'Pets',
    typeOther: 'Other',
    statusOpen: 'Open',
    statusWarned: 'Warning Issued',
    statusResolved: 'Resolved',
  },
  billing: {
    title: 'Billing & Payments',
    subtitle: 'Manage bills and payment processing',
    recordPayment: 'Record Payment',
    generateStatement: 'Generate Statement',
    searchBills: 'Search bills...',
    noBills: 'No bills found',
    paid: 'Paid',
    unpaid: 'Unpaid',
    overdue: 'Overdue',
    amount: 'Amount',
    dueDate: 'Due Date',
    paymentDate: 'Payment Date',
  },
  dashboardSpecific: {
    pendingVotes: 'Pending Votes',
    viewAllVotes: 'View all votes',
    documentsToApprove: 'Documents to Approve',
    reviewDocuments: 'Review documents',
    financialApprovals: 'Financial Approvals',
    viewFinances: 'View finances',
    viewAllMeetings: 'View All Meetings',
    upcomingMeetings: 'Upcoming Meetings',
    boardMeeting: 'Board Meeting',
    annualGeneralMeeting: 'Annual General Meeting',
    totalRevenue: 'Total Revenue',
    thisMonth: 'This Month',
    totalExpenses: 'Total Expenses',
    pendingInvoices: 'Pending Invoices',
    review: 'Review',
    overduePayments: 'Overdue Payments',
    recentTransactions: 'Recent Transactions',
    viewAllTransactions: 'View All Transactions',
    myUnit: 'My Unit',
    unit: 'Unit',
    monthlyFees: 'Monthly Fees',
    paid: 'Paid',
    myIssues: 'My Issues',
    viewIssues: 'View issues',
    voteNow: 'Vote now',
    recentDocuments: 'Recent Documents',
    viewAllDocuments: 'View All Documents',
    buildingAnnouncements: 'Building Announcements',
    assignedTasks: 'Assigned Tasks',
    viewTasks: 'View tasks',
    completedTasks: 'Completed Tasks',
    urgent: 'Urgent',
    viewUrgent: 'View urgent',
    viewAllTasks: 'View All Tasks',
    emergencyIssues: 'Emergency Issues',
    activeEmergencies: 'Active Emergencies',
    responseTime: 'Response Time',
    hours: 'hours',
    quickAccess: 'Quick Access',
    quickActions: 'Quick Actions',
    recentIssues: 'Recent Issues',
    propertiesMonitored: 'Properties Monitored',
    viewProperties: 'View properties',
    upcomingMaintenanceTasks: 'Upcoming Maintenance Tasks',
    emergencyContacts: 'Emergency Contacts',
    allClear: 'All Clear',
  },
  communityNews: {
    title: 'Community News',
    createPost: 'Create Post',
    postTitle: 'Title',
    postMessage: 'Message',
    category: 'Category',
    categoryAnnouncement: 'Announcement',
    categoryQuestion: 'Question',
    categoryService: 'Service',
    post: 'Post',
    noPosts: 'No community posts yet',
    enterTitle: 'Enter post title...',
    enterMessage: 'Share your message with the community...',
  },
  communityAds: {
    title: 'Community Ads',
    submitAd: 'Submit Ad',
    requestAd: 'Request Ad',
    adTitle: 'Title',
    adDescription: 'Description',
    category: 'Category',
    categoryService: 'Service',
    categoryProduct: 'Product',
    categoryEvent: 'Event',
    startDate: 'Start Date',
    endDate: 'End Date',
    submit: 'Submit',
    noAds: 'No ads available yet',
    enterTitle: 'Enter ad title...',
    enterDescription: 'Describe your service, product, or event...',
  },
};

// French translations
export const fr: Translations = {
  common: {
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    export: 'Exporter',
    import: 'Importer',
    download: 'Télécharger',
    upload: 'Téléverser',
    create: 'Créer',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    submit: 'Soumettre',
    close: 'Fermer',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    all: 'Tous',
    none: 'Aucun',
    select: 'Sélectionner',
    actions: 'Actions',
    overview: 'Aperçu',
    description: 'Description',
    name: 'Nom',
    manage: 'Gérer',
    revenue: 'Revenu',
    excellent: 'Excellent',
    good: 'Bon',
    fair: 'Passable',
    low: 'Faible',
    occupied: 'occupés',
    contact: 'Contacter',
    sendMessage: 'Envoyer un message',
    editProfile: 'Modifier le profil',
    viewProfile: 'Voir le profil',
    role: 'Rôle',
    totalResidents: 'Total des résidents',
    owners: 'Propriétaires',
    tenants: 'Locataires',
    emergencyContact: 'Contact d\'urgence',
    building: 'Immeuble',
    unitNumber: 'Numéro d\'unité',
    leaseExpires: 'Fin du bail',
    issuesReported: 'Problèmes signalés',
    openIssues: 'problèmes ouverts',
    meetingAttendance: 'Présence aux réunions',
    meetingsAttended: 'réunions assistées',
    leaseAgreement: 'Bail',
    insuranceCertificate: 'Certificat d\'assurance',
    pdf: 'PDF',
    contactInfo: 'Infos de contact',
    property: 'Propriété',
    activity: 'Activité',
    documents: 'Documents',
    moveInDate: 'Date d\'emménagement',
    allRoles: 'Tous les rôles',
    allBuildings: 'Tous les immeubles',
    of: 'de',
    units: 'unités',
  },
  nav: {
    dashboard: 'Tableau de bord',
    properties: 'Propriétés',
    finances: 'Finances',
    billingPayments: 'Facturation et paiements',
    apApprovals: 'Approbations AP',
    issues: 'Problèmes',
    maintenance: 'Entretien',
    serviceRequests: 'Demandes de service',
    inspections: 'Inspections',
    documents: 'Documents',
    amenities: 'Commodités',
    violations: 'Règles et violations',
    law16: 'Loi 16',
    meetings: 'Réunions',
    voting: 'Votes',
    calendar: 'Calendrier',
    residents: 'Résidents',
    newsletter: 'Bulletin d\'information',
    help: 'Aide',
    aiWorkflows: 'Flux de travail IA',
    analytics: 'Analytique',
    integrations: 'Intégrations',
    users: 'Utilisateurs',
    auditLogs: 'Journaux d\'audit',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    collapse: 'Réduire',
  },
  auth: {
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
    signingIn: 'Connexion en cours...',
    email: 'Courriel',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublié?',
    demoCredentials: 'Identifiants de démonstration pré-remplis pour les tests',
    welcome: 'Bienvenue au portail Immolink',
    welcomeBack: 'Bon retour!',
  },
  dashboard: {
    title: 'Tableau de bord',
    subtitle: 'Bon retour! Voici un aperçu de vos propriétés.',
    buildings: 'Immeubles',
    units: 'Unités',
    issues: 'Problèmes',
    meetings: 'Réunions',
    aiInsights: 'Analyses IA',
    recentActivity: 'Activité récente',
    refreshInsights: 'Actualiser les analyses',
    viewAll: 'Voir tout',
    noActivity: 'Aucune activité récente',
    quickActions: 'Actions rapides',
  },
  properties: {
    title: 'Propriétés',
    subtitle: 'Gérez vos immeubles en copropriété',
    createBuilding: 'Créer un immeuble',
    searchProperties: 'Rechercher des propriétés...',
    noPropertiesFound: 'Aucune propriété trouvée',
    tryAdjusting: 'Essayez d\'ajuster votre recherche',
    getStarted: 'Commencez par créer votre premier immeuble',
    building: 'Immeuble',
    units: 'unités',
    occupancy: 'Occupation',
    monthlyRevenue: 'Revenus mensuels',
    status: 'Statut',
    statusActive: 'Actif',
    statusMaintenance: 'Entretien',
    statusInactive: 'Inactif',
    viewDetails: 'Voir les détails',
    manageProperty: 'Gérer la propriété',
    filterByStatus: 'Filtrer par statut',
    allProperties: 'Toutes les propriétés',
    adjustFilters: 'Essayez d\'ajuster votre recherche ou vos filtres',
    noPropertiesYet: 'Aucune propriété pour le moment',
    propertyDetails: 'Détails de la propriété',
    totalUnits: 'Unités totales',
    totalArea: 'Surface totale',
    yearBuilt: 'Année de construction',
    parkingSpaces: 'Places de stationnement',
    propertyManager: 'Gestionnaire immobilier',
    amenities: 'Commodités',
    unitsManagement: 'Gestion des unités',
    unitsComingSoon: 'Fonctionnalités de gestion des unités à venir',
    propertyFinancials: 'Détails financiers de la propriété à venir',
    propertyMaintenance: 'Calendrier d\'entretien de la propriété à venir',
  },
  finances: {
    title: 'Finances',
    subtitle: 'Aperçu financier et rapports',
    totalRevenue: 'Revenus totaux',
    totalExpenses: 'Dépenses totales',
    netIncome: 'Revenu net',
    financialSummary: 'Résumé financier',
    revenueVsExpenses: 'Revenus vs Dépenses',
    exportReport: 'Exporter le rapport',
    bills: 'Factures',
    payments: 'Paiements',
    reports: 'Rapports',
    billsManagement: 'Gestion des factures',
    billsComingSoon: 'Le suivi des factures et la gestion des paiements arrivent bientôt',
    paymentHistory: 'L\'historique des paiements arrive bientôt',
    detailedReports: 'Les rapports détaillés arrivent bientôt',
    createBill: 'Créer une facture',
  },
  issues: {
    title: 'Problèmes',
    subtitle: 'Suivre et gérer les problèmes de propriété',
    reportIssue: 'Signaler un problème',
    searchIssues: 'Rechercher des problèmes...',
    noIssuesFound: 'Aucun problème trouvé',
    urgentIssues: 'Problèmes urgents nécessitant une attention immédiate',
    requiresAttention: 'Ces problèmes ont été marqués comme urgents et doivent être traités immédiatement',
    issueType: 'Type de problème',
    priority: 'Priorité',
    status: 'Statut',
    building: 'Immeuble',
    unit: 'Unité',
    reportedBy: 'Signalé par',
    createdAt: 'Créé',
    typeWater: 'Eau',
    typeElectrical: 'Électricité',
    typeHeating: 'Chauffage',
    typePlumbing: 'Plomberie',
    typeNoise: 'Bruit',
    typeStructural: 'Structural',
    typeOther: 'Autre',
    priorityCritical: 'Critique',
    priorityHigh: 'Élevée',
    priorityMedium: 'Moyenne',
    priorityLow: 'Faible',
    statusOpen: 'Ouvert',
    statusInProgress: 'En cours',
    statusResolved: 'Résolu',
    statusClosed: 'Fermé',
    statusReopened: 'Réouvert',
    allStatus: 'Tous les statuts',
    allIssues: 'Tous les problèmes',
    typeEmergency: 'Urgence',
    filterByType: 'Filtrer par type',
    filterByPriority: 'Filtrer par priorité',
    filterByStatus: 'Filtrer par statut',
    filterByBuilding: 'Filtrer par immeuble',
    filterByAssigned: 'Filtrer par assignation',
    allBuildings: 'Tous les immeubles',
    allAssignments: 'Toutes les assignations',
    assigned: 'Assigné',
    unassigned: 'Non assigné',
    totalOpen: 'Total ouvert',
    criticalUrgent: 'Critique/Urgent',
    inProgress: 'En cours',
    resolvedThisWeek: 'Résolu cette semaine',
    adjustFilters: 'Essayez d\'ajuster vos filtres',
  },
  maintenance: {
    title: 'Entretien',
    subtitle: 'Planifier et suivre les tâches d\'entretien',
    newTask: 'Nouvelle tâche',
    importExcel: 'Importer Excel',
    frequency: 'Fréquence',
    dueDate: 'Date d\'échéance',
    overdue: 'En retard',
    scheduled: 'Planifié',
    pending: 'En attente',
    completed: 'Terminé',
    asset: 'Actif',
    assignedTo: 'Assigné à',
  },
  documents: {
    title: 'Documents',
    subtitle: 'Gérer les documents et fichiers de propriété',
    uploadDocument: 'Téléverser un document',
    searchDocuments: 'Rechercher des documents...',
    noDocumentsFound: 'Aucun document trouvé',
    uploadFirst: 'Téléversez votre premier document pour commencer',
    fileName: 'Nom du fichier',
    fileSize: 'Taille du fichier',
    uploadedBy: 'Téléversé par',
    category: 'Catégorie',
    categoryFinance: 'Finance',
    categoryMaintenance: 'Entretien',
    categoryGovernance: 'Gouvernance',
    categoryLegal: 'Juridique',
    typeReport: 'Rapport',
    typeContract: 'Contrat',
    typeInvoice: 'Facture',
    typeMeetingMinutes: 'Procès-verbal',
    typeOther: 'Autre',
    categoryGeneral: 'Général',
    uploadDocuments: 'Téléverser des documents',
    uploadDescription: 'Ajouter des documents à votre système de gestion immobilière',
    dragAndDrop: 'Glisser-déposer les fichiers ici',
    supportedFormats: 'Supporte PDF, Word, Excel et images jusqu\'à 10 Mo',
    browseFiles: 'Parcourir les fichiers',
    description: 'Description',
    tags: 'Étiquettes',
    property: 'Propriété',
    files: 'Fichiers',
    upload: 'Téléverser',
    allTypes: 'Tous les types',
    allCategories: 'Toutes les catégories',
    allBuildings: 'Tous les immeubles',
    totalDocuments: 'Documents totaux',
    addedThisMonth: 'Ajoutés ce mois',
    totalStorage: 'Stockage total',
    importFromEmail: 'Importer depuis un courriel',
    newestFirst: 'Plus récents',
    oldestFirst: 'Plus anciens',
    nameAZ: 'Nom A-Z',
    nameZA: 'Nom Z-A',
    allTime: 'Toute la période',
    last30Days: 'Derniers 30 jours',
    last90Days: 'Derniers 90 jours',
    thisYear: 'Cette année',
    sortBy: 'Trier par',
    dateRange: 'Période',
    noMatchFilters: 'Aucun document ne correspond à vos filtres',
    used: 'utilisé',
  },
  law16: {
    title: 'Conformité Loi 16',
    subtitle: 'Suivi de la conformité à la loi sur les condominiums du Québec',
    overallCompliance: 'Score de conformité global',
    alerts: 'Alertes',
    requiresAttention: 'Nécessite attention',
    goodCompliance: 'Vos propriétés sont en bonne conformité avec les exigences de la Loi 16.',
    needsAttention: 'Certains modules nécessitent une attention pour atteindre la conformité complète.',
    maintenanceLogbook: 'Carnet d\'entretien',
    maintenanceLogbookDesc: 'Suivi de tous les travaux d\'entretien et réparations',
    contingencyFund: 'Fonds de prévoyance',
    contingencyFundDesc: 'Planification et études du fonds sur 5 ans',
    salesCertificates: 'Certificats de vente',
    salesCertificatesDesc: 'Documentation des ventes de propriété',
    commonSystems: 'Systèmes communs',
    commonSystemsDesc: 'Inventaire des systèmes partagés du bâtiment',
    ownerResponsibilities: 'Responsabilités des propriétaires',
    ownerResponsibilitiesDesc: 'Obligations et exigences des propriétaires d\'unités',
    entriesCount: 'Entrées',
    lastUpdated: 'Dernière mise à jour',
  },
  meetings: {
    title: 'Réunions',
    subtitle: 'Planifier et gérer les réunions',
    scheduleMeeting: 'Planifier une réunion',
    typeBoard: 'Conseil',
    typeGeneral: 'Générale',
    typeCommittee: 'Comité',
    typeEmergency: 'Urgence',
    statusScheduled: 'Planifié',
    statusInProgress: 'En cours',
    statusCompleted: 'Terminé',
    statusCancelled: 'Annulé',
    allMeetings: 'Toutes les réunions',
    date: 'Date',
    duration: 'Durée',
    location: 'Emplacement',
    virtual: 'Virtuelle',
    inPerson: 'En personne',
    attendees: 'Participants',
    organizer: 'Organisateur',
    agenda: 'Ordre du jour',
    minutes: 'Procès-verbal',
    hasAgenda: 'Ordre du jour disponible',
    hasMinutes: 'Procès-verbal disponible',
    noMeetings: 'Aucune réunion planifiée',
  },
  voting: {
    title: 'Votes',
    subtitle: 'Participer aux votes et décisions de propriété',
    createVote: 'Créer un vote',
    activeVotes: 'Votes actifs',
    pastVotes: 'Votes passés',
    typeSimple: 'Majorité simple',
    typeMajority: 'Majorité absolue',
    typeUnanimous: 'Unanime',
    statusActive: 'Actif',
    statusPassed: 'Adopté',
    statusFailed: 'Rejeté',
    votesFor: 'Pour',
    votesAgainst: 'Contre',
    votesAbstain: 'Abstention',
    totalVoters: 'Votants totaux',
    requiredThreshold: 'Requis',
    hasVoted: 'Vous avez voté',
    notVoted: 'Voter maintenant',
    yourVote: 'Votre vote',
    voteFor: 'Voter pour',
    voteAgainst: 'Voter contre',
    abstain: 'S\'abstenir',
    endDate: 'Se termine',
    daysRemaining: 'jours restants',
    votingClosed: 'Vote terminé',
  },
  residents: {
    title: 'Résidents',
    subtitle: 'Gérer les résidents et propriétaires de l\'immeuble',
    addResident: 'Ajouter un résident',
    searchResidents: 'Rechercher des résidents...',
    noResidentsFound: 'Aucun résident trouvé',
    typeOwner: 'Propriétaire',
    typeTenant: 'Locataire',
    typeBoardMember: 'Membre du conseil',
    statusActive: 'Actif',
    statusInactive: 'Inactif',
    name: 'Nom',
    email: 'Courriel',
    phone: 'Téléphone',
    unit: 'Unité',
    moveInDate: 'Date d\'emménagement',
    boardPosition: 'Poste au conseil',
    pendingIssues: 'Problèmes en attente',
    outstandingBalance: 'Solde impayé',
    contactInfo: 'Coordonnées',
  },
  forms: {
    required: 'Requis',
    optional: 'Optionnel',
    selectOption: 'Sélectionner une option',
    enterValue: 'Entrer une valeur',
    selectDate: 'Sélectionner une date',
    selectTime: 'Sélectionner une heure',
    addAttachment: 'Ajouter une pièce jointe',
    removeAttachment: 'Retirer',
  },
  time: {
    justNow: 'À l\'instant',
    minutesAgo: 'minutes',
    hoursAgo: 'heures',
    daysAgo: 'jours',
    weeksAgo: 'semaines',
    monthsAgo: 'mois',
    yearsAgo: 'ans',
    minutes: 'minutes',
    hours: 'heures',
    days: 'jours',
  },
  messages: {
    saved: 'Enregistré avec succès',
    deleted: 'Supprimé avec succès',
    updated: 'Mis à jour avec succès',
    created: 'Créé avec succès',
    error: 'Une erreur s\'est produite',
    success: 'Succès',
    warning: 'Avertissement',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci?',
    unsavedChanges: 'Vous avez des modifications non enregistrées',
    noData: 'Aucune donnée disponible',
  },
  ai: {
    title: 'Assistant IA Immolink',
    online: 'En ligne',
    offline: 'Hors ligne',
    askAnything: 'Posez-moi une question...',
    poweredBy: 'Propulsé par IA',
    pressEnter: 'Appuyez sur Entrée pour envoyer',
    greeting: 'Bonjour! Je suis votre assistant IA Immolink. Je peux vous aider avec les informations sur les propriétés, les rapports financiers, la planification de l\'entretien, et plus encore. Comment puis-je vous aider aujourd\'hui?',
  },
  calendar: {
    eventType: 'Type d\'événement',
    typeMeeting: 'Réunion',
    typeMaintenance: 'Entretien',
    typeVotingDeadline: 'Date limite de vote',
    typePaymentDue: 'Paiement dû',
    typeInspection: 'Inspection',
    typeOther: 'Événement',
    virtualEvent: 'Événement virtuel',
  },
  propertyForm: {
    title: 'Ajouter une nouvelle propriété',
    editTitle: 'Modifier la propriété',
    propertyName: 'Nom de la propriété',
    streetAddress: 'Adresse',
    city: 'Ville',
    province: 'Province',
    postalCode: 'Code postal',
    buildingType: 'Type d\'immeuble',
    yearBuilt: 'Année de construction',
    totalUnits: 'Unités totales',
    occupiedUnits: 'Unités occupées',
    monthlyFee: 'Frais mensuels (CAD)',
    description: 'Description',
    typeResidential: 'Résidentiel',
    typeCommercial: 'Commercial',
    typeMixed: 'Mixte',
    addProperty: 'Ajouter une propriété',
    updateProperty: 'Mettre à jour la propriété',
    errorNameRequired: 'Le nom de la propriété est requis',
    errorAddressRequired: 'L\'adresse est requise',
    errorCityRequired: 'La ville est requise',
    errorPostalRequired: 'Le code postal est requis',
    errorUnitsInvalid: 'Le nombre total d\'unités doit être supérieur à 0',
    errorOccupancyInvalid: 'Les unités occupées ne peuvent pas dépasser le total',
    errorFeeInvalid: 'Les frais de gestion ne peuvent pas être négatifs',
  },
  issueForm: {
    title: 'Signaler un nouveau problème',
    issueTitle: 'Titre du problème',
    titlePlaceholder: 'ex., Fuite d\'eau dans la salle de bain',
    description: 'Description',
    descriptionPlaceholder: 'Fournir une description détaillée du problème...',
    issueType: 'Type de problème',
    priority: 'Priorité',
    building: 'Immeuble',
    buildingPlaceholder: 'Sélectionner un immeuble',
    unitNumber: 'Numéro d\'unité (optionnel)',
    unitPlaceholder: 'ex., 305',
    markUrgent: 'Marquer comme urgent',
    urgentDescription: 'Les problèmes urgents nécessitent une attention immédiate',
    submitIssue: 'Soumettre le problème',
    typeWater: 'Eau',
    typeHeating: 'Chauffage',
    typeElectric: 'Électricité',
    typeNoise: 'Bruit',
    typeEmergency: 'Urgence',
    typeOther: 'Autre',
    priorityLow: 'Faible',
    priorityMedium: 'Moyenne',
    priorityHigh: 'Élevée',
    priorityCritical: 'Critique',
    errorTitleRequired: 'Le titre est requis',
    errorDescriptionRequired: 'La description est requise',
    errorBuildingRequired: 'L\'immeuble est requis',
  },
  maintenanceForm: {
    title: 'Planifier une tâche d\'entretien',
    taskTitle: 'Titre de la tâche',
    titlePlaceholder: 'ex., Remplacer les filtres CVAC',
    description: 'Description',
    descriptionPlaceholder: 'Fournir une description détaillée de la tâche...',
    taskType: 'Type de tâche',
    priority: 'Priorité',
    building: 'Immeuble',
    buildingPlaceholder: 'Sélectionner un immeuble',
    scheduledDate: 'Date planifiée',
    recurrence: 'Récurrence',
    estimatedCost: 'Coût estimé (CAD)',
    assignTo: 'Assigner à (optionnel)',
    assignPlaceholder: 'Nom de l\'entrepreneur ou du personnel',
    scheduleTask: 'Planifier la tâche',
    typeGeneral: 'Général',
    typePlumbing: 'Plomberie',
    typeElectrical: 'Électricité',
    typeHVAC: 'CVAC',
    typeLandscaping: 'Aménagement paysager',
    typeCleaning: 'Nettoyage',
    typeInspection: 'Inspection',
    priorityLow: 'Faible',
    priorityMedium: 'Moyenne',
    priorityHigh: 'Élevée',
    priorityUrgent: 'Urgente',
    recurrenceOnce: 'Une fois',
    recurrenceWeekly: 'Hebdomadaire',
    recurrenceBiweekly: 'Aux deux semaines',
    recurrenceMonthly: 'Mensuelle',
    recurrenceQuarterly: 'Trimestrielle',
    recurrenceAnnually: 'Annuelle',
    errorTitleRequired: 'Le titre est requis',
    errorDescriptionRequired: 'La description est requise',
    errorBuildingRequired: 'L\'immeuble est requis',
    errorCostNegative: 'Le coût ne peut pas être négatif',
  },
  meetingForm: {
    title: 'Planifier une nouvelle réunion',
    meetingTitle: 'Titre de la réunion',
    titlePlaceholder: 'ex., Réunion mensuelle du conseil',
    description: 'Description (optionnel)',
    descriptionPlaceholder: 'Fournir l\'ordre du jour ou la description de la réunion...',
    meetingType: 'Type de réunion',
    building: 'Immeuble (optionnel)',
    buildingAll: 'Tous les immeubles',
    date: 'Date',
    time: 'Heure',
    duration: 'Durée (minutes)',
    maxAttendees: 'Nombre maximum de participants (optionnel)',
    maxAttendeesPlaceholder: 'Illimité',
    virtualMeeting: 'Réunion virtuelle',
    virtualDescription: 'Organiser la réunion en ligne par vidéoconférence',
    location: 'Emplacement',
    locationPlaceholder: 'ex., Salle communautaire, Immeuble A',
    scheduleMeeting: 'Planifier la réunion',
    typeBoard: 'Réunion du conseil',
    typeGeneral: 'Assemblée générale',
    typeSpecial: 'Réunion spéciale',
    typeCommittee: 'Comité',
    errorTitleRequired: 'Le titre est requis',
    errorLocationRequired: 'L\'emplacement est requis pour les réunions en personne',
  },
  residentForm: {
    title: 'Ajouter un nouveau résident',
    fullName: 'Nom complet',
    namePlaceholder: 'ex., Marie Dubois',
    emailAddress: 'Adresse courriel',
    emailPlaceholder: 'courriel@exemple.com',
    phoneNumber: 'Numéro de téléphone',
    phonePlaceholder: '+1 (514) 555-0123',
    residentType: 'Type de résident',
    building: 'Immeuble',
    buildingPlaceholder: 'Sélectionner un immeuble',
    unitNumber: 'Numéro d\'unité',
    unitPlaceholder: 'ex., 305',
    moveInDate: 'Date d\'emménagement',
    selectDate: 'Sélectionner une date',
    boardMember: 'Membre du conseil',
    boardMemberDescription: 'Ce résident est membre du conseil',
    boardPosition: 'Poste au conseil',
    positionPlaceholder: 'Sélectionner un poste',
    addResident: 'Ajouter un résident',
    typeOwner: 'Propriétaire',
    typeTenant: 'Locataire',
    typeBoardMember: 'Membre du conseil',
    positionPresident: 'Président',
    positionVicePresident: 'Vice-président',
    positionTreasurer: 'Trésorier',
    positionSecretary: 'Secrétaire',
    positionDirector: 'Directeur',
    errorNameRequired: 'Le nom est requis',
    errorEmailRequired: 'Le courriel est requis',
    errorEmailInvalid: 'Format de courriel invalide',
    errorBuildingRequired: 'L\'immeuble est requis',
    errorUnitRequired: 'Le numéro d\'unité est requis',
    errorPositionRequired: 'Le poste au conseil est requis pour les membres du conseil',
  },
  voteForm: {
    title: 'Créer une proposition de vote',
    proposalTitle: 'Titre de la proposition',
    titlePlaceholder: 'ex., Approuver un nouveau contrat d\'aménagement paysager',
    detailedDescription: 'Description détaillée',
    descriptionPlaceholder: 'Fournir tous les détails de la proposition pour examen par les votants...',
    voteType: 'Type de vote',
    building: 'Immeuble (optionnel)',
    buildingAll: 'Tous les immeubles',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    createProposal: 'Créer la proposition',
    typeSimple: 'Majorité simple (50%)',
    typeMajority: 'Majorité absolue (67%)',
    typeUnanimous: 'Unanime (100%)',
    requiredThreshold: 'Seuil d\'approbation requis',
    votingGuidelines: 'Directives de vote',
    guidelineOne: 'Assurez-vous que la description est claire et complète',
    guidelineTwo: 'Accordez suffisamment de temps aux résidents pour examiner et voter',
    guidelineThree: 'Le seuil requis est basé sur le type de vote sélectionné',
    guidelineFour: 'Tous les résidents éligibles seront avisés lorsque le vote ouvrira',
    errorTitleRequired: 'Le titre est requis',
    errorDescriptionRequired: 'La description est requise',
    errorEndDateInvalid: 'La date de fin doit être après la date de début',
  },
  time: {
    justNow: 'À l\'instant',
    minutesAgo: 'il y a quelques minutes',
    hoursAgo: 'il y a quelques heures',
    daysAgo: 'il y a quelques jours',
    weeksAgo: 'il y a quelques semaines',
    monthsAgo: 'il y a quelques mois',
    yearsAgo: 'il y a quelques années',
    minutes: 'minutes',
    hours: 'heures',
    days: 'jours',
    months: 'mois',
    weeks: 'semaines',
    years: 'années',
  },
  messages: {
    saved: 'Enregistré avec succès',
    deleted: 'Supprimé avec succès',
    updated: 'Mis à jour avec succès',
    created: 'Créé avec succès',
    error: 'Une erreur s\'est produite',
    success: 'Succès',
    warning: 'Avertissement',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci?',
    unsavedChanges: 'Vous avez des modifications non enregistrées',
    noData: 'Aucune donnée disponible',
  },
  notifications: {
    title: 'Notifications',
    all: 'Toutes',
    markAllRead: 'Tout marquer comme lu',
    markRead: 'Marquer comme lu',
    clearAll: 'Tout effacer',
    noNotifications: 'Aucune notification',
  },
  search: {
    placeholder: 'Rechercher des propriétés, problèmes, résidents, documents...',
    emptyState: 'Commencez à taper pour rechercher',
    emptyStateHint: 'Essayez de rechercher des propriétés, problèmes, résidents ou documents',
    noResults: 'Aucun résultat trouvé',
    noResultsHint: 'Essayez d\'ajuster vos termes de recherche',
    navigate: 'Naviguer',
    select: 'Sélectionner',
    results: 'résultats',
  },
  ai: {
    activeWorkflows: 'Flux de travail actifs',
    totalExecutions: 'Exécutions totales',
    avgSuccessRate: 'Taux de réussite moyen',
    aiTools: 'Outils IA',
    communication: 'Communication',
    automation: 'Automatisation',
    analysis: 'Analyse',
    compliance: 'Conformité',
    executions: 'Exécutions',
    successRate: 'Taux de réussite',
    lastRun: 'Dernière exécution',
    tools: 'Outils',
    triggers: 'Déclencheurs',
  },
  users: {
    title: 'Gestion des utilisateurs',
    subtitle: 'Gérer les utilisateurs, rôles et permissions',
    createUser: 'Créer un utilisateur',
    editUser: 'Modifier l\'utilisateur',
    totalUsers: 'Total des utilisateurs',
    activeUsers: 'Utilisateurs actifs',
    pendingUsers: 'Utilisateurs en attente',
    roles: 'Rôles',
    allUsers: 'Tous les utilisateurs',
    roleOverview: 'Aperçu des rôles',
    permissions: 'Permissions',
    searchUsers: 'Rechercher des utilisateurs...',
    user: 'Utilisateur',
    role: 'Rôle',
    access: 'Accès',
    status: 'Statut',
    lastLogin: 'Dernière connexion',
    users: 'utilisateurs',
    permissionMatrix: 'Matrice des permissions',
    permissionMatrixDescription: 'Voir les permissions détaillées pour chaque rôle',
    permissionMatrixPlaceholder: 'Visualisation de la matrice des permissions bientôt disponible',
    userFormDescription: 'Remplissez les détails de l\'utilisateur et attribuez l\'accès approprié',
    name: 'Nom',
    email: 'Courriel',
    phone: 'Téléphone',
    propertyAccess: 'Accès aux propriétés',
    allProperties: 'Toutes les propriétés',
  },
  settings: {
    title: 'Paramètres',
    subtitle: 'Gérez vos préférences et paramètres de compte',
    general: 'Général',
    notifications: 'Notifications',
    appearance: 'Apparence',
    security: 'Sécurité',
    integrations: 'Intégrations',
    language: 'Langue',
    theme: 'Thème',
    timezone: 'Fuseau horaire',
    emailNotifications: 'Notifications par courriel',
    pushNotifications: 'Notifications push',
    smsNotifications: 'Notifications SMS',
    saveChanges: 'Enregistrer les modifications',
  },
  calendarPage: {
    title: 'Calendrier',
    subtitle: 'Voir et gérer les événements et les horaires',
    today: 'Aujourd\'hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    addEvent: 'Ajouter un événement',
    noEvents: 'Aucun événement prévu',
  },
  analytics: {
    title: 'Analytique',
    subtitle: 'Métriques de performance et informations',
    overview: 'Aperçu',
    occupancyRate: 'Taux d\'occupation',
    collectionRate: 'Taux de recouvrement',
    maintenanceRequests: 'Demandes d\'entretien',
    residentSatisfaction: 'Satisfaction des résidents',
    trend: 'Tendance',
    upFromLastMonth: 'en hausse par rapport au mois dernier',
    downFromLastMonth: 'en baisse par rapport au mois dernier',
  },
  amenities: {
    title: 'Commodités',
    subtitle: 'Gérer les commodités et réservations de l\'immeuble',
    addAmenity: 'Ajouter une commodité',
    searchAmenities: 'Rechercher des commodités...',
    noAmenities: 'Aucune commodité trouvée',
    bookAmenity: 'Réserver une commodité',
    available: 'Disponible',
    booked: 'Réservé',
    unavailable: 'Indisponible',
  },
  violations: {
    title: 'Règles et violations',
    subtitle: 'Suivre et gérer les violations des règles de l\'immeuble',
    recordViolation: 'Enregistrer une violation',
    searchViolations: 'Rechercher des violations...',
    noViolations: 'Aucune violation trouvée',
    typeNoise: 'Bruit',
    typeParking: 'Stationnement',
    typePets: 'Animaux',
    typeOther: 'Autre',
    statusOpen: 'Ouvert',
    statusWarned: 'Avertissement émis',
    statusResolved: 'Résolu',
  },
  billing: {
    title: 'Facturation et paiements',
    subtitle: 'Gérer les factures et le traitement des paiements',
    recordPayment: 'Enregistrer un paiement',
    generateStatement: 'Générer un relevé',
    searchBills: 'Rechercher des factures...',
    noBills: 'Aucune facture trouvée',
    paid: 'Payé',
    unpaid: 'Impayé',
    overdue: 'En retard',
    amount: 'Montant',
    dueDate: 'Date d\'échéance',
    paymentDate: 'Date de paiement',
  },
  dashboardSpecific: {
    pendingVotes: 'Votes en attente',
    viewAllVotes: 'Voir tous les votes',
    documentsToApprove: 'Documents à approuver',
    reviewDocuments: 'Examiner les documents',
    financialApprovals: 'Approbations financières',
    viewFinances: 'Voir les finances',
    viewAllMeetings: 'Voir toutes les réunions',
    upcomingMeetings: 'Réunions à venir',
    boardMeeting: 'Réunion du conseil',
    annualGeneralMeeting: 'Assemblée générale annuelle',
    totalRevenue: 'Revenus totaux',
    thisMonth: 'Ce mois-ci',
    totalExpenses: 'Dépenses totales',
    pendingInvoices: 'Factures en attente',
    review: 'Examiner',
    overduePayments: 'Paiements en retard',
    recentTransactions: 'Transactions récentes',
    viewAllTransactions: 'Voir toutes les transactions',
    myUnit: 'Mon unité',
    unit: 'Unité',
    monthlyFees: 'Frais mensuels',
    paid: 'Payé',
    myIssues: 'Mes problèmes',
    viewIssues: 'Voir les problèmes',
    voteNow: 'Voter maintenant',
    recentDocuments: 'Documents récents',
    viewAllDocuments: 'Voir tous les documents',
    buildingAnnouncements: 'Annonces de l\'immeuble',
    assignedTasks: 'Tâches assignées',
    viewTasks: 'Voir les tâches',
    completedTasks: 'Tâches terminées',
    urgent: 'Urgent',
    viewUrgent: 'Voir urgent',
    viewAllTasks: 'Voir toutes les tâches',
    emergencyIssues: 'Problèmes d\'urgence',
    activeEmergencies: 'Urgences actives',
    responseTime: 'Temps de réponse',
    hours: 'heures',
    quickAccess: 'Accès rapide',
    quickActions: 'Actions rapides',
    recentIssues: 'Problèmes récents',
    propertiesMonitored: 'Propriétés surveillées',
    viewProperties: 'Voir les propriétés',
    upcomingMaintenanceTasks: 'Tâches d\'entretien à venir',
    emergencyContacts: 'Contacts d\'urgence',
    allClear: 'Tout est clair',
  },
  communityNews: {
    title: 'Nouvelles de la communauté',
    createPost: 'Créer une publication',
    postTitle: 'Titre',
    postMessage: 'Message',
    category: 'Catégorie',
    categoryAnnouncement: 'Annonce',
    categoryQuestion: 'Question',
    categoryService: 'Service',
    post: 'Publier',
    noPosts: 'Aucune publication communautaire pour le moment',
    enterTitle: 'Entrez le titre de la publication...',
    enterMessage: 'Partagez votre message avec la communauté...',
  },
  communityAds: {
    title: 'Publicités communautaires',
    submitAd: 'Soumettre une publicité',
    requestAd: 'Demander une publicité',
    adTitle: 'Titre',
    adDescription: 'Description',
    category: 'Catégorie',
    categoryService: 'Service',
    categoryProduct: 'Produit',
    categoryEvent: 'Événement',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    submit: 'Soumettre',
    noAds: 'Aucune publicité disponible pour le moment',
    enterTitle: 'Entrez le titre de la publicité...',
    enterDescription: 'Décrivez votre service, produit ou événement...',
  },
};

export const translations = { en, fr };

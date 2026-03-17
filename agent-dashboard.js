/**
 * Agent Dashboard - Enhanced
 * Navachetana Livelihoods Private Limited
 * Loaded after script.js — overrides initAgentDashboard
 */
(function () {
  'use strict';

  // =====================================================================
  // HELPERS
  // =====================================================================

  function formatINR(amount) {
    if (!amount) return '\u20B90';
    return '\u20B9' + Number(amount).toLocaleString('en-IN');
  }

  function loadChartJS() {
    return new Promise(function (resolve) {
      if (window.Chart) return resolve();
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
      s.onload = resolve;
      s.onerror = resolve; // don't block on failure
      document.head.appendChild(s);
    });
  }

  function loadLucide() {
    return new Promise(function (resolve) {
      if (window.lucide) return resolve();
      var s = document.createElement('script');
      s.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.js';
      s.onload = resolve;
      s.onerror = resolve;
      document.head.appendChild(s);
    });
  }

  function refreshIcons() {
    if (window.lucide) {
      try { lucide.createIcons(); } catch (_) { /* noop */ }
    }
  }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function escHTML(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function getInitials(name) {
    if (!name) return 'A';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }

  function monthNames(count) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var now = new Date();
    var result = [];
    for (var i = count - 1; i >= 0; i--) {
      var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push(months[d.getMonth()]);
    }
    return result;
  }

  function maskAadhaar(a) {
    if (!a) return '-';
    var digits = a.replace(/\D/g, '');
    if (digits.length < 4) return a;
    return 'XXXX XXXX ' + digits.slice(-4);
  }

  function formatDate(isoStr) {
    if (!isoStr) return '-';
    var d = new Date(isoStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // =====================================================================
  // MOCK DATA GENERATOR
  // =====================================================================

  var MOCK_CUSTOMERS = generateMockCustomers();

  function generateMockCustomers() {
    var firstNames = ['Lakshmi', 'Rajesh', 'Manjunath', 'Suma', 'Kavitha', 'Ramesh', 'Anitha', 'Suresh', 'Geetha', 'Venkatesh', 'Savitha', 'Mahesh', 'Pushpa', 'Nagaraj', 'Rekha', 'Basavaraj', 'Shobha', 'Srinivas', 'Bhagyalakshmi', 'Ravi', 'Padma', 'Ganesh', 'Roopa', 'Prakash', 'Latha', 'Siddaraju', 'Prema', 'Girish', 'Asha', 'Mahadeva', 'Susheela', 'Harish', 'Jayamma', 'Kiran', 'Nandini', 'Chandrashekar', 'Vani', 'Deepak', 'Saraswathi', 'Naveen', 'Meera', 'Yogesh', 'Parvathi', 'Arun', 'Sunitha'];
    var lastNames = ['Devi', 'Kumar', 'S', 'B', 'M', 'Gowda', 'N', 'R', 'Patil', 'Shetty', 'Naik', 'Hegde', 'Reddy', 'Nayak', 'Rao'];
    var districts = ['Bengaluru Urban', 'Mysuru', 'Tumkur', 'Hassan', 'Mandya', 'Shimoga', 'Dharwad', 'Belgaum', 'Davangere', 'Chitradurga'];
    var branches = ['Jayanagar', 'Vijayanagar', 'Mysuru Main', 'Tumkur Central', 'Hassan Branch', 'Mandya Town', 'Shimoga City'];
    var loanTypes = ['Group Loan', 'Individual Loan', 'Emergency Loan', 'Agri Loan', 'Business Loan', 'Education Loan'];
    var amounts = [15000, 20000, 25000, 30000, 40000, 50000, 60000, 75000, 100000];
    var empTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Farmer'];
    var incomes = [15000, 20000, 25000, 30000, 35000, 40000];
    var notesList = ['Regular customer, good repayment history', 'First-time applicant, needs guidance', 'Referred by existing member Geetha N', 'Joint liability group leader'];

    return Array.from({ length: 45 }, function (_, i) {
      var firstName = firstNames[i];
      var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      var name = firstName + ' ' + lastName;
      var rand = Math.random();
      var status;
      if (rand < 0.25) status = 'submitted';
      else if (rand < 0.55) status = 'processing';
      else if (rand < 0.85) status = 'approved';
      else status = 'rejected';

      var amount = amounts[Math.floor(Math.random() * amounts.length)];
      var district = districts[Math.floor(Math.random() * districts.length)];
      var branch = branches[Math.floor(Math.random() * branches.length)];
      var loanType = loanTypes[Math.floor(Math.random() * loanTypes.length)];
      var daysAgo = Math.floor(Math.random() * 180);
      var date = new Date();
      date.setDate(date.getDate() - daysAgo);

      return {
        customer_id: 'CUS-2026-' + String(10001 + i),
        customer_name: name,
        phone: '+91 ' + String(7000000000 + Math.floor(Math.random() * 3000000000)),
        email: firstName.toLowerCase() + '@email.com',
        aadhaar: String(Math.floor(Math.random() * 900000000000) + 100000000000),
        pan: 'ABCDE' + String(1000 + Math.floor(Math.random() * 9000)) + 'F',
        address: Math.floor(Math.random() * 500 + 1) + ', Main Road, ' + district + ', Karnataka',
        loan_amount: amount,
        loan_purpose: loanType,
        employment_type: empTypes[Math.floor(Math.random() * empTypes.length)],
        monthly_income: incomes[Math.floor(Math.random() * incomes.length)],
        notes: Math.random() > 0.6 ? notesList[Math.floor(Math.random() * notesList.length)] : null,
        status: status,
        created_at: date.toISOString(),
        district: district,
        branch: branch
      };
    });
  }

  // =====================================================================
  // STATUS HELPERS
  // =====================================================================

  var STATUS_MAP = {
    submitted: { bg: '#dbeafe', color: '#2563eb', label: 'Submitted', icon: 'file-text' },
    processing: { bg: '#fef3c7', color: '#d97706', label: 'Processing', icon: 'clock' },
    approved: { bg: '#d1fae5', color: '#059669', label: 'Approved', icon: 'check-circle' },
    rejected: { bg: '#fef2f2', color: '#dc2626', label: 'Rejected', icon: 'x-circle' }
  };

  var STATUS_MAP_DARK = {
    submitted: { bg: '#1e3a5f', color: '#60a5fa', label: 'Submitted', icon: 'file-text' },
    processing: { bg: '#422006', color: '#fbbf24', label: 'Processing', icon: 'clock' },
    approved: { bg: '#064e3b', color: '#34d399', label: 'Approved', icon: 'check-circle' },
    rejected: { bg: '#450a0a', color: '#f87171', label: 'Rejected', icon: 'x-circle' }
  };

  function getStatusInfo(status) {
    var isDark = $('#agentDashboardPage') && $('#agentDashboardPage').classList.contains('ad-dark');
    var map = isDark ? STATUS_MAP_DARK : STATUS_MAP;
    return map[status] || map.submitted;
  }

  // =====================================================================
  // AGENT DASHBOARD CLASS
  // =====================================================================

  function AgentDashboard(agent) {
    this.agent = agent;
    this.customers = [];
    this.filteredCustomers = [];
    this.currentPage = 1;
    this.perPage = 8;
    this.currentTab = 'dashboard';
    this.isDark = false;
    this.charts = {};
    this.dashboardPage = $('#agentDashboardPage');
    this.sidebarOpen = false;
    this.detailViewActive = false;
  }

  // ----- INIT -----
  AgentDashboard.prototype.init = async function () {
    var self = this;

    // Build enhanced dashboard structure FIRST (before CDN loads)
    this.buildDashboardHTML();

    // Populate topbar
    this.populateTopbar();

    // Init dark mode
    this.initDarkMode();

    // Init sidebar nav
    this.initSidebarNav();

    // Init mobile menu
    this.initMobileMenu();

    // Init dashboard tab (static content)
    this.initDashboardTab();

    // Init add customer form
    this.initAddCustomerForm();

    // Init profile tab
    this.initProfileTab();

    // Restore active tab
    var savedTab = sessionStorage.getItem('navAgentTab');
    if (savedTab) {
      this.switchTab(savedTab, true);
    }

    // Load external deps in parallel (non-blocking for initial render)
    await Promise.all([loadLucide(), loadChartJS()]);

    // Now render charts and icons that need the CDN libs
    this.renderLoanChart();
    this.renderWeeklyChart();
    refreshIcons();

    // Load customers (Supabase or mock)
    await this.loadCustomers();
  };

  // ----- BUILD ENHANCED HTML -----
  AgentDashboard.prototype.buildDashboardHTML = function () {
    var page = this.dashboardPage;
    if (!page) return;

    var agent = this.agent;
    var initial = getInitials(agent.name);

    page.innerHTML = '';
    page.innerHTML = '<div class="ad-layout">' +
      // Sidebar overlay for mobile
      '<div class="ad-sidebar-overlay" id="adSidebarOverlay"></div>' +
      // Sidebar
      '<aside class="ad-sidebar" id="adSidebar">' +
        '<div class="ad-sidebar-brand">' +
          '<div class="ad-brand-icon">N</div>' +
          '<span class="ad-brand-text">Navachetana</span>' +
        '</div>' +
        '<nav class="ad-sidebar-nav">' +
          '<button class="ad-nav-item active" data-tab="dashboard"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></button>' +
          '<button class="ad-nav-item" data-tab="add-customer"><i data-lucide="user-plus"></i><span>Add Customer</span></button>' +
          '<button class="ad-nav-item" data-tab="customers"><i data-lucide="users"></i><span>My Customers</span></button>' +
          '<button class="ad-nav-item" data-tab="profile"><i data-lucide="user-cog"></i><span>My Profile</span></button>' +
        '</nav>' +
        '<div class="ad-sidebar-footer">' +
          '<button class="ad-dark-toggle" id="adDarkToggle"><i data-lucide="moon"></i><span>Dark Mode</span></button>' +
          '<button class="ad-logout-btn" id="adLogoutBtn"><i data-lucide="log-out"></i><span>Logout</span></button>' +
        '</div>' +
      '</aside>' +
      // Main content
      '<main class="ad-main">' +
        // Topbar
        '<header class="ad-topbar">' +
          '<button class="ad-menu-toggle" id="adMenuToggle"><i data-lucide="menu"></i></button>' +
          '<h1 class="ad-topbar-title">Dashboard</h1>' +
          '<div class="ad-topbar-right">' +
            '<div class="ad-topbar-user">' +
              '<span class="ad-topbar-name" id="adTopbarName">' + escHTML(agent.name || 'Agent') + '</span>' +
              '<div class="ad-avatar" id="adTopbarAvatar">' + escHTML(initial) + '</div>' +
            '</div>' +
          '</div>' +
        '</header>' +
        // Tab content area
        '<div class="ad-content">' +
          '<div class="ad-tab active" id="ad-tab-dashboard"></div>' +
          '<div class="ad-tab" id="ad-tab-add-customer"></div>' +
          '<div class="ad-tab" id="ad-tab-customers"></div>' +
          '<div class="ad-tab" id="ad-tab-profile"></div>' +
        '</div>' +
      '</main>' +
    '</div>';

    // Build add-customer tab with existing form structure
    this.buildAddCustomerTab();
  };

  // ----- BUILD ADD CUSTOMER TAB -----
  AgentDashboard.prototype.buildAddCustomerTab = function () {
    var tab = $('#ad-tab-add-customer', this.dashboardPage);
    if (!tab) return;

    tab.innerHTML =
      '<h2 class="ad-tab-heading"><i data-lucide="user-plus"></i> Add New Customer</h2>' +
      '<p class="ad-tab-subheading">Enter customer details for loan referral</p>' +
      '<form id="adAddCustomerForm" class="ad-form" novalidate>' +
        '<div class="ad-form-section">' +
          '<div class="ad-form-section-title"><i data-lucide="user"></i> Personal Information</div>' +
          '<div class="ad-form-grid">' +
            '<div class="ad-form-group" data-field="name">' +
              '<label for="ad_cf_name">Full Name <span class="ad-required">*</span></label>' +
              '<input type="text" id="ad_cf_name" placeholder="Customer full name" autocomplete="off">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="phone">' +
              '<label for="ad_cf_phone">Phone Number <span class="ad-required">*</span></label>' +
              '<input type="tel" id="ad_cf_phone" placeholder="+91 XXXXX XXXXX" autocomplete="off">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="email">' +
              '<label for="ad_cf_email">Email Address</label>' +
              '<input type="email" id="ad_cf_email" placeholder="customer@email.com" autocomplete="off">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group ad-full-width" data-field="address">' +
              '<label for="ad_cf_address">Address <span class="ad-required">*</span></label>' +
              '<textarea id="ad_cf_address" rows="2" placeholder="Complete address"></textarea>' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ad-form-section">' +
          '<div class="ad-form-section-title"><i data-lucide="shield"></i> Identity Documents</div>' +
          '<div class="ad-form-grid">' +
            '<div class="ad-form-group" data-field="aadhaar">' +
              '<label for="ad_cf_aadhaar">Aadhaar Number</label>' +
              '<input type="text" id="ad_cf_aadhaar" placeholder="XXXX XXXX XXXX" autocomplete="off" maxlength="14">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="pan">' +
              '<label for="ad_cf_pan">PAN Number</label>' +
              '<input type="text" id="ad_cf_pan" placeholder="ABCDE1234F" autocomplete="off" maxlength="10">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ad-form-section">' +
          '<div class="ad-form-section-title"><i data-lucide="indian-rupee"></i> Loan Details</div>' +
          '<div class="ad-form-grid">' +
            '<div class="ad-form-group" data-field="loan_amount">' +
              '<label for="ad_cf_loan_amount">Loan Amount (INR) <span class="ad-required">*</span></label>' +
              '<input type="number" id="ad_cf_loan_amount" placeholder="e.g. 50000">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="loan_purpose">' +
              '<label for="ad_cf_loan_purpose">Loan Purpose <span class="ad-required">*</span></label>' +
              '<select id="ad_cf_loan_purpose"><option value="">Select purpose</option>' +
                '<option value="Group Loan">Group Loan</option>' +
                '<option value="Individual Loan">Individual Loan</option>' +
                '<option value="Business Loan">Business Loan</option>' +
                '<option value="Education Loan">Education Loan</option>' +
                '<option value="Agri Loan">Agri Loan</option>' +
                '<option value="Emergency Loan">Emergency Loan</option>' +
                '<option value="Other">Other</option>' +
              '</select>' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="employment">' +
              '<label for="ad_cf_employment">Employment Type <span class="ad-required">*</span></label>' +
              '<select id="ad_cf_employment"><option value="">Select type</option>' +
                '<option value="Salaried">Salaried</option>' +
                '<option value="Self-Employed">Self-Employed</option>' +
                '<option value="Business Owner">Business Owner</option>' +
                '<option value="Farmer">Farmer</option>' +
                '<option value="Other">Other</option>' +
              '</select>' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="income">' +
              '<label for="ad_cf_income">Monthly Income (INR)</label>' +
              '<input type="number" id="ad_cf_income" placeholder="e.g. 30000">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ad-form-section">' +
          '<div class="ad-form-group ad-full-width" data-field="notes">' +
            '<label for="ad_cf_notes">Additional Notes</label>' +
            '<textarea id="ad_cf_notes" rows="3" placeholder="Any additional information..."></textarea>' +
          '</div>' +
        '</div>' +
        '<button type="submit" class="ad-submit-btn" id="adAddCustomerSubmitBtn">' +
          '<span class="ad-btn-text">Submit Customer</span>' +
          '<span class="ad-btn-spinner" style="display:none;"><svg class="ad-spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" dur="0.8s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/></circle></svg> Submitting...</span>' +
        '</button>' +
      '</form>' +
      // Success overlay
      '<div class="ad-success-overlay" id="adSuccessOverlay" style="display:none;">' +
        '<div class="ad-success-content">' +
          '<div class="ad-success-check"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25" fill="none" stroke="#059669" stroke-width="2"/><path fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="ad-check-path"/></svg></div>' +
          '<h3>Customer Added Successfully!</h3>' +
          '<p class="ad-success-id"></p>' +
        '</div>' +
      '</div>';
  };

  // ----- POPULATE TOPBAR -----
  AgentDashboard.prototype.populateTopbar = function () {
    var name = this.agent.name || 'Agent';
    var el = $('#adTopbarName', this.dashboardPage);
    if (el) el.textContent = name;
    var avatar = $('#adTopbarAvatar', this.dashboardPage);
    if (avatar) avatar.textContent = getInitials(name);
  };

  // ----- DARK MODE -----
  AgentDashboard.prototype.initDarkMode = function () {
    var self = this;
    var saved = localStorage.getItem('navAgentDarkMode');
    if (saved === 'true') {
      this.isDark = true;
      this.dashboardPage.classList.add('ad-dark');
    }
    this.updateDarkToggleIcon();

    var btn = $('#adDarkToggle', this.dashboardPage);
    if (btn) {
      btn.addEventListener('click', function () {
        self.toggleDarkMode();
      });
    }
  };

  AgentDashboard.prototype.toggleDarkMode = function () {
    this.isDark = !this.isDark;
    this.dashboardPage.classList.toggle('ad-dark', this.isDark);
    localStorage.setItem('navAgentDarkMode', this.isDark ? 'true' : 'false');
    this.updateDarkToggleIcon();
    this.recreateCharts();
  };

  AgentDashboard.prototype.updateDarkToggleIcon = function () {
    var btn = $('#adDarkToggle', this.dashboardPage);
    if (!btn) return;
    var iconName = this.isDark ? 'sun' : 'moon';
    btn.innerHTML = '<i data-lucide="' + iconName + '"></i><span>' + (this.isDark ? 'Light Mode' : 'Dark Mode') + '</span>';
    refreshIcons();
  };

  AgentDashboard.prototype.recreateCharts = function () {
    // Destroy existing charts
    if (this.charts.loan) { this.charts.loan.destroy(); this.charts.loan = null; }
    if (this.charts.weekly) { this.charts.weekly.destroy(); this.charts.weekly = null; }
    // Rebuild
    this.renderLoanChart();
    this.renderWeeklyChart();
  };

  // ----- SIDEBAR NAV -----
  AgentDashboard.prototype.initSidebarNav = function () {
    var self = this;
    var navItems = $$('.ad-nav-item', this.dashboardPage);

    navItems.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.dataset.tab;
        self.switchTab(tab);
        // Close mobile sidebar
        self.closeSidebar();
      });
    });

    // Logout
    var logoutBtn = $('#adLogoutBtn', this.dashboardPage);
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        self.logout();
      });
    }
  };

  // ----- TAB SWITCHING WITH ANIMATION -----
  AgentDashboard.prototype.switchTab = function (tabName, immediate) {
    var self = this;
    var page = this.dashboardPage;

    // Update nav items
    $$('.ad-nav-item', page).forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === tabName);
    });

    var titles = {
      'dashboard': 'Dashboard',
      'add-customer': 'Add Customer',
      'customers': 'My Customers',
      'profile': 'My Profile'
    };
    var topTitle = $('.ad-topbar-title', page);
    if (topTitle) topTitle.textContent = titles[tabName] || 'Dashboard';

    var oldTab = $('.ad-tab.active', page);
    var newTab = $('#ad-tab-' + tabName, page);

    if (!newTab) return;

    if (immediate || !oldTab || oldTab === newTab) {
      // No animation
      $$('.ad-tab', page).forEach(function (t) { t.classList.remove('active', 'fade-in', 'fade-out'); });
      newTab.classList.add('active');
      this.currentTab = tabName;
      sessionStorage.setItem('navAgentTab', tabName);
      this.onTabActivated(tabName);
      return;
    }

    // Animated transition
    oldTab.classList.add('fade-out');
    setTimeout(function () {
      $$('.ad-tab', page).forEach(function (t) { t.classList.remove('active', 'fade-out'); });
      newTab.classList.add('active', 'fade-in');
      self.currentTab = tabName;
      sessionStorage.setItem('navAgentTab', tabName);
      self.onTabActivated(tabName);

      setTimeout(function () {
        newTab.classList.remove('fade-in');
      }, 300);
    }, 150);
  };

  AgentDashboard.prototype.onTabActivated = function (tabName) {
    var self = this;
    // Show skeleton, then real content
    this.showSkeletons(tabName);
    setTimeout(function () {
      self.hideSkeletons(tabName);
      refreshIcons();
    }, 600);
  };

  // ----- MOBILE MENU -----
  AgentDashboard.prototype.initMobileMenu = function () {
    var self = this;
    var menuBtn = $('#adMenuToggle', this.dashboardPage);
    var overlay = $('#adSidebarOverlay', this.dashboardPage);

    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        self.toggleSidebar();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function () {
        self.closeSidebar();
      });
    }

    // Close sidebar on resize to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) {
        self.closeSidebar();
      }
    });
  };

  AgentDashboard.prototype.toggleSidebar = function () {
    this.sidebarOpen = !this.sidebarOpen;
    var sidebar = $('#adSidebar', this.dashboardPage);
    var overlay = $('#adSidebarOverlay', this.dashboardPage);
    if (sidebar) sidebar.classList.toggle('open', this.sidebarOpen);
    if (overlay) overlay.classList.toggle('open', this.sidebarOpen);
  };

  AgentDashboard.prototype.closeSidebar = function () {
    this.sidebarOpen = false;
    var sidebar = $('#adSidebar', this.dashboardPage);
    var overlay = $('#adSidebarOverlay', this.dashboardPage);
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  // ----- SKELETON LOADING -----
  AgentDashboard.prototype.showSkeletons = function (tabName) {
    var tab = $('#ad-tab-' + tabName, this.dashboardPage);
    if (!tab) return;

    // Only show on first load or if no children yet
    var existing = tab.querySelector('.ad-skeleton-wrap');
    if (existing) return;

    var skeleton = document.createElement('div');
    skeleton.className = 'ad-skeleton-wrap';

    if (tabName === 'dashboard') {
      skeleton.innerHTML =
        '<div class="ad-stats-grid">' +
          '<div class="ad-skeleton ad-skeleton-stat"></div>'.repeat(4) +
        '</div>' +
        '<div class="ad-skeleton ad-skeleton-chart"></div>' +
        '<div class="ad-skeleton ad-skeleton-row"></div>'.repeat(3);
    } else if (tabName === 'customers') {
      skeleton.innerHTML = '<div class="ad-skeleton ad-skeleton-row"></div>'.repeat(6);
    } else if (tabName === 'profile') {
      skeleton.innerHTML =
        '<div class="ad-skeleton ad-skeleton-banner"></div>' +
        '<div class="ad-skeleton ad-skeleton-field"></div>'.repeat(4);
    }

    // Hide real content
    Array.from(tab.children).forEach(function (c) {
      if (!c.classList.contains('ad-skeleton-wrap')) c.style.display = 'none';
    });
    tab.appendChild(skeleton);
  };

  AgentDashboard.prototype.hideSkeletons = function (tabName) {
    var tab = $('#ad-tab-' + tabName, this.dashboardPage);
    if (!tab) return;

    var skeletons = tab.querySelectorAll('.ad-skeleton-wrap');
    skeletons.forEach(function (s) { s.remove(); });

    Array.from(tab.children).forEach(function (c) {
      c.style.display = '';
    });
  };

  // =====================================================================
  // FEATURE 3: DASHBOARD TAB
  // =====================================================================

  AgentDashboard.prototype.initDashboardTab = function () {
    var tab = $('#ad-tab-dashboard', this.dashboardPage);
    if (!tab) return;
    var agent = this.agent;

    tab.innerHTML =
      // Welcome
      '<div class="ad-welcome">' +
        '<div class="ad-welcome-text">' +
          '<h2>Welcome back, <span class="ad-welcome-name">' + escHTML(agent.name || 'Agent') + '</span>!</h2>' +
          '<p>Manage your customers and track your referral progress.</p>' +
        '</div>' +
        '<div class="ad-welcome-icon"><i data-lucide="trending-up"></i></div>' +
      '</div>' +
      // Stats
      '<div class="ad-stats-grid">' +
        '<div class="ad-stat-card">' +
          '<div class="ad-stat-icon blue"><i data-lucide="clipboard-list"></i></div>' +
          '<div class="ad-stat-body"><div class="ad-stat-number" id="adStatTotal">0</div><div class="ad-stat-label">Total Customers</div></div>' +
        '</div>' +
        '<div class="ad-stat-card">' +
          '<div class="ad-stat-icon amber"><i data-lucide="clock"></i></div>' +
          '<div class="ad-stat-body"><div class="ad-stat-number" id="adStatProcessing">0</div><div class="ad-stat-label">Processing</div></div>' +
        '</div>' +
        '<div class="ad-stat-card">' +
          '<div class="ad-stat-icon green"><i data-lucide="check-circle"></i></div>' +
          '<div class="ad-stat-body"><div class="ad-stat-number" id="adStatApproved">0</div><div class="ad-stat-label">Approved</div></div>' +
        '</div>' +
        '<div class="ad-stat-card">' +
          '<div class="ad-stat-icon pink"><i data-lucide="indian-rupee"></i></div>' +
          '<div class="ad-stat-body"><div class="ad-stat-number" id="adStatAmount">\u20B90</div><div class="ad-stat-label">Total Loan Value</div></div>' +
        '</div>' +
      '</div>' +
      // Quick Actions
      '<div class="ad-quick-actions">' +
        '<button class="ad-quick-btn primary" data-action="add-customer"><i data-lucide="user-plus"></i> Add Customer</button>' +
        '<button class="ad-quick-btn secondary" data-action="customers"><i data-lucide="users"></i> View All Customers</button>' +
      '</div>' +
      // Charts row
      '<div class="ad-charts-row">' +
        '<div class="ad-card ad-chart-card">' +
          '<div class="ad-card-title"><i data-lucide="bar-chart-3"></i> Loan Applications <span>Last 6 Months</span></div>' +
          '<div class="ad-chart-wrap"><canvas id="adLoanChart"></canvas></div>' +
        '</div>' +
        '<div class="ad-card">' +
          '<div class="ad-card-title"><i data-lucide="wallet"></i> Commission Tracker <span>March 2026</span></div>' +
          '<div class="ad-commission-value">\u20B912,450</div>' +
          '<div class="ad-commission-target">of \u20B925,000 monthly target</div>' +
          '<div class="ad-progress-bar"><div class="ad-progress-fill" style="width:49.8%"></div></div>' +
          '<div class="ad-weekly-chart-wrap"><canvas id="adWeeklyChart"></canvas></div>' +
        '</div>' +
      '</div>' +
      // Activity Feed
      '<div class="ad-card">' +
        '<div class="ad-card-title"><i data-lucide="activity"></i> Recent Activity</div>' +
        '<div class="ad-activity-feed" id="adActivityFeed"></div>' +
      '</div>' +
      // Recent Customers
      '<div class="ad-card">' +
        '<div class="ad-card-title"><i data-lucide="users"></i> Recent Customers</div>' +
        '<div id="adRecentList"></div>' +
      '</div>';

    // Quick action event delegation
    var self = this;
    tab.addEventListener('click', function (e) {
      var btn = e.target.closest('.ad-quick-btn');
      if (btn) {
        var action = btn.dataset.action;
        if (action) self.switchTab(action);
      }
    });

    // Render activity feed
    this.renderActivityFeed();

    // Charts are rendered later in init() after CDN loads
    refreshIcons();
  };

  AgentDashboard.prototype.renderActivityFeed = function () {
    var feed = $('#adActivityFeed', this.dashboardPage);
    if (!feed) return;

    var activities = [
      { color: 'green', text: '<strong>Loan approved</strong> for Lakshmi Devi \u2014 \u20B950,000 Group Loan', time: '2 hours ago' },
      { color: 'blue', text: '<strong>New application</strong> from Rajesh Kumar submitted', time: '4 hours ago' },
      { color: 'amber', text: '<strong>Document pending</strong> for Manjunath S \u2014 Aadhaar copy needed', time: 'Yesterday' },
      { color: 'green', text: '<strong>Commission credited</strong> \u2014 \u20B92,350 for Week 3', time: 'Yesterday' },
      { color: 'red', text: '<strong>Application returned</strong> \u2014 Suma B, incomplete address proof', time: '2 days ago' },
      { color: 'blue', text: '<strong>New referral bonus</strong> \u2014 \u20B9500 for 5+ referrals this month', time: '3 days ago' }
    ];

    var iconMap = { green: 'check-circle', blue: 'plus-circle', amber: 'alert-circle', red: 'x-circle' };

    feed.innerHTML = activities.map(function (a) {
      return '<div class="ad-activity-item">' +
        '<div class="ad-activity-dot ' + a.color + '"><i data-lucide="' + (iconMap[a.color] || 'circle') + '"></i></div>' +
        '<div class="ad-activity-body">' +
          '<div class="ad-activity-text">' + a.text + '</div>' +
          '<div class="ad-activity-time">' + a.time + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    refreshIcons();
  };

  AgentDashboard.prototype.renderLoanChart = function () {
    var canvas = $('#adLoanChart', this.dashboardPage);
    if (!canvas || !window.Chart) return;

    var isDark = this.isDark;
    var gridColor = isDark ? '#334155' : '#e2e8f0';
    var textColor = isDark ? '#94a3b8' : '#64748b';

    this.charts.loan = new Chart(canvas, {
      type: 'line',
      data: {
        labels: monthNames(6),
        datasets: [{
          label: 'Applications',
          data: [12, 19, 8, 15, 22, 17],
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#0d9488',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: true }
        }
      }
    });
  };

  AgentDashboard.prototype.renderWeeklyChart = function () {
    var canvas = $('#adWeeklyChart', this.dashboardPage);
    if (!canvas || !window.Chart) return;

    var isDark = this.isDark;
    var gridColor = isDark ? '#334155' : '#e2e8f0';
    var textColor = isDark ? '#94a3b8' : '#64748b';

    this.charts.weekly = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Commission',
          data: [3200, 4100, 2800, 2350],
          backgroundColor: 'rgba(13, 148, 136, 0.7)',
          borderColor: '#0d9488',
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, callback: function (v) { return '\u20B9' + v; } }, beginAtZero: true }
        }
      }
    });
  };

  // ----- UPDATE STATS -----
  AgentDashboard.prototype.updateStats = function () {
    var list = this.customers;
    var total = list.length;
    var processing = list.filter(function (c) { return c.status === 'processing' || c.status === 'submitted'; }).length;
    var approved = list.filter(function (c) { return c.status === 'approved'; }).length;
    var totalAmount = list.reduce(function (sum, c) { return sum + (parseFloat(c.loan_amount) || 0); }, 0);

    var setTxt = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    setTxt('adStatTotal', total);
    setTxt('adStatProcessing', processing);
    setTxt('adStatApproved', approved);
    setTxt('adStatAmount', formatINR(totalAmount));

    // Also update existing elements in case original HTML is present
    setTxt('agentStatTotal', total);
    setTxt('agentStatProcessing', processing);
    setTxt('agentStatApproved', approved);

    var amountStr = totalAmount >= 100000 ? (totalAmount / 100000).toFixed(1) + 'L' : totalAmount.toLocaleString('en-IN');
    setTxt('agentStatAmount', amountStr);

    // Recent customers
    this.renderRecentCustomers();
  };

  AgentDashboard.prototype.renderRecentCustomers = function () {
    var el = $('#adRecentList', this.dashboardPage);
    if (!el) return;
    var list = this.customers;

    if (list.length === 0) {
      el.innerHTML =
        '<div class="ad-empty-state">' +
          '<div class="ad-empty-icon"><i data-lucide="user-plus"></i></div>' +
          '<div class="ad-empty-title">No customers yet</div>' +
          '<div class="ad-empty-subtitle">Add your first customer to get started</div>' +
        '</div>';
      refreshIcons();
      return;
    }

    el.innerHTML = list.slice(0, 5).map(function (c) {
      var st = getStatusInfo(c.status);
      return '<div class="ad-customer-row">' +
        '<div class="ad-customer-avatar">' + getInitials(c.customer_name) + '</div>' +
        '<div class="ad-customer-info">' +
          '<div class="ad-customer-name">' + escHTML(c.customer_name) + '</div>' +
          '<div class="ad-customer-meta">' + escHTML(c.customer_id) + ' \u00B7 ' + escHTML(c.loan_purpose || '-') + ' \u00B7 ' + formatINR(c.loan_amount) + '</div>' +
        '</div>' +
        '<span class="ad-status-badge" style="background:' + st.bg + ';color:' + st.color + ';">' + st.label + '</span>' +
      '</div>';
    }).join('');
  };

  // =====================================================================
  // FEATURE 4: CUSTOMERS TAB
  // =====================================================================

  AgentDashboard.prototype.renderCustomersTab = function () {
    var tab = $('#ad-tab-customers', this.dashboardPage);
    if (!tab) return;

    var self = this;

    tab.innerHTML =
      // List view
      '<div class="ad-customers-list-view" id="adCustomersListView">' +
        '<div class="ad-customers-header">' +
          '<h2 class="ad-tab-heading"><i data-lucide="users"></i> My Customers</h2>' +
          '<div class="ad-filter-row">' +
            '<div class="ad-search-wrap"><i data-lucide="search"></i><input type="text" id="adSearchCustomer" class="ad-search-input" placeholder="Search by name or ID..."></div>' +
            '<select id="adFilterStatus" class="ad-filter-select">' +
              '<option value="all">All Status</option>' +
              '<option value="submitted">Submitted</option>' +
              '<option value="processing">Processing</option>' +
              '<option value="approved">Approved</option>' +
              '<option value="rejected">Rejected</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        // Table header (desktop)
        '<div class="ad-table-header">' +
          '<div class="ad-th ad-th-customer">Customer</div>' +
          '<div class="ad-th ad-th-type">Loan Type</div>' +
          '<div class="ad-th ad-th-amount">Amount</div>' +
          '<div class="ad-th ad-th-status">Status</div>' +
          '<div class="ad-th ad-th-date">Date</div>' +
        '</div>' +
        '<div id="adCustomersListContent"></div>' +
        '<div class="ad-pagination" id="adPagination"></div>' +
      '</div>' +
      // Detail view
      '<div class="ad-customer-detail-view" id="adCustomerDetailView" style="display:none;"></div>';

    // Event listeners
    var searchInput = $('#adSearchCustomer', this.dashboardPage);
    var filterSelect = $('#adFilterStatus', this.dashboardPage);

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        self.currentPage = 1;
        self.filterAndRenderCustomers();
      });
    }
    if (filterSelect) {
      filterSelect.addEventListener('change', function () {
        self.currentPage = 1;
        self.filterAndRenderCustomers();
      });
    }

    // Event delegation for row clicks and pagination
    tab.addEventListener('click', function (e) {
      // Customer row
      var row = e.target.closest('.ad-customer-row-clickable');
      if (row && row.dataset.idx !== undefined) {
        var idx = parseInt(row.dataset.idx);
        var customer = self.filteredCustomers[idx];
        if (customer) self.showCustomerDetail(customer);
        return;
      }
      // Pagination
      var pageBtn = e.target.closest('.ad-page-btn');
      if (pageBtn && pageBtn.dataset.page) {
        self.currentPage = parseInt(pageBtn.dataset.page);
        self.renderCustomersList();
        return;
      }
      // Back button
      if (e.target.closest('.ad-back-btn')) {
        self.hideCustomerDetail();
        return;
      }
    });

    this.filterAndRenderCustomers();
    refreshIcons();
  };

  AgentDashboard.prototype.filterAndRenderCustomers = function () {
    var search = ($('#adSearchCustomer', this.dashboardPage) || {}).value || '';
    var status = ($('#adFilterStatus', this.dashboardPage) || {}).value || 'all';
    search = search.toLowerCase().trim();

    var list = this.customers;

    if (status !== 'all') {
      list = list.filter(function (c) { return c.status === status; });
    }
    if (search) {
      list = list.filter(function (c) {
        return c.customer_name.toLowerCase().indexOf(search) > -1 ||
               c.customer_id.toLowerCase().indexOf(search) > -1;
      });
    }

    this.filteredCustomers = list;
    this.renderCustomersList();
  };

  AgentDashboard.prototype.renderCustomersList = function () {
    var container = $('#adCustomersListContent', this.dashboardPage);
    var pagination = $('#adPagination', this.dashboardPage);
    if (!container) return;

    var list = this.filteredCustomers;

    if (list.length === 0) {
      container.innerHTML =
        '<div class="ad-empty-state">' +
          '<div class="ad-empty-icon"><i data-lucide="users"></i></div>' +
          '<div class="ad-empty-title">No customers found</div>' +
          '<div class="ad-empty-subtitle">Try adjusting your search or filters</div>' +
        '</div>';
      if (pagination) pagination.innerHTML = '';
      refreshIcons();
      return;
    }

    var totalPages = Math.ceil(list.length / this.perPage);
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    var start = (this.currentPage - 1) * this.perPage;
    var pageItems = list.slice(start, start + this.perPage);

    container.innerHTML = pageItems.map(function (c, i) {
      var globalIdx = start + i;
      var st = getStatusInfo(c.status);
      return '<div class="ad-customer-row-clickable" data-idx="' + globalIdx + '">' +
        '<div class="ad-cr-customer">' +
          '<div class="ad-customer-avatar">' + getInitials(c.customer_name) + '</div>' +
          '<div><div class="ad-customer-name">' + escHTML(c.customer_name) + '</div>' +
          '<div class="ad-customer-id">' + escHTML(c.customer_id) + '</div></div>' +
        '</div>' +
        '<div class="ad-cr-type">' + escHTML(c.loan_purpose || '-') + '</div>' +
        '<div class="ad-cr-amount">' + formatINR(c.loan_amount) + '</div>' +
        '<div class="ad-cr-status"><span class="ad-status-badge" style="background:' + st.bg + ';color:' + st.color + ';">' + st.label + '</span></div>' +
        '<div class="ad-cr-date">' + formatDate(c.created_at) + '</div>' +
        '<div class="ad-cr-arrow"><i data-lucide="chevron-right"></i></div>' +
      '</div>';
    }).join('');

    // Pagination
    if (pagination && totalPages > 1) {
      var html = '';
      html += '<button class="ad-page-btn' + (this.currentPage === 1 ? ' disabled' : '') + '" data-page="' + (this.currentPage - 1) + '" ' + (this.currentPage === 1 ? 'disabled' : '') + '><i data-lucide="chevron-left"></i></button>';
      for (var p = 1; p <= totalPages; p++) {
        html += '<button class="ad-page-btn' + (p === this.currentPage ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
      html += '<button class="ad-page-btn' + (this.currentPage === totalPages ? ' disabled' : '') + '" data-page="' + (this.currentPage + 1) + '" ' + (this.currentPage === totalPages ? 'disabled' : '') + '><i data-lucide="chevron-right"></i></button>';
      pagination.innerHTML = html;
    } else if (pagination) {
      pagination.innerHTML = '';
    }

    refreshIcons();
  };

  // ----- CUSTOMER DETAIL VIEW -----
  AgentDashboard.prototype.showCustomerDetail = function (customer) {
    var listView = $('#adCustomersListView', this.dashboardPage);
    var detailView = $('#adCustomerDetailView', this.dashboardPage);
    if (!listView || !detailView) return;

    listView.style.display = 'none';
    detailView.style.display = 'block';
    this.detailViewActive = true;

    var c = customer;
    var st = getStatusInfo(c.status);
    var initial = getInitials(c.customer_name);

    // Timeline steps
    var timelineSteps = [
      { key: 'submitted', label: 'Application Submitted', icon: 'file-text' },
      { key: 'documents', label: 'Documents Verified', icon: 'file-check' },
      { key: 'processing', label: 'Under Review', icon: 'search' },
      { key: 'final', label: c.status === 'rejected' ? 'Loan Rejected' : 'Loan Approved', icon: c.status === 'rejected' ? 'x-circle' : 'check-circle' }
    ];

    var statusOrder = { submitted: 0, processing: 2, approved: 3, rejected: 3 };
    var activeStep = statusOrder[c.status] !== undefined ? statusOrder[c.status] : 0;

    var timelineHTML = timelineSteps.map(function (step, idx) {
      var cls = 'ad-timeline-step';
      if (idx < activeStep) cls += ' completed';
      else if (idx === activeStep) cls += ' active';
      else cls += ' pending';
      // Special: if rejected and this is the final step
      if (idx === 3 && c.status === 'rejected') cls += ' rejected';
      return '<div class="' + cls + '">' +
        '<div class="ad-timeline-dot"><i data-lucide="' + step.icon + '"></i></div>' +
        '<div class="ad-timeline-label">' + step.label + '</div>' +
      '</div>';
    }).join('');

    var notesHTML = '';
    if (c.notes) {
      notesHTML = '<div class="ad-card ad-notes-card">' +
        '<div class="ad-card-title"><i data-lucide="sticky-note"></i> Notes</div>' +
        '<p>' + escHTML(c.notes) + '</p>' +
      '</div>';
    }

    detailView.innerHTML =
      '<button class="ad-back-btn"><i data-lucide="arrow-left"></i> Back to Customers</button>' +
      '<div class="ad-detail-layout">' +
        // Left column
        '<div class="ad-detail-left">' +
          '<div class="ad-card ad-detail-profile-card">' +
            '<div class="ad-detail-avatar">' + escHTML(initial) + '</div>' +
            '<h3 class="ad-detail-name">' + escHTML(c.customer_name) + '</h3>' +
            '<div class="ad-detail-id">' + escHTML(c.customer_id) + '</div>' +
            '<span class="ad-status-badge" style="background:' + st.bg + ';color:' + st.color + ';margin-top:8px;display:inline-block;">' + st.label + '</span>' +
          '</div>' +
          '<div class="ad-card">' +
            '<div class="ad-card-title"><i data-lucide="contact"></i> Contact Information</div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Phone</span><span class="ad-detail-value">' + escHTML(c.phone || '-') + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Email</span><span class="ad-detail-value">' + escHTML(c.email || '-') + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Address</span><span class="ad-detail-value">' + escHTML(c.address || '-') + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Aadhaar</span><span class="ad-detail-value">' + maskAadhaar(c.aadhaar) + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">PAN</span><span class="ad-detail-value">' + escHTML(c.pan || '-') + '</span></div>' +
          '</div>' +
        '</div>' +
        // Right column
        '<div class="ad-detail-right">' +
          '<div class="ad-card">' +
            '<div class="ad-card-title"><i data-lucide="indian-rupee"></i> Loan Information</div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Loan Type</span><span class="ad-detail-value">' + escHTML(c.loan_purpose || '-') + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Amount</span><span class="ad-detail-value ad-amount-highlight">' + formatINR(c.loan_amount) + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Employment</span><span class="ad-detail-value">' + escHTML(c.employment_type || '-') + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Monthly Income</span><span class="ad-detail-value">' + formatINR(c.monthly_income) + '</span></div>' +
            '<div class="ad-detail-row"><span class="ad-detail-label">Applied On</span><span class="ad-detail-value">' + formatDate(c.created_at) + '</span></div>' +
          '</div>' +
          '<div class="ad-card">' +
            '<div class="ad-card-title"><i data-lucide="git-branch"></i> Application Status</div>' +
            '<div class="ad-timeline">' + timelineHTML + '</div>' +
          '</div>' +
          notesHTML +
        '</div>' +
      '</div>';

    refreshIcons();
    // Scroll to top of detail view
    detailView.scrollTop = 0;
    var mainEl = $('.ad-content', this.dashboardPage);
    if (mainEl) mainEl.scrollTop = 0;
  };

  AgentDashboard.prototype.hideCustomerDetail = function () {
    var listView = $('#adCustomersListView', this.dashboardPage);
    var detailView = $('#adCustomerDetailView', this.dashboardPage);
    if (!listView || !detailView) return;

    detailView.style.display = 'none';
    listView.style.display = '';
    this.detailViewActive = false;
  };

  // =====================================================================
  // FEATURE 5: PROFILE TAB
  // =====================================================================

  AgentDashboard.prototype.initProfileTab = function () {
    var tab = $('#ad-tab-profile', this.dashboardPage);
    if (!tab) return;
    var agent = this.agent;
    var self = this;
    var initial = getInitials(agent.name);

    tab.innerHTML =
      // Banner
      '<div class="ad-profile-banner">' +
        '<div class="ad-profile-banner-gradient"></div>' +
        '<div class="ad-profile-banner-content">' +
          '<div class="ad-profile-avatar-wrap">' +
            '<div class="ad-profile-avatar-large">' + escHTML(initial) + '</div>' +
            '<button class="ad-avatar-upload-btn" id="adAvatarUpload"><i data-lucide="camera"></i></button>' +
          '</div>' +
          '<h2 class="ad-profile-display-name">' + escHTML(agent.name || 'Agent') + '</h2>' +
          '<div class="ad-profile-display-id">' + escHTML(agent.app_id || '-') + '</div>' +
        '</div>' +
      '</div>' +
      // Account details card
      '<div class="ad-card ad-profile-details-card">' +
        '<div class="ad-card-title"><i data-lucide="settings"></i> Account Details <button class="ad-edit-btn" id="adProfileEditBtn"><i data-lucide="pencil"></i> Edit</button></div>' +
        '<div id="adProfileDetailsView">' +
          '<div class="ad-detail-row"><span class="ad-detail-label">Full Name</span><span class="ad-detail-value">' + escHTML(agent.name || '-') + '</span></div>' +
          '<div class="ad-detail-row"><span class="ad-detail-label">Email</span><span class="ad-detail-value">' + escHTML(agent.email || '-') + '</span></div>' +
          '<div class="ad-detail-row"><span class="ad-detail-label">Phone</span><span class="ad-detail-value">' + escHTML(agent.phone || '-') + '</span></div>' +
          '<div class="ad-detail-row"><span class="ad-detail-label">Status</span><span class="ad-detail-value" style="color:#059669;font-weight:600;">Active</span></div>' +
          '<div class="ad-detail-row"><span class="ad-detail-label">Joined</span><span class="ad-detail-value">' + (agent.created_at ? formatDate(agent.created_at) : '-') + '</span></div>' +
        '</div>' +
        '<div id="adProfileDetailsEdit" style="display:none;">' +
          '<div class="ad-form-grid">' +
            '<div class="ad-form-group"><label>Full Name</label><input type="text" id="adProfName" value="' + escHTML(agent.name || '') + '"></div>' +
            '<div class="ad-form-group"><label>Email</label><input type="email" id="adProfEmail" value="' + escHTML(agent.email || '') + '"></div>' +
            '<div class="ad-form-group"><label>Phone</label><input type="tel" id="adProfPhone" value="' + escHTML(agent.phone || '') + '"></div>' +
          '</div>' +
          '<div class="ad-profile-edit-actions">' +
            '<button class="ad-btn-secondary" id="adProfileCancelBtn">Cancel</button>' +
            '<button class="ad-btn-primary" id="adProfileSaveBtn"><i data-lucide="save"></i> Save Changes</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // Change password card
      '<div class="ad-card ad-password-card">' +
        '<button class="ad-card-title ad-collapsible-header" id="adPasswordToggle"><i data-lucide="lock"></i> Change Password <i data-lucide="chevron-down" class="ad-collapse-icon"></i></button>' +
        '<div class="ad-collapsible-content" id="adPasswordContent" style="display:none;">' +
          '<form id="adChangePasswordForm" novalidate>' +
            '<div class="ad-form-group" data-field="cp_current">' +
              '<label>Current Password</label>' +
              '<input type="password" id="ad_cp_current" placeholder="Current password">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="cp_new">' +
              '<label>New Password</label>' +
              '<input type="password" id="ad_cp_new" placeholder="New password (min 6 characters)">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<div class="ad-form-group" data-field="cp_confirm">' +
              '<label>Confirm New Password</label>' +
              '<input type="password" id="ad_cp_confirm" placeholder="Confirm new password">' +
              '<div class="ad-field-error"></div>' +
            '</div>' +
            '<button type="submit" class="ad-btn-primary" style="width:100%;">Update Password</button>' +
          '</form>' +
        '</div>' +
      '</div>';

    // Avatar upload
    var avatarBtn = $('#adAvatarUpload', this.dashboardPage);
    if (avatarBtn) {
      avatarBtn.addEventListener('click', function () {
        alert('Feature coming soon');
      });
    }

    // Edit/save/cancel toggle
    var editBtn = $('#adProfileEditBtn', this.dashboardPage);
    var cancelBtn = $('#adProfileCancelBtn', this.dashboardPage);
    var saveBtn = $('#adProfileSaveBtn', this.dashboardPage);
    var viewDiv = $('#adProfileDetailsView', this.dashboardPage);
    var editDiv = $('#adProfileDetailsEdit', this.dashboardPage);

    if (editBtn) {
      editBtn.addEventListener('click', function () {
        viewDiv.style.display = 'none';
        editDiv.style.display = '';
        editBtn.style.display = 'none';
      });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        viewDiv.style.display = '';
        editDiv.style.display = 'none';
        editBtn.style.display = '';
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', async function () {
        var name = $('#adProfName', self.dashboardPage).value.trim();
        var email = $('#adProfEmail', self.dashboardPage).value.trim();
        var phone = $('#adProfPhone', self.dashboardPage).value.trim();

        if (!name) { alert('Name is required.'); return; }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        try {
          if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            var updateData = { name: name, email: email, phone: phone };
            var res = await supabaseClient
              .from('home_loan_empanel_agents')
              .update(updateData)
              .eq('app_id', self.agent.app_id);

            if (res.error) {
              alert('Error saving: ' + res.error.message);
              saveBtn.disabled = false;
              saveBtn.innerHTML = '<i data-lucide="save"></i> Save Changes';
              refreshIcons();
              return;
            }
          }

          // Update local data
          self.agent.name = name;
          self.agent.email = email;
          self.agent.phone = phone;
          if (typeof currentAgent !== 'undefined') {
            currentAgent = self.agent;
          }
          sessionStorage.setItem('navAgent', JSON.stringify(self.agent));

          // Re-render profile
          self.initProfileTab();
          self.populateTopbar();
          refreshIcons();

        } catch (err) {
          alert('Connection error. Please try again.');
        }

        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i data-lucide="save"></i> Save Changes';
        refreshIcons();
      });
    }

    // Password toggle
    var pwToggle = $('#adPasswordToggle', this.dashboardPage);
    var pwContent = $('#adPasswordContent', this.dashboardPage);
    if (pwToggle && pwContent) {
      pwToggle.addEventListener('click', function () {
        var isOpen = pwContent.style.display !== 'none';
        pwContent.style.display = isOpen ? 'none' : '';
        pwToggle.classList.toggle('open', !isOpen);
      });
    }

    // Change password form
    var pwForm = $('#adChangePasswordForm', this.dashboardPage);
    if (pwForm) {
      pwForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        var currentPw = $('#ad_cp_current', self.dashboardPage).value;
        var newPw = $('#ad_cp_new', self.dashboardPage).value;
        var confirmPw = $('#ad_cp_confirm', self.dashboardPage).value;

        // Clear errors
        $$('.ad-field-error', pwForm).forEach(function (el) { el.textContent = ''; });
        $$('.ad-form-group', pwForm).forEach(function (g) { g.classList.remove('error'); });

        var hasError = false;

        if (currentPw !== self.agent.password) {
          self.showFieldError(pwForm, 'cp_current', 'Current password is incorrect');
          hasError = true;
        }
        if (!newPw || newPw.length < 6) {
          self.showFieldError(pwForm, 'cp_new', 'Password must be at least 6 characters');
          hasError = true;
        }
        if (newPw !== confirmPw) {
          self.showFieldError(pwForm, 'cp_confirm', 'Passwords do not match');
          hasError = true;
        }

        if (hasError) return;

        try {
          if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            var res = await supabaseClient
              .from('home_loan_empanel_agents')
              .update({ password: newPw })
              .eq('app_id', self.agent.app_id);

            if (res.error) {
              alert('Error updating password.');
              return;
            }
          }

          self.agent.password = newPw;
          if (typeof currentAgent !== 'undefined') {
            currentAgent = self.agent;
          }
          sessionStorage.setItem('navAgent', JSON.stringify(self.agent));
          pwForm.reset();
          alert('Password updated successfully!');

        } catch (err) {
          alert('Connection error. Please try again.');
        }
      });
    }

    refreshIcons();
  };

  AgentDashboard.prototype.showFieldError = function (form, fieldName, message) {
    var group = form.querySelector('[data-field="' + fieldName + '"]');
    if (!group) return;
    group.classList.add('error');
    var errEl = group.querySelector('.ad-field-error');
    if (errEl) errEl.textContent = message;
  };

  // =====================================================================
  // FEATURE 8: FORM VALIDATION - ADD CUSTOMER
  // =====================================================================

  AgentDashboard.prototype.initAddCustomerForm = function () {
    var self = this;
    var form = $('#adAddCustomerForm', this.dashboardPage);
    if (!form) return;

    // Phone auto-format
    var phoneInput = $('#ad_cf_phone', this.dashboardPage);
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        var digits = this.value.replace(/\D/g, '');
        // Remove leading 91 if user types it
        if (digits.indexOf('91') === 0 && digits.length > 10) {
          digits = digits.substring(2);
        }
        if (digits.length > 10) digits = digits.substring(0, 10);
        if (digits.length > 5) {
          this.value = '+91 ' + digits.substring(0, 5) + ' ' + digits.substring(5);
        } else if (digits.length > 0) {
          this.value = '+91 ' + digits;
        } else {
          this.value = '';
        }
      });
    }

    // Aadhaar auto-format
    var aadhaarInput = $('#ad_cf_aadhaar', this.dashboardPage);
    if (aadhaarInput) {
      aadhaarInput.addEventListener('input', function () {
        var digits = this.value.replace(/\D/g, '');
        if (digits.length > 12) digits = digits.substring(0, 12);
        var parts = [];
        for (var i = 0; i < digits.length; i += 4) {
          parts.push(digits.substring(i, i + 4));
        }
        this.value = parts.join(' ');
      });
    }

    // PAN auto-uppercase
    var panInput = $('#ad_cf_pan', this.dashboardPage);
    if (panInput) {
      panInput.addEventListener('input', function () {
        this.value = this.value.toUpperCase();
      });
    }

    // Live validation on input change
    var fields = ['name', 'phone', 'email', 'address', 'aadhaar', 'pan', 'loan_amount', 'loan_purpose', 'employment', 'income'];
    fields.forEach(function (field) {
      var input = $('#ad_cf_' + field, self.dashboardPage);
      if (input) {
        input.addEventListener('input', function () { self.validateField(field); });
        input.addEventListener('change', function () { self.validateField(field); });
      }
    });

    // Form submit
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!self.agent) return;

      // Validate all
      var allValid = true;
      fields.forEach(function (field) {
        if (!self.validateField(field)) allValid = false;
      });

      if (!allValid) {
        // Scroll to first error
        var firstError = form.querySelector('.ad-form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show spinner
      var btn = $('#adAddCustomerSubmitBtn', self.dashboardPage);
      var btnText = btn.querySelector('.ad-btn-text');
      var btnSpinner = btn.querySelector('.ad-btn-spinner');
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = '';
      btn.disabled = true;

      var customerId = 'CUS-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 99999)).padStart(5, '0');
      var phoneDigits = ($('#ad_cf_phone', self.dashboardPage).value || '').replace(/\D/g, '');
      if (phoneDigits.indexOf('91') === 0 && phoneDigits.length > 10) phoneDigits = phoneDigits.substring(2);

      var customer = {
        customer_id: customerId,
        agent_app_id: self.agent.app_id,
        customer_name: ($('#ad_cf_name', self.dashboardPage).value || '').trim(),
        phone: '+91 ' + phoneDigits,
        email: ($('#ad_cf_email', self.dashboardPage).value || '').trim() || null,
        aadhaar: ($('#ad_cf_aadhaar', self.dashboardPage).value || '').replace(/\s/g, '') || null,
        pan: ($('#ad_cf_pan', self.dashboardPage).value || '').trim() || null,
        address: ($('#ad_cf_address', self.dashboardPage).value || '').trim(),
        loan_amount: parseFloat($('#ad_cf_loan_amount', self.dashboardPage).value) || null,
        loan_purpose: $('#ad_cf_loan_purpose', self.dashboardPage).value,
        employment_type: $('#ad_cf_employment', self.dashboardPage).value,
        monthly_income: parseFloat(($('#ad_cf_income', self.dashboardPage).value || '0')) || null,
        notes: ($('#ad_cf_notes', self.dashboardPage).value || '').trim() || null,
        status: 'submitted'
      };

      try {
        var insertError = null;
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          var res = await supabaseClient.from('home_loan_agent_customers').insert([customer]);
          insertError = res.error;
        }

        btn.disabled = false;
        if (btnText) btnText.style.display = '';
        if (btnSpinner) btnSpinner.style.display = 'none';

        if (insertError) {
          alert('Error adding customer. Please try again.');
          console.error('Insert error:', insertError);
          return;
        }

        // Show success overlay
        var overlay = $('#adSuccessOverlay', self.dashboardPage);
        var idEl = overlay ? overlay.querySelector('.ad-success-id') : null;
        if (idEl) idEl.textContent = 'ID: ' + customerId;
        if (overlay) overlay.style.display = 'flex';

        form.reset();

        // Reload customers
        await self.loadCustomers();

        // Auto-dismiss and switch tab
        setTimeout(function () {
          if (overlay) overlay.style.display = 'none';
          self.switchTab('customers');
        }, 2000);

      } catch (err) {
        btn.disabled = false;
        if (btnText) btnText.style.display = '';
        if (btnSpinner) btnSpinner.style.display = 'none';
        alert('Connection error. Please try again.');
      }
    });
  };

  AgentDashboard.prototype.validateField = function (field) {
    var input = $('#ad_cf_' + field, this.dashboardPage);
    if (!input) return true;

    var group = input.closest('.ad-form-group');
    if (!group) return true;
    var errEl = group.querySelector('.ad-field-error');
    var val = (input.value || '').trim();

    var setError = function (msg) {
      group.classList.add('error');
      if (errEl) errEl.textContent = msg;
    };
    var clearError = function () {
      group.classList.remove('error');
      if (errEl) errEl.textContent = '';
    };

    switch (field) {
      case 'name':
        if (!val || val.length < 2) { setError('Name is required (min 2 characters)'); return false; }
        clearError(); return true;

      case 'phone':
        var digits = val.replace(/\D/g, '');
        if (digits.indexOf('91') === 0 && digits.length > 10) digits = digits.substring(2);
        if (!digits || digits.length !== 10) { setError('Enter a valid 10-digit phone number'); return false; }
        clearError(); return true;

      case 'email':
        if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setError('Enter a valid email address'); return false; }
        clearError(); return true;

      case 'address':
        if (!val) { setError('Address is required'); return false; }
        clearError(); return true;

      case 'aadhaar':
        if (val) {
          var aDigits = val.replace(/\D/g, '');
          if (aDigits.length !== 12) { setError('Aadhaar must be exactly 12 digits'); return false; }
        }
        clearError(); return true;

      case 'pan':
        if (val && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(val)) { setError('Invalid PAN format (e.g. ABCDE1234F)'); return false; }
        clearError(); return true;

      case 'loan_amount':
        if (!val || parseFloat(val) <= 0) { setError('Enter a valid loan amount'); return false; }
        clearError(); return true;

      case 'loan_purpose':
        if (!val) { setError('Select a loan purpose'); return false; }
        clearError(); return true;

      case 'employment':
        if (!val) { setError('Select employment type'); return false; }
        clearError(); return true;

      case 'income':
        if (val && parseFloat(val) < 0) { setError('Income must be a positive number'); return false; }
        clearError(); return true;

      default:
        clearError(); return true;
    }
  };

  // =====================================================================
  // LOAD CUSTOMERS (SUPABASE + FALLBACK)
  // =====================================================================

  AgentDashboard.prototype.loadCustomers = async function () {
    // Try Supabase first
    if (typeof supabaseClient !== 'undefined' && supabaseClient && this.agent) {
      try {
        var res = await supabaseClient
          .from('home_loan_agent_customers')
          .select('*')
          .eq('agent_app_id', this.agent.app_id)
          .order('created_at', { ascending: false });

        if (!res.error && res.data && res.data.length > 0) {
          this.customers = res.data;
          this.renderCustomersTab();
          this.updateStats();
          return;
        }
      } catch (e) {
        console.warn('Supabase load failed, using mock data:', e);
      }
    }
    // Fallback to mock data
    this.customers = MOCK_CUSTOMERS;
    this.renderCustomersTab();
    this.updateStats();
  };

  // =====================================================================
  // LOGOUT
  // =====================================================================

  AgentDashboard.prototype.logout = function () {
    // Clear session
    sessionStorage.removeItem('navAgent');
    sessionStorage.removeItem('navAgentTab');

    // Destroy charts
    if (this.charts.loan) { this.charts.loan.destroy(); this.charts.loan = null; }
    if (this.charts.weekly) { this.charts.weekly.destroy(); this.charts.weekly = null; }

    // Reset global
    if (typeof window.currentAgent !== 'undefined') {
      window.currentAgent = null;
    }

    // Close dashboard page
    var page = document.getElementById('agentDashboardPage');
    if (page) {
      page.classList.remove('active');
    }

    // Use existing closePage if available
    if (typeof closePage === 'function') {
      closePage(page);
    } else {
      // Manual close
      if (page) {
        page.style.display = 'none';
        page.classList.remove('active');
      }
      document.body.style.overflow = '';
    }
  };

  // =====================================================================
  // OVERRIDE window.initAgentDashboard
  // =====================================================================

  window.initAgentDashboard = function (agent) {
    // Set global
    if (typeof window.currentAgent !== 'undefined') {
      window.currentAgent = agent;
    }

    // Save session
    sessionStorage.setItem('navAgent', JSON.stringify(agent));

    // Initialize dashboard
    var dashboard = new AgentDashboard(agent);
    dashboard.init().catch(function (err) {
      console.error('AgentDashboard init error:', err);
    });
  };

  // =====================================================================
  // SESSION RESTORE ON PAGE LOAD
  // =====================================================================

  document.addEventListener('DOMContentLoaded', function () {
    var saved = sessionStorage.getItem('navAgent');
    if (saved) {
      try {
        var agent = JSON.parse(saved);
        // Set the global currentAgent that script.js declared
        // Since script.js uses let inside DOMContentLoaded, we try window level too
        if (typeof currentAgent !== 'undefined') {
          currentAgent = agent;
        }
        window.currentAgent = agent;

        window.initAgentDashboard(agent);

        var page = document.getElementById('agentDashboardPage');
        if (page) {
          page.classList.add('active');
          page.style.display = '';
          page.style.opacity = '1';
          page.style.visibility = 'visible';
          page.style.pointerEvents = 'auto';
          document.body.style.overflow = 'hidden';
        }
      } catch (e) {
        sessionStorage.removeItem('navAgent');
      }
    }

    // Always try to init lucide after DOM ready
    loadLucide().then(function () { refreshIcons(); });
  });

})();

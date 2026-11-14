/**
 * nexus-shared.js
 * Global integration helper for Nexus Academic Portal.
 * Manages API calls, tokens, role-based sidebars, headers, and logout.
 */

const API_BASE = window.location.origin.includes(':3001')
  ? '/api/v1'
  : (window.location.origin.includes('127.0.0.1') ? 'http://127.0.0.1:3001/api/v1' : 'http://localhost:3001/api/v1');

window.API_BASE = API_BASE;

// ── API CLIENT wrapper with JWT authorization & refresh auto-rotation ──
async function nexusFetch(endpoint, options = {}) {
  const token = localStorage.getItem('nexus_access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  // Handle Token Expiry (401)
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    const refreshToken = localStorage.getItem('nexus_refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (refreshResponse.ok) {
          const newTokens = await refreshResponse.json();
          localStorage.setItem('nexus_access_token', newTokens.accessToken);
          localStorage.setItem('nexus_refresh_token', newTokens.refreshToken);
          
          // Retry original request
          headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
          return fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        }
      } catch (e) {
        console.error('Refresh token failed:', e);
      }
    }
    // If refresh failed or no refresh token, logout
    nexusLogout();
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}

// ── Get Active Session details ──
function getLoggedUser() {
  const userStr = localStorage.getItem('nexus_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

// ── Auth Guard for pages ──
function guardPage() {
  const path = window.location.pathname;
  // Exclude Landing, Login/Signup, and Onboarding from auth checking
  if (
    path.includes('nexus_academic_landing_page') || 
    path.includes('login_sign_up_nexus_academic') ||
    path.includes('onboarding_welcome_to_nexus_academic')
  ) {
    return;
  }
  const user = getLoggedUser();
  if (!user) {
    console.warn('Access denied: User is not authenticated.');
    window.location.href = '../login_sign_up_nexus_academic/code.html';
  }
}

// ── Dynamic Sidebar & Header Builder ──
function renderSidebarAndHeader(activeTab = '') {
  const path = window.location.pathname;
  // Do not mutate landing, login, or onboarding layouts
  if (
    path.includes('nexus_academic_landing_page') || 
    path.includes('login_sign_up_nexus_academic') ||
    path.includes('onboarding_welcome_to_nexus_academic')
  ) {
    return;
  }

  const user = getLoggedUser();
  if (!user) {
    return;
  }
  const role = user.role;

  // 1. Locate existing Sidebar Container first (so sidebar nav is never confused with header)
  let sidebarContainer = document.querySelector('aside.w-64, nav.w-64, aside.h-screen, nav.h-screen, nav.docked, aside.docked, body > aside, body > nav.h-screen, #sidebar, .sidebar');
  if (!sidebarContainer) {
    sidebarContainer = document.querySelector('aside:not(main aside):not(section aside), nav:not(header nav):not(main nav)');
  }

  // 2. Locate existing Header Container (excluding any nav inside sidebar or main)
  let headerContainer = document.querySelector('header#global-header, body > header, header:not(main header):not(section header)');
  if (!headerContainer) {
    headerContainer = document.querySelector('nav:not(.w-64):not(.h-screen):not(aside nav):not(main nav)');
  }

  // Sidebar sections hierarchical configuration
  const sidebarSections = {
    STUDENT: [
      { name: 'Overview', icon: 'dashboard', href: '../student_dashboard_nexus_academic/code.html' },
      {
        section: 'Opportunities',
        items: [
          { name: 'Job & Internship Listings', icon: 'work', href: '../internship_job_listings_nexus_academic/code.html' },
          { name: 'My Applications', icon: 'description', href: '../application_tracker_nexus_academic/code.html' }
        ]
      },
      {
        section: 'Skill Center',
        items: [
          { name: 'Skill Assessment Lab', icon: 'psychology', href: '../skill_assessment_nexus_academic/code.html' },
          { name: 'Skill Gaps Analysis', icon: 'monitoring', href: '../skill_profile_gap_report_nexus_academic/code.html' }
        ]
      },
      {
        section: 'Growth & Portfolio',
        items: [
          { name: 'Learning Recommendations', icon: 'local_library', href: '../learning_programs_nexus_academic/code.html' },
          { name: 'Digital Portfolio', icon: 'workspace_premium', href: '../digital_portfolio_nexus_academic/code.html' }
        ]
      }
    ],
    INDUSTRY: [
      { name: 'Dashboard', icon: 'dashboard', href: '../industry_dashboard_nexus_academic/code.html' },
      {
        section: 'Job Postings',
        items: [
          { name: 'Post Opportunity', icon: 'post_add', href: '../post_internship_job_nexus_academic/code.html' },
          { name: 'Manage Postings', icon: 'work', href: '../manage_postings_nexus_academic/code.html' }
        ]
      },
      {
        section: 'Recruitment & Learning',
        items: [
          { name: 'Candidate Matching', icon: 'people', href: '../candidate_matching_shortlisting_nexus_academic/code.html' },
          { name: 'Publish Course', icon: 'publish', href: '../publish_training_program_nexus_academic/code.html' }
        ]
      },
      {
        section: 'Collaboration',
        items: [
          { name: 'Research & Consultancy', icon: 'science', href: '../research_consultancy_collaboration_nexus_academic/code.html' },
          { name: 'Workshops & Scheduling', icon: 'calendar_month', href: '../workshops_guest_lecture_scheduling_nexus_academic/code.html' }
        ]
      }
    ],
    ACADEMICIAN: [
      { name: 'Dashboard', icon: 'dashboard', href: '../academician_dashboard_nexus_academic/code.html' },
      { name: 'Student Progress Tracker', icon: 'trending_up', href: '../student_progress_monitoring_nexus_academic/code.html' },
      {
        section: 'Research & FDP',
        items: [
          { name: 'Faculty Opportunities / FDP', icon: 'menu_book', href: '../faculty_internship_fdp_listings_nexus_academic/code.html' },
          { name: 'Research & Consultancy', icon: 'science', href: '../research_consultancy_collaboration_nexus_academic/code.html' },
          { name: 'Workshops & Lectures', icon: 'calendar_month', href: '../workshops_guest_lecture_scheduling_nexus_academic/code.html' }
        ]
      }
    ],
    INSTITUTION_ADMIN: [
      { name: 'Dashboard', icon: 'dashboard', href: '../institution_admin_dashboard_nexus_academic/code.html' },
      { name: 'User Management', icon: 'manage_accounts', href: '../user_role_management_nexus_academic/code.html' },
      { name: 'Verification Queue', icon: 'fact_check', href: '../approval_verification_nexus_academic/code.html' },
      { name: 'Analytics & Reports', icon: 'analytics', href: '../analytics_reports_nexus_academic/code.html' }
    ]
  };

  // ── Render Sidebar ──
  if (sidebarContainer) {
    sidebarContainer.classList.add('bg-surface-container-lowest', 'border-r', 'border-outline-variant', 'flex', 'flex-col', 'w-64', 'shrink-0');
    
    let sidebarHTML = `
      <div class="flex items-center gap-sm mb-lg">
        <div class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md font-bold">N</div>
        <div>
          <h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim tracking-tight">Nexus Academic</h1>
          <p class="font-label-sm text-label-sm text-on-surface-variant">${role.replace('_', ' ')} Portal</p>
        </div>
      </div>
      <div class="flex-grow flex flex-col gap-xs overflow-y-auto pr-xs">
    `;

    const sections = sidebarSections[role] || sidebarSections.STUDENT;

    sections.forEach(sec => {
      if (sec.section) {
        sidebarHTML += `<span class="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-wider px-sm mt-md mb-xs block">${sec.section}</span>`;
        sec.items.forEach(tab => {
          const isActive = activeTab.toLowerCase() === tab.name.toLowerCase() || 
                           (tab.name === 'Job & Internship Listings' && activeTab === 'Internships & Jobs') ||
                           (tab.name === 'Skill Gaps Analysis' && activeTab === 'Skill Gaps') ||
                           (tab.name === 'Skill Assessment Lab' && activeTab === 'Skill Lab') ||
                           (tab.name === 'Learning Recommendations' && activeTab === 'Learning Programs') ||
                           (tab.name === 'Application Tracker' && activeTab === 'My Applications') ||
                           (tab.name === 'Post Opportunity' && (activeTab === 'Post Internship/Job' || activeTab === 'Post Opportunity')) ||
                           (tab.name === 'Manage Postings' && activeTab === 'Manage Postings') ||
                           (tab.name === 'Candidate Matching' && activeTab === 'Candidate Matching');
          sidebarHTML += `
            <a class="flex items-center gap-sm px-sm py-sm rounded-lg transition-colors duration-200 font-label-md text-label-md group ${
              isActive 
                ? 'bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed font-bold' 
                : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant'
            }" href="${tab.href}">
              <span class="material-symbols-outlined" style="${isActive ? "font-variation-settings: 'FILL' 1;" : ""}">${tab.icon}</span>
              <span>${tab.name}</span>
            </a>
          `;
        });
      } else {
        const isActive = activeTab.toLowerCase() === sec.name.toLowerCase();
        sidebarHTML += `
          <a class="flex items-center gap-sm px-sm py-sm rounded-lg transition-colors duration-200 font-label-md text-label-md group ${
            isActive 
              ? 'bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed font-bold' 
              : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant'
          }" href="${sec.href}">
            <span class="material-symbols-outlined" style="${isActive ? "font-variation-settings: 'FILL' 1;" : ""}">${sec.icon}</span>
            <span>${sec.name}</span>
          </a>
        `;
      }
    });

    sidebarHTML += `
      </div>
      <div class="mt-auto flex flex-col gap-sm pt-md border-t border-outline-variant">
        <a class="flex items-center gap-sm px-sm py-xs text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant rounded-lg transition-colors duration-200 font-label-md text-label-md" href="../help_support_nexus_academic/code.html">
          <span class="material-symbols-outlined">help</span>
          <span>Help Center</span>
        </a>
        <button onclick="nexusLogout()" class="flex items-center gap-sm px-sm py-xs text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-low dark:hover:bg-surface-variant rounded-lg transition-colors duration-200 font-label-md text-label-md text-left w-full">
          <span class="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    `;

    sidebarContainer.innerHTML = sidebarHTML;
  }

  // ── Render Top Navigation Header ──
  if (headerContainer) {
    headerContainer.classList.remove('hidden', 'md:hidden');
    headerContainer.classList.add('bg-surface-container-lowest', 'border-b', 'border-outline-variant', 'w-full', 'shrink-0', 'flex');
    
    const name = user.firstName 
      ? `${user.firstName} ${user.lastName || ''}` 
      : (user.companyName || user.email);

    headerContainer.innerHTML = `
      <div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto h-16">
        <div class="lg:hidden flex items-center gap-sm">
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-label-md">N</div>
          <span class="font-headline-md text-headline-md font-bold text-primary">Nexus Academic</span>
        </div>
        <div class="hidden lg:block flex-1"></div>
        
        <div class="flex items-center gap-md flex-1 justify-end">
          <div class="relative hidden sm:block w-64">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input id="global-search" class="w-full pl-10 pr-4 py-2 rounded-full border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-secondary-fixed bg-surface text-on-surface font-body-md text-body-md transition-all outline-none" placeholder="Search..." type="text"/>
          </div>
          
          <a href="../messaging_nexus_academic/code.html" class="relative text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low">
            <span class="material-symbols-outlined">mail</span>
            <span id="unread-inbox-badge" class="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full hidden"></span>
          </a>
          
          <a href="../notifications_center_nexus_academic/code.html" class="relative text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low">
            <span class="material-symbols-outlined">notifications</span>
            <span id="unread-notifications-badge" class="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full hidden"></span>
          </a>
          
          <a href="../profile_settings_nexus_academic/code.html" class="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low">
            <span class="material-symbols-outlined">settings</span>
          </a>
          
          <a href="../profile_settings_nexus_academic/code.html" class="flex items-center gap-sm pl-sm border-l border-outline-variant">
            <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-label-md overflow-hidden">
              <span id="header-avatar-letter">${name.charAt(0).toUpperCase()}</span>
            </div>
            <span class="hidden md:inline font-label-md text-label-md text-on-surface font-semibold max-w-[120px] truncate">${name}</span>
          </a>
        </div>
      </div>
    `;

    updateBadges();
  }
}

// ── Notification and Inbox Badge Updates ──
async function updateBadges() {
  try {
    const unreadNotifications = await nexusFetch('/notifications/unread-count');
    if (unreadNotifications.ok) {
      const data = await unreadNotifications.json();
      const badge = document.getElementById('unread-notifications-badge');
      if (badge) {
        if (data.count > 0) {
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
    }
  } catch (e) {
    console.warn('Failed to update badges:', e.message);
  }
}

// ── Unified Logout ──
async function nexusLogout() {
  try {
    await nexusFetch('/auth/logout', { method: 'POST' });
  } catch (e) {
    console.error('Logout error:', e);
  } finally {
    localStorage.clear();
    window.location.href = '../login_sign_up_nexus_academic/code.html';
  }
}

// Run auth guard & loader automatically
guardPage();
document.addEventListener('DOMContentLoaded', () => {
  // Try to read active tab page title or add attributes
  const body = document.body;
  const activeTabAttr = body.getAttribute('data-active-tab') || '';
  renderSidebarAndHeader(activeTabAttr);
});

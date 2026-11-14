# Product Requirement Document (PRD)
# Nexus Academic — Academia–Industry Collaboration Platform

---

## 1. Document Control & Metadata

| Field | Details |
|---|---|
| **Document Title** | Product Requirement Document (PRD) — Nexus Academic Portal |
| **Project Name** | Nexus Academic (Academia–Industry Collaboration Platform) |
| **Problem Statement** | "Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement" (Smart India Hackathon) |
| **Document Version** | 1.0.0 |
| **Target Audience** | Engineering Team, Product Managers, UI/UX Designers, Hackathon Evaluators, Educational Institutions, Enterprise HR Partners |
| **Status** | Approved / Active Development |
| **Repository Path** | `/Users/harsh_thakur/Desktop/SIH` |
| **Last Updated** | September 2026 |

---

## 2. Executive Summary & Problem Definition

### 2.1 Background & Problem Context
Traditional higher education systems and modern industrial requirements operate in isolated silos. This systemic disconnect leads to:
1. **Critical Skill Gaps**: Academic curricula often lag behind fast-evolving market requirements in cutting-edge domains (AI/ML, Cloud Computing, Full-Stack Development, Cyber Security).
2. **Suboptimal Placement Outcomes**: Companies spend substantial capital and months retraining fresh university hires, while qualified students struggle to identify what skills are actually demanded.
3. **Fragmented Internship Pipelines**: Students face opaque application processes on generic job boards, where their academic and verified practical achievements are poorly assessed.
4. **Isolated Faculty**: Academicians lack structured avenues for industrial exposure (Faculty Development Programs - FDPs), joint industrial research, guest lectures, and consulting opportunities.
5. **Lack of Institutional Visibility**: University administrators and placement cells lack centralized, data-driven dashboards to identify cohort-wide skill gaps, placement readiness, and track accreditation metrics.

### 2.2 Product Vision
**Nexus Academic** is a centralized, AI-driven digital collaboration ecosystem connecting **Students**, **Industry Partners**, **Academicians**, and **Institutions**. The platform unifies **continuous skill assessment**, **industry benchmark mapping**, **algorithmic internship matching**, **verified digital credentials**, **faculty-industry research**, and **institutional placement intelligence** into one unified, responsive web portal.

### 2.3 Core Stakeholder Personas

```
                     ┌───────────────────────────────┐
                     │    NEXUS ACADEMIC PLATFORM    │
                     └───────────────┬───────────────┘
          ┌──────────────────┬───────┴──────────┬──────────────────┐
          ▼                  ▼                  ▼                  ▼
┌──────────────────┐ ┌───────────────┐ ┌──────────────────┐ ┌────────────────┐
│  🎓 STUDENT      │ │ 🏭 INDUSTRY   │ │ 👨‍🏫 ACADEMICIAN │ │ 🏛 ADMIN       │
│  - Skill Lab     │ │ - Post Jobs   │ │ - FDP Programs   │ │ - Governance   │
│  - Gap Analysis  │ │ - AI Match    │ │ - Research Collab│ │ - Verification │
│  - Apply & Track │ │ - Courses/FDP │ │ - Cohort Tracker │ │ - Analytics    │
│  - Portfolio     │ │ - Analytics   │ │ - Workshops      │ │ - Compliance   │
└──────────────────┘ └───────────────┘ └──────────────────┘ └────────────────┘
```

1. **Student**: Evaluates technical and professional skills, receives AI gap analysis against real-world benchmarks, accesses customized learning programs, applies to matched internships, and manages a verified digital portfolio.
2. **Industry (Enterprise / Recruiter / Startups)**: Posts internships and jobs, identifies high-match candidates via multi-factor ranking, publishes certified upskilling programs, engages faculty in consulting/research, and schedules guest lectures.
3. **Academician (Faculty / Professor / Researcher)**: Monitors student cohort readiness, accesses industry-led Faculty Development Programs (FDPs), collaborates on industrial research, and organizes guest lectures.
4. **Institution Admin (Dean / Placement Officer / TPO)**: Oversees institutional placement metrics, analyzes department-level skill gaps, verifies partner credentials, and manages user accounts.

---

## 3. System Architecture & Technical Stack

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 CLIENT LAYER                                    │
│  • 33+ Illustrative UI Screens (HTML5, Tailwind CSS tokens, Material Symbols)   │
│  • nexus-shared.js (Global state, auth guards, token refresh, dynamic sidebar)  │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ RESTful APIs (JSON) + JWT Bearer
┌────────────────────────────────────────▼────────────────────────────────────────┐
│                          API GATEWAY / NESTJS BACKEND                           │
│  • URL: http://localhost:3001/api/v1  |  OpenAPI Docs: http://localhost:3001/api│
│  • Global Validation Pipe (class-validator) | Exception Filters | CORS Guards   │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
 ┌──────────────┬──────────────┬─────────┴────┬─────────────┬─────────────┬───────────┐
 ▼              ▼              ▼              ▼             ▼             ▼           ▼
Auth         Users         Skill          Internships   Learning &    Faculty &   Analytics
& RBAC       & Profiles    Assessment     & Placement   Credentials   Collab      & Reports
 └──────────────┴──────────────┴─────────┬────┴─────────────┴─────────────┴───────────┘
                                         │ Prisma ORM
┌────────────────────────────────────────▼────────────────────────────────────────┐
│                              DATA PERSISTENCE LAYER                             │
│  • Primary Database: PostgreSQL (Managed via Embedded-Postgres / Cloud DB)      │
│  • Relational schema: 22 Models, Cascading Relational Integrity, JSON Fields    │
│  • File / Media Storage: Document Tracking System (Resumes, Certificates)       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

| Layer | Component | Implementation |
|---|---|---|
| **Frontend** | UI Templates & Layouts | Vanilla HTML5, Clean Illustrative CSS Design System, Google Fonts (Inter / Poppins), Material Symbols Outlined |
| **Frontend Client** | State & Communication | `nexus-shared.js` featuring JWT auto-rotation, role-based sidebar injection, session persistence, reactive toast alerts |
| **Backend Framework** | Application Server | NestJS 10.x (TypeScript), Modular MVC, Dependency Injection |
| **API Documentation** | API Explorer | Swagger / OpenAPI 3.0 at `/api` |
| **Database & ORM** | Data Persistence | Prisma ORM 5.x with PostgreSQL (supports embedded-postgres for zero-configuration local development) |
| **Authentication** | Identity & Security | Passport-JWT, bcrypt password hashing, Dual-token lifecycle (Access Token 7d + Refresh Token rotation), Role-based Guards (`@Roles()`) |
| **Storage & Uploads** | Document Management | Multipart file upload pipeline with verification statuses (`PENDING`, `APPROVED`, `REJECTED`) |

---

## 4. Comprehensive Feature Breakdown & On-Site Options

Every single screen, feature, and user-facing option available on the Nexus Academic Portal is detailed below by persona.

### 4.1 Common & Public Modules

#### 1. Landing Page (`nexus_academic_landing_page/code.html`)
* **Purpose**: Primary entry point showcasing platform value proposition, live stats, and ecosystem pathways.
* **On-Site Features & Interactive Options**:
  * **Global Header**: Nexus Academic brand logo, Navigation links (*Features, For Students, For Industry, For Academics, About*), "Sign In" button, and "Get Started" CTA button.
  * **Hero Section**: Headline (*"Bridging the Chasm Between Academic Learning and Industry Excellence"*), descriptive value proposition, and two primary action buttons:
    * *Explore Opportunities* (directs to internship listings).
    * *Take Skill Assessment* (directs to skill lab).
  * **Illustrative Hero Artwork**: Flat vector illustration depicting students, professors, and industry professionals collaborating.
  * **Live Impact Metrics Bar**: Dynamic counters showcasing:
    * `15,000+` Active Students Registered.
    * `650+` Enterprise & Startup Industry Partners.
    * `120+` Partner Universities & Autonomous Institutes.
    * `94.8%` Verified Skill Placement Rate.
  * **Interactive Role Selection Grid**: Four interactive cards with hover effects and role badges:
    * *Student Portal*: Skill mapping, internship matching, portfolio creation.
    * *Industry Portal*: Precision candidate matching, posting internships, launching training modules.
    * *Academician Portal*: Faculty FDPs, student tracking, joint research collaborations.
    * *Institution Portal*: Placement analytics, verified accreditations, curriculum gap audits.
  * **Core Value Pillars**: Three illustrated cards detailing *Precision Skill Assessment*, *Curated Placement Pipeline*, and *Faculty-Industry Nexus*.
  * **Testimonials Carousel**: Feedback from verified students, university deans, and corporate recruiters.
  * **Footer**: Platform links, legal documentation (Privacy, Terms of Use), accreditation standards, and newsletter subscription input.

#### 2. Authentication & Sign-Up (`login_sign_up_nexus_academic/code.html`)
* **Purpose**: Universal authentication gate with role separation and institutional SSO capabilities.
* **On-Site Features & Interactive Options**:
  * **Tab Switcher**: Seamless toggle between **"Sign In"** and **"Create Account"**.
  * **Role Selector Pills**: Multi-select toggle for the 4 core roles:
    * `Student`, `Industry`, `Academician`, `Institution Admin`.
  * **Sign-In Form**:
    * Email Address field (supports institutional email validation).
    * Password field with toggleable show/hide eye icon.
    * *"Remember Me"* checkbox and *"Forgot Password?"* recovery trigger.
    * *"Sign In to Portal"* primary CTA button.
  * **Demo Quick-Login Presets**: 1-click test login buttons preconfigured for immediate hackathon/evaluator testing:
    * `Alex Chen (Student)`
    * `TechCorp HR (Industry)`
    * `Prof. Sharma (Academician)`
    * `Dr. Aris Thorne (Admin)`
  * **Institutional SSO Integration**: *"Continue with Institutional ID"* button supporting SAML/OAuth2 federation.
  * **Registration Form**:
    * Full Name (First & Last Name).
    * Official / Student Email Address.
    * Password with live strength indicator (Min 8 chars, uppercase, number, special char).
    * Confirm Password field.
    * Terms & Conditions agreement checkbox.
    * *"Create My Account"* primary CTA.

#### 3. Onboarding Wizard (`onboarding_welcome_to_nexus_academic/code.html`)
* **Purpose**: 3-step structured profile completion wizard for new users.
* **On-Site Features & Interactive Options**:
  * **Stepped Progress Header**: Visual 3-step indicator (*1. Profile Details → 2. Institution / Company → 3. Skills & Preferences*).
  * **Step 1: Personal Profile**:
    * Avatar upload with real-time circular preview.
    * Contact phone number.
    * Professional Headline / Bio textarea.
  * **Step 2: Affiliation & Verification**:
    * Student/Faculty: University dropdown, Department/Branch select, Enrollment/Roll number, Current Year of Study (1st, 2nd, 3rd, 4th, Postgrad), Current CGPA.
    * Industry: Company name, Industry domain (e.g., Software, Fintech, Biotech), Company website URL, Corporate office location, Company size selector.
  * **Step 3: Domains & Skill Tags**:
    * Multi-select clickable skill chips (Python, React, Machine Learning, Data Structures, AWS, DevOps, UI/UX).
    * Preferred internship/job mode (Remote, Hybrid, On-site).
    * Availability timeframe (Immediate, Summer 2026, Fall 2026).
  * **Navigation Controls**: *"Back"* and *"Save & Launch Dashboard"* buttons.

#### 4. Notifications Center (`notifications_center_nexus_academic/code.html`)
* **Purpose**: Real-time actionable alerts feed.
* **On-Site Features & Interactive Options**:
  * **Filter Tabs**: *All*, *Applications*, *Skill Lab*, *Messages*, *System*.
  * **Header Controls**: *"Mark All as Read"* button, Notification settings shortcut.
  * **Notification Item Card**:
    * Category-specific icon (Work for job updates, Award for certificates, Chat for messages).
    * Title and contextual summary text.
    * Dynamic time-ago timestamp (`2 hours ago`, `Yesterday`).
    * Unread blue indicator dot.
    * Inline contextual CTA (e.g., *"View Application"*, *"Start Test"*, *"Reply"*).
  * **Empty State**: Friendly flat vector illustration with *"You're all caught up!"*.

#### 5. Direct Messaging & Chat (`messaging_nexus_academic/code.html`)
* **Purpose**: Secure 1:1 communication between students, recruiters, and academic mentors.
* **On-Site Features & Interactive Options**:
  * **Left Conversation Panel**:
    * Real-time search bar for contacts/threads.
    * Conversation list showing user avatar, name, verified role badge, preview of last message, unread message counter badge, and timestamp.
  * **Right Chat Panel**:
    * Conversation Header: Recipient profile picture, online/offline status, organization affiliation, and *"View Profile"* shortcut.
    * Message History: Chronological chat bubbles (styled in soft blue for outgoing, neutral gray for incoming) with exact delivery timestamps.
    * Message Input Bar: Multi-line text input, emoji picker trigger, file attachment icon (supports PDFs/images up to 10MB), and mid-blue *"Send"* CTA button.

#### 6. Help & Support / Knowledge Base (`help_support_nexus_academic/code.html`)
* **Purpose**: Self-serve troubleshooting, platform documentation, and ticket dispatch.
* **On-Site Features & Interactive Options**:
  * **Omni-Search Bar**: Instant keyword lookup across platform documentation.
  * **Quick Support Categories**: Interactive cards for *Skill Assessment Guidelines*, *Internship Application Lifecycle*, *Certificate Verification*, *Company Onboarding*.
  * **Accordion FAQ Engine**: Expandable questions covering scoring methodologies, remote internship contracts, and institutional accreditation sync.
  * **Support Ticket Modal / Form**:
    * Issue Category dropdown.
    * Subject line input.
    * Detailed description textarea.
    * Screenshot attachment uploader.
    * *"Submit Ticket"* button with response SLA promise (< 24 hrs).

#### 7. Profile & Settings (`profile_settings_nexus_academic/code.html`)
* **Purpose**: Account management, privacy controls, and security parameters.
* **On-Site Features & Interactive Options**:
  * **Sidebar Navigation Tabs**: *General Profile*, *Account Security*, *Notification Preferences*, *Privacy & Visibility*.
  * **General Profile Tab**: Update full name, phone number, bio, LinkedIn URL, GitHub URL, and portfolio website.
  * **Account Security Tab**: Change password fields (current password, new password, confirm), Two-Factor Authentication (2FA) toggle, Active session list with *"Log Out All Devices"* button.
  * **Notification Preferences Tab**: Granular toggles for email and in-app alerts regarding new matches, status updates, messages, and newsletter digests.
  * **Privacy Tab**: Visibility toggle (*Public to all recruiters*, *Visible only to applied companies*, *Hidden*).

---

### 4.2 Student Persona Features

```
STUDENT EXPERIENCE JOURNEY
[Assessment Lab] ──► [Gap Report & Radar] ──► [Recommendations] ──► [Job Listings] ──► [Application Kanban] ──► [Digital Portfolio]
```

#### 8. Student Dashboard (`student_dashboard_nexus_academic/code.html`)
* **Purpose**: Centralized operational cockpit summarizing current readiness, applications, and immediate action items.
* **On-Site Features & Interactive Options**:
  * **Welcome Hero Card**: Personalized greeting, profile completion progress ring (e.g., `85% Complete`), and quick-action *"Retake Skill Test"*.
  * **4-Card Top Stat Strip**:
    1. *Overall Skill Score* (e.g., `84 / 100` with percentile ranking).
    2. *Active Applications* (e.g., `5 Active`, breakdown of Shortlisted/Interview).
    3. *High-Match Openings* (e.g., `18 Matches` matching > 80% profile).
    4. *Upcoming Deadlines* (e.g., `2 Days Left` for Google Summer Internship).
  * **Skill Radar Snapshot**: Compact preview of student skill categories with a link to full gap report.
  * **Application Quick-Tracker**: Mini-timeline of recently updated applications.
  * **Recommended Internships Carousel**: Horizontal cards featuring company logo, role title, stipend (`₹25,000 - ₹40,000/mo`), location/remote badge, and a high-contrast *"Apply Now"* button.

#### 9. Skill Assessment Lab (`skill_assessment_nexus_academic/code.html`)
* **Purpose**: Standardized, proctored testing engine evaluating core technical and analytical proficiencies.
* **On-Site Features & Interactive Options**:
  * **Test Overview Header**: Assessment Title (e.g., *"Full-Stack & Data Structures Benchmark Test"*), Category badges, Total Questions count, and live countdown timer (e.g., `24:50 remaining`).
  * **Linear Stepper Bar**: Visual question navigator showing completed, flagged, and current question indices.
  * **Question Arena**:
    * Clear question prompt text with syntax-highlighted code snippets if applicable.
    * 4 distinct multiple-choice option cards (Radio button select with active blue highlight state).
  * **Action Controls**:
    * *"Mark for Review"* checkbox.
    * *"Previous Question"* outline button.
    * *"Next Question"* mid-blue button.
    * *"Submit Assessment"* button triggering confirmation modal with answered summary.

#### 10. Skill Profile & Gap Report (`skill_profile_gap_report_nexus_academic/code.html`)
* **Purpose**: High-fidelity analytical breakdown comparing student competencies against live industry benchmarks.
* **On-Site Features & Interactive Options**:
  * **Overall Readiness Gauge**: Radial circular progress indicator displaying market readiness percentage.
  * **Comparative Radar Chart**: Interactive multi-axis spider chart plotting **"Student Mastery"** (solid blue) vs **"Industry Benchmark Standard"** (dashed gray).
  * **Strengths Matrix**: List of validated high-scoring competencies with *"Industry Ready"* green badges.
  * **Identified Skill Gaps**: Priority-ranked list of deficiencies (e.g., *"System Design - 42% vs Required 75%"*).
  * **Direct Bridge Recommendations**: Next to every identified skill gap, an inline *"Upskill Now"* button immediately links to corresponding free/certified learning programs.

#### 11. Career & Learning Recommendations
* **Purpose**: Predictive engine recommending optimal career trajectories based on demonstrated aptitudes.
* **On-Site Features & Interactive Options**:
  * **Role Fit Matcher**: Card deck of prospective roles (e.g., *Data Engineer*, *Full Stack Architect*, *Cloud Solutions Specialist*) sorted by suitability score.
  * **Required vs Current Skill Comparison**: Collapsible breakdown of role prerequisites.
  * **One-Click Course Enrollment**: Recommended learning pathways curated by top companies (Google Cloud, IBM, AWS).

#### 12. Internship & Job Listings (`internship_job_listings_nexus_academic/code.html`)
* **Purpose**: Filterable marketplace of verified corporate internships and junior entry roles.
* **On-Site Features & Interactive Options**:
  * **Omni-Search Bar**: Role title, keyword, company search.
  * **Multi-Facet Left Filter Sidebar**:
    * Job Type: Checkboxes for *Internship*, *Full-Time*, *Research Fellowship*.
    * Work Mode: *Remote*, *Hybrid*, *On-Site*.
    * Location: City search dropdown (Bangalore, Mumbai, Delhi-NCR, Hyderabad, Pune).
    * Stipend / Salary Range: Dual-handle slider (`₹10k/mo` to `₹100k/mo`).
    * Duration: *1-3 Months*, *3-6 Months*, *6+ Months*.
    * Minimum Match Score filter (e.g., *Show only > 80% match*).
  * **Job Cards Grid**:
    * Company logo, verified badge, company name.
    * Job title and department.
    * Stipend badge, duration tag, location tag.
    * Required skill pills (e.g., `Python`, `PostgreSQL`, `FastAPI`).
    * Dynamic Match Score Badge: Circular colored chip (e.g., `92% Match`).
    * *"View Details"* link and quick *"Apply"* button.

#### 13. Internship Detail View (`internship_detail_senior_data_science_intern_nexus_academic/code.html`)
* **Purpose**: Comprehensive view of a specific role, eligibility criteria, and application initiation.
* **On-Site Features & Interactive Options**:
  * **Banner Header**: Company banner, logo, title, posted date, application deadline.
  * **Key Terms Strip**: Stipend, Duration, Openings count, Experience level.
  * **Role Details Tabs**: *Role Overview*, *Key Responsibilities*, *Skill Requirements*, *About Company*.
  * **Match Breakdown Widget**: Detailed breakdown showing which skills match the student profile and which are missing.
  * **Application Modal / Action**:
    * Cover Letter textarea (with AI-assisted draft generator).
    * Resume selector (choose from uploaded profile resumes or upload a new PDF).
    * Availability confirmation date picker.
    * *"Confirm & Submit Application"* button.

#### 14. Application Tracker (`application_tracker_nexus_academic/code.html`)
* **Purpose**: Kanban-style interactive tracker monitoring applications across hiring stages.
* **On-Site Features & Interactive Options**:
  * **Kanban Columns**:
    1. `Applied` (Awaiting review)
    2. `Shortlisted` (Under recruiter review)
    3. `Interview Scheduled` (Technical / HR round)
    4. `Selected / Offer Received` (Formal offer extended)
    5. `Rejected / Archived`
  * **Interactive Cards**:
    * Company name, job title, application submission date.
    * Status change badge with color coding.
    * Interview schedule date/time badge with calendar invite download.
    * Direct *"Message Recruiter"* shortcut.
  * **Offer Acceptance Controls**: For cards in `Selected`, students can click *"Review Offer Letter"*, *"Accept Offer"*, or *"Decline"*.

#### 15. Digital Portfolio & Credential Showcase (`digital_portfolio_nexus_academic/code.html`)
* **Purpose**: Tamper-proof, shareable digital resume containing verified credentials, projects, and assessment scores.
* **On-Site Features & Interactive Options**:
  * **Hero Profile Card**: Full name, university, degree, CGPA, verified skill score, GitHub, LinkedIn, and social links.
  * **Public Share Bar**: *"Copy Public Link"*, *"Download Verified PDF Portfolio"*, *"Share to LinkedIn"*.
  * **Verified Credentials Section**: Grid of certificates earned through Nexus assessments and industry learning programs, featuring verified checkmarks and credential verification hashes.
  * **Project Showcase**: Cards showcasing student projects, live demos, GitHub repositories, and tech stack tags.
  * **Verified Internship History**: Past completed internships verified by host companies.

#### 16. Learning Programs & Upskilling (`learning_programs_nexus_academic/code.html`)
* **Purpose**: Repository of industry-curated training modules designed to bridge specific skill gaps.
* **On-Site Features & Interactive Options**:
  * **Category Filter Chips**: *All Courses*, *AI & Machine Learning*, *Web Architecture*, *Cloud & DevOps*, *Soft Skills*.
  * **Program Cards**:
    * Program thumbnail image.
    * Sponsoring company logo (e.g., Microsoft, AWS, Infosys).
    * Title, duration (e.g., *6 Weeks, Self-Paced*), difficulty tier (*Beginner*, *Intermediate*, *Advanced*).
    * Certified credential preview.
    * *"Enroll Now"* button (instant enrollment).
  * **Student Active Enrolled Tab**: Progress bar indicating percent complete (`68%`), *"Continue Learning"* button, and instant *"Download Certificate"* upon completion.

---

### 4.3 Industry Persona Features

```
INDUSTRY RECRUITER JOURNEY
[Dashboard] ──► [Post Internship] ──► [Manage Postings] ──► [AI Candidate Matching] ──► [Candidate Dossier] ──► [Hiring Funnel Analytics]
```

#### 17. Industry Dashboard (`industry_dashboard_nexus_academic/code.html`)
* **Purpose**: Executive recruiter dashboard tracking active campaigns, applicants, and talent pipeline throughput.
* **On-Site Features & Interactive Options**:
  * **Top Metrics Ribbon**:
    * *Active Postings* (e.g., `8 Active`).
    * *Total Candidates Applied* (e.g., `342 Applicants`).
    * *Shortlisted Candidates* (e.g., `46 In Review`).
    * *Offers Accepted* (e.g., `12 Placed`).
  * **Recruitment Funnel Chart**: Visual breakdown of conversion rates (*Applied → Shortlisted → Interviewed → Hired*).
  * **Urgent Action Queue**: Pending candidate reviews with filter by highest match score.
  * **Quick Actions**: *"Post New Opportunity"*, *"Publish Learning Program"*, *"Schedule Guest Lecture"*.

#### 18. Post Internship/Job Form (`post_internship_job_nexus_academic/code.html`)
* **Purpose**: Comprehensive posting wizard with automated skill tagging and live preview.
* **On-Site Features & Interactive Options**:
  * **Left Form Column**:
    * Opportunity Type: Radio toggle (*Internship*, *Full-Time Role*, *Co-Op*).
    * Job Title input (with auto-complete recommendations).
    * Department / Domain select.
    * Work Location & Mode: City input, Remote toggle, Hybrid toggle.
    * Duration & Timeline: Number of weeks/months, tentative start date, application deadline.
    * Compensation: Stipend / Salary range input, Unpaid toggle (flagged with warning), Additional perks checkboxes (Certificate, Pre-Placement Offer - PPO, Mentorship).
    * Required Skills Tagging: Interactive tag input chip field with auto-suggest from standardized skill taxonomy.
    * Eligibility Criteria: Minimum CGPA, permitted degree courses (B.Tech, M.Tech, MCA), passing year filters.
    * Detailed Description: Rich-text editor for responsibilities, deliverables, and company intro.
  * **Right Live Preview Card**: Dynamically updates in real time to show exactly how the listing appears to students.
  * **Action Buttons**: *"Save as Draft"* and *"Publish Listing Immediately"*.

#### 19. Manage Postings (`manage_postings_nexus_academic/code.html`)
* **Purpose**: Administration table of all company listings with lifecycle controls.
* **On-Site Features & Interactive Options**:
  * **Tabbed Views**: *Active Listings*, *Drafts*, *Closed / Expired*.
  * **Data Table Columns**:
    * Position Title & Reference ID.
    * Date Posted & Deadline.
    * Total Applicants count (clickable link to filtered matching view).
    * Status Badge (`ACTIVE` in green, `CLOSED` in gray).
  * **Row Actions**:
    * Edit Posting (pencil icon).
    * View Matching Candidates (users icon).
    * Pause / Close Posting toggle.
    * Delete / Archive action.

#### 20. Candidate Matching & AI Shortlisting (`candidate_matching_shortlisting_nexus_academic/code.html`)
* **Purpose**: Algorithmic ranking interface sorting candidates by multi-dimensional skill fit.
* **On-Site Features & Interactive Options**:
  * **Job Position Selector Dropdown**: Select target active job posting to refresh matching scores.
  * **Candidate Filter Sidebar**: Minimum match percentage slider (e.g., `> 75%`), CGPA threshold, availability filter.
  * **Ranked Candidate Cards**:
    * Rank index badge (`#1`, `#2`, `#3`).
    * Candidate avatar, full name, university name, branch.
    * **Calculated Match Score**: Prominent percentage badge (e.g., `96% Match`).
    * Top Matching Skills chips (green highlighted) and Gaps chips (red outline).
    * Verified Assessment Score display.
  * **Candidate Actions**:
    * *"Shortlist"* (moves to Kanban Shortlisted stage).
    * *"Reject"* (prompts optional polite feedback template).
    * *"View Full Dossier"* (opens Applicant Profile Detail).
    * *"Direct Message"* (initiates chat thread).
  * **Bulk Selection**: Checkbox for batch shortlisting / batch exporting of resumes.

#### 21. Applicant Profile Detail View (`applicant_profile_detail_nexus_academic/code.html`)
* **Purpose**: Deep-dive candidate evaluation dossier for interviewers and hiring managers.
* **On-Site Features & Interactive Options**:
  * **Candidate Overview Banner**: Profile photo, university, verified badges, match score ring.
  * **Tabbed Dossier Sections**:
    * *Skill Assessment Results*: Category-by-category score bars vs benchmark.
    * *Digital Resume Viewer*: Embedded PDF viewer with zoom, print, and download capabilities.
    * *Projects & Code Repositories*: Direct links to GitHub commits, live URLs, and tech stack tags.
    * *Verified Certificates*: Cryptographically verified credentials from previous coursework.
    * *Cover Letter & Motivation*: Text submitted during application.
  * **Recruiter Action Bar**:
    * Status dropdown (*Applied*, *Shortlisted*, *Interview*, *Selected*, *Rejected*).
    * *"Schedule Interview"* button opening calendar picker with meeting link integration.
    * *"Download Dossier ZIP"* (Resume + Verified Scores).

#### 22. Publish Learning/Training Program (`publish_training_program_nexus_academic/code.html`)
* **Purpose**: Enterprise tool for designing industry-accredited training programs.
* **On-Site Features & Interactive Options**:
  * **Course Meta Fields**: Title, Short description, Target audience.
  * **Curriculum Builder**: Add modules, lessons, video URLs, and reading materials.
  * **Skills Imparted**: Tag inputs specifying skills added to student profile upon completion.
  * **Certificate Template Designer**: Upload company logo, set authorized signatory name and digital signature.
  * **Publish Controls**: *"Save Draft"*, *"Publish to Student Learning Hub"*.

#### 23. Industry Analytics (`industry_analytics_nexus_academic/code.html`)
* **Purpose**: Recruitment intelligence dashboard measuring employer brand reach and candidate quality.
* **On-Site Features & Interactive Options**:
  * **Hiring Funnel Conversion Metrics**: Drop-off analysis at each recruitment stage.
  * **Source Diversity Chart**: Donut chart showing candidate distribution across institutions, regions, and demographics.
  * **Skill Demand vs Supply Heatmap**: Identifies competencies that are scarce among applicants.
  * **Time-to-Hire Tracker**: Average turnaround from posting to offer acceptance.
  * **Export Data**: CSV/PDF report download.

---

### 4.4 Academician Persona Features

```
ACADEMICIAN COLLABORATION PATHWAY
[Faculty Dashboard] ──► [Cohort Progress Tracker] ──► [FDP Listings] ──► [Joint Research Board] ──► [Guest Lecture Scheduler]
```

#### 24. Academician Dashboard (`academician_dashboard_nexus_academic/code.html`)
* **Purpose**: Faculty command center connecting student guidance with professional development.
* **On-Site Features & Interactive Options**:
  * **Summary KPI Cards**:
    * *Assigned Mentee Students* (e.g., `45 Students`).
    * *Class Placement Readiness Index* (e.g., `78.4% Average`).
    * *Active Research Collabs* (e.g., `3 Projects`).
    * *Scheduled Industry Workshops* (e.g., `2 Upcoming`).
  * **Cohort Skill Benchmark Widget**: Department average skill scores compared to national industry benchmarks.
  * **At-Risk Students Alert**: Flagging students falling below critical placement benchmarks.
  * **Quick Links**: *"Browse FDP Opportunities"*, *"Post Research Requirement"*, *"Schedule Lecture"*.

#### 25. Student Progress Monitoring (`student_progress_monitoring_nexus_academic/code.html`)
* **Purpose**: Longitudinal student cohort tracking across assessments, skill acquisition, and placements.
* **On-Site Features & Interactive Options**:
  * **Cohort Filter**: Filter by Academic Year, Department (CSE, ECE, Mech, IT), and Section.
  * **Student Tracking Table**:
    * Student Name, Roll Number, CGPA.
    * Nexus Skill Lab Score (with color-coded progress bar).
    * Identified Gaps count.
    * Internship Status badge (`Placed at TechCorp`, `3 Applications Active`, `Unplaced`).
    * Mentorship Note column.
  * **Row Actions**:
    * View Student Full Profile.
    * Send Direct Guidance Message.
    * Recommend Targeted Learning Program.
  * **Export Cohort Report**: Generates institution-ready Excel/PDF report for accreditation (NAAC / NBA).

#### 26. Faculty Internship & FDP Listings (`faculty_internship_fdp_listings_nexus_academic/code.html`)
* **Purpose**: Dedicated gateway for professors to upskill through industry immersion and training programs.
* **On-Site Features & Interactive Options**:
  * **Category Filter Tabs**: *Faculty Development Programs (FDP)*, *Industrial Sabbaticals*, *Hands-on Bootcamps*.
  * **Program Cards**:
    * Host enterprise (e.g., Intel, Cisco, Tata Consultancy Services).
    * Program topic (e.g., *"Modern Semiconductor Design & VLSI Testing"*).
    * Duration (e.g., *2 Weeks Hybrid*), Start date, Stipend/Funding details.
    * Prerequisites and Eligibility.
    * *"Apply for FDP"* button with institutional NOC attachment uploader.

#### 27. Research & Consultancy Collaboration (`research_consultancy_collaboration_nexus_academic/code.html`)
* **Purpose**: Industry-academic R&D marketplace bridging corporate technical challenges with faculty expertise.
* **On-Site Features & Interactive Options**:
  * **Dual-View Toggle**: *Browse Industry Research RFP* and *Faculty Consultancy Offerings*.
  * **Project RFP Cards**:
    * Industry Sponsor, Project Title (e.g., *"Edge AI Optimization for Low-Power IoT Sensors"*).
    * Research Grant / Budget Allocation (`₹5,00,000 - ₹12,00,000`).
    * Required Domain Expertise tags.
    * Proposal Deadline.
    * *"Submit Research Proposal"* button (opens modal for abstract, team CVs, and budget breakdown).
  * **"Post New Opportunity" Button**: Enables faculty to publish their lab facilities, patents, or consulting bandwidth for industry hire.

#### 28. Workshops & Guest Lecture Scheduling (`workshops_guest_lecture_scheduling_nexus_academic/code.html`)
* **Purpose**: Calendar coordination platform connecting industry leaders with university classrooms.
* **On-Site Features & Interactive Options**:
  * **Interactive Monthly Calendar View**: Dates highlighted with scheduled webinars, seminars, and hackathons.
  * **Side Session Detail Panel**:
    * Selected session agenda, industry speaker bio, target audience.
    * Mode (In-Person Auditorium vs Zoom / Google Meet link).
    * Student registration count.
  * **"Schedule New Session" Modal**:
    * Topic Title.
    * Invited Industry Speaker email / directory search.
    * Proposed Date, Time, and Duration.
    * Target Student Year / Department.
    * *"Send Invitation & Reserve Slot"* button.

---

### 4.5 Institution Admin Persona Features

```
ADMIN GOVERNANCE WORKFLOW
[Admin Overview] ──► [User & Role Governance] ──► [Verification Queue] ──► [Accreditation Analytics & Reports]
```

#### 29. Institution Admin Dashboard (`institution_admin_dashboard_nexus_academic/code.html`)
* **Purpose**: Macro-level university governance, accreditation compliance, and partnership cockpit.
* **On-Site Features & Interactive Options**:
  * **Institutional KPIs**:
    * *Total Registered Students* (e.g., `4,200`).
    * *Placement Percentage* (e.g., `88.5%`).
    * *Active Industry Partners* (e.g., `142 Companies`).
    * *Institutional Skill Index* (e.g., `81.2 / 100`).
  * **Placement Trend Line Chart**: Historical YoY placement rate graph.
  * **Departmental Performance Leaderboard**: Comparative ranking of departments by skill readiness and average stipend.
  * **Pending Action Banner**: Highlighting pending corporate verification requests and unverified student certificates.

#### 30. User & Role Management (`user_role_management_nexus_academic/code.html`)
* **Purpose**: Administration of accounts across students, faculty, industry recruiters, and staff.
* **On-Site Features & Interactive Options**:
  * **Search & Filter Bar**: Search by name, email, roll number, or organization.
  * **Role Filter Tabs**: *All*, *Students*, *Academicians*, *Industry Partners*.
  * **User Directory Table**:
    * User Name & Email.
    * Role Badge with distinct styling (`STUDENT`, `INDUSTRY`, `ACADEMICIAN`).
    * Affiliation / Department.
    * Account Status (`ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`).
    * Registration Date.
  * **Governance Actions**:
    * Verify / Approve account.
    * Suspend / Deactivate account.
    * Reset Password trigger.
    * Change Role authorization.
  * **Batch Import**: CSV bulk-upload tool for student enrollment rosters.

#### 31. Approval & Verification Queue (`approval_verification_nexus_academic/code.html`)
* **Purpose**: Trust and safety gatekeeper ensuring valid credentials and legitimate corporate partners.
* **On-Site Features & Interactive Options**:
  * **Verification Categories**:
    * *Industry Partner Registrations* (Corporate identity, CIN / GST verification).
    * *Student External Certificates* (Off-campus credentials submitted for academic credit).
    * *Internship Completion Reports* (Formal employer sign-offs).
  * **Verification Cards Queue**:
    * Submitter name and entity.
    * Submitted document preview (PDF thumbnail viewer).
    * Submission timestamp and metadata.
    * Rejection Reason input textarea.
    * *"Approve"* (instant status update + notification) and *"Reject"* buttons.

#### 32. Analytics & Reports (`analytics_reports_nexus_academic/code.html`)
* **Purpose**: Comprehensive data analytics and automated reporting for NAAC, NBA, and NIRF regulatory compliance.
* **On-Site Features & Interactive Options**:
  * **Metric Visualizations**:
    * Placement Rate vs Skill Score correlation scatter plot.
    * Top 10 In-Demand Technologies across hiring partners bar chart.
    * Salary / Stipend distribution histogram.
  * **Custom Report Generator**:
    * Select Date Range (Academic Semester / Year).
    * Select Metric Scope (Department-wise, Program-wise, Gender diversity).
    * Output Format selector (`PDF Report`, `Excel Spreadsheet`, `CSV Data`).
  * **"Export Official Accreditation Report" Button**: Downloads pre-formatted report complying with regulatory institutional criteria.

---

## 5. Domain Data Model & Database Architecture

The relational schema is implemented in Prisma ORM (`backend/prisma/schema.prisma`) targeting PostgreSQL. It models all stakeholder personas, transactions, assessments, and collaboration artifacts.

### 5.1 Entity-Relationship Diagram (ERD)

```
       ┌───────────┐ 1      1 ┌──────────────────┐
       │   User    ├──────────┤  StudentProfile  │
       │           │          └─────────┬────────┘
       │           │                    │ 1
       │           │                    │
       │           │                    ▼ 1
       │           │          ┌──────────────────┐
       │           │          │   SkillProfile   │
       │           │          └─────────┬────────┘
       │           │                    │ 1
       │           │                    │
       │           │                    ▼ *
       │           │          ┌──────────────────┐
       │           │          │    SkillScore    │
       │           │          └─────────▲────────┘
       │           │                    │ *
       │           │          ┌─────────┴────────┐
       │           │          │  SkillCategory   │
       │           │          └─────────┬────────┘
       │           │                    │ 1
       │           │                    │
       │           │                    ▼ *
       │           │          ┌──────────────────┐
       │           │          │IndustryBenchmark │
       │           │          └──────────────────┘
       │           │
       │           │ 1      1 ┌──────────────────┐
       │           ├──────────┤ IndustryProfile  │
       │           │          └─────────┬────────┘
       │           │                    │ 1
       │           │                    │
       │           │       ┌────────────┼────────────┐
       │           │       │ *          │ *          │ *
       │           │       ▼            ▼            ▼
       │           │ ┌───────────┐┌───────────┐┌───────────┐
       │           │ │JobPosting ││LearningPrg││    FDP    │
       │           │ └─────┬─────┘└─────┬─────┘└───────────┘
       │           │       │ 1          │ 1
       │           │       │            │
       │           │       ▼ *          ▼ *
       │           │ ┌───────────┐┌───────────┐
       │           │ │Application││Enrollment │
       │           │ └───────────┘└─────┬─────┘
       │           │                    │ 1
       │           │                    ▼ 1
       │           │              ┌───────────┐
       │           │              │Certificate│
       │           │              └───────────┘
       │           │
       │           │ 1      1 ┌──────────────────┐
       │           ├──────────┤AcademicianProfile│
       │           │          └──────────────────┘
       │           │
       │           │ 1      1 ┌──────────────────┐
       │           ├──────────┤InstitutionProfile│
       │           │          └──────────────────┘
       │           │
       │           │ 1      * ┌──────────────────┐
       │           └──────────┤   Notification   │
       │                      └──────────────────┘
```

### 5.2 Core Database Entities & Field Specifications

#### `User`
* `id` (UUID, Primary Key)
* `email` (String, Unique)
* `passwordHash` (String, bcrypt)
* `role` (Enum: `STUDENT`, `INDUSTRY`, `ACADEMICIAN`, `INSTITUTION_ADMIN`)
* `isVerified` (Boolean, Default: `false`)
* `isActive` (Boolean, Default: `true`)
* `refreshToken` (String, Nullable)
* `createdAt` / `updatedAt` (DateTime)

#### `StudentProfile`
* `id` (UUID, Primary Key), `userId` (FK -> User)
* `firstName`, `lastName`, `phone`, `avatarUrl`
* `institution`, `department`, `year` (Int), `cgpa` (Float)
* `bio`, `linkedinUrl`, `githubUrl`, `resumeUrl`

#### `IndustryProfile`
* `id` (UUID, Primary Key), `userId` (FK -> User)
* `companyName`, `industry`, `website`, `logoUrl`, `bannerUrl`
* `description`, `location`, `size`, `foundedYear` (Int)
* `isVerified` (Boolean, Default: `false`)

#### `AcademicianProfile`
* `id` (UUID, Primary Key), `userId` (FK -> User)
* `firstName`, `lastName`, `institution`, `department`, `designation`, `specialization`

#### `InstitutionProfile`
* `id` (UUID, Primary Key), `userId` (FK -> User)
* `institutionName`, `address`, `website`, `logoUrl`, `contactEmail`

#### `SkillAssessment` & Mapping Models
* `SkillCategory`: `id`, `name`, `type` (`technical` | `soft`), `description`
* `AssessmentTemplate`: `id`, `title`, `description`, `timeLimit` (Minutes), `isActive`
* `AssessmentQuestion`: `id`, `templateId`, `categoryId`, `questionText`, `optionA`, `optionB`, `optionC`, `optionD`, `correctAnswer`, `weight` (Float)
* `AssessmentResponse`: `id`, `studentId`, `templateId`, `answers` (JSON `{ questionId: selectedOption }`), `completedAt`
* `SkillProfile`: `id`, `studentId` (Unique), `overallScore` (Float), `lastUpdated`
* `SkillScore`: `id`, `skillProfileId`, `categoryId`, `score` (Float 0-100)
* `IndustryBenchmark`: `id`, `jobRole` (String), `categoryId` (FK), `minScore` (Float)

#### `JobPosting` & `Application`
* `JobPosting`: `id`, `industryId`, `title`, `description`, `requiredSkills` (String Array), `jobType` (`internship` | `fulltime`), `location`, `isRemote` (Boolean), `stipend` (Float), `duration`, `deadline`, `status` (`ACTIVE` | `CLOSED` | `DRAFT`)
* `Application`: `id`, `studentId`, `postingId`, `status` (`APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`), `coverLetter`, `matchScore` (Float), `appliedAt`

#### `LearningProgram`, `Enrollment`, `Certificate`
* `LearningProgram`: `id`, `industryId`, `title`, `description`, `skillsCovered` (String Array), `duration`, `hasCertificate` (Boolean)
* `Enrollment`: `id`, `studentId`, `programId`, `status` (`ENROLLED`, `IN_PROGRESS`, `COMPLETED`), `enrolledAt`, `completedAt`
* `Certificate`: `id`, `studentId`, `enrollmentId`, `title`, `issuer`, `credentialUrl`, `verificationStatus` (`PENDING`, `APPROVED`, `REJECTED`)

#### Academician Collaboration Models
* `FDP`: `id`, `industryId`, `title`, `duration`, `startDate`, `endDate`, `mode` (`online` | `offline` | `hybrid`), `isActive`
* `ResearchCollaboration`: `id`, `industryId`, `title`, `description`, `requiredExpertise` (String Array), `deadline`, `isOpen`
* `Workshop`: `id`, `industryId`, `title`, `speaker`, `date`, `duration`, `mode`, `location`

#### Messaging & Notifications
* `Notification`: `id`, `userId`, `type` (Enum), `title`, `body`, `isRead`, `metadata` (JSON), `createdAt`
* `Conversation`: `id`, `createdAt`, `updatedAt`
* `ConversationParticipant`: `id`, `conversationId`, `userId`
* `Message`: `id`, `conversationId`, `senderId`, `content`, `isRead`, `sentAt`

---

## 6. Algorithmic Intelligence & Business Logic

### 6.1 Skill Assessment & Scoring Algorithm
1. **Weighted Category Computation**:
   When a student completes an assessment:
   $$\text{CategoryScore}(c) = \frac{\sum_{q \in Q_c} \mathbf{1}_{(\text{answer}_q == \text{correct}_q)} \times \text{weight}_q}{\sum_{q \in Q_c} \text{weight}_q} \times 100$$
2. **Overall Normalized Profile Score**:
   $$\text{OverallScore} = \frac{1}{|C|} \sum_{c \in C} \text{CategoryScore}(c)$$
3. The scores are persisted into `SkillScore` and `SkillProfile`.

### 6.2 Industry Benchmark Gap Analysis
For any selected job role (e.g., *"Data Scientist"*):
$$\text{Gap}(c) = \max\left(0, \text{BenchmarkScore}(\text{role}, c) - \text{StudentScore}(c)\right)$$
* If $\text{Gap}(c) == 0$, skill is classified as **Strength** ($\ge \text{Benchmark}$).
* If $\text{Gap}(c) > 0$, skill is classified as **Deficiency / Gap**. The system triggers dynamic queries to `LearningProgram` records where `skillsCovered` intersects with $\{c\}$.

### 6.3 Multi-Factor Candidate-Job Matching Algorithm
When matching students with job postings or ranking applicants for an industry recruiter:
$$\text{MatchScore} = w_1 \cdot S_{\text{skills}} + w_2 \cdot S_{\text{academic}} + w_3 \cdot S_{\text{readiness}}$$
Where:
* $S_{\text{skills}}$ = Jaccard & score intersection between student verified skills and `JobPosting.requiredSkills`:
  $$S_{\text{skills}} = \frac{\sum_{s \in \text{required}} \min(1.0, \frac{\text{StudentScore}(s)}{\text{ReqScore}(s)})}{|\text{requiredSkills}|} \times 100$$
* $S_{\text{academic}}$ = CGPA normalized against minimum threshold eligibility.
* $S_{\text{readiness}}$ = Overall assessment readiness index.
* Default weights: $w_1 = 0.60$ (Skills), $w_2 = 0.20$ (Academics), $w_3 = 0.20$ (Overall Assessment).

---

## 7. API Architecture & REST Specifications

All endpoints are hosted at `/api/v1` and documented interactively via Swagger UI at `/api`.

| Module | Method | Endpoint | Access Role | Description |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/register` | Public | Register new user account |
| **Auth** | `POST` | `/auth/login` | Public | Login with credentials; returns Access & Refresh tokens |
| **Auth** | `POST` | `/auth/refresh` | Public | Refresh expired access token |
| **Auth** | `POST` | `/auth/onboarding` | Authenticated | Complete initial role profile onboarding |
| **Users** | `GET` | `/users/me` | Authenticated | Fetch active user identity and profile entity |
| **Users** | `PUT` | `/users/me` | Authenticated | Update user profile data |
| **Assessments** | `GET` | `/assessments/templates` | Student | Retrieve active MCQ assessment questions |
| **Assessments** | `POST` | `/assessments/submit` | Student | Submit test responses; computes skill scores |
| **Assessments** | `GET` | `/assessments/skill-profile/:id` | Authenticated | Retrieve radar scores and benchmark gap report |
| **Assessments** | `GET` | `/assessments/recommendations/:id`| Student | Get AI role fit & course recommendations |
| **Internships** | `GET` | `/internships` | Authenticated | Search, filter, and list active job postings |
| **Internships** | `POST` | `/internships` | Industry | Create and publish a new internship/job posting |
| **Internships** | `GET` | `/internships/:id` | Authenticated | Retrieve detailed job posting metadata |
| **Internships** | `POST` | `/internships/:id/apply` | Student | Apply for a posting with resume & cover letter |
| **Internships** | `GET` | `/internships/:id/candidates` | Industry | Get AI-ranked applicant pool for a posting |
| **Internships** | `PATCH`| `/internships/applications/:id/status`| Industry | Update candidate Kanban stage (Applied, Shortlisted, etc.) |
| **Internships** | `GET` | `/internships/my-applications` | Student | Get application history for student tracker |
| **Learning** | `GET` | `/learning-programs` | Authenticated | Browse available industry training programs |
| **Learning** | `POST` | `/learning-programs` | Industry | Create and publish a new training module |
| **Learning** | `POST` | `/learning-programs/:id/enroll`| Student | Enroll in a training program |
| **Learning** | `PATCH`| `/learning-programs/:id/complete`| Student/Industry | Complete module and auto-generate verified certificate |
| **Analytics** | `GET` | `/analytics/student/dashboard` | Student | Fetch student KPIs, match counts, and deadlines |
| **Analytics** | `GET` | `/analytics/industry/dashboard` | Industry | Fetch recruitment funnel and posting stats |
| **Analytics** | `GET` | `/analytics/academician/dashboard` | Academician | Fetch cohort progress and FDP stats |
| **Analytics** | `GET` | `/analytics/institution/dashboard` | Admin | Fetch institutional placement metrics & skill heatmaps |
| **Faculty** | `GET` | `/academicians/fdps` | Academician | List available Faculty Development Programs |
| **Faculty** | `GET` | `/academicians/research-collaborations`| Academician/Industry| List collaborative R&D opportunities |
| **Faculty** | `POST` | `/academicians/research-collaborations`| Academician/Industry| Post new collaborative research RFP |
| **Faculty** | `GET` | `/academicians/student-progress`| Academician | Monitor assigned mentee progress and readiness |
| **Admin** | `GET` | `/admin/users` | Admin | Search and list all registered platform users |
| **Admin** | `PATCH`| `/admin/users/:id/status` | Admin | Activate, suspend, or modify user account |
| **Admin** | `GET` | `/admin/verifications` | Admin | Get list of pending partner and certificate verifications |
| **Admin** | `PATCH`| `/admin/verifications/industry/:id` | Admin | Approve or reject industry partner onboarding |
| **Messaging** | `GET` | `/messages/conversations` | Authenticated | List all active conversation threads |
| **Messaging** | `POST` | `/messages/conversations/:id` | Authenticated | Send real-time chat message |
| **Notifications**| `GET`| `/notifications` | Authenticated | Retrieve user notification inbox |
| **Notifications**| `PATCH`| `/notifications/:id/read` | Authenticated | Mark notification as read |

---

## 8. Frontend Integration & Client Architecture

### 8.1 Shared Architecture via `nexus-shared.js`
The entire suite of 33+ HTML pages is unified using a shared client engine (`nexus-shared.js`):
1. **Dynamic Navigation & Role Injection**:
   * Inspects the active user session stored in `localStorage` (`nexus_user`).
   * Dynamically renders role-specific sidebar navigation links matching the authenticated persona (`STUDENT`, `INDUSTRY`, `ACADEMICIAN`, `INSTITUTION_ADMIN`).
   * Injects top header bar containing user avatar, notification bell with unread badge, role tag, and logout action.
2. **JWT Auto-Refresh Interceptor (`nexusFetch`)**:
   * Wraps native `fetch` requests with `Authorization: Bearer <accessToken>`.
   * Intercepts `401 Unauthorized` responses, executes silent token refresh against `/auth/refresh` using `refreshToken`, updates credentials in storage, and transparently replays the original request.
   * Redirects unauthenticated users to `/login_sign_up_nexus_academic/code.html` when session expires.
3. **Route Guarding**:
   * Automatically protects private pages from unauthorized access, allowing only whitelisted public routes (Landing, Login, Onboarding).
4. **Toast Notification System**:
   * Provides unified feedback for user actions (`showToast(message, type)`: success, error, info).

### 8.2 Design Tokens & Visual Language
* **Primary Accent Palette**: Deep Royal Blue (`#2563EB`), Mid-Blue (`#4A90E2`), Ice Blue Surface (`#EAF3FF`, `#BFDCFF`).
* **Backgrounds**: Ultra-clean pure white (`#FFFFFF`) and soft off-white surface layers (`#F8FAFC`).
* **Typography**: Modern geometric sans-serif (Inter / Poppins), standard font scale (`label-sm`, `body-md`, `headline-md`, `display-sm`).
* **Component Styling**: Consistent `12px` to `16px` rounded corners, subtle multi-layer drop shadows (`0 4px 20px -2px rgba(37, 99, 235, 0.08)`), flat-vector illustrative iconography.

---

## 9. Non-Functional Requirements (NFRs)

### 9.1 Performance & Latency
* **API Response Time**: 95% of standard read API calls must return in under `150ms`. Complex recommendation computations must respond in under `400ms`.
* **Frontend Rendering**: First Contentful Paint (FCP) under `1.2s` on standard 4G network connections.
* **Database Optimization**: Indexed foreign keys, compound index on `(studentId, postingId)`, and pagination on all listing endpoints (default 20 records per page).

### 9.2 Security & Compliance
* **Password Hashing**: Cryptographic salting and hashing via `bcrypt` (10 rounds).
* **Token Security**: Dual-token pattern; access token TTL set to 7 days (prototyping) with refresh token rotation.
* **Role-Based Access Control (RBAC)**: Enforced at both NestJS controller layer (`@Roles()` decorator + `RolesGuard`) and frontend route guards.
* **Input Sanitization**: NestJS global `ValidationPipe` with `whitelist: true` and `transform: true` using `class-validator` to eliminate injection vulnerabilities.

### 9.3 Scalability & Reliability
* **Stateless Backend**: The NestJS application server is completely stateless, enabling horizontal scaling across multiple container instances behind an NGINX / Cloud Load Balancer.
* **Database Portability**: Prisma ORM abstraction allows zero-downtime transition from embedded local PostgreSQL to AWS RDS / Google Cloud SQL / Supabase.

---

## 10. Release Roadmap & Implementation Milestones

```
PHASE 1: Core Foundation (Completed)
├── Modular NestJS API Architecture & Prisma ORM Schema
├── Authentication Engine with Dual-Token Lifecycle & Role Guards
├── Embedded PostgreSQL Zero-Config Storage
└── 33+ High-Fidelity Illustrative Frontend Screen Interfaces

PHASE 2: Integration & Transaction Flows (Current Phase)
├── Global Client Orchestration via nexus-shared.js
├── Interactive Skill Assessment Submission & Radar Generation
├── Real-time Job Application Lifecycle & Kanban Drag-and-Drop
└── Recruiter Multi-Factor Candidate Ranking System

PHASE 3: Collaboration & Deep Intelligence (Next Phase)
├── Live WebRTC Video Interview Scheduling & Screen Sharing
├── AI-Powered Resume Parser & Automated Assessment Generation
├── Blockchain-Anchored Verifiable Credentials (W3C Standard)
└── Direct Integration with University ERPs (SAP, DigiLocker, Canvas LMS)
```

---

## 11. Appendix: Complete Directory & File Manifest

```
/SIH
├── PRD.md                                           ← This Document
├── README.md                                        ← Quick Start & Execution Guide
├── Academia-Industry-Portal-Design.md              ← Original Design Specifications & Stitch Prompts
├── Antigravity-Backend-Build-Prompt.md             ← Backend Architecture Blueprint
│
├── backend/                                         ← NestJS REST API Server
│   ├── prisma/
│   │   ├── schema.prisma                            ← Complete Relational Data Models
│   │   └── seed.ts                                  ← Comprehensive Mock Data Seed
│   └── src/
│       ├── app.module.ts                            ← Root Application Module
│       ├── main.ts                                  ← NestJS Entrypoint (Port 3001)
│       └── modules/
│           ├── auth/                                ← Authentication & Token Management
│           ├── users/                               ← User Management
│           ├── assessments/                         ← Skill Testing & Benchmark Gaps
│           ├── internships/                         ← Jobs, Applications & Candidate Matching
│           ├── learning/                            ← Training Modules & Certificates
│           ├── academicians/                        ← FDPs, Research & Workshops
│           ├── analytics/                           ← Multi-Persona Dashboards & Metrics
│           ├── admin/                               ← User Governance & Verifications
│           ├── messages/                            ← 1:1 Direct Chat System
│           ├── notifications/                       ← In-App Notification Feed
│           └── uploads/                             ← Document & File Asset Handling
│
└── stitch_academia_industry_collaboration_hub/      ← Frontend UI Application
    ├── nexus-shared.js                              ← Universal API Client & Sidebar Injector
    ├── nexus_academic_landing_page/                 ← 1. Public Landing Page
    ├── login_sign_up_nexus_academic/                ← 2. Authentication & Sign Up
    ├── onboarding_welcome_to_nexus_academic/        ← 3. 3-Step Onboarding Wizard
    ├── notifications_center_nexus_academic/         ← 4. Notifications Feed
    ├── messaging_nexus_academic/                    ← 5. 1:1 Direct Messaging
    ├── help_support_nexus_academic/                 ← 6. Help Center & FAQs
    ├── profile_settings_nexus_academic/             ← 7. Account & Profile Settings
    ├── student_dashboard_nexus_academic/            ← 8. Student Operational Dashboard
    ├── skill_assessment_nexus_academic/             ← 9. Proctored MCQ Assessment Lab
    ├── skill_profile_gap_report_nexus_academic/     ← 10. Visual Skill Radar & Gap Analysis
    ├── internship_job_listings_nexus_academic/      ← 12. Searchable Job Marketplace
    ├── internship_detail_senior_data_science_.../   ← 13. Job Detail & Application View
    ├── application_tracker_nexus_academic/          ← 14. Application Kanban Tracker
    ├── digital_portfolio_nexus_academic/            ← 15. Verifiable Digital Portfolio
    ├── learning_programs_nexus_academic/            ← 16. Upskilling & Course Catalog
    ├── industry_dashboard_nexus_academic/           ← 17. Recruiter Executive Dashboard
    ├── post_internship_job_nexus_academic/          ← 18. Job Posting Form & Live Preview
    ├── manage_postings_nexus_academic/              ← 19. Postings Management Table
    ├── candidate_matching_shortlisting_nexus.../    ← 20. AI Candidate Ranking & Shortlisting
    ├── applicant_profile_detail_nexus_academic/     ← 21. Candidate Evaluation Dossier
    ├── publish_training_program_nexus_academic/     ← 22. Course Creation Tool
    ├── industry_analytics_nexus_academic/           ← 23. Recruitment Funnel Analytics
    ├── academician_dashboard_nexus_academic/        ← 25. Faculty Command Dashboard
    ├── faculty_internship_fdp_listings_nexus.../    ← 26. FDP & Sabbatical Listings
    ├── research_consultancy_collaboration_nexus.../ ← 27. Joint R&D Project Board
    ├── student_progress_monitoring_nexus_academic/  ← 28. Cohort Benchmark Tracking
    ├── workshops_guest_lecture_scheduling_nexus.../ ← 29. Lecture Calendar Coordination
    ├── institution_admin_dashboard_nexus_academic/  ← 30. Institutional Placement Cockpit
    ├── user_role_management_nexus_academic/         ← 31. User Governance & Role Controls
    ├── analytics_reports_nexus_academic/            ← 32. Accreditation Reports (NAAC/NBA)
    └── approval_verification_nexus_academic/        ← 33. Partner & Certificate Verifications
```

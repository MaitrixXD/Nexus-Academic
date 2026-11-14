# Prompt for Antigravity — Backend, Database & Integration Build

Copy everything below the line into Antigravity as your instruction/prompt.

---

## Context

I am building a prototype for the problem statement **"Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement."**

I have already:
1. Designed and generated all frontend UI pages using Stitch (they are in the project folder you have open).
2. Attached a system design document (`Academia-Industry-Portal-Design.md`) containing the overall architecture, tech stack suggestion, module breakdown, and the full list of pages with their required features.

Your task now is to **build the backend, database, and all necessary integration logic** so that the existing frontend pages become a fully functional, demo-ready prototype. Treat the attached design document as the source of truth for scope, modules, and page-to-feature mapping — read it fully before writing any code.

---

## Your Task

### 1. Analyze First
- Read `Academia-Industry-Portal-Design.md` completely.
- Scan the existing frontend pages/folder to identify: page names, components, forms, buttons, and any placeholder data or mock API calls already present.
- Produce a short plan (in chat, before coding) mapping: **Frontend Page → Backend Endpoint(s) → Database Table(s) → Key Logic**. Confirm this plan with me before large-scale code generation if anything is ambiguous.

### 2. Backend Requirements

Build a modular backend (microservice-style folders within a single repo is fine for prototype scope; do not over-engineer into separate deployable services) covering these modules:

1. **Auth & User Service**
   - Role-based registration/login for 4 roles: Student, Industry, Academician, Institution Admin.
   - JWT-based authentication, password hashing (bcrypt), refresh tokens.
   - Role-based access control (RBAC) middleware protecting routes by role.
   - Email/OTP verification flow (mock/stub is fine for prototype — log OTP to console instead of real SMS/email service).

2. **Skill Assessment & Mapping Service**
   - CRUD for questionnaire templates (technical + soft skill questions, multiple choice, weighted scoring).
   - Endpoint to submit assessment answers and compute a skill profile (scored per skill category).
   - Skill-gap calculation: compare student's skill vector against a configurable "industry requirement" benchmark (store benchmarks per job role/industry in DB, seed with sample data).
   - Recommendation logic: given a skill profile, return top matching job roles, industries, and suggested courses (simple weighted-score/cosine-similarity matching is sufficient for prototype — no need for a full ML pipeline unless I ask for it later).

3. **Internship & Placement Service**
   - CRUD for internship/job postings (industry-side): title, description, required skills (array), duration, stipend/salary, eligibility, location, deadline.
   - Search/filter/pagination endpoint for listings (by skill, location, stipend range, duration).
   - Application endpoint: student applies to a posting; store status (Applied → Shortlisted → Interview → Selected/Rejected).
   - Matching engine endpoint: given a posting's required skills, rank applicants by skill-fit percentage (simple overlap/weighted score against student skill profile).
   - Status update endpoints for industry users to move applicants through pipeline stages.

4. **Learning & Certification Service**
   - CRUD for learning programs/courses/workshops published by industry (title, description, skills covered, duration, certificate).
   - Enrollment endpoint for students; track completion status.
   - On completion, auto-generate a verified credential entry linked to the student's portfolio.

5. **Digital Portfolio Service**
   - Aggregate endpoint that pulls a student's verified skills, certificates, completed courses, internship records, and achievements into a single portfolio view.
   - Endpoint to generate/export a portfolio summary (JSON now; PDF export can be a stretch goal).

6. **Academician & Collaboration Service**
   - CRUD for Faculty Development Programs (FDPs), industrial training listings, research/consultancy opportunities (posted by industry, browsed/applied by academicians).
   - CRUD for workshops/guest lecture scheduling (title, date/time, speaker, linked institution).
   - Endpoint for academicians to view progress of their assigned students (skill scores, internship/placement status) — pull from Student & Internship services.

7. **Notification & Messaging Service**
   - Basic notification model: triggered on key events (application status change, new match found, new message, new posting matching a student's profile).
   - Store notifications per user with read/unread state; simple polling endpoint is fine for prototype (WebSocket/real-time is a stretch goal, not required for MVP).
   - Basic one-to-one messaging: conversation and message models, send/fetch endpoints.

8. **Analytics & Dashboard Service**
   - Aggregation endpoints for each dashboard:
     - Student dashboard: skill score, active applications count, recommended internships count, upcoming deadlines.
     - Industry dashboard: active postings, total applicants, shortlisted count, positions filled, applications-over-time series.
     - Academician dashboard: assigned students count, ongoing FDPs, research collaborations, upcoming workshops.
     - Institution admin dashboard: placement %, active students, partner industries, skill-gap index, department-wise performance.
   - Keep these as clearly separated, well-named endpoints (e.g. `/api/analytics/student/:id`, `/api/analytics/industry/:id`, etc.) so the frontend dashboard pages can each call one endpoint.

9. **Document Management**
   - File upload endpoints for resumes, certificates, internship reports (store in local `/uploads` folder for prototype, structured so it can later be swapped for S3/Blob storage without touching business logic).
   - Return secure file URLs; enforce file-type/size validation.

10. **Admin & Verification**
    - Endpoints for institution admins to approve/reject industry partner registrations and verify uploaded certificates.
    - User management endpoints (list/suspend/activate users) restricted to Institution Admin role.

---

### 3. Database Design

- Design a normalized relational schema (PostgreSQL preferred) for: Users (with role field), StudentProfiles, IndustryProfiles, AcademicianProfiles, InstitutionProfiles, SkillCategories, AssessmentQuestions, AssessmentResponses, SkillProfiles, JobPostings, Applications, LearningPrograms, Enrollments, Certificates/Portfolio items, FDPs, ResearchCollaborations, Workshops, Notifications, Messages/Conversations, Analytics snapshots (or compute on the fly via queries — your judgment).
- Use a document-friendly structure (JSON columns or a secondary MongoDB collection) only where clearly beneficial — e.g., flexible questionnaire structures or portfolio item metadata — but keep the core relational integrity (foreign keys, constraints) for users, postings, and applications.
- Write the schema as migration files (e.g., Prisma schema / TypeORM entities / SQL migration scripts — pick based on the backend framework you choose, see below).
- Seed the database with realistic sample data: at least 10 students, 5 industries with job/internship postings, 3 academicians, 1 institution admin, sample assessment questions, and sample benchmarks — so the prototype is demo-ready immediately after setup.

---

### 4. Suggested Tech Stack (adjust only if you have a strong reason; tell me why)

- **Backend framework:** Node.js with Express or NestJS (NestJS preferred for the modular structure described above).
- **Database:** PostgreSQL as primary DB, with Prisma or TypeORM as ORM.
- **Auth:** JWT + bcrypt, RBAC middleware/guards.
- **File storage:** Local disk for prototype, abstracted behind a storage-service interface.
- **API style:** RESTful JSON APIs, versioned under `/api/v1/...`.
- **Validation:** class-validator/Zod or equivalent schema validation on all inputs.
- **API documentation:** Auto-generate Swagger/OpenAPI docs for every endpoint.

---

### 5. Integration with Existing Frontend

- Do not redesign or restyle the existing Stitch-generated pages. Only:
  - Replace any placeholder/mock data in the pages with real API calls to your new backend.
  - Wire up forms (login, sign-up, post job, submit assessment, apply to internship, etc.) to the correct endpoints.
  - Add loading states and error handling consistent with the existing page design (don't introduce new UI patterns unless a page has no way to show an error/loading state, in which case keep additions minimal and visually consistent with the existing white/light-blue style).
- Set up environment-based API base URL configuration (`.env` file) so the frontend can point to local backend during development.
- Enable CORS appropriately for local development.

---

### 6. Non-Functional Requirements

- Structure the repo clearly, e.g.:
  ```
  /backend
    /src
      /modules (auth, students, industry, assessments, internships, learning, portfolio, academicians, notifications, analytics, admin)
      /common (guards, decorators, interceptors, filters)
      /config
    /prisma (or /migrations)
    /uploads
  /frontend (existing Stitch pages)
  ```
- Add a root-level `README.md` explaining: setup steps, environment variables needed, how to run migrations & seed data, how to start backend/frontend together, and a summary of available API routes.
- Include basic error handling and input validation on every endpoint — don't let the prototype crash on bad input.
- Keep code readable and commented where logic is non-obvious (e.g., matching/scoring algorithms).

---

### 7. What NOT to Do
- Do not build a production-grade ML recommendation pipeline — a clear, explainable scoring/matching algorithm is sufficient and preferred for a hackathon prototype (judges can understand "80% skill overlap" more easily than a black-box model).
- Do not integrate real third-party services (payment gateways, real SMS/email providers, real cloud storage) — stub/mock these clearly with comments indicating where a real integration would go.
- Do not modify the visual design of the already-created Stitch pages beyond what's needed to wire in real data and basic states (loading/error/empty).

---

### 8. Deliverable & Order of Work

Please work in this order and check in with me after each phase:
1. Confirm the Frontend Page → Endpoint → Table mapping plan.
2. Set up project structure, database schema, migrations, and seed data.
3. Build Auth & User service; connect Login/Sign-up/Onboarding pages.
4. Build Skill Assessment & Mapping service; connect assessment/profile/recommendation pages.
5. Build Internship & Placement service; connect listings/detail/application-tracker pages.
6. Build Industry-side posting, matching, and analytics; connect industry dashboard/pages.
7. Build Learning, Portfolio, Academician/Collaboration, Notifications/Messaging modules; connect remaining pages.
8. Build Institution Admin & Analytics dashboards; connect remaining pages.
9. Final integration pass: seed realistic demo data end-to-end, verify every page loads real data, write the README.

At each phase, tell me what you built, what endpoints were added, and any assumptions you made so I can review before moving forward.

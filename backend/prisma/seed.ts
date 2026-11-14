/**
 * seed.ts — Nexus Academic Demo Data Seeder
 * Loads realistic demo data for all 4 roles so every page shows real content.
 * Run: npm run db:seed
 */

import { PrismaClient, Role, ApplicationStatus, PostingStatus, EnrollmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Nexus Academic demo data...\n');

  // ─── CLEANUP ───────────────────────────────────────────────────────────────
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.conversationParticipant.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.uploadedFile.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.skillScore.deleteMany(),
    prisma.skillProfile.deleteMany(),
    prisma.assessmentResponse.deleteMany(),
    prisma.assessmentQuestion.deleteMany(),
    prisma.assessmentTemplate.deleteMany(),
    prisma.industryBenchmark.deleteMany(),
    prisma.skillCategory.deleteMany(),
    prisma.application.deleteMany(),
    prisma.jobPosting.deleteMany(),
    prisma.learningProgram.deleteMany(),
    prisma.workshop.deleteMany(),
    prisma.researchCollaboration.deleteMany(),
    prisma.fDP.deleteMany(),
    prisma.studentProfile.deleteMany(),
    prisma.industryProfile.deleteMany(),
    prisma.academicianProfile.deleteMany(),
    prisma.institutionProfile.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('🗑  Cleared existing data');

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // ─── SKILL CATEGORIES ──────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.skillCategory.create({ data: { name: 'Machine Learning', type: 'technical', description: 'ML algorithms, model training, evaluation' } }),
    prisma.skillCategory.create({ data: { name: 'Data Analysis', type: 'technical', description: 'Statistical analysis, visualization, data wrangling' } }),
    prisma.skillCategory.create({ data: { name: 'Web Development', type: 'technical', description: 'Frontend/backend web technologies' } }),
    prisma.skillCategory.create({ data: { name: 'Cloud Computing', type: 'technical', description: 'AWS, Azure, GCP services and deployment' } }),
    prisma.skillCategory.create({ data: { name: 'Communication', type: 'soft', description: 'Written and verbal communication' } }),
    prisma.skillCategory.create({ data: { name: 'Problem Solving', type: 'soft', description: 'Analytical thinking and problem decomposition' } }),
    prisma.skillCategory.create({ data: { name: 'Teamwork', type: 'soft', description: 'Collaboration and team dynamics' } }),
    prisma.skillCategory.create({ data: { name: 'Research', type: 'technical', description: 'Literature review, experimental design, writing' } }),
  ]);
  console.log('✅ Skill categories created');

  // ─── INDUSTRY BENCHMARKS ───────────────────────────────────────────────────
  const jobRoles = ['Data Scientist', 'Full Stack Developer', 'ML Engineer', 'Cloud Architect', 'Research Analyst'];
  const benchmarkData = [
    // Data Scientist
    { jobRole: 'Data Scientist', catName: 'Machine Learning', minScore: 75 },
    { jobRole: 'Data Scientist', catName: 'Data Analysis', minScore: 80 },
    { jobRole: 'Data Scientist', catName: 'Problem Solving', minScore: 70 },
    { jobRole: 'Data Scientist', catName: 'Research', minScore: 65 },
    // Full Stack Developer
    { jobRole: 'Full Stack Developer', catName: 'Web Development', minScore: 80 },
    { jobRole: 'Full Stack Developer', catName: 'Problem Solving', minScore: 70 },
    { jobRole: 'Full Stack Developer', catName: 'Teamwork', minScore: 65 },
    // ML Engineer
    { jobRole: 'ML Engineer', catName: 'Machine Learning', minScore: 85 },
    { jobRole: 'ML Engineer', catName: 'Cloud Computing', minScore: 70 },
    { jobRole: 'ML Engineer', catName: 'Data Analysis', minScore: 75 },
    // Cloud Architect
    { jobRole: 'Cloud Architect', catName: 'Cloud Computing', minScore: 85 },
    { jobRole: 'Cloud Architect', catName: 'Problem Solving', minScore: 75 },
    // Research Analyst
    { jobRole: 'Research Analyst', catName: 'Research', minScore: 80 },
    { jobRole: 'Research Analyst', catName: 'Data Analysis', minScore: 75 },
    { jobRole: 'Research Analyst', catName: 'Communication', minScore: 70 },
  ];

  for (const b of benchmarkData) {
    const cat = categories.find(c => c.name === b.catName);
    if (cat) {
      await prisma.industryBenchmark.create({
        data: { jobRole: b.jobRole, categoryId: cat.id, minScore: b.minScore }
      });
    }
  }
  console.log('✅ Industry benchmarks created');

  // ─── ASSESSMENT TEMPLATE ───────────────────────────────────────────────────
  const template = await prisma.assessmentTemplate.create({
    data: {
      title: 'Nexus Academic Skill Assessment',
      description: 'Comprehensive skill assessment covering technical and soft skills.',
      isActive: true,
      timeLimit: 45,
    }
  });

  // Questions per category
  const questionBank = [
    // Machine Learning
    { cat: 'Machine Learning', q: 'Which algorithm is best suited for binary classification with imbalanced classes?', a: 'Random Forest with class weights', b: 'K-Means Clustering', c: 'PCA', d: 'Linear Regression', correct: 'A', weight: 1.5 },
    { cat: 'Machine Learning', q: 'What does the "bias-variance tradeoff" refer to?', a: 'Memory vs speed', b: 'Overfitting vs underfitting balance', c: 'Training vs testing split', d: 'Feature selection criteria', correct: 'B', weight: 1.5 },
    { cat: 'Machine Learning', q: 'Which metric is most appropriate for evaluating a model on imbalanced data?', a: 'Accuracy', b: 'R² Score', c: 'F1 Score', d: 'Mean Squared Error', correct: 'C', weight: 1.0 },
    // Data Analysis
    { cat: 'Data Analysis', q: 'What is the purpose of normalization in data preprocessing?', a: 'Remove outliers', b: 'Scale features to a similar range', c: 'Handle missing values', d: 'Encode categorical variables', correct: 'B', weight: 1.0 },
    { cat: 'Data Analysis', q: 'Which visualization is best for showing distribution of a continuous variable?', a: 'Bar chart', b: 'Pie chart', c: 'Histogram', d: 'Scatter plot', correct: 'C', weight: 1.0 },
    // Web Development
    { cat: 'Web Development', q: 'What does REST stand for in API design?', a: 'Remote Execution State Transfer', b: 'Representational State Transfer', c: 'Reliable Event-Streaming Technology', d: 'Recursive Endpoint Service Transfer', correct: 'B', weight: 1.0 },
    { cat: 'Web Development', q: 'Which HTTP status code indicates a resource was successfully created?', a: '200', b: '204', c: '201', d: '301', correct: 'C', weight: 1.0 },
    // Cloud Computing
    { cat: 'Cloud Computing', q: 'What is the primary advantage of serverless computing?', a: 'Lower latency always', b: 'No need for internet', c: 'Pay-per-execution with automatic scaling', d: 'Unlimited compute power', correct: 'C', weight: 1.0 },
    // Communication
    { cat: 'Communication', q: 'Which of the following is a key principle of effective technical writing?', a: 'Use as many technical terms as possible', b: 'Clarity and conciseness', c: 'Avoid structure', d: 'Use passive voice only', correct: 'B', weight: 1.0 },
    // Problem Solving
    { cat: 'Problem Solving', q: 'What is the first step in a structured problem-solving approach?', a: 'Implement a solution immediately', b: 'Define and understand the problem clearly', c: 'Search for similar problems online', d: 'Ask your manager', correct: 'B', weight: 1.0 },
    // Teamwork
    { cat: 'Teamwork', q: 'Which behavior most contributes to a high-performing team?', a: 'Working in isolation', b: 'Competing with teammates', c: 'Open communication and mutual accountability', d: 'Deferring all decisions to the manager', correct: 'C', weight: 1.0 },
    // Research
    { cat: 'Research', q: 'What is a literature review in research methodology?', a: 'Reading fiction books', b: 'Comprehensive survey of existing research on a topic', c: 'Writing a book summary', d: 'Data collection phase', correct: 'B', weight: 1.0 },
  ];

  for (let i = 0; i < questionBank.length; i++) {
    const qb = questionBank[i];
    const cat = categories.find(c => c.name === qb.cat);
    if (cat) {
      await prisma.assessmentQuestion.create({
        data: {
          templateId: template.id,
          categoryId: cat.id,
          questionText: qb.q,
          optionA: qb.a,
          optionB: qb.b,
          optionC: qb.c,
          optionD: qb.d,
          correctAnswer: qb.correct,
          weight: qb.weight,
          order: i + 1,
        }
      });
    }
  }
  console.log('✅ Assessment template and questions created');

  // ─── INSTITUTION ADMIN ─────────────────────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@iit-nexus.edu.in',
      passwordHash,
      role: Role.INSTITUTION_ADMIN,
      isVerified: true,
      institutionProfile: {
        create: {
          institutionName: 'Indian Institute of Technology, Nexus',
          address: 'Nexus Campus, Tech Corridor, Mumbai - 400001',
          website: 'https://iit-nexus.edu.in',
          contactEmail: 'admin@iit-nexus.edu.in',
          contactPhone: '+91-22-1234-5678',
        }
      }
    }
  });
  console.log('✅ Institution admin created');

  // ─── INDUSTRY USERS (5 companies) ─────────────────────────────────────────
  const companies = [
    { email: 'hr@techcorp.io', name: 'TechCorp Innovations', industry: 'Artificial Intelligence', location: 'Bangalore, India', size: '1000-5000' },
    { email: 'talent@biogen.co', name: 'BioGen Research Labs', industry: 'Biotechnology', location: 'Hyderabad, India', size: '500-1000' },
    { email: 'careers@finserve.com', name: 'FinServe Global', industry: 'Financial Technology', location: 'Mumbai, India', size: '5000+' },
    { email: 'jobs@cloudsys.in', name: 'CloudSys Solutions', industry: 'Cloud Computing', location: 'Pune, India', size: '200-500' },
    { email: 'recruit@greentech.org', name: 'GreenTech Ventures', industry: 'Sustainable Technology', location: 'Chennai, India', size: '100-200' },
  ];

  const industryUsers = [];
  for (const co of companies) {
    const u = await prisma.user.create({
      data: {
        email: co.email,
        passwordHash,
        role: Role.INDUSTRY,
        isVerified: true,
        industryProfile: {
          create: {
            companyName: co.name,
            industry: co.industry,
            location: co.location,
            size: co.size,
            isVerified: true,
            description: `${co.name} is a leading organization in ${co.industry}, committed to bridging academia and industry through internships and collaborations.`,
            contactEmail: co.email,
          }
        }
      },
      include: { industryProfile: true }
    });
    industryUsers.push(u);
  }
  console.log('✅ Industry users created (5 companies)');

  // ─── JOB POSTINGS ─────────────────────────────────────────────────────────
  const postingsData = [
    {
      companyIdx: 0, title: 'AI Research Intern', jobType: 'internship',
      description: 'Work alongside our AI research team to develop cutting-edge machine learning models for real-world applications. You will contribute to ongoing research projects, run experiments, and help document findings.',
      skills: ['Machine Learning', 'Python', 'Data Analysis', 'Research'],
      location: 'Bangalore, India', stipend: 25000, duration: '12 weeks',
      eligibility: 'B.Tech/M.Tech in CS/AI with min 7.5 CGPA',
      deadline: new Date('2026-11-30')
    },
    {
      companyIdx: 0, title: 'Full Stack Developer Intern', jobType: 'internship',
      description: 'Join our product team to build scalable web applications using React and Node.js. You will work on real features that reach thousands of users.',
      skills: ['Web Development', 'React', 'Node.js', 'Problem Solving'],
      location: 'Bangalore, India', stipend: 20000, duration: '8 weeks',
      eligibility: 'B.Tech CS/IT, familiarity with React required',
      deadline: new Date('2026-10-15')
    },
    {
      companyIdx: 1, title: 'Data Analyst Intern', jobType: 'internship',
      description: 'Analyze genomic datasets and build dashboards to support our research scientists. Ideal for students passionate about bioinformatics and data-driven discovery.',
      skills: ['Data Analysis', 'Python', 'R', 'Research'],
      location: 'Hyderabad, India', stipend: 18000, duration: '10 weeks',
      eligibility: 'B.Tech/B.Sc in Bioinformatics, CS, or related field',
      deadline: new Date('2026-10-30')
    },
    {
      companyIdx: 2, title: 'Quantitative Analyst', jobType: 'fulltime',
      description: 'Build quantitative models for risk assessment and portfolio optimization using statistical methods and machine learning. Work with large financial datasets.',
      skills: ['Data Analysis', 'Machine Learning', 'Problem Solving', 'Research'],
      location: 'Mumbai, India', salary: 900000, duration: 'Permanent',
      eligibility: 'M.Tech/MBA Finance with 2+ years experience',
      deadline: new Date('2026-09-30')
    },
    {
      companyIdx: 3, title: 'Cloud Infrastructure Intern', jobType: 'internship',
      description: 'Assist in designing and deploying cloud infrastructure on AWS. Work on containerization, CI/CD pipelines, and monitoring solutions.',
      skills: ['Cloud Computing', 'Problem Solving', 'Teamwork'],
      location: 'Pune, India', stipend: 22000, duration: '12 weeks',
      eligibility: 'B.Tech CS/IT, AWS fundamentals preferred',
      deadline: new Date('2026-11-15')
    },
    {
      companyIdx: 4, title: 'Sustainability Research Intern', jobType: 'internship',
      description: 'Conduct research on sustainable technology solutions and prepare reports for government and corporate stakeholders. Ideal for students passionate about climate tech.',
      skills: ['Research', 'Data Analysis', 'Communication'],
      location: 'Chennai, India', stipend: 15000, duration: '8 weeks', isRemote: true,
      eligibility: 'Any B.Tech/B.Sc branch with interest in sustainability',
      deadline: new Date('2026-10-01')
    },
    {
      companyIdx: 0, title: 'ML Platform Engineer', jobType: 'fulltime',
      description: 'Build and maintain our ML platform infrastructure including model serving, feature stores, and experiment tracking systems.',
      skills: ['Machine Learning', 'Cloud Computing', 'Web Development'],
      location: 'Bangalore, India', salary: 1400000, duration: 'Permanent',
      eligibility: 'M.Tech CS/AI with 1+ year experience',
      deadline: new Date('2026-09-15')
    },
    {
      companyIdx: 1, title: 'Computational Biology Intern', jobType: 'internship',
      description: 'Apply machine learning methods to analyze protein structure data and assist in drug discovery research.',
      skills: ['Machine Learning', 'Research', 'Data Analysis'],
      location: 'Hyderabad, India', stipend: 20000, duration: '16 weeks',
      eligibility: 'M.Tech Bioinformatics or CS with biology interest',
      deadline: new Date('2026-12-01')
    },
  ];

  const createdPostings = [];
  for (const p of postingsData) {
    const industry = industryUsers[p.companyIdx].industryProfile!;
    const posting = await prisma.jobPosting.create({
      data: {
        industryId: industry.id,
        title: p.title,
        description: p.description,
        requiredSkills: p.skills,
        jobType: p.jobType,
        location: p.location,
        isRemote: p.isRemote || false,
        stipend: p.stipend || null,
        salary: p.salary || null,
        duration: p.duration,
        eligibility: p.eligibility,
        deadline: p.deadline,
        status: PostingStatus.ACTIVE,
      }
    });
    createdPostings.push(posting);
  }
  console.log('✅ Job postings created (8 postings)');

  // ─── LEARNING PROGRAMS ────────────────────────────────────────────────────
  const programsData = [
    {
      companyIdx: 0,
      title: 'Deep Learning Foundations',
      description: 'A 6-week program covering neural networks, CNNs, RNNs, and transformers using PyTorch.',
      skills: ['Machine Learning', 'Python', 'Data Analysis'],
      duration: '6 weeks', hasCertificate: true
    },
    {
      companyIdx: 3,
      title: 'AWS Cloud Practitioner Bootcamp',
      description: 'Hands-on training covering core AWS services: EC2, S3, Lambda, RDS, and CloudFormation.',
      skills: ['Cloud Computing', 'Problem Solving'],
      duration: '4 weeks', hasCertificate: true
    },
    {
      companyIdx: 2,
      title: 'Financial Data Analysis with Python',
      description: 'Learn to use pandas, matplotlib, and scikit-learn for quantitative finance analysis.',
      skills: ['Data Analysis', 'Machine Learning', 'Research'],
      duration: '3 weeks', hasCertificate: true
    },
    {
      companyIdx: 4,
      title: 'Sustainable Engineering Practices',
      description: 'Workshop on green software engineering, energy-efficient algorithms, and sustainability metrics.',
      skills: ['Research', 'Communication', 'Problem Solving'],
      duration: '2 weeks', hasCertificate: false
    },
    {
      companyIdx: 1,
      title: 'Bioinformatics with R',
      description: 'Introduction to genomic data analysis using R and Bioconductor packages.',
      skills: ['Data Analysis', 'Research'],
      duration: '5 weeks', hasCertificate: true
    },
  ];

  const createdPrograms = [];
  for (const pr of programsData) {
    const industry = industryUsers[pr.companyIdx].industryProfile!;
    const prog = await prisma.learningProgram.create({
      data: {
        industryId: industry.id,
        title: pr.title,
        description: pr.description,
        skillsCovered: pr.skills,
        duration: pr.duration,
        hasCertificate: pr.hasCertificate,
        isActive: true,
      }
    });
    createdPrograms.push(prog);
  }
  console.log('✅ Learning programs created');

  // ─── FDPs, RESEARCH COLLABORATIONS, WORKSHOPS ─────────────────────────────
  const techCorpId = industryUsers[0].industryProfile!.id;
  const bioGenId = industryUsers[1].industryProfile!.id;
  const cloudSysId = industryUsers[3].industryProfile!.id;

  await prisma.fDP.createMany({
    data: [
      { industryId: techCorpId, title: 'AI/ML Faculty Development Program', description: 'A 5-day intensive FDP for engineering faculty on modern AI/ML techniques.', duration: '5 days', startDate: new Date('2026-10-10'), endDate: new Date('2026-10-14'), location: 'Bangalore', mode: 'offline', isActive: true },
      { industryId: bioGenId, title: 'Bioinformatics for Life Sciences Faculty', description: 'Introduction to computational biology tools for life sciences faculty.', duration: '3 days', startDate: new Date('2026-11-05'), endDate: new Date('2026-11-07'), location: 'Hyderabad', mode: 'online', isActive: true },
      { industryId: cloudSysId, title: 'Cloud-Native Application Development FDP', description: 'Hands-on workshop on Kubernetes, Docker, and cloud-native patterns for faculty.', duration: '2 days', startDate: new Date('2026-09-20'), endDate: new Date('2026-09-21'), location: 'Pune', mode: 'hybrid', isActive: true },
    ]
  });

  await prisma.researchCollaboration.createMany({
    data: [
      { industryId: techCorpId, title: 'Explainable AI for Healthcare Diagnostics', description: 'Joint research project to develop interpretable ML models for medical image analysis.', requiredExpertise: ['Machine Learning', 'Research', 'Data Analysis'], deadline: new Date('2026-10-31'), isOpen: true },
      { industryId: bioGenId, title: 'Drug Discovery with Generative Models', description: 'Collaboration opportunity in applying generative AI models to accelerate drug discovery.', requiredExpertise: ['Machine Learning', 'Research'], deadline: new Date('2026-11-30'), isOpen: true },
      { industryId: cloudSysId, title: 'Energy-Efficient Cloud Scheduling', description: 'Research on optimization algorithms for reducing data center energy consumption.', requiredExpertise: ['Cloud Computing', 'Research', 'Problem Solving'], deadline: new Date('2026-12-15'), isOpen: true },
    ]
  });

  await prisma.workshop.createMany({
    data: [
      { industryId: techCorpId, title: 'Introduction to Generative AI', speaker: 'Dr. Priya Menon, Head of AI Research, TechCorp', date: new Date('2026-09-15'), duration: '3 hours', mode: 'online', location: 'Zoom Webinar' },
      { industryId: bioGenId, title: 'CRISPR Technology and Future Applications', speaker: 'Dr. Rajan Nair, Principal Scientist, BioGen', date: new Date('2026-09-28'), duration: '2 hours', mode: 'offline', location: 'IIT Nexus Auditorium' },
      { industryId: cloudSysId, title: 'Building Resilient Microservices', speaker: 'Arjun Sharma, CTO, CloudSys Solutions', date: new Date('2026-10-05'), duration: '4 hours', mode: 'hybrid', location: 'Pune Tech Hub + Online' },
      { title: 'Career in AI/ML — Industry Perspectives', speaker: 'Panel Discussion with Industry Leaders', date: new Date('2026-10-20'), duration: '2 hours', mode: 'online', location: 'MS Teams' },
    ]
  });
  console.log('✅ FDPs, Research collaborations, Workshops created');

  // ─── ACADEMICIANS (3) ─────────────────────────────────────────────────────
  const academicians = [
    { email: 'prof.sharma@iit-nexus.edu.in', first: 'Vikram', last: 'Sharma', dept: 'Computer Science', desig: 'Associate Professor', spec: 'Machine Learning & AI' },
    { email: 'prof.gupta@iit-nexus.edu.in', first: 'Anita', last: 'Gupta', dept: 'Electronics & Communication', desig: 'Assistant Professor', spec: 'Signal Processing & Bioinformatics' },
    { email: 'prof.verma@iit-nexus.edu.in', first: 'Rajesh', last: 'Verma', dept: 'Information Technology', desig: 'Professor', spec: 'Cloud Computing & Distributed Systems' },
  ];

  const academicianUsers = [];
  for (const a of academicians) {
    const u = await prisma.user.create({
      data: {
        email: a.email,
        passwordHash,
        role: Role.ACADEMICIAN,
        isVerified: true,
        academicianProfile: {
          create: {
            firstName: a.first,
            lastName: a.last,
            institution: 'IIT Nexus',
            department: a.dept,
            designation: a.desig,
            specialization: a.spec,
          }
        }
      },
      include: { academicianProfile: true }
    });
    academicianUsers.push(u);
  }
  console.log('✅ Academicians created');

  // ─── STUDENTS (10) ────────────────────────────────────────────────────────
  const studentsData = [
    { email: 'alex.chen@student.iit-nexus.edu.in', first: 'Alex', last: 'Chen', dept: 'Computer Science', year: 3, cgpa: 8.9, scores: [85, 90, 70, 60, 80, 88, 85, 78] },
    { email: 'priya.patel@student.iit-nexus.edu.in', first: 'Priya', last: 'Patel', dept: 'Artificial Intelligence', year: 4, cgpa: 9.2, scores: [92, 88, 65, 75, 85, 90, 88, 92] },
    { email: 'rahul.kumar@student.iit-nexus.edu.in', first: 'Rahul', last: 'Kumar', dept: 'Information Technology', year: 3, cgpa: 7.8, scores: [60, 70, 85, 80, 75, 72, 80, 55] },
    { email: 'ananya.roy@student.iit-nexus.edu.in', first: 'Ananya', last: 'Roy', dept: 'Computer Science', year: 2, cgpa: 8.5, scores: [70, 75, 90, 85, 82, 78, 85, 65] },
    { email: 'karan.singh@student.iit-nexus.edu.in', first: 'Karan', last: 'Singh', dept: 'Electronics', year: 4, cgpa: 7.5, scores: [55, 65, 60, 70, 80, 68, 75, 60] },
    { email: 'meera.nair@student.iit-nexus.edu.in', first: 'Meera', last: 'Nair', dept: 'Bioinformatics', year: 3, cgpa: 8.8, scores: [78, 88, 55, 60, 88, 82, 90, 95] },
    { email: 'arjun.mehta@student.iit-nexus.edu.in', first: 'Arjun', last: 'Mehta', dept: 'Computer Science', year: 4, cgpa: 9.0, scores: [88, 85, 78, 90, 75, 85, 82, 80] },
    { email: 'divya.iyer@student.iit-nexus.edu.in', first: 'Divya', last: 'Iyer', dept: 'Data Science', year: 2, cgpa: 8.2, scores: [72, 82, 68, 65, 85, 78, 80, 75] },
    { email: 'siddharth.joshi@student.iit-nexus.edu.in', first: 'Siddharth', last: 'Joshi', dept: 'Information Technology', year: 3, cgpa: 7.9, scores: [65, 72, 80, 75, 78, 70, 72, 60] },
    { email: 'kavya.reddy@student.iit-nexus.edu.in', first: 'Kavya', last: 'Reddy', dept: 'Artificial Intelligence', year: 4, cgpa: 9.1, scores: [90, 92, 72, 80, 88, 92, 85, 88] },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const overallScore = Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length);
    const u = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash,
        role: Role.STUDENT,
        isVerified: true,
        studentProfile: {
          create: {
            firstName: s.first,
            lastName: s.last,
            institution: 'IIT Nexus',
            department: s.dept,
            year: s.year,
            cgpa: s.cgpa,
            bio: `${s.year}${['st','nd','rd','th'][Math.min(s.year-1,3)]} year student at IIT Nexus, specializing in ${s.dept}. Passionate about technology and innovation.`,
            skillProfile: {
              create: {
                overallScore,
                skillScores: {
                  create: categories.map((cat, idx) => ({
                    categoryId: cat.id,
                    score: s.scores[idx] || 50,
                  }))
                }
              }
            }
          }
        }
      },
      include: { studentProfile: { include: { skillProfile: true } } }
    });
    createdStudents.push(u);
  }
  console.log('✅ Students created (10) with skill profiles');

  // ─── APPLICATIONS ─────────────────────────────────────────────────────────
  const applicationData = [
    // Alex (student 0) applied to postings 0, 1, 3
    { stuIdx: 0, postIdx: 0, status: ApplicationStatus.SHORTLISTED, matchScore: 87 },
    { stuIdx: 0, postIdx: 1, status: ApplicationStatus.INTERVIEW, matchScore: 82 },
    { stuIdx: 0, postIdx: 3, status: ApplicationStatus.APPLIED, matchScore: 74 },
    // Priya (student 1) applied to 0, 6
    { stuIdx: 1, postIdx: 0, status: ApplicationStatus.SELECTED, matchScore: 94 },
    { stuIdx: 1, postIdx: 6, status: ApplicationStatus.SHORTLISTED, matchScore: 90 },
    // Rahul (student 2) applied to 1, 4
    { stuIdx: 2, postIdx: 1, status: ApplicationStatus.APPLIED, matchScore: 71 },
    { stuIdx: 2, postIdx: 4, status: ApplicationStatus.APPLIED, matchScore: 78 },
    // Ananya (student 3) applied to 1, 5
    { stuIdx: 3, postIdx: 1, status: ApplicationStatus.SHORTLISTED, matchScore: 85 },
    { stuIdx: 3, postIdx: 5, status: ApplicationStatus.APPLIED, matchScore: 68 },
    // Karan (student 4)
    { stuIdx: 4, postIdx: 4, status: ApplicationStatus.REJECTED, matchScore: 55 },
    // Meera (student 5)
    { stuIdx: 5, postIdx: 2, status: ApplicationStatus.SHORTLISTED, matchScore: 88 },
    { stuIdx: 5, postIdx: 7, status: ApplicationStatus.APPLIED, matchScore: 82 },
    // Arjun (student 6)
    { stuIdx: 6, postIdx: 0, status: ApplicationStatus.INTERVIEW, matchScore: 88 },
    { stuIdx: 6, postIdx: 6, status: ApplicationStatus.APPLIED, matchScore: 84 },
    // Divya (student 7)
    { stuIdx: 7, postIdx: 2, status: ApplicationStatus.APPLIED, matchScore: 76 },
    { stuIdx: 7, postIdx: 5, status: ApplicationStatus.APPLIED, matchScore: 70 },
    // Kavya (student 9)
    { stuIdx: 9, postIdx: 0, status: ApplicationStatus.SHORTLISTED, matchScore: 93 },
    { stuIdx: 9, postIdx: 3, status: ApplicationStatus.APPLIED, matchScore: 80 },
  ];

  for (const app of applicationData) {
    const student = createdStudents[app.stuIdx].studentProfile!;
    await prisma.application.create({
      data: {
        studentId: student.id,
        postingId: createdPostings[app.postIdx].id,
        status: app.status,
        matchScore: app.matchScore,
      }
    });
  }
  console.log('✅ Applications created');

  // ─── ENROLLMENTS & CERTIFICATES ───────────────────────────────────────────
  const enrollmentData = [
    { stuIdx: 0, progIdx: 0, status: EnrollmentStatus.COMPLETED },
    { stuIdx: 0, progIdx: 1, status: EnrollmentStatus.IN_PROGRESS },
    { stuIdx: 1, progIdx: 0, status: EnrollmentStatus.COMPLETED },
    { stuIdx: 1, progIdx: 2, status: EnrollmentStatus.COMPLETED },
    { stuIdx: 2, progIdx: 1, status: EnrollmentStatus.ENROLLED },
    { stuIdx: 5, progIdx: 4, status: EnrollmentStatus.COMPLETED },
    { stuIdx: 6, progIdx: 0, status: EnrollmentStatus.IN_PROGRESS },
    { stuIdx: 9, progIdx: 0, status: EnrollmentStatus.COMPLETED },
    { stuIdx: 9, progIdx: 2, status: EnrollmentStatus.COMPLETED },
  ];

  for (const en of enrollmentData) {
    const student = createdStudents[en.stuIdx].studentProfile!;
    const prog = createdPrograms[en.progIdx];
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id,
        programId: prog.id,
        status: en.status,
        completedAt: en.status === EnrollmentStatus.COMPLETED ? new Date() : null,
      }
    });

    // Auto-generate certificate on completion
    if (en.status === EnrollmentStatus.COMPLETED && prog.hasCertificate) {
      await prisma.certificate.create({
        data: {
          studentId: student.id,
          enrollmentId: enrollment.id,
          title: `Certificate of Completion — ${prog.title}`,
          issuer: 'Nexus Academic',
          verificationStatus: 'APPROVED',
        }
      });
    }
  }
  console.log('✅ Enrollments and certificates created');

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
  const alexStudent = createdStudents[0];
  await prisma.notification.createMany({
    data: [
      { userId: alexStudent.id, type: 'APPLICATION_STATUS', title: 'Application Shortlisted!', body: 'Congratulations! TechCorp Innovations shortlisted you for AI Research Intern.', isRead: false },
      { userId: alexStudent.id, type: 'NEW_MATCH', title: 'New Internship Match', body: 'CloudSys Solutions posted a new role matching your profile at 85%.', isRead: false },
      { userId: alexStudent.id, type: 'GENERAL', title: 'Assessment Available', body: 'The Nexus Academic Skill Assessment is now available. Complete it to boost recommendations.', isRead: true },
      { userId: alexStudent.id, type: 'APPLICATION_STATUS', title: 'Interview Scheduled', body: 'FinServe Global scheduled your interview for the Full Stack Developer Intern role.', isRead: true },
    ]
  });
  console.log('✅ Notifications created');

  // ─── CONVERSATIONS & MESSAGES ─────────────────────────────────────────────
  const alexUser = alexStudent;
  const techCorpUser = industryUsers[0];

  const conv = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: alexUser.id },
          { userId: techCorpUser.id }
        ]
      }
    }
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv.id, senderId: techCorpUser.id, content: 'Hi Alex, thanks for applying to our AI Research Intern position. Impressive profile!', isRead: true },
      { conversationId: conv.id, senderId: alexUser.id, content: 'Thank you! I am very excited about the opportunity. I have been following TechCorp\'s research on explainable AI.', isRead: true },
      { conversationId: conv.id, senderId: techCorpUser.id, content: 'Great! We\'d like to schedule a quick technical interview. Are you available next week?', isRead: false },
    ]
  });
  console.log('✅ Conversations and messages created');

  console.log('\n🎉 Seeding complete! Demo credentials:');
  console.log('──────────────────────────────────────────────');
  console.log('  🎓 Student:    alex.chen@student.iit-nexus.edu.in');
  console.log('  🏭 Industry:   hr@techcorp.io');
  console.log('  👨‍🏫 Academician: prof.sharma@iit-nexus.edu.in');
  console.log('  🏛  Admin:      admin@iit-nexus.edu.in');
  console.log('  🔑 Password:   Password@123  (all accounts)');
  console.log('──────────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

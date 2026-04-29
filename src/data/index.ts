import type { Project } from '../components/ProjectModal';

export type Language = { code: string; flag: string; label: string };

export type Capability = {
  category: string;
  desc: string;
  items: string[];
};

export type ExperienceItem = {
  company: string;
  tagline: string;
  period: string;
  position: string;
  location: string;
  industry: string;
  website: string;
  description: string[];
};

export const portfolioData = {
  person: {
    name: 'Prathamesh Belvalkar',
  },
  hero: {
    titleLines: ['PRATHAMESH', 'BELVALKAR'],
    whoAmILabel: 'Who am I',
    intro:
      'Full Stack Developer specializing in building scalable backend systems and high-performance web applications that align with business goals and deliver excellent user experiences.',
    subIntro: 'Currently exploring the intersection of AI and Software Development at Airrived.',
    scrollCtaLabel: 'Scroll',
    scrollCtaHref: '#experience',
  },
  aboutProfile: {
    sectionLabel: 'About / Profile',
    headline:
      'Over the years, I have worked on end-to-end web applications with a strong focus on scalable architecture, secure API design, and seamless user experience',
    focusAreas: ['AI & Python Development', 'Backend Engineering'],
    emailLabel: 'Say hello',
    email: 'pprathameshbelvalkar544@gmail.com',
    linkedinLabel: 'LinkedIn',
    linkedinCtaLabel: 'Explore LinkedIn',
    linkedinHref: 'https://www.linkedin.com/in/prathameshbelvalkar-83b72a267',
    paragraphs: [
      'AI and Python Developer with 2.5+ years of experience building intelligent backend systems, production-grade APIs, and automation workflows. Strong expertise in Python, SQL databases, authentication, and secure API design.',
      'Experienced in AI integrations, real-time systems, and enterprise platforms. I prioritize building clean, maintainable codebases that enable continuous improvement, observability, and scalable delivery.',
      'I hold a Master of Computer Applications (MCA) in Computer Science from KIT\'s IMER, Kolhapur, and a Bachelor of Computer Science from The New College, Kolhapur.',
      'I am fluent in English, Hindi, and Marathi, with elementary proficiency in Japanese, and have experience working across diverse and collaborative teams.',
    ],
  },
  contact: {
    sectionLabel: 'Connect',
    email: 'pprathameshbelvalkar544@gmail.com',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prathameshbelvalkar-83b72a267' },
      { label: 'GitHub', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'Portfolio', href: 'https://prathameshbelvalkar.vercel.app' },
      { label: 'Read.cv', href: '#' },
    ],
  },
  footer: {
    designedBy: 'DESIGNED & BUILT BY PRATHAMESH BELVALKAR',
    lastUpdated: 'LAST UPDATED / APR 2026',
  },
  languages: [
    { code: 'EN', flag: 'US', label: 'English' },
    { code: 'JP', flag: 'JP', label: 'Japanese' },
    { code: 'MR', flag: 'IN', label: 'Marathi' },
  ] satisfies Language[],
  navItems: ['About', 'Capabilities', 'Experience', 'Projects', 'Contact'] satisfies string[],
  projects: [
    {
      title: 'Stream Deck',
      desc: 'A real-time video streaming platform built with Node.js, RTMP, and WebSocket.',
      year: '2024',
      tech: ['Node.js', 'Express.js', 'React.js', 'PostgreSQL', 'WebSocket', 'RTMP'],
      longDesc:
        'Developed backend services for real-time video and data streaming. Built REST APIs and WebSocket services for stream control, monitoring, and analytics. Designed PostgreSQL schemas for stream sessions and metadata with high availability in mind.',
    },
    {
      title: 'National Buying Consortium',
      desc: 'Accounting and margin management platform for UK FMCG suppliers.',
      year: '2025',
      tech: ['NestJS', 'Node.js', 'React.js', 'MySQL', 'REST APIs'],
      longDesc:
        'Designed and developed a custom accounting and margin management platform for UK FMCG suppliers. Built scalable NestJS backend services handling pricing, rebates, commissions, and margins. Centralized supplier-member financial workflows with automated validations and reporting dashboards.',
    },
    {
      title: 'CarbonExchange AI',
      desc: 'A platform to calculate and manage carbon credits based on land value.',
      year: '2024',
      tech: ['Node.js', 'React.js', 'MongoDB', 'REST APIs'],
      longDesc:
        'Developed a platform that calculates carbon credits based on land value, aiding companies in understanding their environmental impact. The system enables businesses to track, manage, and trade carbon credits with transparency and accuracy.',
    },
    {
      title: 'Video Personal Discussion (KYC)',
      desc: 'Secure video-based KYC platform for banks with live streaming and fraud prevention.',
      year: '2025',
      tech: ['NestJS', 'Node.js', 'Live Video Streaming', 'RTMP', 'REST APIs'],
      longDesc:
        'Developed a real-time video discussion platform for banks to conduct online KYC. Built NestJS backend services for session management, authentication, and audit logs. Integrated live video streaming using RTMP and video SDKs with encrypted communication and fraud-prevention workflows.',
    },
  ] satisfies Project[],
  capabilities: [
    {
      category: 'AI & Python Development',
      desc: 'Building intelligent software solutions and AI-powered applications with Python.',
      items: ['Python', 'AI Integration', 'WebRTC', 'WebSocket / RTMP', 'REST APIs'],
    },
    {
      category: 'Backend Engineering',
      desc: 'Building performant, scalable backend systems and secure RESTful APIs with 2.5+ years of experience.',
      items: ['FastAPI', 'Django', 'SQLAlchemy', 'Celery', 'JWT / RBAC'],
    },
    {
      category: 'Frontend & Database',
      desc: 'Crafting responsive interfaces and designing robust, optimized data layers.',
      items: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'React Query',
        'Tailwind CSS',
        'Redux',
        'HTML5',
        'CSS3',
        'Sass',
        'MySQL',
        'PostgreSQL',
        'MongoDB',
        'Docker',
        'Git',
      ],
    },
  ] satisfies Capability[],
  experience: [
    {
      company: 'Airrived',
      tagline: 'Software and AI development',
      period: 'Mar 2026 — Present',
      position: 'Software and AI Python Developer',
      location: 'India',
      industry: 'Technology / AI',
      website: '#',
      description: [
        'Working as a Software and AI Python Developer, contributing to intelligent software solutions leveraging modern AI and Python-based technologies.',
      ],
    },
    {
      company: 'RaMee Systems Pvt. Ltd.',
      tagline: 'Enterprise software solutions',
      period: 'Feb 2025 — Feb 2026',
      position: 'Software Engineer',
      location: 'Pune (Aundh), India',
      industry: 'Software',
      website: '#',
      description: [
        'Developed secure backend services and APIs with strong authentication and role-based access control, focused on reliability and performance.',
        'Designed and optimized MySQL and PostgreSQL schemas for financial and operational systems, improving data integrity and reporting workflows.',
      ],
    },
    {
      company: 'NOITAVONNE INDIA',
      tagline: 'Full stack web application development',
      period: 'Aug 2023 — Feb 2025',
      position: 'Full Stack Developer',
      location: 'Kolhapur, Maharashtra, India',
      industry: 'Software',
      website: '#',
      description: [
        'Built enterprise applications and APIs, working with MongoDB and SQL databases for transactional and reporting systems.',
        'Implemented authentication, authorization, and secure backend communication while optimizing services for scalability and reliability across multiple projects.',
      ],
    },
  ] satisfies ExperienceItem[],
};
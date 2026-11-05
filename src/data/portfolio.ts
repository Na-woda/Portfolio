export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type EducationEntry = {
  title: string;
  institution: string;
  dates: string;
  location: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  problem: string;
  contribution: string;
  features: string[];
  technologies: string[];
  notes?: string;
  image?: {
    src: string;
    alt: string;
  };
  github?: ProjectLink;
  live?: ProjectLink;
  layout: "featured" | "split-right" | "split-left";
};

export const profile = {
  name: "Nawoda Lakshani",
  legalName: "M.N. Lakshani Perera",
  role: "Software engineering undergraduate",
  seeking: "Seeking a software engineering internship",
  location: "Kottawa, Sri Lanka",
  email: "lakshaninawoda2003@gmail.com",
  phone: "+94 70 539 0660",
  phoneHref: "tel:+94705390660",
  linkedin: "https://www.linkedin.com/in/nawoda-lakshani/",
  github: "https://github.com/Na-woda",
  resumeHref: "/Nawoda-Lakshani-CV.pdf",
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Email", href: `mailto:${profile.email}` },
];

export const education: EducationEntry[] = [
  {
    title: "BSc (Hons) in Software Engineering",
    institution: "The Open University of Sri Lanka",
    dates: "2023 — Present",
    location: "Nawala, Colombo",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Java", "Python", "HTML5", "CSS3"],
  },
  {
    title: "Frontend",
    items: ["React", "Vite", "React Native", "Tailwind CSS", "Styled Components"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "JWT authentication", "Multer"],
  },
  {
    title: "Databases",
    items: ["MongoDB", "MySQL"],
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "VS Code", "Postman", "Jira", "Figma", "Expo CLI"],
  },
];

export const projects: Project[] = [
  {
    id: "wishdora",
    number: "01",
    title: "WishDora",
    subtitle: "Scheduled wishes for birthdays and anniversaries",
    summary:
      "A web application for creating, scheduling, and delivering personalised wishes, with email delivery and WhatsApp sharing.",
    problem:
      "People often remember important dates too late. WishDora lets someone write a message in advance, attach a greeting card, and send it at a chosen date and time.",
    contribution:
      "I designed and built the application as a software engineering undergraduate project, covering registration, wish scheduling, greeting-card uploads, and automated email delivery.",
    features: [
      "User registration and JWT-based login",
      "Create and schedule wishes with a delivery date and time",
      "Upload and manage greeting cards",
      "Automated email delivery when the scheduled time arrives",
      "WhatsApp sharing",
      "Admin dashboard for management",
    ],
    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "JWT",
      "Cloudinary",
    ],
    github: {
      label: "GitHub repository",
      href: "https://github.com/Na-woda/WishDora",
    },
    live: {
      label: "Live site",
      href: "https://wish-dora.vercel.app",
    },
    layout: "featured",
  },
  {
    id: "price-detector",
    number: "02",
    title: "Smart Shopping Price Detector",
    subtitle: "Mobile OCR scanner for Sri Lankan rupee prices",
    summary:
      "A React Native shopping companion that reads prices from camera captures and keeps a running cart against a budget.",
    problem:
      "Price tags in shops are easy to misread while adding up a basket. The app captures a label, extracts an LKR amount, and records it in a cart.",
    contribution:
      "I built the scanner in React Native with Expo Camera and Google Cloud Vision text detection, then parsed Sri Lankan rupee patterns such as Rs., LKR, and රු from the recognised text.",
    features: [
      "Camera capture with Expo Camera permissions",
      "OCR through Google Cloud Vision text detection",
      "LKR price extraction from mixed label text",
      "Cart with quantities and a running total",
      "Budget tracking with warning states as spend approaches the limit",
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Google Cloud Vision",
      "Expo Camera",
    ],
    notes:
      "My CV also describes Sinhala-locale voice commands, real-time product lookup, and a fallback OCR path. The public GitHub snapshot currently centres on camera capture, Vision OCR, LKR parsing, cart, and budget alerts.",
    github: {
      label: "GitHub repository",
      href: "https://github.com/Na-woda/OCR",
    },
    layout: "split-right",
  },
  {
    id: "plant-atelier",
    number: "03",
    title: "Plant Atelier",
    subtitle: "Plant guide platform and storefront",
    summary:
      "A full-stack plant platform with a customer storefront, plant-care guides, and an admin dashboard for managing content.",
    problem:
      "Plant shops and care resources are often split across separate sites. This project brings browsing, care information, and content administration into one web application.",
    contribution:
      "The public repository is published under my GitHub account as Green Nest. The local codebase includes a React storefront, plant-guide pages, and a dark admin dashboard with KPI cards, CRUD tables, and analytics views, plus an Express and MongoDB backend.",
    features: [
      "Storefront with home, shop, cart, wishlist, and product detail flows",
      "Plant-care guide pages and categories",
      "Admin dashboard UI for plants, media, categories, and care content",
      "Express server with MongoDB, CORS, and JSON request handling",
    ],
    technologies: [
      "React",
      "Vite",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Multer",
      "Tailwind CSS",
      "Styled Components",
    ],
    notes:
      "JWT and Multer appear in the project stack and CV. The published GitHub README still describes parts of the storefront as a prototype, with some pages using sample data while the admin interface and backend continue to develop.",
    image: {
      src: "/projects/plant-atelier.jpg",
      alt: "Indoor plant photography from the Green Nest storefront project",
    },
    github: {
      label: "GitHub repository",
      href: "https://github.com/Na-woda/Green-Nest-Web",
    },
    layout: "split-left",
  },
  {
    id: "travel-pilot",
    number: "04",
    title: "Travel Pilot",
    subtitle: "Sri Lanka tourist and service-provider platform",
    summary:
      "A group software engineering project (EEY4189) for planning travel in Sri Lanka: tourists can browse destinations, book hotels, guides, and transport, while providers manage listings and bookings.",
    problem:
      "Travel planning often splits hotels, guides, and transport across separate tools. Travel Pilot brings tourist booking and provider administration into one web application.",
    contribution:
      "I worked on this as part of Group IR 01 at The Open University of Sri Lanka. The local codebase includes tourist and provider flows, an Express and MySQL backend, weather for Sri Lankan cities, and itinerary tools.",
    features: [
      "Accounts for tourists, hoteliers, tour guides, and transport providers",
      "Hotel listings with photo uploads, room availability, and bookings",
      "Tour guide and transport provider listings with booking status updates",
      "Tourist booking history, destinations, and published itineraries",
      "Weather and forecast lookups for Sri Lankan cities",
      "Admin dashboard and contact form",
    ],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "EJS",
      "Express.js",
      "MySQL",
      "JWT",
      "Multer",
      "OpenWeather",
    ],
    notes:
      "A public GitHub repository named Travel Pilot was not listed on github.com/Na-woda when this page was updated. If you share the exact repo URL, the GitHub button can be added.",
    image: {
      src: "/projects/travel-pilot.jpg",
      alt: "Sri Lanka destination photography used in the Travel Pilot project",
    },
    layout: "split-right",
  },
];

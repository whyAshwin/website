export const profile = {
  name: "Ashwin Baranwal",
  firstName: "Ashwin",
  role: "Product Manager",
  tagline: "A curious mind shaped by the market, sharpened by product.",
  blurb:
    "I thrive where real-world hustle meets structured thinking — listening closely, simplifying complexity, and building with intent.",
  email: "hey@ashwinbaranwal.com",
  location: "India",
  resume: "/resume",
};

/** Headline numbers pulled from real work (kept honest). */
export const stats = [
  { value: 60, suffix: "×", label: "Faster course creation", sub: "Built the LMS at YourDost" },
  { value: 37, suffix: "%", label: "Activation lift", sub: "Persona-driven MindGym revamp" },
  { value: 13, suffix: "K+", label: "Seller App DAU", sub: "from 10K, in one revamp" },
  { value: 8, prefix: "₹", suffix: "L", label: "Saved annually", sub: "Replaced a 3rd-party LMS" },
] as const;

export type Experience = {
  role: string;
  company: string;
  context?: string;
  period: string;
  summary?: string;
  highlights: string[];
  stack?: string[];
};

export const experience: Experience[] = [
  {
    role: "Product Manager",
    company: "YourDost",
    context: "Mental Wellness Tech",
    period: "Mar 2026 — Present",
    stack: ["LMS", "SSO", "A/B Testing", "Personalisation"],
    highlights: [
      "Vibe-coded and launched an in-house Learning Management System, securely integrated with the core platform via SSO token exchange — eliminating a third-party tool, saving ₹8L annually and cutting course turnaround from 15 days to 6 hours (60× faster).",
      "Revamped MindGym by optimising in-app game UX and building a persona-driven engagement strategy — identified 12 personas, ran A/B tests to hyper-personalise drip journeys, driving a 37% activation lift and 24% better Week-4 retention.",
    ],
  },
  {
    role: "Associate Product Manager",
    company: "Badho",
    context: "B2B Marketplace · Seller App & Automation",
    period: "May 2025 — Feb 2026",
    stack: ["Dashboard", "Analytics", "n8n", "Integrations"],
    highlights: [
      "Spearheaded the Badho Seller App revamp (10K+ DAU), rebuilding navigation and the “My Home” dashboard — DAU grew from 10,000 to 13,000+.",
      "Conceived the Supply Knowledge Center, an in-app video-led help hub, cutting telecaller dependency and support tickets by 28%.",
      "Owned the Badho × Wheelseye integration, bringing GPS tracking into the app — 2,000+ active vehicles in 3 weeks.",
      "Designed Seller Reports, a live analytics module (SKU performance, price deltas, sales trends) that lifted order-fulfilment rates by 4%.",
      "Built automations with n8n workflows and cron jobs across platforms and databases; “Wheelseye User Activation” alone saves 20+ man-hours/week.",
    ],
  },
  {
    role: "Product Intern",
    company: "Alt Mobility",
    context: "EV Fleet Platform",
    period: "Apr 2024 — Jun 2024",
    stack: ["IoT", "PRD/FRD", "Research"],
    highlights: [
      "Built an EV vs Diesel running-cost calculator from primary research; launched “Daily Bachat”, an IoT-odometer-driven savings notification, lifting DAU 7% and average session time by 23s.",
      "Defined the core flow and fail/pass logic for the Vehicle Delivery PDI App, increasing process efficiency 3×.",
      "Authored PRDs, FRDs and user-flow logic across modules to align design, dev and ops.",
      "Ran competitive UI/UX research across 15+ delivery-partner apps to improve onboarding.",
      "Delivered EV-leasing market research — competitors, charging/IoT tech and personas — presented to leadership.",
    ],
  },
  {
    role: "Product Intern",
    company: "GoPllay",
    context: "Sports Networking App · 100K+ downloads",
    period: "Dec 2023 — Jan 2024",
    stack: ["User Research", "Metrics"],
    summary: "Improved connection and engagement for a sports networking app.",
    highlights: [
      "User research surfaced a privacy concern around sharing phone numbers for in-app profile lookup.",
      "Replaced phone numbers with a shareable UID as the primary search key.",
      "Shipped from development to production in 5 days.",
      "Defined success as User-Search API hits on the new UID.",
      "Post-release, User-Search API hits rose 19% over 30 days — 35% of which used UID.",
    ],
  },
  {
    role: "Founder / Owner",
    company: "Balaji",
    context: "Wholesale Venture",
    period: "Apr 2019 — May 2023",
    stack: ["GTM", "Ops", "P&L"],
    summary: "Founded and scaled a wholesale business, learning commerce from the ground up.",
    highlights: [
      "Delivered 1,300+ orders at an average order value of ₹6,700.",
      "Maintained annual average revenue of ₹35L+ at ~10% net profit.",
      "Built and maintained relationships with 200+ retailers through market-driven strategy and ground execution.",
      "Introduced digital systems to streamline operations and grow average ticket size via cross-selling.",
    ],
  },
];

export type Project = {
  title: string;
  tag: string;
  year: string;
  description: string;
  links?: { label: string; href: string }[];
  status?: "live" | "progress";
  accent: string;
};

export const projects: Project[] = [
  {
    title: "Airbnb Revamped",
    tag: "Product Strategy",
    year: "2024",
    description:
      "Studied supply-side inefficiencies on Airbnb in Tier-2 cities and prototyped a feature to surface trustworthy but under-reviewed listings — solving discovery, not suppressing price.",
    links: [
      { label: "Read the case study", href: "https://whyashwin.notion.site/I-almost-listed-my-property-on-Airbnb-but-what-I-found-made-me-build-this-instead-1f3d75c28c8480159865e35cb25dd7d9?source=copy_link" },
      { label: "Try the MVP", href: "https://whyashwin.github.io/airbnb_v1/" },
    ],
    status: "live",
    accent: "#7c6cff",
  },
  {
    title: "Credit Card Discovery Tool",
    tag: "MVP Build",
    year: "2024",
    description:
      "Found a discovery and education gap in a crowded credit-card market. Built an MVP that profiles users with a few questions and recommends the right card.",
    links: [{ label: "Try the tool", href: "https://whyashwin.github.io/creditcarddiscovery/" }],
    status: "live",
    accent: "#4cc9f0",
  },
  {
    title: "Home Loan Application Flow",
    tag: "MVP Build",
    year: "2025",
    description:
      "Rethinking a high-stakes, low-clarity journey — reducing drop-off across a multi-step home-loan application.",
    status: "progress",
    accent: "#f5a524",
  },
  {
    title: "WhatsApp Chatbot",
    tag: "Product Development",
    year: "2023",
    description:
      "A case study on a WhatsApp chatbot for post-purchase engagement — driving conversions through strategic notifications, reminders and follow-ups.",
    accent: "#2dd4bf",
  },
  {
    title: "Purplle.com",
    tag: "Product Teardown",
    year: "2023",
    description:
      "Examined user experience and surfaced pain points via surveys and competitor analysis, producing actionable insights and wireframes.",
    accent: "#f472b6",
  },
  {
    title: "Lenskart",
    tag: "Product Teardown",
    year: "2023",
    description:
      "Studied the app to map features and personas, then designed a user journey and suggested enhancements.",
    accent: "#60a5fa",
  },
];

export type Education = {
  degree: string;
  school: string;
  detail: string;
  year: string;
  score?: string;
};

export const education: Education[] = [
  {
    degree: "Master of Business Administration",
    school: "Indian Institute of Management, Sirmaur",
    detail: "Sirmaur, India",
    year: "Class of 2025",
  },
  {
    degree: "Bachelor of Commerce — Finance",
    school: "Banaras Hindu University",
    detail: "Varanasi, India · AIR 382 of 4L applicants",
    year: "Class of 2023",
    score: "8.10 / 10.00",
  },
];

export const socials = [
  { label: "Email", href: "mailto:hey@ashwinbaranwal.com", icon: "mail" },
  { label: "LinkedIn", href: "https://linkedin.com/in/whyashwin", icon: "linkedin" },
  { label: "X", href: "https://twitter.com/@whyashwin", icon: "x" },
  { label: "Medium", href: "https://medium.com/@whyashwin", icon: "medium" },
  { label: "GitHub", href: "https://github.com/whyAshwin", icon: "github" },
] as const;

export const sections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

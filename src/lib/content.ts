export const profile = {
  name: "Ashwin Baranwal",
  firstName: "Ashwin",
  role: "Product Manager",
  /**
   * The hero line, in two halves: muted opening, then the emphasised turn.
   * The second half states the method, not a capability — it is the belief the
   * rest of the page is meant to be evidence for.
   */
  tagline: "I build software that asks less of you.",
  taglineEmphasis:
    "I believe the best way to solve a problem is to put a working product in someone's hands, fast.",
  /**
   * The short profile under the About heading. What he notices, not what he
   * has done — the cards on this page are the evidence.
   */
  blurb:
    "I've never been able to switch off the part of my brain that notices a bad form. Empty states, error copy, the step where people quietly give up — that's the product, as far as I'm concerned.",
  email: "hey@ashwinbaranwal.com",
  location: "India",
  resume: "/resume",
};

/**
 * Headline numbers pulled from real work (kept honest). One per story rather
 * than one per project — the LMS's speed claim rides in the saving's sub-line,
 * where it costs a slot nothing.
 */
export const stats = [
  {
    value: 14,
    prefix: "+",
    suffix: "%",
    label: "Session CSAT",
    sub: "AI summaries · 15,000+ sessions a month",
  },
  { value: 37, suffix: "%", label: "Activation lift", sub: "Persona-routed MindGym revamp" },
  { value: 13, suffix: "K+", label: "Seller App DAU", sub: "from 10K, in one revamp" },
  {
    value: 10,
    prefix: "₹",
    suffix: "L",
    label: "Saved annually",
    sub: "Replaced Learnyst · 3 days → <1 hour",
  },
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
    company: "YourDOST",
    period: "Mar 2026 — Present",
    stack: ["Agentic AI", "LMS", "SSO", "Multi-tenant", "A/B Testing"],
    highlights: [
      "Increased average session CSAT score by 14% across 15,000+ monthly sessions by deploying a context-synthesising AI agent; orchestrated previous transcripts, therapy reports, and user activity into 100-word summaries to eliminate repetitive intake questions, build empathy, and save ~5 minutes of session prep time.",
      "Saved ~INR 10 Lacs annually and cut course creation time from 3 days to <1 hour by building a proprietary LMS via agentic coding workflows with SSO token-based auth and multi-tenant routing for personalized course recommendations, replacing Learnyst (a third-party SaaS).",
      "Increased activation by 37% and Week-4 retention by 24% for MindGym by implementing cohort-based routing across 12 user personas; deployed distinctly A/B-tested drip journeys for each segment and optimized core in-app game UX.",
    ],
  },
  {
    role: "Associate Product Manager",
    company: "Badho",
    context: "B2B Marketplace · Seller App & Automation",
    period: "May 2025 — Feb 2026",
    stack: ["Dashboard", "Analytics", "N8N", "Integrations"],
    highlights: [
      "Increased DAU from 10k to 13k+ by driving the Badho Seller App revamp; redesigned the \"My Home\" dashboard to enhance navigation, feature discoverability, and establish scalable UI templates for future rollouts.",
      "Reduced telecaller dependency and support tickets by 28% by conceptualizing and launching the Supply Knowledge Center, an in-app, video-led help hub that elevated the seller support and onboarding experience.",
      "Achieved a 4% jump in order fulfillment rates by creating the Seller Reports Dashboard, a live analytics module tracking SKU performance and sales trends to improve distributor forecasting and reduce stock-outs.",
      "Scaled active vehicles to 2,000+ in 3 weeks and saved 20+ manual hours/week by owning the Badho × WheelsEye integration for in-app GPS delivery tracking, and building cross-platform, cross-database user activation automations via N8N workflows to completely eliminate human entry errors during onboarding.",
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
  /**
   * What the case terminal types out on hover. Labels are per project so work
   * in progress can say what it's betting on and measuring, rather than
   * printing an empty result. Every line has to say something.
   */
  readout: { label: string; value: string }[];
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
    readout: [
      {
        label: "problem",
        value: "Zero-review listings in Tier-2 cities never surface. Good supply, invisible.",
      },
      {
        label: "fix",
        value: "Rank on trust signals — response time, photo quality, verified ID — not review count.",
      },
      {
        label: "result",
        value: "Under-reviewed listings convert, and price never gets touched.",
      },
      { label: "metric", value: "+14% booking intent on surfaced listings" },
    ],
    links: [
      { label: "Read the case study", href: "https://whyashwin.notion.site/I-almost-listed-my-property-on-Airbnb-but-what-I-found-made-me-build-this-instead-1f3d75c28c8480159865e35cb25dd7d9?source=copy_link" },
      { label: "Try the MVP", href: "https://whyashwin.github.io/airbnb_v1/" },
    ],
    status: "live",
    accent: "#7c6cff",
  },
  {
    title: "Credit Card Discovery Tool",
    tag: "MVP Build + Monetisation",
    year: "2024",
    description:
      "Found a discovery and education gap in a crowded credit-card market. Built an MVP that profiles users with a few questions and recommends the right card — then worked out how the recommendation earns.",
    readout: [
      {
        label: "problem",
        value: 'Every card is marketed as "the best card". None answer "best for me".',
      },
      {
        label: "fix",
        value: "Five questions about real spending, one recommendation — not a comparison table.",
      },
      {
        label: "result",
        value: "Shipped self-serve. People finish it without being chased.",
      },
      { label: "metric", value: "72% form completion" },
    ],
    links: [
      {
        label: "Read the case study",
        href: "https://whyashwin.notion.site/Credit-Card-Discovery-Tool-1f4d75c28c8480ed8a44d6dc29be3e04?pvs=4",
      },
      { label: "Try the tool", href: "https://whyashwin.github.io/creditcarddiscovery/" },
    ],
    status: "live",
    accent: "#4cc9f0",
  },
  {
    title: "Home Loan Application Flow",
    tag: "MVP Build",
    year: "2025",
    description:
      "Rethinking a high-stakes, low-clarity journey — reducing drop-off across a multi-step home-loan application.",
    readout: [
      {
        label: "problem",
        value:
          "The biggest loan most people ever take, through a form that never says what happens next.",
      },
      {
        label: "bet",
        value: "The drop-off isn't the length. It's the silence between steps.",
      },
      {
        label: "measuring",
        value: "Abandonment by step, and time-to-first-document.",
      },
    ],
    status: "progress",
    accent: "#f5a524",
  },
  {
    title: "WhatsApp Chatbot",
    tag: "Product Development",
    year: "2023",
    description:
      "A case study on a WhatsApp chatbot for post-purchase engagement — driving conversions through strategic notifications, reminders and follow-ups.",
    readout: [
      {
        label: "problem",
        value: "The relationship ends at order confirmation. Everything after is silence.",
      },
      {
        label: "fix",
        value:
          "Post-purchase on WhatsApp — dispatch, delivery, reorder — not another push notification.",
      },
      {
        label: "finding",
        value: "Repurchase is a conversation. Campaigns don't have one.",
      },
    ],
    links: [
      {
        label: "Read the case study",
        href: "https://medium.com/@whyashwin/product-development-ai-based-whatsapp-chatbot-for-an-e-commerce-business-9c2b51a455e4",
      },
    ],
    accent: "#2dd4bf",
  },
  {
    title: "Purplle.com",
    tag: "Product Teardown",
    year: "2023",
    description:
      "Examined user experience and surfaced pain points via surveys and competitor analysis, producing actionable insights and wireframes.",
    readout: [
      {
        label: "problem",
        value: "Pain points buried under a complex beauty catalogue.",
      },
      {
        label: "fix",
        value: "Surveys and a competitor teardown, then wireframes for the paths that broke.",
      },
      {
        label: "finding",
        value: "The catalogue wasn't too big. The filters were too shallow.",
      },
    ],
    accent: "#f472b6",
  },
  {
    title: "Lenskart",
    tag: "Product Teardown",
    year: "2023",
    description:
      "Studied the app to map features and personas, then designed a user journey and suggested enhancements.",
    readout: [
      {
        label: "problem",
        value: "Feature sprawl: the app grew, but nothing mapped which persona needed what.",
      },
      {
        label: "fix",
        value: "Feature-to-persona map, then a journey rebuilt around the jobs that mattered.",
      },
      {
        label: "finding",
        value: "Nobody was missing a feature. They were missing the order to use them in.",
      },
    ],
    accent: "#60a5fa",
  },
];

export type Education = {
  degree: string;
  school: string;
  detail: string;
  year: string;
  score?: string;
  /** Campus photo, used as the card background. */
  image: string;
  /**
   * Both the object-position and the zoom origin, so the crop and the zoom
   * agree on which part of the photo matters.
   */
  focus?: string;
  /** Zoom factor, for photos whose subject sits small in the frame. */
  zoom?: number;
  /** CSS filter, for flat or hazy photos that vanish under the scrim. */
  filter?: string;
  /** Photo opacity. Falls back to the `opacity-60` class. */
  opacity?: number;
};

export const education: Education[] = [
  {
    degree: "Master of Business Administration",
    school: "Indian Institute of Management, Sirmaur",
    detail: "Sirmaur, India",
    year: "Class of 2025",
    image: "/gallery/iim-sirmaur.jpg",
    // A hazy morning shot: the blue-roof block sits small, low and right, so
    // zoom onto it and lift the contrast, or it disappears under the scrim.
    focus: "85% 78%",
    zoom: 2,
    filter: "brightness(1.45) contrast(1.2) saturate(1.1)",
    opacity: 0.72,
  },
  {
    degree: "Bachelor of Commerce — Finance",
    school: "Banaras Hindu University",
    detail: "Varanasi, India · AIR 382 of 4L applicants",
    year: "Class of 2023",
    score: "8.10 / 10.00",
    // Sunlit stone and dark trees: plenty of contrast already, so this one
    // needs nothing but the centred crop.
    image: "/gallery/bhu.jpg",
  },
];

export const socials = [
  { label: "Email", href: "mailto:hey@ashwinbaranwal.com", icon: "mail" },
  { label: "LinkedIn", href: "https://linkedin.com/in/whyashwin", icon: "linkedin" },
  { label: "X", href: "https://twitter.com/@whyashwin", icon: "x" },
  { label: "Medium", href: "https://medium.com/@whyashwin", icon: "medium" },
  { label: "GitHub", href: "https://github.com/whyAshwin", icon: "github" },
] as const;

/**
 * Nav order is the page's own order, so the highlight walks down the header in
 * the same direction as the page: About, Work, Experience, Education, Contact.
 * Anything above About (hero, stats, playground) belongs to the intro and
 * lights nothing. Keep this list sorted the way the sections are rendered.
 */
export const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

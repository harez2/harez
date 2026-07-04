export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  tagline: string;
  problem: string;
  approach: string[];
  result: string;
  metrics: { k: string; v: string }[];
  timeline: string;
  services: string[];
  testimonial?: { quote: string; author: string; role: string };
  strategy: { title: string; description: string }[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "tahoor-studio",
    client: "Tahoor Studio",
    industry: "Fashion / E-commerce",
    tagline: "From burning ad spend to a 4.2x ROAS engine in 90 days",
    problem:
      "Tahoor Studio was spending heavily on Meta Ads with a rising CPL and unclear return. Creative fatigue, broad targeting and missing conversion tracking left the team unable to identify what was working.",
    approach: [
      "Rebuilt the Meta pixel and CAPI setup for accurate deduplicated tracking",
      "Restructured campaigns using CBO with clear top-of-funnel and retargeting layers",
      "Launched a weekly creative testing framework with UGC and static concepts",
      "Introduced post-purchase surveys to inform audience and creative angles",
    ],
    result: "4.2x ROAS in 90 days",
    metrics: [
      { k: "ROAS", v: "4.2x" },
      { k: "CPL", v: "-62%" },
      { k: "Revenue", v: "+310%" },
    ],
    timeline: "90 days",
    services: ["Meta Ads", "Creative Strategy", "Conversion Tracking"],
    testimonial: {
      quote:
        "Harez turned our ad account from a cost center into our biggest growth channel. Every dollar is now accountable.",
      author: "Founder",
      role: "Tahoor Studio",
    },
    strategy: [
      { title: "Audit & Tracking", description: "Fixed pixel, CAPI and Shopify events to trust the data." },
      { title: "Account Restructure", description: "Consolidated to CBO campaigns aligned to funnel stage." },
      { title: "Creative System", description: "Weekly briefs, hooks and iteration cycles based on data." },
      { title: "Scale & Retention", description: "Layered retargeting and lookalikes once winners emerged." },
    ],
  },
  {
    slug: "completo",
    client: "Completo",
    industry: "B2B SaaS",
    tagline: "A predictable pipeline of 112 SQLs / month at $18 CPL",
    problem:
      "Completo needed a scalable inbound engine. Google Ads costs were rising and LinkedIn campaigns were producing low-intent leads that sales couldn't close.",
    approach: [
      "Mapped ICP and rebuilt keyword strategy around high-intent commercial terms",
      "Launched dedicated landing pages per persona with clear proof and CTAs",
      "Deployed offline conversion tracking to optimize toward SQLs, not form fills",
      "Introduced retargeting sequences aligned to the sales cycle",
    ],
    result: "112 SQLs / month at $18 CPL",
    metrics: [
      { k: "SQLs", v: "112/mo" },
      { k: "CPL", v: "$18" },
      { k: "Pipeline", v: "$240K" },
    ],
    timeline: "6 months",
    services: ["Google Ads", "Landing Pages", "CRO"],
    testimonial: {
      quote:
        "We finally have a predictable pipeline. Sales knows exactly how many qualified conversations they'll get each week.",
      author: "Head of Growth",
      role: "Completo",
    },
    strategy: [
      { title: "ICP & Keywords", description: "Focused spend on commercial-intent queries only." },
      { title: "Landing Pages", description: "Persona-specific pages with proof, pricing and demo booking." },
      { title: "SQL Tracking", description: "Offline conversions fed back to Google for smart bidding." },
      { title: "Full Funnel", description: "Retargeting mapped to buying-cycle stages." },
    ],
  },
  {
    slug: "light-of-hope",
    client: "Light of Hope",
    industry: "Non-profit",
    tagline: "2.8x more donations while halving cost per donor",
    problem:
      "Light of Hope needed to scale awareness and monthly donations on a tight budget without diluting the mission's storytelling.",
    approach: [
      "Rebuilt donation funnel with story-driven landing pages",
      "Launched Meta and Google Grants campaigns with tight geographic targeting",
      "Introduced monthly-giving upsell and email nurture sequences",
      "Optimized creative around beneficiary stories and impact reporting",
    ],
    result: "2.8x donations, halved cost per donor",
    metrics: [
      { k: "Donations", v: "2.8x" },
      { k: "CPA", v: "-51%" },
      { k: "Reach", v: "1.2M" },
    ],
    timeline: "4 months",
    services: ["Meta Ads", "Google Grants", "Email Marketing"],
    strategy: [
      { title: "Story-First Creative", description: "Beneficiary-centric hooks with clear impact proof." },
      { title: "Grants Activation", description: "Full Google Ad Grants deployment for free reach." },
      { title: "Donor Journey", description: "Nurture flows converted one-time to monthly donors." },
      { title: "Reporting", description: "Transparent dashboards for board and stakeholders." },
    ],
  },
  {
    slug: "chhayatoru",
    client: "Chhayatoru",
    industry: "Education",
    tagline: "Sold-out first cohort in 3 weeks with 5.6x ROAS",
    problem:
      "Chhayatoru was launching a new online course with no historical data, no email list and a tight launch window before enrollment closed.",
    approach: [
      "Built waitlist funnel with lead magnet and email nurture",
      "Launched Meta Ads with founder-led video creatives",
      "Ran targeted webinars to convert waitlist into paid enrollments",
      "Layered urgency and social proof throughout the checkout flow",
    ],
    result: "Sold-out first cohort in 3 weeks",
    metrics: [
      { k: "Enrollments", v: "142" },
      { k: "ROAS", v: "5.6x" },
      { k: "CAC", v: "$11" },
    ],
    timeline: "3 weeks",
    services: ["Meta Ads", "Funnel Strategy", "Email Marketing"],
    strategy: [
      { title: "Waitlist Build", description: "Lead magnet + nurture warmed the audience before launch." },
      { title: "Founder Videos", description: "Authentic, trust-driven creatives outperformed polished ads." },
      { title: "Webinar Conversion", description: "Live sessions closed high-intent buyers efficiently." },
      { title: "Checkout CRO", description: "Urgency, guarantees and social proof lifted conversion." },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
import { Target, Search, TrendingUp, MousePointerClick, Compass, LucideIcon } from "lucide-react";

export interface ServiceFAQ { q: string; a: string }
export interface ServicePricing { name: string; price: string; period?: string; features: string[]; highlighted?: boolean }
export interface ServiceTestimonial { quote: string; name: string; role: string }

export interface ServicePageData {
  slug: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  benefits: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  deliverables: string[];
  pricing: ServicePricing[];
  faq: ServiceFAQ[];
  testimonial: ServiceTestimonial;
  metaTitle: string;
  metaDescription: string;
}

export const SERVICES: Record<string, ServicePageData> = {
  "meta-ads": {
    slug: "meta-ads",
    icon: Target,
    eyebrow: "Meta Ads Management",
    title: "Meta Ads that",
    titleHighlight: "actually pay back",
    subtitle:
      "Full-funnel Facebook & Instagram campaigns engineered for measurable ROAS — from creative testing to CAPI-grade tracking.",
    benefits: [
      { title: "Lower CPA", desc: "Systematic audience & creative testing that compounds week over week." },
      { title: "Predictable pipeline", desc: "Consistent lead volume you can forecast against, not just spend." },
      { title: "Trustworthy tracking", desc: "iOS 14+ safe with Conversion API — data you can actually decide on." },
      { title: "Creative that converts", desc: "Concept-driven ads mapped to funnel stage, not one-off boosts." },
    ],
    process: [
      { step: "01", title: "Account audit", desc: "Pixel, CAPI, structure, spend efficiency — everything reviewed." },
      { step: "02", title: "Strategy", desc: "Funnel map, audience sets, creative angles and testing plan." },
      { step: "03", title: "Launch", desc: "Structured campaigns shipped with proper naming and tracking." },
      { step: "04", title: "Optimize", desc: "Weekly iteration on winners; kill losers fast." },
      { step: "05", title: "Scale", desc: "Systematic budget scaling once unit economics hold." },
    ],
    deliverables: [
      "Meta Business Manager audit",
      "Pixel + Conversion API setup",
      "Campaign strategy document",
      "3–5 creative concepts per month",
      "Weekly optimization",
      "Weekly performance report",
      "Monthly strategy call",
    ],
    pricing: [
      {
        name: "Starter",
        price: "$800",
        period: "/month",
        features: ["Up to $10K ad spend", "1 campaign objective", "2 creative concepts", "Weekly report"],
      },
      {
        name: "Growth",
        price: "$1,500",
        period: "/month",
        highlighted: true,
        features: ["Up to $30K ad spend", "Full-funnel campaigns", "5 creative concepts", "Weekly optimization", "Monthly strategy call"],
      },
      {
        name: "Scale",
        price: "Custom",
        features: ["$30K+ ad spend", "Dedicated ad ops", "Unlimited creative concepts", "Bi-weekly strategy calls", "Dashboard access"],
      },
    ],
    faq: [
      { q: "How long until I see results?", a: "Most accounts show measurable movement within 30 days. Meaningful ROAS lift typically lands between day 45 and 90 as tests compound." },
      { q: "Do I need my own creative team?", a: "No. I can either partner with your team or run creative production end-to-end." },
      { q: "What's the minimum ad spend?", a: "$3,000/month. Below that, testing cycles are too slow to be worth the retainer." },
      { q: "Is there a contract?", a: "Month-to-month with a 30-day notice. No long-term lock-ins." },
    ],
    testimonial: {
      quote: "Harez rebuilt our Meta account from scratch. In 90 days ROAS went from 1.2x to 4.3x while we doubled monthly spend.",
      name: "Founder",
      role: "Tahoor Studio",
    },
    metaTitle: "Meta Ads Management — Harez Al Baki",
    metaDescription: "Full-funnel Facebook & Instagram ad campaigns engineered for measurable ROAS. Managed by a consultant with $500K+ in ad spend experience.",
  },

  "google-ads": {
    slug: "google-ads",
    icon: Search,
    eyebrow: "Google Ads",
    title: "Google Ads for",
    titleHighlight: "high-intent buyers",
    subtitle:
      "Search, Performance Max, and YouTube campaigns tuned for qualified traffic and profitable growth.",
    benefits: [
      { title: "Capture high intent", desc: "Show up when your buyers are actively searching for a solution." },
      { title: "Profit-first bidding", desc: "Smart bidding aligned to real business goals, not vanity clicks." },
      { title: "Clean conversion data", desc: "Enhanced conversions and offline tracking for accurate optimization." },
      { title: "Scalable structure", desc: "Account architecture that scales without breaking performance." },
    ],
    process: [
      { step: "01", title: "Keyword & intent research", desc: "Map the buying journey to the right query themes." },
      { step: "02", title: "Account structure", desc: "Campaigns and ad groups aligned to profitability, not products." },
      { step: "03", title: "Ad copy testing", desc: "RSA experiments with concrete hypotheses and metrics." },
      { step: "04", title: "Bid optimization", desc: "Continuous smart-bidding tuning + negative keyword pruning." },
      { step: "05", title: "Scale & expand", desc: "Layer in PMax, YouTube and shopping once search is profitable." },
    ],
    deliverables: [
      "Google Ads audit",
      "Enhanced conversions setup",
      "Keyword & intent map",
      "Campaign build (Search / PMax)",
      "Weekly optimization",
      "Search terms & negatives review",
      "Monthly performance report",
    ],
    pricing: [
      { name: "Starter", price: "$700", period: "/month", features: ["Up to $10K ad spend", "Search only", "Monthly report"] },
      { name: "Growth", price: "$1,400", period: "/month", highlighted: true, features: ["Up to $30K ad spend", "Search + PMax", "Weekly optimization", "Monthly strategy call"] },
      { name: "Scale", price: "Custom", features: ["$30K+ ad spend", "Search + PMax + YouTube", "Dedicated ad ops", "Bi-weekly strategy"] },
    ],
    faq: [
      { q: "Search or Performance Max?", a: "Search first — that's where intent lives. PMax layers on once we have baseline profitability." },
      { q: "Do you handle Shopping campaigns?", a: "Yes, including Merchant Center setup and feed optimization." },
      { q: "What if my landing page is weak?", a: "I'll flag it and can either advise or run the CRO fix myself." },
      { q: "Reporting cadence?", a: "Weekly Slack/email update + monthly deep-dive report and strategy call." },
    ],
    testimonial: {
      quote: "Cost per qualified lead dropped 62% in the first quarter. The account finally feels like an asset, not a leak.",
      name: "Marketing Lead",
      role: "Completo",
    },
    metaTitle: "Google Ads Management — Harez Al Baki",
    metaDescription: "Search, Performance Max, and YouTube campaigns tuned for qualified traffic and profitable growth.",
  },

  "seo": {
    slug: "seo",
    icon: TrendingUp,
    eyebrow: "SEO",
    title: "SEO that",
    titleHighlight: "compounds over time",
    subtitle:
      "Technical + content SEO that builds a defensible organic engine — not a report deck full of vanity keywords.",
    benefits: [
      { title: "Sustainable traffic", desc: "Organic pipeline that keeps working after the retainer ends." },
      { title: "Ranked for money terms", desc: "Focus on queries your buyers actually convert on." },
      { title: "Technical foundation", desc: "Site speed, crawlability and schema handled properly." },
      { title: "Content that ranks & sells", desc: "Written for humans, structured for search." },
    ],
    process: [
      { step: "01", title: "Technical audit", desc: "Full crawl, Core Web Vitals, indexation, schema review." },
      { step: "02", title: "Keyword strategy", desc: "Cluster map built around commercial intent, not volume." },
      { step: "03", title: "On-page optimization", desc: "Titles, meta, internal links, content refresh." },
      { step: "04", title: "Content production", desc: "New pages targeting priority clusters." },
      { step: "05", title: "Authority building", desc: "Digital PR + strategic link acquisition." },
    ],
    deliverables: [
      "Technical SEO audit",
      "Keyword cluster map",
      "On-page optimization",
      "4–8 content pieces / month",
      "Internal linking strategy",
      "Monthly performance report",
      "Quarterly strategy review",
    ],
    pricing: [
      { name: "Foundation", price: "$900", period: "/month", features: ["Technical fixes", "On-page optimization", "2 content pieces", "Monthly report"] },
      { name: "Growth", price: "$1,800", period: "/month", highlighted: true, features: ["Everything in Foundation", "6 content pieces", "Internal linking", "Digital PR outreach"] },
      { name: "Authority", price: "Custom", features: ["Everything in Growth", "12+ content pieces", "Dedicated content team", "Link acquisition budget"] },
    ],
    faq: [
      { q: "How long until I see SEO results?", a: "Meaningful movement typically takes 3–6 months. Compounding gains show from month 6 onward." },
      { q: "Do you write the content?", a: "Yes — I run the strategy and content production with an in-house team." },
      { q: "Do you do local SEO?", a: "Yes, including Google Business Profile optimization." },
      { q: "Will you guarantee rankings?", a: "No, and neither should anyone else. I guarantee process and effort — the market decides positions." },
    ],
    testimonial: {
      quote: "Organic leads went from a trickle to our #1 acquisition channel in nine months.",
      name: "Founder",
      role: "Chhayatoru",
    },
    metaTitle: "SEO Services — Harez Al Baki",
    metaDescription: "Technical + content SEO that builds a defensible organic growth engine.",
  },

  "cro": {
    slug: "cro",
    icon: MousePointerClick,
    eyebrow: "Conversion Rate Optimization",
    title: "Turn more traffic",
    titleHighlight: "into revenue",
    subtitle:
      "Structured experimentation on your funnel — landing pages, checkout, forms — so every visitor is worth more.",
    benefits: [
      { title: "Cheaper CAC", desc: "Higher conversion means lower blended acquisition cost." },
      { title: "Compounding lift", desc: "Every winning test carries into every future campaign." },
      { title: "Evidence over opinion", desc: "Decisions backed by data, not the loudest stakeholder." },
      { title: "Faster growth", desc: "Unblock scale by fixing the leaks before pouring more spend in." },
    ],
    process: [
      { step: "01", title: "Research", desc: "Heatmaps, session recordings, user interviews, funnel analytics." },
      { step: "02", title: "Hypothesis", desc: "Ranked backlog of tests scored on impact and confidence." },
      { step: "03", title: "Design & build", desc: "New variants designed and shipped for A/B testing." },
      { step: "04", title: "Test", desc: "Statistically valid experiments run to completion." },
      { step: "05", title: "Roll out & learn", desc: "Ship winners, document losers, feed next round." },
    ],
    deliverables: [
      "Full funnel audit",
      "Heatmap & recording setup",
      "Prioritized test backlog",
      "2–4 experiments per month",
      "Landing page design",
      "Monthly insights report",
    ],
    pricing: [
      { name: "Sprint", price: "$1,200", period: "one-time", features: ["Funnel audit", "10-item backlog", "1 landing page redesign"] },
      { name: "Ongoing", price: "$2,200", period: "/month", highlighted: true, features: ["2–4 tests/month", "Landing page design", "Monthly report", "Bi-weekly call"] },
      { name: "Enterprise", price: "Custom", features: ["Full CRO program", "Dedicated designer + analyst", "Weekly cadence"] },
    ],
    faq: [
      { q: "Do I need a lot of traffic?", a: "Ideally 20K+ monthly visits for statistically valid A/B tests. Lower traffic? We'll use qualitative research + iterative design instead." },
      { q: "What tools do you use?", a: "GA4, Microsoft Clarity, Hotjar, VWO or Convert depending on your stack." },
      { q: "Do you design the new pages?", a: "Yes — design and build are included in the Ongoing plan." },
      { q: "How is a 'win' defined?", a: "Statistical significance at 95%, positive lift on the primary business metric — not just clicks." },
    ],
    testimonial: {
      quote: "One landing-page test lifted conversion 38%. That single change paid for the retainer for the year.",
      name: "Head of Growth",
      role: "Completo",
    },
    metaTitle: "Conversion Rate Optimization — Harez Al Baki",
    metaDescription: "Structured CRO experimentation on landing pages, checkout, and forms.",
  },

  "marketing-consulting": {
    slug: "marketing-consulting",
    icon: Compass,
    eyebrow: "Marketing Consulting",
    title: "A senior operator",
    titleHighlight: "in your corner",
    subtitle:
      "Fractional marketing leadership — strategy, channel mix, hiring and reporting — without a full-time salary.",
    benefits: [
      { title: "Clear strategy", desc: "A written plan the whole team can execute against." },
      { title: "Right channel mix", desc: "Stop spreading budget thin across channels that don't fit." },
      { title: "Hire smarter", desc: "Job specs, interview loops and vendor evaluation done right." },
      { title: "Accountability", desc: "Weekly cadence, real KPIs, no vanity metrics." },
    ],
    process: [
      { step: "01", title: "Discovery", desc: "Deep dive into product, customers, unit economics." },
      { step: "02", title: "Strategy", desc: "12-month roadmap: positioning, ICP, channels, targets." },
      { step: "03", title: "Operating rhythm", desc: "Weekly / monthly review cadence installed." },
      { step: "04", title: "Execute", desc: "Guide the team; recruit vendors or hires where needed." },
      { step: "05", title: "Review & adjust", desc: "Quarterly recalibration against real data." },
    ],
    deliverables: [
      "Marketing strategy document",
      "ICP & positioning brief",
      "12-month channel roadmap",
      "KPI framework & dashboard",
      "Weekly 1:1 with founder",
      "Vendor / hire recommendations",
      "Quarterly review",
    ],
    pricing: [
      { name: "Advisor", price: "$1,000", period: "/month", features: ["2 hours / week", "Async Slack access", "Monthly review"] },
      { name: "Fractional CMO", price: "$3,500", period: "/month", highlighted: true, features: ["8 hours / week", "Weekly team leadership", "Strategy + execution oversight", "Hiring support"] },
      { name: "Project", price: "Custom", features: ["Fixed-scope strategy engagement", "3–6 week timelines"] },
    ],
    faq: [
      { q: "How is this different from an agency?", a: "You get a senior operator embedded in your business — not an account manager passing briefs to juniors." },
      { q: "Do you execute or just advise?", a: "Both. Advisor is strategy only; Fractional CMO includes execution oversight and can pick up campaigns directly." },
      { q: "Minimum commitment?", a: "3 months. Real change takes more than one quarter." },
      { q: "Do you sign NDAs?", a: "Yes — happy to sign yours before discovery." },
    ],
    testimonial: {
      quote: "Having Harez on the leadership call every week transformed how we make marketing decisions.",
      name: "CEO",
      role: "Light of Hope",
    },
    metaTitle: "Marketing Consulting — Harez Al Baki",
    metaDescription: "Fractional marketing leadership — strategy, channel mix, hiring and reporting.",
  },
};

export const SERVICE_LIST = Object.values(SERVICES);
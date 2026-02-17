// src/lib/careers.ts

export type CareerRole = {
  slug: string;
  title: string;
  location: string;
  type: string;

  // short
  summary: string;
  bullets: string[];

  // in-depth (paragraphs)
  description: string[];

  // sections
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  tools: string[];
};

export const CAREER_ROLES: CareerRole[] = [
  {
    slug: "videographer-editor",
    title: "Videographer / Editor",
    location: "Phoenix Metro (Hybrid / On-site shoots)",
    type: "Contract / Part-time (growth to full-time)",
    summary:
      "High-end capture + post for premium brands. If your work doesn’t look studio-level, this isn’t the role.",
    bullets: [
      "3–5+ years professional/studio-level shooting + editing",
      "Work samples REQUIRED (real client work only)",
      "Elite pacing, sound design, and color consistency",
    ],
    description: [
      "Slater Media Company is building a top-tier creative studio — not a content mill. This role is for a true operator: someone who can walk into any environment, capture cinematic footage with intent, and deliver edits that feel expensive, polished, and brand-defining.",
      "We’re looking for 3–5+ years of professional/studio experience (agency, production house, or consistent paid client work). You must show real work samples that prove you can deliver at the highest level — strong hooks, clean compositions, controlled camera movement, excellent audio discipline, and confident grading.",
      "If you’re still figuring out basics, experimenting with style, or relying on trendy templates, you won’t like this job. We care about taste, execution, speed, and consistency — every deliverable must look like it belongs in a premium brand campaign.",
    ],
    responsibilities: [
      "Execute shoots with a clear plan (hook, story, product/brand focus, CTA).",
      "Capture clean footage: stabilized movement, proper exposure, intentional framing, usable audio.",
      "Deliver multi-format exports: 9:16, 1:1, 16:9 with platform-safe specs.",
      "Edit at a premium standard: pacing, sound design, music selection, captions/titles when needed.",
      "Color correct/grade with consistency across scenes and across deliverables.",
      "Turn projects around fast while maintaining studio-level quality (no sloppy timelines).",
      "Maintain organized project folders and professional handoff (source, proxies, exports).",
      "Take feedback without ego and execute revisions quickly and precisely.",
    ],
    requirements: [
      "3–5+ years professional videography + editing experience (paid work).",
      "A portfolio/reel of REAL work samples (client projects, campaigns, or professional productions).",
      "Demonstrated ability to create premium short-form (Reels/TikTok) AND clean long-form.",
      "Strong fundamentals: lighting awareness, composition, camera movement, audio discipline.",
      "Reliable transportation + punctuality (Phoenix metro shoots).",
      "Professional communication: on-time updates, clear expectations, no ghosting.",
    ],
    niceToHave: [
      "Agency/ad creative experience (performance + brand deliverables).",
      "Advanced sound design workflow (SFX layers, transitions, clean mix).",
      "After Effects capability for minimal motion graphics (lower thirds, callouts, titles).",
      "Drone capability (Part 107 preferred).",
      "Lighting kit ownership + ability to run quick practical setups.",
    ],
    tools: [
      "Premiere Pro OR DaVinci Resolve (must be fluent)",
      "After Effects (bonus)",
      "Camera system + stabilization (gimbal/tripod)",
      "Audio tools (lav/shotgun + basic cleanup)",
    ],
  },

  {
    slug: "photographer",
    title: "Photographer",
    location: "Phoenix Metro (On-site shoots)",
    type: "Contract / Per-project",
    summary:
      "Commercial-level photography only. If your images don’t look premium and intentional, we’re not a fit.",
    bullets: [
      "3–5+ years professional/studio photography experience",
      "Work samples link REQUIRED (no exceptions)",
      "Consistent lighting + editorial-quality composition",
    ],
    description: [
      "This is not casual photography. We’re hiring a photographer who can deliver commercial-level images that look like they belong in a brand campaign — clean lighting, controlled highlights, intentional framing, and consistent edits.",
      "We require 3–5+ years of professional/studio experience and a link to real work samples (client galleries, campaigns, or published work). If you can’t provide strong examples, we won’t review the application.",
      "You must be able to direct subjects, style scenes, and produce a consistent look fast. We care about details — sharpness, color integrity, composition, and a final product that feels premium every time.",
    ],
    responsibilities: [
      "Plan and execute shoots from a shot list (deliverable-first thinking).",
      "Work efficiently on-location: adapt quickly to lighting, space, and timeline.",
      "Deliver consistent edits and export sets sized for web + social.",
      "Provide clean selects + organized galleries for client review.",
      "Maintain a repeatable look that matches the brand’s visual identity.",
    ],
    requirements: [
      "3–5+ years professional photography experience (paid work).",
      "Work samples link REQUIRED (website/Drive/gallery). Real work only.",
      "Strong fundamentals: lighting, composition, lens choice, color accuracy.",
      "Reliable transportation + on-time arrival (Phoenix metro).",
      "Fast turnaround capability without sacrificing quality.",
    ],
    niceToHave: [
      "Food photography experience (texture, steam, reflections, plating angles).",
      "Real estate/interiors experience (wide, vertical lines, clean color).",
      "Off-camera flash / strobe knowledge.",
      "Portrait directing skills (posers, expressions, confidence on set).",
    ],
    tools: [
      "Lightroom OR Capture One (must be fluent)",
      "Photoshop (retouching basics required)",
      "Professional camera + lens set appropriate for commercial work",
    ],
  },

  {
    slug: "graphic-designer",
    title: "Graphic Designer",
    location: "Remote (Arizona preferred)",
    type: "Contract / Part-time",
    summary:
      "High-level brand design only. We want elite typography, layout, and taste — not template graphics.",
    bullets: [
      "3–5+ years professional design experience",
      "Portfolio REQUIRED (brand + social + ads)",
      "Systems thinking: consistent brand output at speed",
    ],
    description: [
      "We’re looking for a designer with real taste and professional execution — someone who can create premium brand visuals that don’t feel templated. This role supports social graphics, ad creative, flyers, menus, thumbnails, and brand assets for clients who expect high-level work.",
      "3–5+ years of professional experience is required (agency, in-house, or strong freelance track record). You must provide a portfolio with real client work that proves you understand typography, hierarchy, layout systems, spacing, and consistency.",
      "If your work leans on Canva templates, random effects, or inconsistent styling, you won’t enjoy this role. We move fast, but quality stays high — every graphic should feel intentional and premium.",
    ],
    responsibilities: [
      "Design social + ad creative with clear hierarchy, readability, and brand consistency.",
      "Create and maintain brand systems (type scales, spacing, color usage, templates).",
      "Deliver production-ready exports (IG, TikTok, print sizes when needed).",
      "Work with photo/video team to keep visual language consistent across campaigns.",
      "Maintain clean source files and professional handoff (organized components + naming).",
    ],
    requirements: [
      "3–5+ years professional graphic design experience (paid work).",
      "Portfolio REQUIRED (brand, ads, social, layout samples).",
      "Strong typography and layout fundamentals (must be obvious in portfolio).",
      "Ability to match/extend an existing brand system quickly and accurately.",
      "Fast turnaround without sacrificing polish.",
    ],
    niceToHave: [
      "Motion design ability (simple text animation, story graphics, ad variations).",
      "Web/UI sensibility (spacing, modern UI patterns).",
      "Illustration or icon design capability.",
    ],
    tools: [
      "Figma (preferred)",
      "Adobe Illustrator",
      "Photoshop",
      "After Effects (bonus)",
    ],
  },

  {
    slug: "social-media-manager",
    title: "Social Media Manager",
    location: "Remote / Hybrid (depending on client)",
    type: "Contract / Part-time",
    summary:
      "High-accountability operator only. We want someone who drives performance, not just posting.",
    bullets: [
      "3–5+ years managing brand accounts professionally",
      "Proof of results REQUIRED (screenshots/links/case study)",
      "Systems + consistency + performance mindset",
    ],
    description: [
      "This role is for a serious social operator — someone who can run accounts like a system, keep output consistent, and push performance with intent. We’re not hiring a casual poster. We’re hiring someone who understands hooks, pacing, content pillars, and how to build momentum over time.",
      "We require 3–5+ years of professional social media management experience and proof of results (links, screenshots, case studies, or accounts you’ve managed). If you can’t show outcomes, we won’t review the application.",
      "If you love structure, speed, and accountability — and you can execute clean plans every week without being chased — you’ll thrive here.",
    ],
    responsibilities: [
      "Build and maintain content calendars (weekly execution, not wishful planning).",
      "Write high-performing captions (hooks, CTAs, clarity, brand voice).",
      "Publish consistently and manage engagement/community professionally.",
      "Coordinate deliverables with the creative team (deadlines, needs, shot lists).",
      "Track and report performance (watch time, saves, shares, CTR, reach) and iterate.",
      "Recommend changes based on data: formats, topics, hooks, posting cadence, content pillars.",
    ],
    requirements: [
      "3–5+ years professional social media management experience.",
      "Proof of results REQUIRED (accounts, links, metrics screenshots, case study).",
      "Strong writing + trend awareness + brand voice control.",
      "Highly organized (calendar, workflows, deadlines).",
      "Able to communicate clearly and consistently (no gaps).",
    ],
    niceToHave: [
      "Experience coordinating short-form video pipelines (Reels/TikTok).",
      "Paid social knowledge (boosting basics, audience targeting fundamentals).",
      "Local AZ brand knowledge (restaurants/events) is a plus.",
    ],
    tools: [
      "Meta Business Suite",
      "Scheduling tools (Later/Buffer/etc.)",
      "Analytics reporting (native + simple dashboards)",
      "Google Docs/Sheets/Notion (for planning)",
    ],
  },
];

export function getRole(slug: string) {
  return CAREER_ROLES.find((r) => r.slug === slug);
}



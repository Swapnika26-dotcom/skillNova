/**
 * Local demo implementation — no external AI API or API keys required.
 * PDF analysis returns representative sample data (the file is not parsed in the browser).
 */

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function askStudyBuddy(question: string) {
  await delay(350);
  const q = question.toLowerCase();

  if (/(hello|hi\b|hey)/.test(q)) {
    return "Hi! I'm your **Study Buddy** (offline demo). Ask about data structures, OS, networks, DBMS, or any BTech topic — I'll give structured, exam-friendly notes.";
  }
  if (/data structure|array|linked|tree|graph|sort|complexity|big.?o/.test(q)) {
    return `### Data structures & complexity\n\n- **Big-O**: describes worst-case growth; **O(1)** access vs **O(n)** scan matters for interviews.\n- **Arrays vs linked lists**: arrays give cache-friendly indexing; linked lists help frequent inserts/deletes at known positions.\n- **Trees & graphs**: BST for ordered search; BFS/DFS for traversal; practice **inorder/preorder/postorder** and when each fits.\n\n*Tip:* Pair every concept with **one small example** you can sketch on paper.`;
  }
  if (/os\b|operating|process|thread|deadlock|scheduling|memory/.test(q)) {
    return `### Operating systems (quick refresher)\n\n- **Process vs thread**: isolation vs lighter context switch; shared address space within a process.\n- **Scheduling**: FCFS, SJF, RR — trade latency vs throughput.\n- **Deadlock**: four conditions (mutual exclusion, hold-and-wait, no preemption, circular wait); break one to prevent.\n- **Virtual memory**: paging, TLB, page faults.\n\nRelate each term to **why** it exists (performance, safety, fairness).`;
  }
  if (/network|tcp|udp|http|osi|dns|routing/.test(q)) {
    return `### Computer networks\n\n- **OSI vs TCP/IP**: layering hides complexity; know **L4 (TCP/UDP)** vs **L7 (HTTP)**.\n- **TCP**: reliable, ordered, congestion control; **UDP**: low latency, no guarantees.\n- **HTTP/HTTPS**: methods (GET/POST), status codes, TLS for encryption.\n\nDraw a **request–response** once with headers + body to lock it in.`;
  }
  if (/dbms|sql|database|normalization|transaction|acid/.test(q)) {
    return `### DBMS essentials\n\n- **ACID**: Atomicity, Consistency, Isolation, Durability — the contract for reliable transactions.\n- **Normalization**: reduce redundancy (1NF → 3NF typical for OLTP).\n- **SQL**: JOIN types, indexes (speed vs write cost), EXPLAIN plans for tuning.\n\nPractice **one** schema design: users, orders, order_items with keys and FKs.`;
  }

  return `### Answer (offline tutor)\n\nYou asked about: **${question.slice(0, 200)}${question.length > 200 ? "…" : ""}**\n\n1. **Define** the core terms in one line each.\n2. **Compare** with a related idea (e.g. time vs space, synchronous vs async).\n3. **Example**: a tiny scenario or equation.\n4. **Pitfall**: a common mistake in exams or interviews.\n\nThis build runs **without** cloud AI — answers are templated. For deeper, custom explanations, you could plug in an API later.`;
}

const DOMAIN_IDEAS: Record<string, string[]> = {
  "AI & Machine Learning": [
    "Edge-based gesture classifier on microcontroller with tiny CNN and on-device calibration UI.",
    "Semester-grade predictor using tabular models + SHAP for explainability to students.",
    "Low-resource NLP: keyword extraction + summarization for lecture PDFs offline.",
    "Time-series anomaly detector for lab sensor data with simple LSTM or statistical baseline.",
    "Federated learning demo: train on synthetic shards without centralizing raw data.",
  ],
  "App Development": [
    "Cross-platform habit tracker with local-first sync (CRDT) and optional cloud backup.",
    "Campus lost-and-found with QR check-in and moderated photo uploads.",
    "Pair-programming timer + shared notes PWA for project teams.",
    "Expense splitter with receipt OCR pipeline and settle-up reminders.",
    "Accessibility-first reader app: dyslexia-friendly typography and TTS.",
  ],
  "Data Science": [
    "Open dataset story: housing or health — full EDA notebook + one deployed Streamlit view.",
    "A/B test simulator for marketing class with power analysis and confidence intervals.",
    "Churn model with calibration plot and business-threshold tuning write-up.",
    "Geospatial heatmap of campus amenities with public OSM data.",
    "Auto-report generator: pandas + matplotlib templates for weekly lab metrics.",
  ],
  "Cyber Security": [
    "Home lab: pfSense or OPNSense VM with IDS rules and log review checklist.",
    "JWT misuse scanner for student projects (alg none, weak secrets) as a CLI tool.",
    "Phishing awareness mini-site with benign quizzes and score feedback.",
    "Simple port scanner + banner grabber with rate limits and ethics README.",
    "Secrets-in-repo pre-commit hook using trufflehog or gitleaks patterns.",
  ],
  "Cloud Computing": [
    "Terraform modules for a static site + CDN + HTTPS with cost estimates.",
    "Serverless image resize pipeline (upload → queue → thumbnail) with observability.",
    "Multi-region failover drill doc for a sample API behind load balancer.",
    "Cost dashboard: tag resources, set budgets, alert on anomaly spend.",
    "Containerize a Node API + compose for local dev matching prod constraints.",
  ],
  "Internet of Things": [
    "Soil moisture + pump controller with hysteresis to avoid chatter; MQTT to dashboard.",
    "BLE room occupancy counter with privacy-preserving aggregation.",
    "Energy monitor clip-on prototype with calibration wizard and CSV export.",
    "Smart locker POC: QR unlock + audit log on ESP32.",
    "Wearable posture buzzer using IMU thresholds and simple filtering.",
  ],
  Robotics: [
    "Line follower with PID tuning UI and logged runs for report graphs.",
    "2D SLAM toy world in simulation (ROS or Webots) with map export.",
    "Robotic arm inverse kinematics visualizer for 2-link planar arm.",
    "Warehouse bot routing: A* on grid with dynamic obstacle replay.",
    "Gripper force feedback demo using cheap load cell + ADC.",
  ],
  "AR / VR": [
    "AR furniture placement prototype with plane detection and scale gizmos.",
    "VR lab safety walkthrough with quiz gates per station.",
    "Hand tracking UI for assembling virtual mechanical parts (guided steps).",
    "360 campus tour with hotspots and accessibility captions.",
    "Shader experiment: stylized outline for AR objects matching brand palette.",
  ],
  "UI / UX Design": [
    "Design system starter: tokens, components, and dark mode in Figma + dev handoff doc.",
    "Onboarding flow for a study app with progressive disclosure and metrics.",
    "Heuristic evaluation of a government portal with severity-tagged issues.",
    "Usability test plan (5 users) for a campus booking flow + affinity mapping.",
    "Inclusive color audit: contrast checker + alternative patterns for charts.",
  ],
};

function ideasForDomain(domain: string, resumeProfile?: unknown): string[] {
  const base = DOMAIN_IDEAS[domain] ?? [
    `Capstone in **${domain}**: problem statement, literature survey, methodology, evaluation metrics.`,
    "Open-source contribution: fix a good-first-issue, document the PR story.",
    "Benchmark suite comparing two approaches with charts and honest limitations.",
    "Teaching artifact: 10-slide deck + 5 quiz questions for peers.",
    "Portfolio piece: README with architecture diagram and demo GIF.",
  ];
  if (resumeProfile && typeof resumeProfile === "object" && "matchedSkills" in resumeProfile) {
    const skills = (resumeProfile as { matchedSkills?: string[] }).matchedSkills?.slice(0, 2) ?? [];
    if (skills.length) {
      return base.map((idea, i) =>
        i === 0 ? `${idea} (lean on skills: ${skills.join(", ")})` : idea
      );
    }
  }
  return [...base];
}

export async function generateInnovationIdeas(domain: string, resumeProfile?: unknown) {
  await delay(400);
  return ideasForDomain(domain, resumeProfile);
}

function studyPlanMarkdown(profile: Record<string, unknown>) {
  const matched = Array.isArray(profile.matchedSkills)
    ? (profile.matchedSkills as string[]).join(", ")
    : "your core technical skills";
  const missing = Array.isArray(profile.missingSkills)
    ? (profile.missingSkills as string[]).join(", ")
    : "identified growth areas";
  return `## 4-week study plan (local demo)

**Focus:** strengthen **${matched}** and systematically address **${missing}**.

### Week 1 — Foundations
- Daily: 90 min theory + 30 min practice problems.
- Review one fundamental topic per day; keep a **mistake log**.

### Week 2 — Applied projects
- Build a **small end-to-end** project using your strongest skill.
- Add tests, README, and one metric (performance or accuracy).

### Week 3 — Gaps & depth
- Allocate 60% time to **${missing.split(",")[0]?.trim() || "priority gap topics"}** (videos + docs + exercises).
- Mock **one** interview round with a peer.

### Week 4 — Integration
- Combine week 2 project with a new constraint (scale, security, or UX).
- Polish portfolio: demo link, architecture diagram, lessons learned.

---

*Generated offline — customize weeks to your exam and interview dates.*`;
}

export async function generateStudyPlan(resumeProfile: unknown) {
  await delay(500);
  const profile = resumeProfile && typeof resumeProfile === "object" ? (resumeProfile as Record<string, unknown>) : {};
  return studyPlanMarkdown(profile);
}

function roadmapMarkdown(profile: Record<string, unknown>) {
  const level = typeof profile.experienceLevel === "string" ? profile.experienceLevel : "Intermediate";
  const matched = Array.isArray(profile.matchedSkills)
    ? (profile.matchedSkills as string[]).join(", ")
    : "your strengths";
  return `## 12-month career roadmap (local demo)
**Profile level:** ${level} · **Leverage:** ${matched}

### Q1 — Credibility
- 1 portfolio project shipped with README + metrics.
- 1 certification or structured course aligned to target role.
- Update LinkedIn and resume with **quantified** bullets.

### Q2 — Visibility
- Blog or short posts on problems you solved.
- Contribute to open source or campus tech club leadership.
- Attend 2–3 virtual or local meetups; follow up with one connection per event.

### Q3 — Interview readiness
- Weekly **DSA** + **system design** (if applicable) on a schedule.
- Behavioral stories (STAR) for 5 common prompts.
- Mock interviews and feedback loop.

### Q4 — Job search sprint
- Target list of companies and roles; tailor resume per track.
- Referral outreach template; track applications in a spreadsheet.
- Offer negotiation checklist ready before first call.

---

*Offline template — adjust quarters to internships, exams, or placements.*`;
}

export async function generateCareerRoadmap(resumeProfile: unknown) {
  await delay(500);
  const profile = resumeProfile && typeof resumeProfile === "object" ? (resumeProfile as Record<string, unknown>) : {};
  return roadmapMarkdown(profile);
}

/** Deterministic pseudo-score from binary length (no PDF parsing in browser). */
function scoreFromPdfPayload(pdfBase64: string): number {
  let h = 0;
  for (let i = 0; i < pdfBase64.length; i++) h = (h * 31 + pdfBase64.charCodeAt(i)) >>> 0;
  return 68 + (h % 28);
}

const TARGET_POOL_A = [
  "Google", "Microsoft", "Amazon", "Adobe", "Salesforce", "Oracle", "SAP",
];
const TARGET_POOL_B = [
  "TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Cognizant", "Accenture",
];
const TARGET_POOL_C = [
  "Flipkart", "Razorpay", "Zoho", "Freshworks", "Meesho", "Swiggy", "PhonePe",
];

/** Rotate suggested targets from pools so lists feel varied but deterministic. */
function targetCompaniesForScore(score: number): string[] {
  const i = score % 3;
  const pools = [TARGET_POOL_A, TARGET_POOL_B, TARGET_POOL_C] as const;
  const primary = pools[i];
  const secondary = pools[(i + 1) % 3];
  return [...primary.slice(0, 4), ...secondary.slice(0, 2)];
}

export async function analyzeResumePDF(pdfBase64: string) {
  await delay(600);
  const score = scoreFromPdfPayload(pdfBase64);
  return {
    score,
    matchedSkills: ["JavaScript / TypeScript", "Problem solving", "Communication", "Git / version control"],
    missingSkills: ["System design", "Cloud (AWS/GCP)", "Testing (unit/e2e)", "SQL performance tuning"],
    experienceLevel: score >= 82 ? "Intermediate" : "Entry",
    targetCompanies: targetCompaniesForScore(score),
    suggestion:
      "Local demo mode: the PDF is not parsed by an AI service. Replace this module with a real analyzer if you add an API. Meanwhile, tighten action verbs, quantify impact, and align skills with target job descriptions.",
  };
}

const ROLE_TEMPLATES = [
  {
    title: "Full-stack engineer",
    description: "Build and maintain web apps across frontend frameworks and APIs, with focus on reliability and UX.",
    companies: ["Mid-size product companies", "Startups", "Consultancies"],
  },
  {
    title: "Frontend engineer",
    description: "Ship accessible, performant UIs; collaborate on design systems and state management.",
    companies: ["SaaS vendors", "E-commerce", "Agencies"],
  },
  {
    title: "Backend / API engineer",
    description: "Design services, data models, and integrations; care about security and observability.",
    companies: ["Fintech", "Enterprise IT", "Cloud-native startups"],
  },
  {
    title: "DevOps / platform engineer",
    description: "Automate builds, deployments, and infrastructure; improve developer experience.",
    companies: ["Tech product firms", "Managed services", "Open-source tooling orgs"],
  },
  {
    title: "Data / analytics engineer",
    description: "Pipelines, warehouses, and dashboards; bridge between raw data and business decisions.",
    companies: ["Analytics teams", "Retail tech", "Health informatics"],
  },
];

export async function recommendJobs(skills: string, resumeProfile: unknown) {
  await delay(450);
  const base = typeof resumeProfile === "object" && resumeProfile && "score" in resumeProfile
    ? Number((resumeProfile as { score?: number }).score)
    : 72;
  const skillsLower = skills.toLowerCase();
  const bump = (title: string, i: number) => {
    let pct = Math.min(95, Math.max(55, Math.round(base - 5 + i * 3 + (skillsLower.length % 7))));
    if (skillsLower.includes("react") && title.includes("Frontend")) pct = Math.min(95, pct + 8);
    if (skillsLower.includes("node") && title.includes("Backend")) pct = Math.min(95, pct + 8);
    return pct;
  };

  return ROLE_TEMPLATES.map((role, i) => ({
    ...role,
    matchPercentage: bump(role.title, i),
    matchDetails:
      "Local demo: match score blends a baseline with your skill keywords. Connect a real job API or LLM later for market-specific roles.",
  }));
}

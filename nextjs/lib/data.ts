export interface Institution {
  id: string;
  officialId: string;
  name: string;
  type: string;
  address: string;
  state: string;
  district: string;
  website: string;
  verificationStatus: "verified" | "pending" | "flagged";
  aliases: string[];
  riskScore: number; // 0 - 100
  casesCount: number;
  activeBureaus: string[];
  accreditation: string;
  establishedYear: number;
}

export interface CaseItem {
  id: string;
  caseNumber: string;
  institutionId: string;
  institutionName: string;
  bureau: "Admissions" | "Approval Bureau" | "Examinations" | "Vigilance Bureau" | "Grievance Cell" | "Faculty Welfare" | "Research & Grants";
  category: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "new" | "open" | "pending" | "resolved" | "closed";
  ownerName: string;
  ownerBureau: string;
  createdAt: string;
  dueDate: string;
  sourceSystem: string;
  attachmentsCount: number;
  hasOverlapAlert?: boolean;
}

export interface OverlapItem {
  id: string;
  caseAId: string;
  caseBId: string;
  caseANumber: string;
  caseBNumber: string;
  institutionName: string;
  bureauA: string;
  bureauB: string;
  subjectA: string;
  subjectB: string;
  institutionScore: number; // 0 - 100
  complaintScore: number; // 0 - 100
  actionConflictScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  evidence: string[];
  detectionTimestamp: string;
  reviewStatus: "pending" | "confirmed" | "rejected" | "more_info";
  reviewerName?: string;
  reviewNotes?: string;
  conflictType: "Contradictory Directives" | "Duplicate Grievance" | "Simultaneous Enforcement" | "Jurisdiction Ambiguity";
}

export interface CoordinationItem {
  id: string;
  coordNumber: string;
  caseIds: string[];
  requestingBureau: string;
  receivingBureau: string;
  purpose: string;
  evidence: string[];
  coordinatorName: string;
  deadline: string;
  status: "draft" | "submitted" | "awaiting_response" | "response_received" | "completed" | "cancelled";
  createdAt: string;
  decision?: string;
  decisionNotes?: string;
  urgency: "Normal" | "Urgent" | "Emergency";
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  bureau: string;
  hash: string;
}

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    officialId: "AICTE-SIT-4921",
    name: "Synthetic Institute of Technology",
    type: "Engineering & Technology",
    address: "123 Main Knowledge Corridor, Sector 4",
    state: "Karnataka",
    district: "Bengaluru Urban",
    website: "https://sit-tech.edu.in",
    verificationStatus: "verified",
    aliases: ["SIT", "Synthetic Tech", "SIT Cityville Campus"],
    riskScore: 78,
    casesCount: 3,
    activeBureaus: ["Admissions", "Examinations", "Approval Bureau"],
    accreditation: "NBA Accredited Tier-1, NAAC A+",
    establishedYear: 2004,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    officialId: "AICTE-BIAS-8819",
    name: "Bengaluru Institute of Aeronautical Sciences",
    type: "Aeronautics & Applied Sciences",
    address: "Airbase Link Road, Yelahanka",
    state: "Karnataka",
    district: "Bengaluru Rural",
    website: "https://bias-aero.ac.in",
    verificationStatus: "flagged",
    aliases: ["BIAS", "Bangalore Aero Institute"],
    riskScore: 89,
    casesCount: 4,
    activeBureaus: ["Approval Bureau", "Vigilance Bureau", "Grievance Cell"],
    accreditation: "Provisional Approval (Under Audit)",
    establishedYear: 2011,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    officialId: "AICTE-DTU-1002",
    name: "Delhi Technological & Research Academy",
    type: "State Technical University",
    address: "Bawana Road, Shahbad Daulatpur",
    state: "Delhi",
    district: "North West Delhi",
    website: "https://dtra.delhi.gov.in",
    verificationStatus: "verified",
    aliases: ["DTRA", "Delhi Tech Academy"],
    riskScore: 18,
    casesCount: 1,
    activeBureaus: ["Research & Grants"],
    accreditation: "NAAC A++, NIRF Rank 24",
    establishedYear: 1998,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    officialId: "AICTE-MAP-3312",
    name: "Maharashtra Apex College of Pharmacy & Biotech",
    type: "Pharmacy & Life Sciences",
    address: "Ganeshkhind Road, Shivajinagar",
    state: "Maharashtra",
    district: "Pune",
    website: "https://apexpharmpune.org",
    verificationStatus: "verified",
    aliases: ["Apex Pune", "MAP College"],
    riskScore: 35,
    casesCount: 2,
    activeBureaus: ["Approval Bureau", "Faculty Welfare"],
    accreditation: "PCI Approved, NAAC A",
    establishedYear: 2008,
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    officialId: "AICTE-ERPA-9120",
    name: "Eastern Regional Polytechnic Academy",
    type: "Polytechnic Diploma",
    address: "Bidhannagar Salt Lake Sector V",
    state: "West Bengal",
    district: "Kolkata",
    website: "https://erpa-polytechnic.wb.gov.in",
    verificationStatus: "verified",
    aliases: ["ERPA Salt Lake", "Bengal Tech Poly"],
    riskScore: 22,
    casesCount: 1,
    activeBureaus: ["Examinations"],
    accreditation: "State Board Affiliated, AICTE Recognized",
    establishedYear: 2001,
  },
];

export const INITIAL_CASES: CaseItem[] = [
  {
    id: "c-001",
    caseNumber: "CASE-2026-001",
    institutionId: "11111111-1111-1111-1111-111111111111",
    institutionName: "Synthetic Institute of Technology",
    bureau: "Admissions",
    category: "Intake & Eligibility",
    subject: "Eligibility criteria ambiguity for lateral entry seats",
    description: "Multiple student representations claiming conflicting cutoff thresholds between published portal prospectus and centralized seat allocation algorithm.",
    priority: "high",
    status: "open",
    ownerName: "Officer Vikram Sharma",
    ownerBureau: "Admissions Bureau",
    createdAt: "2026-10-22",
    dueDate: "2026-11-05",
    sourceSystem: "National Admissions Portal (NAP)",
    attachmentsCount: 4,
    hasOverlapAlert: true,
  },
  {
    id: "c-002",
    caseNumber: "CASE-2026-002",
    institutionId: "11111111-1111-1111-1111-111111111111",
    institutionName: "Synthetic Institute of Technology",
    bureau: "Examinations",
    category: "Curriculum Compliance",
    subject: "Candidate enrollment blocking pending eligibility vetting",
    description: "Examinations bureau placed a hold on hall tickets for 38 lateral entry students citing missing prerequisite course equivalence certification.",
    priority: "critical",
    status: "new",
    ownerName: "Officer Neha Deshmukh",
    ownerBureau: "Examinations Bureau",
    createdAt: "2026-10-24",
    dueDate: "2026-10-31",
    sourceSystem: "AICTE Examination Registry",
    attachmentsCount: 2,
    hasOverlapAlert: true,
  },
  {
    id: "c-003",
    caseNumber: "CASE-2026-003",
    institutionId: "22222222-2222-2222-2222-222222222222",
    institutionName: "Bengaluru Institute of Aeronautical Sciences",
    bureau: "Approval Bureau",
    category: "Extension of Approval (EoA)",
    subject: "Application for 2026-27 EoA processing under self-declaration",
    description: "Institution submitted Form-A for renewal of aerospace intake (120 seats) with uploaded architect building stability clearance.",
    priority: "medium",
    status: "pending",
    ownerName: "Dr. K. Ramanathan",
    ownerBureau: "Approval Bureau",
    createdAt: "2026-10-18",
    dueDate: "2026-11-10",
    sourceSystem: "AICTE Web Portal 3.0",
    attachmentsCount: 7,
    hasOverlapAlert: true,
  },
  {
    id: "c-004",
    caseNumber: "CASE-2026-004",
    institutionId: "22222222-2222-2222-2222-222222222222",
    institutionName: "Bengaluru Institute of Aeronautical Sciences",
    bureau: "Vigilance Bureau",
    category: "Inspection Audit",
    subject: "Surprise scrutiny recommendation for hangar & lab facilities",
    description: "Confidential vigilance tip citing leased wind tunnel facility decommissioned without regulatory notification; recommended temporary freeze on new seat allotments.",
    priority: "critical",
    status: "open",
    ownerName: "Director S. Roy",
    ownerBureau: "Vigilance Bureau",
    createdAt: "2026-10-23",
    dueDate: "2026-10-29",
    sourceSystem: "Central Vigilance Dossier",
    attachmentsCount: 3,
    hasOverlapAlert: true,
  },
  {
    id: "c-005",
    caseNumber: "CASE-2026-005",
    institutionId: "22222222-2222-2222-2222-222222222222",
    institutionName: "Bengaluru Institute of Aeronautical Sciences",
    bureau: "Grievance Cell",
    category: "Faculty Grievance",
    subject: "Non-disbursement of 7th CPC arrears to 14 adjunct professors",
    description: "Formal escalation received from Faculty Welfare Association regarding prolonged salary stagnation and non-compliance with AICTE pay scales.",
    priority: "high",
    status: "open",
    ownerName: "Priya Sundaram",
    ownerBureau: "Grievance Redressal Cell",
    createdAt: "2026-10-19",
    dueDate: "2026-11-12",
    sourceSystem: "CPGRAMS / National Grievance Portal",
    attachmentsCount: 5,
    hasOverlapAlert: false,
  },
  {
    id: "c-006",
    caseNumber: "CASE-2026-006",
    institutionId: "44444444-4444-4444-4444-444444444444",
    institutionName: "Maharashtra Apex College of Pharmacy & Biotech",
    bureau: "Approval Bureau",
    category: "New Course Sanction",
    subject: "Sanction request for M.Pharm in Clinical Research & Drug Regulatory Affairs",
    description: "Inspection squad report reviewed. Pre-requisite lab equipments verified; pending final State Pharmacy Council concordance NOC.",
    priority: "medium",
    status: "pending",
    ownerName: "Dr. K. Ramanathan",
    ownerBureau: "Approval Bureau",
    createdAt: "2026-10-15",
    dueDate: "2026-11-20",
    sourceSystem: "AICTE Web Portal 3.0",
    attachmentsCount: 6,
    hasOverlapAlert: false,
  },
  {
    id: "c-007",
    caseNumber: "CASE-2026-007",
    institutionId: "33333333-3333-3333-3333-333333333333",
    institutionName: "Delhi Technological & Research Academy",
    bureau: "Research & Grants",
    category: "RPS Scheme",
    subject: "Research Promotion Scheme (RPS) milestone 2 utilization audit",
    description: "Submission of UC (Utilization Certificate) for INR 24.5 Lakhs quantum computing testbed setup. Verification completed satisfactorily.",
    priority: "low",
    status: "resolved",
    ownerName: "Dr. Ananya Mukherjee",
    ownerBureau: "Research & Grants Bureau",
    createdAt: "2026-10-10",
    dueDate: "2026-10-25",
    sourceSystem: "AICTE R&D Portal",
    attachmentsCount: 8,
    hasOverlapAlert: false,
  },
];

export const INITIAL_OVERLAPS: OverlapItem[] = [
  {
    id: "ov-001",
    caseAId: "c-001",
    caseBId: "c-002",
    caseANumber: "CASE-2026-001",
    caseBNumber: "CASE-2026-002",
    institutionName: "Synthetic Institute of Technology",
    bureauA: "Admissions Bureau",
    bureauB: "Examinations Bureau",
    subjectA: "Eligibility criteria ambiguity for lateral entry seats",
    subjectB: "Candidate enrollment blocking pending eligibility vetting",
    institutionScore: 98,
    complaintScore: 84,
    actionConflictScore: 92,
    overallScore: 91,
    conflictType: "Contradictory Directives",
    evidence: [
      "Deterministic AISHE identifier match (C-49210)",
      "Semantic similarity 84% on keywords: 'lateral entry', 'eligibility', 'prerequisite'",
      "Action collision: Admissions issued provisional clearance while Examinations issued hall ticket withhold",
      "Affects identical student cohort of 38 candidates",
    ],
    detectionTimestamp: "2026-10-24 14:32:00",
    reviewStatus: "pending",
  },
  {
    id: "ov-002",
    caseAId: "c-003",
    caseBId: "c-004",
    caseANumber: "CASE-2026-003",
    caseBNumber: "CASE-2026-004",
    institutionName: "Bengaluru Institute of Aeronautical Sciences",
    bureauA: "Approval Bureau",
    bureauB: "Vigilance Bureau",
    subjectA: "Application for 2026-27 EoA processing under self-declaration",
    subjectB: "Surprise scrutiny recommendation for hangar & lab facilities",
    institutionScore: 100,
    complaintScore: 76,
    actionConflictScore: 96,
    overallScore: 93,
    conflictType: "Simultaneous Enforcement",
    evidence: [
      "Exact institution ID & alias match ('BIAS')",
      "Severe regulatory clash: Approval bureau standard renewal queued while Vigilance ordered facility embargo",
      "Risk of granting EoA to institution under active fraud investigation",
      "Temporal proximity: Case filed within 5 days of vigilance flag",
    ],
    detectionTimestamp: "2026-10-23 16:15:00",
    reviewStatus: "pending",
  },
  {
    id: "ov-003",
    caseAId: "c-004",
    caseBId: "c-005",
    caseANumber: "CASE-2026-004",
    caseBNumber: "CASE-2026-005",
    institutionName: "Bengaluru Institute of Aeronautical Sciences",
    bureauA: "Vigilance Bureau",
    bureauB: "Grievance Cell",
    subjectA: "Surprise scrutiny recommendation for hangar & lab facilities",
    subjectB: "Non-disbursement of 7th CPC arrears to 14 adjunct professors",
    institutionScore: 100,
    complaintScore: 61,
    actionConflictScore: 45,
    overallScore: 72,
    conflictType: "Duplicate Grievance",
    evidence: [
      "Shared institutional nexus pointing to acute management financial distress",
      "Vigilance investigation can subpoena payroll records cited in Grievance Cell docket",
      "Joint witness and faculty testimony consolidation recommended",
    ],
    detectionTimestamp: "2026-10-24 09:12:00",
    reviewStatus: "more_info",
    reviewerName: "Coordinator Manoj Bajpai",
    reviewNotes: "Requested finance audit annexures from Grievance desk before confirming joint hearing.",
  },
];

export const INITIAL_COORDINATIONS: CoordinationItem[] = [
  {
    id: "coord-001",
    coordNumber: "COORD-2026-101",
    caseIds: ["CASE-2026-001", "CASE-2026-002"],
    requestingBureau: "Admissions Bureau",
    receivingBureau: "Examinations Bureau",
    purpose: "Harmonize lateral entry admission cutoff vs exam hall ticket clearance for 38 affected students",
    evidence: [
      "Overlap Engine Alert #ov-001 (91% confidence score)",
      "Joint student list cross-verified against State Higher Education Council register",
    ],
    coordinatorName: "Chief Coordinator Alok Verma",
    deadline: "2026-10-30",
    status: "awaiting_response",
    createdAt: "2026-10-25",
    urgency: "Emergency",
  },
  {
    id: "coord-002",
    coordNumber: "COORD-2026-102",
    caseIds: ["CASE-2026-003", "CASE-2026-004"],
    requestingBureau: "Approval Bureau",
    receivingBureau: "Vigilance Bureau",
    purpose: "Formulate unified joint inspection committee before deciding on 2026-27 EoA grant",
    evidence: [
      "High Conflict Flag in Overlap Engine #ov-002 (93% score)",
      "Confidential vigilance affidavit concerning decommissioned wind tunnel facility",
    ],
    coordinatorName: "Dr. K. Ramanathan & Director S. Roy",
    deadline: "2026-11-04",
    status: "submitted",
    createdAt: "2026-10-24",
    urgency: "Urgent",
  },
  {
    id: "coord-003",
    coordNumber: "COORD-2026-098",
    caseIds: ["CASE-2026-007"],
    requestingBureau: "Research & Grants Bureau",
    receivingBureau: "Approval Bureau",
    purpose: "Cross-validate state technical university lab accreditation for central high-performance cluster funding",
    evidence: ["Audited Utilization Certificate signed by State Comptroller"],
    coordinatorName: "Dr. Ananya Mukherjee",
    deadline: "2026-10-22",
    status: "completed",
    createdAt: "2026-10-12",
    decision: "Joint NOC Approved",
    decisionNotes: "Grant milestone sanctioned. EoA record updated to reflect advanced quantum lab setup.",
    urgency: "Normal",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-1",
    timestamp: "2026-10-26 17:15:22",
    actor: "AI Engine (Neural-Graph)",
    role: "System Worker",
    action: "Detected Regulatory Action Conflict (91% score)",
    target: "CASE-2026-001 ↔ CASE-2026-002",
    bureau: "Cross-Bureau Overlap Engine",
    hash: "0x8f2a...c391",
  },
  {
    id: "log-2",
    timestamp: "2026-10-26 16:40:10",
    actor: "Admin User",
    role: "System Administrator",
    action: "Dispatched Inter-Bureau Coordination Request",
    target: "COORD-2026-101 (Admissions ↔ Examinations)",
    bureau: "AICTE Central Registry",
    hash: "0x4b71...e89d",
  },
  {
    id: "log-3",
    timestamp: "2026-10-26 14:18:45",
    actor: "Director S. Roy",
    role: "Bureau Officer",
    action: "Logged Case with High-Priority Inspection Alert",
    target: "CASE-2026-004 (BIAS Wind Tunnel Audit)",
    bureau: "Vigilance Bureau",
    hash: "0x911c...7f20",
  },
  {
    id: "log-4",
    timestamp: "2026-10-25 11:05:30",
    actor: "Reviewer Manoj Bajpai",
    role: "Reviewing Officer",
    action: "Requested Supporting Annexures for Overlap Candidate",
    target: "ov-003 (BIAS Faculty Grievance)",
    bureau: "Grievance Redressal Cell",
    hash: "0x33e5...1a4b",
  },
  {
    id: "log-5",
    timestamp: "2026-10-24 09:20:11",
    actor: "AICTE Alias Resolver",
    role: "System Worker",
    action: "Normalized Institutional Alias 'SIT' to AISHE C-49210",
    target: "Synthetic Institute of Technology",
    bureau: "Data Normalization Bureau",
    hash: "0xee21...d044",
  },
];

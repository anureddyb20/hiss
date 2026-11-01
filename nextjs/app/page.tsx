"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import StatsBar from "../components/StatsBar";
import Institution360 from "../components/Institution360";
import CaseRegistry from "../components/CaseRegistry";
import OverlapEngine from "../components/OverlapEngine";
import CoordinationHub from "../components/CoordinationHub";
import AuditAnalytics from "../components/AuditAnalytics";
import SettingsView from "../components/SettingsView";
import HelpView from "../components/HelpView";
import {
  INITIAL_INSTITUTIONS,
  INITIAL_CASES,
  INITIAL_OVERLAPS,
  INITIAL_COORDINATIONS,
  INITIAL_AUDIT_LOGS,
  Institution,
  CaseItem,
  OverlapItem,
  CoordinationItem,
  AuditLogItem,
} from "../lib/data";
import {
  Building2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Users,
  Sparkles,
  Shield,
  FileCheck,
  TrendingUp,
  Cpu,
  Lock,
  ExternalLink,
  ChevronRight,
  Sliders,
  Calendar,
  Activity,
  Award,
  UploadCloud,
  FileText,
} from "lucide-react";

export default function Home() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [currentRole, setCurrentRole] = useState<string>("central_admin");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data Stores
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [overlaps, setOverlaps] = useState<OverlapItem[]>(INITIAL_OVERLAPS);
  const [coordinations, setCoordinations] = useState<CoordinationItem[]>(INITIAL_COORDINATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Super Admin Model Threshold
  const [modelThreshold, setModelThreshold] = useState<number>(70);
  const [symbolicRulesEnabled, setSymbolicRulesEnabled] = useState(true);

  // Modals state
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isNewCoordOpen, setIsNewCoordOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  // New Case Form State
  const [newCaseData, setNewCaseData] = useState({
    institutionId: INITIAL_INSTITUTIONS[0]?.id || "",
    bureau: "Admissions" as CaseItem["bureau"],
    category: "Intake & Approval",
    subject: "",
    description: "",
    priority: "medium" as CaseItem["priority"],
  });

  // New Coordination Form State
  const [newCoordData, setNewCoordData] = useState({
    caseIds: "CASE-2026-001, CASE-2026-002",
    requestingBureau: "Admissions Bureau",
    receivingBureau: "Examinations Bureau",
    purpose: "",
    urgency: "Urgent" as CoordinationItem["urgency"],
    deadline: "2026-11-10",
  });

  // Overlap review handlers
  const handleConfirmOverlap = (overlap: OverlapItem) => {
    setOverlaps((prev) =>
      prev.map((o) =>
        o.id === overlap.id
          ? {
              ...o,
              reviewStatus: "confirmed",
              reviewerName: "Administrator (Central Review)",
              reviewNotes: "Confirmed regulatory overlap. Inter-Bureau consultation dispatched.",
            }
          : o
      )
    );

    const newCoord: CoordinationItem = {
      id: `coord-${Date.now().toString().slice(-4)}`,
      coordNumber: `COORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      caseIds: [overlap.caseANumber, overlap.caseBNumber],
      requestingBureau: overlap.bureauA,
      receivingBureau: overlap.bureauB,
      purpose: `Harmonize contradictory directives flagged in Overlap ${overlap.caseANumber} ↔ ${overlap.caseBNumber}`,
      evidence: overlap.evidence,
      coordinatorName: "Central Review Desk",
      deadline: "2026-11-08",
      status: "submitted",
      createdAt: new Date().toISOString().slice(0, 10),
      urgency: "Urgent",
    };

    setCoordinations((prev) => [newCoord, ...prev]);

    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      actor: "Central Review Desk",
      role: currentRole,
      action: `Confirmed Overlap & Launched Coordination ${newCoord.coordNumber}`,
      target: `${overlap.caseANumber} ↔ ${overlap.caseBNumber}`,
      bureau: overlap.bureauA,
      hash: `0x${Math.random().toString(16).slice(2, 10)}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleRejectOverlap = (overlapId: string) => {
    setOverlaps((prev) =>
      prev.map((o) => (o.id === overlapId ? { ...o, reviewStatus: "rejected" } : o))
    );
  };

  const handleRequestMoreInfo = (overlapId: string) => {
    setOverlaps((prev) =>
      prev.map((o) =>
        o.id === overlapId
          ? {
              ...o,
              reviewStatus: "more_info",
              reviewerName: "Regulatory Desk",
              reviewNotes: "Clarification requested from nodal officer.",
            }
          : o
      )
    );
  };

  // Coordination resolution handler
  const handleUpdateCoordination = (
    coordId: string,
    status: CoordinationItem["status"],
    decisionNotes?: string
  ) => {
    setCoordinations((prev) =>
      prev.map((c) =>
        c.id === coordId
          ? {
              ...c,
              status,
              decision: "Harmonized Joint Order Issued",
              decisionNotes: decisionNotes || c.decisionNotes,
            }
          : c
      )
    );

    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      actor: "Coordination Officer",
      role: currentRole,
      action: "Formalized Joint Bureau Decision",
      target: coordId,
      bureau: "Inter-Bureau Secretariat",
      hash: `0x${Math.random().toString(16).slice(2, 10)}`,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Register New Case
  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseData.subject.trim()) return;

    const inst =
      institutions.find((i) => i.id === newCaseData.institutionId) ||
      institutions[0];

    const newCase: CaseItem = {
      id: `c-${Date.now().toString().slice(-4)}`,
      caseNumber: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
      institutionId: inst.id,
      institutionName: inst.name,
      bureau: newCaseData.bureau,
      category: newCaseData.category,
      subject: newCaseData.subject,
      description: newCaseData.description,
      priority: newCaseData.priority,
      status: "new",
      ownerName: "Duty Officer (Live)",
      ownerBureau: `${newCaseData.bureau} Desk`,
      createdAt: new Date().toISOString().slice(0, 10),
      dueDate: "2026-11-15",
      sourceSystem: "AICTE Central Single Window",
      attachmentsCount: 1,
      hasOverlapAlert: false,
    };

    setCases((prev) => [newCase, ...prev]);
    setIsNewCaseOpen(false);
    setNewCaseData({
      institutionId: institutions[0]?.id || "",
      bureau: "Admissions",
      category: "Intake & Approval",
      subject: "",
      description: "",
      priority: "medium",
    });
    setActiveTab("cases");
  };

  // Launch New Coordination
  const handleCreateCoordination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoordData.purpose.trim()) return;

    const newCoord: CoordinationItem = {
      id: `coord-${Date.now().toString().slice(-4)}`,
      coordNumber: `COORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      caseIds: newCoordData.caseIds.split(",").map((s) => s.trim()),
      requestingBureau: newCoordData.requestingBureau,
      receivingBureau: newCoordData.receivingBureau,
      purpose: newCoordData.purpose,
      evidence: ["Cross-Bureau Registry Dossier Reference"],
      coordinatorName: "Officer (Live Session)",
      deadline: newCoordData.deadline,
      status: "submitted",
      createdAt: new Date().toISOString().slice(0, 10),
      urgency: newCoordData.urgency,
    };

    setCoordinations((prev) => [newCoord, ...prev]);
    setIsNewCoordOpen(false);
    setActiveTab("coordination");
  };

  const pendingOverlapsCount = overlaps.filter(
    (o) => o.reviewStatus === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#171923] flex">
      {/* 1. Collapsible Left Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingOverlapsCount={pendingOverlapsCount}
          onSearchClick={() => setSearchModalOpen(true)}
          onSettingsClick={() => setActiveTab("settings")}
          onHelpClick={() => setActiveTab("help")}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              pendingOverlapsCount={pendingOverlapsCount}
              onSearchClick={() => {
                setSearchModalOpen(true);
                setMobileSidebarOpen(false);
              }}
              onSettingsClick={() => {
                setActiveTab("settings");
                setMobileSidebarOpen(false);
              }}
              onHelpClick={() => {
                setActiveTab("help");
                setMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Top Navigation (56px) */}
        <TopNav
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onSearchClick={() => setSearchModalOpen(true)}
          pendingOverlapsCount={pendingOverlapsCount}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Scrollable Work Area (1440px controlled max-width) */}
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto space-y-6">
          {/* TAB: OVERVIEW DASHBOARD */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in">
              {/* ========================================================== */}
              {/* PORTAL VIEW 1: CENTRAL ADMINISTRATOR (DEFAULT)             */}
              {/* ========================================================== */}
              {currentRole === "central_admin" && (
                <>
                  {/* SECTION 06: COMPACT EDITORIAL PAGE INTRO */}
                  <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#6246EA] bg-[#F3F0FF] px-2 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                          CENTRAL ADMINISTRATOR
                        </span>
                        <span className="text-[11px] text-[#98A2B3] font-mono">
                          Synchronized: Today, 14:32:00 IST • Reporting Period: Q3 AY 2026-27
                        </span>
                      </div>

                      <h1 className="text-xl font-bold text-[#171923] tracking-tight">
                        Cross-Bureau Regulatory Conflict Surveillance & Inter-Bureau Conciliation
                      </h1>

                      <p className="text-xs text-[#667085] leading-relaxed">
                        Single-window institutional oversight detecting contradictory orders across AICTE bureaus
                        and dispatching binding harmonized directives before enforcement.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActiveTab("overlaps")}
                        className="px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#6246EA] hover:bg-[#5338D6] text-white transition-colors flex items-center gap-1.5"
                      >
                        <span>Review {pendingOverlapsCount} Overlap Alerts</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsNewCaseOpen(true)}
                        className="px-3.5 py-2 rounded-[6px] text-xs font-medium bg-[#F7F8FA] hover:bg-[#F0F1F4] text-[#171923] border border-[#E8EAF0] transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#078B68]" />
                        <span>Log New Case</span>
                      </button>
                    </div>
                  </div>

                  {/* METRICS: UNIFIED ANALYTICAL STRIP */}
                  <StatsBar
                    totalInstitutions={institutions.length}
                    totalCases={cases.length}
                    totalOverlaps={overlaps.length}
                    totalCoordinations={coordinations.length}
                    onCardClick={(tab) => setActiveTab(tab)}
                  />

                  {/* MAIN CONTENT: TWO-COLUMN OPERATIONAL INTELLIGENCE WORKSPACE */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* LEFT: High-Priority Conflict Intelligence */}
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] overflow-hidden">
                      <div className="p-4 border-b border-[#E8EAF0] flex items-center justify-between">
                        <div>
                          <h2 className="text-xs font-semibold text-[#171923] flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D93649]" />
                            High-Priority Conflict Intelligence
                          </h2>
                          <p className="text-[11px] text-[#98A2B3] mt-0.5">
                            Cross-bureau actions requiring mandatory review prior to enforcement.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab("overlaps")}
                          className="text-xs font-semibold text-[#6246EA] hover:underline flex items-center gap-1"
                        >
                          <span>View All ({overlaps.length})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="divide-y divide-[#E8EAF0]">
                        {overlaps.map((ov) => (
                          <div
                            key={ov.id}
                            onClick={() => setActiveTab("overlaps")}
                            className="p-4 hover:bg-[#F7F8FA] cursor-pointer transition-colors space-y-2 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-[#D93649] bg-[#FDF2F4] px-1.5 py-0.2 rounded border border-[#FAD2D8]">
                                {ov.conflictType}
                              </span>
                              <span className="font-mono text-xs font-bold text-[#D93649] tabular-nums">
                                {ov.overallScore}% Confidence
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-[#171923] group-hover:text-[#6246EA] transition-colors">
                              {ov.institutionName}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-[#667085]">
                              <span>{ov.bureauA} ↔ {ov.bureauB}</span>
                              <span className="font-mono text-[#6246EA] font-medium">
                                {ov.caseANumber} & {ov.caseBNumber}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-[#98A2B3] pt-1 border-t border-[#F7F8FA]">
                              <span>Detected: {ov.detectionTimestamp}</span>
                              <span className="text-[#078B68] font-semibold">
                                {ov.reviewStatus.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* RIGHT: Inter-Bureau Consultation Docket */}
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] overflow-hidden">
                      <div className="p-4 border-b border-[#E8EAF0] flex items-center justify-between">
                        <div>
                          <h2 className="text-xs font-semibold text-[#171923] flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6246EA]" />
                            Inter-Bureau Consultation Docket
                          </h2>
                          <p className="text-[11px] text-[#98A2B3] mt-0.5">
                            Formal conciliation proceedings between participating regulatory desks.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab("coordination")}
                          className="text-xs font-semibold text-[#6246EA] hover:underline flex items-center gap-1"
                        >
                          <span>Open Hub ({coordinations.length})</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="divide-y divide-[#E8EAF0]">
                        {coordinations.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => setActiveTab("coordination")}
                            className="p-4 hover:bg-[#F7F8FA] cursor-pointer transition-colors space-y-2 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-[#6246EA]">
                                {c.coordNumber}
                              </span>
                              <span className="text-[10px] font-semibold text-[#C88918] bg-[#FCF8E8] px-1.5 py-0.2 rounded border border-[#E8EAF0]">
                                {c.status.replace("_", " ").toUpperCase()}
                              </span>
                            </div>

                            <p className="text-xs font-medium text-[#171923] group-hover:text-[#6246EA] transition-colors line-clamp-1">
                              {c.purpose}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-[#667085]">
                              <span>{c.requestingBureau} → {c.receivingBureau}</span>
                              <span className="text-[#C88918] font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#98A2B3]" />
                                Due {c.deadline}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-[#98A2B3] pt-1 border-t border-[#F7F8FA]">
                              <span>Urgency: <strong className="text-[#171923]">{c.urgency}</strong></span>
                              <span>Coordinator: {c.coordinatorName}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LOWER SECTION: ANALYTICAL VISUALIZATIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Visual 1: Bureau Activity Distribution */}
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8EAF0]">
                        <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide">
                          Bureau Activity Distribution
                        </h3>
                        <span className="text-[10px] font-mono text-[#98A2B3]">7 Regulators</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {[
                          { name: "Approval Bureau", count: 18, pct: 36, color: "bg-[#6246EA]" },
                          { name: "Admissions Bureau", count: 14, pct: 28, color: "bg-[#3478C9]" },
                          { name: "Examinations Bureau", count: 8, pct: 16, color: "bg-[#078B68]" },
                          { name: "Vigilance Bureau", count: 6, pct: 12, color: "bg-[#C88918]" },
                          { name: "Grievance Cell", count: 3, pct: 6, color: "bg-[#D93649]" },
                          { name: "Research & Grants", count: 1, pct: 2, color: "bg-[#98A2B3]" },
                        ].map((b) => (
                          <div key={b.name} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#171923] font-medium">{b.name}</span>
                              <span className="font-mono text-[#667085] tabular-nums">{b.count} cases ({b.pct}%)</span>
                            </div>
                            <div className="w-full bg-[#F7F8FA] h-1.5 rounded-full overflow-hidden border border-[#E8EAF0]">
                              <div className={`${b.color} h-full`} style={{ width: `${b.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual 2: Case Resolution & Overlap Prevention Trends */}
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8EAF0]">
                        <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide">
                          Conflict Prevention Trend
                        </h3>
                        <span className="text-[10px] font-mono text-[#078B68] font-bold">96.4% Averted</span>
                      </div>

                      <div className="pt-2">
                        {/* Clean SVG Trend Chart */}
                        <svg viewBox="0 0 300 120" className="w-full h-28 overflow-visible">
                          {/* Grid Lines */}
                          <line x1="0" y1="20" x2="300" y2="20" stroke="#E8EAF0" strokeDasharray="2 2" />
                          <line x1="0" y1="60" x2="300" y2="60" stroke="#E8EAF0" strokeDasharray="2 2" />
                          <line x1="0" y1="100" x2="300" y2="100" stroke="#E8EAF0" />

                          {/* Line: Overlaps Flagged (Red dashed) */}
                          <polyline
                            fill="none"
                            stroke="#D93649"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                            points="0,95 60,80 120,65 180,50 240,40 300,25"
                          />
                          {/* Line: Harmonized Orders (Purple solid) */}
                          <polyline
                            fill="none"
                            stroke="#6246EA"
                            strokeWidth="2.5"
                            points="0,105 60,90 120,70 180,55 240,42 300,28"
                          />
                          {/* Data points */}
                          <circle cx="300" cy="28" r="3.5" fill="#6246EA" />
                          <circle cx="300" cy="25" r="3.5" fill="#D93649" />
                        </svg>

                        <div className="flex justify-between text-[10px] font-mono text-[#98A2B3] mt-2">
                          <span>May 2026</span>
                          <span>Jul 2026</span>
                          <span>Sep 2026</span>
                          <span>Oct 2026</span>
                        </div>

                        <div className="flex items-center justify-center gap-4 text-[10px] font-mono mt-3 pt-2 border-t border-[#E8EAF0]">
                          <span className="flex items-center gap-1.5 text-[#D93649]">
                            <span className="w-2 h-0.5 bg-[#D93649]" /> Flagged Conflicts
                          </span>
                          <span className="flex items-center gap-1.5 text-[#6246EA]">
                            <span className="w-2 h-0.5 bg-[#6246EA]" /> Harmonized Orders
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Visual 3: Statutory SLA Performance */}
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E8EAF0]">
                        <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide">
                          SLA Performance & Turnaround
                        </h3>
                        <span className="text-[10px] font-mono text-[#667085]">Statutory 7 Days</span>
                      </div>

                      <div className="space-y-3 text-xs pt-1">
                        <div className="flex items-center justify-between p-2 rounded bg-[#F7F8FA] border border-[#E8EAF0]">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-[#98A2B3] block">
                              Mean Turnaround
                            </span>
                            <span className="text-lg font-bold text-[#171923] font-mono tabular-nums">
                              1.8 Days
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-[#078B68] bg-[#E8F8F2] px-2 py-0.5 rounded border border-[#E8EAF0]">
                            Target Met
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#667085]">Overall SLA Compliance Rate</span>
                            <span className="font-mono font-bold text-[#078B68] tabular-nums">94.2%</span>
                          </div>
                          <div className="w-full bg-[#F7F8FA] h-2 rounded-full overflow-hidden border border-[#E8EAF0]">
                            <div className="bg-[#078B68] h-full" style={{ width: "94.2%" }} />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#E8EAF0] flex items-center justify-between text-[11px] text-[#667085]">
                          <span>Active Cases At SLA Risk:</span>
                          <span className="font-mono font-bold text-[#C88918] tabular-nums">2 Cases</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ========================================================== */}
              {/* PORTAL VIEW 2: BUREAU OFFICER (ADMISSIONS BUREAU)          */}
              {/* ========================================================== */}
              {currentRole === "bureau_officer" && (
                <div className="space-y-6">
                  {/* Top Intro */}
                  <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#3478C9] bg-[#EBF3FC] px-2 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                          BUREAU OFFICER PORTAL
                        </span>
                        <span className="text-[11px] text-[#98A2B3] font-mono">
                          Assigned: Admissions Bureau Desk 04 • Officer ID: BO-4921
                        </span>
                      </div>
                      <h1 className="text-xl font-bold text-[#171923] tracking-tight">
                        Admissions Intake & Inter-Bureau Clearance Docket
                      </h1>
                      <p className="text-xs text-[#667085]">
                        Managing candidate intake approvals, lateral entry eligibility concordance, and joint consultations.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsNewCaseOpen(true)}
                        className="px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#6246EA] hover:bg-[#5338D6] text-white flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Admissions Case</span>
                      </button>
                    </div>
                  </div>

                  {/* Bureau Specific KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Assigned Bureau Cases</span>
                      <div className="text-2xl font-bold text-[#171923] font-mono tabular-nums">3</div>
                      <span className="text-[10px] text-[#078B68] font-mono">All active</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Pending Consultations</span>
                      <div className="text-2xl font-bold text-[#C88918] font-mono tabular-nums">1</div>
                      <span className="text-[10px] text-[#C88918] font-mono">From Examinations Bureau</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Directives Collision Alert</span>
                      <div className="text-2xl font-bold text-[#D93649] font-mono tabular-nums">1</div>
                      <span className="text-[10px] text-[#D93649] font-mono">SIT Lateral Entry Cohort</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">SLA Response Compliance</span>
                      <div className="text-2xl font-bold text-[#078B68] font-mono tabular-nums">98.4%</div>
                      <span className="text-[10px] text-[#078B68] font-mono">1.4 days mean time</span>
                    </div>
                  </div>

                  {/* Two column Bureau Operational Workspace */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] overflow-hidden">
                      <div className="p-4 border-b border-[#E8EAF0] flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-[#171923] uppercase tracking-wide">
                          Action Required: Inter-Bureau Consultation Notices
                        </h2>
                        <span className="text-[10px] font-mono text-[#C88918]">1 Pending Response</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="p-3 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#6246EA]">COORD-2026-101</span>
                            <span className="text-[10px] font-semibold text-[#D93649] bg-[#FDF2F4] px-1.5 py-0.2 rounded border border-[#FAD2D8]">
                              Urgent Action
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#171923]">
                            Examinations Bureau Notice on Lateral Entry Eligibility
                          </p>
                          <p className="text-[11px] text-[#667085]">
                            Examinations Bureau withheld hall tickets citing missing prerequisite course equivalence certification. Admissions Bureau issued provisional approval. Concordance meeting requested.
                          </p>
                          <div className="pt-2 flex items-center justify-between text-xs">
                            <span className="text-[#98A2B3] text-[10px]">Due in 4 days</span>
                            <button
                              onClick={() => setActiveTab("coordination")}
                              className="px-3 py-1 rounded-[4px] bg-[#6246EA] text-white text-xs font-semibold"
                            >
                              Submit Bureau Response
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] overflow-hidden">
                      <div className="p-4 border-b border-[#E8EAF0] flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-[#171923] uppercase tracking-wide">
                          Active Admissions Docket
                        </h2>
                        <button
                          onClick={() => setActiveTab("cases")}
                          className="text-xs font-semibold text-[#6246EA] hover:underline"
                        >
                          View Registry
                        </button>
                      </div>
                      <div className="divide-y divide-[#E8EAF0]">
                        {cases
                          .filter((c) => c.bureau === "Admissions")
                          .map((c) => (
                            <div key={c.id} className="p-3 hover:bg-[#F7F8FA] space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="font-mono font-bold text-[#171923]">{c.caseNumber}</span>
                                <span className="text-[10px] font-semibold text-[#078B68] bg-[#E8F8F2] px-1.5 py-0.2 rounded border border-[#E8EAF0]">
                                  {c.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-[#171923] font-medium">{c.subject}</p>
                              <span className="text-[10px] text-[#98A2B3]">{c.institutionName}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* PORTAL VIEW 3: HEI ADMINISTRATOR (SYNTHETIC INST. OF TECH) */}
              {/* ========================================================== */}
              {currentRole === "hei_admin" && (
                <div className="space-y-6">
                  {/* Top Intro */}
                  <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#078B68] bg-[#E8F8F2] px-2 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                          HEI INSTITUTIONAL PORTAL
                        </span>
                        <span className="text-[11px] text-[#98A2B3] font-mono">
                          AISHE: C-49210 • Official ID: AICTE-SIT-4921
                        </span>
                      </div>
                      <h1 className="text-xl font-bold text-[#171923] tracking-tight">
                        Synthetic Institute of Technology — Single Window Compliance Console
                      </h1>
                      <p className="text-xs text-[#667085]">
                        Autonomous Technical University • Sector 4, Bengaluru Urban, Karnataka • Tier-1 NBA Accredited
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab("institutions")}
                        className="px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#6246EA] text-white hover:bg-[#5338D6]"
                      >
                        View Full 360° Profile
                      </button>
                    </div>
                  </div>

                  {/* HEI KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Active Regulatory Inquiries</span>
                      <div className="text-2xl font-bold text-[#171923] font-mono tabular-nums">3</div>
                      <span className="text-[10px] text-[#C88918] font-mono">Across 2 Bureaus</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Compliance Health Index</span>
                      <div className="text-2xl font-bold text-[#C88918] font-mono tabular-nums">78 / 100</div>
                      <span className="text-[10px] text-[#C88918] font-mono">Action Required</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Pending Representation</span>
                      <div className="text-2xl font-bold text-[#D93649] font-mono tabular-nums">1</div>
                      <span className="text-[10px] text-[#D93649] font-mono">Lateral Entry Equivalence</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Next Statutory Deadline</span>
                      <div className="text-2xl font-bold text-[#171923] font-mono tabular-nums">Nov 08</div>
                      <span className="text-[10px] text-[#98A2B3] font-mono">Joint Review Hearing</span>
                    </div>
                  </div>

                  {/* HEI Action Center */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide pb-2 border-b border-[#E8EAF0]">
                        Regulatory Action Advisory
                      </h3>
                      <div className="p-3 bg-[#FDF2F4] border border-[#FAD2D8] rounded-[6px] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#D93649]">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Conflicting Directives Notice Issued</span>
                        </div>
                        <p className="text-xs text-[#667085]">
                          AICTE Admissions Bureau granted provisional clearance for 38 lateral entry students, but Examinations Bureau placed a hold on hall tickets. AICTE has placed this matter under Inter-Bureau Conciliation.
                        </p>
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#667085]">Advisory Ref: COORD-2026-101</span>
                          <button
                            onClick={() => {
                              alert("Affidavit upload portal simulated. Institutional document submitted to Central Review.");
                            }}
                            className="px-3 py-1.5 rounded-[4px] bg-[#6246EA] text-white text-xs font-semibold"
                          >
                            Upload Compliance Affidavit
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide pb-2 border-b border-[#E8EAF0]">
                        Direct Filings Timeline
                      </h3>
                      <div className="space-y-2 text-xs text-[#667085]">
                        <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#E8EAF0] flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-[#171923]">Form-A: Annual Extension of Approval (EoA)</p>
                            <span className="text-[10px] text-[#98A2B3]">Submitted Oct 12, 2026</span>
                          </div>
                          <span className="text-[10px] font-semibold text-[#078B68] bg-[#E8F8F2] px-2 py-0.5 rounded border border-[#E8EAF0]">
                            Verified
                          </span>
                        </div>
                        <div className="p-2.5 rounded bg-[#F7F8FA] border border-[#E8EAF0] flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-[#171923]">Lateral Entry Enrollment Dossier</p>
                            <span className="text-[10px] text-[#98A2B3]">Submitted Oct 22, 2026</span>
                          </div>
                          <span className="text-[10px] font-semibold text-[#C88918] bg-[#FCF8E8] px-2 py-0.5 rounded border border-[#E8EAF0]">
                            Under Review
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* PORTAL VIEW 4: AUDITOR (STATUTORY & SLA VIGILANCE)        */}
              {/* ========================================================== */}
              {currentRole === "auditor" && (
                <div className="space-y-6">
                  {/* Top Intro */}
                  <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#C88918] bg-[#FCF8E8] px-2 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                          STATUTORY AUDITOR & VIGILANCE
                        </span>
                        <span className="text-[11px] text-[#98A2B3] font-mono">
                          Cryptographic Ledger Node #01 • SHA-256 Merkle Chain
                        </span>
                      </div>
                      <h1 className="text-xl font-bold text-[#171923] tracking-tight">
                        Regulatory Compliance, Turnaround Benchmarks & Ledger Integrity
                      </h1>
                      <p className="text-xs text-[#667085]">
                        Independent oversight ensuring adherence to statutory resolution windows and tamper-evident provenance.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab("audit")}
                        className="px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#6246EA] text-white hover:bg-[#5338D6]"
                      >
                        Inspect Cryptographic Ledger
                      </button>
                    </div>
                  </div>

                  {/* Auditor KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Statutory Directives Audited</span>
                      <div className="text-2xl font-bold text-[#171923] font-mono tabular-nums">42</div>
                      <span className="text-[10px] text-[#078B68] font-mono">100% Verified</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">SLA Adherence Rate</span>
                      <div className="text-2xl font-bold text-[#078B68] font-mono tabular-nums">94.2%</div>
                      <span className="text-[10px] text-[#078B68] font-mono">Benchmark: 90%</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Cases At Risk Of SLA Breach</span>
                      <div className="text-2xl font-bold text-[#C88918] font-mono tabular-nums">2</div>
                      <span className="text-[10px] text-[#C88918] font-mono">Approaching 7-day limit</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Ledger Chain Validation</span>
                      <div className="text-2xl font-bold text-[#078B68] font-mono tabular-nums">Valid</div>
                      <span className="text-[10px] text-[#078B68] font-mono">Zero hash collisions</span>
                    </div>
                  </div>

                  {/* Auditor Two Column Workspace */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide pb-2 border-b border-[#E8EAF0]">
                        SLA Escalation Surveillance
                      </h3>
                      <div className="divide-y divide-[#E8EAF0] text-xs">
                        <div className="py-2.5 flex justify-between items-center">
                          <div>
                            <span className="font-mono text-[#6246EA] font-bold">CASE-2026-002</span>
                            <p className="text-[#171923] font-medium">Candidate enrollment blocking</p>
                            <span className="text-[10px] text-[#98A2B3]">Examinations Bureau • Due in 2 days</span>
                          </div>
                          <span className="text-[10px] font-semibold text-[#D93649] bg-[#FDF2F4] px-2 py-0.5 rounded border border-[#FAD2D8]">
                            Critical SLA
                          </span>
                        </div>
                        <div className="py-2.5 flex justify-between items-center">
                          <div>
                            <span className="font-mono text-[#6246EA] font-bold">CASE-2026-004</span>
                            <p className="text-[#171923] font-medium">Surprise scrutiny recommendation</p>
                            <span className="text-[10px] text-[#98A2B3]">Vigilance Bureau • Due in 3 days</span>
                          </div>
                          <span className="text-[10px] font-semibold text-[#C88918] bg-[#FCF8E8] px-2 py-0.5 rounded border border-[#E8EAF0]">
                            High SLA
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide pb-2 border-b border-[#E8EAF0]">
                        Cryptographic Merkle Stream
                      </h3>
                      <div className="space-y-2 text-xs font-mono">
                        {auditLogs.slice(0, 3).map((log) => (
                          <div key={log.id} className="p-2.5 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px]">
                            <div className="flex justify-between text-[10px] text-[#98A2B3]">
                              <span>{log.timestamp}</span>
                              <span className="text-[#6246EA]">{log.hash}</span>
                            </div>
                            <p className="text-xs text-[#171923] font-medium mt-1">{log.action}</p>
                            <span className="text-[10px] text-[#667085]">Actor: {log.actor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* PORTAL VIEW 5: SUPER ADMINISTRATOR (CORE ARCHITECTURE)     */}
              {/* ========================================================== */}
              {currentRole === "super_admin" && (
                <div className="space-y-6">
                  {/* Top Intro */}
                  <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#6246EA] bg-[#F3F0FF] px-2 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                          SUPER ADMINISTRATOR PORTAL
                        </span>
                        <span className="text-[11px] text-[#98A2B3] font-mono">
                          GovTech Core Architecture • Zero-Trust Access Control
                        </span>
                      </div>
                      <h1 className="text-xl font-bold text-[#171923] tracking-tight">
                        Explainable AI Engine Parameters & Enterprise RBAC Enforcement
                      </h1>
                      <p className="text-xs text-[#667085]">
                        Global system tuning: NLP bi-encoder confidence cutoffs, symbolic collision logic, and access matrix.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          alert("Symbolic rulebase re-compiled. 128 regulatory logic patterns updated.");
                        }}
                        className="px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#6246EA] text-white hover:bg-[#5338D6]"
                      >
                        Re-compile Symbolic Rulebase
                      </button>
                    </div>
                  </div>

                  {/* Super Admin KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">NLP Bi-Encoder Latency</span>
                      <div className="text-2xl font-bold text-[#078B68] font-mono tabular-nums">42ms</div>
                      <span className="text-[10px] text-[#078B68] font-mono">sentence-transformers</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Symbolic Collision Rules</span>
                      <div className="text-2xl font-bold text-[#171923] font-mono tabular-nums">128</div>
                      <span className="text-[10px] text-[#078B68] font-mono">Active in memory</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">AISHE Disambiguation Graph</span>
                      <div className="text-2xl font-bold text-[#171923] font-mono tabular-nums">1,420</div>
                      <span className="text-[10px] text-[#078B68] font-mono">HEI Aliases Mapped</span>
                    </div>
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-1">
                      <span className="text-xs text-[#667085]">Enforced Portal Roles</span>
                      <div className="text-2xl font-bold text-[#6246EA] font-mono tabular-nums">5 Roles</div>
                      <span className="text-[10px] text-[#078B68] font-mono">RBAC Matrix Active</span>
                    </div>
                  </div>

                  {/* Engine Tuning & RBAC Matrix */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-4">
                      <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide pb-2 border-b border-[#E8EAF0]">
                        AI Collision Engine Sensitivity Tuning
                      </h3>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#667085]">Global Confidence Cutoff:</span>
                          <span className="font-mono font-bold text-[#6246EA]">{modelThreshold}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          value={modelThreshold}
                          onChange={(e) => setModelThreshold(Number(e.target.value))}
                          className="w-full accent-[#6246EA] cursor-pointer"
                        />
                        <span className="text-[10px] text-[#98A2B3]">
                          Pairs below {modelThreshold}% confidence will be suppressed from the primary operational docket.
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[#E8EAF0] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#171923] font-medium">Symbolic Logic Collision Rulebase</span>
                          <input
                            type="checkbox"
                            checked={symbolicRulesEnabled}
                            onChange={(e) => setSymbolicRulesEnabled(e.target.checked)}
                            className="accent-[#6246EA] cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-[#667085]">
                          Enforces deterministic cross-referencing between standard approvals and active vigilance freeze orders.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4 space-y-3">
                      <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide pb-2 border-b border-[#E8EAF0]">
                        Enterprise RBAC Permissions Matrix
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-[#E8EAF0] text-[10px] uppercase font-mono text-[#98A2B3]">
                              <th className="pb-2">Role</th>
                              <th className="pb-2">Surveillance</th>
                              <th className="pb-2">Conciliation</th>
                              <th className="pb-2">Ledger Audit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E8EAF0] text-[11px]">
                            <tr>
                              <td className="py-2 font-medium text-[#171923]">Central Admin</td>
                              <td className="text-[#078B68]">Full</td>
                              <td className="text-[#078B68]">Dispatch</td>
                              <td className="text-[#078B68]">Read</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-[#171923]">Bureau Officer</td>
                              <td className="text-[#667085]">Bureau Scoped</td>
                              <td className="text-[#078B68]">Respond</td>
                              <td className="text-[#98A2B3]">None</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-[#171923]">HEI Admin</td>
                              <td className="text-[#667085]">Self Only</td>
                              <td className="text-[#078B68]">Representation</td>
                              <td className="text-[#98A2B3]">None</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-[#171923]">Auditor</td>
                              <td className="text-[#078B68]">Full Audit</td>
                              <td className="text-[#98A2B3]">None</td>
                              <td className="text-[#078B68]">Full Verify</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-[#171923]">Super Admin</td>
                              <td className="text-[#078B68]">Full / Config</td>
                              <td className="text-[#078B68]">Full / Config</td>
                              <td className="text-[#078B68]">Root Access</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: INSTITUTIONS 360° */}
          {activeTab === "institutions" && (
            <div className="animate-in fade-in">
              <Institution360
                institutions={institutions}
                cases={cases}
                onSelectCase={() => setActiveTab("cases")}
                onInitiateCoordination={(inst) => {
                  setNewCoordData((prev) => ({
                    ...prev,
                    purpose: `Joint coordination regarding regulatory status for ${inst.name}`,
                  }));
                  setIsNewCoordOpen(true);
                }}
              />
            </div>
          )}

          {/* TAB: CASE REGISTRY */}
          {activeTab === "cases" && (
            <div className="animate-in fade-in">
              <CaseRegistry
                cases={cases}
                onOpenNewCaseModal={() => setIsNewCaseOpen(true)}
                onOpenOverlapForCase={() => setActiveTab("overlaps")}
              />
            </div>
          )}

          {/* TAB: AI OVERLAP ENGINE */}
          {activeTab === "overlaps" && (
            <div className="animate-in fade-in">
              <OverlapEngine
                overlaps={overlaps}
                onConfirmOverlap={handleConfirmOverlap}
                onRejectOverlap={handleRejectOverlap}
                onRequestMoreInfo={handleRequestMoreInfo}
                currentRole={currentRole}
              />
            </div>
          )}

          {/* TAB: COORDINATION HUB */}
          {activeTab === "coordination" && (
            <div className="animate-in fade-in">
              <CoordinationHub
                coordinations={coordinations}
                onOpenNewCoordModal={() => setIsNewCoordOpen(true)}
                onUpdateCoordination={handleUpdateCoordination}
                currentRole={currentRole}
              />
            </div>
          )}

          {/* TAB: AUDIT & ANALYTICS */}
          {activeTab === "audit" && (
            <div className="animate-in fade-in">
              <AuditAnalytics auditLogs={auditLogs} />
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="animate-in fade-in">
              <SettingsView />
            </div>
          )}

          {/* TAB: HELP */}
          {activeTab === "help" && (
            <div className="animate-in fade-in">
              <HelpView />
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: REGISTER NEW CASE */}
      {isNewCaseOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8EAF0] rounded-[8px] max-w-lg w-full p-5 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF0]">
              <h3 className="text-sm font-bold text-[#171923] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6246EA]" />
                Register Cross-Bureau Case
              </h3>
              <button
                onClick={() => setIsNewCaseOpen(false)}
                className="text-[#98A2B3] hover:text-[#171923]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div>
                <label className="text-[#171923] font-semibold mb-1 block">
                  Select Higher Education Institution (HEI):
                </label>
                <select
                  value={newCaseData.institutionId}
                  onChange={(e) =>
                    setNewCaseData({ ...newCaseData, institutionId: e.target.value })
                  }
                  className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923] focus:outline-none focus:border-[#6246EA] focus:bg-white"
                >
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.officialId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#171923] font-semibold mb-1 block">
                    Originating Bureau:
                  </label>
                  <select
                    value={newCaseData.bureau}
                    onChange={(e) =>
                      setNewCaseData({
                        ...newCaseData,
                        bureau: e.target.value as CaseItem["bureau"],
                      })
                    }
                    className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923] focus:outline-none focus:border-[#6246EA] focus:bg-white"
                  >
                    <option value="Admissions">Admissions Bureau</option>
                    <option value="Approval Bureau">Approval Bureau</option>
                    <option value="Examinations">Examinations Bureau</option>
                    <option value="Vigilance Bureau">Vigilance Bureau</option>
                    <option value="Grievance Cell">Grievance Cell</option>
                    <option value="Research & Grants">Research & Grants</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#171923] font-semibold mb-1 block">
                    Priority SLA:
                  </label>
                  <select
                    value={newCaseData.priority}
                    onChange={(e) =>
                      setNewCaseData({
                        ...newCaseData,
                        priority: e.target.value as CaseItem["priority"],
                      })
                    }
                    className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923] focus:outline-none focus:border-[#6246EA] focus:bg-white"
                  >
                    <option value="low">Low (14 Days)</option>
                    <option value="medium">Medium (7 Days)</option>
                    <option value="high">High (48 Hours)</option>
                    <option value="critical">Critical (24 Hours)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#171923] font-semibold mb-1 block">
                  Subject / Summary:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discrepancy in sanctioned faculty student ratio..."
                  value={newCaseData.subject}
                  onChange={(e) =>
                    setNewCaseData({ ...newCaseData, subject: e.target.value })
                  }
                  className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923] focus:outline-none focus:border-[#6246EA] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[#171923] font-semibold mb-1 block">
                  Detailed Regulatory Matter:
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter full particulars, inspection findings or grievance allegations..."
                  value={newCaseData.description}
                  onChange={(e) =>
                    setNewCaseData({ ...newCaseData, description: e.target.value })
                  }
                  className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923] focus:outline-none focus:border-[#6246EA] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAF0]">
                <button
                  type="button"
                  onClick={() => setIsNewCaseOpen(false)}
                  className="px-3.5 py-1.5 rounded-[6px] bg-[#F7F8FA] hover:bg-[#F0F1F4] text-[#667085] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] font-semibold bg-[#6246EA] hover:bg-[#5338D6] text-white"
                >
                  Register in Central Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LAUNCH CONSULTATION */}
      {isNewCoordOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8EAF0] rounded-[8px] max-w-lg w-full p-5 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EAF0]">
              <h3 className="text-sm font-bold text-[#171923] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6246EA]" />
                Launch Inter-Bureau Coordination Request
              </h3>
              <button
                onClick={() => setIsNewCoordOpen(false)}
                className="text-[#98A2B3] hover:text-[#171923]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoordination} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#171923] font-semibold mb-1 block">
                    Requesting Bureau:
                  </label>
                  <input
                    type="text"
                    value={newCoordData.requestingBureau}
                    onChange={(e) =>
                      setNewCoordData({ ...newCoordData, requestingBureau: e.target.value })
                    }
                    className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923]"
                  />
                </div>
                <div>
                  <label className="text-[#171923] font-semibold mb-1 block">
                    Responding Bureau:
                  </label>
                  <input
                    type="text"
                    value={newCoordData.receivingBureau}
                    onChange={(e) =>
                      setNewCoordData({ ...newCoordData, receivingBureau: e.target.value })
                    }
                    className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#171923] font-semibold mb-1 block">
                  Associated Case Numbers (comma separated):
                </label>
                <input
                  type="text"
                  value={newCoordData.caseIds}
                  onChange={(e) =>
                    setNewCoordData({ ...newCoordData, caseIds: e.target.value })
                  }
                  className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923]"
                />
              </div>

              <div>
                <label className="text-[#171923] font-semibold mb-1 block">
                  Consultation Purpose & Directives Alignment:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the points of contradiction or required alignment..."
                  value={newCoordData.purpose}
                  onChange={(e) =>
                    setNewCoordData({ ...newCoordData, purpose: e.target.value })
                  }
                  className="w-full p-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-[#171923]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAF0]">
                <button
                  type="button"
                  onClick={() => setIsNewCoordOpen(false)}
                  className="px-3.5 py-1.5 rounded-[6px] bg-[#F7F8FA] hover:bg-[#F0F1F4] text-[#667085] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] font-semibold bg-[#6246EA] hover:bg-[#5338D6] text-white"
                >
                  Dispatch Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: GLOBAL QUICK SEARCH */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white border border-[#E8EAF0] rounded-[8px] max-w-xl w-full p-4 shadow-lg space-y-3 animate-in fade-in">
            <div className="relative">
              <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search HEIs, AISHE IDs, Case numbers, or Bureaus..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-xs text-[#171923] placeholder-[#98A2B3] focus:outline-none focus:border-[#6246EA] focus:bg-white"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 text-xs">
              {institutions
                .filter(
                  (i) =>
                    i.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                    i.officialId.toLowerCase().includes(globalSearchTerm.toLowerCase())
                )
                .map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => {
                      setSearchModalOpen(false);
                      setActiveTab("institutions");
                    }}
                    className="p-2 rounded-[6px] bg-[#F7F8FA] hover:bg-[#F3F0FF] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-[#171923]">{inst.name}</p>
                      <span className="text-[10px] text-[#98A2B3] font-mono">
                        {inst.officialId} • {inst.district}, {inst.state}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#6246EA] bg-white font-medium px-2 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                      HEI Dossier
                    </span>
                  </div>
                ))}

              {cases
                .filter(
                  (c) =>
                    c.caseNumber.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                    c.subject.toLowerCase().includes(globalSearchTerm.toLowerCase())
                )
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSearchModalOpen(false);
                      setActiveTab("cases");
                    }}
                    className="p-2 rounded-[6px] bg-[#F7F8FA] hover:bg-[#F3F0FF] cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-mono text-[#6246EA] font-semibold text-[11px]">
                        {c.caseNumber}
                      </span>
                      <p className="font-medium text-[#171923]">{c.subject}</p>
                    </div>
                    <span className="text-[10px] text-[#3478C9] bg-[#EBF3FC] font-medium px-2 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                      {c.bureau}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#98A2B3] pt-2 border-t border-[#E8EAF0]">
              <span>Press ESC to exit</span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-[#667085] hover:text-[#171923]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Institution, CaseItem } from "../lib/data";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Plus,
  ExternalLink,
  MapPin,
  Globe,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  History,
  Check,
} from "lucide-react";

interface Institution360Props {
  institutions: Institution[];
  cases: CaseItem[];
  onSelectCase: (caseItem: CaseItem) => void;
  onInitiateCoordination: (inst: Institution) => void;
}

export default function Institution360({
  institutions,
  cases,
  onSelectCase,
  onInitiateCoordination,
}: Institution360Props) {
  const [selectedInstId, setSelectedInstId] = useState<string>(
    institutions[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "regulatory" | "cases" | "risk" | "compliance" | "documents" | "timeline"
  >("overview");
  const [newAlias, setNewAlias] = useState("");
  const [showAliasInput, setShowAliasInput] = useState(false);
  const [localInstitutions, setLocalInstitutions] = useState(institutions);

  const filteredList = localInstitutions.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.officialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.aliases.some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const activeInst =
    localInstitutions.find((i) => i.id === selectedInstId) ||
    localInstitutions[0];

  const instCases = cases.filter(
    (c) => c.institutionId === activeInst.id || c.institutionName === activeInst.name
  );

  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlias.trim()) return;
    setLocalInstitutions((prev) =>
      prev.map((inst) =>
        inst.id === activeInst.id
          ? { ...inst, aliases: [...inst.aliases, newAlias.trim()] }
          : inst
      )
    );
    setNewAlias("");
    setShowAliasInput(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT PANEL: Institution Directory */}
      <div className="lg:col-span-4 bg-white border border-[#E8EAF0] rounded-[8px] overflow-hidden flex flex-col h-[780px]">
        {/* Directory Header */}
        <div className="p-3.5 border-b border-[#E8EAF0] space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#171923] uppercase tracking-wide">
              Institutional Registry
            </h2>
            <span className="text-[11px] font-mono text-[#667085] bg-[#F7F8FA] px-1.5 py-0.5 rounded border border-[#E8EAF0]">
              {filteredList.length} HEIs
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by AISHE, name, alias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-xs text-[#171923] placeholder-[#98A2B3] focus:outline-none focus:border-[#6246EA] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E8EAF0]">
          {filteredList.map((inst) => {
            const isSelected = inst.id === activeInst.id;
            return (
              <div
                key={inst.id}
                onClick={() => setSelectedInstId(inst.id)}
                className={`p-3 text-left cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#F3F0FF]/60 border-l-2 border-[#6246EA]"
                    : "hover:bg-[#F7F8FA] border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-1">
                  <span className="font-semibold text-[13px] text-[#171923] line-clamp-1 leading-snug">
                    {inst.name}
                  </span>
                  {inst.verificationStatus === "verified" ? (
                    <span className="text-[#078B68] text-[10px] font-semibold bg-[#E8F8F2] px-1.5 py-0.2 rounded border border-[#E8EAF0] shrink-0">
                      Verified
                    </span>
                  ) : inst.verificationStatus === "flagged" ? (
                    <span className="text-[#D93649] text-[10px] font-semibold bg-[#FDF2F4] px-1.5 py-0.2 rounded border border-[#FAD2D8] shrink-0">
                      Flagged
                    </span>
                  ) : (
                    <span className="text-[#C88918] text-[10px] font-semibold bg-[#FCF8E8] px-1.5 py-0.2 rounded border border-[#E8EAF0] shrink-0">
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#697386]">
                  <span className="font-mono text-[10px] font-medium text-[#6246EA]">
                    {inst.officialId}
                  </span>
                  <span>{inst.district}, {inst.state}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] mt-1.5 pt-1.5 border-t border-[#F0F1F4]">
                  <span className="text-[#929BAA]">
                    Active Cases: <strong className="text-[#171923] font-medium">{inst.casesCount}</strong>
                  </span>
                  <span
                    className={`font-semibold text-[10px] ${
                      inst.riskScore > 75
                        ? "text-[#E34D65]"
                        : inst.riskScore > 40
                        ? "text-[#D99A25]"
                        : "text-[#159B72]"
                    }`}
                  >
                    Risk Score: {inst.riskScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN PANEL: 360° Institutional Intelligence */}
      <div className="lg:col-span-8 bg-white border border-[#E8EAF0] rounded-[8px] overflow-hidden flex flex-col">
        {/* Header Profile Identity */}
        <div className="p-6 border-b border-[#E8EAF0]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-[#F7F8FA] text-[#6246EA] border border-[#E8EAF0]">
                  {activeInst.officialId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    activeInst.verificationStatus === "verified"
                      ? "bg-[#E8F8F2] text-[#078B68] border border-[#E8EAF0]"
                      : "bg-[#FDF2F4] text-[#D93649] border border-[#FAD2D8]"
                  }`}
                >
                  {activeInst.verificationStatus.toUpperCase()}
                </span>
                <span className="text-[12px] text-[#98A2B3]">
                  Established {activeInst.establishedYear}
                </span>
              </div>

              <h1 className="text-xl font-bold text-[#171923] leading-tight">
                {activeInst.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085] mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#98A2B3]" />
                  {activeInst.address}, {activeInst.district}, {activeInst.state}
                </span>
                <a
                  href={activeInst.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#6246EA] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {activeInst.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={() => onInitiateCoordination(activeInst)}
              className="px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#6246EA] hover:bg-[#5338D6] text-white transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Initiate Coordination</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Structured Workspace Tab Navigation */}
          <div className="flex items-center gap-1 mt-6 border-b border-[#E8EAF0] -mb-6 pb-0 overflow-x-auto">
            {[
              { id: "overview", label: "Overview" },
              { id: "regulatory", label: "Regulatory Profile" },
              { id: "cases", label: `Cases (${instCases.length})` },
              { id: "risk", label: "AI Risk Analysis" },
              { id: "compliance", label: "Compliance" },
              { id: "documents", label: "Documents" },
              { id: "timeline", label: "Timeline" },
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-[#6246EA] text-[#6246EA] font-semibold"
                      : "border-transparent text-[#667085] hover:text-[#171923]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Structured Key Indicators Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[8px]">
                  <div className="flex items-center justify-between text-xs text-[#667085] mb-1">
                    <span className="font-medium">Regulatory Risk Score</span>
                    <TrendingUp className="w-3.5 h-3.5 text-[#D93649]" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#171923] font-mono tabular-nums">
                      {activeInst.riskScore}
                    </span>
                    <span className="text-xs text-[#98A2B3]">/ 100</span>
                  </div>
                  <div className="w-full bg-[#E8EAF0] h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        activeInst.riskScore > 75
                          ? "bg-[#D93649]"
                          : activeInst.riskScore > 40
                          ? "bg-[#C88918]"
                          : "bg-[#078B68]"
                      }`}
                      style={{ width: `${activeInst.riskScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[8px]">
                  <div className="flex items-center justify-between text-xs text-[#667085] mb-1">
                    <span className="font-medium">Cross-Bureau Footprint</span>
                    <Layers className="w-3.5 h-3.5 text-[#6246EA]" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#171923] font-mono tabular-nums">
                      {activeInst.activeBureaus.length}
                    </span>
                    <span className="text-xs text-[#98A2B3]">Active Bureaus</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {activeInst.activeBureaus.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E8EAF0] text-[#171923]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[8px]">
                  <div className="flex items-center justify-between text-xs text-[#667085] mb-1">
                    <span className="font-medium">Accreditation Standing</span>
                    <Award className="w-3.5 h-3.5 text-[#078B68]" />
                  </div>
                  <p className="text-xs font-semibold text-[#171923] mt-1 leading-snug">
                    {activeInst.accreditation}
                  </p>
                  <p className="text-[11px] text-[#98A2B3] mt-1">
                    Type: {activeInst.type}
                  </p>
                </div>
              </div>

              {/* Aliases Data Group */}
              <div className="p-4 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[8px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#171923] uppercase tracking-wide">
                    Recognised Entity Aliases & Disambiguation Nodes
                  </span>
                  {!showAliasInput && (
                    <button
                      onClick={() => setShowAliasInput(true)}
                      className="text-[11px] font-semibold text-[#6246EA] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Alias
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {activeInst.aliases.map((alias) => (
                    <span
                      key={alias}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-[#171923] border border-[#E8EAF0]"
                    >
                      {alias}
                    </span>
                  ))}
                  {showAliasInput && (
                    <form onSubmit={handleAddAlias} className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Alias name..."
                        value={newAlias}
                        onChange={(e) => setNewAlias(e.target.value)}
                        className="px-2 py-0.5 bg-white border border-[#6246EA] rounded text-xs text-[#171923] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-2 py-0.5 bg-[#6246EA] text-white text-xs font-semibold rounded"
                      >
                        Save
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Affiliated Active Cases Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-[#171923] uppercase tracking-wide">
                    Active Regulatory Cases ({instCases.length})
                  </h3>
                  <span className="text-[11px] text-[#98A2B3] font-mono">
                    AICTE Central Registry
                  </span>
                </div>

                {instCases.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#98A2B3] bg-[#F7F8FA] rounded-[8px] border border-dashed border-[#E8EAF0]">
                    No open regulatory cases for this institution.
                  </div>
                ) : (
                  <div className="border border-[#E8EAF0] rounded-[8px] overflow-hidden divide-y divide-[#E8EAF0]">
                    {instCases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => onSelectCase(c)}
                        className="p-3 bg-white hover:bg-[#F7F8FA] cursor-pointer transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#6246EA]">
                              {c.caseNumber}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F7F8FA] border border-[#E8EAF0] text-[#667085]">
                              {c.bureau}
                            </span>
                            {c.hasOverlapAlert && (
                              <span className="text-[10px] font-semibold text-[#D93649] bg-[#FDF2F4] px-1.5 py-0.2 rounded border border-[#FAD2D8]">
                                Collision Alert
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-[#171923] truncate">
                            {c.subject}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              c.priority === "critical"
                                ? "bg-[#FDF2F4] text-[#D93649] border border-[#FAD2D8]"
                                : "bg-[#FCF8E8] text-[#C88918] border border-[#E8EAF0]"
                            }`}
                          >
                            {c.priority.toUpperCase()}
                          </span>
                          <p className="text-[11px] text-[#98A2B3] mt-1 font-mono">
                            Due {c.dueDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REGULATORY PROFILE */}
          {activeTab === "regulatory" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[8px] space-y-3">
                <h4 className="font-semibold text-[#171923] uppercase tracking-wide">Statutory Clearances & Bureau Directives</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#98A2B3]">AISHE Clearance Code:</span>
                    <p className="font-mono font-medium text-[#171923]">{activeInst.officialId}</p>
                  </div>
                  <div>
                    <span className="text-[#98A2B3]">Council Affiliation Status:</span>
                    <p className="font-medium text-[#078B68]">Permanent Recognized Entity</p>
                  </div>
                  <div>
                    <span className="text-[#98A2B3]">Sanctioned Intake Capacity:</span>
                    <p className="font-medium text-[#171923]">480 Seats (Undergraduate/Postgraduate)</p>
                  </div>
                  <div>
                    <span className="text-[#98A2B3]">State Higher Education Conciliation:</span>
                    <p className="font-medium text-[#171923]">Concordance Verified</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CASES */}
          {activeTab === "cases" && (
            <div className="space-y-3">
              {instCases.map((c) => (
                <div key={c.id} className="p-3.5 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[8px] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#6246EA]">{c.caseNumber}</span>
                    <span className="text-[10px] font-semibold text-[#667085]">{c.status.toUpperCase()}</span>
                  </div>
                  <h4 className="font-semibold text-[#171923]">{c.subject}</h4>
                  <p className="text-[#667085] leading-relaxed">{c.description}</p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#98A2B3]">
                    <span>Officer: {c.ownerName}</span>
                    <span>SLA Deadline: {c.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: AI RISK ANALYSIS */}
          {activeTab === "risk" && (
            <div className="p-4 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[8px] space-y-3 text-xs">
              <h4 className="font-semibold text-[#171923] uppercase tracking-wide">Explainable Institutional Vulnerability Assessment</h4>
              <p className="text-[#667085] leading-relaxed">
                Risk score of {activeInst.riskScore}/100 is generated by cross-correlating open vigilance tips, multi-bureau notice frequency, and pending exam eligibility litigations.
              </p>
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-medium text-[#667085]">
                  <span>Direct Regulatory Conflict Factor</span>
                  <span className="text-[#D93649] font-mono">High (0.88)</span>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-[#667085]">
                  <span>Faculty / Infrastructure Concordance</span>
                  <span className="text-[#C88918] font-mono">Moderate (0.54)</span>
                </div>
                <div className="flex justify-between text-[11px] font-medium text-[#667085]">
                  <span>Audit History Concordance</span>
                  <span className="text-[#078B68] font-mono">Good (0.18)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5, 6, 7 Placeholders */}
          {(activeTab === "compliance" || activeTab === "documents" || activeTab === "timeline") && (
            <div className="p-8 text-center text-xs text-[#98A2B3] bg-[#F7F8FA] rounded-[8px] border border-dashed border-[#E8EAF0]">
              Showing recorded {activeTab} dossiers for {activeInst.officialId}. All records verified against AICTE Central Ledger.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

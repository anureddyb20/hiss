"use client";

import React, { useState } from "react";
import { CaseItem } from "../lib/data";
import {
  Search,
  Plus,
  Clock,
  Sparkles,
  ArrowUpDown,
  Paperclip,
  CheckCircle,
  AlertCircle,
  Filter,
  Layers,
  ChevronDown,
  Building2,
  Calendar,
  User,
  ShieldAlert,
} from "lucide-react";

interface CaseRegistryProps {
  cases: CaseItem[];
  onOpenNewCaseModal: () => void;
  onOpenOverlapForCase: (caseItem: CaseItem) => void;
}

export default function CaseRegistry({
  cases,
  onOpenNewCaseModal,
  onOpenOverlapForCase,
}: CaseRegistryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBureau, setSelectedBureau] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [sortField, setSortField] = useState<"caseNumber" | "dueDate" | "priority">("caseNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const bureaus = [
    "ALL",
    "Admissions",
    "Approval Bureau",
    "Examinations",
    "Vigilance Bureau",
    "Grievance Cell",
    "Research & Grants",
  ];

  // Summary Metrics for Section 08
  const totalCount = cases.length;
  const activeCount = cases.filter((c) => c.status === "open" || c.status === "new").length;
  const criticalCount = cases.filter((c) => c.priority === "critical").length;
  const pendingCount = cases.filter((c) => c.status === "pending").length;

  const handleSort = (field: "caseNumber" | "dueDate" | "priority") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredCases = cases
    .filter((c) => {
      const matchesSearch =
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBureau =
        selectedBureau === "ALL" || c.bureau === selectedBureau;
      const matchesPriority =
        selectedPriority === "ALL" || c.priority === selectedPriority;
      const matchesStatus =
        selectedStatus === "ALL" || c.status === selectedStatus;

      return matchesSearch && matchesBureau && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "caseNumber") {
        comparison = a.caseNumber.localeCompare(b.caseNumber);
      } else if (sortField === "dueDate") {
        comparison = a.dueDate.localeCompare(b.dueDate);
      } else if (sortField === "priority") {
        const pOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison = (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      {/* SECTION 08 TOP SUMMARY & TITLE */}
      <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#171923] tracking-tight">
              Cross-Bureau Case Registry
            </h1>
            <span className="font-mono text-[10px] text-[#6246EA] bg-[#F3F0FF] px-2 py-0.5 rounded-[4px] border border-[#E8EAF0] font-semibold">
              Statutory Docket
            </span>
          </div>
          <p className="text-xs text-[#667085]">
            Centralized intake docket across 7 AICTE bureaus with automated SLA timers and conflict surveillance.
          </p>
        </div>

        <button
          onClick={onOpenNewCaseModal}
          className="px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#6246EA] hover:bg-[#5338D6] text-white transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Case</span>
        </button>
      </div>

      {/* Case Metrics Strip (Section 08 Directive) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-3 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#98A2B3]">Total Cases</span>
            <div className="text-xl font-bold text-[#171923] font-mono tabular-nums">{totalCount}</div>
          </div>
          <Layers className="w-4 h-4 text-[#98A2B3]" />
        </div>

        <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-3 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#98A2B3]">Active Cases</span>
            <div className="text-xl font-bold text-[#078B68] font-mono tabular-nums">{activeCount}</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#078B68]" />
        </div>

        <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-3 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#98A2B3]">Critical SLA</span>
            <div className="text-xl font-bold text-[#D93649] font-mono tabular-nums">{criticalCount}</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#D93649]" />
        </div>

        <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-3 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#98A2B3]">Pending Action</span>
            <div className="text-xl font-bold text-[#C88918] font-mono tabular-nums">{pendingCount}</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#C88918]" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#98A2B3] absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by case ID, institution, subject or officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] text-xs text-[#171923] placeholder-[#98A2B3] focus:outline-none focus:border-[#6246EA] focus:bg-white transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedBureau}
            onChange={(e) => setSelectedBureau(e.target.value)}
            className="bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] px-2.5 py-1.5 text-xs text-[#171923] focus:outline-none focus:border-[#6246EA]"
          >
            {bureaus.map((b) => (
              <option key={b} value={b}>
                Bureau: {b}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] px-2.5 py-1.5 text-xs text-[#171923] focus:outline-none focus:border-[#6246EA]"
          >
            <option value="ALL">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F7F8FA] border border-[#E8EAF0] rounded-[6px] px-2.5 py-1.5 text-xs text-[#171923] focus:outline-none focus:border-[#6246EA]"
          >
            <option value="ALL">All Statuses</option>
            <option value="new">New</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>

          <span className="text-[11px] font-mono font-medium text-[#667085] px-2 tabular-nums">
            {filteredCases.length} records
          </span>
        </div>
      </div>

      {/* MAIN HIGH-DENSITY TABLE (Section 08 Directive) */}
      <div className="bg-white border border-[#E8EAF0] rounded-[8px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] border-b border-[#E8EAF0] text-[10px] font-semibold text-[#667085] uppercase tracking-wider">
              <tr>
                <th
                  onClick={() => handleSort("caseNumber")}
                  className="py-2.5 px-3 cursor-pointer hover:text-[#171923] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Case ID</span>
                    <ArrowUpDown className="w-3 h-3 text-[#98A2B3]" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Institution</th>
                <th className="py-2.5 px-3">Bureau</th>
                <th className="py-2.5 px-3">Subject</th>
                <th
                  onClick={() => handleSort("priority")}
                  className="py-2.5 px-3 cursor-pointer hover:text-[#171923] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-[#98A2B3]" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Assigned Officer</th>
                <th
                  onClick={() => handleSort("dueDate")}
                  className="py-2.5 px-3 cursor-pointer hover:text-[#171923] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>SLA Deadline</span>
                    <ArrowUpDown className="w-3 h-3 text-[#98A2B3]" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0]">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className="hover:bg-[#F7F8FA] transition-colors cursor-pointer group"
                >
                  {/* 1. Case ID */}
                  <td className="py-3 px-3">
                    <span className="font-mono text-xs font-semibold text-[#6246EA] block group-hover:underline">
                      {c.caseNumber}
                    </span>
                    {c.hasOverlapAlert && (
                      <span className="inline-block mt-0.5 text-[9px] font-bold text-[#D93649] bg-[#FDF2F4] px-1 py-0.2 rounded border border-[#FAD2D8]">
                        Collision Alert
                      </span>
                    )}
                  </td>

                  {/* 2. Institution */}
                  <td className="py-3 px-3 font-medium text-[#171923] max-w-[190px]">
                    <span className="block truncate text-xs">{c.institutionName}</span>
                    <span className="text-[10px] text-[#98A2B3] font-mono">{c.category}</span>
                  </td>

                  {/* 3. Bureau */}
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-medium text-[#171923] bg-[#F7F8FA] px-1.5 py-0.5 rounded border border-[#E8EAF0] whitespace-nowrap">
                      {c.bureau}
                    </span>
                  </td>

                  {/* 4. Subject */}
                  <td className="py-3 px-3 max-w-xs">
                    <p className="text-xs font-medium text-[#171923] truncate">
                      {c.subject}
                    </p>
                    <p className="text-[11px] text-[#667085] truncate mt-0.5">
                      {c.description}
                    </p>
                  </td>

                  {/* 5. Priority */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        c.priority === "critical"
                          ? "bg-[#FDF2F4] text-[#D93649] border border-[#FAD2D8]"
                          : c.priority === "high"
                          ? "bg-[#FCF8E8] text-[#C88918] border border-[#E8EAF0]"
                          : "bg-[#EBF3FC] text-[#3478C9] border border-[#E8EAF0]"
                      }`}
                    >
                      {c.priority.toUpperCase()}
                    </span>
                  </td>

                  {/* 6. Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        c.status === "open"
                          ? "bg-[#EBF3FC] text-[#3478C9] border-[#E8EAF0]"
                          : c.status === "new"
                          ? "bg-[#F3F0FF] text-[#6246EA] border-[#E8EAF0]"
                          : "bg-[#E8F8F2] text-[#078B68] border-[#E8EAF0]"
                      }`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </td>

                  {/* 7. Assigned Officer */}
                  <td className="py-3 px-3 text-[11px]">
                    <span className="font-medium text-[#171923] block">{c.ownerName}</span>
                    <span className="text-[#98A2B3] text-[10px]">{c.ownerBureau}</span>
                  </td>

                  {/* 8. SLA Deadline */}
                  <td className="py-3 px-3 text-[11px] font-mono tabular-nums">
                    <span className="text-[#171923] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#98A2B3]" />
                      {c.dueDate}
                    </span>
                  </td>

                  {/* 9. Actions */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOverlapForCase(c);
                      }}
                      className="p-1.5 rounded hover:bg-[#F3F0FF] text-[#667085] hover:text-[#6246EA] transition-colors"
                      title="Inspect Overlap Engine"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROPER DETAILED CASE WORKSPACE MODAL (Section 08 Directive) */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8EAF0] rounded-[8px] max-w-xl w-full p-5 shadow-lg space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#E8EAF0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#6246EA]">
                    {selectedCase.caseNumber}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F7F8FA] border border-[#E8EAF0] text-[#667085]">
                    {selectedCase.bureau}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                      selectedCase.priority === "critical"
                        ? "bg-[#FDF2F4] text-[#D93649]"
                        : "bg-[#EBF3FC] text-[#3478C9]"
                    }`}
                  >
                    {selectedCase.priority.toUpperCase()} SLA
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#171923] mt-1.5">
                  {selectedCase.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-[#98A2B3] hover:text-[#171923]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F7F8FA] rounded-[6px] border border-[#E8EAF0]">
                <span className="text-[10px] uppercase font-mono text-[#98A2B3]">Institution</span>
                <p className="font-semibold text-[#171923] mt-0.5">{selectedCase.institutionName}</p>
              </div>
              <div className="p-3 bg-[#F7F8FA] rounded-[6px] border border-[#E8EAF0]">
                <span className="text-[10px] uppercase font-mono text-[#98A2B3]">Assigned Officer</span>
                <p className="font-semibold text-[#171923] mt-0.5">{selectedCase.ownerName}</p>
                <span className="text-[10px] text-[#667085]">{selectedCase.ownerBureau}</span>
              </div>
            </div>

            <div className="text-xs">
              <span className="font-semibold text-[#171923]">Statutory Matter & Findings:</span>
              <p className="mt-1 p-3 bg-[#F7F8FA] rounded-[6px] border border-[#E8EAF0] text-[#171923] leading-relaxed">
                {selectedCase.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E8EAF0] text-xs">
              <span className="text-[#667085] font-mono text-[11px]">
                Statutory Deadline: <strong className="text-[#C88918]">{selectedCase.dueDate}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenOverlapForCase(selectedCase);
                    setSelectedCase(null);
                  }}
                  className="px-3 py-1.5 rounded-[6px] font-semibold bg-[#6246EA] text-white text-xs hover:bg-[#5338D6]"
                >
                  Inspect Overlap Engine
                </button>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-3 py-1.5 rounded-[6px] font-medium bg-[#F7F8FA] text-[#667085] hover:text-[#171923] border border-[#E8EAF0]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { HelpCircle, BookOpen, ExternalLink, ShieldCheck, Mail } from "lucide-react";

export default function HelpView() {
  const faqs = [
    {
      q: "What is SYNAPSE and how does it prevent regulatory blind spots?",
      a: "SYNAPSE is the AICTE Institution Intelligence & Cross-Bureau Engine developed for the Smart India Hackathon 2026. It unifies case files, approval records, vigilance warnings, and examination notices across 7 AICTE bureaus into a single 360° institution graph to prevent conflicting orders.",
    },
    {
      q: "How does the AI Overlap Engine calculate conflict scores?",
      a: "The engine runs a three-factor evaluation: (1) Deterministic AISHE and alias match (0-100%), (2) Semantic NLP embedding similarity across complaint texts (0-100%), and (3) Symbolic regulatory logic conflict detection (checking if one bureau is issuing approval while another is issuing a freeze or audit).",
    },
    {
      q: "What is the Inter-Bureau Coordination protocol?",
      a: "When a potential overlap is confirmed by a Reviewing Officer, a formal coordination consultation docket is launched. Participating bureaus must reconcile directives before any formal communication or penalty is dispatched to the institution.",
    },
    {
      q: "How does Role-Based Access Control (RBAC) work across the 5 portals?",
      a: "SYNAPSE provides five distinct institutional portals: (1) Central Administrator (Full cross-bureau conflict surveillance and conciliation dispatch), (2) Bureau Officer (Scoped to specific regulatory bureau filings), (3) HEI Administrator (Institutional compliance standing and affidavits), (4) Auditor (Statutory SLA benchmarks and cryptographic ledger), and (5) Super Administrator (Core AI engine parameters, symbolic rulebase, and RBAC matrix).",
    },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#171923] tracking-tight">
            SYNAPSE Intelligence Portal Documentation & Support
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Operational guidelines, regulatory protocols, and SIH 2026 reference architecture.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4">
          <BookOpen className="w-5 h-5 text-[#6246EA] mb-2" />
          <h3 className="text-sm font-bold text-[#171923] mb-1">Standard Operating Procedures</h3>
          <p className="text-xs text-[#667085] mb-3 leading-relaxed">
            Read AICTE regulatory compliance manuals and cross-bureau arbitration directives.
          </p>
          <a
            href="https://www.aicte-india.org"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[#6246EA] hover:underline flex items-center gap-1"
          >
            <span>View AICTE Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4">
          <ShieldCheck className="w-5 h-5 text-[#078B68] mb-2" />
          <h3 className="text-sm font-bold text-[#171923] mb-1">Audit & Integrity</h3>
          <p className="text-xs text-[#667085] mb-3 leading-relaxed">
            All conciliation minutes and overlap reviews are sealed with SHA-256 cryptographic hashes.
          </p>
          <span className="text-[10px] text-[#078B68] font-semibold bg-[#E8F8F2] px-2 py-0.5 rounded border border-[#E8EAF0]">
            Tamper-Evident Ledger
          </span>
        </div>

        <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-4">
          <Mail className="w-5 h-5 text-[#3478C9] mb-2" />
          <h3 className="text-sm font-bold text-[#171923] mb-1">Technical Secretariat</h3>
          <p className="text-xs text-[#667085] mb-3 leading-relaxed">
            Need system assistance or AICTE data pipeline integration support?
          </p>
          <span className="text-xs font-semibold text-[#171923] font-mono">
            support@synapse-aicte.gov.in
          </span>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white border border-[#E8EAF0] rounded-[8px] p-5 space-y-4">
        <h2 className="text-sm font-bold text-[#171923] flex items-center gap-2 pb-3 border-b border-[#E8EAF0] uppercase tracking-wide">
          <HelpCircle className="w-4 h-4 text-[#6246EA]" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-3.5 rounded-[6px] bg-[#F7F8FA] border border-[#E8EAF0] space-y-1">
              <h4 className="text-xs font-bold text-[#171923]">{faq.q}</h4>
              <p className="text-xs text-[#667085] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

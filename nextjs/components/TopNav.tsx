"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Check,
} from "lucide-react";

interface TopNavProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onSearchClick: () => void;
  pendingOverlapsCount: number;
  onToggleMobileSidebar?: () => void;
}

const ROLES = [
  { id: "central_admin", label: "Central Administrator", bureau: "AICTE Central HQ", initials: "CA" },
  { id: "bureau_officer", label: "Bureau Officer", bureau: "Admissions Bureau", initials: "BO" },
  { id: "hei_admin", label: "HEI Administrator", bureau: "Synthetic Inst. of Tech (AISHE C-26789)", initials: "HA" },
  { id: "auditor", label: "Auditor", bureau: "Statutory & SLA Vigilance", initials: "AU" },
  { id: "super_admin", label: "Super Administrator", bureau: "GovTech Core Architecture", initials: "SA" },
];

export default function TopNav({
  currentRole,
  onRoleChange,
  onSearchClick,
  pendingOverlapsCount,
  onToggleMobileSidebar,
}: TopNavProps) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeRoleObj = ROLES.find((r) => r.id === currentRole) || ROLES[0];

  return (
    <header className="h-14 bg-white border-b border-[#E8EAF0] sticky top-0 z-20 flex items-center justify-between px-6">
      {/* Left: Mobile menu toggle + Global search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 -ml-2 rounded-lg text-[#667085] hover:text-[#171923] hover:bg-[#F7F8FA] md:hidden transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onSearchClick}
            className="w-full flex items-center justify-between px-3.5 h-9 bg-[#F7F8FA] hover:bg-[#F0F1F4] border border-[#E8EAF0] text-[#667085] rounded-lg text-xs transition-colors group"
          >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#98A2B3] group-hover:text-[#667085] transition-colors" />
                <span className="text-[#667085] text-[13px] font-normal">Search AISHE, cases, bureaus...</span>
              </div>
                <kbd className="hidden sm:inline-block bg-white text-[#98A2B3] text-[11px] font-mono px-2 py-0.5 rounded border border-[#E8EAF0]">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Notification & Officer Profile */}
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      setRoleMenuOpen(false);
                    }}
                    className="relative h-9 w-9 rounded-lg flex items-center justify-center text-[#667085] hover:text-[#171923] hover:bg-[#F7F8FA] border border-[#E8EAF0] transition-colors"
                    title="Regulatory alerts"
                  >
                    <Bell className="w-4 h-4" />
                    {pendingOverlapsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#D93649] rounded-full ring-2 ring-white" />
                    )}
                  </button>

                  {notifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E8EAF0] rounded-xl dropdown-shadow p-3.5 z-50 animate-in fade-in slide-in-from-top-1">
                          <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EAF0]">
                            <span className="text-[13px] font-medium text-[#171923]">Regulatory Intelligence Alerts</span>
                            <span className="text-[11px] text-[#6246EA] cursor-pointer hover:underline font-medium">
                              Mark all read
                            </span>
                          </div>
                                <div className="mt-2.5 space-y-2">
                                  <div className="p-3 bg-[#FDF2F4] border border-[#FAD2D8] rounded-lg">
                                    <p className="font-medium text-[#D93649] flex items-center gap-1.5 text-[12px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#D93649]" />
                                      Critical Conflict Alert (91% Score)
                                    </p>
                                      <p className="text-[#667085] text-[12px] mt-1 leading-snug">
                                        Admissions ↔ Examinations collision for Synthetic Inst. of Tech.
                                      </p>
                                  </div>
                                      <div className="p-3 bg-[#FCF8E8] border border-[#F6E8B6] rounded-lg">
                                        <p className="font-medium text-[#C88918] flex items-center gap-1.5 text-[12px]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#C88918]" />
                                          Consultation Response Due
                                        </p>
                                          <p className="text-[#667085] text-[12px] mt-1 leading-snug">
                                            COORD-2026-101 has 4 days remaining before statutory deadline.
                                          </p>
                                      </div>
                                  </div>
                                </div>
          )}
                            </div>

                            {/* User Profile & Role Selector */}
                            <div className="relative">
                              <button
                                onClick={() => {
                                  setRoleMenuOpen(!roleMenuOpen);
                                  setNotifOpen(false);
                                }}
                                className="h-9 flex items-center gap-2.5 pl-2.5 pr-3 rounded-lg border border-[#E8EAF0] hover:bg-[#F7F8FA] transition-colors"
                              >
                                  <div className="w-6 h-6 rounded-md bg-[#F3F0FF] text-[#6246EA] font-medium text-[11px] flex items-center justify-center border border-[#E8EAF0]">
                                    {activeRoleObj.initials}
                                  </div>
                                  <div className="text-left hidden sm:block">
                                      <div className="text-[12px] font-medium text-[#171923] leading-none">
                                        {activeRoleObj.label}
                                      </div>
                                        <div className="text-[10px] text-[#98A2B3] leading-none mt-1 truncate max-w-[140px]">
                                          {activeRoleObj.bureau}
                                        </div>
                                      </div>
                                      <ChevronDown className="w-3.5 h-3.5 text-[#98A2B3] ml-0.5" />
                                    </button>

                                    {roleMenuOpen && (
                                          <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E8EAF0] rounded-xl dropdown-shadow p-2 z-50 animate-in fade-in slide-in-from-top-1">
                                            <div className="px-3 py-2 text-[11px] font-medium text-[#98A2B3] uppercase tracking-wider border-b border-[#E8EAF0]">
                                              Select Operational Portal (5 Roles)
                                            </div>
                                              <div className="mt-1 space-y-1">
                                                {ROLES.map((r) => {
                                                  const isSelected = r.id === currentRole;
                                                  return (
                                                    <button
                                                      key={r.id}
                                                      onClick={() => {
                                                        onRoleChange(r.id);
                                                        setRoleMenuOpen(false);
                                                      }}
                                                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                                                        isSelected
                                                          ? "bg-[#F3F0FF] text-[#6246EA]"
                                                          : "text-[#171923] hover:bg-[#F7F8FA]"
                                                      }`}
                                                    >
                      <div>
                        <p className={`text-[13px] leading-tight ${isSelected ? "font-medium" : "font-normal"}`}>
                                                {r.label}
                                              </p>
                                              <p className="text-[11px] text-[#667085] mt-0.5">{r.bureau}</p>
                                            </div>
                                            {isSelected && <Check className="w-4 h-4 text-[#6246EA] shrink-0" />}
                                          </button>
                                          );
                })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </header>
                              );
}

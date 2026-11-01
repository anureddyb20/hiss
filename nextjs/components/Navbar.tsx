"use client";

import React, { useState } from "react";
import {
  Shield,
  Activity,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Layers,
  Cpu,
} from "lucide-react";

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  onSearchClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingOverlapsCount: number;
}

const ROLES = [
  { id: "admin", label: "System Administrator", bureau: "AICTE Central HQ", icon: "👑" },
  { id: "officer", label: "Bureau Officer", bureau: "Admissions Bureau", icon: "📋" },
  { id: "reviewer", label: "Reviewing Officer", bureau: "Overlap Review Desk", icon: "🔍" },
  { id: "coordinator", label: "Coordination Officer", bureau: "Inter-Bureau Secretariat", icon: "🤝" },
  { id: "viewer", label: "Management Viewer", bureau: "Ministry / Senior Exec", icon: "📊" },
];

export default function Navbar({
  currentRole,
  onRoleChange,
  onSearchClick,
  activeTab,
  setActiveTab,
  pendingOverlapsCount,
}: NavbarProps) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeRoleObj = ROLES.find((r) => r.id === currentRole) || ROLES[0];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      {/* Top AICTE Gov Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-slate-900/60 to-emerald-950/40 border-b border-slate-800/80 px-4 py-1 text-xs flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">
            अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE)
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-400">
            Ministry of Education, Government of India
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" /> SIH 2026 Engine
          </span>
          <span className="text-slate-400 hidden md:inline">
            Production Cluster: <span className="text-emerald-400 font-mono">IND-CENTRAL-01</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Layers className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-cyan-100 to-indigo-300 bg-clip-text text-transparent">
                SYNAPSE
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                v2.4 Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight hidden sm:block">
              Institution Intelligence & Cross-Bureau Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "institutions", label: "Institutions 360°", icon: Shield },
            { id: "cases", label: "Case Registry", icon: Layers },
            {
              id: "overlaps",
              label: "AI Overlap Engine",
              icon: Sparkles,
              badge: pendingOverlapsCount > 0 ? pendingOverlapsCount : undefined,
            },
            { id: "coordination", label: "Coordination Hub", icon: UserCheck },
            { id: "audit", label: "Audit & Analytics", icon: Cpu },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-200" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Search, Role Switcher, Alerts */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={onSearchClick}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search AISHE, Cases...</span>
            <kbd className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
                  <span>Engine Alerts ({pendingOverlapsCount} Pending)</span>
                  <span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">
                    Mark read
                  </span>
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="p-2 bg-rose-950/30 border border-rose-900/50 rounded-lg">
                    <p className="font-medium text-rose-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Critical Overlap Detected (91%)
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Admissions vs Examinations conflict on Synthetic Inst. of Tech.
                    </p>
                  </div>
                  <div className="p-2 bg-amber-950/30 border border-amber-900/50 rounded-lg">
                    <p className="font-medium text-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Coordination Response Due
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      COORD-2026-101 has 4 days remaining before statutory deadline.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700/80 rounded-xl text-xs transition-all shadow-sm"
            >
              <span className="text-sm">{activeRoleObj.icon}</span>
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-slate-200 leading-tight">
                  {activeRoleObj.label}
                </p>
                <p className="text-[10px] text-cyan-400 leading-none">
                  {activeRoleObj.bureau}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Active Role (RBAC)
                </div>
                <div className="mt-1 space-y-1">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                        r.id === currentRole
                          ? "bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/50"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-base">{r.icon}</span>
                      <div>
                        <p>{r.label}</p>
                        <p className="text-[10px] text-slate-400">{r.bureau}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

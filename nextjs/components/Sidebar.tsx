"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  Search,
  Settings,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingOverlapsCount: number;
  onSearchClick: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingOverlapsCount,
  onSearchClick,
  onSettingsClick,
  onHelpClick,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "institutions", label: "Institutions", icon: Building2 },
    { id: "cases", label: "Case Registry", icon: Layers },
    {
      id: "overlaps",
      label: "AI Overlap Engine",
      icon: Sparkles,
      badge: pendingOverlapsCount > 0 ? pendingOverlapsCount : undefined,
    },
    { id: "coordination", label: "Coordination Hub", icon: Users },
    { id: "audit", label: "Audit & Analytics", icon: ShieldCheck },
  ];

  const bottomNavItems = [
    { id: "search", label: "Search", icon: Search, onClick: onSearchClick, shortcut: "⌘K" },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      onClick: onSettingsClick || (() => setActiveTab("settings")),
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      onClick: onHelpClick || (() => setActiveTab("help")),
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-[#E8EAF0] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="h-14 px-3.5 border-b border-[#E8EAF0] flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[6px] bg-[#6246EA] flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                S
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[13px] text-[#171923] tracking-tight leading-none">
                    SYNAPSE
                  </span>
                  <span className="px-1 py-0.2 text-[9px] font-semibold text-[#6246EA] bg-[#F3F0FF] rounded-[4px] border border-[#E8EAF0]">
                    v2.4 PRO
                  </span>
                </div>
                <span className="text-[10px] text-[#98A2B3] font-medium leading-none mt-1">
                  AICTE Intelligence
                </span>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 mx-auto rounded-[6px] bg-[#6246EA] flex items-center justify-center text-white font-bold text-xs shadow-2xs">
              S
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-[6px] text-[#98A2B3] hover:text-[#171923] hover:bg-[#F7F8FA] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftClose className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="p-2 space-y-0.5">
          {!collapsed && (
            <div className="px-2.5 pt-2 pb-1 text-[10px] font-semibold text-[#98A2B3] uppercase tracking-wider">
              Navigation
            </div>
          )}

          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors group ${
                  isActive
                    ? "bg-[#F3F0FF] text-[#6246EA] font-semibold"
                    : "text-[#667085] hover:text-[#171923] hover:bg-[#F7F8FA] font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-[#6246EA]" : "text-[#667085] group-hover:text-[#171923]"
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate leading-none">{item.label}</span>
                  )}
                </div>

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                      isActive
                        ? "bg-[#6246EA] text-white"
                        : "bg-[#FDF2F4] text-[#D93649] border border-[#FAD2D8]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {collapsed && item.badge !== undefined && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D93649] absolute right-2" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Nav: Search, Settings, Help */}
      <div className="p-2 border-t border-[#E8EAF0] space-y-0.5">
        {!collapsed && (
          <div className="px-2.5 pt-1 pb-1 text-[10px] font-semibold text-[#98A2B3] uppercase tracking-wider">
            System
          </div>
        )}

        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors group ${
                isActive
                  ? "bg-[#F3F0FF] text-[#6246EA] font-semibold"
                  : "text-[#667085] hover:text-[#171923] hover:bg-[#F7F8FA] font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#6246EA]" : "text-[#667085] group-hover:text-[#171923]"
                  }`}
                />
                {!collapsed && (
                  <span className="truncate leading-none">{item.label}</span>
                )}
              </div>

              {!collapsed && item.shortcut && (
                <kbd className="text-[10px] font-mono text-[#98A2B3] bg-[#F7F8FA] px-1.5 py-0.5 rounded-[4px] border border-[#E8EAF0]">
                  {item.shortcut}
                </kbd>
              )}
            </button>
          );
        })}

        {/* Server Status Indicator */}
        {!collapsed ? (
          <div className="mt-2 pt-2 px-2.5 pb-1 border-t border-[#E8EAF0] flex items-center justify-between text-[11px] text-[#667085]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#078B68]" />
              <span className="font-mono text-[10px] text-[#171923] font-medium">IND-CENTRAL-01</span>
            </div>
            <span className="text-[10px] text-[#078B68] font-semibold">Operational</span>
          </div>
        ) : (
          <div className="flex justify-center pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#078B68]" title="IND-CENTRAL-01 Operational" />
          </div>
        )}
      </div>
    </aside>
  );
}

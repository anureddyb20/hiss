"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  LogOut,
  User,
  Mail,
  Building2,
  Shield,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useRouter, usePathname } from "next/navigation";

interface TopNavProps {
  onSearchClick: () => void;
  pendingOverlapsCount: number;
  onToggleMobileSidebar?: () => void;
}

const ROLE_DISPLAY: Record<string, { label: string; bureau: string; initials: string }> = {
  system_admin: { label: "System Administrator", bureau: "AICTE Central HQ", initials: "SA" },
  bureau_officer: { label: "Bureau Officer", bureau: "Admissions Bureau", initials: "BO" },
  reviewing_officer: { label: "Reviewing Officer", bureau: "Overlap Review Desk", initials: "RO" },
  coordination_officer: { label: "Coordination Officer", bureau: "Inter-Bureau Secretariat", initials: "CO" },
  management_viewer: { label: "Management Viewer", bureau: "Ministry / Senior Exec", initials: "MV" },
  central_admin: { label: "Central Administrator", bureau: "AICTE Central HQ", initials: "CA" },
  hei_admin: { label: "HEI Administrator", bureau: "Synthetic Inst. of Tech", initials: "HA" },
  auditor: { label: "Auditor", bureau: "Statutory & SLA Vigilance", initials: "AU" },
  super_admin: { label: "Super Administrator", bureau: "GovTech Core Architecture", initials: "SA" },
};

export default function TopNav({
  onSearchClick,
  pendingOverlapsCount,
  onToggleMobileSidebar,
}: TopNavProps) {
  const { user, isAuthenticated, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowSignOutConfirm(false);
    router.push("/login");
    router.refresh();
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.role && ROLE_DISPLAY[user.role]) {
      return ROLE_DISPLAY[user.role].initials;
    }
    return "US";
  };

  const getRoleInfo = () => {
    if (user?.role && ROLE_DISPLAY[user.role]) {
      return ROLE_DISPLAY[user.role];
    }
    return { label: "Unknown Role", bureau: "Unknown Bureau", initials: "??" };
  };

  // If not authenticated, show sign in button
  if (!isAuthenticated || authLoading) {
    return (
      <header className="h-14 bg-white border-b border-[#E8EAF0] sticky top-0 z-20 flex items-center justify-between px-6">
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

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setAccountMenuOpen(false);
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
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E8EAF0] rounded-xl shadow-lg p-3.5 z-50 animate-in fade-in slide-in-from-top-1">
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

          {/* Sign In Button when not authenticated */}
          <button
            onClick={handleSignIn}
            className="h-9 flex items-center gap-2.5 pl-3 pr-3 rounded-lg border border-[#E8EAF0] hover:bg-[#F7F8FA] transition-colors bg-[#6246EA] text-white hover:bg-[#5338D6]"
          >
            <span className="text-[13px] font-medium">Sign In</span>
          </button>
        </div>
      </header>
    );
  }

  const roleInfo = getRoleInfo();
  const initials = getInitials();

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
        )>

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

      {/* Right: Notification & Account Menu */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setAccountMenuOpen(false);
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
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E8EAF0] rounded-xl shadow-lg p-3.5 z-50 animate-in fade-in slide-in-from-top-1">
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

        {/* Account Menu */}
        <div className="relative" ref={accountMenuRef}>
          <button
            onClick={() => {
              setAccountMenuOpen(!accountMenuOpen);
              setNotifOpen(false);
            }}
            className="h-9 flex items-center gap-2.5 pl-2.5 pr-3 rounded-lg border border-[#E8EAF0] hover:bg-[#F7F8FA] transition-colors"
            aria-expanded={accountMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 rounded-md bg-[#F3F0FF] text-[#6246EA] font-medium text-[12px] flex items-center justify-center border border-[#E8EAF0]">
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[12px] font-medium text-[#171923] leading-none">
                {roleInfo.label}
              </div>
              <div className="text-[10px] text-[#98A2B3] leading-none mt-1 truncate max-w-[140px]">
                {roleInfo.bureau}
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#98A2B3] ml-0.5 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E8EAF0] rounded-xl shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1">
              {/* Account Information */}
              <div className="px-2 py-3 border-b border-[#E8EAF0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#F3F0FF] text-[#6246EA] font-medium text-[14px] flex items-center justify-center border border-[#E8EAF0] flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-[#171923] truncate">{getDisplayName()}</p>
                    <p className="text-[11px] text-[#667085] truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-[12px]">
                  <div className="flex items-center gap-2 text-[#667085]">
                    <Shield className="w-3.5 h-3.5 text-[#98A2B3] flex-shrink-0" />
                    <span className="font-medium text-[#171923]">{roleInfo.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#667085]">
                    <Building2 className="w-3.5 h-3.5 text-[#98A2B3] flex-shrink-0" />
                    <span className="truncate">{roleInfo.bureau}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#667085]">
                    <Mail className="w-3.5 h-3.5 text-[#98A2B3] flex-shrink-0" />
                    <span className="truncate font-mono">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-1.5 border-t border-[#E8EAF0]" />

              {/* Account Actions */}
              <div className="px-1 py-1 space-y-1">
                <button
                  onClick={() => {
                    // Navigate to profile/settings if needed
                    setAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] text-[#171923] hover:bg-[#F7F8FA] transition-colors"
                >
                  <User className="w-4 h-4 text-[#98A2B3]" />
                  <span>Account Settings</span>
                </button>
                
                {/* Sign Out Button */}
                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    setShowSignOutConfirm(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] text-[#D93649] hover:bg-[#FDF2F4] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Sign Out Confirmation Dialog */}
          {showSignOutConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-sm animate-in fade-in zoom-in-95">
                <div className="p-5 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#FDF2F4] flex items-center justify-center mx-auto">
                      <LogOut className="w-6 h-6 text-[#D93649]" />
                    </div>
                    <h3 className="text-[16px] font-semibold text-[#171923]">Sign Out</h3>
                    <p className="text-[13px] text-[#667085]">
                      Are you sure you want to sign out of your account?
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => setShowSignOutConfirm(false)}
                      className="flex-1 h-10 rounded-lg border border-[#E8EAF0] text-[#171923] font-medium text-[13px] hover:bg-[#F7F8FA] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex-1 h-10 rounded-lg bg-[#D93649] text-white font-medium text-[13px] hover:bg-[#C02F1A] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
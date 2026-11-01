"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { UserRead } from "./schemas/user";

interface AuthContextType {
  user: UserRead | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Seeded Accounts for SYNAPSE Enterprise Coordination Platform
export const SEEDED_ACCOUNTS: Record<
  string,
  {
    id: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
    organization: string;
  }
> = {
  "admin@example.com": {
    id: "usr-001",
    email: "admin@example.com",
    password: "admin123",
    full_name: "Dr. K. S. Murthy",
    role: "central_admin",
    organization: "AICTE Central HQ",
  },
  "officer1@example.com": {
    id: "usr-002",
    email: "officer1@example.com",
    password: "officer123",
    full_name: "Rajesh Kumar",
    role: "bureau_officer",
    organization: "Admissions Bureau",
  },
  "hei.admin@example.com": {
    id: "usr-003",
    email: "hei.admin@example.com",
    password: "hei123",
    full_name: "Prof. Arvind Rao",
    role: "hei_admin",
    organization: "Synthetic Inst. of Tech",
  },
  "reviewer@example.com": {
    id: "usr-003b",
    email: "reviewer@example.com",
    password: "review123",
    full_name: "Prof. Arvind Rao",
    role: "hei_admin",
    organization: "Synthetic Inst. of Tech",
  },
  "auditor@example.com": {
    id: "usr-004",
    email: "auditor@example.com",
    password: "audit123",
    full_name: "Sunita Deshmukh",
    role: "auditor",
    organization: "Statutory & SLA Vigilance",
  },
  "viewer@example.com": {
    id: "usr-004b",
    email: "viewer@example.com",
    password: "viewer123",
    full_name: "Sunita Deshmukh",
    role: "auditor",
    organization: "Statutory & SLA Vigilance",
  },
  "superadmin@example.com": {
    id: "usr-005",
    email: "superadmin@example.com",
    password: "super123",
    full_name: "Vikramaditya Sharma",
    role: "super_admin",
    organization: "GovTech Core Architecture",
  },
  "coord@example.com": {
    id: "usr-005b",
    email: "coord@example.com",
    password: "coord123",
    full_name: "Vikramaditya Sharma",
    role: "super_admin",
    organization: "GovTech Core Architecture",
  },
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("synapse_user");
    const isLoggedOut = localStorage.getItem("synapse_logged_out") === "true";

    // 1. If explicit log out occurred and no new token, remain unauthenticated
    if (isLoggedOut && !token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // 2. If stored user JSON exists in local session
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem("synapse_user");
      }
    }

    // 3. If token exists, try fetching from backend
    if (token) {
      try {
        const data = await fetchWithAuth("/api/v1/users/me");
        const fullUser: UserRead = {
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          is_active: data.is_active,
          role: data.role,
          organization: data.organization || SEEDED_ACCOUNTS[data.email]?.organization || "SYNAPSE Central",
        };
        setUser(fullUser);
        localStorage.setItem("synapse_user", JSON.stringify(fullUser));
        setLoading(false);
        return;
      } catch {
        // Backend unavailable or token expired
      }
    }

    // 4. Default initial session: Central Administrator
    const defaultAccount = SEEDED_ACCOUNTS["admin@example.com"];
    const initialUser: UserRead = {
      id: defaultAccount.id,
      email: defaultAccount.email,
      full_name: defaultAccount.full_name,
      is_active: true,
      role: defaultAccount.role,
      organization: defaultAccount.organization,
    };
    setUser(initialUser);
    localStorage.setItem("access_token", "mock-token-central_admin");
    localStorage.setItem("synapse_user", JSON.stringify(initialUser));
    localStorage.removeItem("synapse_logged_out");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Backend API first if available
    try {
      const data = await fetchWithAuth("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (data && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        localStorage.removeItem("synapse_logged_out");

        const meData = await fetchWithAuth("/api/v1/users/me");
        const authenticatedUser: UserRead = {
          id: meData.id,
          email: meData.email,
          full_name: meData.full_name,
          is_active: meData.is_active,
          role: meData.role,
          organization: meData.organization || SEEDED_ACCOUNTS[meData.email]?.organization || "SYNAPSE Central",
        };

        setUser(authenticatedUser);
        localStorage.setItem("synapse_user", JSON.stringify(authenticatedUser));
        setLoading(false);
        return;
      }
    } catch {
      // Backend unavailable or rejected, proceed to seeded accounts validation
    }

    // 2. Validate against seeded enterprise accounts
    const seeded = SEEDED_ACCOUNTS[cleanEmail];
    if (seeded && seeded.password === password) {
      const authenticatedUser: UserRead = {
        id: seeded.id,
        email: seeded.email,
        full_name: seeded.full_name,
        is_active: true,
        role: seeded.role,
        organization: seeded.organization,
      };

      localStorage.setItem("access_token", `synapse-auth-${seeded.role}`);
      localStorage.setItem("synapse_user", JSON.stringify(authenticatedUser));
      localStorage.removeItem("synapse_logged_out");

      setUser(authenticatedUser);
      setLoading(false);
      return;
    }

    setLoading(false);
    throw new Error("Invalid email or password. Please verify your credentials.");
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("synapse_user");
      localStorage.setItem("synapse_logged_out", "true");
    }
    setUser(null);
  };

  const refreshUser = fetchMe;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

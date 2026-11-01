"use client";

import React, { useState } from "react";
import { AuthProvider } from "../components/AuthProvider";
import DashboardContent from "./DashboardContent";

export default function Home() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
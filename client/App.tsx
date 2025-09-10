import "./global.css";

import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import Payments from "./pages/Payments";
import InfluencerLogin from "./pages/InfluencerLogin";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import BidManagement from "./pages/BidManagement";
import EvidenceReview from "./pages/EvidenceReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    try {
      const t = localStorage.getItem('theme');
      if (t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {}
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/influencer-login" element={<InfluencerLogin />} />
            <Route
              path="/influencer-dashboard"
              element={<InfluencerDashboard />}
            />
            <Route
              path="/bid-management/:campaignId"
              element={<BidManagement />}
            />
            <Route path="/evidence-review" element={<EvidenceReview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

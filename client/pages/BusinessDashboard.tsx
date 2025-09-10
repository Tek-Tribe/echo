import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Business Dashboard</h1>
            </div>
            <div>
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blank Canvas</h2>
          <p className="text-sm text-gray-600 mb-6">This page has been reset to a minimal scaffold. Provide a new design or requirements and I will implement it.</p>
          <div className="flex items-center justify-center">
            <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Start New Design</Button>
          </div>
        </section>
      </main>
    </div>
  );
}

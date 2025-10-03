import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using EchoX, you agree to these Terms of Service and any additional policies referenced herein. Businesses, influencers, and agencies are jointly referred to as \"Users\". If you are entering into this agreement on behalf of an organisation, you confirm that you have authority to bind the organisation to these terms.",
  },
  {
    title: "2. Platform Access",
    content:
      "EchoX grants a non-transferable licence to use the platform for posting influencer campaigns, submitting bids, managing collaborations, and processing escrow payments. We may suspend access if we detect fraudulent activity, breach of community guidelines, or repeated payment disputes.",
  },
  {
    title: "3. Campaigns & Deliverables",
    content:
      "Businesses are responsible for accurate briefs, legal compliance of creatives, and timely approvals. Influencers must complete agreed deliverables using authentic follower bases and provide performance evidence. EchoX may mediate disputes, but final decisions rest with the contracting parties unless governed by escrow release conditions.",
  },
  {
    title: "4. Payments & Fees",
    content:
      "All collaborations use EchoX escrow. Businesses fund campaigns in INR prior to influencer onboarding. Influencer payouts occur within 5 working days after acceptance of deliverables. Platform service fees are disclosed on every campaign before confirmation.",
  },
  {
    title: "5. Confidentiality & IP",
    content:
      "Creative materials, briefs, analytics, and influencer insights shared through EchoX remain confidential. Influencers grant businesses a limited licence to use published content for the agreed campaign period unless extended in writing. We respect existing brand exclusivity or non-compete clauses communicated ahead of onboarding.",
  },
  {
    title: "6. Termination",
    content:
      "Users may terminate their account at any time. EchoX may terminate or limit access for policy violations, misuse of escrow, fraudulent campaigns, or behaviour that harms marketplace integrity. Outstanding dues at the time of termination remain payable.",
  },
  {
    title: "7. Changes to Terms",
    content:
      "We may update these terms to reflect new features or regulatory requirements. Any material change will be communicated via email and in-app alerts at least 7 days before the change takes effect. Continued use after the effective date constitutes acceptance of the updated terms.",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-gradient-to text-white">
              EX
            </div>
            EchoX Terms of Service
          </Link>
          <Button asChild variant="ghost" className="text-sm font-medium text-brand-700">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            These Terms of Service govern your access to and use of the EchoX influencer collaboration
            platform. Please read them carefully to ensure compliant usage by your organisation or creator
            team.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {termsSections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">{section.title}</h2>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">{section.content}</p>
            </section>
          ))}
        </div>

        <footer className="mt-12 rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand-700">Questions or disputes?</h2>
          <p className="mt-2 text-sm text-brand-700/80 sm:text-base">
            Email <a className="font-medium underline" href="mailto:legal@echox.app">legal@echox.app</a> with your
            registered account details, and our compliance desk will respond within two business days.
          </p>
        </footer>
      </main>
    </div>
  );
}

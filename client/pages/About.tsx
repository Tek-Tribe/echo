import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const milestones = [
  {
    title: "The spark",
    date: "Q1 2023",
    description:
      "WHAC, a collective of consumer brand veterans, and TechTribe, a product engineering studio, aligned on a shared vision: make influencer collaborations predictable, data-rich, and safe for both sides.",
  },
  {
    title: "Joint pilot",
    date: "Q3 2023",
    description:
      "Working with five D2C brands in Kerala, the combined team prototyped campaign bidding flows, verified influencer onboarding, and escrow-backed payouts under one secure platform.",
  },
  {
    title: "EchoX launch",
    date: "April 2024",
    description:
      "WHAC led the go-to-market strategy while TechTribe productionised the stack. Together they launched EchoX with guaranteed reach, transparent pricing, and tools tuned for high-trust collaborations.",
  },
  {
    title: "Scaling responsibly",
    date: "Today",
    description:
      "The partnership continues to co-own the roadmap: WHAC shapes marketplace policy, while TechTribe evolves the product with privacy, automation, and analytics at its core.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-gradient-to text-white">
              EX
            </div>
            About EchoX
          </Link>
          <Button asChild variant="ghost" className="text-sm font-medium text-brand-700">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6 sm:space-y-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Built together by WHAC and TechTribe
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            EchoX is the result of a deep product partnership between <span className="font-semibold text-gray-900">WHAC</span>,
            a growth collective that works with fast-scaling consumer brands, and <span className="font-semibold text-gray-900">TechTribe</span>,
            a product studio specialising in resilient, data-driven SaaS platforms. WHAC brings category insight,
            marketplace governance, and a trusted network of creators. TechTribe anchors the engineering, automation,
            and security layers that make guaranteed reach possible.
          </p>
          <p className="text-base text-gray-600 sm:text-lg">
            Together they designed EchoX to give Indian brands and influencers a transparent collaboration stack:
            verified onboarding, escrow-backed payouts, real-time analytics, and workflows honed for repeatable success.
            Every feature is co-owned—from marketplace playbooks authored by WHAC to the privacy-first infrastructure
            shipped by TechTribe.
          </p>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Milestones</h2>
          <div className="space-y-4 sm:space-y-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.title}
                className="rounded-3xl border border-gray-100 bg-white/85 p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {milestone.date}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600 sm:text-base">{milestone.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brand-700">WHAC at a glance</h2>
            <p className="mt-3 text-sm text-brand-700/80 sm:text-base">
              WHAC coaches consumer brands on positioning, creator partnerships, and go-to-market mechanics. In EchoX they
              curate verified influencers, craft campaign playbooks, and monitor marketplace health.
            </p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brand-700">TechTribe at a glance</h2>
            <p className="mt-3 text-sm text-brand-700/80 sm:text-base">
              TechTribe is a builder collective designing resilient SaaS products. For EchoX they created the secure
              escrow architecture, analytics pipeline, and responsive web experience that powers every campaign interaction.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-gray-100 bg-white/85 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">What comes next</h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            The WHAC × TechTribe partnership continues to iterate on EchoX with roadmap themes around creator analytics,
            AI-assisted campaign briefs, and tighter compliance tooling for regulated categories. If you want to collaborate
            with the core team or join upcoming pilots, reach us at <a className="font-medium text-brand-700 underline" href="mailto:team@echox.app">team@echox.app</a>.
          </p>
        </section>
      </main>
    </div>
  );
}

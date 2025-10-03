import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const milestones = [
  {
    title: "The foundation",
    date: "Q1 2023",
    description:
      "A critical gap existed in the influencer marketing landscape—the lack of transparent, data-driven platforms that could serve both brands and creators equally. TechTribe, a software innovation lab, and WHAC, a digital marketing company, aligned on a shared vision: make influencer collaborations predictable, secure, and mutually beneficial.",
  },
  {
    title: "Joint pilot",
    date: "Q3 2023",
    description:
      "TechTribe and WHAC collaborated with five D2C brands in Kerala to prototype campaign bidding flows, verified influencer onboarding, and escrow-backed payouts. The combined expertise shaped a platform where technology and marketplace insight work hand in hand.",
  },
  {
    title: "EchoX launch",
    date: "April 2024",
    description:
      "TechTribe productionized the entire platform stack while WHAC led the go-to-market strategy. Together, they launched EchoX with guaranteed reach, transparent pricing, and tools built on the strength of their collaboration—where engineering excellence meets marketplace expertise.",
  },
  {
    title: "Scaling together",
    date: "Today",
    description:
      "The partnership thrives through balanced collaboration: TechTribe evolves the product with privacy, automation, and analytics innovation, while WHAC shapes marketplace policy and creator networks. Both partners co-own the roadmap, ensuring EchoX serves all stakeholders equally.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-gradient-to text-white">
              EX
            </div>
            About EchoX
          </Link>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-brand-700"
          >
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-6 sm:space-y-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            EchoX: co-created 50/50 by TechTribe and WHAC
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            EchoX is jointly stewarded by{" "}
            <span className="font-semibold text-gray-900">TechTribe</span>, the
            software innovation lab that delivers resilient, data-driven SaaS
            platforms, and{" "}
            <span className="font-semibold text-gray-900">WHAC</span>, the digital
            marketing company trusted by fast-scaling consumer brands. Each
            organisation contributes its full strength: TechTribe builds and runs
            the engineering, automation, and security stack that powers guaranteed
            reach, while WHAC shapes the category insight, marketplace governance,
            and creator relationships that make the platform thrive.
          </p>
          <p className="text-base text-gray-600 sm:text-lg">
            Together, as equal partners, they designed EchoX to give Indian brands
            and influencers a transparent collaboration stack: verified onboarding,
            escrow-backed payouts, real-time analytics, and workflows honed for
            repeatable success. Every feature is co-owned—TechTribe ships the
            privacy-first infrastructure and product innovation, while WHAC
            authors marketplace playbooks and community standards. The strength
            lies in this balanced partnership.
          </p>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Milestones
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.title}
                className="rounded-3xl border border-gray-100 bg-white/85 p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {milestone.title}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {milestone.date}
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600 sm:text-base">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brand-700">
              TechTribe at a glance
            </h2>
            <p className="mt-3 text-sm text-brand-700/80 sm:text-base">
              TechTribe is a software innovation lab designing resilient,
              data-driven SaaS platforms. For EchoX, they created the secure
              escrow architecture, analytics pipeline, automation layers, and
              responsive web experience that powers every campaign interaction
              with privacy and reliability at its core.
            </p>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-brand-700">
              WHAC at a glance
            </h2>
            <p className="mt-3 text-sm text-brand-700/80 sm:text-base">
              WHAC is a digital marketing company specializing in consumer brand
              growth, creator partnerships, and go-to-market strategies. In EchoX,
              they curate verified influencers, craft campaign playbooks, and
              monitor marketplace health to ensure both brands and creators thrive
              in a trusted environment.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-gray-100 bg-white/85 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            What comes next
          </h2>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            The balanced collaboration between TechTribe and WHAC continues to
            drive EchoX forward with shared roadmap themes around creator
            analytics, AI-assisted campaign briefs, and tighter compliance
            tooling for regulated categories. Our strength lies in combining
            technical innovation with marketplace expertise. If you want to
            collaborate with the core team or join upcoming pilots, reach us at{" "}
            <a
              className="font-medium text-brand-700 underline"
              href="mailto:team@echox.app"
            >
              team@echox.app
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}

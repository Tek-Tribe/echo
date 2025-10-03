import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const milestones = [
  {
    title: "Scaling together",
    date: "Q2 2025",
    description:
      "We begin a nationwide rollout of EchoX, pairing automation upgrades with curated campaign playbooks so every new cohort enjoys guaranteed reach and escrow-backed payouts.",
  },
  {
    title: "Performance labs",
    date: "Q4 2025",
    description:
      "We will launch joint performance labs where EchoX models campaign lift and curates creators, letting brands trial AI-assisted briefs before committing spend.",
  },
  {
    title: "Cross-border pilots",
    date: "H1 2026",
    description:
      "We will expand EchoX to GCC and SEA niches, adapting compliance and payments while preserving the same guaranteed reach promise.",
  },
  {
    title: "Revenue share marketplace",
    date: "H2 2026",
    description:
      "We plan to introduce shared-revenue campaigns so creators and EchoX both participate in upside with transparent dashboards and automated settlements.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <a
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-gradient-to text-white">
              EX
            </div>
            About EchoX
          </a>
          <Button
            asChild
            variant="ghost"
            className="text-sm font-medium text-brand-700"
          >
            <a href="/">Back to home</a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="space-y-5 sm:space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            EchoX
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            EchoX was produced through close collaboration and relentless iteration.
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
      </main>
    </div>
  );
}

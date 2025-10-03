import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Information We Collect",
    description:
      "We collect the information you provide when you create an account, submit campaigns or bids, complete verification, and communicate with our team. This includes contact details, business or influencer profiles, payment preferences, and campaign creative assets.",
    bullets: [
      "Business account information such as company name, designation, billing address, and GST details",
      "Influencer profile information including social handles, audience analytics, and media kits",
      "Usage data from how you browse, message, and collaborate inside the EchoX platform",
      "Payment and payout details required for escrow management and settlements",
    ],
  },
  {
    title: "How We Use Your Data",
    description:
      "EchoX uses your data only to operate, secure, and optimise the campaign marketplace. We never sell personal information. We use aggregated insights to improve bidding recommendations and campaign performance reporting.",
    bullets: [
      "Authenticate users and protect collaboration workspaces",
      "Match businesses with verified influencers based on campaign requirements",
      "Facilitate escrow payments, invoicing, compliance checks, and statutory reporting",
      "Send critical product updates, bid reminders, security alerts, and performance summaries",
    ],
  },
  {
    title: "Data Security & Retention",
    description:
      "We store all production data on encrypted cloud infrastructure located in India with quarterly security audits. Access to sensitive data is limited to authorised EchoX operations personnel under strict confidentiality agreements.",
    bullets: [
      "Transport Layer Security (TLS 1.2+) for all web and API traffic",
      "Periodic data backups with hashed identifiers and anonymised analytics",
      "Retention of account data for 24 months after the last activity unless deletion is requested",
      "Dedicated incident response processes for suspected breaches or fraud",
    ],
  },
  {
    title: "Your Choices",
    description:
      "You can update profile details, export campaign history, or request deletion at any time by contacting support@echox.app. When a deletion request is verified, we remove personal data except where statutory financial retention is required.",
    bullets: [
      "Update account details from your dashboard settings",
      "Request data export in a structured CSV or JSON format",
      "Configure notification preferences from the communications centre",
      "Raise privacy questions by emailing support@echox.app",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-gradient-to text-white">
              EX
            </div>
            EchoX Privacy Policy
          </Link>
          <Button asChild variant="ghost" className="text-sm font-medium text-brand-700">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            EchoX is committed to protecting the privacy of every creator and brand collaborating on our
            platform. This policy explains the information we collect, why we collect it, and how you can
            control your data while using EchoX services across web and mobile interfaces.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-[26px]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm text-gray-600 sm:text-base">{section.description}</p>
              <ul className="mt-5 space-y-3 text-sm text-gray-600 sm:text-base">
                {section.bullets.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="mt-12 rounded-3xl border border-brand-100 bg-brand-50/60 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand-700">
            Need clarifications?
          </h2>
          <p className="mt-2 text-sm text-brand-700/80 sm:text-base">
            Contact our privacy desk at <a className="font-medium underline" href="mailto:support@echox.app">support@echox.app</a>
            for questions about data rights, compliance, or GDPR requests.
          </p>
        </footer>
      </main>
    </div>
  );
}

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

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
        <section className="space-y-5 sm:space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            EchoX
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            EchoX was produced through the close collaboration of TechTribe and WHAC.
          </p>
        </section>

        <section className="mt-10 space-y-3 sm:space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Joint pilot</h2>
          <p className="text-base text-gray-600 sm:text-lg">
            As EchoX we collaborated to validate the model and deliver value hand in hand.
          </p>
        </section>
      </main>
    </div>
  );
}

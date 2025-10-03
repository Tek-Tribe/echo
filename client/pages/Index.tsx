import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Shield,
  Zap,
  Smartphone,
  Star,
  ArrowRight,
  Menu,
  X,
  Clock3,
  Target,
} from "lucide-react";
import { EchoCoinIcon } from "@/components/EchoCoinIcon";
import { useState } from "react";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const highlightedBids = [
    {
      initials: "AR",
      name: "Aditi Rao",
      handle: "@aditirao",
      reach: "82K reach • Lifestyle",
      amount: "₹32,500",
      status: "In review",
      badgeClass: "bg-emerald-50 text-emerald-600",
      avatarClass: "bg-emerald-500/10 text-emerald-700",
    },
    {
      initials: "MK",
      name: "Manish Khanna",
      handle: "@khannafit",
      reach: "120K reach • Fitness",
      amount: "₹35,800",
      status: "Shortlisted",
      badgeClass: "bg-brand-50 text-brand-700",
      avatarClass: "bg-brand-500/10 text-brand-700",
    },
    {
      initials: "SJ",
      name: "Sonal Jain",
      handle: "@sonalstyles",
      reach: "64K reach • Fashion",
      amount: "₹30,600",
      status: "Awaiting deck",
      badgeClass: "bg-amber-50 text-amber-700",
      avatarClass: "bg-amber-500/10 text-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">EchoX</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-brand-600 px-3 py-2 text-sm font-medium"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-brand-600 px-3 py-2 text-sm font-medium"
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-brand-600 px-3 py-2 text-sm font-medium"
                >
                  Pricing
                </a>
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-600"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-600"
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-brand-600"
                >
                  Pricing
                </a>
                <div className="pt-4 pb-2 space-y-2">
                  <Link to="/login" className="block">
                    <Button className="w-full">Login</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-gradient-to/10 py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Launch Campaigns With
                <span className="bg-gradient-to-r from-brand-600 to-gradient-to bg-clip-text text-transparent">
                  {" "}
                  Verified Influencers
                </span>
                <br />
                And Guaranteed Reach
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
                EchoX connects you with quality influencers and guarantees your
                campaign reaches the target number of users. Post campaigns,
                receive bids, and track your reach.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col gap-3">
                <Link to="/register/business" className="w-full">
                  <Button
                    size="lg"
                    className="w-full max-w-[800px] sm:w-auto sm:min-w-[320px] bg-brand-600 hover:bg-brand-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
                  >
                    Start your campaigns
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to="/partner" className="w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full max-w-[800px] sm:w-auto sm:min-w-[400px] border-white text-brand-700 hover:bg-white/10 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center justify-center text-center whitespace-normal break-words leading-normal"
                  >
                    I’m an Influencer – I’m Interested 🙌
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mt-8 sm:mt-10 lg:mt-0 lg:ml-auto">
              <div className="absolute -top-12 -right-8 h-28 w-28 rounded-full bg-gradient-to-br from-brand-400/40 to-gradient-to/40 blur-2xl"></div>
              <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-brand-300/40 to-brand-500/30 blur-3xl"></div>
              <div className="relative z-10 mx-4 sm:mx-0 lg:max-w-xl">
                <div className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur sm:p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600/90">
                          Live campaign
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-gray-900 sm:text-2xl">
                          #EFX-104 Summer Hydration Push
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Managed by GlowUp Beverages • Instagram
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                        Story reshare
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-brand-50/60 p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-700/90">
                          <Target className="h-3.5 w-3.5" />
                          Guaranteed reach
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-brand-900">
                          150K
                        </div>
                        <p className="mt-1 text-xs text-brand-600">
                          Minimum reach commitment or platform credits you back.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          <Clock3 className="h-3.5 w-3.5 text-brand-600" />
                          Timeline
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-2xl font-semibold text-gray-900">
                            3 days
                          </span>
                          <span className="text-xs text-gray-500">
                            to launch
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Bids close 18 Jul • Content live 20 Jul
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white/85 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Budget locked
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-gray-900">
                            ₹2,40,000
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-brand-600">
                          Escrow secured
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">
                            Influencers needed
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            5
                          </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">Applications</p>
                          <p className="text-lg font-semibold text-gray-900">
                            23
                          </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-3">
                          <p className="text-xs text-gray-500">Avg. bid</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹31,800
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Highlighted bids
                        </h4>
                        <span className="text-xs font-semibold text-brand-600">
                          Auto-vetted
                        </span>
                      </div>
                      <div className="mt-3 space-y-3">
                        {highlightedBids.map((bid) => (
                          <div
                            key={bid.handle}
                            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-sm sm:p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${bid.avatarClass}`}
                              >
                                {bid.initials}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {bid.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {bid.handle}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {bid.reach}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="block text-sm font-semibold text-gray-900">
                                {bid.amount}
                              </span>
                              <span
                                className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${bid.badgeClass}`}
                              >
                                {bid.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 left-6 hidden sm:flex flex-col rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <Clock3 className="h-3.5 w-3.5 text-brand-600" />
                    Bids closing in
                  </div>
                  <span className="mt-1 text-lg font-semibold text-gray-900">
                    02h 36m
                  </span>
                  <p className="text-xs text-gray-500">
                    Auto reminders sent to shortlisted creators
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need for Successful Campaigns
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From campaign posting to payment processing, Echo handles every
              aspect of influencer marketing
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-brand-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  Verified Influencers
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Connect with quality, verified influencers across all niches
                  and audiences
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Guaranteed Reach
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We guarantee your campaign reaches the target number of users
                  you specify
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <EchoCoinIcon className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Secure Payments
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Built-in wallet system ensures influencers get paid quickly
                  after campaign completion
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Zap className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Flexible Pricing
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Pay per campaign or subscribe yearly for unlimited campaigns
                  at a discounted rate
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Smartphone className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Easy Campaign Management
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Post campaigns, review bids, select influencers, and track
                  reach all in one place
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Star className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Quality Control
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Rate and review system helps maintain high standards and build
                  long-term partnerships
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              How EchoX Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Simple, transparent process from campaign creation to completion
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-500 to-gradient-to rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  1
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Post Your Campaign
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Define your campaign goals, target reach, and budget
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-500 to-gradient-to rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  2
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Receive Bids
              </h3>
              <p className="text-gray-600">
                Verified influencers submit proposals to join your campaign
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-500 to-gradient-to rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  3
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Select Influencers
              </h3>
              <p className="text-gray-600">
                Review proposals and choose the best influencers for your brand
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-500 to-gradient-to rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  4
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Track Guaranteed Reach
              </h3>
              <p className="text-gray-600">
                Monitor campaign progress and get guaranteed reach to your
                target users
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-brand-600 to-gradient-to">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Amplify Your Brand?
          </h2>
          <p className="text-lg sm:text-xl text-brand-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Start guaranteed campaigns hassle free via verified influencers
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to="/register/business"
              className="w-full max-w-xl sm:max-w-none sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full max-w-[800px] sm:w-auto sm:min-w-[320px] bg-white text-brand-600 hover:bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
              >
                Start Your First Campaign
              </Button>
            </Link>
            <Link
              to="/partner"
              className="w-full max-w-xl sm:max-w-none sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full max-w-[800px] sm:w-auto sm:min-w-[400px] border-white text-brand-700 hover:bg-white/10 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg flex items-center justify-center text-center whitespace-normal break-words leading-normal"
              >
                I’m an Influencer – I’m Interested 🙌
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">
                    E
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-bold">EchoX</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Connecting businesses with influencers for authentic social
                media collaborations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Platform
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link
                    to="/business-registration"
                    className="hover:text-white"
                  >
                    For Businesses
                  </Link>
                </li>
                <li>
                  <Link to="/partner" className="hover:text-white">
                    For Influencers
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Support
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Company
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">
              &copy; 2025 EchoX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

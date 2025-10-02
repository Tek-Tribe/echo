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
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { EchoCoinIcon } from "@/components/EchoCoinIcon";
import { useState } from "react";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <Link to="/influencer-login">
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
                  <Link to="/influencer-login" className="block">
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
                Start your
                <span className="bg-gradient-to-r from-brand-600 to-gradient-to bg-clip-text text-transparent">
                  {" "}
                  Campaigns
                </span>
                <br />
                With verified influencers who Amplify Your Brand
              </h1>
              <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
                EchoX bridges businesses and influencers through a seamless
                platform for social media collaborations. Post jobs, get bids,
                and watch your brand reach new heights.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/business-registration" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
                  >
                    Start your campaigns
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <Link to="/influencer-login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-brand-200 text-brand-700 hover:bg-brand-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg whitespace-normal text-center leading-snug"
                  >
                    I’m an Influencer – I’m Interested 🙌
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mt-8 sm:mt-10 lg:mt-0 lg:-translate-y-2 xl:-translate-y-4 2xl:-translate-y-8 lg:ml-auto">
              <div className="relative z-10 mx-4 overflow-hidden rounded-[32px] shadow-2xl ring-1 ring-black/10 bg-white/80 backdrop-blur-sm sm:mx-0 lg:max-w-xl lg:max-h-[520px]">
                <img
                  src="/new-campaign-card.svg"
                  alt="Preview of a new Instagram reshare campaign in EchoX"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute -top-2 -right-2 sm:-top-4 sm:-right-4 h-16 w-16 rounded-full bg-gradient-to-br from-brand-400 to-gradient-to opacity-20 sm:h-24 sm:w-24"></div>
              <div className="pointer-events-none absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 h-20 w-20 rounded-full bg-gradient-to-br from-gradient-to to-brand-400 opacity-10 sm:h-32 sm:w-32"></div>
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
                  Smart Matching
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Our algorithm connects you with influencers who match your
                  brand values and target audience
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Verified Content
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Every campaign includes proof of posting with screenshots and
                  links for complete transparency
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
                  Quick Setup
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Launch your first campaign in minutes with our intuitive job
                  posting interface
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Smartphone className="h-8 w-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Mobile First
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Designed for the mobile generation - influencers can bid and
                  manage campaigns on the go
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
                Create a campaign with details about your brand, requirements,
                and budget
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
                Qualified influencers submit their proposals with custom pricing
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-500 to-gradient-to rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  3
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Select & Confirm
              </h3>
              <p className="text-gray-600">
                Choose your preferred influencers and they confirm their
                participation
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-500 to-gradient-to rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  4
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Verify & Complete
              </h3>
              <p className="text-gray-600">
                Review proof of posting, approve the work, and payments are
                processed automatically
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
            Join thousands of businesses and influencers who trust EchoX for
            their marketing collaborations
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/business-registration" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-brand-600 hover:bg-gray-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg"
              >
                Start Your First Campaign
              </Button>
            </Link>
            <Link to="/influencer-login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg whitespace-normal text-center leading-snug"
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
                  <Link to="/influencer-login" className="hover:text-white">
                    For Influencers
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
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

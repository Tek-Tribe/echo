import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Instagram, Twitter, Youtube, Video } from "lucide-react";

export default function InfluencerLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-gradient-to/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Echo</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back, Influencer!
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Sign in to access your campaigns and earnings
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-lg sm:text-xl">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <Link to="/influencer-dashboard" className="w-full">
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 text-sm sm:text-base">
                  Sign In
                </Button>
              </Link>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 py-3 text-xs sm:text-sm"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="hidden sm:inline">Instagram</span>
                  <span className="sm:hidden">IG</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 py-3 text-xs sm:text-sm"
                >
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">TikTok</span>
                  <span className="sm:hidden">TT</span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-brand-600 hover:text-brand-500"
                  >
                    Sign up here
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center px-4">
            <p className="text-xs sm:text-sm text-gray-500">
              🚧 This is a placeholder page. Continue prompting to have this
              functionality implemented!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

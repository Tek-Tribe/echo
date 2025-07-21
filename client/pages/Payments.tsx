import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  LogOut,
  ChevronDown,
  Menu,
  X,
  CreditCard,
  Receipt,
  Download,
  Filter,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EchoCoinIcon } from "@/components/EchoCoinIcon";

export default function Payments() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalEchoCoins = 12000;

  const transactions = [
    {
      id: 1,
      campaign: "Instagram Story Repost",
      influencer: "Sarah Fitness",
      amount: 350,
      date: "2024-01-20",
      status: "completed",
    },
    {
      id: 2,
      campaign: "Product Review Video",
      influencer: "Mike Strong",
      amount: 1200,
      date: "2024-01-19",
      status: "pending",
    },
    {
      id: 3,
      campaign: "Brand Awareness Post",
      influencer: "Emma Wellness",
      amount: 450,
      date: "2024-01-18",
      status: "completed",
    },
    {
      id: 4,
      campaign: "Summer Collection Launch",
      influencer: "Alex Style",
      amount: 800,
      date: "2024-01-17",
      status: "processing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-1 min-w-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Echo</span>
              </Link>
              <nav className="hidden md:flex ml-8 space-x-8">
                <Link
                  to="/business-dashboard"
                  className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium"
                >
                  Analytics
                </Link>
                <span className="text-brand-600 border-b-2 border-brand-600 pb-4 text-sm font-medium">
                  Payments
                </span>
              </nav>
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
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        BC
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      Business Admin
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/business-dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/analytics"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-700"
                >
                  Analytics
                </Link>
                <span className="block px-3 py-2 text-base font-medium text-brand-600">
                  Payments
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Payments Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Payments & Billing
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your payments and billing information
          </p>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <EchoCoinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Total Spent
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    {totalEchoCoins.toLocaleString()} EC
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Pending Payments
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    4,200 EC
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    This Month
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    8,700 EC
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Avg. Payment Time
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    2.4 days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl">
                Recent Transactions
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg gap-2"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {transaction.campaign}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Payment to {transaction.influencer}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {transaction.amount} EC
                      </div>
                    </div>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      •••• •••• •••• 4242
                    </h4>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

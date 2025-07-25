import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  UserPlus,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
} from "lucide-react";
import { EchoCoinIcon } from "@/components/EchoCoinIcon";

export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'campaigns' | 'earnings' | 'reports'>('overview');

  // Sample data
  const platformStats = {
    totalUsers: 12547,
    totalCreators: 3421,
    totalBusinesses: 892,
    activeCampaigns: 156,
    totalEarnings: 2847356,
    monthlyGrowth: 15.3,
    pendingApprovals: 23,
  };

  const pendingCreators = [
    {
      id: "1",
      name: "Alex Johnson",
      handle: "@alexjohnson",
      email: "alex@example.com",
      followers: 45000,
      engagement: 6.8,
      category: "Fitness",
      submittedAt: "2024-01-22",
      status: "pending",
    },
    {
      id: "2", 
      name: "Maya Rodriguez",
      handle: "@mayarodriguez",
      email: "maya@example.com",
      followers: 78000,
      engagement: 8.2,
      category: "Fashion",
      submittedAt: "2024-01-21",
      status: "pending",
    },
    {
      id: "3",
      name: "David Chen",
      handle: "@davidchen",
      email: "david@example.com",
      followers: 32000,
      engagement: 5.4,
      category: "Tech",
      submittedAt: "2024-01-20",
      status: "pending",
    },
  ];

  const recentCampaigns = [
    {
      id: "1",
      title: "Instagram Story Repost Campaign",
      business: "FitnessNutrition Co.",
      echoCoins: 2500,
      influencers: 5,
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      title: "Product Review Video",
      business: "TechWear",
      echoCoins: 5000,
      influencers: 3,
      status: "completed",
      createdAt: "2024-01-18",
    },
    {
      id: "3",
      title: "Brand Ambassador Program",
      business: "EcoStyle",
      echoCoins: 8000,
      influencers: 8,
      status: "active",
      createdAt: "2024-01-15",
    },
  ];

  const earningsData = [
    { month: "January", revenue: 245000, commissions: 12250, growth: "+12%" },
    { month: "December", revenue: 218000, commissions: 10900, growth: "+8%" },
    { month: "November", revenue: 201000, commissions: 10050, growth: "+15%" },
    { month: "October", revenue: 175000, commissions: 8750, growth: "+9%" },
  ];

  const handleApproveCreator = (creatorId: string) => {
    console.log("Approved creator:", creatorId);
  };

  const handleRejectCreator = (creatorId: string) => {
    console.log("Rejected creator:", creatorId);
  };

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
              <div className="ml-4">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </div>
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
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-red-600">
                        AD
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      Admin User
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Admin Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
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
                <span className="block px-3 py-2 text-base font-medium text-brand-600">
                  Admin Dashboard
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Monitor and manage the Echo platform
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Total Users
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    {platformStats.totalUsers.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Content Creators
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    {platformStats.totalCreators.toLocaleString()}
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
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Active Campaigns
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    {platformStats.activeCampaigns}
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
                    <EchoCoinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-500">
                    Total Earnings
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">
                    {(platformStats.totalEarnings / 1000000).toFixed(1)}M EC
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="creators" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2">
              Creators
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl">
                    Pending Approvals
                  </CardTitle>
                  <Badge className="bg-orange-100 text-orange-800">
                    {platformStats.pendingApprovals} pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingCreators.slice(0, 3).map((creator) => (
                    <div key={creator.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{creator.name}</h4>
                          <p className="text-sm text-gray-600">{creator.handle} • {creator.category}</p>
                          <p className="text-xs text-gray-500">{creator.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveCreator(creator.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectCreator(creator.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCampaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{campaign.title}</h4>
                          <p className="text-xs text-gray-600">{campaign.business}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">{campaign.echoCoins} EC</div>
                          <Badge 
                            variant={campaign.status === "active" ? "default" : "secondary"}
                            className={campaign.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Growth</span>
                      <span className="font-semibold text-green-600">+{platformStats.monthlyGrowth}%</span>
                    </div>
                    <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="creators" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">Content Creator Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search creators..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingCreators.map((creator) => (
                    <div key={creator.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">{creator.name}</h4>
                            <p className="text-sm text-gray-600">{creator.handle}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {creator.email}
                              </span>
                              <span>{creator.followers.toLocaleString()} followers</span>
                              <span>{creator.engagement}% engagement</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{creator.category}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleApproveCreator(creator.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRejectCreator(creator.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">Campaign Monitoring</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Range
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
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                          <p className="text-sm text-gray-600">by {campaign.business}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span>{campaign.echoCoins} EC budget</span>
                            <span>{campaign.influencers} influencers</span>
                            <span>Created {campaign.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={campaign.status === "active" ? "default" : "secondary"}
                            className={
                              campaign.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {campaign.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Platform Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{data.month}</h4>
                        <p className="text-sm text-gray-600">Platform Revenue</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{data.revenue.toLocaleString()} EC</div>
                        <div className="text-sm text-gray-600">Commission: {data.commissions.toLocaleString()} EC</div>
                        <div className="text-xs text-green-600">{data.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">System Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      User Activity Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Revenue Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Creator Performance
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start bg-brand-600 hover:bg-brand-700 text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Bulk Approve Creators
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Platform Update
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      System Maintenance
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency Actions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

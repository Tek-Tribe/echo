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
      {/* Header - Mobile App Optimized */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center flex-1 min-w-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">E</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">Echo</span>
              </Link>
              <div className="ml-2 sm:ml-4">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
                  <Shield className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Dashboard Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Monitor and manage the Echo platform
          </p>
        </div>

        {/* Overview Stats - Mobile First Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </div>
                <div className="sm:ml-3">
                  <div className="text-xs font-medium text-gray-500 truncate">
                    Total Users
                  </div>
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {(platformStats.totalUsers / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  </div>
                </div>
                <div className="sm:ml-3">
                  <div className="text-xs font-medium text-gray-500 truncate">
                    Creators
                  </div>
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {(platformStats.totalCreators / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                </div>
                <div className="sm:ml-3">
                  <div className="text-xs font-medium text-gray-500 truncate">
                    Campaigns
                  </div>
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {platformStats.activeCampaigns}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
                <div className="flex-shrink-0 mb-2 sm:mb-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                    <EchoCoinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="sm:ml-3">
                  <div className="text-xs font-medium text-gray-500 truncate">
                    Earnings
                  </div>
                  <div className="text-base sm:text-lg font-bold text-gray-900">
                    {(platformStats.totalEarnings / 1000000).toFixed(1)}M EC
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - Mobile Optimized */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 h-12 min-w-max">
              <TabsTrigger value="overview" className="text-xs px-3 py-2 whitespace-nowrap">
                Overview
              </TabsTrigger>
              <TabsTrigger value="creators" className="text-xs px-3 py-2 whitespace-nowrap">
                Creators
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="text-xs px-3 py-2 whitespace-nowrap">
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="earnings" className="text-xs px-3 py-2 whitespace-nowrap">
                Earnings
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs px-3 py-2 whitespace-nowrap">
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">
                    Pending Approvals
                  </CardTitle>
                  <Badge className="bg-orange-100 text-orange-800">
                    {platformStats.pendingApprovals} pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingCreators.slice(0, 3).map((creator) => (
                    <div key={creator.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{creator.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{creator.handle} • {creator.category}</p>
                          <p className="text-xs text-gray-500">{(creator.followers / 1000).toFixed(0)}K followers</p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          onClick={() => handleApproveCreator(creator.id)}
                          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectCreator(creator.id)}
                          className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 text-xs h-8"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-xs truncate">{campaign.title}</h4>
                        <p className="text-xs text-gray-600 truncate">{campaign.business}</p>
                      </div>
                      <div className="text-right ml-2">
                        <div className="font-semibold text-xs">{(campaign.echoCoins / 1000).toFixed(1)}K EC</div>
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className={`text-xs ${campaign.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
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
                  <CardTitle className="text-base sm:text-lg">Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Monthly Growth</span>
                      <span className="font-semibold text-green-600">+{platformStats.monthlyGrowth}%</span>
                    </div>
                    <div className="h-24 sm:h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="creators" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-base sm:text-lg">Content Creator Management</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search creators..." className="pl-9 h-9" />
                    </div>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingCreators.map((creator) => (
                    <div key={creator.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm truncate">{creator.name}</h4>
                              <p className="text-xs text-gray-600 truncate">{creator.handle}</p>
                              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate max-w-24">{creator.email}</span>
                                </span>
                                <span>{(creator.followers / 1000).toFixed(0)}K followers</span>
                                <span>{creator.engagement}% engagement</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="text-xs">{creator.category}</Badge>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-base sm:text-lg">Campaign Monitoring</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-9">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Range
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-9">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{campaign.title}</h4>
                          <p className="text-xs text-gray-600 truncate">by {campaign.business}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                            <span>{(campaign.echoCoins / 1000).toFixed(1)}K EC</span>
                            <span>{campaign.influencers} influencers</span>
                            <span>Created {campaign.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            variant={campaign.status === "active" ? "default" : "secondary"}
                            className={`text-xs ${
                              campaign.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {campaign.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
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

          <TabsContent value="earnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Platform Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earningsData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{data.month}</h4>
                        <p className="text-xs text-gray-600">Platform Revenue</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 text-sm">{(data.revenue / 1000).toFixed(0)}K EC</div>
                        <div className="text-xs text-gray-600">Commission: {(data.commissions / 1000).toFixed(1)}K EC</div>
                        <div className="text-xs text-green-600">{data.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">System Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start h-10 text-sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      User Activity Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-10 text-sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Revenue Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-10 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      Creator Performance
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-10 text-sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start bg-brand-600 hover:bg-brand-700 text-white h-10 text-sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Bulk Approve Creators
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-10 text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Platform Update
                    </Button>
                    <Button variant="outline" className="w-full justify-start h-10 text-sm">
                      <Settings className="h-4 w-4 mr-2" />
                      System Maintenance
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 h-10 text-sm">
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

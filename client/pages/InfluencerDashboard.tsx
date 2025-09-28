import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  TrendingUp,
  Clock,
  Star,
  Eye,
  Heart,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  Target,
  LogOut,
  ChevronDown,
  Upload,
  Camera,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { EchoCoinIcon } from "@/components/EchoCoinIcon";

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: string;
  echoCoinRange: { min: number; max: number };
  maxInfluencers: number;
  currentBids: number;
  deadline: string;
  requirements: {
    minFollowers: number;
    categories: string[];
    platforms: string[];
  };
  businessName: string;
  businessLogo: string;
  status: "open" | "in-review" | "closed";
}

interface Bid {
  id: string;
  campaignId: string;
  campaignTitle: string;
  echoCoins: number;
  proposal: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
}

interface ActiveCampaign {
  id: string;
  title: string;
  businessName: string;
  type: string;
  echoCoins: number;
  deadline: string;
  requirements: string;
  status: "in-progress" | "awaiting-review" | "completed";
  evidenceSubmitted?: {
    screenshots: string[];
    links: string[];
    description: string;
    submittedAt: string;
  };
}

interface InfluencerProfile {
  id: string;
  name: string;
  email: string;
  followers: number;
  categories: string[];
  platforms: string[];
}

export default function InfluencerDashboard() {
  // App view state
  const [view, setView] = useState<"dashboard" | "settings">("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light",
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Demo influencer profile for matching logic
  const [me, setMe] = useState<InfluencerProfile>({
    id: "i1",
    name: "Jane Doe",
    email: "jane@example.com",
    followers: 45000,
    categories: ["Fitness", "Lifestyle"],
    platforms: ["Instagram", "TikTok"],
  });

  // Header/mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Campaigns and bids
  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Instagram Story Repost Campaign",
      description:
        "We need fitness influencers to repost our new protein powder launch story. Must include our branded hashtag #FuelYourGoals and tag our account @FitnessNutrition.",
      type: "Story Repost",
      echoCoinRange: { min: 200, max: 500 },
      maxInfluencers: 5,
      currentBids: 23,
      deadline: "2024-01-25",
      requirements: {
        minFollowers: 10000,
        categories: ["Fitness", "Health"],
        platforms: ["Instagram"],
      },
      businessName: "FitnessNutrition Co.",
      businessLogo: "/placeholder.svg",
      status: "open",
    },
    {
      id: "2",
      title: "Product Review Video",
      description:
        "Create an authentic unboxing and review video for our new smartwatch. Video should be 60-90 seconds, highlight key features, and show genuine reactions.",
      type: "Video Creation",
      echoCoinRange: { min: 800, max: 1500 },
      maxInfluencers: 3,
      currentBids: 12,
      deadline: "2024-01-30",
      requirements: {
        minFollowers: 50000,
        categories: ["Technology", "Lifestyle"],
        platforms: ["Instagram", "TikTok"],
      },
      businessName: "TechWear",
      businessLogo: "/placeholder.svg",
      status: "open",
    },
    {
      id: "3",
      title: "Brand Ambassador Program",
      description:
        "Long-term partnership opportunity for fashion influencers. Monthly posts featuring our sustainable clothing line with creative freedom in styling.",
      type: "Brand Partnership",
      echoCoinRange: { min: 1000, max: 2000 },
      maxInfluencers: 8,
      currentBids: 45,
      deadline: "2024-02-05",
      requirements: {
        minFollowers: 25000,
        categories: ["Fashion", "Sustainability"],
        platforms: ["Instagram"],
      },
      businessName: "EcoStyle",
      businessLogo: "/placeholder.svg",
      status: "open",
    },
  ]);

  const matchingCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const meetsFollowers = me.followers >= c.requirements.minFollowers;
      const matchesCategory = c.requirements.categories.some((cat) =>
        me.categories.includes(cat),
      );
      const matchesPlatform = c.requirements.platforms.some((p) =>
        me.platforms.includes(p),
      );
      return meetsFollowers && matchesCategory && matchesPlatform && c.status === "open";
    });
  }, [campaigns, me]);

  const [myBids] = useState<Bid[]>([
    {
      id: "1",
      campaignId: "1",
      campaignTitle: "Instagram Story Repost Campaign",
      echoCoins: 350,
      proposal:
        "I have 15K engaged followers in the fitness niche with 8% avg engagement. My audience is 70% female, ages 18-35, perfect for your target market.",
      status: "pending",
      submittedAt: "2024-01-18",
    },
    {
      id: "2",
      campaignId: "2",
      campaignTitle: "Product Review Video",
      echoCoins: 1200,
      proposal:
        "Tech reviewer with 65K followers. I specialize in honest product reviews and have worked with similar brands like Apple and Samsung.",
      status: "accepted",
      submittedAt: "2024-01-15",
    },
  ]);

  const [activeCampaigns] = useState<ActiveCampaign[]>([
    {
      id: "2",
      title: "Product Review Video",
      businessName: "TechWear",
      type: "Video Creation",
      echoCoins: 1200,
      deadline: "2024-01-30",
      requirements:
        "Create a 60-90 second unboxing and review video highlighting key features",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Fitness Supplement Review",
      businessName: "FitnessNutrition Co.",
      type: "Feed Post",
      echoCoins: 450,
      deadline: "2024-01-28",
      requirements:
        "Create an authentic post about your experience with our protein powder",
      status: "awaiting-review",
      evidenceSubmitted: {
        screenshots: ["/placeholder.svg"],
        links: ["https://instagram.com/p/example123"],
        description:
          "Posted on my main feed with authentic review. Received great engagement from my fitness community.",
        submittedAt: "2024-01-20",
      },
    },
    {
      id: "4",
      title: "Ambassador Post",
      businessName: "EcoStyle",
      type: "Brand Partnership",
      echoCoins: 1600,
      deadline: "2023-12-20",
      requirements: "Monthly post with styling freedom",
      status: "completed",
    },
  ]);

  const inProgressCampaigns = activeCampaigns.filter(
    (c) => c.status === "in-progress" || c.status === "awaiting-review",
  );
  const completedCampaigns = activeCampaigns.filter(
    (c) => c.status === "completed",
  );

  // Bid/Evidence modals
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidEchoCoins, setBidEchoCoins] = useState("");

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedActiveCampaign, setSelectedActiveCampaign] =
    useState<ActiveCampaign | null>(null);
  const [evidenceLinks, setEvidenceLinks] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");

  const handleSubmitBid = () => {
    setShowBidModal(false);
    setBidEchoCoins("");
    
    setSelectedCampaign(null);
  };

  const handleSubmitEvidence = () => {
    setShowEvidenceModal(false);
    setEvidenceLinks("");
    setEvidenceDescription("");
    setSelectedActiveCampaign(null);
  };

  // Wallet state
  const [wallet] = useState({
    balance: 2150,
    pending: 450,
    withdrawn: 3200,
    transactions: [
      { id: "t1", type: "credit", amount: 1200, note: "TechWear - Video Review", date: "2024-01-10" },
      { id: "t2", type: "debit", amount: 500, note: "Withdrawal", date: "2024-01-12" },
      { id: "t3", type: "credit", amount: 450, note: "FitnessNutrition - Feed Post", date: "2024-01-20" },
    ] as { id: string; type: "credit" | "debit"; amount: number; note: string; date: string }[],
  });

  const influencerStats = {
    totalEarnings: wallet.withdrawn + wallet.balance,
    activeCampaigns: inProgressCampaigns.length,
    completedCampaigns: completedCampaigns.length,
    averageRating: 4.8,
    followers: me.followers,
    engagement: 6.2,
  };

  // Settings state
  const [account, setAccount] = useState({
    name: me.name,
    email: me.email,
    password: "",
  });
  const [platform, setPlatform] = useState({
    currency: "INR",
    timezone: "UTC",
  });

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
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {me.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center gap-2" onClick={() => setView("settings")}> 
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center gap-2 text-red-600">
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
                <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-700" onClick={() => setView("settings")}>
                  Settings
                </a>
                <Link to="/" className="block px-3 py-2 text-base font-medium text-red-600">
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {view === "dashboard" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Dashboard Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Influencer Dashboard</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Discover campaigns and grow your influence</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                      <EchoCoinIcon className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="sm:ml-4 text-center sm:text-left min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Earnings</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{influencerStats.totalEarnings.toLocaleString()} INR</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-brand-100 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                      <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-brand-600" />
                    </div>
                  </div>
                  <div className="sm:ml-4 text-center sm:text-left min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Campaigns</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{influencerStats.activeCampaigns}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Completed</div>
                    <div className="text-2xl font-bold text-gray-900">{influencerStats.completedCampaigns}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Rating</div>
                    <div className="text-2xl font-bold text-gray-900">{influencerStats.averageRating}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Engagement</div>
                    <div className="text-2xl font-bold text-gray-900">{influencerStats.engagement}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="campaigns" className="space-y-4 sm:space-y-6">

            <TabsList className="grid w-full grid-cols-2 h-auto">
              <TabsTrigger value="campaigns" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2">Campaigns</TabsTrigger>
              <TabsTrigger value="bids" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2">Submitted Bids</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Campaigns</h2>
                <Button variant="outline" className="flex items-center gap-2 self-start sm:self-auto">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {campaigns.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-gray-600">No matching campaigns right now. Check back soon.</CardContent>
                  </Card>
                )}
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarImage src={campaign.businessLogo} />
                            <AvatarFallback>{campaign.businessName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{campaign.title}</h3>
                            <p className="text-sm text-gray-500">{campaign.businessName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-start">
                          <Badge variant="outline" className="self-start">
                            <Target className="h-3 w-3 mr-1" />
                            {campaign.type}
                          </Badge>
                          <Badge className={campaign.status === "open" ? "bg-green-100 text-green-800" : campaign.status === "in-review" ? "bg-yellow-100 text-yellow-800" : "bg-gray-200 text-gray-700"}>
                            {campaign.status === "in-review" ? "In Review" : campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-gray-600 mb-4">{campaign.description}</p>

                      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Budget Range:</span>
                            <span className="font-semibold text-gray-900">{campaign.echoCoinRange.min} - {campaign.echoCoinRange.max} INR</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Max Influencers:</span>
                            <span className="font-semibold text-gray-900">{campaign.maxInfluencers}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Current Bids:</span>
                            <span className="font-semibold text-brand-600">{campaign.currentBids}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Min Followers:</span>
                            <span className="font-semibold text-gray-900">{(campaign.requirements.minFollowers / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Deadline:</span>
                            <span className="font-semibold text-gray-900">{new Date(campaign.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Platforms:</span>
                            <div className="flex gap-1">
                              {campaign.requirements.platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs">{platform}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {campaign.requirements.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">{category}</Badge>
                          ))}
                        </div>
                        {campaign.status === "open" ? (
                          <Button
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setShowBidModal(true);
                            }}
                            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-sm"
                          >
                            Submit Bid
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button variant="outline" disabled className="w-full sm:w-auto">Bidding Closed</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bids" className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Submitted Bids</h2>

              <div className="space-y-3 sm:space-y-4">
                {myBids.map((bid) => (
                  <Card key={bid.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{bid.campaignTitle}</h3>
                        <Badge
                          variant={
                            bid.status === "accepted"
                              ? "default"
                              : bid.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className={
                            bid.status === "accepted"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : bid.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : ""
                          }
                        >
                          {bid.status === "accepted" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {bid.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {bid.status === "rejected" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">{bid.proposal}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                        <span className="font-semibold text-gray-900">Bid Amount: {bid.echoCoins} INR</span>
                        <span className="text-gray-500">Submitted {new Date(bid.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>


          </Tabs>
        </div>
      )}

      {view === "settings" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Button variant="outline" onClick={() => setView("dashboard")}>Back</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label>Name</Label>
                    <Input value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} className="h-10" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} className="h-10" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} className="h-10" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setMe({ ...me, name: account.name, email: account.email })}>Save</Button>
                    <Button variant="outline" className="flex-1" onClick={() => setAccount({ name: me.name, email: me.email, password: "" })}>Reset</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label>Default Currency</Label>
                    <select className="w-full border rounded h-10 px-2" value={platform.currency} onChange={(e) => setPlatform({ ...platform, currency: e.target.value })}>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <select className="w-full border rounded h-10 px-2" value={platform.timezone} onChange={(e) => setPlatform({ ...platform, timezone: e.target.value })}>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Save</Button>
                    <Button variant="outline" className="flex-1" onClick={() => setPlatform({ currency: "INR", timezone: "UTC" })}>Reset</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">Theme</div>
                    <div className="text-xs text-gray-500">Choose light or dark — changes apply immediately</div>
                  </div>
                  <select className="border rounded h-10 px-2" value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")}> 
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Bid Submission Modal */}
      {showBidModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl pr-8">Submit Bid for {selectedCampaign.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Campaign Details</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{selectedCampaign.description}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span>Budget Range:</span>
                  <span className="font-semibold">{selectedCampaign.echoCoinRange.min} - {selectedCampaign.echoCoinRange.max} INR</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bidEchoCoins" className="text-sm sm:text-base">Your Bid (INR)</Label>
                  <Input id="bidEchoCoins" type="number" placeholder={`Between ${selectedCampaign.echoCoinRange.min} - ${selectedCampaign.echoCoinRange.max} INR`} value={bidEchoCoins} onChange={(e) => setBidEchoCoins(e.target.value)} className="text-sm sm:text-base" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button onClick={handleSubmitBid} className="w-full sm:flex-1 bg-brand-600 hover:bg-brand-700 text-white">Submit Bid</Button>
                <Button variant="outline" onClick={() => { setShowBidModal(false); setSelectedCampaign(null); setBidEchoCoins("");  }} className="w-full sm:flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Evidence Submission Modal */}
      {showEvidenceModal && selectedActiveCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl pr-8">Submit Evidence for {selectedActiveCampaign.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Campaign Requirements</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{selectedActiveCampaign.requirements}</p>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span>Payment:</span>
                  <span className="font-semibold text-green-600">{selectedActiveCampaign.echoCoins} INR</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="screenshots" className="text-sm sm:text-base">Screenshots</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-brand-400 transition-colors">
                    <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Upload screenshots of your posts</p>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">Choose Files</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidenceLinks" className="text-sm sm:text-base">Post Links</Label>
                  <Input id="evidenceLinks" placeholder="https://instagram.com/p/your-post-url" value={evidenceLinks} onChange={(e) => setEvidenceLinks(e.target.value)} className="text-sm sm:text-base" />
                  <p className="text-xs text-gray-500">Provide direct links to your posts for verification</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidenceDescription" className="text-sm sm:text-base">Description</Label>
                  <Textarea id="evidenceDescription" placeholder="Describe how you completed the campaign requirements, any special approaches you took, and the response from your audience..." rows={3} value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} className="text-sm sm:text-base resize-none" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-medium text-sm sm:text-base">Important</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">Once submitted, your evidence will be reviewed by the business. Payment will be processed upon approval.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button onClick={handleSubmitEvidence} className="w-full sm:flex-1 bg-brand-600 hover:bg-brand-700 text-white">Submit Evidence</Button>
                <Button variant="outline" onClick={() => { setShowEvidenceModal(false); setSelectedActiveCampaign(null); setEvidenceLinks(""); setEvidenceDescription(""); }} className="w-full sm:flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

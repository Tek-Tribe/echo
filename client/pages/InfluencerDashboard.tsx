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
  ChevronUp,
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

  // Get logged in influencer from localStorage
  const [me, setMe] = useState<InfluencerProfile>(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      id: user?.id || "i1",
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Jane Doe",
      email: user?.email || "jane@example.com",
      followers: user?.followers || 45000,
      categories: user?.categories || ["Fitness", "Lifestyle"],
      platforms: user?.platforms || ["Instagram", "TikTok"],
    };
  });

  // Header/mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Campaigns and bids
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [myBidsMap, setMyBidsMap] = useState<Record<string, any>>({});

  // Function to refresh bids data
  const refreshBids = async () => {
    if (!me.id) return;
    try {
      const bidsResponse = await fetch(`/api/bids/influencer/${me.id}`);
      if (bidsResponse.ok) {
        const bidsData = await bidsResponse.json();
        const bidsMap: Record<string, any> = {};
        const startedBids = new Set<string>();
        bidsData.bids.forEach((bid: any) => {
          bidsMap[bid.campaignId] = bid;
          if (bid.workStartedAt) {
            startedBids.add(bid.id);
          }
        });
        setMyBidsMap(bidsMap);
        setWorkStartedBids(startedBids);
      }
    } catch (error) {
      console.error('Error refreshing bids:', error);
    }
  };

  // Fetch active campaigns and my bids from API
  useEffect(() => {
    const fetchCampaignsAndBids = async () => {
      try {
        setCampaignsLoading(true);

        // Fetch active campaigns
        const campaignsResponse = await fetch('/api/campaigns/active');
        if (campaignsResponse.ok) {
          const data = await campaignsResponse.json();
          // Map API response to Campaign interface
          const mappedCampaigns: Campaign[] = data.campaigns.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            type: c.campaignType === 'story_reshare' ? 'Story Repost' : 'Post Repost',
            echoCoinRange: { min: Number(c.budget) * 0.8, max: Number(c.budget) },
            maxInfluencers: c.maxInfluencers || 1,
            currentBids: 0, // Will be populated from bids data
            deadline: c.endDate || '',
            requirements: {
              minFollowers: 10000,
              categories: [],
              platforms: ['Instagram'],
            },
            businessName: c.business?.firstName + ' ' + c.business?.lastName || 'Business',
            businessLogo: c.business?.profileImageUrl || '',
            status: "open" as const,
          }));
          setCampaigns(mappedCampaigns);
        }

        // Fetch my bids
        await refreshBids();
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setCampaignsLoading(false);
      }
    };

    fetchCampaignsAndBids();
  }, [me.id]);

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

  // Convert myBidsMap to array for display
  const myBids = useMemo(() => {
    return Object.values(myBidsMap).map((bid: any) => ({
      id: bid.id,
      campaignId: bid.campaignId,
      campaignTitle: bid.campaign?.title || campaigns.find(c => c.id === bid.campaignId)?.title || 'Campaign',
      echoCoins: Number(bid.proposedRate),
      proposal: bid.message || '',
      status: bid.status,
      submittedAt: new Date(bid.createdAt).toLocaleDateString(),
      campaign: bid.campaign, // Include full campaign data
      createdAt: bid.createdAt,
      acceptedAt: bid.acceptedAt,
      workStartedAt: bid.workStartedAt,
      evidenceSubmittedAt: bid.evidenceSubmittedAt,
      evidenceConfirmedAt: bid.evidenceConfirmedAt,
    }));
  }, [myBidsMap, campaigns]);

  // Get campaign details for a bid
  const getCampaignForBid = (campaignId: string) => {
    return campaigns.find(c => c.id === campaignId);
  };

  // Track expanded bid
  const [expandedBidId, setExpandedBidId] = useState<string | null>(null);
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);

  // Work and evidence submission states
  const [workStartedBids, setWorkStartedBids] = useState<Set<string>>(new Set());
  const [showBidEvidenceModal, setShowBidEvidenceModal] = useState(false);
  const [selectedBidForEvidence, setSelectedBidForEvidence] = useState<any>(null);
  const [bidEvidenceUrl, setBidEvidenceUrl] = useState("");
  const [bidEvidenceDescription, setBidEvidenceDescription] = useState("");
  const [bidEvidenceSubmitting, setBidEvidenceSubmitting] = useState(false);
  const [bidEvidenceError, setBidEvidenceError] = useState("");
  const [bidEvidenceSuccess, setBidEvidenceSuccess] = useState(false);

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
  const [bidError, setBidError] = useState("");
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidSuccess, setBidSuccess] = useState<{ autoAccepted: boolean } | null>(null);

  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedActiveCampaign, setSelectedActiveCampaign] =
    useState<ActiveCampaign | null>(null);
  const [evidenceLinks, setEvidenceLinks] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");

  const handleSubmitBid = async () => {
    setBidError("");
    setBidSuccess(null);

    if (!selectedCampaign || !bidEchoCoins || !me.id) {
      setBidError('Please enter a bid amount');
      return;
    }

    try {
      setBidSubmitting(true);

      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          influencerId: me.id,
          proposedRate: Number(bidEchoCoins),
          message: `Bid for ${selectedCampaign.title}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Simulate processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        setBidSubmitting(false);
        setBidSuccess({ autoAccepted: data.autoAccepted });

        // Refresh bids to get latest data from database
        await refreshBids();

        // Auto-close after showing success for 3 seconds
        setTimeout(() => {
          setShowBidModal(false);
          setBidEchoCoins("");
          setSelectedCampaign(null);
          setBidError("");
          setBidSuccess(null);
        }, 3000);
      } else {
        const error = await response.json();
        console.error('Bid submission error:', error);
        setBidSubmitting(false);
        setBidError(error.error || error.message || 'Failed to submit bid. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      setBidSubmitting(false);
      setBidError(`Network error: ${error.message || 'Failed to submit bid. Please check your connection.'}`);
    }
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
                <span className="text-xl font-bold text-gray-900">EchoX</span>
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
                      <AvatarImage src={(localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')!))?.profileImageUrl} />
                      <AvatarFallback>{me.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('auth_token');
                    window.location.href = '/';
                  }} className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
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
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem('user');
                  localStorage.removeItem('auth_token');
                  window.location.href = '/';
                }} className="block px-3 py-2 text-base font-medium text-red-600">
                  Logout
                </a>
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <EchoCoinIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Earnings</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{influencerStats.totalEarnings.toLocaleString()} INR</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Campaigns</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{influencerStats.activeCampaigns}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-500">Completed</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{influencerStats.completedCampaigns}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-500">Rating</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{influencerStats.averageRating}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-gray-500">Followers</div>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{(influencerStats.followers / 1000).toFixed(0)}K</div>
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

              <div className="space-y-4 sm:space-y-6">
                {campaignsLoading ? (
                  <Card>
                    <CardContent className="p-6 text-gray-600">Loading campaigns...</CardContent>
                  </Card>
                ) : campaigns.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-gray-600">No active campaigns right now. Check back soon.</CardContent>
                  </Card>
                ) : null}
                {!campaignsLoading && campaigns.map((campaign) => (
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
                          myBidsMap[campaign.id] ? (
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <Badge
                                className={`${
                                  myBidsMap[campaign.id].campaign?.status === 'running'
                                    ? 'bg-green-100 text-green-800'
                                    : myBidsMap[campaign.id].campaign?.status === 'bid'
                                    ? 'bg-blue-100 text-blue-800'
                                    : myBidsMap[campaign.id].campaign?.status === 'closed'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                <CheckCircle className="h-3 w-3 mr-1 inline" />
                                {myBidsMap[campaign.id].campaign?.status === 'running'
                                  ? 'Running'
                                  : myBidsMap[campaign.id].campaign?.status === 'bid'
                                  ? 'Accepting Bids'
                                  : myBidsMap[campaign.id].campaign?.status === 'closed'
                                  ? 'Closed'
                                  : myBidsMap[campaign.id].campaign?.status || 'Draft'}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setExpandedCampaignId(expandedCampaignId === campaign.id ? null : campaign.id);
                                }}
                                className="text-xs"
                              >
                                {expandedCampaignId === campaign.id ? 'Hide' : 'View'} Details
                                {expandedCampaignId === campaign.id ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setBidError("");
                                setBidSuccess(null);
                                setBidSubmitting(false);
                                setShowBidModal(true);
                              }}
                              className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-sm"
                            >
                              Submit Bid
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          )
                        ) : (
                          <Button variant="outline" disabled className="w-full sm:w-auto">Bidding Closed</Button>
                        )}
                      </div>

                      {/* Expanded Bid Details */}
                      {myBidsMap[campaign.id] && expandedCampaignId === campaign.id && (
                        <div className="border-t border-gray-200 pt-4 space-y-3 animate-in slide-in-from-top-2">
                          <h4 className="font-semibold text-gray-900 text-sm">Your Bid Details</h4>
                          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Bid Amount:</span>
                              <span className="font-semibold text-gray-900">{myBidsMap[campaign.id].proposedRate} INR</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Bid Status:</span>
                              <Badge className={`${
                                myBidsMap[campaign.id].status === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : myBidsMap[campaign.id].status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {myBidsMap[campaign.id].status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Submitted:</span>
                              <span className="text-gray-900">{new Date(myBidsMap[campaign.id].createdAt).toLocaleDateString()}</span>
                            </div>
                            {myBidsMap[campaign.id].message && (
                              <div className="pt-2 border-t border-gray-200">
                                <span className="text-gray-500 block mb-1">Message:</span>
                                <p className="text-gray-900">{myBidsMap[campaign.id].message}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bids" className="space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Submitted Bids</h2>

              <div className="space-y-4 sm:space-y-6">
                {campaignsLoading ? (
                  <Card>
                    <CardContent className="p-6 text-gray-600">Loading your bids...</CardContent>
                  </Card>
                ) : myBids.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="text-gray-500 text-sm sm:text-base">
                        You haven't submitted any bids yet.
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Browse campaigns and submit your first bid to get started!
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
                {!campaignsLoading && myBids.map((bid) => {
                  const isExpanded = expandedBidId === bid.id;
                  const campaignType = bid.campaign?.campaignType === 'story_reshare' ? 'Story Repost' : 'Post Repost';

                  return (
                    <Card key={bid.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4">
                          {/* Header with Campaign Info */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                <AvatarFallback>{bid.campaignTitle.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{bid.campaignTitle}</h3>
                                <p className="text-sm text-gray-500">{campaignType}</p>
                              </div>
                            </div>
                            <Badge
                              className={
                                workStartedBids.has(bid.id)
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100 flex-shrink-0"
                                  : bid.status === "accepted"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 flex-shrink-0"
                                  : bid.status === "rejected"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100 flex-shrink-0"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex-shrink-0"
                              }
                            >
                              {workStartedBids.has(bid.id) ? (
                                <>
                                  <Clock className="h-3 w-3 mr-1 animate-pulse" />
                                  Work in Progress
                                </>
                              ) : (
                                <>
                                  {bid.status === "accepted" && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {bid.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                  {bid.status === "rejected" && <AlertCircle className="h-3 w-3 mr-1" />}
                                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                </>
                              )}
                            </Badge>
                          </div>

                          {/* Compact Bid Summary */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">Bid Amount:</span>
                              <span className="font-bold text-brand-600">{bid.echoCoins} INR</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Target className="h-3 w-3 mr-1" />
                                {campaignType}
                              </Badge>
                              <span className="text-gray-500">Submitted {bid.submittedAt}</span>
                            </div>
                          </div>

                          {/* View Details Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => setExpandedBidId(isExpanded ? null : bid.id)}
                          >
                            {isExpanded ? 'Hide' : 'View'} Details
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>

                          {/* Expanded Bid Details */}
                          {isExpanded && (
                            <div className="border-t border-gray-200 pt-4 space-y-3 animate-in slide-in-from-top-2">
                              <h4 className="font-semibold text-gray-900 text-sm">Your Bid Details</h4>
                              <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Bid Amount:</span>
                                  <span className="font-semibold text-gray-900">{bid.echoCoins} INR</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Work Status:</span>
                                  <Badge className={`${
                                    workStartedBids.has(bid.id)
                                      ? 'bg-blue-100 text-blue-800'
                                      : bid.status === 'accepted'
                                      ? 'bg-green-100 text-green-800'
                                      : bid.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {workStartedBids.has(bid.id) ? (
                                      <>
                                        <Clock className="h-3 w-3 mr-1 inline" />
                                        In Progress
                                      </>
                                    ) : (
                                      bid.status.charAt(0).toUpperCase() + bid.status.slice(1)
                                    )}
                                  </Badge>
                                </div>
                                {bid.campaign?.endDate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Deadline:</span>
                                    <span className="text-gray-900">{new Date(bid.campaign.endDate).toLocaleDateString()}</span>
                                  </div>
                                )}

                                {/* Timeline of workflow steps */}
                                {(bid.acceptedAt || bid.workStartedAt || bid.evidenceSubmittedAt || bid.evidenceConfirmedAt) && (
                                  <div className="pt-3 border-t border-gray-200">
                                    <span className="text-gray-500 block mb-2 font-medium">Timeline:</span>
                                    <div className="space-y-2 pl-2">
                                      <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                                        <div className="flex-1">
                                          <div className="text-xs text-gray-700">Bid Submitted</div>
                                          <div className="text-xs text-gray-500">{new Date(bid.createdAt).toLocaleString()}</div>
                                        </div>
                                      </div>
                                      {bid.acceptedAt && (
                                        <div className="flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                                          <div className="flex-1">
                                            <div className="text-xs text-gray-700">Bid Accepted</div>
                                            <div className="text-xs text-gray-500">{new Date(bid.acceptedAt).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      )}
                                      {bid.workStartedAt && (
                                        <div className="flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                                          <div className="flex-1">
                                            <div className="text-xs text-gray-700">Work Started</div>
                                            <div className="text-xs text-gray-500">{new Date(bid.workStartedAt).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      )}
                                      {bid.evidenceSubmittedAt && (
                                        <div className="flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></div>
                                          <div className="flex-1">
                                            <div className="text-xs text-gray-700">Evidence Submitted</div>
                                            <div className="text-xs text-gray-500">{new Date(bid.evidenceSubmittedAt).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      )}
                                      {bid.evidenceConfirmedAt && (
                                        <div className="flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                                          <div className="flex-1">
                                            <div className="text-xs text-gray-700 font-medium">Payment Confirmed</div>
                                            <div className="text-xs text-gray-500">{new Date(bid.evidenceConfirmedAt).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {bid.proposal && (
                                  <div className="pt-2 border-t border-gray-200">
                                    <span className="text-gray-500 block mb-1">Your Message:</span>
                                    <p className="text-gray-900">{bid.proposal}</p>
                                  </div>
                                )}
                                {bid.campaign?.description && (
                                  <div className="pt-2 border-t border-gray-200">
                                    <span className="text-gray-500 block mb-1">Campaign Description:</span>
                                    <p className="text-gray-900">{bid.campaign.description}</p>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons for Accepted Bids */}
                              {bid.status === 'accepted' && (
                                <div className="flex flex-col sm:flex-row gap-2 pt-3">
                                  {bid.evidenceSubmittedAt && !bid.evidenceConfirmedAt ? (
                                    <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                      <div className="flex items-center justify-center gap-2 text-yellow-800">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-medium text-sm">Under Final Review</span>
                                      </div>
                                      <p className="text-xs text-yellow-700 mt-1">Evidence submitted on {new Date(bid.evidenceSubmittedAt).toLocaleDateString()}</p>
                                    </div>
                                  ) : !workStartedBids.has(bid.id) ? (
                                    <Button
                                      className="w-full bg-brand-600 hover:bg-brand-700"
                                      onClick={async () => {
                                        try {
                                          const response = await fetch(`/api/bids/${bid.id}/start-work`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ influencerId: me.id })
                                          });

                                          if (response.ok) {
                                            setWorkStartedBids(prev => new Set(prev).add(bid.id));
                                          } else {
                                            alert('Failed to start work');
                                          }
                                        } catch (error) {
                                          alert('Network error');
                                        }
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Start Work
                                    </Button>
                                  ) : (
                                    <Button
                                      className="w-full bg-green-600 hover:bg-green-700"
                                      onClick={() => {
                                        setSelectedBidForEvidence(bid);
                                        setBidEvidenceUrl("");
                                        setBidEvidenceDescription("");
                                        setBidEvidenceError("");
                                        setBidEvidenceSuccess(false);
                                        setShowBidEvidenceModal(true);
                                      }}
                                    >
                                      <Upload className="h-4 w-4 mr-2" />
                                      Submit Evidence
                                    </Button>
                                  )}
                                </div>
                              )}

                              {/* Payment Confirmed Message for Completed Bids */}
                              {bid.status === 'completed' && bid.evidenceConfirmedAt && (
                                <div className="flex flex-col sm:flex-row gap-2 pt-3">
                                  <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                    <div className="flex items-center justify-center gap-2 text-green-800 mb-2">
                                      <CheckCircle className="h-5 w-5" />
                                      <span className="font-semibold text-base">Payment Credited to Your Wallet</span>
                                    </div>
                                    <p className="text-sm text-green-700">Campaign completed successfully on {new Date(bid.evidenceConfirmedAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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

              {!bidSuccess ? (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bidEchoCoins" className="text-sm sm:text-base">Your Bid (INR)</Label>
                      <Input
                        id="bidEchoCoins"
                        type="number"
                        placeholder={`Between ${selectedCampaign.echoCoinRange.min} - ${selectedCampaign.echoCoinRange.max} INR`}
                        value={bidEchoCoins}
                        onChange={(e) => setBidEchoCoins(e.target.value)}
                        className="text-sm sm:text-base"
                        disabled={bidSubmitting}
                      />
                    </div>
                  </div>

                  {bidError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                      {bidError}
                    </div>
                  )}

                  {bidSubmitting && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-800">Processing your bid...</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                    <Button
                      onClick={handleSubmitBid}
                      className="w-full sm:flex-1 bg-brand-600 hover:bg-brand-700 text-white"
                      disabled={bidSubmitting}
                    >
                      {bidSubmitting ? 'Submitting...' : 'Submit Bid'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowBidModal(false);
                        setSelectedCampaign(null);
                        setBidEchoCoins("");
                        setBidError("");
                        setBidSuccess(null);
                      }}
                      className="w-full sm:flex-1"
                      disabled={bidSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className={`text-center space-y-4 ${bidSuccess.autoAccepted ? 'animate-in fade-in duration-500' : 'animate-in fade-in duration-500'}`}>
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${bidSuccess.autoAccepted ? 'bg-green-100' : 'bg-blue-100'}`}>
                      <CheckCircle className={`h-10 w-10 ${bidSuccess.autoAccepted ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {bidSuccess.autoAccepted ? '🎉 Bid Accepted!' : '✓ Bid Submitted!'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {bidSuccess.autoAccepted
                          ? 'Your bid has been automatically accepted! You can now start working on this campaign.'
                          : 'Your bid has been submitted successfully. You will be notified when the business reviews your bid.'
                        }
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button
                        onClick={() => {
                          setShowBidModal(false);
                          setBidEchoCoins("");
                          setSelectedCampaign(null);
                          setBidError("");
                          setBidSuccess(null);
                        }}
                        className="bg-brand-600 hover:bg-brand-700 text-white"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Evidence Submission Modal for Bids */}
      {showBidEvidenceModal && selectedBidForEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl pr-8">Submit Work Evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {!bidEvidenceSuccess ? (
                <>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{selectedBidForEvidence.campaignTitle}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{selectedBidForEvidence.campaign?.description || 'Complete the campaign requirements'}</p>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>Your Bid Amount:</span>
                      <span className="font-semibold text-green-600">{selectedBidForEvidence.echoCoins} INR</span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bidEvidenceUrl" className="text-sm sm:text-base">Post URL *</Label>
                      <Input
                        id="bidEvidenceUrl"
                        placeholder="https://instagram.com/p/your-post-url"
                        value={bidEvidenceUrl}
                        onChange={(e) => setBidEvidenceUrl(e.target.value)}
                        className="text-sm sm:text-base"
                        disabled={bidEvidenceSubmitting}
                      />
                      <p className="text-xs text-gray-500">Provide the direct link to your post for verification</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bidEvidenceDescription" className="text-sm sm:text-base">Description (Optional)</Label>
                      <Textarea
                        id="bidEvidenceDescription"
                        placeholder="Add any additional notes about how you completed the campaign..."
                        rows={3}
                        value={bidEvidenceDescription}
                        onChange={(e) => setBidEvidenceDescription(e.target.value)}
                        className="text-sm sm:text-base resize-none"
                        disabled={bidEvidenceSubmitting}
                      />
                    </div>
                  </div>

                  {bidEvidenceError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                      {bidEvidenceError}
                    </div>
                  )}

                  {bidEvidenceSubmitting && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-800">Submitting your evidence...</span>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-medium text-sm sm:text-base">Important</span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-700 mt-1">Your evidence will be reviewed by the business. Once approved, your bid status will be marked as completed.</p>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">Evidence Submitted!</h3>
                      <p className="text-sm text-gray-600">
                        Your evidence has been submitted successfully. The business will review your submission.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                {!bidEvidenceSuccess ? (
                  <>
                    <Button
                      onClick={async () => {
                        if (!bidEvidenceUrl.trim()) {
                          setBidEvidenceError('Please enter the post URL');
                          return;
                        }

                        setBidEvidenceError("");
                        setBidEvidenceSubmitting(true);

                        // Simulate processing delay
                        await new Promise(resolve => setTimeout(resolve, 800));

                        try {
                          const response = await fetch('/api/evidence', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              bidId: selectedBidForEvidence.id,
                              evidenceUrl: bidEvidenceUrl.trim(),
                              evidenceType: 'link',
                              description: bidEvidenceDescription.trim() || null
                            })
                          });

                          if (response.ok) {
                            await refreshBids();
                            setBidEvidenceSubmitting(false);
                            setBidEvidenceSuccess(true);

                            // Auto-close after 3 seconds
                            setTimeout(() => {
                              setShowBidEvidenceModal(false);
                              setSelectedBidForEvidence(null);
                              setBidEvidenceUrl("");
                              setBidEvidenceDescription("");
                              setBidEvidenceSuccess(false);
                              setBidEvidenceError("");
                            }, 3000);
                          } else {
                            const error = await response.json();
                            setBidEvidenceError(error.error || 'Failed to submit evidence. Please try again.');
                            setBidEvidenceSubmitting(false);
                          }
                        } catch (error: any) {
                          setBidEvidenceError(`Network error: ${error.message || 'Please try again.'}`);
                          setBidEvidenceSubmitting(false);
                        }
                      }}
                      className="w-full sm:flex-1 bg-brand-600 hover:bg-brand-700 text-white"
                      disabled={bidEvidenceSubmitting}
                    >
                      {bidEvidenceSubmitting ? 'Submitting...' : 'Submit Evidence'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowBidEvidenceModal(false);
                        setSelectedBidForEvidence(null);
                        setBidEvidenceUrl("");
                        setBidEvidenceDescription("");
                        setBidEvidenceError("");
                        setBidEvidenceSuccess(false);
                      }}
                      className="w-full sm:flex-1"
                      disabled={bidEvidenceSubmitting}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setShowBidEvidenceModal(false);
                      setSelectedBidForEvidence(null);
                      setBidEvidenceUrl("");
                      setBidEvidenceDescription("");
                      setBidEvidenceSuccess(false);
                      setBidEvidenceError("");
                    }}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white"
                  >
                    Close
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

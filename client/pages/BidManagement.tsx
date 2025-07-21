import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Users,
  Star,
  Instagram,
  DollarSign,
  CheckCircle,
  X,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface InfluencerBid {
  id: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar: string;
  influencerHandle: string;
  followers: number;
  engagement: number;
  rating: number;
  bidEchoCoins: number;
  proposal: string;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
  previousWork: string[];
  analytics: {
    avgLikes: number;
    avgComments: number;
    avgShares: number;
  };
}

interface EvidenceSubmission {
  id: string;
  bidId: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar: string;
  influencerHandle: string;
  echoCoins: number;
  submittedAt: string;
  evidence: {
    screenshots: string[];
    links: string[];
    description: string;
  };
  status: "pending" | "approved" | "rejected";
}

export default function BidManagement() {
  const { campaignId } = useParams();
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [selectedEvidence, setSelectedEvidence] =
    useState<EvidenceSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"bids" | "evidence">("bids");

  const [campaign] = useState({
    id: "1",
    title: "Instagram Story Repost Campaign",
    description:
      "Repost our new product launch story to reach fitness enthusiasts",
    echoCoins: 2500,
    maxInfluencers: 5,
  });

  const [evidenceSubmissions] = useState<EvidenceSubmission[]>([
    {
      id: "1",
      bidId: "3",
      influencerId: "inf3",
      influencerName: "Emma Wellness",
      influencerAvatar: "/placeholder.svg",
      influencerHandle: "@emmawellness",
      echoCoins: 320,
      submittedAt: "2024-01-20",
      evidence: {
        screenshots: ["/placeholder.svg", "/placeholder.svg"],
        links: [
          "https://instagram.com/p/example123",
          "https://instagram.com/stories/highlights/123",
        ],
        description:
          "Posted on my main feed with authentic review. Received great engagement from my fitness community. The post shows me using the product during my morning routine and includes honest feedback about taste and effectiveness.",
      },
      status: "pending",
    },
  ]);

  const [bids] = useState<InfluencerBid[]>([
    {
      id: "1",
      influencerId: "inf1",
      influencerName: "Sarah Fitness",
      influencerAvatar: "/placeholder.svg",
      influencerHandle: "@sarahfitness",
      followers: 45000,
      engagement: 6.2,
      rating: 4.9,
      bidEchoCoins: 350,
      proposal:
        "I have 45K engaged followers in the fitness niche with 6.2% avg engagement. My audience is 70% female, ages 18-35, perfect for your target market. I regularly promote health and wellness products with authentic reviews.",
      submittedAt: "2024-01-18",
      status: "pending",
      previousWork: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
      analytics: {
        avgLikes: 2800,
        avgComments: 180,
        avgShares: 95,
      },
    },
    {
      id: "2",
      influencerId: "inf2",
      influencerName: "Mike Strong",
      influencerAvatar: "/placeholder.svg",
      influencerHandle: "@mikestrong",
      followers: 32000,
      engagement: 8.1,
      rating: 4.7,
      bidEchoCoins: 280,
      proposal:
        "Fitness enthusiast with 32K highly engaged followers. I specialize in workout routines and nutrition content. My audience trusts my product recommendations, leading to high conversion rates.",
      submittedAt: "2024-01-17",
      status: "pending",
      previousWork: ["/placeholder.svg", "/placeholder.svg"],
      analytics: {
        avgLikes: 2600,
        avgComments: 210,
        avgShares: 87,
      },
    },
    {
      id: "3",
      influencerId: "inf3",
      influencerName: "Emma Wellness",
      influencerAvatar: "/placeholder.svg",
      influencerHandle: "@emmawellness",
      followers: 28000,
      engagement: 7.3,
      rating: 4.8,
      bidEchoCoins: 320,
      proposal:
        "Wellness coach with authentic engagement from health-conscious followers. I create genuine content that resonates with my community and drives real results for brands.",
      submittedAt: "2024-01-16",
      status: "accepted",
      previousWork: [
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
        "/placeholder.svg",
      ],
      analytics: {
        avgLikes: 2040,
        avgComments: 165,
        avgShares: 78,
      },
    },
  ]);

  const handleAcceptBid = (bidId: string) => {
    if (
      selectedBids.length < campaign.maxInfluencers &&
      !selectedBids.includes(bidId)
    ) {
      setSelectedBids([...selectedBids, bidId]);
    }
  };

  const handleRejectBid = (bidId: string) => {
    setSelectedBids(selectedBids.filter((id) => id !== bidId));
  };

  const handleApproveEvidence = (evidenceId: string) => {
    console.log("Approved evidence:", evidenceId);
    setSelectedEvidence(null);
    setReviewNotes("");
  };

  const handleRejectEvidence = (evidenceId: string) => {
    console.log("Rejected evidence:", evidenceId, "Notes:", reviewNotes);
    setSelectedEvidence(null);
    setReviewNotes("");
  };

  const pendingBids = bids.filter((bid) => bid.status === "pending");
  const acceptedBids = bids.filter(
    (bid) => bid.status === "accepted" || selectedBids.includes(bid.id),
  );
  const pendingEvidence = evidenceSubmissions.filter(
    (sub) => sub.status === "pending",
  );
  const hasEvidence = evidenceSubmissions.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Echo</span>
              </Link>
            </div>
            <Link to="/business-dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Campaign Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {campaign.title}
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage bids and review campaign evidence
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Echo Coins: {campaign.echoCoins} EC</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Max Influencers: {campaign.maxInfluencers}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <CheckCircle className="h-4 w-4" />
              <span>
                Selected:{" "}
                {selectedBids.length +
                  acceptedBids.filter((bid) => bid.status === "accepted")
                    .length}
                /{campaign.maxInfluencers}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("bids")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bids"
                    ? "border-brand-500 text-brand-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Bid Management ({pendingBids.length} pending)
              </button>
              {hasEvidence && (
                <button
                  onClick={() => setActiveTab("evidence")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "evidence"
                      ? "border-brand-500 text-brand-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Evidence Review ({pendingEvidence.length} pending)
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "bids" && (
          <>
            {/* Selected Influencers */}
            {(selectedBids.length > 0 ||
              acceptedBids.some((bid) => bid.status === "accepted")) && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Selected Influencers
                </h2>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {bids
                    .filter(
                      (bid) =>
                        selectedBids.includes(bid.id) ||
                        bid.status === "accepted",
                    )
                    .map((bid) => (
                      <Card
                        key={bid.id}
                        className="border-green-200 bg-green-50"
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                <AvatarImage src={bid.influencerAvatar} />
                                <AvatarFallback>
                                  {bid.influencerName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                  {bid.influencerName}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {bid.influencerHandle}
                                </p>
                              </div>
                            </div>
                            <div className="flex sm:flex-col sm:text-right items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1">
                              <div className="text-base sm:text-lg font-bold text-green-600">
                                {bid.bidEchoCoins} EC
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Selected
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button className="bg-brand-600 hover:bg-brand-700 text-white text-sm sm:text-base">
                    Confirm Selection & Notify Influencers
                  </Button>
                  <Button variant="outline" className="text-sm sm:text-base">
                    Save as Draft
                  </Button>
                </div>
              </div>
            )}

            {/* Pending Bids */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Pending Bids ({pendingBids.length})
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {pendingBids.map((bid) => (
                  <Card
                    key={bid.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Influencer Info */}
                        <div>
                          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                              <AvatarImage src={bid.influencerAvatar} />
                              <AvatarFallback>
                                {bid.influencerName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                {bid.influencerName}
                              </h3>
                              <p className="text-sm sm:text-base text-gray-600">
                                {bid.influencerHandle}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                                <span className="text-xs sm:text-sm font-medium">
                                  {bid.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <span className="text-gray-500">Followers</span>
                              <div className="font-semibold">
                                {(bid.followers / 1000).toFixed(0)}K
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Engagement</span>
                              <div className="font-semibold">
                                {bid.engagement}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Analytics */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                            Average Performance
                          </h4>
                          <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                <span className="text-gray-600">Likes</span>
                              </div>
                              <span className="font-semibold">
                                {bid.analytics.avgLikes.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                <span className="text-gray-600">Comments</span>
                              </div>
                              <span className="font-semibold">
                                {bid.analytics.avgComments}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <Instagram className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                                <span className="text-gray-600">Shares</span>
                              </div>
                              <span className="font-semibold">
                                {bid.analytics.avgShares}
                              </span>
                            </div>
                          </div>

                          {/* Previous Work */}
                          <div className="mt-3 sm:mt-4">
                            <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                              Previous Work
                            </h5>
                            <div className="flex gap-1 sm:gap-2">
                              {bid.previousWork
                                .slice(0, 3)
                                .map((work, index) => (
                                  <div
                                    key={index}
                                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"
                                  ></div>
                                ))}
                              {bid.previousWork.length > 3 && (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <span className="text-xs text-gray-500">
                                    +{bid.previousWork.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Proposal & Actions */}
                        <div>
                          <div className="mb-3 sm:mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                              Proposal
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-4">
                              {bid.proposal}
                            </p>
                          </div>

                          <div className="mb-3 sm:mb-4">
                            <div className="text-xl sm:text-2xl font-bold text-brand-600">
                              {bid.bidEchoCoins} EC
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">
                              Submitted{" "}
                              {new Date(bid.submittedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              onClick={() => handleAcceptBid(bid.id)}
                              disabled={
                                selectedBids.length +
                                  acceptedBids.filter(
                                    (b) => b.status === "accepted",
                                  ).length >=
                                  campaign.maxInfluencers ||
                                selectedBids.includes(bid.id)
                              }
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                            >
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleRejectBid(bid.id)}
                              variant="outline"
                              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Evidence Review Tab */}
        {activeTab === "evidence" && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Evidence Submissions ({pendingEvidence.length} pending review)
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {evidenceSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={submission.influencerAvatar} />
                          <AvatarFallback>
                            {submission.influencerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {campaign.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {submission.influencerName} (
                            {submission.influencerHandle})
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:text-right items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1">
                        <div className="text-lg sm:text-xl font-bold text-green-600">
                          {submission.echoCoins} EC
                        </div>
                        <Badge
                          className={
                            submission.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : submission.status === "approved"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {submission.status === "pending" && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {submission.status === "approved" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {submission.status === "rejected" && (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {submission.status.charAt(0).toUpperCase() +
                            submission.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                        Submission Description
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {submission.evidence.description}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 text-xs sm:text-sm">
                          Screenshots ({submission.evidence.screenshots.length})
                        </h5>
                        <div className="flex gap-1 sm:gap-2">
                          {submission.evidence.screenshots.map(
                            (screenshot, index) => (
                              <div
                                key={index}
                                className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 text-xs sm:text-sm">
                          Post Links
                        </h5>
                        <div className="space-y-1">
                          {submission.evidence.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs sm:text-sm text-brand-600 hover:text-brand-700"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Post {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        Submitted{" "}
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {submission.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                          onClick={() => setSelectedEvidence(submission)}
                          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Review in Detail
                        </Button>
                        <Button
                          onClick={() => handleApproveEvidence(submission.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 text-xs sm:text-sm"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Quick Approve
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Review Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Review Evidence: {campaign.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                    Influencer Details
                  </h4>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={selectedEvidence.influencerAvatar} />
                      <AvatarFallback>
                        {selectedEvidence.influencerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm sm:text-base">
                        {selectedEvidence.influencerName}
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {selectedEvidence.influencerHandle}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Echo Coins:</span>
                      <span className="font-medium text-green-600">
                        {selectedEvidence.echoCoins} EC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Submitted:</span>
                      <span className="font-medium">
                        {new Date(
                          selectedEvidence.submittedAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                    Evidence Links
                  </h4>
                  <div className="space-y-2">
                    {selectedEvidence.evidence.links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-brand-600" />
                        <span className="text-brand-600 hover:text-brand-700">
                          Post {index + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                  Submission Description
                </h4>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-gray-700 text-xs sm:text-sm">
                    {selectedEvidence.evidence.description}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                  Screenshots
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {selectedEvidence.evidence.screenshots.map(
                    (screenshot, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                      >
                        <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                  Review Notes (Optional)
                </h4>
                <Textarea
                  placeholder="Add any feedback or notes for the influencer..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button
                  onClick={() => handleApproveEvidence(selectedEvidence.id)}
                  className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve & Process Payment
                </Button>
                <Button
                  onClick={() => handleRejectEvidence(selectedEvidence.id)}
                  variant="outline"
                  className="w-full sm:flex-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Submission
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedEvidence(null);
                    setReviewNotes("");
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Calendar
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface InfluencerBid {
  id: string;
  influencerId: string;
  influencerName: string;
  influencerAvatar: string;
  influencerHandle: string;
  followers: number;
  engagement: number;
  rating: number;
  bidAmount: number;
  proposal: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
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
  amount: number;
  submittedAt: string;
  evidence: {
    screenshots: string[];
    links: string[];
    description: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}

export default function BidManagement() {
  const { campaignId } = useParams();
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'bids' | 'evidence'>('bids');

  const [campaign] = useState({
    id: '1',
    title: 'Instagram Story Repost Campaign',
    description: 'Repost our new product launch story to reach fitness enthusiasts',
    budget: 2500,
    maxInfluencers: 5
  });

  const [bids] = useState<InfluencerBid[]>([
    {
      id: '1',
      influencerId: 'inf1',
      influencerName: 'Sarah Fitness',
      influencerAvatar: '/placeholder.svg',
      influencerHandle: '@sarahfitness',
      followers: 45000,
      engagement: 6.2,
      rating: 4.9,
      bidAmount: 350,
      proposal: 'I have 45K engaged followers in the fitness niche with 6.2% avg engagement. My audience is 70% female, ages 18-35, perfect for your target market. I regularly promote health and wellness products with authentic reviews.',
      submittedAt: '2024-01-18',
      status: 'pending',
      previousWork: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      analytics: {
        avgLikes: 2800,
        avgComments: 180,
        avgShares: 95
      }
    },
    {
      id: '2',
      influencerId: 'inf2',
      influencerName: 'Mike Strong',
      influencerAvatar: '/placeholder.svg',
      influencerHandle: '@mikestrong',
      followers: 32000,
      engagement: 8.1,
      rating: 4.7,
      bidAmount: 280,
      proposal: 'Fitness enthusiast with 32K highly engaged followers. I specialize in workout routines and nutrition content. My audience trusts my product recommendations, leading to high conversion rates.',
      submittedAt: '2024-01-17',
      status: 'pending',
      previousWork: ['/placeholder.svg', '/placeholder.svg'],
      analytics: {
        avgLikes: 2600,
        avgComments: 210,
        avgShares: 87
      }
    },
    {
      id: '3',
      influencerId: 'inf3',
      influencerName: 'Emma Wellness',
      influencerAvatar: '/placeholder.svg',
      influencerHandle: '@emmawellness',
      followers: 28000,
      engagement: 7.3,
      rating: 4.8,
      bidAmount: 320,
      proposal: 'Wellness coach with authentic engagement from health-conscious followers. I create genuine content that resonates with my community and drives real results for brands.',
      submittedAt: '2024-01-16',
      status: 'accepted',
      previousWork: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      analytics: {
        avgLikes: 2040,
        avgComments: 165,
        avgShares: 78
      }
    }
  ]);

  const handleAcceptBid = (bidId: string) => {
    if (selectedBids.length < campaign.maxInfluencers && !selectedBids.includes(bidId)) {
      setSelectedBids([...selectedBids, bidId]);
    }
  };

  const handleRejectBid = (bidId: string) => {
    setSelectedBids(selectedBids.filter(id => id !== bidId));
  };

  const pendingBids = bids.filter(bid => bid.status === 'pending');
  const acceptedBids = bids.filter(bid => bid.status === 'accepted' || selectedBids.includes(bid.id));

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{campaign.title}</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Review and select influencers for your campaign</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Budget: ${campaign.budget}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Max Influencers: {campaign.maxInfluencers}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <CheckCircle className="h-4 w-4" />
              <span>Selected: {selectedBids.length + acceptedBids.filter(bid => bid.status === 'accepted').length}/{campaign.maxInfluencers}</span>
            </div>
          </div>
        </div>

        {/* Selected Influencers */}
        {(selectedBids.length > 0 || acceptedBids.some(bid => bid.status === 'accepted')) && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Selected Influencers</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {bids.filter(bid => selectedBids.includes(bid.id) || bid.status === 'accepted').map((bid) => (
                <Card key={bid.id} className="border-green-200 bg-green-50">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={bid.influencerAvatar} />
                          <AvatarFallback>{bid.influencerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{bid.influencerName}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{bid.influencerHandle}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:text-right items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1">
                        <div className="text-base sm:text-lg font-bold text-green-600">${bid.bidAmount}</div>
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
              <Card key={bid.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Influencer Info */}
                    <div>
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarImage src={bid.influencerAvatar} />
                          <AvatarFallback>{bid.influencerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{bid.influencerName}</h3>
                          <p className="text-sm sm:text-base text-gray-600">{bid.influencerHandle}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                            <span className="text-xs sm:text-sm font-medium">{bid.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-500">Followers</span>
                          <div className="font-semibold">{(bid.followers / 1000).toFixed(0)}K</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Engagement</span>
                          <div className="font-semibold">{bid.engagement}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Average Performance</h4>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            <span className="text-gray-600">Likes</span>
                          </div>
                          <span className="font-semibold">{bid.analytics.avgLikes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                            <span className="text-gray-600">Comments</span>
                          </div>
                          <span className="font-semibold">{bid.analytics.avgComments}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Instagram className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                            <span className="text-gray-600">Shares</span>
                          </div>
                          <span className="font-semibold">{bid.analytics.avgShares}</span>
                        </div>
                      </div>

                      {/* Previous Work */}
                      <div className="mt-3 sm:mt-4">
                        <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Previous Work</h5>
                        <div className="flex gap-1 sm:gap-2">
                          {bid.previousWork.slice(0, 3).map((work, index) => (
                            <div key={index} className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                          ))}
                          {bid.previousWork.length > 3 && (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">+{bid.previousWork.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Proposal & Actions */}
                    <div>
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Proposal</h4>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-4">{bid.proposal}</p>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <div className="text-xl sm:text-2xl font-bold text-brand-600">${bid.bidAmount}</div>
                        <div className="text-xs sm:text-sm text-gray-500">Submitted {new Date(bid.submittedAt).toLocaleDateString()}</div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => handleAcceptBid(bid.id)}
                          disabled={selectedBids.length + acceptedBids.filter(b => b.status === 'accepted').length >= campaign.maxInfluencers || selectedBids.includes(bid.id)}
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
      </div>
    </div>
  );
}

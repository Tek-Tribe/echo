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
  MessageCircle
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

export default function BidManagement() {
  const { campaignId } = useParams();
  const [selectedBids, setSelectedBids] = useState<string[]>([]);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaign Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
          <p className="text-gray-600 mt-2">Review and select influencers for your campaign</p>
          
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span>Budget: ${campaign.budget}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>Max Influencers: {campaign.maxInfluencers}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4" />
              <span>Selected: {selectedBids.length + acceptedBids.filter(bid => bid.status === 'accepted').length}/{campaign.maxInfluencers}</span>
            </div>
          </div>
        </div>

        {/* Selected Influencers */}
        {(selectedBids.length > 0 || acceptedBids.some(bid => bid.status === 'accepted')) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Influencers</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bids.filter(bid => selectedBids.includes(bid.id) || bid.status === 'accepted').map((bid) => (
                <Card key={bid.id} className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={bid.influencerAvatar} />
                          <AvatarFallback>{bid.influencerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{bid.influencerName}</h3>
                          <p className="text-sm text-gray-600">{bid.influencerHandle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">${bid.bidAmount}</div>
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
            <div className="mt-4 flex gap-4">
              <Button className="bg-brand-600 hover:bg-brand-700 text-white">
                Confirm Selection & Notify Influencers
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
            </div>
          </div>
        )}

        {/* Pending Bids */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Pending Bids ({pendingBids.length})
          </h2>
          
          <div className="space-y-6">
            {pendingBids.map((bid) => (
              <Card key={bid.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Influencer Info */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={bid.influencerAvatar} />
                          <AvatarFallback>{bid.influencerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{bid.influencerName}</h3>
                          <p className="text-gray-600">{bid.influencerHandle}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{bid.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
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
                      <h4 className="font-semibold text-gray-900 mb-3">Average Performance</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-gray-600">Likes</span>
                          </div>
                          <span className="font-semibold">{bid.analytics.avgLikes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-600">Comments</span>
                          </div>
                          <span className="font-semibold">{bid.analytics.avgComments}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-600">Shares</span>
                          </div>
                          <span className="font-semibold">{bid.analytics.avgShares}</span>
                        </div>
                      </div>

                      {/* Previous Work */}
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Previous Work</h5>
                        <div className="flex gap-2">
                          {bid.previousWork.slice(0, 3).map((work, index) => (
                            <div key={index} className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          ))}
                          {bid.previousWork.length > 3 && (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">+{bid.previousWork.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Proposal & Actions */}
                    <div>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Proposal</h4>
                        <p className="text-sm text-gray-600 line-clamp-4">{bid.proposal}</p>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-brand-600">${bid.bidAmount}</div>
                        <div className="text-sm text-gray-500">Submitted {new Date(bid.submittedAt).toLocaleDateString()}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleAcceptBid(bid.id)}
                          disabled={selectedBids.length + acceptedBids.filter(b => b.status === 'accepted').length >= campaign.maxInfluencers || selectedBids.includes(bid.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                        <Button 
                          onClick={() => handleRejectBid(bid.id)}
                          variant="outline" 
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
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

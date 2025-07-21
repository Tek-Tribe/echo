import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  LogOut,
  ChevronDown
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  budget: number;
  maxInfluencers: number;
  bidCount: number;
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
}

export default function BusinessDashboard() {
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Instagram Story Repost Campaign',
      description: 'Repost our new product launch story to reach fitness enthusiasts',
      type: 'Story Repost',
      budget: 2500,
      maxInfluencers: 5,
      bidCount: 23,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Product Review Video',
      description: 'Create an authentic unboxing and review video for our new smartwatch',
      type: 'Video Creation',
      budget: 5000,
      maxInfluencers: 3,
      bidCount: 12,
      status: 'active',
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Brand Awareness Post',
      description: 'Share our brand story with your audience using our hashtag',
      type: 'Feed Post',
      budget: 1500,
      maxInfluencers: 8,
      bidCount: 0,
      status: 'completed',
      createdAt: '2024-01-08'
    }
  ]);

  const totalBudget = jobs.reduce((sum, job) => sum + job.budget, 0);
  const activeCampaigns = jobs.filter(job => job.status === 'active').length;
  const totalBids = jobs.reduce((sum, job) => sum + job.bidCount, 0);

  if (showCreateJob) {
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
              <Button 
                variant="ghost" 
                onClick={() => setShowCreateJob(false)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </header>

        {/* Create Job Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
            <p className="text-gray-600 mt-2">Post a new job to connect with qualified influencers</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input id="title" placeholder="e.g., Instagram Story Repost Campaign" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Campaign Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story-repost">Story Repost</SelectItem>
                      <SelectItem value="feed-post">Feed Post</SelectItem>
                      <SelectItem value="video-creation">Video Creation</SelectItem>
                      <SelectItem value="product-review">Product Review</SelectItem>
                      <SelectItem value="brand-mention">Brand Mention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your campaign goals, requirements, and any specific instructions for influencers..."
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Total Budget ($)</Label>
                  <Input id="budget" type="number" placeholder="2500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxInfluencers">Max Influencers</Label>
                  <Input id="maxInfluencers" type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Eligibility Criteria</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minFollowers">Minimum Followers</Label>
                    <Input id="minFollowers" type="number" placeholder="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categories">Categories</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fitness">Fitness & Health</SelectItem>
                        <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="food">Food & Lifestyle</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={() => setShowCreateJob(false)} 
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Post Campaign
                </Button>
                <Button variant="outline" onClick={() => setShowCreateJob(false)}>
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              <nav className="hidden md:flex ml-8 space-x-8">
                <a href="#" className="text-brand-600 border-b-2 border-brand-600 pb-4 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                  Analytics
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700 pb-4 text-sm font-medium">
                  Payments
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowCreateJob(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">BC</span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">Business Admin</span>
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
                    <Link to="/" className="flex items-center gap-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your influencer marketing campaigns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Active Campaigns</div>
                  <div className="text-2xl font-bold text-gray-900">{activeCampaigns}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Budget</div>
                  <div className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Total Bids</div>
                  <div className="text-2xl font-bold text-gray-900">{totalBids}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">Avg. Response</div>
                  <div className="text-2xl font-bold text-gray-900">2.4h</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <Badge 
                          variant={job.status === 'active' ? 'default' : job.status === 'completed' ? 'secondary' : 'outline'}
                          className={
                            job.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : job.status === 'completed'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                              : ''
                          }
                        >
                          {job.status === 'active' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {job.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{job.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${job.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.maxInfluencers} max influencers
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {job.bidCount} bids
                        </span>
                        <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        View Bids
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

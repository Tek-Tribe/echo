import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, LogOut, ChevronDown, CheckCircle, XCircle, Clock } from "lucide-react";

export default function BusinessDashboard() {
  // Get logged in business user from localStorage
  const [currentBusiness, setCurrentBusiness] = useState<any>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [editedBusiness, setEditedBusiness] = useState<any>(currentBusiness);

  const [showMapPicker, setShowMapPicker] = useState(false);
  const pickerMapRef = useRef<HTMLDivElement | null>(null);
  const viewMapRef = useRef<HTMLDivElement | null>(null);
  const [mapPickerCoords, setMapPickerCoords] = useState<{ lat?: number; lng?: number }>({});

  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [campaigns, setCampaigns] = useState<any[]>([]);

  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<any>({ type: "", platform: "", postUrl: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days", reach: "", maxInfluencers: 1, autoAcceptBids: false });
  const [campaignError, setCampaignError] = useState<string>("");

  // Bids state
  const [bids, setBids] = useState<any[]>([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [evidenceMap, setEvidenceMap] = useState<Record<string, any[]>>({});

  // Fetch bids for all business campaigns
  const fetchBids = async () => {
    if (!currentBusiness?.id) return;

    try {
      setBidsLoading(true);
      const response = await fetch(`/api/campaigns/business/${currentBusiness.id}`);
      if (response.ok) {
        const data = await response.json();
        // Collect all bids from all campaigns
        const allBids: any[] = [];
        for (const campaign of data.campaigns) {
          const bidsResponse = await fetch(`/api/bids/campaign/${campaign.id}`);
          if (bidsResponse.ok) {
            const bidsData = await bidsResponse.json();
            const bidsWithCampaign = bidsData.bids.map((bid: any) => ({
              ...bid,
              campaign: {
                id: campaign.id,
                title: campaign.title,
                budget: campaign.budget,
              }
            }));
            allBids.push(...bidsWithCampaign);
          }
        }
        setBids(allBids);

        // Fetch evidence for bids that have evidence submitted
        const evidenceData: Record<string, any[]> = {};
        for (const bid of allBids) {
          if (bid.evidenceSubmittedAt) {
            try {
              const evidenceResponse = await fetch(`/api/evidence/bid/${bid.id}`);
              if (evidenceResponse.ok) {
                const { evidence } = await evidenceResponse.json();
                evidenceData[bid.id] = evidence;
              }
            } catch (err) {
              console.error(`Error fetching evidence for bid ${bid.id}:`, err);
            }
          }
        }
        setEvidenceMap(evidenceData);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setBidsLoading(false);
    }
  };

  // Fetch campaigns from database
  const fetchCampaigns = async () => {
    if (!currentBusiness?.id) return;

    try {
      const response = await fetch(`/api/campaigns/business/${currentBusiness.id}`);
      if (response.ok) {
        const data = await response.json();
        const mappedCampaigns = data.campaigns.map((c: any) => ({
          id: c.id,
          type: c.campaignType === 'story_reshare' ? 'Story Repost' : 'Post Repost',
          platform: 'Instagram',
          postUrl: c.contentUrl || '',
          business: currentBusiness?.businessName || currentBusiness?.firstName + ' ' + currentBusiness?.lastName,
          status: c.status,
          budget: Number(c.budget),
          bidStart: c.startDate,
          bidEnd: c.endDate,
          duration: { value: 0, unit: 'days' },
          createdAt: c.createdAt,
          postedAt: undefined,
          completedAt: c.status === 'completed' ? c.updatedAt : undefined,
          reach: undefined,
          participants: [],
          selected: undefined,
          maxInfluencers: c.maxInfluencers || 1,
        }));
        setCampaigns(mappedCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchBids();
  }, [currentBusiness?.id]);

  // All campaigns are already filtered by businessId from the API, so use them all
  const myCampaigns = campaigns;
  const activeCount = myCampaigns.filter((c) => c.status !== "closed").length;
  const totalBudget = myCampaigns.reduce((s, c) => s + Number(c.budget || 0), 0);

  const formatDate = (d?: string) => (d ? new Date(d).toLocaleString() : '—');

  // Load Google Maps when map modals or view are used
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;
    if ((window as any).google) return; // already loaded
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    document.head.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, []);

  useEffect(() => {
    if (!(window as any).google) return;
    // init view map
    if (viewMapRef.current && currentBusiness.latitude && currentBusiness.longitude) {
      // @ts-ignore
      const map = new google.maps.Map(viewMapRef.current, { center: { lat: currentBusiness.latitude, lng: currentBusiness.longitude }, zoom: 12 });
      // @ts-ignore
      new google.maps.Marker({ position: { lat: currentBusiness.latitude, lng: currentBusiness.longitude }, map });
    }
  }, [currentBusiness.latitude, currentBusiness.longitude]);

  useEffect(() => {
    if (!showMapPicker) return;
    if (!(window as any).google) return;
    if (!pickerMapRef.current) return;
    // @ts-ignore
    const map = new google.maps.Map(pickerMapRef.current, { center: { lat: mapPickerCoords.lat || 20, lng: mapPickerCoords.lng || 0 }, zoom: 4 });
    // @ts-ignore
    let marker = new google.maps.Marker({ position: map.getCenter(), map });
    map.addListener('click', (e: any) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      if (marker) marker.setPosition({ lat, lng });
      else marker = new google.maps.Marker({ position: { lat, lng }, map });
      setMapPickerCoords({ lat, lng });
    });
  }, [showMapPicker, mapPickerCoords.lat, mapPickerCoords.lng]);

  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const STATUS_OPTIONS = ["Todo", "In Progress", "Done"];
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const createCampaign = async () => {
    setCampaignError("");

    if (!currentBusiness?.id || !newCampaign.type || !newCampaign.platform || !newCampaign.budget) {
      setCampaignError('Please fill in all required fields (Campaign Type, Platform, and Budget)');
      return;
    }

    try {
      // Get platform ID (for now, assume Instagram)
      const platformsResponse = await fetch('/api/platforms');
      if (!platformsResponse.ok) {
        setCampaignError('Failed to fetch platforms. Please try again.');
        return;
      }

      const platformsData = await platformsResponse.json();
      const platform = platformsData.platforms.find((p: any) => p.name === 'instagram');

      if (!platform) {
        setCampaignError('Instagram platform not found. Please contact support.');
        return;
      }

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: currentBusiness.id,
          platformId: platform.id,
          title: `${newCampaign.type} Campaign`,
          description: `${newCampaign.type} on ${newCampaign.platform}`,
          campaignType: newCampaign.type === 'Story Repost' ? 'story_reshare' : 'post_reshare',
          status: 'draft',
          budget: Number(newCampaign.budget),
          contentUrl: newCampaign.postUrl || null,
          requirements: `Campaign type: ${newCampaign.type}`,
          targetAudience: null,
          maxInfluencers: Number(newCampaign.maxInfluencers) || 1,
          autoAcceptBids: newCampaign.autoAcceptBids || false,
          startDate: newCampaign.bidStart ? new Date(newCampaign.bidStart).toISOString() : null,
          endDate: newCampaign.bidEnd ? new Date(newCampaign.bidEnd).toISOString() : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add to local state for immediate UI update
        const duration = { value: Number(newCampaign.durationValue || 0), unit: newCampaign.durationUnit || "days" };
        setCampaigns([...campaigns, {
          id: data.campaign.id,
          type: newCampaign.type,
          platform: newCampaign.platform,
          postUrl: newCampaign.postUrl,
          business: currentBusiness?.businessName || currentBusiness?.firstName + ' ' + currentBusiness?.lastName,
          status: 'draft',
          budget: Number(newCampaign.budget || 0),
          bidStart: newCampaign.bidStart || undefined,
          bidEnd: newCampaign.bidEnd || undefined,
          duration,
          createdAt: new Date().toISOString(),
          reach: newCampaign.reach ? Number(newCampaign.reach) : undefined,
          participants: [],
          selected: undefined,
          maxInfluencers: newCampaign.maxInfluencers ? Number(newCampaign.maxInfluencers) : 1
        }]);
        setShowCreateCampaign(false);
        setNewCampaign({ type: "", platform: "", postUrl: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days", reach: "", maxInfluencers: 1, autoAcceptBids: false });
        setCampaignError("");
      } else {
        const error = await response.json();
        console.error('Campaign creation error:', error);
        setCampaignError(error.error || error.message || 'Failed to create campaign. Please try again.');
      }
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      setCampaignError(`Network error: ${error.message || 'Failed to create campaign. Please check your connection.'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">{currentBusiness?.businessName || currentBusiness?.firstName + ' ' + currentBusiness?.lastName || 'Business'}</h1>
              <div className="text-sm text-gray-500">{currentBusiness?.industry || currentBusiness?.userType || ''}</div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={currentBusiness?.profileImageUrl} />
                      <AvatarFallback>{currentBusiness?.firstName?.[0]}{currentBusiness?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{currentBusiness?.firstName} {currentBusiness?.lastName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setView('settings')}>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('auth_token');
                    window.location.href = '/';
                  }}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Currently running or in bid</div>
              <div className="text-2xl font-bold mt-2">{activeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">All campaigns for your business</div>
              <div className="text-2xl font-bold mt-2">{myCampaigns.length}</div>
            </CardContent>
          </Card>
        </div>


        {/* Map Picker Modal */}
        {showMapPicker && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-3xl w-full rounded shadow p-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Pick Location</h3>
                <div>
                  <Button variant="outline" onClick={() => { setShowMapPicker(false); }}>{'Close'}</Button>
                </div>
              </div>
              <div ref={pickerMapRef} className="h-96 mb-4" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Selected: {mapPickerCoords.lat ? `${mapPickerCoords.lat.toFixed(6)}, ${mapPickerCoords.lng?.toFixed(6)}` : 'None'}</div>
                <div>
                  <Button variant="outline" onClick={() => {
                    if (mapPickerCoords.lat && mapPickerCoords.lng) {
                      setEditedBusiness({ ...editedBusiness, latitude: mapPickerCoords.lat, longitude: mapPickerCoords.lng });
                      setShowMapPicker(false);
                    } else {
                      alert('No location selected. Click on the map to pick a location.');
                    }
                  }}>Use Location</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="bids">
              Bids
              {bids.filter(b => b.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-brand-600">{bids.filter(b => b.status === 'pending').length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <section className="bg-white rounded border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Campaigns</h3>
                <div>
                  <Button onClick={() => setShowCreateCampaign(true)}>Create Campaign</Button>
                </div>
              </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="px-3 py-2">Campaign Type</th>
                  <th className="px-3 py-2">Platform</th>
                  <th className="px-3 py-2">Budget</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Dates</th>
                  <th className="px-3 py-2">Reach</th>
                  <th className="px-3 py-2">Needed</th>
                  <th className="px-3 py-2">Selected</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {myCampaigns.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-3 py-2">{c.type}</td>
                    <td className="px-3 py-2">{c.platform}</td>
                    <td className="px-3 py-2">{c.budget} INR</td>
                    <td className="px-3 py-2">
                      {c.status === 'closed' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">Closed</span>
                      ) : c.status === 'bid' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">Accepting Bids</span>
                      ) : c.status === 'draft' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">Draft</span>
                      ) : c.status === 'running' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-green-100 text-green-800">Running</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">{c.status}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Created: {formatDate(c.createdAt)}</div>
                        <div>Bid: {c.bidStart ? `${formatDate(c.bidStart)} → ${formatDate(c.bidEnd)}` : '—'}</div>
                        <div>Posted: {formatDate(c.postedAt)}</div>
                        <div>Completed: {formatDate(c.completedAt)}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2">{c.reach ? `${c.reach.toLocaleString()} people` : '—'}</td>
                    <td className="px-3 py-2">{typeof c.maxInfluencers === 'number' ? Math.max(0, c.maxInfluencers - (c.selected ? 1 : 0)) : '—'}</td>
                    <td className="px-3 py-2">{c.selected ? c.selected.name : '—'}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2 items-center flex-wrap">
                        {c.status === 'draft' ? (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
                            try {
                              const response = await fetch(`/api/campaigns/${c.id}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'bid' }),
                              });
                              if (response.ok) {
                                setCampaigns(campaigns.map((cc) => cc.id === c.id ? { ...cc, status: 'bid' } : cc));
                              }
                            } catch (error) {
                              console.error('Error opening bids:', error);
                              alert('Failed to open campaign for bidding');
                            }
                          }}>Open for Bids</Button>
                        ) : c.status === 'bid' ? (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={async () => {
                              try {
                                const response = await fetch(`/api/campaigns/${c.id}/status`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: 'running' }),
                                });
                                if (response.ok) {
                                  setCampaigns(campaigns.map((cc) => cc.id === c.id ? { ...cc, status: 'running' } : cc));
                                }
                              } catch (error) {
                                console.error('Error starting campaign:', error);
                                alert('Failed to start campaign');
                              }
                            }}>Start Campaign</Button>
                            <Button size="sm" variant="outline" onClick={async () => {
                              try {
                                const response = await fetch(`/api/campaigns/${c.id}/status`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: 'draft' }),
                                });
                                if (response.ok) {
                                  setCampaigns(campaigns.map((cc) => cc.id === c.id ? { ...cc, status: 'draft' } : cc));
                                }
                              } catch (error) {
                                console.error('Error closing bids:', error);
                                alert('Failed to close bidding');
                              }
                            }}>Close Bids</Button>
                          </>
                        ) : c.status === 'running' ? (
                          <Button size="sm" className="bg-gray-600 hover:bg-gray-700" onClick={async () => {
                            try {
                              const response = await fetch(`/api/campaigns/${c.id}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'closed' }),
                              });
                              if (response.ok) {
                                setCampaigns(campaigns.map((cc) => cc.id === c.id ? { ...cc, status: 'closed', completedAt: new Date().toISOString() } : cc));
                              }
                            } catch (error) {
                              console.error('Error closing campaign:', error);
                              alert('Failed to close campaign');
                            }
                          }}>Complete</Button>
                        ) : (
                          <div className="text-xs text-gray-500">Campaign closed</div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {myCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-sm text-gray-500">No campaigns yet. Create your first campaign.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
          </TabsContent>

          <TabsContent value="bids">
            <section className="bg-white rounded border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Received Bids</h3>
                <Button variant="outline" onClick={fetchBids}>Refresh</Button>
              </div>

              {bidsLoading ? (
                <div className="p-8 text-center text-gray-500">Loading bids...</div>
              ) : bids.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No bids received yet.</div>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <Card key={bid.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={bid.influencer?.profileImageUrl} />
                                <AvatarFallback>
                                  {bid.influencer?.firstName?.[0]}{bid.influencer?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">
                                  {bid.influencer?.firstName} {bid.influencer?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Campaign: {bid.campaign?.title}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500">Bid Amount:</span>
                                <span className="font-semibold ml-1">{bid.amount} INR</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Budget:</span>
                                <span className="font-semibold ml-1">{bid.campaign?.budget} INR</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Campaign Status:</span>
                                <Badge
                                  className={`ml-1 ${
                                    bid.campaign?.status === 'closed'
                                      ? 'bg-gray-100 text-gray-800'
                                      : bid.campaign?.status === 'bid'
                                      ? 'bg-blue-100 text-blue-800'
                                      : bid.campaign?.status === 'draft'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : bid.campaign?.status === 'running'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {bid.campaign?.status === 'bid' ? 'Accepting Bids' : bid.campaign?.status?.charAt(0).toUpperCase() + bid.campaign?.status?.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-gray-500">Bid Status:</span>
                                <Badge
                                  className={`ml-1 ${
                                    bid.status === 'accepted'
                                      ? 'bg-green-100 text-green-800'
                                      : bid.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : bid.status === 'completed'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {bid.status === 'accepted' && <CheckCircle className="h-3 w-3 mr-1 inline" />}
                                  {bid.status === 'rejected' && <XCircle className="h-3 w-3 mr-1 inline" />}
                                  {bid.status === 'pending' && <Clock className="h-3 w-3 mr-1 inline" />}
                                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Submitted:</span>
                                <span className="ml-1">{new Date(bid.createdAt).toLocaleDateString()}</span>
                              </div>
                              {bid.acceptedAt && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">Accepted:</span>
                                  <span className="ml-1">{new Date(bid.acceptedAt).toLocaleString()}</span>
                                </div>
                              )}
                              {bid.workStartedAt && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">Work Started:</span>
                                  <span className="ml-1">{new Date(bid.workStartedAt).toLocaleString()}</span>
                                </div>
                              )}
                              {bid.evidenceSubmittedAt && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">Evidence Submitted:</span>
                                  <span className="ml-1">{new Date(bid.evidenceSubmittedAt).toLocaleString()}</span>
                                </div>
                              )}
                              {bid.evidenceConfirmedAt && (
                                <div className="col-span-2">
                                  <span className="text-gray-500">Payment Confirmed:</span>
                                  <span className="ml-1">{new Date(bid.evidenceConfirmedAt).toLocaleString()}</span>
                                </div>
                              )}
                            </div>

                            {/* Timeline of workflow steps */}
                            {(bid.acceptedAt || bid.workStartedAt || bid.evidenceSubmittedAt || bid.evidenceConfirmedAt) && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <span className="text-gray-500 block mb-2 font-medium text-sm">Timeline:</span>
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
                              <div className="mt-2 text-sm text-gray-600">
                                {bid.proposal}
                              </div>
                            )}

                            {/* Evidence Submissions */}
                            {evidenceMap[bid.id] && evidenceMap[bid.id].length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <span className="text-gray-500 block mb-2 font-medium text-sm">Submitted Evidence:</span>
                                {evidenceMap[bid.id].map((evidence: any, idx: number) => (
                                  <div key={evidence.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">Evidence #{idx + 1}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          Submitted on {new Date(evidence.submittedAt).toLocaleString()}
                                        </div>
                                      </div>
                                      {evidence.isApproved !== null && (
                                        <Badge className={evidence.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                          {evidence.isApproved ? 'Approved' : 'Rejected'}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm">
                                        <span className="text-gray-500">Link: </span>
                                        <a
                                          href={evidence.evidenceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-brand-600 hover:text-brand-700 underline break-all"
                                        >
                                          {evidence.evidenceUrl}
                                        </a>
                                      </div>
                                      {evidence.description && (
                                        <div className="text-sm">
                                          <span className="text-gray-500">Description: </span>
                                          <span className="text-gray-900">{evidence.description}</span>
                                        </div>
                                      )}
                                      {evidence.reviewerNotes && (
                                        <div className="text-sm mt-2 pt-2 border-t border-blue-300">
                                          <span className="text-gray-500">Reviewer Notes: </span>
                                          <span className="text-gray-900">{evidence.reviewerNotes}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {bid.evidenceSubmittedAt && !bid.evidenceConfirmedAt && (
                              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                <div className="flex items-center justify-center gap-2 text-yellow-800">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium text-sm">Under Review by EchoX</span>
                                </div>
                                <p className="text-xs text-yellow-700 mt-1">Evidence is being reviewed by our team</p>
                              </div>
                            )}
                            {bid.evidenceConfirmedAt && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                                <div className="flex items-center justify-center gap-2 text-green-800">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="font-medium text-sm">Payment Credited to Influencer</span>
                                </div>
                                <p className="text-xs text-green-700 mt-1">Campaign completed successfully</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            {bid.status === 'pending' ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={async () => {
                                    try {
                                      // Accept the bid
                                      const bidResponse = await fetch(`/api/bids/${bid.id}/status`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          status: 'accepted',
                                          businessId: currentBusiness?.id
                                        }),
                                      });

                                      if (bidResponse.ok) {
                                        // Update campaign status to running
                                        if (bid.campaign?.id) {
                                          await fetch(`/api/campaigns/${bid.campaign.id}/status`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ status: 'running' }),
                                          });
                                        }

                                        await fetchBids();
                                        await fetchCampaigns();
                                        alert('Bid accepted! Campaign is now running.');
                                      }
                                    } catch (error) {
                                      console.error('Error accepting bid:', error);
                                      alert('Failed to accept bid');
                                    }
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(`/api/bids/${bid.id}/status`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                          status: 'rejected',
                                          businessId: currentBusiness?.id
                                        }),
                                      });
                                      if (response.ok) {
                                        await fetchBids();
                                        alert('Bid rejected');
                                      }
                                    } catch (error) {
                                      console.error('Error rejecting bid:', error);
                                      alert('Failed to reject bid');
                                    }
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Badge
                                className={
                                  bid.status === 'accepted'
                                    ? 'bg-green-100 text-green-800'
                                    : bid.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {bid.status === 'accepted' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {bid.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                                {bid.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>

        {/* Campaign View Modal */}
        {showCampaignModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-2xl w-full rounded shadow p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Campaign: {selectedCampaign.type}</h3>
                <div>
                  <Button variant="outline" onClick={() => setShowCampaignModal(false)}>Close</Button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Platform</div>
                    <div className="font-medium">{selectedCampaign.platform}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Budget</div>
                    <div className="font-medium">{selectedCampaign.budget} INR</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Reach</div>
                    <div className="font-medium">{selectedCampaign.reach ? `${selectedCampaign.reach.toLocaleString()} people` : '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <select value={selectedCampaign.status} onChange={(e) => setSelectedCampaign({ ...selectedCampaign, status: e.target.value })} className="w-full border rounded h-9 px-2">
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Dates</div>
                  <div className="text-sm text-gray-700">
                    <div>Created: {formatDate(selectedCampaign.createdAt)}</div>
                    <div>Bid: {selectedCampaign.bidStart ? `${formatDate(selectedCampaign.bidStart)} → ${formatDate(selectedCampaign.bidEnd)}` : '—'}</div>
                    <div>Posted: {formatDate(selectedCampaign.postedAt)}</div>
                    <div>Completed: {formatDate(selectedCampaign.completedAt)}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Participants</div>
                  <div className="text-sm text-gray-700">{(selectedCampaign.participants || []).length} influencers bidded</div>
                  <div className="mt-2 text-sm text-gray-500">Selected</div>
                  <div className="text-sm text-gray-700">{selectedCampaign.selected ? selectedCampaign.selected.name : 'None'}</div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCampaignModal(false)}>Cancel</Button>
                  <Button onClick={() => {
                    // save changes
                    setCampaigns(campaigns.map((c) => c.id === selectedCampaign.id ? { ...c, status: selectedCampaign.status, completedAt: selectedCampaign.status === 'Done' ? (c.completedAt || new Date().toISOString()) : c.completedAt } : c));
                    setShowCampaignModal(false);
                    setSelectedCampaign(null);
                  }}>Save</Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>


      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded shadow p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Campaign</h3>
            <div className="space-y-3">
              <div>
                <Label>Campaign Type</Label>
                <select value={newCampaign.type} onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })} className="w-full border rounded h-9 px-2">
                  <option value="">Select type</option>
                  <option value="Feed Post">Feed Post</option>
                  <option value="Story Repost">Story Repost</option>
                  <option value="Product Review">Product Review</option>
                </select>
              </div>

              <div>
                <Label>Social Platform</Label>
                <select value={newCampaign.platform} onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })} className="w-full border rounded h-9 px-2">
                  <option value="">Select platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>

              <div>
                <Label>Post URL (optional)</Label>
                <Input value={newCampaign.postUrl} onChange={(e) => setNewCampaign({ ...newCampaign, postUrl: e.target.value })} />
              </div>

              <div>
                <Label>Reach (estimated)</Label>
                <Input type="number" value={newCampaign.reach} onChange={(e) => setNewCampaign({ ...newCampaign, reach: e.target.value })} />
              </div>

              <div>
                <Label>Max Influencers</Label>
                <Input type="number" min={1} value={newCampaign.maxInfluencers} onChange={(e) => setNewCampaign({ ...newCampaign, maxInfluencers: Number(e.target.value) })} />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoAcceptBids"
                  checked={newCampaign.autoAcceptBids}
                  onChange={(e) => setNewCampaign({ ...newCampaign, autoAcceptBids: e.target.checked })}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <Label htmlFor="autoAcceptBids" className="cursor-pointer">
                  Auto-accept bids (automatically accept bids up to max influencers limit)
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Budget (INR)</Label>
                  <Input type="number" value={newCampaign.budget} onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })} />
                </div>
                <div>
                  <Label>Bid Start (date/time)</Label>
                  <Input type="datetime-local" value={newCampaign.bidStart} onChange={(e) => setNewCampaign({ ...newCampaign, bidStart: e.target.value })} />
                </div>
                <div>
                  <Label>Bid End (date/time)</Label>
                  <Input type="datetime-local" value={newCampaign.bidEnd} onChange={(e) => setNewCampaign({ ...newCampaign, bidEnd: e.target.value })} />
                </div>
                <div>
                  <Label>Duration</Label>
                  <div className="flex gap-2">
                    <Input type="number" value={newCampaign.durationValue} onChange={(e) => setNewCampaign({ ...newCampaign, durationValue: e.target.value })} />
                    <select value={newCampaign.durationUnit} onChange={(e) => setNewCampaign({ ...newCampaign, durationUnit: e.target.value })} className="border rounded h-9 px-2">
                      <option value="days">days</option>
                      <option value="weeks">weeks</option>
                    </select>
                  </div>
                </div>
              </div>

              {campaignError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {campaignError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => { setShowCreateCampaign(false); setCampaignError(""); }}>Cancel</Button>
                <Button onClick={createCampaign}>Save Campaign</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

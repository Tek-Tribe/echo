import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut, ChevronDown } from "lucide-react";

export default function BusinessDashboard() {
  const [currentBusiness, setCurrentBusiness] = useState<any>({
    id: "b1",
    name: "FitnessNutrition Co.",
    email: "contact@fitnessnutrition.co",
    phone: "+1 555 0099",
    address: "123 Wellness Ave, Austin, TX",
    industry: "Health & Wellness",
    category: "Supplements",
    latitude: 30.2672,
    longitude: -97.7431,
  });
  const [editedBusiness, setEditedBusiness] = useState<any>(currentBusiness);

  const [showMapPicker, setShowMapPicker] = useState(false);
  const pickerMapRef = useRef<HTMLDivElement | null>(null);
  const viewMapRef = useRef<HTMLDivElement | null>(null);
  const [mapPickerCoords, setMapPickerCoords] = useState<{ lat?: number; lng?: number }>({});

  const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [campaigns, setCampaigns] = useState<any[]>([
    {
      id: "c1",
      type: "Feed Post",
      platform: "Instagram",
      business: "FitnessNutrition Co.",
      status: "Doing",
      budget: 2500,
      postUrl: "",
      duration: { value: 3, unit: "days" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      bidStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      bidEnd: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      completedAt: undefined,
      reach: 42000,
      participants: [ { id: 'i1', name: 'Alex Johnson' }, { id: 'i2', name: 'Emma Wellness' } ],
      selected: { id: 'i1', name: 'Alex Johnson' },
      maxInfluencers: 2
    },
    {
      id: "c2",
      type: "Story Repost",
      platform: "Instagram",
      business: "FitnessNutrition Co.",
      status: "Done",
      budget: 500,
      postUrl: "",
      duration: { value: 1, unit: "days" },
      maxInfluencers: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      bidStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
      bidEnd: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      reach: 18500,
      participants: [ { id: 'i3', name: 'Mike Strong' } ],
      selected: { id: 'i3', name: 'Mike Strong' }
    },
    {
      id: "c3",
      type: "Product Review",
      platform: "YouTube",
      business: "Other Brand",
      status: "Done",
      budget: 1200,
      postUrl: "",
      duration: { value: 7, unit: "days" },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      bidStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19).toISOString(),
      bidEnd: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      reach: 76000,
      maxInfluencers: 1,
    },
  ]);

  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<any>({ type: "", platform: "", postUrl: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days", reach: "", maxInfluencers: 1 });

  const myCampaigns = campaigns.filter((c) => c.business === currentBusiness.name);
  const activeCount = myCampaigns.filter((c) => c.status !== "Done").length;
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

  const createCampaign = () => {
    const id = `c${Date.now()}`;
    const duration = { value: Number(newCampaign.durationValue || 0), unit: newCampaign.durationUnit || "days" };
    setCampaigns([...campaigns, { id, type: newCampaign.type, platform: newCampaign.platform, postUrl: newCampaign.postUrl, business: currentBusiness.name, status: newCampaign.status || "Todo", budget: Number(newCampaign.budget || 0), bidStart: newCampaign.bidStart || undefined, bidEnd: newCampaign.bidEnd || undefined, duration, createdAt: new Date().toISOString(), postedAt: newCampaign.postedAt || undefined, completedAt: newCampaign.completedAt || undefined, reach: newCampaign.reach ? Number(newCampaign.reach) : undefined, participants: [], selected: undefined, maxInfluencers: newCampaign.maxInfluencers ? Number(newCampaign.maxInfluencers) : 1 }]);
    setShowCreateCampaign(false);
    setNewCampaign({ type: "", platform: "", postUrl: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days", reach: "" });
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
              <h1 className="text-lg font-semibold text-gray-900">{currentBusiness.name}</h1>
              <div className="text-sm text-gray-500">{currentBusiness.industry}</div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{currentBusiness.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{currentBusiness.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowSettingsModal(true)}>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert('Logged out')}>
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
                    <td className="px-3 py-2">{c.status === 'Done' ? <span className="inline-flex items-center px-2 py-1 rounded text-sm bg-green-100 text-green-800">Done</span> : c.status}</td>
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
                      <div className="flex gap-2 items-center">
                        <Button size="sm" variant="outline" onClick={() => { setSelectedCampaign(c); setShowCampaignModal(true); }}>View</Button>
                        {c.status !== 'Done' ? (
                          <Button size="sm" onClick={() => {
                            setCampaigns(campaigns.map((cc) => cc.id === c.id ? { ...cc, status: 'Done', completedAt: new Date().toISOString() } : cc));
                          }}>Mark Done</Button>
                        ) : (
                          <div className="text-xs text-gray-500">Completed {c.completedAt ? `on ${formatDate(c.completedAt)}` : ''}</div>
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

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded shadow p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <div>
                <Button variant="outline" onClick={() => setShowSettingsModal(false)}>Close</Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <Input value={editedBusiness.name} onChange={(e) => setEditedBusiness({ ...editedBusiness, name: e.target.value })} className="w-full h-10" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={editedBusiness.email} onChange={(e) => setEditedBusiness({ ...editedBusiness, email: e.target.value })} className="w-full h-10" />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input type="password" placeholder="••••••••" className="w-full h-10" />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => { setCurrentBusiness({ ...currentBusiness, name: editedBusiness.name, email: editedBusiness.email }); setShowSettingsModal(false); }}>Save Account</Button>
                        <Button variant="outline" className="flex-1" onClick={() => alert('Reset password flow')}>Reset Password</Button>
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
                        <select className="w-full border rounded h-10 px-2">
                          <option>INR</option>
                          <option>USD</option>
                          <option>EC</option>
                        </select>
                      </div>
                      <div>
                        <Label>Timezone</Label>
                        <select className="w-full border rounded h-10 px-2">
                          <option>UTC</option>
                          <option>Asia/Kolkata</option>
                          <option>America/New_York</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => alert('Platform settings saved')}>Save Platform</Button>
                        <Button variant="outline" className="flex-1">Reset</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="font-medium">Theme</div>
                          <div className="text-xs text-gray-500">Choose light or dark — changes apply immediately</div>
                        </div>
                        <div>
                          <select className="border rounded h-10 px-2" value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Label>Industry</Label>
                        <Input value={editedBusiness.industry} onChange={(e) => setEditedBusiness({ ...editedBusiness, industry: e.target.value })} />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input value={editedBusiness.category} onChange={(e) => setEditedBusiness({ ...editedBusiness, category: e.target.value })} />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input value={editedBusiness.address} onChange={(e) => setEditedBusiness({ ...editedBusiness, address: e.target.value })} />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-600">{editedBusiness.latitude ? `${editedBusiness.latitude.toFixed(6)}, ${editedBusiness.longitude.toFixed(6)}` : 'Not set'}</div>
                          <Button variant="outline" onClick={() => { setMapPickerCoords({ lat: editedBusiness.latitude, lng: editedBusiness.longitude }); setShowMapPicker(true); }}>Edit Location</Button>
                        </div>
                        <div className="mt-3 h-32 w-full rounded border" ref={viewMapRef} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

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

              <div className="flex items-center justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>Cancel</Button>
                <Button onClick={createCampaign}>Save Campaign</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

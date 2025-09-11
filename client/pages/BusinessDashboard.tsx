import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState<any>(currentBusiness);

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
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      bidStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
      bidEnd: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      reach: 18500,
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
    },
  ]);

  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<any>({ type: "", platform: "", postUrl: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days", reach: "" });

  const myCampaigns = campaigns.filter((c) => c.business === currentBusiness.name);
  const activeCount = myCampaigns.filter((c) => c.status === "Doing" || c.status === "Bid").length;
  const totalBudget = myCampaigns.reduce((s, c) => s + Number(c.budget || 0), 0);

  const createCampaign = () => {
    const id = `c${Date.now()}`;
    const duration = { value: Number(newCampaign.durationValue || 0), unit: newCampaign.durationUnit || "days" };
    setCampaigns([...campaigns, { id, type: newCampaign.type, platform: newCampaign.platform, postUrl: newCampaign.postUrl, business: currentBusiness.name, status: newCampaign.status || "Draft", budget: Number(newCampaign.budget || 0), bidStart: newCampaign.bidStart || undefined, bidEnd: newCampaign.bidEnd || undefined, duration }]);
    setShowCreateCampaign(false);
    setNewCampaign({ type: "", platform: "", postUrl: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days" });
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
              <Link to="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Button onClick={() => setShowCreateCampaign(true)}>Create Campaign</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">Active Campaigns</div>
              <div className="text-2xl font-bold">{activeCount}</div>
              <div className="mt-4 text-sm text-gray-500">Total Campaigns</div>
              <div className="text-xl font-semibold">{myCampaigns.length}</div>
              <div className="mt-4 text-sm text-gray-500">Total Budget Allocated</div>
              <div className="text-xl font-semibold">{totalBudget} EC</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Info</CardTitle>
            </CardHeader>
            <CardContent>
              {!editingBusiness ? (
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Contact</div>
                      <div className="font-medium">{currentBusiness.email} • {currentBusiness.phone}</div>
                      <div className="mt-3 text-sm text-gray-500">Address</div>
                      <div className="text-sm">{currentBusiness.address}</div>
                      <div className="mt-3 text-sm text-gray-500">Industry</div>
                      <div className="text-sm">{currentBusiness.industry}</div>
                      <div className="mt-3 text-sm text-gray-500">Category</div>
                      <div className="text-sm">{currentBusiness.category}</div>
                      <div className="mt-3 text-sm text-gray-500">Location</div>
                      <div className="text-sm">{currentBusiness.latitude ? `${currentBusiness.latitude.toFixed(6)}, ${currentBusiness.longitude.toFixed(6)}` : 'Not set'}</div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" onClick={() => { setEditedBusiness(currentBusiness); setEditingBusiness(true); }}>Edit</Button>
                    </div>
                  </div>
                </div>
              ) : (
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
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingBusiness(false)}>Cancel</Button>
                    <Button size="sm" onClick={() => { setCurrentBusiness(editedBusiness); setEditingBusiness(false); }}>Save</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        <section className="bg-white rounded border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Campaigns</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="px-3 py-2">Campaign Type</th>
                  <th className="px-3 py-2">Platform</th>
                  <th className="px-3 py-2">Budget</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {myCampaigns.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-3 py-2">{c.type}</td>
                    <td className="px-3 py-2">{c.platform}</td>
                    <td className="px-3 py-2">{c.budget} EC</td>
                    <td className="px-3 py-2">{c.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => alert(JSON.stringify(c, null, 2))}>View</Button>
                        <Button size="sm" onClick={() => alert(`Mark campaign ${c.id} done`)}>Mark Done</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {myCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-sm text-gray-500">No campaigns yet. Create your first campaign.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Budget (EC)</Label>
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

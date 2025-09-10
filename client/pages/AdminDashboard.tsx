import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Briefcase,
  Grid,
  FileText,
  Settings,
  UserPlus,
  Search,
  MoreHorizontal,
  ChevronDown,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Store,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

type Role = "super_admin" | "admin_manager";

interface Manager {
  id: string;
  name: string;
  email: string;
  role: "Admin Manager" | "Super Admin";
  active: boolean;
}

interface Influencer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  categories: string[];
  profiles: { platform: string; handle: string }[];
}

interface Business {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  industry?: string;
}

interface Job {
  id: string;
  type: string;
  platform: string;
  business: string;
  status: string;
  budget: number;
}

export default function AdminDashboard() {
  const [role, setRole] = useState<Role>("super_admin");
  const [section, setSection] = useState<"dashboard" | "businesses" | "influencers" | "jobs" | "managers">("dashboard");

  const [managers, setManagers] = useState<Manager[]>([
    { id: "m1", name: "Priya Singh", email: "priya@echo.io", role: "Admin Manager", active: true },
    { id: "m2", name: "Sam Carter", email: "sam@echo.io", role: "Admin Manager", active: true },
  ]);

  const [influencers, setInfluencers] = useState<Influencer[]>([
    { id: "i1", name: "Alex Johnson", email: "alex@example.com", phone: "+1 555 1234", categories: ["Fitness"], profiles: [{ platform: "Instagram", handle: "@alex" }] },
    { id: "i2", name: "Maya Rodriguez", email: "maya@example.com", categories: ["Fashion"], profiles: [{ platform: "TikTok", handle: "@maya" }] },
  ]);

  const [businesses, setBusinesses] = useState<Business[]>([
    { id: "b1", name: "FitnessNutrition Co.", email: "contact@fitnessnut.com", phone: "+1 555 5678", address: "New York, NY", industry: "Fitness" },
    { id: "b2", name: "TechWear", email: "hello@techwear.com", phone: "+1 555 9012", address: "San Francisco, CA", industry: "Technology" },
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    { id: "j1", type: "Feed Post", platform: "Instagram", business: "FitnessNutrition Co.", status: "Doing", budget: 2500 },
    { id: "j2", type: "Video Creation", platform: "YouTube", business: "TechWear", status: "Bid", budget: 5000 },
  ]);

  // UI state for modals & forms
  const [showAddManager, setShowAddManager] = useState(false);
  const [showAddInfluencer, setShowAddInfluencer] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);

  const [newManager, setNewManager] = useState({ name: "", email: "", role: "Admin Manager", password: "" });
  const [newInfluencer, setNewInfluencer] = useState({ name: "", email: "", phone: "", profiles: "", categories: "" });
  const [newJob, setNewJob] = useState({ type: "", platform: "", business: "", budget: "" });

  const totalBusinesses = businesses.length;
  const totalInfluencers = influencers.length;
  const activeJobs = jobs.filter((j) => j.status === "Doing" || j.status === "Bid").length;
  const pendingSubmissions = 4; // sample

  const addManager = () => {
    const id = `m${Date.now()}`;
    setManagers([...managers, { id, name: newManager.name, email: newManager.email, role: newManager.role as any, active: true }]);
    setShowAddManager(false);
    setNewManager({ name: "", email: "", role: "Admin Manager", password: "" });
  };

  const toggleManagerActive = (id: string) => {
    setManagers(managers.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const addInfluencer = () => {
    const id = `i${Date.now()}`;
    const categories = newInfluencer.categories.split(",").map((s) => s.trim()).filter(Boolean);
    const profiles = newInfluencer.profiles.split(",").map((s) => {
      const [platform, handle] = s.split(":").map((p) => p.trim());
      return platform && handle ? { platform, handle } : { platform: "Unknown", handle: s.trim() };
    });
    setInfluencers([...influencers, { id, name: newInfluencer.name, email: newInfluencer.email, phone: newInfluencer.phone, categories, profiles }]);
    setShowAddInfluencer(false);
    setNewInfluencer({ name: "", email: "", phone: "", profiles: "", categories: "" });
  };

  const createJob = () => {
    const id = `j${Date.now()}`;
    setJobs([...jobs, { id, type: newJob.type, platform: newJob.platform, business: newJob.business, status: "Draft", budget: Number(newJob.budget || 0) }]);
    setShowCreateJob(false);
    setNewJob({ type: "", platform: "", business: "", budget: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded flex items-center justify-center">E</div>
              <div>
                <div className="text-sm font-bold">Echo Admin</div>
                <div className="text-xs text-gray-500">{role === "super_admin" ? "Super Admin" : "Admin Manager"}</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 text-sm">
            <button onClick={() => setSection("dashboard")} className={`w-full text-left px-3 py-2 rounded ${section === "dashboard" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <Grid className="inline-block mr-2" /> Dashboard
            </button>
            <button onClick={() => setSection("businesses")} className={`w-full text-left px-3 py-2 rounded ${section === "businesses" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <Store className="inline-block mr-2" /> Businesses
            </button>
            <button onClick={() => setSection("influencers")} className={`w-full text-left px-3 py-2 rounded ${section === "influencers" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <Users className="inline-block mr-2" /> Influencers
            </button>
            <button onClick={() => setSection("jobs")} className={`w-full text-left px-3 py-2 rounded ${section === "jobs" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <FileText className="inline-block mr-2" /> Jobs
            </button>
            {role === "super_admin" && (
              <button onClick={() => setSection("managers")} className={`w-full text-left px-3 py-2 rounded ${section === "managers" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                <UserPlus className="inline-block mr-2" /> Managers
              </button>
            )}
          </nav>

          <div className="p-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Switch Role (dev)</div>
            <div className="flex gap-2">
              <Button variant={role === "super_admin" ? undefined : "outline" as any} size="sm" onClick={() => setRole("super_admin")}>Super Admin</Button>
              <Button variant={role === "admin_manager" ? undefined : "outline" as any} size="sm" onClick={() => setRole("admin_manager")}>Admin Manager</Button>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1">
          <header className="bg-white border-b p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">{section === "dashboard" ? "Overview" : section.charAt(0).toUpperCase() + section.slice(1)}</h2>
              <div className="text-sm text-gray-500">Admin Console</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-sm text-gray-600">{role === "super_admin" ? "Signed in as Super Admin" : "Signed in as Admin Manager"}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7"><AvatarImage src="/placeholder.svg" /><AvatarFallback>AD</AvatarFallback></Avatar>
                    <span className="hidden sm:block">Admin User</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="p-4">
            {section === "dashboard" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-500">Total Businesses</div>
                      <div className="text-xl font-bold">{totalBusinesses}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-500">Total Influencers</div>
                      <div className="text-xl font-bold">{totalInfluencers}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-500">Active Jobs</div>
                      <div className="text-xl font-bold">{activeJobs}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs text-gray-500">Pending Submissions</div>
                      <div className="text-xl font-bold">{pendingSubmissions}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {jobs.slice(0, 5).map((j) => (
                          <div key={j.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{j.type}</div>
                              <div className="text-xs text-gray-500">{j.business} • {j.platform}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{j.budget} EC</div>
                              <Badge className="text-xs">{j.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Influencer Signups</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {influencers.slice(0, 5).map((inf) => (
                          <div key={inf.id} className="flex items-center gap-3 p-2 border rounded">
                            <Avatar className="h-8 w-8"><AvatarImage src="/placeholder.svg" /><AvatarFallback>{inf.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{inf.name}</div>
                              <div className="text-xs text-gray-500 truncate">{inf.email}</div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => alert(JSON.stringify(inf))}><Eye className="h-4 w-4 mr-1" />View</Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <Button onClick={() => setShowCreateJob(true)}>Create Job</Button>
                        <Button variant="outline" onClick={() => setShowAddInfluencer(true)}>Add Influencer</Button>
                        {role === "super_admin" && <Button variant="outline" onClick={() => setShowAddManager(true)}>Add Manager</Button>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {section === "managers" && role === "super_admin" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Admin Managers</h3>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search managers..." className="h-9" />
                    <Button onClick={() => setShowAddManager(true)}>Add Manager</Button>
                  </div>
                </div>

                <Card>
                  <CardContent>
                    <div className="space-y-2">
                      {managers.map((m) => (
                        <div key={m.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarImage src="/placeholder.svg" /><AvatarFallback>{m.name.charAt(0)}</AvatarFallback></Avatar>
                            <div>
                              <div className="font-medium">{m.name}</div>
                              <div className="text-xs text-gray-500">{m.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="text-xs">{m.role}</Badge>
                            <Button size="sm" variant={m.active ? undefined : "outline" as any} onClick={() => toggleManagerActive(m.id)}>{m.active ? "Deactivate" : "Reactivate"}</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {section === "influencers" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Influencers</h3>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search influencers..." className="h-9" />
                    <Button onClick={() => setShowAddInfluencer(true)}>Add Influencer</Button>
                  </div>
                </div>

                <Card>
                  <CardContent>
                    <div className="space-y-2">
                      {influencers.map((inf) => (
                        <div key={inf.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarImage src="/placeholder.svg" /><AvatarFallback>{inf.name.charAt(0)}</AvatarFallback></Avatar>
                            <div>
                              <div className="font-medium">{inf.name}</div>
                              <div className="text-xs text-gray-500">{inf.email}</div>
                              <div className="text-xs text-gray-400">{inf.categories.join(", ")}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => alert(JSON.stringify(inf))}>View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {section === "businesses" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Businesses</h3>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search businesses..." className="h-9" />
                    <Button onClick={() => alert('Add business modal would open')}>Add Business</Button>
                  </div>
                </div>

                <Card>
                  <CardContent>
                    <div className="space-y-2">
                      {businesses.map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{b.name}</div>
                            <div className="text-xs text-gray-500">{b.industry} • {b.address}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => alert(`View business ${b.name}`)}>View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {section === "jobs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Job Management</h3>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Filter by business, status..." className="h-9" />
                    <Button onClick={() => setShowCreateJob(true)}>Create Job</Button>
                  </div>
                </div>

                <Card>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="text-left text-xs text-gray-500">
                          <tr>
                            <th className="px-3 py-2">Job Type</th>
                            <th className="px-3 py-2">Platform</th>
                            <th className="px-3 py-2">Business</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Budget</th>
                            <th className="px-3 py-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          {jobs.map((j) => (
                            <tr key={j.id} className="border-t">
                              <td className="px-3 py-2">{j.type}</td>
                              <td className="px-3 py-2">{j.platform}</td>
                              <td className="px-3 py-2">{j.business}</td>
                              <td className="px-3 py-2"><Badge className="text-xs">{j.status}</Badge></td>
                              <td className="px-3 py-2">{j.budget} EC</td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => alert(`View job ${j.id}`)}>View</Button>
                                  <Button size="sm" onClick={() => alert(`Mark job ${j.id} done`)}>Mark Done</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Modals - simple inline modal implementations */}
      {showAddManager && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Add Admin Manager</h3>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={newManager.name} onChange={(e) => setNewManager({ ...newManager, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={newManager.email} onChange={(e) => setNewManager({ ...newManager, email: e.target.value })} />
              </div>
              <div>
                <Label>Role</Label>
                <select value={newManager.role} onChange={(e) => setNewManager({ ...newManager, role: e.target.value })} className="w-full border rounded h-9 px-2">
                  <option>Admin Manager</option>
                  <option>Super Admin</option>
                </select>
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={newManager.password} onChange={(e) => setNewManager({ ...newManager, password: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddManager(false)}>Cancel</Button>
              <Button onClick={addManager}>Create Manager</Button>
            </div>
          </div>
        </div>
      )}

      {showAddInfluencer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Add Influencer</h3>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={newInfluencer.name} onChange={(e) => setNewInfluencer({ ...newInfluencer, name: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={newInfluencer.email} onChange={(e) => setNewInfluencer({ ...newInfluencer, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={newInfluencer.phone} onChange={(e) => setNewInfluencer({ ...newInfluencer, phone: e.target.value })} />
              </div>
              <div>
                <Label>Social Profiles (format: Platform:handle, comma separated)</Label>
                <Input value={newInfluencer.profiles} onChange={(e) => setNewInfluencer({ ...newInfluencer, profiles: e.target.value })} />
              </div>
              <div>
                <Label>Categories (comma separated)</Label>
                <Input value={newInfluencer.categories} onChange={(e) => setNewInfluencer({ ...newInfluencer, categories: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddInfluencer(false)}>Cancel</Button>
              <Button onClick={addInfluencer}>Create Influencer</Button>
            </div>
          </div>
        </div>
      )}

      {showCreateJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-lg w-full rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Create Job</h3>
            <div className="space-y-3">
              <div>
                <Label>Job Type</Label>
                <Input value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })} />
              </div>
              <div>
                <Label>Platform</Label>
                <Input value={newJob.platform} onChange={(e) => setNewJob({ ...newJob, platform: e.target.value })} />
              </div>
              <div>
                <Label>Business</Label>
                <select value={newJob.business} onChange={(e) => setNewJob({ ...newJob, business: e.target.value })} className="w-full border rounded h-9 px-2">
                  <option value="">Select business</option>
                  {businesses.map((b) => (<option key={b.id} value={b.name}>{b.name}</option>))}
                </select>
              </div>
              <div>
                <Label>Budget (EC)</Label>
                <Input type="number" value={newJob.budget} onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreateJob(false)}>Cancel</Button>
              <Button onClick={createJob}>Save Job</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

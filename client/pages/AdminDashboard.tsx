import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
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
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
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
  place?: string;
  latitude?: number;
  longitude?: number;
  categories: string[];
  profiles: { platform: string; username: string; url?: string; followers?: number }[];
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
  postUrl?: string;
  business: string;
  status: string;
  budget: number;
  bidStart?: string;
  bidEnd?: string;
  duration?: { value: number; unit: string };
  participants?: string[];
}

export default function AdminDashboard() {
  const [role, setRole] = useState<Role>("super_admin");
  const [section, setSection] = useState<"dashboard" | "businesses" | "influencers" | "jobs" | "managers">("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const [managers, setManagers] = useState<Manager[]>([
    { id: "m1", name: "Priya Singh", email: "priya@echo.io", role: "Admin Manager", active: true },
    { id: "m2", name: "Sam Carter", email: "sam@echo.io", role: "Admin Manager", active: true },
  ]);

  const [influencers, setInfluencers] = useState<Influencer[]>([
    { id: "i1", name: "Alex Johnson", email: "alex@example.com", phone: "+1 555 1234", categories: ["Fitness"], profiles: [{ platform: "Instagram", username: "@alex", url: "https://instagram.com/alex", followers: 45000 }] },
    { id: "i2", name: "Maya Rodriguez", email: "maya@example.com", categories: ["Fashion"], profiles: [{ platform: "TikTok", username: "@maya", url: "https://tiktok.com/@maya", followers: 78000 }] },
  ]);

  const [businesses, setBusinesses] = useState<Business[]>([
    { id: "b1", name: "FitnessNutrition Co.", email: "contact@fitnessnut.com", phone: "+1 555 5678", address: "New York, NY", industry: "Fitness" },
    { id: "b2", name: "TechWear", email: "hello@techwear.com", phone: "+1 555 9012", address: "San Francisco, CA", industry: "Technology" },
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    { id: "j1", type: "Feed Post", platform: "Instagram", business: "FitnessNutrition Co.", status: "Doing", budget: 2500, participants: ["i1"] },
    { id: "j2", type: "Video Creation", platform: "YouTube", business: "TechWear", status: "Bid", budget: 5000, participants: ["i2"] },
  ]);

  // UI state for modals & forms
  const [showAddManager, setShowAddManager] = useState(false);
  const [showAddInfluencer, setShowAddInfluencer] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);

  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [showInfluencerModal, setShowInfluencerModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState({ newPassword: '', confirmPassword: '' });

  const [newManager, setNewManager] = useState({ name: "", email: "", role: "Admin Manager", password: "" });
  const [newInfluencer, setNewInfluencer] = useState<any>({ name: "", email: "", phone: "", place: "", latitude: "", longitude: "", profiles: [], categories: "" });
  const [newJob, setNewJob] = useState<any>({ type: "", platform: "", postUrl: "", business: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days", status: "Draft" });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

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
    const categories = (newInfluencer.categories || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    const profiles = (newInfluencer.profiles || []).map((p: any) => ({
      platform: p.platform || "Unknown",
      username: p.username || "",
      url: p.url || "",
      followers: Number(p.followers) || 0,
    }));
    setInfluencers([...influencers, { id, name: newInfluencer.name, email: newInfluencer.email, phone: newInfluencer.phone, place: newInfluencer.place, latitude: newInfluencer.latitude ? Number(newInfluencer.latitude) : undefined, longitude: newInfluencer.longitude ? Number(newInfluencer.longitude) : undefined, categories, profiles }]);
    setShowAddInfluencer(false);
    setNewInfluencer({ name: "", email: "", phone: "", place: "", latitude: "", longitude: "", profiles: [], categories: "" });
  };

  const createJob = () => {
    const id = `j${Date.now()}`;
    const duration = { value: Number(newJob.durationValue || 0), unit: newJob.durationUnit || "days" };
    setJobs([...jobs, { id, type: newJob.type, platform: newJob.platform, postUrl: newJob.postUrl, business: newJob.business, status: newJob.status || "Draft", budget: Number(newJob.budget || 0), bidStart: newJob.bidStart || undefined, bidEnd: newJob.bidEnd || undefined, duration }]);
    setShowCreateJob(false);
    setNewJob({ type: "", platform: "", postUrl: "", business: "", budget: "", bidStart: "", bidEnd: "", durationValue: "", durationUnit: "days", status: "Draft" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 hidden md:flex flex-col h-screen transition-all duration-200`}>
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/" className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded flex items-center justify-center">E</div>
              {!collapsed && (
                <div>
                  <div className="text-sm font-bold">Echo Admin</div>
                  <div className="text-xs text-gray-500">{role === "super_admin" ? "Super Admin" : "Admin Manager"}</div>
                </div>
              )}
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="hidden md:inline-flex h-8 w-8 p-0">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2 text-sm">
            <button onClick={() => setSection("dashboard")} className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'text-left px-3 py-2'} rounded ${section === "dashboard" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <Grid className="inline-block" />
              {!collapsed && <span className="ml-2">Dashboard</span>}
            </button>
            <button onClick={() => setSection("businesses")} className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'text-left px-3 py-2'} rounded ${section === "businesses" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <Store className="inline-block" />
              {!collapsed && <span className="ml-2">Businesses</span>}
            </button>
            <button onClick={() => setSection("influencers")} className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'text-left px-3 py-2'} rounded ${section === "influencers" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <Users className="inline-block" />
              {!collapsed && <span className="ml-2">Influencers</span>}
            </button>
            <button onClick={() => setSection("jobs")} className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'text-left px-3 py-2'} rounded ${section === "jobs" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
              <FileText className="inline-block" />
              {!collapsed && <span className="ml-2">Jobs</span>}
            </button>
            {role === "super_admin" && (
              <button onClick={() => setSection("managers")} className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'text-left px-3 py-2'} rounded ${section === "managers" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`}>
                <UserPlus className="inline-block" />
                {!collapsed && <span className="ml-2">Managers</span>}
              </button>
            )}
          </nav>

          <div className="p-4 border-t">
            <div className={`text-xs text-gray-500 mb-2 ${collapsed ? 'hidden' : ''}`}>Switch Role (dev)</div>
            <div className={`flex gap-2 ${collapsed ? 'justify-center' : ''}`}>
              <Button variant={role === "super_admin" ? undefined : "outline" as any} size="sm" onClick={() => setRole("super_admin")}>Super Admin</Button>
              <Button variant={role === "admin_manager" ? undefined : "outline" as any} size="sm" onClick={() => setRole("admin_manager")}>Admin Manager</Button>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1">
          <header className="bg-white border-b p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="md:hidden inline-flex items-center p-2" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <div className="text-sm text-gray-500">Admin Console</div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`hidden sm:block text-sm text-gray-600 ${collapsed ? 'hidden' : ''}`}>{role === "super_admin" ? "Signed in as Super Admin" : "Signed in as Admin Manager"}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-7 w-7"><AvatarImage src="/placeholder.svg" /><AvatarFallback>AD</AvatarFallback></Avatar>
                    <span className="hidden sm:block">Admin User</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSection('settings')}>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="p-4 pt-6">
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
                <CardContent className="p-6 pt-6">
                  <div className="space-y-2">
                        {influencers.slice(0, 5).map((inf) => (
                          <div key={inf.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border rounded">
                            <Avatar className="h-8 w-8"><AvatarImage src="/placeholder.svg" /><AvatarFallback>{inf.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{inf.name}</div>
                              <div className="text-xs text-gray-500 truncate">{inf.email}</div>
                            </div>
                            <div className="w-full sm:w-auto flex sm:justify-end">
                              <Button variant="outline" size="sm" onClick={() => { setSelectedInfluencer(inf); setShowInfluencerModal(true); }}>View</Button>
                            </div>
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                    <Input placeholder="Search managers..." className="h-9 w-full sm:w-auto flex-1" />
                    <Button onClick={() => setShowAddManager(true)} className="w-full sm:w-auto">Add Manager</Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6 pt-6">
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                    <Input placeholder="Search influencers..." className="h-9 w-full sm:w-auto flex-1" />
                    <Button onClick={() => setShowAddInfluencer(true)} className="w-full sm:w-auto">Add Influencer</Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6 pt-6">
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
                            <Button variant="outline" size="sm" onClick={() => { setSelectedInfluencer(inf); setShowInfluencerModal(true); }}>View</Button>
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                    <Input placeholder="Search businesses..." className="h-9 w-full sm:w-auto flex-1" />
                    <Button onClick={() => alert('Add business modal would open')} className="w-full sm:w-auto">Add Business</Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6 pt-6">
                    <div className="space-y-2">
                      {businesses.map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{b.name}</div>
                            <div className="text-xs text-gray-500">{b.industry} • {b.address}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => { setSelectedBusiness(b); setShowBusinessModal(true); }}>View</Button>
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                    <Input placeholder="Filter by business, status..." className="h-9 w-full sm:w-auto flex-1" />
                    <Button onClick={() => setShowCreateJob(true)} className="w-full sm:w-auto">Create Job</Button>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6 pt-6">
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
                                  <Button size="sm" variant="outline" onClick={() => { setSelectedJob(j); setShowJobModal(true); }}>View</Button>
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

            {section === "settings" && (
              <div className="p-4 pt-6">
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
                            <Input placeholder="Admin name" className="w-full h-10" />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input placeholder="admin@example.com" className="w-full h-10" />
                          </div>
                          <div>
                            <Label>Password</Label>
                            <Input type="password" placeholder="••••••••" className="w-full h-10" />
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1">Save Account</Button>
                            <Button variant="outline" className="flex-1">Reset</Button>
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
                              <option>Echo Coin (EC)</option>
                              <option>USD</option>
                              <option>INR</option>
                            </select>
                          </div>
                          <div>
                            <Label>Timezone</Label>
                            <select className="w-full border rounded h-10 px-2">
                              <option>UTC</option>
                              <option>America/New_York</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1">Save Platform</Button>
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
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Theme</div>
                              <div className="text-xs text-gray-500">Choose light or dark — changes apply immediately</div>
                            </div>
                            <div>
                              <select className="border rounded h-10 px-2" value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative w-64 bg-white border-r border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded flex items-center justify-center text-white font-bold">E</div>
                <div>
                  <div className="text-sm font-bold">Echo Admin</div>
                  <div className="text-xs text-gray-500">{role === "super_admin" ? "Super Admin" : "Admin Manager"}</div>
                </div>
              </div>
              <button className="p-2" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            <nav className="space-y-2">
              <button onClick={() => { setSection("dashboard"); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Dashboard</button>
              <button onClick={() => { setSection("businesses"); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Businesses</button>
              <button onClick={() => { setSection("influencers"); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Influencers</button>
              <button onClick={() => { setSection("jobs"); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Jobs</button>
              {role === "super_admin" && <button onClick={() => { setSection("managers"); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Managers</button>}
              <button onClick={() => { setSection("settings"); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Settings</button>
            </nav>
          </aside>
        </div>
      )}

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
          <div className="bg-white max-w-2xl w-full rounded shadow p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Influencer</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input value={newInfluencer.name} onChange={(e) => setNewInfluencer({ ...newInfluencer, name: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={newInfluencer.phone} onChange={(e) => setNewInfluencer({ ...newInfluencer, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={newInfluencer.email} onChange={(e) => setNewInfluencer({ ...newInfluencer, email: e.target.value })} />
                </div>
                <div>
                  <Label>Place / Address</Label>
                  <Input value={newInfluencer.place} onChange={(e) => setNewInfluencer({ ...newInfluencer, place: e.target.value })} />
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input value={newInfluencer.latitude} onChange={(e) => setNewInfluencer({ ...newInfluencer, latitude: e.target.value })} />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input value={newInfluencer.longitude} onChange={(e) => setNewInfluencer({ ...newInfluencer, longitude: e.target.value })} />
                </div>
              </div>

              <div>
                <Label>Social Media Profiles</Label>
                <div className="space-y-2">
                  {(newInfluencer.profiles || []).map((p: any, idx: number) => (
                    <div key={idx} className="border rounded p-2">
                      <div className="grid grid-cols-12 gap-2">
                        {/* First row: Platform, Username, Followers */}
                        <div className="col-span-12 sm:col-span-4">
                          <select className="w-full border rounded h-9 px-2" value={p.platform} onChange={(e) => {
                            const profiles = [...newInfluencer.profiles]; profiles[idx] = { ...profiles[idx], platform: e.target.value }; setNewInfluencer({ ...newInfluencer, profiles });
                          }}>
                            <option value="">Select platform</option>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                            <option value="LinkedIn">LinkedIn</option>
                          </select>
                        </div>
                        <div className="col-span-12 sm:col-span-4">
                          <Input className="w-full min-w-0" placeholder="Username" value={p.username} onChange={(e) => {
                            const profiles = [...newInfluencer.profiles]; profiles[idx] = { ...profiles[idx], username: e.target.value }; setNewInfluencer({ ...newInfluencer, profiles });
                          }} />
                        </div>
                        <div className="col-span-12 sm:col-span-4">
                          <Input className="w-full min-w-0" placeholder="Followers" value={p.followers} onChange={(e) => {
                            const profiles = [...newInfluencer.profiles]; profiles[idx] = { ...profiles[idx], followers: e.target.value }; setNewInfluencer({ ...newInfluencer, profiles });
                          }} />
                        </div>

                        {/* Second row: Profile URL and Remove button */}
                        <div className="col-span-12 sm:col-span-10">
                          <Input className="w-full min-w-0" placeholder="Profile URL" value={p.url} onChange={(e) => {
                            const profiles = [...newInfluencer.profiles]; profiles[idx] = { ...profiles[idx], url: e.target.value }; setNewInfluencer({ ...newInfluencer, profiles });
                          }} />
                        </div>
                        <div className="col-span-12 sm:col-span-2 flex items-center justify-end">
                          <Button variant="ghost" size="sm" onClick={() => { const profiles = [...newInfluencer.profiles]; profiles.splice(idx, 1); setNewInfluencer({ ...newInfluencer, profiles }); }}>Remove</Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" onClick={() => setNewInfluencer({ ...newInfluencer, profiles: [...(newInfluencer.profiles || []), { platform: '', username: '', url: '', followers: '' }] })}>Add Profile</Button>
                </div>
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

      {/* Business Detail Modal */}
      {showBusinessModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded shadow p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedBusiness.name}</h3>
                <div className="text-sm text-gray-600">{selectedBusiness.email} • {selectedBusiness.phone}</div>
                <div className="text-sm text-gray-500">{selectedBusiness.address} • {selectedBusiness.industry}</div>
              </div>
              <div>
                <Button variant="outline" onClick={() => setShowBusinessModal(false)}>Close</Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Jobs by this Business</h4>
              <div className="space-y-2">
                {jobs.filter((j) => j.business === selectedBusiness.name).map((j) => (
                  <div key={j.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{j.type} • {j.platform}</div>
                      <div className="text-xs text-gray-500">{j.status} • {j.budget} EC</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedJob(j); setShowJobModal(true); }}>View Job</Button>
                    </div>
                  </div>
                ))}
                {jobs.filter((j) => j.business === selectedBusiness.name).length === 0 && (
                  <div className="text-sm text-gray-500">No jobs found for this business.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded shadow p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create Job</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Job Type</Label>
                  <select value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })} className="w-full border rounded h-9 px-2">
                    <option value="">Select type</option>
                    <option value="Story">Story</option>
                    <option value="Post">Post</option>
                    <option value="Reshare">Reshare</option>
                  </select>
                </div>
                <div>
                  <Label>Social Platform</Label>
                  <select value={newJob.platform} onChange={(e) => setNewJob({ ...newJob, platform: e.target.value })} className="w-full border rounded h-9 px-2">
                    <option value="">Select platform</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Twitter">Twitter</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label>Post URL (optional)</Label>
                  <Input value={newJob.postUrl} onChange={(e) => setNewJob({ ...newJob, postUrl: e.target.value })} />
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

                <div>
                  <Label>Bid Start (date/time)</Label>
                  <Input type="datetime-local" value={newJob.bidStart} onChange={(e) => setNewJob({ ...newJob, bidStart: e.target.value })} />
                </div>
                <div>
                  <Label>Bid End (date/time)</Label>
                  <Input type="datetime-local" value={newJob.bidEnd} onChange={(e) => setNewJob({ ...newJob, bidEnd: e.target.value })} />
                </div>

                <div>
                  <Label>Expected Duration</Label>
                  <div className="flex gap-2">
                    <Input type="number" value={newJob.durationValue} onChange={(e) => setNewJob({ ...newJob, durationValue: e.target.value })} />
                    <select value={newJob.durationUnit} onChange={(e) => setNewJob({ ...newJob, durationUnit: e.target.value })} className="border rounded h-9 px-2">
                      <option value="days">days</option>
                      <option value="hours">hours</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowCreateJob(false)}>Cancel</Button>
              <Button onClick={createJob}>Save Job</Button>
            </div>
          </div>
        </div>
      )}

      {/* Influencer Detail Modal */}
      {showInfluencerModal && selectedInfluencer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full rounded shadow p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedInfluencer.name}</h3>
                <div className="text-sm text-gray-600">{selectedInfluencer.email} • {selectedInfluencer.phone}</div>
                <div className="text-sm text-gray-500">{selectedInfluencer.place}{selectedInfluencer.latitude ? ` • ${selectedInfluencer.latitude}, ${selectedInfluencer.longitude}` : ''}</div>
              </div>
              <div>
                <Button variant="outline" onClick={() => setShowInfluencerModal(false)}>Close</Button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Social Profiles</h4>
              <div className="space-y-2">
                {selectedInfluencer.profiles.map((p) => (
                  <div key={p.username} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{p.platform} • {p.username}</div>
                      <div className="text-xs text-gray-500">{p.url} • {p.followers?.toLocaleString()} followers</div>
                    </div>
                    <div>
                      <a href={p.url} target="_blank" rel="noreferrer"><Button variant="outline" size="sm">Open</Button></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Jobs Participated</h4>
              <div className="space-y-2">
                {jobs.filter((j) => (j.participants || []).includes(selectedInfluencer.id)).map((j) => (
                  <div key={j.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{j.type} • {j.platform}</div>
                      <div className="text-xs text-gray-500">{j.business} • {j.budget} EC</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedJob(j); setShowJobModal(true); }}>View Job</Button>
                    </div>
                  </div>
                ))}
                {jobs.filter((j) => (j.participants || []).includes(selectedInfluencer.id)).length === 0 && (
                  <div className="text-sm text-gray-500">No job participation records found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full rounded shadow p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedJob.type} - {selectedJob.platform}</h3>
                <div className="text-sm text-gray-500">{selectedJob.business}</div>
              </div>
              <div>
                <Button variant="outline" onClick={() => setShowJobModal(false)}>Close</Button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Budget</div>
                <div className="font-semibold">{selectedJob.budget} EC</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-semibold">{selectedJob.status}</div>
              </div>
              {selectedJob.postUrl && (
                <div>
                  <div className="text-xs text-gray-500">Post URL</div>
                  <a href={selectedJob.postUrl} className="text-sm text-blue-600" target="_blank" rel="noreferrer">{selectedJob.postUrl}</a>
                </div>
              )}
              <div>
                <div className="text-xs text-gray-500">Bid Window</div>
                <div className="text-sm">{selectedJob.bidStart || 'N/A'} to {selectedJob.bidEnd || 'N/A'}</div>
              </div>
              {selectedJob.duration && (
                <div>
                  <div className="text-xs text-gray-500">Expected Duration</div>
                  <div className="text-sm">{selectedJob.duration.value} {selectedJob.duration.unit}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Phone,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const campaignTypes = [
  { value: "story-reshare", label: "Instagram Story Reshare" },
  { value: "post-reshare", label: "Instagram Post Reshare" },
];

const annualSpendRanges = [
  { value: "under-1l", label: "Under ₹1,00,000" },
  { value: "1l-5l", label: "₹1,00,000 – ₹5,00,000" },
  { value: "5l-10l", label: "₹5,00,000 – ₹10,00,000" },
  { value: "10l-plus", label: "Above ₹10,00,000" },
];

interface RegistrationForm {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  instagramHandle: string;
  website: string;
  campaignType: string;
  monthlyBudget: string;
  annualSpend: string;
  goals: string;
}

const defaultFormState: RegistrationForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  instagramHandle: "",
  website: "",
  campaignType: campaignTypes[0]?.value ?? "story-reshare",
  monthlyBudget: "",
  annualSpend: annualSpendRanges[0]?.value ?? "under-1l",
  goals: "",
};

export default function BusinessRegistration() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RegistrationForm>(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);

  const canSubmit = useMemo(() => {
    return (
      formData.businessName.trim().length > 1 &&
      formData.contactName.trim().length > 1 &&
      formData.email.trim().length > 3 &&
      formData.phone.trim().length >= 10 &&
      formData.instagramHandle.trim().length > 1 &&
      formData.monthlyBudget.trim().length > 0
    );
  }, [
    formData.businessName,
    formData.contactName,
    formData.email,
    formData.phone,
    formData.instagramHandle,
    formData.monthlyBudget,
  ]);

  const updateField = <K extends keyof RegistrationForm>(
    field: K,
    value: RegistrationForm[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmissionCount((count) => count + 1);
    setIsSubmitting(false);
    setFormData(defaultFormState);

    toast({
      title: "Registration submitted",
      description:
        "Our business success team will reach out within one business day.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-100 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              EX
            </div>
            EchoX for Businesses
          </Link>
          <Button asChild variant="ghost">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <section className="space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              <Shield className="h-3.5 w-3.5" />
              Trusted Onboarding
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Register your business to launch Instagram reshare campaigns
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              Tell us about your brand, campaign goals, and budget. Our team
              will verify your profile, craft the ideal brief, and match you
              with vetted influencers who deliver measurable results in INR.
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Business details</CardTitle>
              <CardDescription>
                Provide your contact information and preferred campaign
                structure so we can set up your account swiftly.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <CardContent className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business name</Label>
                    <Input
                      id="businessName"
                      placeholder="Eg. Glow Cosmetics Pvt. Ltd."
                      value={formData.businessName}
                      onChange={(event) =>
                        updateField("businessName", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Primary contact</Label>
                    <Input
                      id="contactName"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={(event) =>
                        updateField("contactName", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instagramHandle">Instagram handle</Label>
                    <Input
                      id="instagramHandle"
                      placeholder="@yourbrandofficial"
                      value={formData.instagramHandle}
                      onChange={(event) =>
                        updateField("instagramHandle", event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input
                      id="website"
                      placeholder="https://"
                      value={formData.website}
                      onChange={(event) =>
                        updateField("website", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="campaignType">Campaign type</Label>
                    <Select
                      value={formData.campaignType}
                      onValueChange={(value) =>
                        updateField("campaignType", value)
                      }
                    >
                      <SelectTrigger id="campaignType">
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignTypes.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyBudget">
                      Monthly campaign budget (INR)
                    </Label>
                    <Input
                      id="monthlyBudget"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="₹50,000"
                      value={formData.monthlyBudget}
                      onChange={(event) =>
                        updateField("monthlyBudget", event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualSpend">
                    Estimated annual influencer spend
                  </Label>
                  <Select
                    value={formData.annualSpend}
                    onValueChange={(value) => updateField("annualSpend", value)}
                  >
                    <SelectTrigger id="annualSpend">
                      <SelectValue placeholder="Select spend range" />
                    </SelectTrigger>
                    <SelectContent>
                      {annualSpendRanges.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">
                    What results do you want to achieve?
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="Share your objectives for Instagram reshare campaigns, such as reach, website visits, conversions, or new product discovery."
                    value={formData.goals}
                    onChange={(event) =>
                      updateField("goals", event.target.value)
                    }
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/60 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Secure onboarding • Zero platform fees till launch
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit registration"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card className="border-0 bg-brand-900 text-brand-50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Why brands pick EchoX
              </CardTitle>
              <CardDescription className="text-brand-100">
                Purpose-built for Instagram collaborations with transparent
                pricing in INR and dedicated campaign managers.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-500/40 p-2">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Account activation in 48 hours
                  </h3>
                  <p className="text-sm text-brand-100/90">
                    Verified onboarding ensures your campaigns can go live
                    within two business days after approval.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-500/40 p-2">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Pre-vetted influencer pool
                  </h3>
                  <p className="text-sm text-brand-100/90">
                    Work with influencers who specialise in Instagram reshares
                    across lifestyle, beauty, fitness, and D2C niches.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-500/40 p-2">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Dedicated campaign strategist
                  </h3>
                  <p className="text-sm text-brand-100/90">
                    Receive tailored campaign guidance, reporting dashboards,
                    and WhatsApp support in IST business hours.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 text-brand-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-wide text-brand-200">
                      Successful submissions
                    </div>
                    <div className="text-3xl font-semibold text-white">
                      {Math.max(submissionCount, 28)}
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-brand-200" />
                </div>
                <p className="mt-2 text-sm text-brand-100/90">
                  Brands trust EchoX to launch reshare campaigns that convert
                  attention into measurable outcomes.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}

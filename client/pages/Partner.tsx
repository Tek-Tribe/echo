import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Instagram, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function Partner() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    instagramHandle: '',
    instagramFollowers: '',
    niche: '',
    location: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, we'll just show success. In production, you'd save this to your database
      // or send to your backend to process the partnership interest
      console.log('Partnership interest submitted:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitted(true);
    } catch (err: any) {
      setError('Failed to submit your interest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-gradient-to/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank you for your interest!
            </h1>
            <p className="text-gray-600 mb-6">
              We've received your partnership application. Our team will review your profile and get back to you within 2-3 business days.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              We'll send you an email with next steps and how to access your influencer dashboard once approved.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white">
                Back to Home
              </Button>
            </Link>
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full">
                Already have an account? Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-gradient-to/10 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">EchoX</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Partner with us
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join our network of successful influencers and start monetizing your social media presence with authentic brand collaborations.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Instagram Focused
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We specialize in Instagram story and post collaborations with verified brands
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Grow Your Earnings
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Set your own rates and get paid quickly after completing campaigns
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Quality Partnerships
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Work with reputable brands that align with your audience and values
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-lg border border-brand-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens next?
              </h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li>1. We review your profile and Instagram presence</li>
                <li>2. Our team reaches out within 2-3 business days</li>
                <li>3. You get access to campaigns matching your niche</li>
                <li>4. Start earning from brand collaborations!</li>
              </ol>
            </div>
          </div>

          {/* Right side - Form */}
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Tell us about yourself
              </CardTitle>
              <CardDescription className="text-gray-600">
                Share your details so we can find the best brand matches for you
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagramHandle">Instagram Handle *</Label>
                  <Input
                    id="instagramHandle"
                    placeholder="@johndoe"
                    value={formData.instagramHandle}
                    onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagramFollowers">Followers Count</Label>
                    <Input
                      id="instagramFollowers"
                      type="number"
                      placeholder="5000"
                      value={formData.instagramFollowers}
                      onChange={(e) => setFormData({ ...formData, instagramFollowers: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niche">Content Niche</Label>
                    <Input
                      id="niche"
                      placeholder="Fashion, Travel, Tech..."
                      value={formData.niche}
                      onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="New York, NY"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Tell us about your content (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Describe your content style, audience, and what makes you unique..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={loading}
                    rows={3}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Partnership Interest'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our terms and privacy policy
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
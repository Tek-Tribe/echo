import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { apiClient } from '@shared/api/client';

const demoAccounts = [
  {
    role: 'Business',
    description: 'Access the brand dashboard with campaign management tools.',
    email: 'demo-business@echox.app',
    password: 'EchoX#2025',
  },
  {
    role: 'Influencer',
    description: 'Preview influencer bidding and collaboration experience.',
    email: 'demo-influencer@echox.app',
    password: 'EchoX#2025',
  },
  {
    role: 'Admin',
    description: 'Review governance, dispute handling, and platform analytics.',
    email: 'demo-admin@echox.app',
    password: 'EchoX#2025',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.auth.login(formData.email, formData.password);

      // Store user info in localStorage (in production, use proper token management)
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('profile', JSON.stringify(response.profile));
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      // Redirect based on user role
      switch (response.user.userType) {
        case 'business':
          navigate('/business-dashboard');
          break;
        case 'influencer':
          navigate('/influencer-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-brand-50/30 to-white">
      <header className="border-b border-gray-100 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-gradient-to text-white">
              EX
            </div>
            EchoX Login
          </Link>
          <Button asChild variant="ghost" className="text-sm font-medium text-brand-700">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-gradient-to rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">EchoX</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
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
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-4">
                Don't have an account?
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link to="/register/business" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-brand-200 text-brand-700 hover:bg-brand-50"
                  >
                    Join as Business
                  </Button>
                </Link>
                <Link to="/partner" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Partner with us
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="#"
                className="text-sm text-brand-600 hover:text-brand-700"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

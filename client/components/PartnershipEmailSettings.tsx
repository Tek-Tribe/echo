import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

interface PartnershipEmailSettingsProps {
  userId?: string;
}

export function PartnershipEmailSettings({ userId }: PartnershipEmailSettingsProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCurrentEmail();
  }, []);

  const fetchCurrentEmail = async () => {
    try {
      setFetching(true);
      const response = await fetch('/api/config/partnership-email');

      if (response.ok) {
        const data = await response.json();
        setEmail(data.email || '');
      } else if (response.status === 404) {
        // Setting doesn't exist yet
        setEmail('');
      }
    } catch (error) {
      console.error('Error fetching partnership email:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/config/partnership-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          updatedBy: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update email');
      }

      toast({
        title: 'Settings Updated',
        description: 'Partnership notification email has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating partnership email:', error);
      toast({
        title: 'Error',
        description: 'Failed to update partnership notification email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Partnership Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="partnership-email">Notification Email</Label>
            <Input
              id="partnership-email"
              type="email"
              placeholder="partnerships@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={fetching || loading}
              className="w-full h-10"
            />
            <p className="text-xs text-gray-500 mt-1">
              Partnership applications will be forwarded to this email address
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={loading || fetching}
            >
              {loading ? 'Saving...' : 'Save Email'}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={fetchCurrentEmail}
              disabled={loading || fetching}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

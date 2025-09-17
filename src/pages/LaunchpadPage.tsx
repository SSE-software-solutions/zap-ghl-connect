import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

export const LaunchpadPage = () => {
  const [username, setUsername] = useState<string>('');
  const [instancesCount, setInstancesCount] = useState<number>(0);
  const [maxInstances, setMaxInstances] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>('');
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);

  const getBackendBase = () => {
    const raw = (import.meta as any).env?.VITE_API_BASE_URL || '';
    const withProtocol = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
    const base = raw ? withProtocol(String(raw)) : '';
    return base.replace(/\/$/, '');
  };

  useEffect(() => {
    const name = localStorage.getItem('auth_username') || '';
    setUsername(name);
    const storedMax = localStorage.getItem('auth_max_instances');
    setMaxInstances(storedMax ? Number(storedMax) : null);
    const storedPlan = localStorage.getItem('auth_plan') || '';
    setPlan(storedPlan);
    const storedTrial = localStorage.getItem('auth_trial_ends_at');
    setTrialEndsAt(storedTrial === 'null' ? null : (storedTrial || null));
    const token = localStorage.getItem('auth_token') || '';
    setApiKey(token);
    
    const base = getBackendBase();
    if (!token || !base) return;
    const url = `${base}/api/instances/`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
      .then(r => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data)) setInstancesCount(data.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hey, {username || 'Usuario'} 👋</h1>
        <p className="text-muted-foreground">
          Let's scale your service offering with voice and automation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subaccounts</p>
                <p className="text-2xl font-bold">{instancesCount}/{maxInstances ?? 0}</p>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="mr-2">Current plan:</span>
                  <span className="font-medium">{plan ? (plan.charAt(0).toUpperCase() + plan.slice(1)) : '—'}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {trialEndsAt && trialEndsAt !== 'null' ? (
                    <span>Active free trial • ends at {new Date(trialEndsAt).toLocaleString()}</span>
                  ) : (
                    <span>Free trial expired</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* API key for automations */}
        <Card>
          <CardHeader>
            <CardTitle>API KEY FOR AUTOMATIONS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 items-center">
              <Input readOnly type={showKey ? 'text' : 'password'} value={apiKey} placeholder="No API key available" className="flex-1" />
              <Button variant="outline" onClick={() => setShowKey(!showKey)}>{showKey ? 'Hide' : 'Show'}</Button>
              <Button variant="outline" onClick={() => apiKey && navigator.clipboard.writeText(apiKey)}>Copy</Button>
            </div>
            <p className="text-xs text-muted-foreground">Use this key in your automation tools. Keep it secret.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
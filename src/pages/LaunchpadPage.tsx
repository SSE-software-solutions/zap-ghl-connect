import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export const LaunchpadPage = () => {
  const [username, setUsername] = useState<string>('');
  const [instancesCount, setInstancesCount] = useState<number>(0);

  const getBackendBase = () => {
    const raw = (import.meta as any).env?.VITE_API_BASE_URL || '';
    const withProtocol = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
    const base = raw ? withProtocol(String(raw)) : '';
    return base.replace(/\/$/, '');
  };

  useEffect(() => {
    const name = localStorage.getItem('auth_username') || '';
    setUsername(name);

    const token = localStorage.getItem('auth_token') || '';
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
                <p className="text-2xl font-bold">{instancesCount}/{instancesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
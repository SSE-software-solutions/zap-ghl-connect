import { useState, useEffect } from 'react';
import { Eye, EyeOff, MoreHorizontal, ExternalLink, Trash2, Copy, Zap, RefreshCw, Users, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { encryptPayload } from '@/lib/secure-link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Instance {
  id: number;
  instance_name: string;
  instance_url: string;
  api_key: string;
  internal_url: string;
  instance_port: number;
  webhook_url: string;
  is_connected: boolean;
  sessions?: string[];
}

interface StaffMember {
  id: number | string;
  name: string;
  email: string;
  is_active: boolean;
}

export const SubaccountsPage = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [maxInstances, setMaxInstances] = useState<number | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  // Removed detail sheet; keep state unused for backward compatibility if any handler still references
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGhlModalOpen, setIsGhlModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectUrl, setConnectUrl] = useState('');
  const [selectedConnectInstanceName, setSelectedConnectInstanceName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [visibleApiKeys, setVisibleApiKeys] = useState<Record<number, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [selectedSyncInstance, setSelectedSyncInstance] = useState<Instance | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>('default');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSessions, setSyncSessions] = useState<string[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [staffByInstance, setStaffByInstance] = useState<Record<number, { loading: boolean; items: StaffMember[] }>>({});
  const [syncingStaff, setSyncingStaff] = useState<Record<number, boolean>>({});
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectInstance, setConnectInstance] = useState<Instance | null>(null);
  const [connectAssignments, setConnectAssignments] = useState<{ staffId: string; staffName: string; email: string; sessionName: string }[]>([]);
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectAvailableSessions, setConnectAvailableSessions] = useState<string[]>([]);
  const [selectedSessionByStaff, setSelectedSessionByStaff] = useState<Record<string, string>>({});
  const [assignLoadingByStaff, setAssignLoadingByStaff] = useState<Record<string, boolean>>({});

  const getApiBase = () => {
    const raw = (import.meta as any).env?.VITE_API_BASE_URL || 'https://fair-turkey-quickly.ngrok-free.app';
    const withProtocol = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
    return withProtocol(String(raw)).replace(/\/$/, '');
  };

  const syncContacts = async () => {
    if (!selectedSyncInstance) return;
    try {
      setIsSyncing(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'Not authenticated', description: 'Please sign in again', variant: 'destructive' });
        setIsSyncing(false);
        return;
      }
      const sanitizedBase = getApiBase();
      const sessionToUse = selectedSession || 'default';
      const url = `${sanitizedBase}/api/instances/${encodeURIComponent(String(selectedSyncInstance.id))}/sync-contacts?session=${encodeURIComponent(sessionToUse)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (!response.ok) {
        throw new Error('sync-failed');
      }
      toast({ title: 'Sync started', description: 'Runs in background and returns immediately.' });
      setIsSyncModalOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Could not start sync', variant: 'destructive' });
    } finally {
      setIsSyncing(false);
    }
  };

  const generateLocationId = (id: number) => {
    const hash = `fm${id}l...x${id}mfy`;
    return hash;
  };

  const createInstance = async () => {
    try {
      setIsCreating(true);
      setIsCreateModalOpen(false); // close immediately
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'Not authenticated', description: 'Please sign in again', variant: 'destructive' });
        setIsCreating(false);
        return;
      }
      const sanitizedBase = getApiBase();
      const url = `${sanitizedBase}/api/instances/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        toast({ title: 'Error', description: 'Could not create instance', variant: 'destructive' });
        setIsCreating(false);
        return;
      }

      const newInstance: Instance = {
        id: Number(data?.id ?? Date.now()),
        instance_name: data?.instance_name ?? '',
        instance_url: data?.instance_url ?? '',
        api_key: data?.api_key ?? '',
        internal_url: data?.internal_url ?? '',
        instance_port: Number(data?.instance_port ?? 0),
        webhook_url: data?.webhook_url ?? '',
        is_connected: Boolean(data?.is_connected ?? false),
      };

      setInstances(prev => [newInstance, ...prev]);
      toast({ title: 'Instance created', description: 'Your new instance was created successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not create instance', variant: 'destructive' });
      setIsCreating(false);
    }
  };

  const fetchConnectUrl = async (instanceName?: string) => {
    try {
      setIsConnecting(true);
      setConnectUrl('');
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'Not authenticated', description: 'Please sign in again', variant: 'destructive' });
        setIsConnecting(false);
        return;
      }
      const sanitizedBase = getApiBase();
      const url = `${sanitizedBase}/api/marketplace/connect${instanceName ? `?instance_name=${encodeURIComponent(instanceName)}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const payload = await response.json().catch(() => null);
      const destination = payload?.authorization_url || payload?.url || payload?.redirect_url || payload?.data?.url;
      if (destination && /^https?:\/\//i.test(destination)) {
        setConnectUrl(destination);
      } else {
        toast({ title: 'Error', description: 'Authorization URL was not received', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Could not fetch authorization URL', variant: 'destructive' });
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchInstanceSessions = async (instance: Instance) => {
    try {
      setIsLoadingSessions(true);
      setSyncSessions([]);
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const sanitizedBase = getApiBase();
      // Prefer instance name; backend also accepts instanceId
      const params = instance.instance_name
        ? `instanceName=${encodeURIComponent(instance.instance_name)}`
        : `instanceId=${encodeURIComponent(String(instance.id))}`;
      const url = `${sanitizedBase}/api/instances/sessions?${params}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) return;
      if (Array.isArray(data)) {
        const names = data
          .map((s: any) => (typeof s?.name === 'string' ? s.name : null))
          .filter(Boolean);
        setSyncSessions(names.length ? names : ['default']);
        setSelectedSession((names[0] as string) || 'default');
      }
    } catch {
      setSyncSessions(['default']);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const toggleRow = async (instance: Instance) => {
    const id = instance.id;
    // Block expand if disconnected
    if (!instance.is_connected) {
      toast({ title: 'Conecta a GHL', description: 'Debes conectar la instancia a GHL antes de acceder al staff.' });
      return;
    }
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    // fetch staff only if opening and not loaded yet
    if (!expandedRows[id] && !staffByInstance[id]) {
      try {
        setStaffByInstance(prev => ({ ...prev, [id]: { loading: true, items: [] } }));
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setStaffByInstance(prev => ({ ...prev, [id]: { loading: false, items: [] } }));
          return;
        }
        const base = getApiBase();
        const param = instance.instance_name ? `instanceName=${encodeURIComponent(instance.instance_name)}` : `instanceId=${encodeURIComponent(String(instance.id))}`;
        const url = `${base}/api/staff/?${param}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const data = await response.json().catch(() => []);
        const items: StaffMember[] = Array.isArray(data)
          ? data.map((d: any) => ({ id: d?.id ?? String(d?.ghl_user_id ?? ''), name: String(d?.name || ''), email: String(d?.email || ''), is_active: Boolean(d?.is_active) }))
          : [];
        setStaffByInstance(prev => ({ ...prev, [id]: { loading: false, items } }));
      } catch {
        setStaffByInstance(prev => ({ ...prev, [id]: { loading: false, items: [] } }));
      }
    }
  };

  const syncStaffFromGhl = async (instance: Instance) => {
    try {
      setSyncingStaff(prev => ({ ...prev, [instance.id]: true }));
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const base = getApiBase();
      const param = instance.instance_name ? `instanceName=${encodeURIComponent(instance.instance_name)}` : `instanceId=${encodeURIComponent(String(instance.id))}`;
      const url = `${base}/api/staff/sync-from-ghl?${param}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (!response.ok) {
        toast({ title: 'Error', description: 'Could not sync staff', variant: 'destructive' });
        return;
      }
      toast({ title: 'Staff synced', description: 'The staff list was synchronized from GHL' });
      // refresh list
      await toggleRow(instance); // closes
      await toggleRow(instance); // reopens and fetches
    } catch {
      toast({ title: 'Error', description: 'Failed to sync staff', variant: 'destructive' });
    } finally {
      setSyncingStaff(prev => ({ ...prev, [instance.id]: false }));
    }
  };

  const openConnectStaffModal = async (instance: Instance) => {
    try {
      setIsConnectModalOpen(true);
      setConnectInstance(instance);
      setConnectLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) { setConnectLoading(false); return; }
      const base = getApiBase();
      const url = `${base}/api/staff/sessions`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json().catch(() => []);
      const staffList = staffByInstance[instance.id]?.items || [];
      const assignments = staffList.map((s) => {
        const match = Array.isArray(data) ? data.find((rec: any) => String(rec?.assigned_staff_id) === String(s.id) && Number(rec?.instance_id) === Number(instance.id)) : null;
        const sessionName = match?.session_name ? String(match.session_name) : '—';
        return { staffId: String(s.id), staffName: s.name || '—', email: s.email || '—', sessionName };
      });
      setConnectAssignments(assignments);

      // fetch all sessions of this instance to compute available ones
      try {
        const params = instance.instance_name
          ? `instanceName=${encodeURIComponent(instance.instance_name)}`
          : `instanceId=${encodeURIComponent(String(instance.id))}`;
        const sessionsResp = await fetch(`${base}/api/instances/sessions?${params}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const sessionsData = await sessionsResp.json().catch(() => []);
        const allNames: string[] = Array.isArray(sessionsData)
          ? sessionsData.map((s: any) => String(s?.name || s?.session_name || '')).filter(Boolean)
          : [];
        const used = new Set(assignments.map(a => a.sessionName).filter(n => n && n !== '—'));
        const available = allNames.filter(n => !used.has(n));
        setConnectAvailableSessions(available);
        const initial: Record<string, string> = {};
        assignments.filter(a => a.sessionName === '—').forEach(a => { initial[a.staffId] = available[0] || ''; });
        setSelectedSessionByStaff(initial);
      } catch {
        setConnectAvailableSessions([]);
      }
    } catch {
      setConnectAssignments([]);
    } finally {
      setConnectLoading(false);
    }
  };

  const linkStaffToSession = async (staffId: string) => {
    if (!connectInstance) return;
    const sessionName = selectedSessionByStaff[staffId];
    if (!sessionName) return;
    try {
      setAssignLoadingByStaff(prev => ({ ...prev, [staffId]: true }));
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const base = getApiBase();
      const paramInst = connectInstance.instance_name ? `instanceName=${encodeURIComponent(connectInstance.instance_name)}` : `instanceId=${encodeURIComponent(String(connectInstance.id))}`;
      const url = `${base}/api/staff/sessions/link?${paramInst}&sessionName=${encodeURIComponent(sessionName)}&staffId=${encodeURIComponent(staffId)}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (!resp.ok) {
        toast({ title: 'Error', description: 'Could not link staff to session', variant: 'destructive' });
        return;
      }
      toast({ title: 'Linked', description: 'Staff assigned to session' });
      // refresh modal data
      await openConnectStaffModal(connectInstance);
    } catch {
      toast({ title: 'Error', description: 'Failed to link staff', variant: 'destructive' });
    } finally {
      setAssignLoadingByStaff(prev => ({ ...prev, [staffId]: false }));
    }
  };

  const deleteInstance = async (id: number) => {
    setIsDeleting(id);
    try {
      // Mock API call
      setInstances(prev => prev.filter(inst => inst.id !== id));
      toast({
        title: 'Instance deleted',
        description: 'The instance has been deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not delete instance',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  useEffect(() => {
    // read max instances from localStorage
    const storedMax = localStorage.getItem('auth_max_instances');
    setMaxInstances(storedMax ? Number(storedMax) : null);
    const fetchInstances = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const sanitizedBase = getApiBase();
        const url = `${sanitizedBase}/api/instances/`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const data = await response.json().catch(() => []);
        if (!response.ok) return;
        if (Array.isArray(data)) {
          const mapped: Instance[] = data.map((d: any) => ({
            id: Number(d?.id ?? Date.now()),
            instance_name: d?.instance_name ?? '',
            instance_url: d?.instance_url ?? '',
            api_key: d?.api_key ?? '',
            internal_url: d?.internal_url ?? '',
            instance_port: Number(d?.instance_port ?? 0),
            webhook_url: d?.webhook_url ?? '',
            is_connected: Boolean(d?.is_connected ?? false),
            sessions: Array.isArray(d?.sessions) ? d.sessions.map((s: any) => String(s)) : (d?.sessions ? [String(d.sessions)] : ['default']),
          }));
          setInstances(mapped);
        }
      } catch {}
    };
    fetchInstances();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Accounts</h1>
          <div className="flex items-center gap-4 mt-2">
            <Button variant="link" className="text-primary p-0 h-auto">
              All <span className="ml-1 bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">{instances.length}</span>
            </Button>
            <Button variant="ghost" className="text-muted-foreground p-0 h-auto">
              Active <span className="ml-1 bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">{instances.filter(i => i.is_connected).length}</span>
            </Button>
            <Button variant="ghost" className="text-muted-foreground p-0 h-auto">
              Favorites <span className="ml-1 bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">0</span>
            </Button>
            <Button variant="ghost" className="text-muted-foreground p-0 h-auto">
              Archived <span className="ml-1 bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">0</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90" disabled={isCreating || (typeof maxInstances === 'number' && instances.length >= maxInstances)}>
            Create Instance
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input placeholder="Search for an account..." className="max-w-md" />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>API KEY</TableHead>
              <TableHead>CONNECTION STATUS</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.map((instance) => (
              <>
              <TableRow key={instance.id} className="cursor-pointer" onClick={() => toggleRow(instance)}>
                <TableCell>
                  <span className="text-primary font-medium">{instance.instance_name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">
                      {visibleApiKeys[instance.id] ? instance.api_key : '••••••••••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); setVisibleApiKeys(prev => ({ ...prev, [instance.id]: !prev[instance.id] })); }}
                    >
                      {visibleApiKeys[instance.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); copyToClipboard(instance.api_key); }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${instance.is_connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={`text-sm ${instance.is_connected ? 'text-green-600' : 'text-gray-500'}`}>
                      {instance.is_connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConnectInstanceName(instance.instance_name);
                          setIsGhlModalOpen(true);
                          fetchConnectUrl(instance.instance_name);
                        }}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Connect to GHL
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSyncInstance(instance);
                          setSelectedSession('default');
                          setIsSyncModalOpen(true);
                          fetchInstanceSessions(instance);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync contacts
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async (e) => {
                          e.stopPropagation();
                          const extractBaseFromInstanceUrl = (url?: string) => {
                            if (!url) return '';
                            const match = url.match(/^https?:\/\/[^/]+/i);
                            return match ? match[0] : '';
                          };
                          const base = extractBaseFromInstanceUrl(instance.instance_url);
                          try {
                            const exp = Date.now() + 60 * 60 * 1000; // 1h
                            const appToken = localStorage.getItem('auth_token') || '';
                            const token = await encryptPayload({ baseUrl: base, apiKey: instance.api_key, instanceId: instance.id, instanceName: instance.instance_name, appToken, exp });
                            const target = `/instance?token=${encodeURIComponent(token)}`;
                            window.open(target, '_blank');
                          } catch {
                            // fallback a parámetros planos si falla cifrado
                            const baseParam = encodeURIComponent(base);
                            const apiKeyParam = encodeURIComponent(instance.api_key || '');
                            const idParam = encodeURIComponent(String(instance.id));
                            const nameParam = encodeURIComponent(String(instance.instance_name || ''));
                            const target = `/instance?baseUrl=${baseParam}&apiKey=${apiKeyParam}&instanceId=${idParam}&instanceName=${nameParam}`;
                            window.open(target, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => { e.stopPropagation(); deleteInstance(instance.id); }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {expandedRows[instance.id] && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="p-4 rounded-md">
                      <div className="text-sm font-medium mb-2 flex items-center justify-between">
                        <span>Staff</span>
                        <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openConnectStaffModal(instance); }}>
                          <Link2 className="h-4 w-4 mr-2" />
                          Connect staff to session
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); syncStaffFromGhl(instance); }} disabled={!!syncingStaff[instance.id]}>
                          <Users className="h-4 w-4 mr-2" />
                          {syncingStaff[instance.id] ? 'Syncing…' : 'Sync staff'}
                        </Button>
                        </div>
                      </div>
                      {staffByInstance[instance.id]?.loading ? (
                        <div className="text-sm text-muted-foreground">Loading staff…</div>
                      ) : (staffByInstance[instance.id]?.items?.length ? (
                        <div className="space-y-2">
                          {staffByInstance[instance.id].items.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between border rounded px-3 py-2 bg-background">
                              <div>
                                <div className="font-medium">{m.name || '—'}</div>
                                <div className="text-xs text-muted-foreground">{m.email || '—'}</div>
                              </div>
                              <div className={`text-xs ${m.is_active ? 'text-green-600' : 'text-gray-500'}`}>{m.is_active ? 'Active' : 'Inactive'}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No staff found</div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>10</span>
          <select className="border rounded px-2 py-1 text-sm">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing 1 - {instances.length} Page 1 of 1
        </div>
      </div>

      {/* Removed Instance Detail Sheet */}

      {/* Create Instance Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Instance</DialogTitle>
            <DialogDescription>
              This will create a new WhatsApp instance for your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={createInstance} disabled={isCreating}>
              Create Instance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GHL Connection Modal */}
      <Dialog open={isGhlModalOpen} onOpenChange={(open) => { setIsGhlModalOpen(open); if (open) fetchConnectUrl(selectedConnectInstanceName); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to GoHighLevel</DialogTitle>
            <DialogDescription>
              Authorize QuickZap in GoHighLevel. This will open a new tab for authorization.
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm text-muted-foreground">
            {isConnecting ? 'Fetching authorization URL…' : (connectUrl ? 'Authorization URL is ready.' : 'Failed to get the URL. Try again.')}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGhlModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => connectUrl && window.open(connectUrl, '_blank', 'noopener,noreferrer')} disabled={!connectUrl || isConnecting}>
              Open in new tab
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Contacts Modal */}
      <Dialog open={isSyncModalOpen} onOpenChange={setIsSyncModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync contacts</DialogTitle>
            <DialogDescription>
              Select the WAHA session to sync contacts to.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Session</Label>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingSessions ? 'Loading sessions…' : 'Select session'} />
              </SelectTrigger>
              <SelectContent>
                {(isLoadingSessions ? [] : (syncSessions.length ? syncSessions : ['default']))
                .map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncModalOpen(false)} disabled={isSyncing}>
              Cancel
            </Button>
            <Button onClick={syncContacts} disabled={isSyncing}>
              {isSyncing ? 'Syncing…' : 'Sync'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Connect Staff To Session Modal */}
      <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect staff to session</DialogTitle>
            <DialogDescription>Shows the current session assigned per staff member in this instance.</DialogDescription>
          </DialogHeader>
          {connectLoading ? (
            <div className="text-sm text-muted-foreground">Loading assignments…</div>
          ) : (
            <div className="space-y-2">
              {connectAssignments.length ? (
                connectAssignments.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between border rounded px-3 py-2 bg-background gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{a.staffName}</div>
                      <div className="text-xs text-muted-foreground truncate">{a.email}</div>
                    </div>
                    {a.sessionName === '—' ? (
                      <div className="flex items-center gap-2">
                        <Select value={selectedSessionByStaff[a.staffId] || ''} onValueChange={(v) => setSelectedSessionByStaff(prev => ({ ...prev, [a.staffId]: v }))}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder={connectAvailableSessions.length ? 'Select session' : 'No sessions'} />
                          </SelectTrigger>
                          <SelectContent>
                            {connectAvailableSessions.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" onClick={() => linkStaffToSession(a.staffId)} disabled={!selectedSessionByStaff[a.staffId] || !!assignLoadingByStaff[a.staffId]}>
                          {assignLoadingByStaff[a.staffId] ? 'Assigning…' : 'Assign'}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs">{a.sessionName}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No data</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
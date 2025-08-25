import { useState, useEffect } from 'react';
import { Eye, EyeOff, MoreHorizontal, ExternalLink, Trash2, Copy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

interface Instance {
  id: number;
  instance_name: string;
  instance_url: string;
  api_key: string;
  internal_url: string;
  instance_port: number;
  webhook_url: string;
  is_connected: boolean;
}

export const SubaccountsPage = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGhlModalOpen, setIsGhlModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectUrl, setConnectUrl] = useState('');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [visibleApiKeys, setVisibleApiKeys] = useState<Record<number, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);

  const generateLocationId = (id: number) => {
    const hash = `fm${id}l...x${id}mfy`;
    return hash;
  };

  const createInstance = async () => {
    try {
      setIsCreating(true);
      setIsCreateModalOpen(false); // cerrar inmediatamente
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'No autenticado', description: 'Inicia sesión nuevamente', variant: 'destructive' });
        setIsCreating(false);
        return;
      }
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'https://fair-turkey-quickly.ngrok-free.app';
      const sanitizedBase = typeof baseUrl === 'string' ? baseUrl.replace(/\/$/, '') : '';
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
        toast({ title: 'Error', description: 'No se pudo crear la instancia', variant: 'destructive' });
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
      toast({ title: 'Instancia creada', description: 'Tu nueva instancia ha sido creada exitosamente' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo crear la instancia', variant: 'destructive' });
      setIsCreating(false);
    }
  };

  const fetchConnectUrl = async () => {
    try {
      setIsConnecting(true);
      setConnectUrl('');
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'No autenticado', description: 'Inicia sesión nuevamente', variant: 'destructive' });
        setIsConnecting(false);
        return;
      }
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'https://fair-turkey-quickly.ngrok-free.app';
      const sanitizedBase = typeof baseUrl === 'string' ? baseUrl.replace(/\/$/, '') : '';
      const url = `${sanitizedBase}/api/marketplace/connect`;
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
        toast({ title: 'Error', description: 'No se recibió la URL de autorización', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'No se pudo obtener la URL de autorización', variant: 'destructive' });
    } finally {
      setIsConnecting(false);
    }
  };

  const deleteInstance = async (id: number) => {
    setIsDeleting(id);
    try {
      // Mock API call
      setInstances(prev => prev.filter(inst => inst.id !== id));
      toast({
        title: 'Instancia eliminada',
        description: 'La instancia ha sido eliminada exitosamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la instancia',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
    });
  };

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'https://fair-turkey-quickly.ngrok-free.app';
        const sanitizedBase = typeof baseUrl === 'string' ? baseUrl.replace(/\/$/, '') : '';
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
          <Button
            variant="outline"
            onClick={() => {
              setIsGhlModalOpen(true);
              fetchConnectUrl();
            }}
          >
            <Zap className="h-4 w-4 mr-2" /> Connect to GHL
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90" disabled={isCreating || instances.length > 0}>
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
              <TableRow key={instance.id}>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto font-medium"
                    onClick={() => {
                      setSelectedInstance(instance);
                      setIsDetailOpen(true);
                    }}
                  >
                    {instance.instance_name}
                  </Button>
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
                      onClick={() => setVisibleApiKeys(prev => ({ ...prev, [instance.id]: !prev[instance.id] }))}
                    >
                      {visibleApiKeys[instance.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyToClipboard(instance.api_key)}>
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => {
                          const extractBase = (url?: string) => {
                            if (!url) return '';
                            const match = url.match(/^https?:\/\/[^/]+/i);
                            return match ? match[0] : '';
                          };
                          const base = extractBase(instance.internal_url) || extractBase(instance.instance_url);
                          const baseParam = encodeURIComponent(base);
                          const apiKeyParam = encodeURIComponent(instance.api_key || '');
                          const target = `/instance?baseUrl=${baseParam}&apiKey=${apiKeyParam}`;
                          window.open(target, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteInstance(instance.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
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

      {/* Instance Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle>Instance Details</SheetTitle>
            <SheetDescription>
              {selectedInstance?.instance_name}
            </SheetDescription>
          </SheetHeader>
          
          {selectedInstance && (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Instance Name</Label>
                <div className="p-2 bg-muted rounded text-sm">
                  {selectedInstance.instance_name}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Instance URL</Label>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded text-sm flex-1 font-mono">
                    {selectedInstance.instance_url}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.open(selectedInstance.instance_url, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded text-sm flex-1 font-mono">
                    {showApiKey ? selectedInstance.api_key : '••••••••••••••••'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(selectedInstance.api_key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Internal URL</Label>
                  <div className="p-2 bg-muted rounded text-sm font-mono">
                    {selectedInstance.internal_url}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Port</Label>
                  <div className="p-2 bg-muted rounded text-sm font-mono">
                    {selectedInstance.instance_port}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="p-2 bg-muted rounded text-sm font-mono">
                  {selectedInstance.webhook_url}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Connection Status</Label>
                <Badge variant={selectedInstance.is_connected ? "default" : "secondary"}>
                  {selectedInstance.is_connected ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>

              <Button 
                onClick={() => setIsGhlModalOpen(true)}
                disabled={selectedInstance.is_connected}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                {selectedInstance.is_connected ? 'Already Connected' : 'Connect to GHL'}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

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
      <Dialog open={isGhlModalOpen} onOpenChange={(open) => { setIsGhlModalOpen(open); if (open) fetchConnectUrl(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to GoHighLevel</DialogTitle>
            <DialogDescription>
              Autoriza QuickZap en GoHighLevel. Abre la autorización en una nueva pestaña.
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm text-muted-foreground">
            {isConnecting ? 'Obteniendo URL de autorización...' : (connectUrl ? 'URL lista para abrir.' : 'No se pudo obtener la URL. Intenta nuevamente.')}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGhlModalOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={() => connectUrl && window.open(connectUrl, '_blank', 'noopener,noreferrer')} disabled={!connectUrl || isConnecting}>
              Abrir en nueva pestaña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
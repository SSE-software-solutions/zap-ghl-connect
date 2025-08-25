import { useState, useEffect } from 'react';
import { Eye, MoreHorizontal, Star, ExternalLink, Settings, Users, Lock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { Copy, EyeOff, Zap } from 'lucide-react';

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
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [ghlApiKey, setGhlApiKey] = useState('');

  const generateLocationId = (id: number) => {
    const hash = `fm${id}l...x${id}mfy`;
    return hash;
  };

  const createInstance = async () => {
    try {
      // Mock API call
      const newInstance: Instance = {
        id: Date.now(),
        instance_name: `wa_instance_${instances.length + 1}_${Math.random().toString(36).substr(2, 8)}`,
        instance_url: `http://localhost:${45643 + instances.length}/dashboard?auto_config=true&api_key=${Math.random().toString(36).substr(2, 32)}`,
        api_key: Math.random().toString(36).substr(2, 32),
        internal_url: `http://host.docker.internal:${45643 + instances.length}/`,
        instance_port: 45643 + instances.length,
        webhook_url: `http://host.docker.internal:8000/api/webhooks/waha/wa_instance_${instances.length + 1}_${Math.random().toString(36).substr(2, 8)}`,
        is_connected: false
      };

      setInstances(prev => [...prev, newInstance]);
      setIsCreateModalOpen(false);
      toast({
        title: 'Instancia creada',
        description: 'Tu nueva instancia ha sido creada exitosamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la instancia',
        variant: 'destructive',
      });
    }
  };

  const connectToGHL = async (method: 'oauth' | 'apiKey') => {
    if (!selectedInstance) return;

    try {
      // Mock API call
      const updatedInstance = { ...selectedInstance, is_connected: true };
      setInstances(prev => prev.map(inst => 
        inst.id === selectedInstance.id ? updatedInstance : inst
      ));
      setSelectedInstance(updatedInstance);
      setIsGhlModalOpen(false);
      setGhlApiKey('');
      
      toast({
        title: 'Conectado a GHL',
        description: 'La instancia se ha conectado exitosamente a GoHighLevel',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo conectar a GoHighLevel',
        variant: 'destructive',
      });
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
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
          Create Instance
        </Button>
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
              <TableHead>LOCATION ID</TableHead>
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
                    <span className="font-mono text-sm">{generateLocationId(instance.id)}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Add to Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(instance.instance_url, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in new tab
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage limits
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Invite member
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Manage access
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="h-4 w-4 mr-2" />
                        Lock account
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
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createInstance}>
              Create Instance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GHL Connection Modal */}
      <Dialog open={isGhlModalOpen} onOpenChange={setIsGhlModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to GoHighLevel</DialogTitle>
            <DialogDescription>
              Choose how you want to connect this instance to GoHighLevel.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Button 
              onClick={() => connectToGHL('oauth')}
              className="w-full"
              variant="outline"
            >
              Continue with GHL OAuth
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ghl-api-key">GHL API Key</Label>
              <Input
                id="ghl-api-key"
                value={ghlApiKey}
                onChange={(e) => setGhlApiKey(e.target.value)}
                placeholder="Enter your GoHighLevel API key"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGhlModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => connectToGHL('apiKey')}
              disabled={!ghlApiKey}
            >
              Connect with API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
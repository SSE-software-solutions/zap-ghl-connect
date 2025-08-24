import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Copy, Eye, EyeOff, ExternalLink, LogOut, Plus, Zap } from 'lucide-react';

interface Instance {
  instance_name: string;
  instance_url: string;
  api_key: string;
  internal_url: string;
  port: string;
  webhook_url: string;
  is_connected: boolean;
}

const Dashboard = () => {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [ghlApiKey, setGhlApiKey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated (mock check)
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/');
  };

  const createInstance = async () => {
    setIsCreatingInstance(true);
    
    // Mock API call
    setTimeout(() => {
      const mockInstance: Instance = {
        instance_name: `quickzap-${Math.random().toString(36).substr(2, 6)}`,
        instance_url: `https://quickzap-${Math.random().toString(36).substr(2, 6)}.app`,
        api_key: `qz_${Math.random().toString(36).substr(2, 24)}`,
        internal_url: `http://internal-${Math.random().toString(36).substr(2, 8)}.local`,
        port: '3000',
        webhook_url: `https://webhook-${Math.random().toString(36).substr(2, 8)}.quickzap.app`,
        is_connected: false
      };
      
      setInstance(mockInstance);
      setIsCreatingInstance(false);
      
      toast({
        title: "Instancia creada",
        description: "Tu instancia de QuickZap ha sido creada exitosamente",
      });
    }, 2000);
  };

  const connectToGHL = async () => {
    setIsConnecting(true);
    
    // Mock connection process
    setTimeout(() => {
      if (instance) {
        setInstance({ ...instance, is_connected: true });
        setIsDialogOpen(false);
        setGhlApiKey('');
        setIsConnecting(false);
        
        toast({
          title: "Conectado a GHL",
          description: "Tu instancia ahora está conectada a GoHighLevel",
        });
      }
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Texto copiado al portapapeles",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-whatsapp/5 to-whatsapp/10">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/b6192fd9-a58b-4a50-bd2a-809422896d69.png" 
                  alt="QuickZap Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-whatsapp">Panel de Cliente</h1>
            </div>
            
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={createInstance}
              disabled={isCreatingInstance || !!instance}
              className="bg-whatsapp hover:bg-whatsapp/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreatingInstance ? 'Creando instancia...' : 'Crear Instancia'}
            </Button>
            
            {instance && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={instance.is_connected}>
                    <Zap className="h-4 w-4 mr-2" />
                    {instance.is_connected ? 'Conectado a GHL' : 'Conectar a GHL'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Conectar a GoHighLevel</DialogTitle>
                    <DialogDescription>
                      Ingresa tu API Key de GoHighLevel para conectar tu instancia
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ghl-key">API Key de GHL</Label>
                      <Input
                        id="ghl-key"
                        placeholder="Ingresa tu API Key..."
                        value={ghlApiKey}
                        onChange={(e) => setGhlApiKey(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      onClick={connectToGHL}
                      disabled={isConnecting || !ghlApiKey}
                      className="bg-whatsapp hover:bg-whatsapp/90"
                    >
                      {isConnecting ? 'Conectando...' : 'Conectar'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Instance Card */}
          {instance && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-whatsapp" />
                    Instancia de QuickZap
                  </CardTitle>
                  <Badge 
                    variant={instance.is_connected ? "default" : "secondary"}
                    className={instance.is_connected ? "bg-green-500" : ""}
                  >
                    {instance.is_connected ? 'Conectado' : 'No Conectado'}
                  </Badge>
                </div>
                <CardDescription>
                  Detalles de tu instancia activa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Instance Name */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nombre de instancia</p>
                    <p className="text-lg font-mono">{instance.instance_name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(instance.instance_name)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Instance URL */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">URL de instancia</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-mono text-blue-600">{instance.instance_url}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(instance.instance_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(instance.instance_url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* API Key */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">API Key</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-mono">
                        {showApiKey ? instance.api_key : '••••••••••••••••••••••••'}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(instance.api_key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Technical Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Internal URL</p>
                    <p className="text-sm font-mono">{instance.internal_url}</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Puerto</p>
                    <p className="text-sm font-mono">{instance.port}</p>
                  </div>
                </div>

                {/* Webhook URL */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Webhook URL</p>
                    <p className="text-sm font-mono">{instance.webhook_url}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(instance.webhook_url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
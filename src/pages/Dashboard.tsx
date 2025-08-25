import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const [connectUrl, setConnectUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth and fetch instances
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchInstances = async () => {
      try {
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
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          if (response.status === 401) {
            toast({ title: 'Sesión expirada', description: 'Vuelve a iniciar sesión', variant: 'destructive' });
            navigate('/login');
            return;
          }
          return;
        }
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          const loaded: Instance = {
            instance_name: first?.instance_name ?? '',
            instance_url: first?.instance_url ?? '',
            api_key: first?.api_key ?? '',
            internal_url: first?.internal_url ?? '',
            port: String(first?.instance_port ?? first?.port ?? ''),
            webhook_url: first?.webhook_url ?? '',
            is_connected: Boolean(first?.is_connected),
          };
          setInstance(loaded);
        } else {
          setInstance(null);
        }
      } catch {
        // Silent on mount
      }
    };

    fetchInstances();
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
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({
          title: "No autenticado",
          description: "Inicia sesión para crear una instancia",
          variant: "destructive",
        });
        navigate('/login');
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
        const toMessage = (payload: any): string => {
          if (!payload) return 'No se pudo crear la instancia';
          if (typeof payload === 'string') return payload;
          const detail = payload?.detail ?? payload?.message ?? payload?.error;
          if (Array.isArray(detail)) {
            const msgs = detail.map((d: any) => d?.msg || d?.message).filter(Boolean);
            if (msgs.length) return msgs.join(', ');
          }
          if (detail && typeof detail === 'object' && (detail.msg || detail.message)) {
            return detail.msg || detail.message;
          }
          return typeof detail === 'string' ? detail : 'No se pudo crear la instancia';
        };
        const message = toMessage(data);
        if (response.status === 401) {
          toast({ title: 'Sesión expirada', description: 'Vuelve a iniciar sesión', variant: 'destructive' });
          navigate('/login');
        } else {
          toast({ title: 'Error', description: message, variant: 'destructive' });
        }
        return;
      }

      const newInstance: Instance = {
        instance_name: data?.instance_name ?? '',
        instance_url: data?.instance_url ?? '',
        api_key: data?.api_key ?? '',
        internal_url: data?.internal_url ?? '',
        port: String(data?.instance_port ?? data?.port ?? ''),
        webhook_url: data?.webhook_url ?? '',
        is_connected: Boolean(data?.is_connected),
      };

      setInstance(newInstance);
      toast({
        title: 'Instancia creada',
        description: 'Tu instancia de QuickZap ha sido creada exitosamente',
      });
    } catch (err) {
      toast({ title: 'Error de red', description: 'No se pudo conectar con el servidor', variant: 'destructive' });
    } finally {
      setIsCreatingInstance(false);
    }
  };

  const connectToGHL = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({ title: 'No autenticado', description: 'Vuelve a iniciar sesión', variant: 'destructive' });
        navigate('/login');
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
        redirect: 'follow',
      });

      // Extrae la URL de autorización del JSON; como fallback usa response.url si hubo redirect
      let destination: string | undefined;
      try {
        const payload = await response.clone().json();
        destination = payload?.authorization_url || payload?.url || payload?.connect_url || payload?.redirect_url || payload?.data?.url;
      } catch {}
      if (!destination && response.redirected) {
        destination = response.url;
      }

      if (destination && /^https?:\/\//i.test(destination)) {
        setConnectUrl(destination);
        toast({ title: 'URL obtenida', description: 'Abre el enlace para autorizar' });
      } else {
        toast({ title: 'Error', description: 'No se recibió la URL de autorización', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'No se pudo iniciar la conexión con GHL', variant: 'destructive' });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      setConnectUrl('');
      connectToGHL();
    }
  }, [isDialogOpen]);

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
                      Ingresa a este enlace para autorizar la conexión con tu cuenta de GoHighLevel.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700 break-all">
                        {connectUrl ? connectUrl : (isConnecting ? 'Obteniendo URL de autorización...' : 'No se ha generado una URL todavía.')}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => connectUrl && window.open(connectUrl, '_blank', 'noopener,noreferrer')}
                          disabled={!connectUrl}
                        >
                          Abrir URL en nueva pestaña
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(connectUrl)}
                          disabled={!connectUrl}
                        >
                          Copiar URL
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={connectToGHL}
                      disabled={isConnecting}
                      className="bg-whatsapp hover:bg-whatsapp/90"
                    >
                      {isConnecting ? 'Conectando...' : 'Generar URL nuevamente'}
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
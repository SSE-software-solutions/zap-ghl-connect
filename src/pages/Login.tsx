import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'https://fair-turkey-quickly.ngrok-free.app';
      const withProtocol = (u: string) => /^https?:\/\//i.test(u) ? u : `https://${u}`;
      const sanitizedBase = typeof baseUrl === 'string' ? withProtocol(baseUrl).replace(/\/$/, '') : '';
      const url = `${sanitizedBase}/api/auth/login`;

      const params = new URLSearchParams();
      params.set('grant_type', 'password');
      params.set('username', email);
      params.set('password', password);
      params.set('scope', '');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const toMessage = (payload: any): string => {
          if (!payload) return 'Usuario o contraseña inválidos';
          if (typeof payload === 'string') return payload;
          const detail = payload?.detail ?? payload?.message ?? payload?.error;
          if (Array.isArray(detail)) {
            const msgs = detail.map((d: any) => d?.msg || d?.message).filter(Boolean);
            if (msgs.length) return msgs.join(', ');
          }
          if (detail && typeof detail === 'object' && (detail.msg || detail.message)) {
            return detail.msg || detail.message;
          }
          return typeof detail === 'string' ? detail : 'Usuario o contraseña inválidos';
        };
        const message = toMessage(data);
        toast({
          title: "Error de autenticación",
          description: message,
          variant: "destructive",
        });
        return;
      }

      const token = data?.access_token || data?.token || data?.accessToken || data?.jwt || data?.data?.token;
      const tokenType: string | undefined = data?.token_type;
      if (!token) {
        toast({
          title: "Error",
          description: "La respuesta del servidor no contiene un token",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('auth_token', String(token));
      if (tokenType) {
        localStorage.setItem('auth_token_type', String(tokenType));
      }
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de cliente",
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast({
        title: "Error de red",
        description: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-whatsapp/5 to-whatsapp/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b6192fd9-a58b-4a50-bd2a-809422896d69.png" 
                alt="QuickZap Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-2xl font-black text-whatsapp tracking-tight">
              QUICKZAP
            </div>
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Accede a tu panel de cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Usuario</Label>
              <Input
                id="email"
                type="text"
                placeholder="tu_usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-whatsapp hover:bg-whatsapp/90"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
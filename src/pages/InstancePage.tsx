import { useEffect, useMemo, useState } from 'react';
import { decryptPayload } from '@/lib/secure-link';
import { encryptPayload } from '@/lib/secure-link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { QrCode, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Session {
  id: number;
  name: string;
  status: string;
}

export const InstancePage = () => {
  const [sessionName, setSessionName] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedSessionQR, setSelectedSessionQR] = useState<string>('');
  const [qrObjectUrl, setQrObjectUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [showShare, setShowShare] = useState(false);
  const [instanceId, setInstanceId] = useState<string>('');
  const [instanceName, setInstanceName] = useState<string>('');
  const [appToken, setAppToken] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const getBackendBase = () => {
    const raw = (import.meta as any).env?.VITE_API_BASE_URL || 'https://saasback.getquickzap.com';
    const withProtocol = (u: string) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
    return withProtocol(String(raw)).replace(/\/$/, '');
  };

  // Read baseUrl and apiKey from query params (or encrypted token), then hide them from URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const fromParamsBase = params.get('baseUrl');
    const fromParamsKey = params.get('apiKey');
    const fromParamsId = params.get('instanceId') || '';
    const fromParamsName = params.get('instanceName') || '';

    const applyAndHide = (b?: string, k?: string, id?: string, name?: string) => {
      if (!b || !k) return false;
      const sanitizedBase = b.replace(/\/$/, '');
      sessionStorage.setItem('instance_baseUrl', sanitizedBase);
      sessionStorage.setItem('instance_apiKey', k);
      if (id) sessionStorage.setItem('instance_id', id);
      if (name) sessionStorage.setItem('instance_name', name);
      setBaseUrl(sanitizedBase);
      setApiKey(k);
      if (id) setInstanceId(id);
      if (name) setInstanceName(name);
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
      return true;
    };

    (async () => {
      if (token) {
        const payload = await decryptPayload(token).catch(() => null);
        const expOk = payload?.exp ? Date.now() < Number(payload.exp) : true;
        if (payload?.baseUrl && payload?.apiKey && expOk) {
          if (payload?.appToken) {
            const at = String(payload.appToken);
            setAppToken(at);
            sessionStorage.setItem('instance_app_token', at);
          }
          if (applyAndHide(String(payload.baseUrl), String(payload.apiKey), String(payload.instanceId || ''), String(payload.instanceName || ''))) return;
        }
      }

      if (fromParamsBase && fromParamsKey) {
        if (applyAndHide(fromParamsBase, fromParamsKey, fromParamsId, fromParamsName)) return;
      }
      const storedBase = sessionStorage.getItem('instance_baseUrl') || '';
      const storedKey = sessionStorage.getItem('instance_apiKey') || '';
      const storedId = sessionStorage.getItem('instance_id') || '';
      const storedName = sessionStorage.getItem('instance_name') || '';
      const storedAppToken = sessionStorage.getItem('instance_app_token') || '';
      if (storedBase && storedKey) {
        setBaseUrl(storedBase);
        setApiKey(storedKey);
        setInstanceId(storedId);
        setInstanceName(storedName);
        if (storedAppToken) setAppToken(storedAppToken);
      }
    })();
  }, []);

  const fetchSessions = async () => {
    if (!baseUrl || !apiKey) return;
    try {
      const token = appToken || sessionStorage.getItem('instance_app_token') || localStorage.getItem('auth_token');
      const sanitized = getBackendBase();
      const param = instanceName ? `instanceName=${encodeURIComponent(instanceName)}` : (instanceId ? `instanceId=${encodeURIComponent(instanceId)}` : '');
      const url = `${sanitized}/api/wa-direct/sessions${param ? `?${param}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
        },
      });
      const data = await response.json().catch(() => []);
      if (!response.ok || !Array.isArray(data)) return;
      const mapped: Session[] = data.map((d: any, idx: number) => ({
        id: d?.id ?? idx + 1,
        name: d?.name ?? d?.session_name ?? `session_${idx + 1}`,
        status: String(d?.status ?? ''),
      }));
      setSessions(mapped);
    } catch {
      // ignore for now
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, apiKey]);

  // Generate shareable encrypted link
  useEffect(() => {
    (async () => {
      if (!baseUrl || !apiKey) return;
      try {
        const ttlMin = Number((import.meta as any).env?.VITE_LINK_TTL_MINUTES ?? 60);
        const exp = Date.now() + Math.max(1, ttlMin) * 60 * 1000;
        const token = await encryptPayload({ baseUrl, apiKey, instanceId, instanceName, appToken: appToken || sessionStorage.getItem('instance_app_token') || '', exp });
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        setShareUrl(`${origin}/instance?token=${encodeURIComponent(token)}`);
      } catch {
        setShareUrl('');
      }
    })();
  }, [baseUrl, apiKey, instanceId, instanceName, appToken]);

  const createSession = async () => {
    const trimmedName = sessionName.trim();
    if (!trimmedName) {
      toast({ title: 'Error', description: 'Por favor ingresa un nombre para la sesión', variant: 'destructive' });
      return;
    }
    setIsCreating(true);
    try {
      const token = appToken || sessionStorage.getItem('instance_app_token') || localStorage.getItem('auth_token');
      const sanitized = getBackendBase();
      const param = instanceName ? `instanceName=${encodeURIComponent(instanceName)}` : (instanceId ? `instanceId=${encodeURIComponent(instanceId)}` : '');
      const url = `${sanitized}/api/wa-direct/sessions${param ? `?${param}` : ''}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.detail || payload?.message || 'No se pudo crear la sesión';
        toast({ title: 'Error', description: String(message), variant: 'destructive' });
        return;
      }

      setSessionName('');
      toast({ title: 'Sesión creada', description: `Sesión "${trimmedName}" creada exitosamente` });
      fetchSessions();
    } catch {
      toast({ title: 'Error de red', description: 'No se pudo contactar con el servidor', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const performAction = async (sessionName: string, action: 'start' | 'stop' | 'restart') => {
    if (!baseUrl || !apiKey) return;
    setIsActionLoading(prev => ({ ...prev, [`${sessionName}:${action}`]: true }));
    try {
      const token = appToken || sessionStorage.getItem('instance_app_token') || localStorage.getItem('auth_token');
      const sanitized = getBackendBase();
      const param = instanceName ? `instanceName=${encodeURIComponent(instanceName)}` : (instanceId ? `instanceId=${encodeURIComponent(instanceId)}` : '');
      const url = `${sanitized}/api/wa-direct/sessions/${encodeURIComponent(sessionName)}/${action}${param ? `?${param}` : ''}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        toast({ title: 'Error', description: `No se pudo ${action} la sesión`, variant: 'destructive' });
      } else {
        const actionLabel = action === 'start' ? 'iniciado' : action === 'stop' ? 'detenido' : 'reiniciado';
        toast({ title: `Sesión ${actionLabel}`, description: `La sesión se ha ${actionLabel} correctamente` });
      }
    } catch {
      toast({ title: 'Error de red', description: 'No se pudo contactar con la instancia', variant: 'destructive' });
    } finally {
      setIsActionLoading(prev => ({ ...prev, [`${sessionName}:${action}`]: false }));
      fetchSessions();
    }
  };

  const deleteSession = async (name: string) => {
    if (!baseUrl || !apiKey) return;
    setIsActionLoading(prev => ({ ...prev, [`${name}:delete`]: true }));
    try {
      const token = appToken || sessionStorage.getItem('instance_app_token') || localStorage.getItem('auth_token');
      const sanitized = getBackendBase();
      const param = instanceName ? `instanceName=${encodeURIComponent(instanceName)}` : (instanceId ? `instanceId=${encodeURIComponent(instanceId)}` : '');
      const url = `${sanitized}/api/wa-direct/sessions/${encodeURIComponent(name)}${param ? `?${param}` : ''}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        toast({ title: 'Error', description: 'No se pudo eliminar la sesión', variant: 'destructive' });
      } else {
        toast({ title: 'Sesión eliminada', description: 'La sesión fue eliminada correctamente' });
      }
    } catch {
      toast({ title: 'Error de red', description: 'No se pudo contactar con la instancia', variant: 'destructive' });
    } finally {
      setIsActionLoading(prev => ({ ...prev, [`${name}:delete`]: false }));
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      fetchSessions();
    }
  };

  const isActiveStatus = (status?: string) => {
    if (!status) return false;
    const s = status.toUpperCase();
    if (s === 'STOPPED') return false;
    if (s === 'SCAN_QR_CODE') return false;
    if (s === 'STARTING') return false;
    return true; // treat others as active
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'STOPPED') return { label: 'Desconectada', variant: 'secondary' as const };
    if (s === 'SCAN_QR_CODE') return { label: 'Escanear QR', variant: 'secondary' as const };
    if (s === 'STARTING') return { label: 'Escanear QR', variant: 'secondary' as const };
    return { label: 'Activa', variant: 'default' as const };
  };

  const generateQR = async (sessionName: string) => {
    if (!baseUrl || !apiKey) return;
    setSelectedSessionQR(sessionName);
    setQrLoading(true);
    setQrError('');
    setQrObjectUrl('');
    setQrModalOpen(true);
    try {
      const token = appToken || sessionStorage.getItem('instance_app_token') || localStorage.getItem('auth_token');
      const sanitized = getBackendBase();
      const param = instanceName ? `instanceName=${encodeURIComponent(instanceName)}` : (instanceId ? `instanceId=${encodeURIComponent(instanceId)}` : '');
      const url = `${sanitized}/api/wa-direct/sessions/${encodeURIComponent(sessionName)}/auth/qr${param ? `?${param}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'image/png',
        },
      });
      if (!response.ok) {
        setQrError('No se pudo obtener el código QR');
        return;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setQrObjectUrl(objectUrl);
    } catch {
      setQrError('Error de red al obtener el QR');
    } finally {
      setQrLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (qrObjectUrl) URL.revokeObjectURL(qrObjectUrl);
    };
  }, [qrObjectUrl]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Dashboard de Instancias WhatsApp
          </CardTitle>
          <div className="text-center text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <span>Base URL:</span>
            <span className="font-mono">{baseUrl ? '••••••••••••••••' : 'No definida'}</span>
            {baseUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  const el = e.currentTarget.previousElementSibling as HTMLElement | null;
                  if (!el) return;
                  el.textContent = el.textContent === '••••••••••••••••' ? baseUrl : '••••••••••••••••';
                }}
              >
                Mostrar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shareable encrypted link */}
          {shareUrl && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Enlace para compartir (cifrado):</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShare(!showShare)}
                >
                  {showShare ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <Input readOnly type={showShare ? 'text' : 'password'} value={shareUrl} className="flex-1" />
                <Button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                >
                  Copiar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const ttlMin = Number((import.meta as any).env?.VITE_LINK_TTL_MINUTES ?? 60);
                      const exp = Date.now() + Math.max(1, ttlMin) * 60 * 1000;
                      const token = await encryptPayload({ baseUrl, apiKey, exp });
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      setShareUrl(`${origin}/instance?token=${encodeURIComponent(token)}`);
                    } catch {}
                  }}
                >
                  Regenerar
                </Button>
              </div>
            </div>
          )}
          {/* Create Session */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la sesión"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createSession()}
              />
              <Button onClick={createSession} className="flex items-center gap-2" disabled={isCreating}>
                <Plus className="h-4 w-4" />
                {isCreating ? 'Creando...' : 'Crear sesión'}
              </Button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sesiones Activas</h3>
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay sesiones creadas
              </p>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const { label, variant } = getStatusBadge(session.status);
                  const active = isActiveStatus(session.status);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="font-medium">Instancia: {session.name}</div>
                        <Badge variant={variant}>{label}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => { setDeleteTarget(session.name); setIsDeleteOpen(true); }}
                          disabled={isActionLoading[`${session.name}:delete`]}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => performAction(session.name, 'restart')}
                          disabled={isActionLoading[`${session.name}:restart`]}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateQR(session.name)}
                          disabled={(() => { const st = session.status?.toUpperCase(); return st !== 'SCAN_QR_CODE'; })()}
                        >
                          <QrCode className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Modal */}
      <Dialog open={qrModalOpen} onOpenChange={(open) => { setQrModalOpen(open); if (!open && qrObjectUrl) { URL.revokeObjectURL(qrObjectUrl); setQrObjectUrl(''); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear QR - {selectedSessionQR}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="w-72 h-72 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {qrLoading ? (
                <p className="text-sm text-muted-foreground">Cargando QR...</p>
              ) : qrError ? (
                <p className="text-sm text-destructive">{qrError}</p>
              ) : qrObjectUrl ? (
                <img src={qrObjectUrl} alt="QR Code" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">QR no disponible</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Session Confirm Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar sesión</DialogTitle>
            <DialogDescription>
              ¿Estas seguro que quieres eliminar la sesión "{deleteTarget}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => deleteSession(deleteTarget || '')} disabled={!deleteTarget || isActionLoading[`${deleteTarget}:delete`]}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
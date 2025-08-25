import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QrCode, Play, Square, RotateCcw, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Session {
  id: number;
  name: string;
  alias: string;
  phoneNumber: string;
  isActive: boolean;
}

export const InstancePage = () => {
  const [sessionName, setSessionName] = useState('');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedSessionQR, setSelectedSessionQR] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, name: 'session_demo_1', alias: 'Demo 1', phoneNumber: '+1234567890', isActive: true },
    { id: 2, name: 'session_demo_2', alias: 'Demo 2', phoneNumber: '+0987654321', isActive: false },
  ]);

  const createSession = () => {
    if (!sessionName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para la sesión",
        variant: "destructive"
      });
      return;
    }

    const newSession: Session = {
      id: sessions.length + 1,
      name: sessionName.trim(),
      alias: `Alias ${sessions.length + 1}`,
      phoneNumber: `+123456789${sessions.length + 1}`,
      isActive: false
    };

    setSessions([...sessions, newSession]);
    setSessionName('');
    toast({
      title: "Sesión creada",
      description: `Sesión "${newSession.name}" creada exitosamente`,
    });
  };

  const startSession = (sessionId: number) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? { ...session, isActive: true } : session
    ));
    toast({
      title: "Sesión iniciada",
      description: "La sesión se ha iniciado correctamente",
    });
  };

  const stopSession = (sessionId: number) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? { ...session, isActive: false } : session
    ));
    toast({
      title: "Sesión detenida",
      description: "La sesión se ha detenido correctamente",
    });
  };

  const restartSession = (sessionId: number) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? { ...session, isActive: true } : session
    ));
    toast({
      title: "Sesión reiniciada",
      description: "La sesión se ha reiniciado correctamente",
    });
  };

  const toggleSession = (sessionId: number) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.isActive) {
      stopSession(sessionId);
    } else {
      startSession(sessionId);
    }
  };

  const generateQR = (sessionName: string) => {
    setSelectedSessionQR(sessionName);
    setQrModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Dashboard de Instancias WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Session */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la sesión"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createSession()}
              />
              <Button onClick={createSession} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Crear sesión
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
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">Instancia: {session.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Alias: {session.alias} | Número: {session.phoneNumber}
                        </div>
                      </div>
                      <Badge variant={session.isActive ? "default" : "secondary"}>
                        {session.isActive ? "Activa" : "Desconectada"}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startSession(session.id)}
                        disabled={session.isActive}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => stopSession(session.id)}
                        disabled={!session.isActive}
                      >
                        <Square className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restartSession(session.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateQR(session.name)}
                      >
                        <QrCode className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escanear QR - {selectedSessionQR}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  QR Code para {selectedSessionQR}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
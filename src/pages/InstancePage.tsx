import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Play, Square, RotateCcw, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Session {
  id: number;
  name: string;
  isActive: boolean;
}

export const InstancePage = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, name: 'session_demo_1', isActive: true },
    { id: 2, name: 'session_demo_2', isActive: false },
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
    toast({
      title: "QR Generado",
      description: `QR generado para la sesión "${sessionName}"`,
    });
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

          {/* Global Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Iniciar sesión
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Square className="h-4 w-4" />
              Parar sesión
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reiniciar sesión
            </Button>
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
                        <div className="font-medium">{session.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {session.id}
                        </div>
                      </div>
                      <Badge variant={session.isActive ? "default" : "secondary"}>
                        {session.isActive ? "Activa" : "Desconectada"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {session.isActive ? "On" : "Off"}
                        </span>
                        <Switch
                          checked={session.isActive}
                          onCheckedChange={() => toggleSession(session.id)}
                        />
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
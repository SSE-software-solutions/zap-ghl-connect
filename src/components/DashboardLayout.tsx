import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Search, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardSidebar } from './DashboardSidebar';
import { toast } from '@/hooks/use-toast';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Sub-account
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
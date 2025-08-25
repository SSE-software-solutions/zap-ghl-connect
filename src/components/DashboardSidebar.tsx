import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Rocket, 
  Building2, 
  Palette, 
  Users, 
  BookOpen, 
  Percent, 
  HelpCircle, 
  Puzzle, 
  Settings,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const sidebarItems = [
  { title: 'Launchpad', icon: Rocket, path: '/dashboard' },
  { title: 'Subaccounts', icon: Building2, path: '/dashboard/subaccounts' },
  { title: 'Branding', icon: Palette, path: '/dashboard/branding' },
  { title: 'Community', icon: Users, path: '/dashboard/community' },
  { title: 'Documentation', icon: BookOpen, path: '/dashboard/documentation' },
  { title: 'Affiliate', icon: Percent, path: '/dashboard/affiliate' },
  { title: 'Help Center', icon: HelpCircle, path: '/dashboard/help' },
  { title: 'Integrations', icon: Puzzle, path: '/dashboard/integrations' },
  { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-background border-r border-border h-full flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/b6192fd9-a58b-4a50-bd2a-809422896d69.png" 
              alt="QuickZap Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sm">QuickZap AI</h2>
              <div className="flex items-center gap-1">
                <ChevronUp className="h-3 w-3" />
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/dashboard');
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-start"
        >
          <ChevronUp className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );
};
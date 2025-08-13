import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeMenu: string;
  onMenuChange: (menuId: string) => void;
}

export default function Sidebar({ menuItems, activeMenu, onMenuChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-brand-secondary flex flex-col">
      <div className="p-6 border-b border-brand-secondary">
        <h2 className="text-lg font-semibold text-gray-900">Menu Principal</h2>
        <p className="text-sm text-gray-600">Sistema de Agendamento</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-auto p-3",
                isActive 
                  ? "bg-brand-primary text-white hover:bg-brand-primary/90" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => onMenuChange(item.id)}
              data-testid={`menu-${item.id}`}
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className={cn(
                  "text-xs",
                  isActive ? "text-white/80" : "text-gray-500"
                )}>
                  {item.description}
                </div>
              </div>
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-brand-secondary">
        <div className="text-xs text-gray-500">
          <p>Usuário: admin</p>
          <p>Versão: MVP 1.0</p>
        </div>
      </div>
    </div>
  );
}
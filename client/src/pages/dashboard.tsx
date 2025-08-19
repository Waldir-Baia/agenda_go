import { useState } from "react";
import { Calendar, Users, DollarSign, Settings, CalendarDays, Plus, Clock, Scissors, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "../components/sidebar";
import AgendamentosPage from "./agendamentos";
import ClientesPage from "./clientes";
import ServicosPage from "./servicos";
import ProdutosPage from "./produtos";
import FinanceiroPage from "./financeiro";
import ConfiguracoesPage from "./configuracoes";

type MenuOption = "agendamentos" | "clientes" | "servicos" | "produtos" | "financeiro" | "configuracoes";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuOption>("agendamentos");

  const menuItems = [
    {
      id: "agendamentos" as MenuOption,
      label: "Agendamentos",
      icon: Calendar,
      description: "Gerenciar agendamentos"
    },
    {
      id: "clientes" as MenuOption,
      label: "Clientes",
      icon: Users,
      description: "Cadastro de clientes"
    },
    {
      id: "servicos" as MenuOption,
      label: "Serviços",
      icon: Scissors,
      description: "Gerenciar serviços"
    },
    {
      id: "produtos" as MenuOption,
      label: "Produtos/Almoxerifado",
      icon: Package,
      description: "Controle de estoque"
    },
    {
      id: "financeiro" as MenuOption,
      label: "Financeiro",
      icon: DollarSign,
      description: "Controle financeiro"
    },
    {
      id: "configuracoes" as MenuOption,
      label: "Configurações",
      icon: Settings,
      description: "Configurações do sistema"
    }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "agendamentos":
        return <AgendamentosPage />;
      case "clientes":
        return <ClientesPage />;
      case "servicos":
        return <ServicosPage />;
      case "produtos":
        return <ProdutosPage />;
      case "financeiro":
        return <FinanceiroPage />;
      case "configuracoes":
        return <ConfiguracoesPage />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-background">
      <Sidebar 
        menuItems={menuItems}
        activeMenu={activeMenu}
        onMenuChange={(menuId: string) => setActiveMenu(menuId as MenuOption)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function DashboardHome() {
  const agendamentosHoje = [
    {
      id: "1",
      cliente: "Maria Silva",
      servico: "Consulta Geral",
      horario: "09:00",
      status: "confirmado"
    },
    {
      id: "2",
      cliente: "João Santos",
      servico: "Avaliação",
      horario: "10:30",
      status: "pendente"
    },
    {
      id: "3",
      cliente: "Ana Costa",
      servico: "Retorno",
      horario: "14:00",
      status: "confirmado"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral dos agendamentos de hoje</p>
        </div>
        <Button 
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
          data-testid="button-new-appointment"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <CalendarDays className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendamentosHoje.length}</div>
            <p className="text-xs text-gray-600">
              {agendamentosHoje.filter(a => a.status === "confirmado").length} confirmados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Horário</CardTitle>
            <Clock className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">09:00</div>
            <p className="text-xs text-gray-600">Maria Silva - Consulta Geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">+2 este mês</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agendamentos de Hoje</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("pt-BR", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agendamentosHoje.map((agendamento) => (
              <div 
                key={agendamento.id}
                className="flex items-center justify-between p-4 border border-brand-secondary rounded-lg hover:bg-gray-50 transition-colors"
                data-testid={`appointment-${agendamento.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-semibold text-brand-primary min-w-[60px]">
                    {agendamento.horario}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {agendamento.cliente}
                    </div>
                    <div className="text-sm text-gray-600">
                      {agendamento.servico}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(agendamento.status)}>
                  {agendamento.status}
                </Badge>
              </div>
            ))}
          </div>
          
          {agendamentosHoje.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum agendamento para hoje</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { Calendar, Plus, Search, Filter, Clock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AgendamentosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const agendamentos = [
    {
      id: "1",
      cliente: "Maria Silva",
      telefone: "(11) 99999-1234",
      servico: "Consulta Geral",
      data: "2024-01-15",
      horario: "09:00",
      status: "confirmado",
      observacoes: "Primera consulta"
    },
    {
      id: "2",
      cliente: "João Santos",
      telefone: "(11) 88888-5678",
      servico: "Avaliação",
      data: "2024-01-15",
      horario: "10:30",
      status: "pendente",
      observacoes: ""
    },
    {
      id: "3",
      cliente: "Ana Costa",
      telefone: "(11) 77777-9012",
      servico: "Retorno",
      data: "2024-01-15",
      horario: "14:00",
      status: "confirmado",
      observacoes: "Paciente preferencial"
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

  const filteredAgendamentos = agendamentos.filter(agendamento => {
    const matchesSearch = agendamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || agendamento.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie todos os agendamentos</p>
        </div>
        <Button 
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
          data-testid="button-new-appointment"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Encontre agendamentos específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-appointments"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Agendamentos</CardTitle>
          <CardDescription>
            {filteredAgendamentos.length} agendamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAgendamentos.map((agendamento) => (
              <div 
                key={agendamento.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-brand-secondary rounded-lg hover:bg-gray-50 transition-colors space-y-4 md:space-y-0"
                data-testid={`appointment-card-${agendamento.id}`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-brand-primary" />
                      <span className="font-semibold text-brand-primary">
                        {agendamento.horario}
                      </span>
                    </div>
                    <Badge className={getStatusColor(agendamento.status)}>
                      {agendamento.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {agendamento.cliente}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {agendamento.telefone}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Serviço:</strong> {agendamento.servico}
                  </div>
                  
                  {agendamento.observacoes && (
                    <div className="text-sm text-gray-600">
                      <strong>Obs:</strong> {agendamento.observacoes}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-edit-${agendamento.id}`}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-cancel-${agendamento.id}`}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAgendamentos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum agendamento encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
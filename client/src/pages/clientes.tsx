import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Client } from "@shared/schema";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const res = await apiRequest("DELETE", `/api/clients/${clientId}`);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message || "Cliente excluído com sucesso",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao excluir cliente",
      });
    },
  });

  const filteredClients = clients.filter((client: Client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleDeleteClient = (clientId: string, clientName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${clientName}?`)) {
      deleteClientMutation.mutate(clientId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">Carregando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes cadastrados</p>
        </div>
        <Button 
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
          data-testid="button-new-client"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
          <CardDescription>Encontre clientes por nome, e-mail ou telefone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, e-mail ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-clients"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client: Client) => (
              <div 
                key={client.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-brand-secondary rounded-lg hover:bg-gray-50 transition-colors space-y-4 md:space-y-0"
                data-testid={`client-card-${client.id}`}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-brand-primary" />
                    <span className="font-medium text-gray-900 text-lg">
                      {client.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {client.email}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {client.phone}
                    </span>
                  </div>
                  
                  {client.observations && (
                    <div className="text-sm text-gray-600">
                      <strong>Observações:</strong> {client.observations}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-edit-${client.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    disabled={deleteClientMutation.isPending}
                    data-testid={`button-delete-${client.id}`}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum cliente encontrado</p>
              {searchTerm && (
                <p className="text-sm">Tente alterar os termos de busca</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, User, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertClientSchema, type Client, type InsertClient } from "@shared/schema";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: "",
      cpf_cnpj: "",
      address: "",
      phone: "",
      email: "",
      observations: "",
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: InsertClient) => {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar cliente");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Sucesso!",
        description: "Cliente cadastrado com sucesso.",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar cliente.",
        variant: "destructive",
      });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertClient> }) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar cliente");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso.",
      });
      setEditingClient(null);
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar cliente.",
        variant: "destructive",
      });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao excluir cliente");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Sucesso!",
        description: "Cliente excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir cliente.",
        variant: "destructive",
      });
    },
  });

  const filteredClients = clients.filter((client: Client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.cpf_cnpj.includes(searchTerm) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (data: InsertClient) => {
    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, data });
    } else {
      createClientMutation.mutate(data);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    form.reset({
      name: client.name,
      cpf_cnpj: client.cpf_cnpj,
      address: client.address,
      phone: client.phone,
      email: client.email,
      observations: client.observations || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteClientMutation.mutate(id);
  };

  const handleNewClient = () => {
    setEditingClient(null);
    form.reset({
      name: "",
      cpf_cnpj: "",
      address: "",
      phone: "",
      email: "",
      observations: "",
    });
    setIsDialogOpen(true);
  };

  const formatCpfCnpj = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Carregando clientes...</div>
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewClient} data-testid="button-new-client">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Cliente
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ex: João Silva Santos"
                          data-testid="input-client-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf_cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="000.000.000-00 ou 00.000.000/0000-00"
                          data-testid="input-client-cpf-cnpj"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Completo *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          value={field.value || ""}
                          placeholder="Rua, número, bairro, cidade, CEP..."
                          rows={3}
                          data-testid="input-client-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="(11) 99999-9999"
                            data-testid="input-client-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            placeholder="cliente@email.com"
                            data-testid="input-client-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          value={field.value || ""}
                          placeholder="Informações adicionais sobre o cliente..."
                          rows={3}
                          data-testid="input-client-observations"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createClientMutation.isPending || updateClientMutation.isPending}
                    data-testid="button-save-client"
                  >
                    {createClientMutation.isPending || updateClientMutation.isPending 
                      ? "Salvando..." 
                      : editingClient ? "Atualizar" : "Cadastrar"
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Clientes</CardTitle>
          <CardDescription>Encontre clientes por nome, e-mail, telefone, CPF/CNPJ ou endereço</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, e-mail, telefone, CPF/CNPJ ou endereço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-clients"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {clients.length === 0 ? "Nenhum cliente cadastrado" : "Nenhum cliente encontrado"}
              </h3>
              <p className="text-gray-600 mb-4">
                {clients.length === 0 
                  ? "Comece cadastrando o primeiro cliente." 
                  : "Tente ajustar os termos de busca."}
              </p>
              {clients.length === 0 && (
                <Button onClick={handleNewClient} data-testid="button-first-client">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Cliente
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClients.map((client: Client) => (
                <Card key={client.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5 text-brand-primary" />
                          {client.name}
                        </CardTitle>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                          data-testid={`button-edit-client-${client.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-delete-client-${client.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente "{client.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(client.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="h-4 w-4 mr-2" />
                      {client.cpf_cnpj}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {client.phone}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {client.email}
                    </div>
                    
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>

                    {client.observations && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Observações:</strong> {client.observations}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
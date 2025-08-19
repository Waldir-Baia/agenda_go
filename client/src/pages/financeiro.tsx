import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard, Plus, Edit, Trash2, CheckCircle, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAccountReceivableSchema, insertAccountPayableSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type AccountReceivable = {
  id: string;
  client_id?: string;
  appointment_id?: string;
  description: string;
  amount: string;
  due_date: string;
  payment_date?: string;
  status: string;
  payment_method?: string;
  observations?: string;
  created_at: Date;
};

type AccountPayable = {
  id: string;
  supplier: string;
  description: string;
  amount: string;
  due_date: string;
  payment_date?: string;
  status: string;
  payment_method?: string;
  category: string;
  observations?: string;
  created_at: Date;
};

type FinancialSummary = {
  totalReceivable: number;
  totalPayable: number;
  paidReceivable: number;
  paidPayable: number;
  pendingReceivable: number;
  pendingPayable: number;
  balance: number;
  projectedBalance: number;
};

export default function FinanceiroPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"receivable" | "payable">("receivable");
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  // Queries
  const { data: summary, isLoading: summaryLoading } = useQuery<FinancialSummary>({
    queryKey: ["/api/financial/summary", currentMonth],
  });

  const { data: accountsReceivable, isLoading: receivablesLoading } = useQuery<AccountReceivable[]>({
    queryKey: ["/api/accounts-receivable"],
  });

  const { data: accountsPayable, isLoading: payablesLoading } = useQuery<AccountPayable[]>({
    queryKey: ["/api/accounts-payable"],
  });

  // Forms
  const receivableForm = useForm<z.infer<typeof insertAccountReceivableSchema>>({
    resolver: zodResolver(insertAccountReceivableSchema),
    defaultValues: {
      description: "",
      amount: "",
      due_date: "",
      status: "pendente",
    },
  });

  const payableForm = useForm<z.infer<typeof insertAccountPayableSchema>>({
    resolver: zodResolver(insertAccountPayableSchema),
    defaultValues: {
      supplier: "",
      description: "",
      amount: "",
      due_date: "",
      category: "",
      status: "pendente",
    },
  });

  // Mutations
  const createReceivableMutation = useMutation({
    mutationFn: (data: z.infer<typeof insertAccountReceivableSchema>) =>
      apiRequest("/api/accounts-receivable", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts-receivable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial/summary"] });
      setDialogOpen(false);
      receivableForm.reset();
      toast({ description: "Conta a receber cadastrada com sucesso" });
    },
  });

  const updateReceivableMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<z.infer<typeof insertAccountReceivableSchema>> }) =>
      apiRequest(`/api/accounts-receivable/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts-receivable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial/summary"] });
      setDialogOpen(false);
      setEditingAccount(null);
      receivableForm.reset();
      toast({ description: "Conta a receber atualizada com sucesso" });
    },
  });

  const deleteReceivableMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/accounts-receivable/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts-receivable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial/summary"] });
      toast({ description: "Conta a receber excluída com sucesso" });
    },
  });

  const createPayableMutation = useMutation({
    mutationFn: (data: z.infer<typeof insertAccountPayableSchema>) =>
      apiRequest("/api/accounts-payable", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts-payable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial/summary"] });
      setDialogOpen(false);
      payableForm.reset();
      toast({ description: "Conta a pagar cadastrada com sucesso" });
    },
  });

  const updatePayableMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<z.infer<typeof insertAccountPayableSchema>> }) =>
      apiRequest(`/api/accounts-payable/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts-payable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial/summary"] });
      setDialogOpen(false);
      setEditingAccount(null);
      payableForm.reset();
      toast({ description: "Conta a pagar atualizada com sucesso" });
    },
  });

  const deletePayableMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/accounts-payable/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts-payable"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial/summary"] });
      toast({ description: "Conta a pagar excluída com sucesso" });
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "atrasado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "cancelado":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const openDialog = (type: "receivable" | "payable", account?: any) => {
    setDialogType(type);
    setEditingAccount(account);
    
    if (account) {
      if (type === "receivable") {
        receivableForm.reset(account);
      } else {
        payableForm.reset(account);
      }
    } else {
      if (type === "receivable") {
        receivableForm.reset({
          description: "",
          amount: "",
          due_date: "",
          status: "pendente",
        });
      } else {
        payableForm.reset({
          supplier: "",
          description: "",
          amount: "",
          due_date: "",
          category: "",
          status: "pendente",
        });
      }
    }
    
    setDialogOpen(true);
  };

  const onReceivableSubmit = (data: z.infer<typeof insertAccountReceivableSchema>) => {
    if (editingAccount) {
      updateReceivableMutation.mutate({ id: editingAccount.id, data });
    } else {
      createReceivableMutation.mutate(data);
    }
  };

  const onPayableSubmit = (data: z.infer<typeof insertAccountPayableSchema>) => {
    if (editingAccount) {
      updatePayableMutation.mutate({ id: editingAccount.id, data });
    } else {
      createPayableMutation.mutate(data);
    }
  };

  const markAsPaid = (type: "receivable" | "payable", account: any) => {
    const updateData = {
      status: "pago",
      payment_date: new Date().toISOString().slice(0, 10),
    };

    if (type === "receivable") {
      updateReceivableMutation.mutate({ id: account.id, data: updateData });
    } else {
      updatePayableMutation.mutate({ id: account.id, data: updateData });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestão financeira completa do sistema</p>
        </div>
      </div>

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resumo" data-testid="tab-resumo">Resumo do Mês</TabsTrigger>
          <TabsTrigger value="receber" data-testid="tab-receber">Contas a Receber</TabsTrigger>
          <TabsTrigger value="pagar" data-testid="tab-pagar">Contas a Pagar</TabsTrigger>
        </TabsList>

        {/* Resumo do Mês */}
        <TabsContent value="resumo" className="space-y-6">
          {summaryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(summary?.totalReceivable || 0)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Pago: {formatCurrency(summary?.paidReceivable || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(summary?.totalPayable || 0)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Pago: {formatCurrency(summary?.paidPayable || 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${(summary?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(summary?.balance || 0)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Recebido - Pago
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo Projetado</CardTitle>
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${(summary?.projectedBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(summary?.projectedBalance || 0)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Previsão total
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-400">Pendências a Receber</CardTitle>
                    <CardDescription>
                      {formatCurrency(summary?.pendingReceivable || 0)} aguardando recebimento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {receivablesLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {accountsReceivable?.filter(acc => acc.status === "pendente").slice(0, 5).map((account) => (
                          <div key={account.id} className="flex justify-between items-center">
                            <span className="text-sm">{account.description}</span>
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              {formatCurrency(parseFloat(account.amount))}
                            </Badge>
                          </div>
                        ))}
                        {(!accountsReceivable || accountsReceivable.filter(acc => acc.status === "pendente").length === 0) && (
                          <p className="text-sm text-gray-500">Nenhuma pendência encontrada</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700 dark:text-red-400">Pendências a Pagar</CardTitle>
                    <CardDescription>
                      {formatCurrency(summary?.pendingPayable || 0)} aguardando pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payablesLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {accountsPayable?.filter(acc => acc.status === "pendente").slice(0, 5).map((account) => (
                          <div key={account.id} className="flex justify-between items-center">
                            <span className="text-sm">{account.description}</span>
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              {formatCurrency(parseFloat(account.amount))}
                            </Badge>
                          </div>
                        ))}
                        {(!accountsPayable || accountsPayable.filter(acc => acc.status === "pendente").length === 0) && (
                          <p className="text-sm text-gray-500">Nenhuma pendência encontrada</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Contas a Receber */}
        <TabsContent value="receber" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Contas a Receber</h2>
            <Button 
              onClick={() => openDialog("receivable")}
              data-testid="button-add-receivable"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Conta
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {receivablesLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {accountsReceivable?.map((account) => (
                    <div 
                      key={account.id} 
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      data-testid={`receivable-${account.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-medium">{account.description}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Vencimento: {new Date(account.due_date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">
                              {formatCurrency(parseFloat(account.amount))}
                            </div>
                            <Badge className={getStatusColor(account.status)}>
                              {account.status}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-1">
                            {account.status === "pendente" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsPaid("receivable", account)}
                                data-testid={`button-pay-receivable-${account.id}`}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog("receivable", account)}
                              data-testid={`button-edit-receivable-${account.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteReceivableMutation.mutate(account.id)}
                              data-testid={`button-delete-receivable-${account.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!accountsReceivable || accountsReceivable.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma conta a receber cadastrada</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contas a Pagar */}
        <TabsContent value="pagar" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Contas a Pagar</h2>
            <Button 
              onClick={() => openDialog("payable")}
              data-testid="button-add-payable"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Conta
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {payablesLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {accountsPayable?.map((account) => (
                    <div 
                      key={account.id} 
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      data-testid={`payable-${account.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-medium">{account.description}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Fornecedor: {account.supplier} • Vencimento: {new Date(account.due_date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-red-600">
                              {formatCurrency(parseFloat(account.amount))}
                            </div>
                            <Badge className={getStatusColor(account.status)}>
                              {account.status}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-1">
                            {account.status === "pendente" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsPaid("payable", account)}
                                data-testid={`button-pay-payable-${account.id}`}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog("payable", account)}
                              data-testid={`button-edit-payable-${account.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deletePayableMutation.mutate(account.id)}
                              data-testid={`button-delete-payable-${account.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!accountsPayable || accountsPayable.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma conta a pagar cadastrada</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para Criar/Editar Contas */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingAccount 
                ? `Editar Conta a ${dialogType === "receivable" ? "Receber" : "Pagar"}` 
                : `Nova Conta a ${dialogType === "receivable" ? "Receber" : "Pagar"}`
              }
            </DialogTitle>
            <DialogDescription>
              {editingAccount 
                ? "Atualize as informações da conta." 
                : `Preencha os dados da nova conta a ${dialogType === "receivable" ? "receber" : "pagar"}.`
              }
            </DialogDescription>
          </DialogHeader>

          {dialogType === "receivable" ? (
            <Form {...receivableForm}>
              <form onSubmit={receivableForm.handleSubmit(onReceivableSubmit)} className="space-y-4">
                <FormField
                  control={receivableForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Pagamento de serviço" data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={receivableForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" placeholder="0,00" data-testid="input-amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={receivableForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Vencimento</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" data-testid="input-due-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={receivableForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="atrasado">Atrasado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={receivableForm.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          placeholder="Informações adicionais..." 
                          rows={3}
                          data-testid="textarea-observations"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createReceivableMutation.isPending || updateReceivableMutation.isPending}
                    data-testid="button-save-receivable"
                  >
                    {editingAccount ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...payableForm}>
              <form onSubmit={payableForm.handleSubmit(onPayableSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={payableForm.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do fornecedor" data-testid="input-supplier" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={payableForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="operacional">Operacional</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="equipamentos">Equipamentos</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={payableForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Material de escritório" data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={payableForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" placeholder="0,00" data-testid="input-amount" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={payableForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Vencimento</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" data-testid="input-due-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={payableForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="atrasado">Atrasado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={payableForm.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          placeholder="Informações adicionais..." 
                          rows={3}
                          data-testid="textarea-observations"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createPayableMutation.isPending || updatePayableMutation.isPending}
                    data-testid="button-save-payable"
                  >
                    {editingAccount ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
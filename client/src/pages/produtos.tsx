import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, ShoppingCart, DollarSign, Tag, Barcode, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertProductSchema, type Product, type InsertProduct } from "@shared/schema";

export default function ProdutosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Categorias disponíveis
  const categories = [
    { value: "consumo", label: "Consumo" },
    { value: "venda", label: "Venda" },
    { value: "uso", label: "Uso" },
  ];

  // Unidades disponíveis
  const units = [
    { value: "unidade", label: "Unidade" },
    { value: "kg", label: "Quilograma (kg)" },
    { value: "g", label: "Grama (g)" },
    { value: "litro", label: "Litro (L)" },
    { value: "ml", label: "Mililitro (ml)" },
    { value: "metro", label: "Metro (m)" },
    { value: "cm", label: "Centímetro (cm)" },
    { value: "pacote", label: "Pacote" },
    { value: "caixa", label: "Caixa" },
  ];

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      quantity: "0",
      min_quantity: "5",
      unit: "",
      cost_price: "",
      sale_price: "",
      supplier: "",
      barcode: "",
      active: "true",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar produto");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Sucesso!",
        description: "Produto cadastrado com sucesso.",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar produto.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProduct> }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar produto");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso.",
      });
      setEditingProduct(null);
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar produto.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao excluir produto");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Sucesso!",
        description: "Produto excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir produto.",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm);
    
    const matchesCategory = categoryFilter === "todas" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "consumo":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "venda":
        return "bg-green-100 text-green-800 border-green-200";
      case "uso":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStockStatus = (quantity: string, minQuantity: string) => {
    const qty = Number(quantity);
    const minQty = Number(minQuantity);
    
    if (qty === 0) {
      return { status: "Sem estoque", color: "bg-red-100 text-red-800 border-red-200", icon: <AlertTriangle className="h-4 w-4" /> };
    } else if (qty <= minQty) {
      return { status: "Estoque baixo", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: <AlertTriangle className="h-4 w-4" /> };
    } else {
      return { status: "Em estoque", color: "bg-green-100 text-green-800 border-green-200", icon: <Package className="h-4 w-4" /> };
    }
  };

  const handleSubmit = (data: InsertProduct) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      category: product.category,
      quantity: product.quantity,
      min_quantity: product.min_quantity,
      unit: product.unit,
      cost_price: product.cost_price || "",
      sale_price: product.sale_price || "",
      supplier: product.supplier || "",
      barcode: product.barcode || "",
      active: product.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    form.reset({
      name: "",
      description: "",
      category: "",
      quantity: "0",
      min_quantity: "5",
      unit: "",
      cost_price: "",
      sale_price: "",
      supplier: "",
      barcode: "",
      active: "true",
    });
    setIsDialogOpen(true);
  };

  const lowStockProducts = products.filter(product => 
    Number(product.quantity) <= Number(product.min_quantity)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos/Almoxerifado</h1>
          <p className="text-gray-600">Controle de estoque e produtos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewProduct} data-testid="button-new-product">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Produto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Produto *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: Shampoo Profissional"
                            data-testid="input-product-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Categoria */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Descrição */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          value={field.value || ""}
                          placeholder="Descrição detalhada do produto..."
                          rows={3}
                          data-testid="input-product-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Quantidade */}
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade Atual *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            data-testid="input-product-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantidade Mínima */}
                  <FormField
                    control={form.control}
                    name="min_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estoque Mínimo *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="5"
                            data-testid="input-product-min-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Unidade */}
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidade *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-unit">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preço de Custo */}
                  <FormField
                    control={form.control}
                    name="cost_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Custo</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            value={field.value || ""}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            data-testid="input-product-cost-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preço de Venda */}
                  <FormField
                    control={form.control}
                    name="sale_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Venda</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            value={field.value || ""}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            data-testid="input-product-sale-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fornecedor */}
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fornecedor</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            value={field.value || ""}
                            placeholder="Nome do fornecedor"
                            data-testid="input-product-supplier"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Código de Barras */}
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de Barras</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            value={field.value || ""}
                            placeholder="EAN/UPC"
                            data-testid="input-product-barcode"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status - apenas na edição */}
                {editingProduct && (
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-active">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Ativo</SelectItem>
                            <SelectItem value="false">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    data-testid="button-save-product"
                  >
                    {createProductMutation.isPending || updateProductMutation.isPending 
                      ? "Salvando..." 
                      : editingProduct ? "Atualizar" : "Cadastrar"
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerta de Estoque Baixo */}
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alerta de Estoque
            </CardTitle>
            <CardDescription className="text-yellow-700">
              {lowStockProducts.length} produto(s) com estoque baixo ou esgotado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <Badge key={product.id} variant="outline" className="text-yellow-800 border-yellow-300">
                  {product.name} ({product.quantity} {product.unit})
                </Badge>
              ))}
              {lowStockProducts.length > 5 && (
                <span className="text-sm text-yellow-700">
                  e mais {lowStockProducts.length - 5} produtos...
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
          <CardDescription>Encontre produtos por nome, descrição, fornecedor ou código</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]" data-testid="select-category-filter">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            {filteredProducts.length} produto(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {products.length === 0 ? "Nenhum produto cadastrado" : "Nenhum produto encontrado"}
              </h3>
              <p className="text-gray-600 mb-4">
                {products.length === 0 
                  ? "Comece cadastrando o primeiro produto." 
                  : "Tente ajustar os filtros de busca."}
              </p>
              {products.length === 0 && (
                <Button onClick={handleNewProduct} data-testid="button-first-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Produto
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.quantity, product.min_quantity);
                
                return (
                  <Card key={product.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Package className="h-5 w-5 text-brand-primary" />
                            {product.name}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className={getCategoryColor(product.category)}>
                              {categories.find(c => c.value === product.category)?.label || product.category}
                            </Badge>
                            <Badge className={stockStatus.color} variant="outline">
                              {stockStatus.icon}
                              <span className="ml-1">{stockStatus.status}</span>
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            data-testid={`button-edit-product-${product.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                data-testid={`button-delete-product-${product.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o produto "{product.name}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
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
                    
                    <CardContent className="pt-0 space-y-3">
                      {product.description && (
                        <p className="text-sm text-gray-600">{product.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Estoque:</span>
                          <p className="text-gray-600">{product.quantity} {product.unit}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Mín:</span>
                          <p className="text-gray-600">{product.min_quantity} {product.unit}</p>
                        </div>
                      </div>

                      {(product.cost_price || product.sale_price) && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {product.cost_price && (
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>Custo: R$ {product.cost_price}</span>
                            </div>
                          )}
                          
                          {product.sale_price && (
                            <div className="flex items-center text-gray-600">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              <span>Venda: R$ {product.sale_price}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {(product.supplier || product.barcode) && (
                        <div className="space-y-2 text-sm">
                          {product.supplier && (
                            <div className="flex items-center text-gray-600">
                              <Truck className="h-4 w-4 mr-2" />
                              <span>{product.supplier}</span>
                            </div>
                          )}
                          
                          {product.barcode && (
                            <div className="flex items-center text-gray-600">
                              <Barcode className="h-4 w-4 mr-2" />
                              <span className="font-mono text-xs">{product.barcode}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, User, Phone, Mail, Clipboard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertClientSchema, type InsertClient } from "@shared/schema";

export default function ClientRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      observations: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertClient) => {
      const res = await apiRequest("POST", "/api/clients", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message || "Cliente cadastrado com sucesso",
      });
      form.reset();
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Erro ao cadastrar cliente",
      });
    },
  });

  const onSubmit = (data: InsertClient) => {
    registrationMutation.mutate(data);
  };

  const goToLogin = () => {
    setLocation("/login");
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numbers.length >= 7) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (numbers.length >= 3) {
      return numbers.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }
    return numbers;
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-brand-background border border-brand-secondary rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <UserPlus className="text-brand-primary text-4xl h-16 w-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Cadastro de Cliente
            </h2>
            <p className="text-gray-600">
              Preencha os dados para criar uma nova conta
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <User className="text-gray-400 mr-2 h-4 w-4" />
                        Nome Completo *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="input-name"
                          placeholder="Digite o nome completo"
                          className="w-full px-4 py-3 border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Phone className="text-gray-400 mr-2 h-4 w-4" />
                        Telefone *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="input-phone"
                          placeholder="(11) 99999-9999"
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                          className="w-full px-4 py-3 border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400"
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
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Mail className="text-gray-400 mr-2 h-4 w-4" />
                        E-mail *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          data-testid="input-email"
                          placeholder="cliente@exemplo.com"
                          className="w-full px-4 py-3 border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Clipboard className="text-gray-400 mr-2 h-4 w-4" />
                        Observações
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          data-testid="textarea-observations"
                          rows={3}
                          placeholder="Informações adicionais sobre o cliente (opcional)"
                          className="w-full px-4 py-3 border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-gray-50 border border-brand-secondary rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Campos obrigatórios marcados com *</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Ao cadastrar-se, você concorda com nossos termos de uso e
                  política de privacidade.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  data-testid="button-register"
                  disabled={registrationMutation.isPending}
                  className="w-full bg-brand-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-primary/90 focus:ring-4 focus:ring-brand-primary/20 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>
                    {registrationMutation.isPending
                      ? "Cadastrando..."
                      : "Cadastrar Cliente"}
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={goToLogin}
                  data-testid="button-back-to-login"
                  className="w-full bg-white border border-brand-secondary text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar ao Login</span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

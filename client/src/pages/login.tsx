import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserCircle, User, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginData } from "@shared/schema";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso",
        description: data.message || "Login realizado com sucesso",
      });
      // Redirect to dashboard after successful login
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Usuário ou senha inválidos",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const goToRegistration = () => {
    setLocation("/cadastro-cliente");
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-brand-background border border-brand-secondary rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <UserCircle className="text-brand-primary text-4xl h-16 w-16 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Entrar no Sistema
            </h2>
            <p className="text-gray-600">
              Acesse sua conta para gerenciar agendamentos
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <User className="text-gray-400 mr-2 h-4 w-4" />
                        Usuário
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          data-testid="input-username"
                          placeholder="Digite seu usuário"
                          className="w-full px-4 py-3 border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Lock className="text-gray-400 mr-2 h-4 w-4" />
                        Senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          data-testid="input-password"
                          placeholder="Digite sua senha"
                          className="w-full px-4 py-3 border border-brand-secondary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors duration-200 placeholder-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  data-testid="button-login"
                  disabled={loginMutation.isPending}
                  className="w-full bg-brand-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-primary/90 focus:ring-4 focus:ring-brand-primary/20 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>
                    {loginMutation.isPending ? "Entrando..." : "Entrar"}
                  </span>
                </Button>

                <div className="text-center">
                  <span className="text-gray-500 text-sm">
                    Não tem uma conta?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={goToRegistration}
                    data-testid="link-register"
                    className="text-brand-primary font-medium hover:text-brand-primary/80 transition-colors duration-200 text-sm"
                  >
                    Cadastrar Cliente
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

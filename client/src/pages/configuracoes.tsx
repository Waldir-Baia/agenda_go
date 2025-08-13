import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do sistema</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-brand-primary" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Informações básicas da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input 
                  id="username" 
                  defaultValue="admin"
                  data-testid="input-username-config"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue="admin@sistema.com"
                  data-testid="input-email-config"
                />
              </div>
            </div>
            <Button 
              className="bg-brand-primary text-white hover:bg-brand-primary/90"
              data-testid="button-save-profile"
            >
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-brand-primary" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure as notificações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notification-email">Notificações por E-mail</Label>
                <p className="text-sm text-gray-600">
                  Receber confirmações e lembretes por e-mail
                </p>
              </div>
              <Switch 
                id="notification-email" 
                defaultChecked 
                data-testid="switch-email-notifications"
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notification-sms">Notificações por SMS</Label>
                <p className="text-sm text-gray-600">
                  Receber lembretes de agendamento por SMS
                </p>
              </div>
              <Switch 
                id="notification-sms" 
                data-testid="switch-sms-notifications"
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notification-desktop">Notificações do Sistema</Label>
                <p className="text-sm text-gray-600">
                  Mostrar notificações no navegador
                </p>
              </div>
              <Switch 
                id="notification-desktop" 
                defaultChecked 
                data-testid="switch-desktop-notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2 text-brand-primary" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a aparência do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Paleta de Cores Atual</Label>
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-gray-300" title="#FFFFFF - Fundo"></div>
                <div className="w-8 h-8 rounded-lg" style={{backgroundColor: '#D9D9D9'}} title="#D9D9D9 - Secundário"></div>
                <div className="w-8 h-8 rounded-lg" style={{backgroundColor: '#284B63'}} title="#284B63 - Primário"></div>
              </div>
              <p className="text-sm text-gray-600">
                Tema minimalista: Branco, Cinza Claro, Azul Escuro
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-brand-primary" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input 
                id="current-password" 
                type="password"
                placeholder="Digite sua senha atual"
                data-testid="input-current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input 
                id="new-password" 
                type="password"
                placeholder="Digite a nova senha"
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input 
                id="confirm-password" 
                type="password"
                placeholder="Confirme a nova senha"
                data-testid="input-confirm-password"
              />
            </div>
            <Button 
              variant="outline"
              data-testid="button-change-password"
            >
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-brand-primary" />
              Sistema
            </CardTitle>
            <CardDescription>
              Informações e configurações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Versão do Sistema</Label>
                <p className="text-sm text-gray-600">MVP v1.0</p>
              </div>
              <div>
                <Label>Modo de Operação</Label>
                <p className="text-sm text-gray-600">Desenvolvimento</p>
              </div>
              <div>
                <Label>Banco de Dados</Label>
                <p className="text-sm text-gray-600">Memória (MemStorage)</p>
              </div>
              <div>
                <Label>Última Atualização</Label>
                <p className="text-sm text-gray-600">Janeiro 2024</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex flex-col space-y-2">
              <Label>Ações do Sistema</Label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid="button-backup-data"
                >
                  Backup dos Dados
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid="button-clear-cache"
                >
                  Limpar Cache
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
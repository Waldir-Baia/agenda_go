import { DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FinanceiroPage() {
  const resumoFinanceiro = {
    receitaTotal: 2450.00,
    receitaMes: 1200.00,
    pendentesRecebimento: 350.00,
    gastosOperacionais: 800.00
  };

  const transacoes = [
    {
      id: "1",
      tipo: "receita",
      descricao: "Consulta - Maria Silva",
      valor: 150.00,
      data: "2024-01-15",
      status: "pago"
    },
    {
      id: "2",
      tipo: "receita",
      descricao: "Avaliação - João Santos",
      valor: 200.00,
      data: "2024-01-14",
      status: "pendente"
    },
    {
      id: "3",
      tipo: "despesa",
      descricao: "Material de escritório",
      valor: 85.00,
      data: "2024-01-13",
      status: "pago"
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "receita" 
      ? "text-green-600" 
      : "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle financeiro do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(resumoFinanceiro.receitaTotal)}
            </div>
            <p className="text-xs text-gray-600">Acumulado no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(resumoFinanceiro.receitaMes)}
            </div>
            <p className="text-xs text-gray-600">Janeiro 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente Recebimento</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(resumoFinanceiro.pendentesRecebimento)}
            </div>
            <p className="text-xs text-gray-600">A receber</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Operacionais</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(resumoFinanceiro.gastosOperacionais)}
            </div>
            <p className="text-xs text-gray-600">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Últimas movimentações financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transacoes.map((transacao) => (
              <div 
                key={transacao.id}
                className="flex items-center justify-between p-4 border border-brand-secondary rounded-lg hover:bg-gray-50 transition-colors"
                data-testid={`transaction-${transacao.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    {transacao.tipo === "receita" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">
                      {transacao.descricao}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(transacao.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`text-lg font-semibold ${getTipoColor(transacao.tipo)}`}>
                    {transacao.tipo === "receita" ? "+" : "-"}
                    {formatCurrency(transacao.valor)}
                  </div>
                  <Badge className={getStatusColor(transacao.status)}>
                    {transacao.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {transacoes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma transação registrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Performance</CardTitle>
          <CardDescription>Indicadores de desempenho financeiro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Receita por Fonte</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consultas</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avaliações</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Retornos</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Meta do Mês</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Atual</span>
                  <span className="text-sm font-medium">{formatCurrency(resumoFinanceiro.receitaMes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Meta</span>
                  <span className="text-sm font-medium">{formatCurrency(1500)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progresso</span>
                  <span className="text-sm font-medium text-green-600">80%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
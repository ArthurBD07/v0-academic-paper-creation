import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, TrendingUp, Receipt, LineChart, Binary } from "lucide-react"

export default function Home() {
  const functions = [
    {
      id: 1,
      title: "Análise de Investimentos",
      description: "Variação de valores a juros compostos",
      icon: TrendingUp,
      href: "/funcao-1",
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Investimentos com Aportes",
      description: "Análise com aportes periódicos",
      icon: Calculator,
      href: "/funcao-2",
      color: "text-green-600",
    },
    {
      id: 3,
      title: "Imposto de Renda",
      description: "Cálculo do IRRF",
      icon: Receipt,
      href: "/funcao-3",
      color: "text-orange-600",
    },
    {
      id: 4,
      title: "Equação da Reta",
      description: "Função do primeiro grau",
      icon: LineChart,
      href: "/funcao-4",
      color: "text-purple-600",
    },
    {
      id: 5,
      title: "Método da Bisseção",
      description: "Cálculo de raiz de função",
      icon: Binary,
      href: "/funcao-5",
      color: "text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">Sistema Computacional</h1>
          <p className="text-xl text-muted-foreground mb-2">Fundamentos de Matemática</p>
          <p className="text-lg text-muted-foreground">Professor Paulo Fernando</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {functions.map((func) => {
            const Icon = func.icon
            return (
              <Link key={func.id} href={func.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-muted ${func.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">Função {func.id}</span>
                    </div>
                    <CardTitle className="text-xl">{func.title}</CardTitle>
                    <CardDescription>{func.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Clique para acessar</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

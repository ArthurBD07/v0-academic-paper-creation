"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { formatCurrency, formatNumber } from "@/lib/format-number"

export default function Funcao1() {
  const [capital, setCapital] = useState("")
  const [tempo, setTempo] = useState("")
  const [taxaAplicacao, setTaxaAplicacao] = useState("")
  const [taxaIPCA, setTaxaIPCA] = useState("")
  const [resultado, setResultado] = useState<any>(null)

  const calcular = () => {
    const C = Number.parseFloat(capital)
    const t = Number.parseFloat(tempo)
    const iAplicacao = Number.parseFloat(taxaAplicacao) / 100
    const iIPCA = Number.parseFloat(taxaIPCA) / 100

    // Montante final com taxa de aplicação
    const montanteAplicacao = C * Math.pow(1 + iAplicacao, t)

    // Montante final com IPCA
    const montanteIPCA = C * Math.pow(1 + iIPCA, t)

    // Diferença
    const diferenca = montanteAplicacao - montanteIPCA

    // Gerar dados para o gráfico (dividindo em 10 partes)
    const chartData = []
    const partes = 10
    for (let i = 0; i <= partes; i++) {
      const tempoAtual = (t * i) / partes
      const montanteAplicacaoAtual = C * Math.pow(1 + iAplicacao, tempoAtual)
      const montanteIPCAAtual = C * Math.pow(1 + iIPCA, tempoAtual)

      chartData.push({
        tempo: formatNumber(tempoAtual, 1),
        "Taxa de Aplicação": Number.parseFloat(montanteAplicacaoAtual.toFixed(2)),
        IPCA: Number.parseFloat(montanteIPCAAtual.toFixed(2)),
      })
    }

    setResultado({
      montanteAplicacao,
      montanteIPCA,
      diferenca,
      chartData,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Função 1: Análise de Investimentos</CardTitle>
            <CardDescription>Variação de valores a juros compostos: M = C · (1 + i)^t</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capital">Capital Inicial (R$)</Label>
                <Input
                  id="capital"
                  type="number"
                  placeholder="Ex: 10000"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempo">Tempo de Aplicação (anos)</Label>
                <Input
                  id="tempo"
                  type="number"
                  placeholder="Ex: 5"
                  value={tempo}
                  onChange={(e) => setTempo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxaAplicacao">Taxa de Aplicação (%)</Label>
                <Input
                  id="taxaAplicacao"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 10.5"
                  value={taxaAplicacao}
                  onChange={(e) => setTaxaAplicacao(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxaIPCA">Taxa IPCA (%)</Label>
                <Input
                  id="taxaIPCA"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 4.5"
                  value={taxaIPCA}
                  onChange={(e) => setTaxaIPCA(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calcular} className="w-full">
              Calcular
            </Button>

            {resultado && (
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Montante com Taxa de Aplicação</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(resultado.montanteAplicacao)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Montante com IPCA</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(resultado.montanteIPCA)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Diferença</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(resultado.diferenca)}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Evolução do Montante</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={resultado.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="tempo"
                          label={{ value: "Tempo (anos)", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis label={{ value: "Montante (R$)", angle: -90, position: "insideLeft" }} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Taxa de Aplicação"
                          stroke="#16a34a"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line type="monotone" dataKey="IPCA" stroke="#ea580c" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

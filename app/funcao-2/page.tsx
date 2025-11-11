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

export default function Funcao2() {
  const [capital, setCapital] = useState("")
  const [aporte, setAporte] = useState("")
  const [tempo, setTempo] = useState("")
  const [taxaAplicacao, setTaxaAplicacao] = useState("")
  const [taxaIPCA, setTaxaIPCA] = useState("")
  const [resultado, setResultado] = useState<any>(null)

  const calcular = () => {
    const C = Number.parseFloat(capital)
    const A = Number.parseFloat(aporte)
    const t = Number.parseFloat(tempo)
    const iAplicacao = Number.parseFloat(taxaAplicacao) / 100
    const iIPCA = Number.parseFloat(taxaIPCA) / 100

    // Fórmula: M = C·(1+i)^t + Aporte·[(1+i)^t - 1]/i
    const montanteAplicacao = C * Math.pow(1 + iAplicacao, t) + (A * (Math.pow(1 + iAplicacao, t) - 1)) / iAplicacao

    const montanteIPCA = C * Math.pow(1 + iIPCA, t) + (A * (Math.pow(1 + iIPCA, t) - 1)) / iIPCA

    const diferenca = montanteAplicacao - montanteIPCA

    // Gerar dados para o gráfico (dividindo em 10 partes)
    const chartData = []
    const partes = 10
    for (let i = 0; i <= partes; i++) {
      const tempoAtual = (t * i) / partes
      const montanteAplicacaoAtual =
        C * Math.pow(1 + iAplicacao, tempoAtual) + (A * (Math.pow(1 + iAplicacao, tempoAtual) - 1)) / iAplicacao
      const montanteIPCAAtual =
        C * Math.pow(1 + iIPCA, tempoAtual) + (A * (Math.pow(1 + iIPCA, tempoAtual) - 1)) / iIPCA

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Função 2: Investimentos com Aportes Periódicos</CardTitle>
            <CardDescription>M = C·(1+i)^t + Aporte·[(1+i)^t - 1]/i</CardDescription>
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
                <Label htmlFor="aporte">Aporte Periódico (R$)</Label>
                <Input
                  id="aporte"
                  type="number"
                  placeholder="Ex: 500"
                  value={aporte}
                  onChange={(e) => setAporte(e.target.value)}
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
                    <CardTitle>Evolução do Montante com Aportes</CardTitle>
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

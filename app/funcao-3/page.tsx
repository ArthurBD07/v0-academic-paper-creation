"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/format-number"

export default function Funcao3() {
  const [salarioBruto, setSalarioBruto] = useState("")
  const [dependentes, setDependentes] = useState("")
  const [resultado, setResultado] = useState<any>(null)

  const tabelaIR = [
    { faixa: "Até R$ 2.259,20", aliquota: 0, deducao: 0, limite: 2259.2 },
    { faixa: "De R$ 2.259,21 até R$ 2.826,65", aliquota: 7.5, deducao: 169.44, limite: 2826.65 },
    { faixa: "De R$ 2.826,66 até R$ 3.751,05", aliquota: 15, deducao: 381.44, limite: 3751.05 },
    { faixa: "De R$ 3.751,06 até R$ 4.664,68", aliquota: 22.5, deducao: 662.77, limite: 4664.68 },
    { faixa: "Acima de R$ 4.664,68", aliquota: 27.5, deducao: 896.0, limite: Number.POSITIVE_INFINITY },
  ]

  const deducaoPorDependente = 189.59

  const calcular = () => {
    const salario = Number.parseFloat(salarioBruto)
    const numDependentes = Number.parseInt(dependentes) || 0

    // Base de cálculo
    const baseCalculo = salario - numDependentes * deducaoPorDependente

    // Encontrar a faixa
    let aliquota = 0
    let deducao = 0
    for (const faixa of tabelaIR) {
      if (baseCalculo <= faixa.limite) {
        aliquota = faixa.aliquota
        deducao = faixa.deducao
        break
      }
    }

    // Calcular IRRF
    const irrf = (baseCalculo * aliquota) / 100 - deducao
    const irrfFinal = Math.max(0, irrf)

    // Gerar dados para gráfico genérico (todas as faixas)
    const chartData = []
    const maxBase = 10000
    const step = maxBase / 100

    for (let base = 0; base <= maxBase; base += step) {
      let aliq = 0
      let ded = 0
      for (const faixa of tabelaIR) {
        if (base <= faixa.limite) {
          aliq = faixa.aliquota
          ded = faixa.deducao
          break
        }
      }
      const irrfCalc = Math.max(0, (base * aliq) / 100 - ded)
      const irrfSemDeducao = Math.max(0, (base * aliq) / 100)

      chartData.push({
        base: Number.parseFloat(base.toFixed(2)),
        "Com Dedução": Number.parseFloat(irrfCalc.toFixed(2)),
        "Sem Dedução": Number.parseFloat(irrfSemDeducao.toFixed(2)),
      })
    }

    setResultado({
      baseCalculo,
      irrf: irrfFinal,
      aliquota,
      deducao,
      chartData,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Função 3: Imposto de Renda Retido na Fonte</CardTitle>
            <CardDescription>Cálculo do IRRF com base na tabela progressiva de 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salarioBruto">Salário Bruto (R$)</Label>
                <Input
                  id="salarioBruto"
                  type="number"
                  placeholder="Ex: 5000"
                  value={salarioBruto}
                  onChange={(e) => setSalarioBruto(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependentes">Número de Dependentes</Label>
                <Input
                  id="dependentes"
                  type="number"
                  placeholder="Ex: 2"
                  value={dependentes}
                  onChange={(e) => setDependentes(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calcular} className="w-full">
              Calcular
            </Button>

            {resultado && (
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Base de Cálculo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(resultado.baseCalculo)}</p>
                      <p className="text-sm text-muted-foreground mt-2">Alíquota: {resultado.aliquota}%</p>
                      <p className="text-sm text-muted-foreground">Dedução: {formatCurrency(resultado.deducao)}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>IRRF a Recolher</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(resultado.irrf)}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Tabela Progressiva do IR - 2025</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Base de Cálculo</TableHead>
                          <TableHead>Alíquota</TableHead>
                          <TableHead>Dedução</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tabelaIR.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.faixa}</TableCell>
                            <TableCell>{item.aliquota}%</TableCell>
                            <TableCell>{formatCurrency(item.deducao)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="text-sm text-muted-foreground mt-4">
                      Dedução mensal por dependente: {formatCurrency(deducaoPorDependente)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evolução do IRRF - Com Dedução</CardTitle>
                    <CardDescription>Valor calculado destacado no gráfico</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={resultado.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="base"
                          label={{ value: "Base de Cálculo (R$)", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis label={{ value: "IRRF (R$)", angle: -90, position: "insideLeft" }} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="Com Dedução" stroke="#ea580c" strokeWidth={2} dot={false} />
                        <ReferenceDot
                          x={resultado.baseCalculo}
                          y={resultado.irrf}
                          r={6}
                          fill="#dc2626"
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Comparação: Com vs Sem Dedução</CardTitle>
                    <CardDescription>Impacto da parcela a deduzir no valor do IRRF</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={resultado.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="base"
                          label={{ value: "Base de Cálculo (R$)", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis label={{ value: "IRRF (R$)", angle: -90, position: "insideLeft" }} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="Com Dedução" stroke="#16a34a" strokeWidth={2} dot={false} />
                        <Line
                          type="monotone"
                          dataKey="Sem Dedução"
                          stroke="#dc2626"
                          strokeWidth={2}
                          dot={false}
                          strokeDasharray="5 5"
                        />
                        <ReferenceDot
                          x={resultado.baseCalculo}
                          y={resultado.irrf}
                          r={6}
                          fill="#ea580c"
                          stroke="#fff"
                          strokeWidth={2}
                        />
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

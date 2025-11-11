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
import { formatNumber } from "@/lib/format-number"

export default function Funcao4() {
  const [x1, setX1] = useState("")
  const [y1, setY1] = useState("")
  const [x2, setX2] = useState("")
  const [y2, setY2] = useState("")
  const [resultado, setResultado] = useState<any>(null)

  const calcular = () => {
    const px1 = Number.parseFloat(x1)
    const py1 = Number.parseFloat(y1)
    const px2 = Number.parseFloat(x2)
    const py2 = Number.parseFloat(y2)

    // Calcular coeficiente angular (a)
    const a = (py2 - py1) / (px2 - px1)

    // Calcular coeficiente linear (b)
    const b = py1 - a * px1

    // Ponto onde toca o eixo x (y = 0)
    const raizX = -b / a

    // Ponto onde toca o eixo y (x = 0)
    const raizY = b

    // Gerar dados para o gráfico
    const chartData = []
    const minX = Math.min(px1, px2, raizX, 0) - 5
    const maxX = Math.max(px1, px2, raizX, 0) + 5
    const step = (maxX - minX) / 50

    for (let x = minX; x <= maxX; x += step) {
      const y = a * x + b
      chartData.push({
        x: Number.parseFloat(x.toFixed(2)),
        y: Number.parseFloat(y.toFixed(2)),
      })
    }

    setResultado({
      a,
      b,
      raizX,
      raizY,
      chartData,
      pontos: [
        { x: px1, y: py1 },
        { x: px2, y: py2 },
      ],
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Função 4: Equação da Reta</CardTitle>
            <CardDescription>Função do primeiro grau: f(x) = ax + b</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ponto 1</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="x1">Coordenada X₁</Label>
                    <Input
                      id="x1"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 2"
                      value={x1}
                      onChange={(e) => setX1(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="y1">Coordenada Y₁</Label>
                    <Input
                      id="y1"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 4"
                      value={y1}
                      onChange={(e) => setY1(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ponto 2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="x2">Coordenada X₂</Label>
                    <Input
                      id="x2"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 5"
                      value={x2}
                      onChange={(e) => setX2(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="y2">Coordenada Y₂</Label>
                    <Input
                      id="y2"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 10"
                      value={y2}
                      onChange={(e) => setY2(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={calcular} className="w-full">
              Calcular
            </Button>

            {resultado && (
              <div className="space-y-6 mt-6">
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle>Lei da Função</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">
                      f(x) = {formatNumber(resultado.a)}x {resultado.b >= 0 ? "+" : ""} {formatNumber(resultado.b)}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Ponto no Eixo X (abscissas)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-blue-600">({formatNumber(resultado.raizX)}, 0)</p>
                      <p className="text-sm text-muted-foreground mt-1">Raiz da função</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Ponto no Eixo Y (ordenadas)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-green-600">(0, {formatNumber(resultado.raizY)})</p>
                      <p className="text-sm text-muted-foreground mt-1">Coeficiente linear</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Gráfico da Função</CardTitle>
                    <CardDescription>Pontos destacados: dados de entrada, raiz e interseção com eixo Y</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={resultado.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="x"
                          label={{ value: "x", position: "insideBottom", offset: -5 }}
                          domain={["dataMin", "dataMax"]}
                        />
                        <YAxis
                          label={{ value: "f(x)", angle: -90, position: "insideLeft" }}
                          domain={["auto", "auto"]}
                        />
                        <Tooltip formatter={(value: number) => formatNumber(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="y" stroke="#8b5cf6" strokeWidth={2} dot={false} name="f(x)" />
                        {/* Pontos de entrada */}
                        <ReferenceDot
                          x={resultado.pontos[0].x}
                          y={resultado.pontos[0].y}
                          r={6}
                          fill="#3b82f6"
                          stroke="#fff"
                          strokeWidth={2}
                          label={{ value: "P1", position: "top" }}
                        />
                        <ReferenceDot
                          x={resultado.pontos[1].x}
                          y={resultado.pontos[1].y}
                          r={6}
                          fill="#3b82f6"
                          stroke="#fff"
                          strokeWidth={2}
                          label={{ value: "P2", position: "top" }}
                        />
                        {/* Raiz (eixo X) */}
                        <ReferenceDot
                          x={resultado.raizX}
                          y={0}
                          r={6}
                          fill="#2563eb"
                          stroke="#fff"
                          strokeWidth={2}
                          label={{ value: "Raiz", position: "bottom" }}
                        />
                        {/* Interseção eixo Y */}
                        <ReferenceDot
                          x={0}
                          y={resultado.raizY}
                          r={6}
                          fill="#16a34a"
                          stroke="#fff"
                          strokeWidth={2}
                          label={{ value: "Eixo Y", position: "right" }}
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { formatNumber } from "@/lib/format-number"

// Função que pode ser alterada pelo professor
// Exemplo: f(x) = x³ - 9x + 5
const funcao = (x: number): number => {
  return Math.pow(x, 3) - 9 * x + 5
}

export default function Funcao5() {
  const [xInicial, setXInicial] = useState("")
  const [xFinal, setXFinal] = useState("")
  const [tolerancia, setTolerancia] = useState("")
  const [maxIteracoes, setMaxIteracoes] = useState("")
  const [resultado, setResultado] = useState<any>(null)

  const calcular = () => {
    let xi = Number.parseFloat(xInicial)
    let xf = Number.parseFloat(xFinal)
    const tol = Number.parseFloat(tolerancia)
    const maxIter = Number.parseInt(maxIteracoes)

    const fxi = funcao(xi)
    const fxf = funcao(xf)

    // Verificar se o intervalo é válido
    const intervaloValido = fxi * fxf < 0

    if (!intervaloValido) {
      setResultado({
        intervaloValido: false,
        mensagem: "Intervalo inválido! f(xinicial) e f(xfinal) devem ter sinais opostos.",
      })
      return
    }

    // Método da bisseção
    const iteracoes = []
    let xm = 0
    let toleranciaAtual = Number.POSITIVE_INFINITY
    let i = 0

    for (i = 1; i <= maxIter; i++) {
      const xmAnterior = xm
      xm = (xi + xf) / 2
      const fxm = funcao(xm)

      toleranciaAtual = Math.abs(xm - xmAnterior)

      iteracoes.push({
        i,
        xinicial: xi,
        xmedio: xm,
        xfinal: xf,
        fxinicial: funcao(xi),
        fxmedio: fxm,
        fxfinal: funcao(xf),
        tolerancia: i === 1 ? "-" : formatNumber(toleranciaAtual, 6),
      })

      // Verificar convergência
      if (i > 1 && toleranciaAtual < tol) {
        break
      }

      // Atualizar intervalo
      if (funcao(xi) * fxm < 0) {
        xf = xm
      } else {
        xi = xm
      }
    }

    setResultado({
      intervaloValido: true,
      iteracoes,
      raiz: xm,
      funcaoNaRaiz: funcao(xm),
      numeroIteracoes: i,
      convergiu: toleranciaAtual < tol,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Função 5: Método da Bisseção</CardTitle>
            <CardDescription>Cálculo de raiz de função - Função atual: f(x) = x³ - 9x + 5</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nota para o Professor</AlertTitle>
              <AlertDescription>
                A função pode ser alterada no código do arquivo app/funcao-5/page.tsx, na constante "funcao" no início
                do arquivo.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xInicial">X Inicial</Label>
                <Input
                  id="xInicial"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 0"
                  value={xInicial}
                  onChange={(e) => setXInicial(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="xFinal">X Final</Label>
                <Input
                  id="xFinal"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1"
                  value={xFinal}
                  onChange={(e) => setXFinal(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tolerancia">Tolerância</Label>
                <Input
                  id="tolerancia"
                  type="number"
                  step="0.0001"
                  placeholder="Ex: 0.0001"
                  value={tolerancia}
                  onChange={(e) => setTolerancia(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxIteracoes">Número Máximo de Iterações</Label>
                <Input
                  id="maxIteracoes"
                  type="number"
                  placeholder="Ex: 50"
                  value={maxIteracoes}
                  onChange={(e) => setMaxIteracoes(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calcular} className="w-full">
              Calcular
            </Button>

            {resultado && (
              <div className="space-y-6 mt-6">
                {!resultado.intervaloValido ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Intervalo Inválido</AlertTitle>
                    <AlertDescription>{resultado.mensagem}</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert className={resultado.convergiu ? "border-green-500" : "border-orange-500"}>
                      {resultado.convergiu ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                      <AlertTitle>
                        {resultado.convergiu ? "Convergência Alcançada" : "Número Máximo de Iterações Atingido"}
                      </AlertTitle>
                      <AlertDescription>
                        {resultado.convergiu
                          ? `A raiz foi encontrada em ${resultado.numeroIteracoes} iterações.`
                          : "O método não convergiu dentro do número máximo de iterações especificado."}
                      </AlertDescription>
                    </Alert>

                    <Card className="bg-primary/5">
                      <CardHeader>
                        <CardTitle>Resultado Final</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xl">
                          <span className="font-semibold">Raiz aproximada:</span>{" "}
                          <span className="text-primary font-bold">x ≈ {formatNumber(resultado.raiz, 6)}</span>
                        </p>
                        <p className="text-lg">
                          <span className="font-semibold">f(x) =</span>{" "}
                          <span className="text-muted-foreground">{formatNumber(resultado.funcaoNaRaiz, 6)}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Número de iterações: {resultado.numeroIteracoes}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Tabela de Iterações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-center">i</TableHead>
                                <TableHead className="text-center">
                                  x<sub>inicial</sub>
                                </TableHead>
                                <TableHead className="text-center">
                                  x<sub>médio</sub>
                                </TableHead>
                                <TableHead className="text-center">
                                  x<sub>final</sub>
                                </TableHead>
                                <TableHead className="text-center">
                                  f(x<sub>inicial</sub>)
                                </TableHead>
                                <TableHead className="text-center">
                                  f(x<sub>médio</sub>)
                                </TableHead>
                                <TableHead className="text-center">
                                  f(x<sub>final</sub>)
                                </TableHead>
                                <TableHead className="text-center">Tolerância</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {resultado.iteracoes.map((iter: any) => (
                                <TableRow key={iter.i}>
                                  <TableCell className="text-center font-medium">{iter.i}</TableCell>
                                  <TableCell className="text-center">{formatNumber(iter.xinicial, 4)}</TableCell>
                                  <TableCell className="text-center font-semibold">
                                    {formatNumber(iter.xmedio, 4)}
                                  </TableCell>
                                  <TableCell className="text-center">{formatNumber(iter.xfinal, 4)}</TableCell>
                                  <TableCell className="text-center">{formatNumber(iter.fxinicial, 4)}</TableCell>
                                  <TableCell className="text-center">{formatNumber(iter.fxmedio, 4)}</TableCell>
                                  <TableCell className="text-center">{formatNumber(iter.fxfinal, 4)}</TableCell>
                                  <TableCell className="text-center">{iter.tolerancia}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

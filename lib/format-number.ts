export function formatNumber(num: number, maxDecimals = 2): string {
  // Se o número é inteiro ou muito próximo de um inteiro, mostra sem decimais
  if (Math.abs(num - Math.round(num)) < 0.0001) {
    return Math.round(num).toString()
  }

  // Remove zeros desnecessários no final
  const formatted = num.toFixed(maxDecimals)
  return formatted.replace(/\.?0+$/, "")
}

export function formatCurrency(num: number): string {
  const formatted = formatNumber(num, 2)
  return `R$ ${formatted}`
}

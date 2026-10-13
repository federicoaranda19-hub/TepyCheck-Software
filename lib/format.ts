const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

export function formatPrecio(value: number | string) {
  return currency.format(Number(value))
}

const fecha = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Argentina/Buenos_Aires',
})

export function formatFecha(value: Date | string) {
  return fecha.format(new Date(value))
}

export function formatDia(value: string) {
  const [y, m, d] = value.split('-')
  return `${d}/${m}/${y}`
}

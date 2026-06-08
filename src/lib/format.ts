import dayjs from 'dayjs'
import 'dayjs/locale/tr'

dayjs.locale('tr')

export function formatCurrency(amount: number, currency = 'TRY'): string {
  const locale = currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'de-DE' : 'tr-TR'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('tr-TR').format(value)
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return dayjs(dateStr).format('DD MMM YYYY')
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return dayjs(dateStr).format('DD.MM.YYYY')
}

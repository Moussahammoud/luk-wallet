import type { ISODate, YearMonth } from './types'

export function formatCurrency(cents: number, currency: string): string {
  const value = cents / 100
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

export function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, Math.trunc(n)))
}

export function parseMoneyToCents(input: string): number | null {
  const s = input.trim()
  if (!s) return null
  const normalized = s.replace(/,/g, '')
  const n = Number(normalized)
  if (!Number.isFinite(n)) return null
  const cents = Math.round(n * 100)
  if (!Number.isFinite(cents)) return null
  return cents
}

export function todayISO(): ISODate {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}` as ISODate
}

export function isoToYearMonth(date: ISODate): YearMonth {
  return date.slice(0, 7) as YearMonth
}

export function currentYearMonth(): YearMonth {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}` as YearMonth
}

export function uid(prefix: string): string {
  const rand = Math.random().toString(16).slice(2)
  return `${prefix}_${Date.now().toString(16)}_${rand}`
}


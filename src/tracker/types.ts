export type ISODate = `${number}-${number}-${number}`
export type YearMonth = `${number}-${number}`

export type ExpenseCategory = string

export type Expense = {
  id: string
  date: ISODate
  category: ExpenseCategory
  amountCents: number
  note: string
  createdAt: number
}

export type PendingItem = {
  id: string
  person: string
  totalCents: number
  paidCents: number
  note: string
  createdAt: number
  closedAt: number | null
}

export type Budget = {
  category: ExpenseCategory
  monthlyCents: number
}

export type AppState = {
  version: 1
  currency: string
  categories: ExpenseCategory[]
  incomeByMonth: Record<YearMonth, number>
  expenses: Expense[]
  pending: PendingItem[]
  budgets: Budget[]
}

export const DEFAULT_CATEGORIES: readonly ExpenseCategory[] = [] as const


import type { AppState, Budget, Expense, ExpenseCategory, ISODate, PendingItem, YearMonth } from './types'
import { DEFAULT_CATEGORIES } from './types'
import { isoToYearMonth, uid } from './format'

const STORAGE_KEY = 'expense_tracker_v1'

export function defaultState(): AppState {
  return {
    version: 1,
    currency: 'USD',
    categories: [...DEFAULT_CATEGORIES],
    incomeByMonth: {},
    expenses: [],
    pending: [],
    budgets: [],
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function isISODate(s: unknown): s is ISODate {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
}

function normalizeCategory(raw: string): ExpenseCategory {
  return raw.trim()
}

function coerceBudgetList(raw: unknown): Budget[] {
  const out: Budget[] = []
  if (!Array.isArray(raw)) return out
  for (const b of raw) {
    if (!isRecord(b)) continue
    const category = b.category
    const monthlyCents = b.monthlyCents
    if (typeof category !== 'string') continue
    if (typeof monthlyCents !== 'number' || !Number.isFinite(monthlyCents)) continue
    const n = normalizeCategory(category)
    if (!n) continue
    out.push({ category: n, monthlyCents: Math.max(0, Math.round(monthlyCents)) })
  }
  return out
}

function coerceExpenseList(raw: unknown): Expense[] {
  const out: Expense[] = []
  if (!Array.isArray(raw)) return out
  for (const e of raw) {
    if (!isRecord(e)) continue
    const id = e.id
    const date = e.date
    const category = e.category
    const amountCents = e.amountCents
    const note = e.note
    const createdAt = e.createdAt
    if (typeof id !== 'string' || id.length < 3) continue
    if (!isISODate(date)) continue
    if (typeof category !== 'string') continue
    if (typeof amountCents !== 'number' || !Number.isFinite(amountCents)) continue
    if (typeof note !== 'string') continue
    if (typeof createdAt !== 'number' || !Number.isFinite(createdAt)) continue
    const n = normalizeCategory(category)
    if (!n) continue
    out.push({
      id,
      date,
      category: n,
      amountCents: Math.round(amountCents),
      note,
      createdAt,
    })
  }
  out.sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : b.date.localeCompare(a.date)))
  return out
}

function coercePendingList(raw: unknown): PendingItem[] {
  const out: PendingItem[] = []
  if (!Array.isArray(raw)) return out
  for (const p of raw) {
    if (!isRecord(p)) continue
    const id = p.id
    const person = p.person
    const totalCents = p.totalCents
    const paidCents = p.paidCents
    const note = p.note
    const createdAt = p.createdAt
    const closedAt = p.closedAt
    if (typeof id !== 'string' || id.length < 3) continue
    if (typeof person !== 'string') continue
    if (typeof totalCents !== 'number' || !Number.isFinite(totalCents)) continue
    if (typeof paidCents !== 'number' || !Number.isFinite(paidCents)) continue
    if (typeof note !== 'string') continue
    if (typeof createdAt !== 'number' || !Number.isFinite(createdAt)) continue
    const closedAtOk =
      closedAt === null || (typeof closedAt === 'number' && Number.isFinite(closedAt))
    if (!closedAtOk) continue

    const personN = person.trim()
    if (!personN) continue
    const totalN = Math.max(0, Math.round(totalCents))
    const paidN = Math.max(0, Math.round(paidCents))
    const closedAtN = paidN >= totalN && totalN > 0 ? (typeof closedAt === 'number' ? closedAt : Date.now()) : null

    out.push({
      id,
      person: personN,
      totalCents: totalN,
      paidCents: Math.min(paidN, totalN),
      note: note.trim(),
      createdAt,
      closedAt: closedAtN,
    })
  }
  out.sort((a, b) => (a.closedAt === b.closedAt ? b.createdAt - a.createdAt : (a.closedAt === null ? -1 : 1)))
  return out
}

function coerceCategories(raw: unknown): ExpenseCategory[] {
  if (!Array.isArray(raw)) return []
  const out: ExpenseCategory[] = []
  for (const c of raw) {
    if (typeof c !== 'string') continue
    const n = normalizeCategory(c)
    if (!n) continue
    if (n === 'General') continue
    if (!out.includes(n)) out.push(n)
  }
  return out
}

function coerceIncomeByMonth(raw: unknown): Record<YearMonth, number> {
  if (!isRecord(raw)) return {}
  const out: Record<YearMonth, number> = {}
  for (const [k, v] of Object.entries(raw)) {
    if (!/^\d{4}-\d{2}$/.test(k)) continue
    if (typeof v !== 'number' || !Number.isFinite(v)) continue
    out[k as YearMonth] = Math.max(0, Math.round(v))
  }
  return out
}

function mergeUniqueCategories(a: ExpenseCategory[], b: ExpenseCategory[]): ExpenseCategory[] {
  const out: ExpenseCategory[] = []
  const add = (s: string) => {
    const n = normalizeCategory(s)
    if (!n) return
    if (n === 'General') return
    if (!out.includes(n)) out.push(n)
  }
  for (const x of a) add(x)
  for (const x of b) add(x)
  return out
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return defaultState()
    const currency = typeof parsed.currency === 'string' && parsed.currency ? parsed.currency : 'USD'
    const expenses = coerceExpenseList(parsed.expenses)
    const budgetsRaw = coerceBudgetList(parsed.budgets)
    const categoriesRaw = coerceCategories(parsed.categories)
    const categoriesFromData = mergeUniqueCategories(
      budgetsRaw.map((b) => b.category),
      expenses.map((e) => e.category),
    )
    const categories = mergeUniqueCategories(categoriesRaw, categoriesFromData)
    const incomeByMonth = coerceIncomeByMonth(parsed.incomeByMonth)
    const pending = coercePendingList(parsed.pending)
    return { version: 1, currency, categories, incomeByMonth, expenses, pending, budgets: budgetsRaw }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function ensureCategory(state: AppState, category: ExpenseCategory): AppState {
  const n = normalizeCategory(category)
  if (!n) return state
  if (n === 'General') return state
  if (state.categories.includes(n)) return state
  return { ...state, categories: [...state.categories, n] }
}

export function upsertBudget(state: AppState, category: ExpenseCategory, monthlyCents: number): AppState {
  const n = normalizeCategory(category)
  if (!n) return state
  const rounded = Math.max(0, Math.round(monthlyCents))
  const existing = state.budgets.find((b) => b.category === n)
  const budgets = existing
    ? state.budgets.map((b) => (b.category === n ? { ...b, monthlyCents: rounded } : b))
    : [...state.budgets, { category: n, monthlyCents: rounded }]
  return ensureCategory({ ...state, budgets }, n)
}

export function getMonthIncome(state: AppState, ym: YearMonth): number {
  return state.incomeByMonth[ym] ?? 0
}

export function setMonthIncome(state: AppState, ym: YearMonth, incomeCents: number): AppState {
  const rounded = Math.max(0, Math.round(incomeCents))
  return { ...state, incomeByMonth: { ...state.incomeByMonth, [ym]: rounded } }
}

export function addExpense(
  state: AppState,
  input: { date: ISODate; category: ExpenseCategory; amountCents: number; note: string },
): AppState {
  const normalizedCategory = normalizeCategory(input.category)
  if (!normalizedCategory) return state
  const expense: Expense = {
    id: uid('exp'),
    date: input.date,
    category: normalizedCategory,
    amountCents: Math.round(input.amountCents),
    note: input.note.trim(),
    createdAt: Date.now(),
  }
  const next = ensureCategory({ ...state, expenses: [expense, ...state.expenses] }, normalizedCategory)
  next.expenses.sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : b.date.localeCompare(a.date)))
  return next
}

export function updateExpense(
  state: AppState,
  id: string,
  patch: Partial<Pick<Expense, 'date' | 'category' | 'amountCents' | 'note'>>,
): AppState {
  let next = state
  if (typeof patch.category === 'string') {
    const n = normalizeCategory(patch.category)
    if (n) next = ensureCategory(next, n)
  }
  const nextExpenses = state.expenses.map((e) => {
    if (e.id !== id) return e
    return {
      ...e,
      ...(patch.date ? { date: patch.date } : {}),
      ...(typeof patch.category === 'string' && normalizeCategory(patch.category)
        ? { category: normalizeCategory(patch.category) }
        : {}),
      ...(typeof patch.amountCents === 'number' ? { amountCents: Math.round(patch.amountCents) } : {}),
      ...(typeof patch.note === 'string' ? { note: patch.note.trim() } : {}),
    }
  })
  nextExpenses.sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : b.date.localeCompare(a.date)))
  return { ...next, expenses: nextExpenses }
}

export function deleteExpense(state: AppState, id: string): AppState {
  return { ...state, expenses: state.expenses.filter((e) => e.id !== id) }
}

export function addPending(
  state: AppState,
  input: { person: string; totalCents: number; paidCents?: number; note?: string },
): AppState {
  const person = input.person.trim()
  if (!person) return state
  const totalCents = Math.max(0, Math.round(input.totalCents))
  const paidCents = Math.max(0, Math.round(input.paidCents ?? 0))
  if (totalCents <= 0) return state
  const paid = Math.min(paidCents, totalCents)
  const closedAt = paid >= totalCents ? Date.now() : null
  const item: PendingItem = {
    id: uid('pend'),
    person,
    totalCents,
    paidCents: paid,
    note: (input.note ?? '').trim(),
    createdAt: Date.now(),
    closedAt,
  }
  return { ...state, pending: [item, ...state.pending] }
}

export function recordPendingPayment(state: AppState, id: string, paymentCents: number): AppState {
  const add = Math.max(0, Math.round(paymentCents))
  if (add <= 0) return state
  const pending = state.pending.map((p) => {
    if (p.id !== id) return p
    const paidNext = Math.min(p.totalCents, p.paidCents + add)
    return { ...p, paidCents: paidNext, closedAt: paidNext >= p.totalCents ? p.closedAt ?? Date.now() : null }
  })
  return { ...state, pending }
}

export function reopenPending(state: AppState, id: string): AppState {
  return { ...state, pending: state.pending.map((p) => (p.id === id ? { ...p, closedAt: null } : p)) }
}

export function deletePending(state: AppState, id: string): AppState {
  return { ...state, pending: state.pending.filter((p) => p.id !== id) }
}

export function updatePending(
  state: AppState,
  id: string,
  patch: Partial<Pick<PendingItem, 'person' | 'totalCents' | 'paidCents' | 'note'>>,
): AppState {
  const pending = state.pending.map((p) => {
    if (p.id !== id) return p
    const person = typeof patch.person === 'string' ? patch.person.trim() : p.person
    const totalCents = typeof patch.totalCents === 'number' ? Math.max(0, Math.round(patch.totalCents)) : p.totalCents
    const paidCentsRaw = typeof patch.paidCents === 'number' ? Math.max(0, Math.round(patch.paidCents)) : p.paidCents
    const paidCents = Math.min(paidCentsRaw, totalCents)
    const note = typeof patch.note === 'string' ? patch.note.trim() : p.note
    const closedAt = totalCents > 0 && paidCents >= totalCents ? p.closedAt ?? Date.now() : null
    return { ...p, person: person || p.person, totalCents, paidCents, note, closedAt }
  })
  return { ...state, pending }
}

export function monthExpenses(state: AppState, ym: YearMonth): Expense[] {
  return state.expenses.filter((e) => isoToYearMonth(e.date) === ym)
}

export function totalsByCategory(expenses: Expense[]): Map<ExpenseCategory, number> {
  const map = new Map<ExpenseCategory, number>()
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amountCents)
  }
  return map
}

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amountCents, 0)
}


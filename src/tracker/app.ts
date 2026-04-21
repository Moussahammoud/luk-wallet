import { currentYearMonth, formatCurrency, parseMoneyToCents, todayISO } from './format'
import type { AppState, Expense, ExpenseCategory, ISODate, PendingItem, YearMonth } from './types'
import {
  addExpense,
  addPending,
  deleteExpense,
  deletePending,
  getMonthIncome,
  loadState,
  monthExpenses,
  recordPendingPayment,
  resetState,
  saveState,
  setMonthIncome,
  totalSpent,
  updateExpense,
  updatePending,
} from './store'

type AuthUser = {
  username: string
  password: string
}

type AuthState = {
  users: AuthUser[]
  currentUser: string | null
}

type ViewState = {
  ym: YearMonth
  query: string
  category: ExpenseCategory | 'All'
  editingId: string | null
  isExpenseModalOpen: boolean
  isPendingModalOpen: boolean
  pendingEditId: string | null
  isPayModalOpen: boolean
  pendingPayId: string | null
}

const AUTH_KEY = 'expense_auth_v1'

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return { users: [], currentUser: null }
    const parsed = JSON.parse(raw) as Partial<AuthState>
    const users = Array.isArray(parsed.users)
      ? parsed.users.filter(
          (u): u is AuthUser =>
            typeof u === 'object' &&
            u !== null &&
            typeof (u as AuthUser).username === 'string' &&
            typeof (u as AuthUser).password === 'string' &&
            (u as AuthUser).username.trim().length > 0,
        )
      : []
    const currentUser =
      typeof parsed.currentUser === 'string' && parsed.currentUser.trim()
        ? parsed.currentUser
        : null
    return { users, currentUser }
  } catch {
    return { users: [], currentUser: null }
  }
}

function saveAuth(auth: AuthState): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
}

function normalizeCategory(raw: string): string {
  return raw.trim()
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return c
    }
  })
}

function findExpense(state: AppState, id: string): Expense | undefined {
  return state.expenses.find((e) => e.id === id)
}

function findPending(state: AppState, id: string): PendingItem | undefined {
  return state.pending.find((p) => p.id === id)
}

function download(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.readAsText(file)
  })
}

function toast(root: HTMLElement, message: string): void {
  const el = root.querySelector<HTMLElement>('[data-toast]')
  if (!el) return
  el.textContent = message
  el.dataset.show = 'true'
  window.setTimeout(() => {
    el.dataset.show = 'false'
  }, 2400)
}

function appShell(): string {
  return `
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <div class="brand__logo" aria-hidden="true">₹</div>
        <div class="brand__text">
          <div class="brand__title">LUK Wallet</div>
          <div class="brand__sub">Income • Expenses • Balance</div>
        </div>
      </div>

      <div class="topbar__controls">
        <label class="field field--inline">
          <span class="field__label">Month</span>
          <input data-month type="month" class="input input--sm" />
        </label>

        <button class="btn btn--primary" data-open-expense>Add expense</button>

        <div class="menu">
          <button class="btn btn--ghost" data-menu aria-label="More options">
            <span class="btn__text">More</span>
            <span class="btn__icon" aria-hidden="true">⋯</span>
          </button>
          <div class="menu__panel" data-menu-panel hidden>
            <button class="menu__item" data-export>Export data</button>
            <button class="menu__item" data-open-pending>Add pending (owed)</button>
            <button class="menu__item" data-logout>Logout</button>
            <label class="menu__item menu__file">
              Import data
              <input data-import type="file" accept="application/json" hidden />
            </label>
            <button class="menu__item menu__danger" data-reset>Reset app</button>
          </div>
        </div>
      </div>
    </header>

    <main class="content" data-content></main>

    <div class="toast" data-toast data-show="false" role="status" aria-live="polite"></div>

    <datalist id="categoryList" data-category-list></datalist>

    <div class="modal" data-expense-modal aria-hidden="true">
      <div class="modal__backdrop" data-close-expense></div>
      <div class="modal__card" role="dialog" aria-modal="true" aria-label="Add expense">
        <div class="modal__header">
          <div class="modal__title" data-expense-modal-title>Add expense</div>
          <button class="btn btn--ghost" data-close-expense>Close</button>
        </div>
        <form class="form" data-expense-form>
          <div class="grid">
            <label class="field">
              <span class="field__label">Amount</span>
              <input class="input" inputmode="decimal" placeholder="e.g. 120.50" name="amount" required />
            </label>
            <label class="field">
              <span class="field__label">Date</span>
              <input class="input" type="date" name="date" required />
            </label>
            <label class="field">
              <span class="field__label">Category</span>
              <input class="input" name="category" list="categoryList" placeholder="Type category (e.g. Rent, Petrol)" required />
            </label>
            <div class="muted" style="grid-column: 1 / -1; font-size: 12px;">
              Tip: you can type any category. It will be saved and suggested next time.
            </div>
            <label class="field field--full">
              <span class="field__label">Note (optional)</span>
              <input class="input" name="note" placeholder="e.g. Groceries" />
            </label>
          </div>
          <div class="form__actions">
            <button class="btn btn--primary" type="submit">Save</button>
            <button class="btn" type="button" data-close-expense>Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal" data-pending-modal aria-hidden="true">
      <div class="modal__backdrop" data-close-pending></div>
      <div class="modal__card" role="dialog" aria-modal="true" aria-label="Pending (owed) entry">
        <div class="modal__header">
          <div class="modal__title" data-pending-modal-title>Add pending (owed to you)</div>
          <button class="btn btn--ghost" data-close-pending>Close</button>
        </div>
        <form class="form" data-pending-form>
          <div class="grid">
            <label class="field">
              <span class="field__label">Person</span>
              <input class="input" name="person" placeholder="e.g. John" required />
            </label>
            <label class="field">
              <span class="field__label">Total owed</span>
              <input class="input" inputmode="decimal" name="total" placeholder="e.g. 200" required />
            </label>
            <label class="field">
              <span class="field__label">Paid now (optional)</span>
              <input class="input" inputmode="decimal" name="paid" placeholder="0" />
            </label>
            <label class="field field--full">
              <span class="field__label">Note (optional)</span>
              <input class="input" name="note" placeholder="e.g. Loan / rent / goods" />
            </label>
          </div>
          <div class="form__actions">
            <button class="btn btn--primary" type="submit">Save</button>
            <button class="btn" type="button" data-close-pending>Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal" data-pay-modal aria-hidden="true">
      <div class="modal__backdrop" data-close-pay></div>
      <div class="modal__card" role="dialog" aria-modal="true" aria-label="Record payment">
        <div class="modal__header">
          <div class="modal__title">Record payment</div>
          <button class="btn btn--ghost" data-close-pay>Close</button>
        </div>
        <form class="form" data-pay-form>
          <div class="grid">
            <label class="field field--full">
              <span class="field__label">Amount received</span>
              <input class="input" inputmode="decimal" name="amount" placeholder="e.g. 50" required />
            </label>
          </div>
          <div class="form__actions">
            <button class="btn btn--primary" type="submit">Save</button>
            <button class="btn" type="button" data-close-pay>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `
}

function authShell(): string {
  return `
  <div class="auth">
    <div class="auth__card">
      <div class="brand">
        <div class="brand__logo" aria-hidden="true">₹</div>
        <div class="brand__text">
          <div class="brand__title">LUK Wallet</div>
          <div class="brand__sub">Login to continue</div>
        </div>
      </div>
      <form class="form" data-auth-form>
        <div class="grid">
          <label class="field field--full">
            <span class="field__label">Username</span>
            <input class="input" name="username" required />
          </label>
          <label class="field field--full">
            <span class="field__label">Password</span>
            <input class="input" type="password" name="password" required />
          </label>
        </div>
        <div class="form__actions auth__actions">
          <button class="btn btn--primary" type="submit" data-auth-action="login">Login</button>
          <button class="btn" type="submit" data-auth-action="register">Create account</button>
        </div>
      </form>
      <div class="muted auth__hint">Tip: first create an account, then login.</div>
    </div>
  </div>
  `
}

function render(root: HTMLElement, state: AppState, view: ViewState): void {
  const datalist = root.querySelector<HTMLDataListElement>('[data-category-list]')
  if (datalist) {
    datalist.innerHTML = state.categories.map((c) => `<option value="${escapeHtml(c)}"></option>`).join('')
  }

  const monthList = monthExpenses(state, view.ym)
  const q = view.query.trim().toLowerCase()
  const filtered = monthList.filter((e) => {
    const catOk = view.category === 'All' ? true : e.category === view.category
    const qOk = q ? e.note.toLowerCase().includes(q) : true
    return catOk && qOk
  })

  const income = getMonthIncome(state, view.ym)
  const spent = totalSpent(monthList)
  const balance = income - spent

  const openPending = state.pending.filter((p) => p.closedAt === null)
  const pendingTotal = openPending.reduce((sum, p) => sum + (p.totalCents - p.paidCents), 0)

  const cardsHtml =
    filtered.length === 0
      ? ''
      : `<div class="historyCards">
          ${filtered
            .map((e) => {
              const note = e.note || ''
              return `<article class="hCard">
                <div class="hCard__top">
                  <div class="hCard__left">
                    <div class="hCard__note">${escapeHtml(note || '—')}</div>
                    <div class="hCard__meta muted">
                      <span class="mono">${e.date}</span>
                      <span class="dot">•</span>
                      <span>${escapeHtml(e.category)}</span>
                    </div>
                  </div>
                  <div class="hCard__amt mono">${formatCurrency(e.amountCents, state.currency)}</div>
                </div>
                <div class="hCard__actions">
                  <button class="btn btn--xs btn--accent" data-edit="${e.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${e.id}">Delete</button>
                </div>
              </article>`
            })
            .join('')}
        </div>`

  const tableHtml =
    filtered.length === 0
      ? `<div class="empty">No expenses for this filter.</div>`
      : `<div class="tableHint muted" aria-hidden="true">Swipe → to see more</div>
      <div class="tableWrap" aria-label="Expense history table (scrollable)">
        <div class="table">
          <div class="table__head">
            <div>Date</div>
            <div>Category</div>
            <div class="right">Amount</div>
            <div>Note</div>
            <div class="right">Actions</div>
          </div>
          ${filtered
            .map((e) => {
              const note = e.note || '—'
              return `<div class="table__row">
                <div class="mono">${e.date}</div>
                <div>${escapeHtml(e.category)}</div>
                <div class="right mono">${formatCurrency(e.amountCents, state.currency)}</div>
                <div class="noteCell" title="${escapeHtml(note)}">
                  <div class="noteCell__note">${escapeHtml(note)}</div>
                </div>
                <div class="right actions">
                  <button class="btn btn--xs btn--accent" data-edit="${e.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${e.id}">Delete</button>
                </div>
              </div>`
            })
            .join('')}
        </div>
      </div>`

  const content = root.querySelector<HTMLElement>('[data-content]')
  if (!content) return
  content.innerHTML = `
    <section class="grid2">
      <div class="card">
        <div class="card__k">Income (${view.ym})</div>
        <div class="card__v" data-income-display>${formatCurrency(income, state.currency)}</div>
        <div class="card__s muted">
          <label class="field field--inline">
            <span class="field__label">Set income</span>
            <input class="input input--sm" inputmode="decimal" data-income placeholder="0.00" value="${(income / 100).toFixed(2)}" />
          </label>
        </div>
      </div>
      <div class="card">
        <div class="card__k">Spent</div>
        <div class="card__v" data-spent-display>${formatCurrency(spent, state.currency)}</div>
        <div class="card__s muted">All expenses in the selected month</div>
      </div>
      <div class="card card--span">
        <div class="card__k">Balance (Income − Spent)</div>
        <div class="card__v ${balance < 0 ? 'is-neg' : ''}" data-balance-display>${formatCurrency(balance, state.currency)}</div>
        <div class="card__s muted">${balance < 0 ? 'You spent more than your income' : 'What you have left after expenses'}</div>
      </div>
    </section>

    <section class="panel">
      <div class="panel__head">
        <div>
          <div class="panel__title">Pending (owed to you)</div>
          <div class="panel__sub muted">${openPending.length} open • ${formatCurrency(pendingTotal, state.currency)} remaining</div>
        </div>
        <button class="btn btn--primary" data-open-pending>Add pending</button>
      </div>
      ${
        openPending.length === 0
          ? `<div class="empty">No pending items. Add one when someone owes you money.</div>`
          : `<div class="pendingList">
              ${openPending
                .map((p) => {
                  const remaining = Math.max(0, p.totalCents - p.paidCents)
                  const noteInline = p.note ? `<span class="pending__noteInline muted">• ${escapeHtml(p.note)}</span>` : ''
                  return `<article class="pending">
                    <div class="pending__row">
                      <div>
                        <div class="pending__headLine">
                          <span class="pending__person">${escapeHtml(p.person)}</span>
                          ${noteInline}
                        </div>
                        <div class="pendingStats">
                          <div class="pStat">
                            <div class="pStat__k">Total</div>
                            <div class="pStat__v mono">${formatCurrency(p.totalCents, state.currency)}</div>
                          </div>
                          <div class="pStat">
                            <div class="pStat__k">Paid</div>
                            <div class="pStat__v mono">${formatCurrency(p.paidCents, state.currency)}</div>
                          </div>
                          <div class="pStat pStat--remain">
                            <div class="pStat__k">Remaining</div>
                            <div class="pStat__v mono">${formatCurrency(remaining, state.currency)}</div>
                          </div>
                        </div>
                      </div>
                      <div class="pending__actions">
                        <button class="btn btn--xs" data-pend-pay="${p.id}">Add payment</button>
                        <button class="btn btn--xs btn--accent" data-pend-edit="${p.id}">Edit</button>
                        <button class="btn btn--xs btn--danger" data-pend-del="${p.id}">Delete</button>
                      </div>
                    </div>
                  </article>`
                })
                .join('')}
            </div>`
      }
    </section>

    <section class="panel">
      <div class="historyHead">
        <div class="historyHead__meta">
          <div class="panel__title">History</div>
          <div class="panel__sub muted">${filtered.length} shown • ${monthList.length} total in month</div>
        </div>
        <div class="historyHead__filters">
          <label class="field">
            <span class="field__label">Category</span>
            <select class="input input--sm" data-filter-category>
              <option value="All">All</option>
              ${state.categories
                .map((c) => `<option value="${escapeHtml(c)}" ${view.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`)
                .join('')}
            </select>
          </label>
          <label class="field">
            <span class="field__label">Search note</span>
            <input class="input input--sm" data-filter-q value="${escapeHtml(view.query)}" placeholder="e.g. rent" />
          </label>
        </div>
      </div>
      ${cardsHtml}
      ${tableHtml}
    </section>
  `
}

function setExpenseModal(root: HTMLElement, open: boolean): void {
  const modal = root.querySelector<HTMLElement>('[data-expense-modal]')
  if (!modal) return
  modal.dataset.open = open ? 'true' : 'false'
  modal.setAttribute('aria-hidden', open ? 'false' : 'true')
}

function fillExpenseForm(root: HTMLElement, state: AppState, view: ViewState): void {
  const form = root.querySelector<HTMLFormElement>('[data-expense-form]')
  const title = root.querySelector<HTMLElement>('[data-expense-modal-title]')
  if (!form || !title) return
  const isEdit = Boolean(view.editingId)
  title.textContent = isEdit ? 'Edit expense' : 'Add expense'

  const amount = form.elements.namedItem('amount') as HTMLInputElement | null
  const date = form.elements.namedItem('date') as HTMLInputElement | null
  const category = form.elements.namedItem('category') as HTMLInputElement | null
  const note = form.elements.namedItem('note') as HTMLInputElement | null
  if (!amount || !date || !category || !note) return

  if (isEdit) {
    const e = findExpense(state, view.editingId!)
    if (!e) {
      view.editingId = null
      amount.value = ''
      date.value = todayISO()
      category.value = state.categories[0] ?? ''
      note.value = ''
      return
    }
    amount.value = (e.amountCents / 100).toFixed(2)
    date.value = e.date
    category.value = e.category
    note.value = e.note
  } else {
    amount.value = ''
    date.value = todayISO()
    category.value = state.expenses[0]?.category ?? state.categories[0] ?? ''
    note.value = ''
  }
}

function setPendingModal(root: HTMLElement, open: boolean): void {
  const modal = root.querySelector<HTMLElement>('[data-pending-modal]')
  if (!modal) return
  modal.dataset.open = open ? 'true' : 'false'
  modal.setAttribute('aria-hidden', open ? 'false' : 'true')
}

function setPayModal(root: HTMLElement, open: boolean): void {
  const modal = root.querySelector<HTMLElement>('[data-pay-modal]')
  if (!modal) return
  modal.dataset.open = open ? 'true' : 'false'
  modal.setAttribute('aria-hidden', open ? 'false' : 'true')
}

function fillPayForm(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>('[data-pay-form]')
  if (!form) return
  const amountEl = form.elements.namedItem('amount') as HTMLInputElement | null
  if (!amountEl) return
  amountEl.value = ''
}

function fillPendingForm(root: HTMLElement, state: AppState, id: string | null): void {
  const form = root.querySelector<HTMLFormElement>('[data-pending-form]')
  const title = root.querySelector<HTMLElement>('[data-pending-modal-title]')
  if (!form || !title) return

  const personEl = form.elements.namedItem('person') as HTMLInputElement | null
  const totalEl = form.elements.namedItem('total') as HTMLInputElement | null
  const paidEl = form.elements.namedItem('paid') as HTMLInputElement | null
  const noteEl = form.elements.namedItem('note') as HTMLInputElement | null
  if (!personEl || !totalEl || !paidEl || !noteEl) return

  if (!id) {
    title.textContent = 'Add pending (owed to you)'
    personEl.value = ''
    totalEl.value = ''
    paidEl.value = ''
    noteEl.value = ''
    return
  }

  const p = findPending(state, id)
  if (!p) {
    title.textContent = 'Add pending (owed to you)'
    personEl.value = ''
    totalEl.value = ''
    paidEl.value = ''
    noteEl.value = ''
    return
  }

  title.textContent = 'Edit pending'
  personEl.value = p.person
  totalEl.value = (p.totalCents / 100).toFixed(2)
  paidEl.value = (p.paidCents / 100).toFixed(2)
  noteEl.value = p.note
}

export function mountApp(root: HTMLElement): void {
  let auth = loadAuth()
  if (!auth.currentUser) {
    root.innerHTML = authShell()
    const form = root.querySelector<HTMLFormElement>('[data-auth-form]')
    form?.addEventListener('submit', (e) => {
      e.preventDefault()
      const submitter = e.submitter as HTMLButtonElement | null
      const action = submitter?.dataset.authAction
      const usernameEl = form.elements.namedItem('username') as HTMLInputElement | null
      const passwordEl = form.elements.namedItem('password') as HTMLInputElement | null
      if (!usernameEl || !passwordEl || !action) return

      const username = usernameEl.value.trim()
      const password = passwordEl.value.trim()
      if (!username || !password) {
        alert('Enter username and password')
        return
      }

      auth = loadAuth()
      const existing = auth.users.find((u) => u.username.toLowerCase() === username.toLowerCase())
      if (action === 'register') {
        if (existing) {
          alert('Username already exists')
          return
        }
        auth.users.push({ username, password })
        auth.currentUser = username
        saveAuth(auth)
        mountApp(root)
        return
      }

      if (!existing || existing.password !== password) {
        alert('Invalid username or password')
        return
      }
      auth.currentUser = existing.username
      saveAuth(auth)
      mountApp(root)
    })
    return
  }

  root.innerHTML = appShell()

  let state = loadState()
  let view: ViewState = {
    ym: currentYearMonth(),
    query: '',
    category: 'All',
    editingId: null,
    isExpenseModalOpen: false,
    isPendingModalOpen: false,
    pendingEditId: null,
    isPayModalOpen: false,
    pendingPayId: null,
  }

  const monthInput = root.querySelector<HTMLInputElement>('[data-month]')
  if (monthInput) monthInput.value = view.ym

  const rerender = () => render(root, state, view)
  rerender()

  let incomeSaveTimer: number | null = null
  let searchRerenderTimer: number | null = null
  const updateIncomeDisplay = (incomeCents: number) => {
    const spentNow = totalSpent(monthExpenses(state, view.ym))
    const balanceNow = incomeCents - spentNow

    const incomeEl = root.querySelector<HTMLElement>('[data-income-display]')
    const spentEl = root.querySelector<HTMLElement>('[data-spent-display]')
    const balanceEl = root.querySelector<HTMLElement>('[data-balance-display]')

    if (incomeEl) incomeEl.textContent = formatCurrency(incomeCents, state.currency)
    if (spentEl) spentEl.textContent = formatCurrency(spentNow, state.currency)
    if (balanceEl) {
      balanceEl.textContent = formatCurrency(balanceNow, state.currency)
      balanceEl.classList.toggle('is-neg', balanceNow < 0)
    }
  }

  const scheduleSearchRerender = () => {
    if (searchRerenderTimer !== null) window.clearTimeout(searchRerenderTimer)
    const active = document.activeElement
    const isSearchFocused =
      active instanceof HTMLInputElement && active.matches('[data-filter-q]')
    const cursor =
      isSearchFocused && active.selectionStart !== null ? active.selectionStart : null

    searchRerenderTimer = window.setTimeout(() => {
      rerender()
      searchRerenderTimer = null

      if (isSearchFocused) {
        const qEl = root.querySelector<HTMLInputElement>('[data-filter-q]')
        if (qEl) {
          qEl.focus()
          const pos = cursor ?? qEl.value.length
          qEl.setSelectionRange(pos, pos)
        }
      }
    }, 120)
  }

  const menuBtn = root.querySelector<HTMLButtonElement>('[data-menu]')
  const menuPanel = root.querySelector<HTMLElement>('[data-menu-panel]')
  const closeMenu = () => {
    if (menuPanel) menuPanel.hidden = true
  }
  menuBtn?.addEventListener('click', () => {
    if (!menuPanel) return
    menuPanel.hidden = !menuPanel.hidden
  })
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement | null
    if (!t) return
    if (t.closest('[data-menu]') || t.closest('[data-menu-panel]')) return
    closeMenu()
  })

  monthInput?.addEventListener('change', () => {
    const v = monthInput.value as YearMonth
    if (/^\d{4}-\d{2}$/.test(v)) {
      view.ym = v
      rerender()
    }
  })

  root.addEventListener('click', async (e) => {
    const t = e.target as HTMLElement | null
    if (!t) return

    const openExpense = t.closest('[data-open-expense]')
    if (openExpense) {
      view.editingId = null
      view.isExpenseModalOpen = true
      setExpenseModal(root, true)
      fillExpenseForm(root, state, view)
      closeMenu()
      return
    }

    const closeExpense = t.closest('[data-close-expense]')
    if (closeExpense) {
      view.editingId = null
      view.isExpenseModalOpen = false
      setExpenseModal(root, false)
      closeMenu()
      return
    }

    const editBtn = t.closest<HTMLButtonElement>('[data-edit]')
    if (editBtn?.dataset.edit) {
      view.editingId = editBtn.dataset.edit
      view.isExpenseModalOpen = true
      setExpenseModal(root, true)
      fillExpenseForm(root, state, view)
      closeMenu()
      return
    }

    const delBtn = t.closest<HTMLButtonElement>('[data-del]')
    if (delBtn?.dataset.del) {
      const id = delBtn.dataset.del
      const ok = confirm('Delete this expense?')
      if (!ok) return
      state = deleteExpense(state, id)
      saveState(state)
      rerender()
      toast(root, 'Expense deleted')
      closeMenu()
      return
    }

    const exportBtn = t.closest('[data-export]')
    if (exportBtn) {
      download(`expense-tracker-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state, null, 2))
      closeMenu()
      toast(root, 'Exported')
      return
    }

    const logoutBtn = t.closest('[data-logout]')
    if (logoutBtn) {
      const nextAuth = loadAuth()
      nextAuth.currentUser = null
      saveAuth(nextAuth)
      mountApp(root)
      return
    }

    const openPendingBtn = t.closest('[data-open-pending]')
    if (openPendingBtn) {
      view.isPendingModalOpen = true
      view.pendingEditId = null
      setPendingModal(root, true)
      fillPendingForm(root, state, null)
      closeMenu()
      return
    }

    const closePendingBtn = t.closest('[data-close-pending]')
    if (closePendingBtn) {
      view.isPendingModalOpen = false
      view.pendingEditId = null
      setPendingModal(root, false)
      closeMenu()
      return
    }

    const closePayBtn = t.closest('[data-close-pay]')
    if (closePayBtn) {
      view.isPayModalOpen = false
      view.pendingPayId = null
      setPayModal(root, false)
      closeMenu()
      return
    }

    const editPendBtn = t.closest<HTMLElement>('[data-pend-edit]')
    if (editPendBtn && editPendBtn.getAttribute('data-pend-edit')) {
      const id = editPendBtn.getAttribute('data-pend-edit')!
      view.isPendingModalOpen = true
      view.pendingEditId = id
      setPendingModal(root, true)
      fillPendingForm(root, state, id)
      closeMenu()
      return
    }

    const payBtn = t.closest<HTMLElement>('[data-pend-pay]')
    if (payBtn && (payBtn as HTMLElement).getAttribute('data-pend-pay')) {
      const id = (payBtn as HTMLElement).getAttribute('data-pend-pay')!
      view.isPayModalOpen = true
      view.pendingPayId = id
      setPayModal(root, true)
      fillPayForm(root)
      return
    }

    const delPendBtn = t.closest<HTMLElement>('[data-pend-del]')
    if (delPendBtn && (delPendBtn as HTMLElement).getAttribute('data-pend-del')) {
      const id = (delPendBtn as HTMLElement).getAttribute('data-pend-del')!
      const ok = confirm('Delete this pending item?')
      if (!ok) return
      state = deletePending(state, id)
      saveState(state)
      rerender()
      toast(root, 'Pending deleted')
      return
    }

    const resetBtn = t.closest('[data-reset]')
    if (resetBtn) {
      const ok = confirm('This will erase all expenses and budgets. Continue?')
      if (!ok) return
      resetState()
      state = loadState()
      view = { ...view, query: '', category: 'All', editingId: null }
      if (monthInput) monthInput.value = view.ym
      setExpenseModal(root, false)
      setPendingModal(root, false)
      setPayModal(root, false)
      rerender()
      closeMenu()
      toast(root, 'Reset complete')
      return
    }

    const importInput = t.closest('[data-import]') as HTMLInputElement | null
    if (importInput) {
      closeMenu()
      return
    }
  })

  root.addEventListener('input', (e) => {
    const t = e.target as HTMLElement | null
    if (!t) return

    const incomeInput = (t as HTMLInputElement).closest<HTMLInputElement>('[data-income]')
    if (incomeInput) {
      const raw = incomeInput.value.trim()
      const cents = raw === '' ? 0 : parseMoneyToCents(raw)
      if (cents === null) return

      updateIncomeDisplay(cents)

      if (incomeSaveTimer !== null) window.clearTimeout(incomeSaveTimer)
      incomeSaveTimer = window.setTimeout(() => {
        state = setMonthIncome(state, view.ym, cents)
        saveState(state)
        incomeSaveTimer = null
      }, 450)
      return
    }

    const q = (t as HTMLInputElement).closest<HTMLInputElement>('[data-filter-q]')
    if (q) {
      view.query = q.value
      scheduleSearchRerender()
      return
    }

    const cat = (t as HTMLSelectElement).closest<HTMLSelectElement>('[data-filter-category]')
    if (cat) {
      const v = cat.value
      view.category = (v === 'All' ? 'All' : (v as ExpenseCategory)) as ViewState['category']
      rerender()
      return
    }
  })

  root.addEventListener(
    'blur',
    (e) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const incomeInput = (t as HTMLInputElement).closest<HTMLInputElement>('[data-income]')
      if (!incomeInput) return

      const raw = incomeInput.value.trim()
      const cents = raw === '' ? 0 : parseMoneyToCents(raw)
      if (cents === null) return

      if (incomeSaveTimer !== null) window.clearTimeout(incomeSaveTimer)
      state = setMonthIncome(state, view.ym, cents)
      saveState(state)
      updateIncomeDisplay(cents)
    },
    true,
  )

  const importEl = root.querySelector<HTMLInputElement>('[data-import]')
  importEl?.addEventListener('change', async () => {
    const file = importEl.files?.[0]
    if (!file) return
    try {
      const text = await readFileAsText(file)
      const parsed: unknown = JSON.parse(text)
      localStorage.setItem('expense_tracker_v1', JSON.stringify(parsed))
      state = loadState()
      rerender()
      toast(root, 'Imported')
    } catch {
      toast(root, 'Import failed (invalid JSON)')
    } finally {
      importEl.value = ''
    }
  })

  const expenseForm = root.querySelector<HTMLFormElement>('[data-expense-form]')
  expenseForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!expenseForm) return

    const amountEl = expenseForm.elements.namedItem('amount') as HTMLInputElement | null
    const dateEl = expenseForm.elements.namedItem('date') as HTMLInputElement | null
    const categoryEl = expenseForm.elements.namedItem('category') as HTMLInputElement | null
    const noteEl = expenseForm.elements.namedItem('note') as HTMLInputElement | null
    if (!amountEl || !dateEl || !categoryEl || !noteEl) return

    const amountRaw = amountEl.value.trim()
    if (!amountRaw) {
      toast(root, 'Amount is required')
      return
    }
    const cents = parseMoneyToCents(amountRaw)
    const date = dateEl.value as ISODate
    const category = normalizeCategory(categoryEl.value) as ExpenseCategory
    const note = noteEl.value

    if (cents === null || cents <= 0) {
      toast(root, 'Enter an amount like 50 or 50.00')
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      toast(root, 'Pick a valid date')
      return
    }

    if (view.editingId) {
      state = updateExpense(state, view.editingId, { amountCents: cents, date, category, note })
      toast(root, 'Expense updated')
    } else {
      state = addExpense(state, { amountCents: cents, date, category, note })
      toast(root, 'Expense added')
    }

    saveState(state)
    view.editingId = null
    view.isExpenseModalOpen = false
    setExpenseModal(root, false)
    rerender()
  })

  const pendingForm = root.querySelector<HTMLFormElement>('[data-pending-form]')
  pendingForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!pendingForm) return

    const personEl = pendingForm.elements.namedItem('person') as HTMLInputElement | null
    const totalEl = pendingForm.elements.namedItem('total') as HTMLInputElement | null
    const paidEl = pendingForm.elements.namedItem('paid') as HTMLInputElement | null
    const noteEl = pendingForm.elements.namedItem('note') as HTMLInputElement | null
    if (!personEl || !totalEl || !paidEl || !noteEl) return

    const person = personEl.value.trim()
    const totalCents = parseMoneyToCents(totalEl.value)
    const paidRaw = paidEl.value.trim()
    const paidCents = paidRaw === '' ? 0 : parseMoneyToCents(paidRaw)
    const note = noteEl.value

    if (!person) {
      toast(root, 'Enter a person')
      return
    }
    if (totalCents === null || totalCents <= 0) {
      toast(root, 'Enter a valid total')
      return
    }
    if (paidCents === null || paidCents < 0) {
      toast(root, 'Enter a valid paid amount')
      return
    }

    if (view.pendingEditId) {
      state = updatePending(state, view.pendingEditId, { person, totalCents, paidCents, note })
    } else {
      state = addPending(state, { person, totalCents, paidCents, note })
    }
    saveState(state)
    view.isPendingModalOpen = false
    view.pendingEditId = null
    setPendingModal(root, false)
    pendingForm.reset()
    rerender()
    toast(root, 'Saved')
  })

  const payForm = root.querySelector<HTMLFormElement>('[data-pay-form]')
  payForm?.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!payForm) return
    const amountEl = payForm.elements.namedItem('amount') as HTMLInputElement | null
    if (!amountEl) return
    const raw = amountEl.value.trim()
    if (!raw) {
      toast(root, 'Amount is required')
      return
    }
    const cents = parseMoneyToCents(raw)
    if (cents === null || cents <= 0) {
      toast(root, 'Enter an amount like 50 or 50.00')
      return
    }
    if (!view.pendingPayId) return
    state = recordPendingPayment(state, view.pendingPayId, cents)
    saveState(state)
    view.isPayModalOpen = false
    view.pendingPayId = null
    setPayModal(root, false)
    payForm.reset()
    rerender()
    toast(root, 'Payment recorded')
  })
}


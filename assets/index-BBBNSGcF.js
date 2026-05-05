(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){let n=e/100;try{return new Intl.NumberFormat(void 0,{style:`currency`,currency:t,maximumFractionDigits:2}).format(n)}catch{return`${t} ${n.toFixed(2)}`}}function t(e){let t=e.trim();if(!t)return null;let n=t.replace(/,/g,``),r=Number(n);if(!Number.isFinite(r))return null;let i=Math.round(r*100);return Number.isFinite(i)?i:null}function n(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function r(e){return e.slice(0,7)}function i(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}`}function a(e){let t=Math.random().toString(16).slice(2);return`${e}_${Date.now().toString(16)}_${t}`}var o=[],s=`expense_tracker_v1`;function c(){return{version:1,currency:`USD`,categories:[...o],incomeByMonth:{},incomes:[],expenses:[],pending:[],budgets:[]}}function l(e){return typeof e==`object`&&!!e}function u(e){return typeof e==`string`&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function d(e){return e.trim()}function f(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.category,r=n.monthlyCents;if(typeof e!=`string`||typeof r!=`number`||!Number.isFinite(r))continue;let i=d(e);i&&t.push({category:i,monthlyCents:Math.max(0,Math.round(r))})}return t}function p(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.date,i=n.category,a=n.amountCents,o=n.note,s=n.createdAt;if(typeof e!=`string`||e.length<3||!u(r)||typeof i!=`string`||typeof a!=`number`||!Number.isFinite(a)||typeof o!=`string`||typeof s!=`number`||!Number.isFinite(s))continue;let c=d(i);c&&t.push({id:e,date:r,category:c,amountCents:Math.round(a),note:o,createdAt:s})}return t.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),t}function m(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.date,i=n.amountCents,a=n.note,o=n.createdAt;typeof e!=`string`||e.length<3||u(r)&&(typeof i!=`number`||!Number.isFinite(i)||typeof a==`string`&&(typeof o!=`number`||!Number.isFinite(o)||t.push({id:e,date:r,amountCents:Math.max(0,Math.round(i)),note:a.trim(),createdAt:o})))}return t.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),t}function h(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.person,i=n.totalCents,a=n.paidCents,o=n.note,s=n.createdAt,c=n.closedAt;if(typeof e!=`string`||e.length<3||typeof r!=`string`||typeof i!=`number`||!Number.isFinite(i)||typeof a!=`number`||!Number.isFinite(a)||typeof o!=`string`||typeof s!=`number`||!Number.isFinite(s)||!(c===null||typeof c==`number`&&Number.isFinite(c)))continue;let u=r.trim();if(!u)continue;let d=Math.max(0,Math.round(i)),f=Math.max(0,Math.round(a)),p=f>=d&&d>0?typeof c==`number`?c:Date.now():null;t.push({id:e,person:u,totalCents:d,paidCents:Math.min(f,d),note:o.trim(),createdAt:s,closedAt:p})}return t.sort((e,t)=>e.closedAt===t.closedAt?t.createdAt-e.createdAt:e.closedAt===null?-1:1),t}function g(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(typeof n!=`string`)continue;let e=d(n);e&&e!==`General`&&(t.includes(e)||t.push(e))}return t}function _(e){if(!l(e))return{};let t={};for(let[n,r]of Object.entries(e))/^\d{4}-\d{2}$/.test(n)&&(typeof r!=`number`||!Number.isFinite(r)||(t[n]=Math.max(0,Math.round(r))));return t}function v(e,t){let n=[],r=e=>{let t=d(e);t&&t!==`General`&&(n.includes(t)||n.push(t))};for(let t of e)r(t);for(let e of t)r(e);return n}function y(){try{let e=localStorage.getItem(s);if(!e)return c();let t=JSON.parse(e);if(!l(t))return c();let n=typeof t.currency==`string`&&t.currency?t.currency:`USD`,r=p(t.expenses),i=m(t.incomes),a=f(t.budgets);return{version:1,currency:n,categories:v(g(t.categories),v(a.map(e=>e.category),r.map(e=>e.category))),incomeByMonth:_(t.incomeByMonth),incomes:i,expenses:r,pending:h(t.pending),budgets:a}}catch{return c()}}function b(e){localStorage.setItem(s,JSON.stringify(e))}function x(){localStorage.removeItem(s)}function S(e,t){let n=d(t);return!n||n===`General`||e.categories.includes(n)?e:{...e,categories:[...e.categories,n]}}function C(e,t){let n=d(t.category);if(!n)return e;let r={id:a(`exp`),date:t.date,category:n,amountCents:Math.round(t.amountCents),note:t.note.trim(),createdAt:Date.now()},i=S({...e,expenses:[r,...e.expenses]},n);return i.expenses.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),i}function w(e,t){let n=Math.max(0,Math.round(t.amountCents));if(n<=0)return e;let r=[{id:a(`inc`),date:t.date,amountCents:n,note:t.note.trim(),createdAt:Date.now()},...e.incomes];return r.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),{...e,incomes:r}}function T(e,t,n){let r=e.incomes.map(e=>e.id===t?{...e,...n.date?{date:n.date}:{},...typeof n.amountCents==`number`?{amountCents:Math.max(0,Math.round(n.amountCents))}:{},...typeof n.note==`string`?{note:n.note.trim()}:{}}:e).filter(e=>e.amountCents>0);return r.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),{...e,incomes:r}}function E(e,t){return{...e,incomes:e.incomes.filter(e=>e.id!==t)}}function D(e,t,n){let r=e;if(typeof n.category==`string`){let e=d(n.category);e&&(r=S(r,e))}let i=e.expenses.map(e=>e.id===t?{...e,...n.date?{date:n.date}:{},...typeof n.category==`string`&&d(n.category)?{category:d(n.category)}:{},...typeof n.amountCents==`number`?{amountCents:Math.round(n.amountCents)}:{},...typeof n.note==`string`?{note:n.note.trim()}:{}}:e);return i.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),{...r,expenses:i}}function O(e,t){return{...e,expenses:e.expenses.filter(e=>e.id!==t)}}function k(e,t){let n=t.person.trim();if(!n)return e;let r=Math.max(0,Math.round(t.totalCents)),i=Math.max(0,Math.round(t.paidCents??0));if(r<=0)return e;let o=Math.min(i,r),s=o>=r?Date.now():null,c={id:a(`pend`),person:n,totalCents:r,paidCents:o,note:(t.note??``).trim(),createdAt:Date.now(),closedAt:s};return{...e,pending:[c,...e.pending]}}function A(e,t,n){let r=Math.max(0,Math.round(n));if(r<=0)return e;let i=e.pending.map(e=>{if(e.id!==t)return e;let n=Math.min(e.totalCents,e.paidCents+r);return{...e,paidCents:n,closedAt:n>=e.totalCents?e.closedAt??Date.now():null}});return{...e,pending:i}}function ee(e,t){return{...e,pending:e.pending.filter(e=>e.id!==t)}}function te(e,t,n){let r=e.pending.map(e=>{if(e.id!==t)return e;let r=typeof n.person==`string`?n.person.trim():e.person,i=typeof n.totalCents==`number`?Math.max(0,Math.round(n.totalCents)):e.totalCents,a=typeof n.paidCents==`number`?Math.max(0,Math.round(n.paidCents)):e.paidCents,o=Math.min(a,i),s=typeof n.note==`string`?n.note.trim():e.note,c=i>0&&o>=i?e.closedAt??Date.now():null;return{...e,person:r||e.person,totalCents:i,paidCents:o,note:s,closedAt:c}});return{...e,pending:r}}function ne(e,t){return e.expenses.filter(e=>r(e.date)===t)}function re(e,t){return e.incomes.filter(e=>r(e.date)===t)}function ie(e){return e.reduce((e,t)=>e+t.amountCents,0)}function ae(e){return e.reduce((e,t)=>e+t.amountCents,0)}var j=`expense_auth_v1`;function M(){try{let e=localStorage.getItem(j);if(!e)return{users:[],currentUser:null};let t=JSON.parse(e);return{users:Array.isArray(t.users)?t.users.filter(e=>typeof e==`object`&&!!e&&typeof e.username==`string`&&typeof e.password==`string`&&e.username.trim().length>0):[],currentUser:typeof t.currentUser==`string`&&t.currentUser.trim()?t.currentUser:null}}catch{return{users:[],currentUser:null}}}function N(e){localStorage.setItem(j,JSON.stringify(e))}function P(e){return e.trim()}function F(e){return e.replace(/[&<>"']/g,e=>{switch(e){case`&`:return`&amp;`;case`<`:return`&lt;`;case`>`:return`&gt;`;case`"`:return`&quot;`;case`'`:return`&#39;`;default:return e}})}function I(e,t){return e.expenses.find(e=>e.id===t)}function L(e,t){return e.pending.find(e=>e.id===t)}function R(e,t){return e.incomes.find(e=>e.id===t)}function z(e,t){let n=new Blob([t],{type:`application/json;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}function B(e){return new Promise((t,n)=>{let r=new FileReader;r.onerror=()=>n(Error(`Failed to read file`)),r.onload=()=>t(String(r.result??``)),r.readAsText(e)})}function V(e,t){let n=e.querySelector(`[data-toast]`);n&&(n.textContent=t,n.dataset.show=`true`,window.setTimeout(()=>{n.dataset.show=`false`},2400))}function H(){return`
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
        <button class="btn" data-open-income>Add IN</button>

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

    <div class="modal" data-income-modal aria-hidden="true">
      <div class="modal__backdrop" data-close-income></div>
      <div class="modal__card" role="dialog" aria-modal="true" aria-label="Add money in">
        <div class="modal__header">
          <div class="modal__title" data-income-modal-title>Add IN (money received)</div>
          <button class="btn btn--ghost" data-close-income>Close</button>
        </div>
        <form class="form" data-income-form>
          <div class="grid">
            <label class="field">
              <span class="field__label">Amount</span>
              <input class="input" inputmode="decimal" placeholder="e.g. 100.00" name="amount" required />
            </label>
            <label class="field">
              <span class="field__label">Date</span>
              <input class="input" type="date" name="date" required />
            </label>
            <label class="field field--full">
              <span class="field__label">Note (optional)</span>
              <input class="input" name="note" placeholder="e.g. Friend paid me back" />
            </label>
          </div>
          <div class="form__actions">
            <button class="btn btn--primary" type="submit">Save</button>
            <button class="btn" type="button" data-close-income>Cancel</button>
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
  `}function U(){return`
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
  `}function W(t,n,r){let i=t.querySelector(`[data-category-list]`);i&&(i.innerHTML=n.categories.map(e=>`<option value="${F(e)}"></option>`).join(``));let a=ne(n,r.ym),o=re(n,r.ym),s=r.query.trim().toLowerCase(),c=a.filter(e=>{let t=r.category===`All`?!0:e.category===r.category,n=s?e.note.toLowerCase().includes(s):!0;return t&&n}),l=ae(o),u=ie(a),d=l-u,f=n.pending.filter(e=>e.closedAt===null),p=f.reduce((e,t)=>e+(t.totalCents-t.paidCents),0),m=c.length===0?``:`<div class="historyCards">
          ${c.map(t=>`<article class="hCard">
                <div class="hCard__top">
                  <div class="hCard__left">
                    <div class="hCard__note">${F(t.note||`—`)}</div>
                    <div class="hCard__meta muted">
                      <span class="mono">${t.date}</span>
                      <span class="dot">•</span>
                      <span>${F(t.category)}</span>
                    </div>
                  </div>
                  <div class="hCard__amt mono">${e(t.amountCents,n.currency)}</div>
                </div>
                <div class="hCard__actions">
                  <button class="btn btn--xs btn--accent" data-edit="${t.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${t.id}">Delete</button>
                </div>
              </article>`).join(``)}
        </div>`,h=c.length===0?`<div class="empty">No expenses for this filter.</div>`:`<div class="tableHint muted" aria-hidden="true">Swipe → to see more</div>
      <div class="tableWrap" aria-label="Expense history table (scrollable)">
        <div class="table">
          <div class="table__head">
            <div>Date</div>
            <div>Category</div>
            <div class="right">Amount</div>
            <div>Note</div>
            <div class="right">Actions</div>
          </div>
          ${c.map(t=>{let r=t.note||`—`;return`<div class="table__row">
                <div class="mono">${t.date}</div>
                <div>${F(t.category)}</div>
                <div class="right mono">${e(t.amountCents,n.currency)}</div>
                <div class="noteCell" title="${F(r)}">
                  <div class="noteCell__note">${F(r)}</div>
                </div>
                <div class="right actions">
                  <button class="btn btn--xs btn--accent" data-edit="${t.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${t.id}">Delete</button>
                </div>
              </div>`}).join(``)}
        </div>
      </div>`,g=t.querySelector(`[data-content]`);g&&(g.innerHTML=`
    <section class="grid2">
      <div class="card card--span">
        <div class="card__k">Total (IN − OUT)</div>
        <div class="card__v ${d<0?`is-neg`:``}" data-balance-display>${e(d,n.currency)}</div>
        <div class="card__s muted">${d<0?`You spent more than you received`:`What is left after expenses`}</div>
      </div>
      <div class="card">
        <div class="card__k">IN</div>
        <div class="card__v">${e(l,n.currency)}</div>
        <div class="card__s muted">All money received in the selected month</div>
      </div>
      <div class="card">
        <div class="card__k">OUT</div>
        <div class="card__v" data-spent-display>${e(u,n.currency)}</div>
        <div class="card__s muted">All money spent in the selected month</div>
      </div>
    </section>

    <section class="panel">
      <div class="panel__head">
        <div>
          <div class="panel__title">Money received</div>
          <div class="panel__sub muted">${o.length} entries this month</div>
        </div>
        <button class="btn btn--primary" data-open-income>Add IN</button>
      </div>
      ${o.length===0?`<div class="empty">No IN entries yet. Add one when someone gives you money.</div>`:`<div class="tableWrap" aria-label="IN history table (scrollable)">
              <div class="table">
                <div class="table__head">
                  <div>Date</div>
                  <div>Type</div>
                  <div class="right">Amount</div>
                  <div>Note</div>
                  <div class="right">Status</div>
                </div>
                ${o.map(t=>{let r=t.note||`—`;return`<div class="table__row">
                      <div class="mono">${t.date}</div>
                      <div>IN</div>
                      <div class="right mono">${e(t.amountCents,n.currency)}</div>
                      <div class="noteCell" title="${F(r)}">
                        <div class="noteCell__note">${F(r)}</div>
                      </div>
                      <div class="right actions">
                        <button class="btn btn--xs btn--accent" data-in-edit="${t.id}">Edit</button>
                        <button class="btn btn--xs btn--danger" data-in-del="${t.id}">Delete</button>
                      </div>
                    </div>`}).join(``)}
              </div>
            </div>`}
    </section>

    <section class="panel">
      <div class="historyHead">
        <div class="historyHead__meta">
          <div class="panel__title">Expenses</div>
          <div class="panel__sub muted">${c.length} shown • ${a.length} total in month</div>
        </div>
        <div class="historyHead__filters">
          <label class="field">
            <span class="field__label">Category</span>
            <select class="input input--sm" data-filter-category>
              <option value="All">All</option>
              ${n.categories.map(e=>`<option value="${F(e)}" ${r.category===e?`selected`:``}>${F(e)}</option>`).join(``)}
            </select>
          </label>
          <label class="field">
            <span class="field__label">Search note</span>
            <input class="input input--sm" data-filter-q value="${F(r.query)}" placeholder="e.g. rent" />
          </label>
        </div>
      </div>
      ${m}
      ${h}
    </section>

    <section class="panel">
      <div class="panel__head">
        <div>
          <div class="panel__title">Pending (owed to you)</div>
          <div class="panel__sub muted">${f.length} open • ${e(p,n.currency)} remaining</div>
        </div>
        <button class="btn btn--primary" data-open-pending>Add pending</button>
      </div>
      ${f.length===0?`<div class="empty">No pending items. Add one when someone owes you money.</div>`:`<div class="pendingList">
              ${f.map(t=>{let r=Math.max(0,t.totalCents-t.paidCents),i=t.note?`<span class="pending__noteInline muted">• ${F(t.note)}</span>`:``;return`<article class="pending">
                    <div class="pending__row">
                      <div>
                        <div class="pending__headLine">
                          <span class="pending__person">${F(t.person)}</span>
                          ${i}
                        </div>
                        <div class="pendingStats">
                          <div class="pStat">
                            <div class="pStat__k">Total</div>
                            <div class="pStat__v mono">${e(t.totalCents,n.currency)}</div>
                          </div>
                          <div class="pStat">
                            <div class="pStat__k">Paid</div>
                            <div class="pStat__v mono">${e(t.paidCents,n.currency)}</div>
                          </div>
                          <div class="pStat pStat--remain">
                            <div class="pStat__k">Remaining</div>
                            <div class="pStat__v mono">${e(r,n.currency)}</div>
                          </div>
                        </div>
                      </div>
                      <div class="pending__actions">
                        <button class="btn btn--xs" data-pend-pay="${t.id}">Add payment</button>
                        <button class="btn btn--xs btn--accent" data-pend-edit="${t.id}">Edit</button>
                        <button class="btn btn--xs btn--danger" data-pend-del="${t.id}">Delete</button>
                      </div>
                    </div>
                  </article>`}).join(``)}
            </div>`}
    </section>
  `)}function G(e,t){let n=e.querySelector(`[data-expense-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function K(e,t){let n=e.querySelector(`[data-income-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function q(e){let t=e.querySelector(`[data-income-form]`),r=e.querySelector(`[data-income-modal-title]`);if(!t||!r)return;let i=t.elements.namedItem(`amount`),a=t.elements.namedItem(`date`),o=t.elements.namedItem(`note`);!i||!a||!o||(r.textContent=`Add IN (money received)`,i.value=``,a.value=n(),o.value=``)}function oe(e,t,n){let r=e.querySelector(`[data-income-form]`),i=e.querySelector(`[data-income-modal-title]`);if(!r||!i)return;let a=r.elements.namedItem(`amount`),o=r.elements.namedItem(`date`),s=r.elements.namedItem(`note`);if(!a||!o||!s)return;if(!n){q(e);return}let c=R(t,n);if(!c){q(e);return}i.textContent=`Edit IN entry`,a.value=(c.amountCents/100).toFixed(2),o.value=c.date,s.value=c.note}function J(e,t,r){let i=e.querySelector(`[data-expense-form]`),a=e.querySelector(`[data-expense-modal-title]`);if(!i||!a)return;let o=!!r.editingId;a.textContent=o?`Edit expense`:`Add expense`;let s=i.elements.namedItem(`amount`),c=i.elements.namedItem(`date`),l=i.elements.namedItem(`category`),u=i.elements.namedItem(`note`);if(!(!s||!c||!l||!u))if(o){let e=I(t,r.editingId);if(!e){r.editingId=null,s.value=``,c.value=n(),l.value=t.categories[0]??``,u.value=``;return}s.value=(e.amountCents/100).toFixed(2),c.value=e.date,l.value=e.category,u.value=e.note}else s.value=``,c.value=n(),l.value=t.expenses[0]?.category??t.categories[0]??``,u.value=``}function Y(e,t){let n=e.querySelector(`[data-pending-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function X(e,t){let n=e.querySelector(`[data-pay-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function se(e){let t=e.querySelector(`[data-pay-form]`);if(!t)return;let n=t.elements.namedItem(`amount`);n&&(n.value=``)}function Z(e,t,n){let r=e.querySelector(`[data-pending-form]`),i=e.querySelector(`[data-pending-modal-title]`);if(!r||!i)return;let a=r.elements.namedItem(`person`),o=r.elements.namedItem(`total`),s=r.elements.namedItem(`paid`),c=r.elements.namedItem(`note`);if(!a||!o||!s||!c)return;if(!n){i.textContent=`Add pending (owed to you)`,a.value=``,o.value=``,s.value=``,c.value=``;return}let l=L(t,n);if(!l){i.textContent=`Add pending (owed to you)`,a.value=``,o.value=``,s.value=``,c.value=``;return}i.textContent=`Edit pending`,a.value=l.person,o.value=(l.totalCents/100).toFixed(2),s.value=(l.paidCents/100).toFixed(2),c.value=l.note}function Q(e){let n=M();if(!n.currentUser){e.innerHTML=U();let t=e.querySelector(`[data-auth-form]`);t?.addEventListener(`submit`,r=>{r.preventDefault();let i=r.submitter?.dataset.authAction,a=t.elements.namedItem(`username`),o=t.elements.namedItem(`password`);if(!a||!o||!i)return;let s=a.value.trim(),c=o.value.trim();if(!s||!c){alert(`Enter username and password`);return}n=M();let l=n.users.find(e=>e.username.toLowerCase()===s.toLowerCase());if(i===`register`){if(l){alert(`Username already exists`);return}n.users.push({username:s,password:c}),n.currentUser=s,N(n),Q(e);return}if(!l||l.password!==c){alert(`Invalid username or password`);return}n.currentUser=l.username,N(n),Q(e)});return}e.innerHTML=H();let r=y(),a={ym:i(),query:``,category:`All`,editingId:null,editingIncomeId:null,isExpenseModalOpen:!1,isIncomeModalOpen:!1,isPendingModalOpen:!1,pendingEditId:null,isPayModalOpen:!1,pendingPayId:null},o=e.querySelector(`[data-month]`);o&&(o.value=a.ym);let s=()=>W(e,r,a);s();let c=null,l=()=>{c!==null&&window.clearTimeout(c);let t=document.activeElement,n=t instanceof HTMLInputElement&&t.matches(`[data-filter-q]`),r=n&&t.selectionStart!==null?t.selectionStart:null;c=window.setTimeout(()=>{if(s(),c=null,n){let t=e.querySelector(`[data-filter-q]`);if(t){t.focus();let e=r??t.value.length;t.setSelectionRange(e,e)}}},120)},u=e.querySelector(`[data-menu]`),d=e.querySelector(`[data-menu-panel]`),f=()=>{d&&(d.hidden=!0)};u?.addEventListener(`click`,()=>{d&&(d.hidden=!d.hidden)}),document.addEventListener(`click`,e=>{let t=e.target;t&&(t.closest(`[data-menu]`)||t.closest(`[data-menu-panel]`)||f())}),o?.addEventListener(`change`,()=>{let e=o.value;/^\d{4}-\d{2}$/.test(e)&&(a.ym=e,s())}),e.addEventListener(`click`,async t=>{let n=t.target;if(!n)return;if(n.closest(`[data-open-expense]`)){a.editingId=null,a.isExpenseModalOpen=!0,G(e,!0),J(e,r,a),f();return}if(n.closest(`[data-open-income]`)){a.editingIncomeId=null,a.isIncomeModalOpen=!0,K(e,!0),q(e),f();return}if(n.closest(`[data-close-expense]`)){a.editingId=null,a.isExpenseModalOpen=!1,G(e,!1),f();return}if(n.closest(`[data-close-income]`)){a.editingIncomeId=null,a.isIncomeModalOpen=!1,K(e,!1),f();return}let i=n.closest(`[data-in-edit]`);if(i&&i.getAttribute(`data-in-edit`)){let t=i.getAttribute(`data-in-edit`);a.editingIncomeId=t,a.isIncomeModalOpen=!0,K(e,!0),oe(e,r,t),f();return}let c=n.closest(`[data-in-del]`);if(c&&c.getAttribute(`data-in-del`)){let t=c.getAttribute(`data-in-del`);if(!confirm(`Delete this IN entry?`))return;r=E(r,t),b(r),s(),V(e,`IN deleted`),f();return}let l=n.closest(`[data-edit]`);if(l?.dataset.edit){a.editingId=l.dataset.edit,a.isExpenseModalOpen=!0,G(e,!0),J(e,r,a),f();return}let u=n.closest(`[data-del]`);if(u?.dataset.del){let t=u.dataset.del;if(!confirm(`Delete this expense?`))return;r=O(r,t),b(r),s(),V(e,`Expense deleted`),f();return}if(n.closest(`[data-export]`)){z(`expense-tracker-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(r,null,2)),f(),V(e,`Exported`);return}if(n.closest(`[data-logout]`)){let t=M();t.currentUser=null,N(t),Q(e);return}if(n.closest(`[data-open-pending]`)){a.isPendingModalOpen=!0,a.pendingEditId=null,Y(e,!0),Z(e,r,null),f();return}if(n.closest(`[data-close-pending]`)){a.isPendingModalOpen=!1,a.pendingEditId=null,Y(e,!1),f();return}if(n.closest(`[data-close-pay]`)){a.isPayModalOpen=!1,a.pendingPayId=null,X(e,!1),f();return}let d=n.closest(`[data-pend-edit]`);if(d&&d.getAttribute(`data-pend-edit`)){let t=d.getAttribute(`data-pend-edit`);a.isPendingModalOpen=!0,a.pendingEditId=t,Y(e,!0),Z(e,r,t),f();return}let p=n.closest(`[data-pend-pay]`);if(p&&p.getAttribute(`data-pend-pay`)){let t=p.getAttribute(`data-pend-pay`);a.isPayModalOpen=!0,a.pendingPayId=t,X(e,!0),se(e);return}let m=n.closest(`[data-pend-del]`);if(m&&m.getAttribute(`data-pend-del`)){let t=m.getAttribute(`data-pend-del`);if(!confirm(`Delete this pending item?`))return;r=ee(r,t),b(r),s(),V(e,`Pending deleted`);return}if(n.closest(`[data-reset]`)){if(!confirm(`This will erase all app data (income, IN, expenses, pending, budgets). Continue?`))return;x(),r=y(),a={...a,query:``,category:`All`,editingId:null,editingIncomeId:null},o&&(o.value=a.ym),G(e,!1),K(e,!1),Y(e,!1),X(e,!1),s(),f(),V(e,`Reset complete`);return}if(n.closest(`[data-import]`)){f();return}}),e.addEventListener(`input`,e=>{let t=e.target;if(!t)return;let n=t.closest(`[data-filter-q]`);if(n){a.query=n.value,l();return}let r=t.closest(`[data-filter-category]`);if(r){let e=r.value;a.category=e===`All`?`All`:e,s();return}});let p=e.querySelector(`[data-import]`);p?.addEventListener(`change`,async()=>{let t=p.files?.[0];if(t)try{let n=await B(t),i=JSON.parse(n);localStorage.setItem(`expense_tracker_v1`,JSON.stringify(i)),r=y(),s(),V(e,`Imported`)}catch{V(e,`Import failed (invalid JSON)`)}finally{p.value=``}});let m=e.querySelector(`[data-expense-form]`);m?.addEventListener(`submit`,n=>{if(n.preventDefault(),!m)return;let i=m.elements.namedItem(`amount`),o=m.elements.namedItem(`date`),c=m.elements.namedItem(`category`),l=m.elements.namedItem(`note`);if(!i||!o||!c||!l)return;let u=i.value.trim();if(!u){V(e,`Amount is required`);return}let d=t(u),f=o.value,p=P(c.value),h=l.value;if(d===null||d<=0){V(e,`Enter an amount like 50 or 50.00`);return}if(!/^\d{4}-\d{2}-\d{2}$/.test(f)){V(e,`Pick a valid date`);return}a.editingId?(r=D(r,a.editingId,{amountCents:d,date:f,category:p,note:h}),V(e,`Expense updated`)):(r=C(r,{amountCents:d,date:f,category:p,note:h}),V(e,`Expense added`)),b(r),a.editingId=null,a.isExpenseModalOpen=!1,G(e,!1),s()});let h=e.querySelector(`[data-pending-form]`);h?.addEventListener(`submit`,n=>{if(n.preventDefault(),!h)return;let i=h.elements.namedItem(`person`),o=h.elements.namedItem(`total`),c=h.elements.namedItem(`paid`),l=h.elements.namedItem(`note`);if(!i||!o||!c||!l)return;let u=i.value.trim(),d=t(o.value),f=c.value.trim(),p=f===``?0:t(f),m=l.value;if(!u){V(e,`Enter a person`);return}if(d===null||d<=0){V(e,`Enter a valid total`);return}if(p===null||p<0){V(e,`Enter a valid paid amount`);return}r=a.pendingEditId?te(r,a.pendingEditId,{person:u,totalCents:d,paidCents:p,note:m}):k(r,{person:u,totalCents:d,paidCents:p,note:m}),b(r),a.isPendingModalOpen=!1,a.pendingEditId=null,Y(e,!1),h.reset(),s(),V(e,`Saved`)});let g=e.querySelector(`[data-pay-form]`);g?.addEventListener(`submit`,n=>{if(n.preventDefault(),!g)return;let i=g.elements.namedItem(`amount`);if(!i)return;let o=i.value.trim();if(!o){V(e,`Amount is required`);return}let c=t(o);if(c===null||c<=0){V(e,`Enter an amount like 50 or 50.00`);return}a.pendingPayId&&(r=A(r,a.pendingPayId,c),b(r),a.isPayModalOpen=!1,a.pendingPayId=null,X(e,!1),g.reset(),s(),V(e,`Payment recorded`))});let _=e.querySelector(`[data-income-form]`);_?.addEventListener(`submit`,n=>{if(n.preventDefault(),!_)return;let i=_.elements.namedItem(`amount`),o=_.elements.namedItem(`date`),c=_.elements.namedItem(`note`);if(!i||!o||!c)return;let l=i.value.trim();if(!l){V(e,`Amount is required`);return}let u=t(l),d=o.value,f=c.value;if(u===null||u<=0){V(e,`Enter an amount like 50 or 50.00`);return}if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){V(e,`Pick a valid date`);return}a.editingIncomeId?(r=T(r,a.editingIncomeId,{amountCents:u,date:d,note:f}),V(e,`IN updated`)):(r=w(r,{amountCents:u,date:d,note:f}),V(e,`IN added`)),b(r),a.editingIncomeId=null,a.isIncomeModalOpen=!1,K(e,!1),_.reset(),s()})}var $=document.querySelector(`#app`);if(!$)throw Error(`Missing #app element`);Q($);
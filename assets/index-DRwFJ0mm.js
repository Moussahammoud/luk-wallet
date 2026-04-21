(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){let n=e/100;try{return new Intl.NumberFormat(void 0,{style:`currency`,currency:t,maximumFractionDigits:2}).format(n)}catch{return`${t} ${n.toFixed(2)}`}}function t(e){let t=e.trim();if(!t)return null;let n=t.replace(/,/g,``),r=Number(n);if(!Number.isFinite(r))return null;let i=Math.round(r*100);return Number.isFinite(i)?i:null}function n(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function r(e){return e.slice(0,7)}function i(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}`}function a(e){let t=Math.random().toString(16).slice(2);return`${e}_${Date.now().toString(16)}_${t}`}var o=[],s=`expense_tracker_v1`;function c(){return{version:1,currency:`USD`,categories:[...o],incomeByMonth:{},expenses:[],pending:[],budgets:[]}}function l(e){return typeof e==`object`&&!!e}function u(e){return typeof e==`string`&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function d(e){return e.trim()}function f(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.category,r=n.monthlyCents;if(typeof e!=`string`||typeof r!=`number`||!Number.isFinite(r))continue;let i=d(e);i&&t.push({category:i,monthlyCents:Math.max(0,Math.round(r))})}return t}function p(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.date,i=n.category,a=n.amountCents,o=n.note,s=n.createdAt;if(typeof e!=`string`||e.length<3||!u(r)||typeof i!=`string`||typeof a!=`number`||!Number.isFinite(a)||typeof o!=`string`||typeof s!=`number`||!Number.isFinite(s))continue;let c=d(i);c&&t.push({id:e,date:r,category:c,amountCents:Math.round(a),note:o,createdAt:s})}return t.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),t}function m(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.person,i=n.totalCents,a=n.paidCents,o=n.note,s=n.createdAt,c=n.closedAt;if(typeof e!=`string`||e.length<3||typeof r!=`string`||typeof i!=`number`||!Number.isFinite(i)||typeof a!=`number`||!Number.isFinite(a)||typeof o!=`string`||typeof s!=`number`||!Number.isFinite(s)||!(c===null||typeof c==`number`&&Number.isFinite(c)))continue;let u=r.trim();if(!u)continue;let d=Math.max(0,Math.round(i)),f=Math.max(0,Math.round(a)),p=f>=d&&d>0?typeof c==`number`?c:Date.now():null;t.push({id:e,person:u,totalCents:d,paidCents:Math.min(f,d),note:o.trim(),createdAt:s,closedAt:p})}return t.sort((e,t)=>e.closedAt===t.closedAt?t.createdAt-e.createdAt:e.closedAt===null?-1:1),t}function h(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(typeof n!=`string`)continue;let e=d(n);e&&e!==`General`&&(t.includes(e)||t.push(e))}return t}function g(e){if(!l(e))return{};let t={};for(let[n,r]of Object.entries(e))/^\d{4}-\d{2}$/.test(n)&&(typeof r!=`number`||!Number.isFinite(r)||(t[n]=Math.max(0,Math.round(r))));return t}function _(e,t){let n=[],r=e=>{let t=d(e);t&&t!==`General`&&(n.includes(t)||n.push(t))};for(let t of e)r(t);for(let e of t)r(e);return n}function v(){try{let e=localStorage.getItem(s);if(!e)return c();let t=JSON.parse(e);if(!l(t))return c();let n=typeof t.currency==`string`&&t.currency?t.currency:`USD`,r=p(t.expenses),i=f(t.budgets);return{version:1,currency:n,categories:_(h(t.categories),_(i.map(e=>e.category),r.map(e=>e.category))),incomeByMonth:g(t.incomeByMonth),expenses:r,pending:m(t.pending),budgets:i}}catch{return c()}}function y(e){localStorage.setItem(s,JSON.stringify(e))}function b(){localStorage.removeItem(s)}function x(e,t){let n=d(t);return!n||n===`General`||e.categories.includes(n)?e:{...e,categories:[...e.categories,n]}}function S(e,t){return e.incomeByMonth[t]??0}function C(e,t,n){let r=Math.max(0,Math.round(n));return{...e,incomeByMonth:{...e.incomeByMonth,[t]:r}}}function w(e,t){let n=d(t.category);if(!n)return e;let r={id:a(`exp`),date:t.date,category:n,amountCents:Math.round(t.amountCents),note:t.note.trim(),createdAt:Date.now()},i=x({...e,expenses:[r,...e.expenses]},n);return i.expenses.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),i}function T(e,t,n){let r=e;if(typeof n.category==`string`){let e=d(n.category);e&&(r=x(r,e))}let i=e.expenses.map(e=>e.id===t?{...e,...n.date?{date:n.date}:{},...typeof n.category==`string`&&d(n.category)?{category:d(n.category)}:{},...typeof n.amountCents==`number`?{amountCents:Math.round(n.amountCents)}:{},...typeof n.note==`string`?{note:n.note.trim()}:{}}:e);return i.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),{...r,expenses:i}}function E(e,t){return{...e,expenses:e.expenses.filter(e=>e.id!==t)}}function D(e,t){let n=t.person.trim();if(!n)return e;let r=Math.max(0,Math.round(t.totalCents)),i=Math.max(0,Math.round(t.paidCents??0));if(r<=0)return e;let o=Math.min(i,r),s=o>=r?Date.now():null,c={id:a(`pend`),person:n,totalCents:r,paidCents:o,note:(t.note??``).trim(),createdAt:Date.now(),closedAt:s};return{...e,pending:[c,...e.pending]}}function O(e,t,n){let r=Math.max(0,Math.round(n));if(r<=0)return e;let i=e.pending.map(e=>{if(e.id!==t)return e;let n=Math.min(e.totalCents,e.paidCents+r);return{...e,paidCents:n,closedAt:n>=e.totalCents?e.closedAt??Date.now():null}});return{...e,pending:i}}function k(e,t){return{...e,pending:e.pending.filter(e=>e.id!==t)}}function A(e,t,n){let r=e.pending.map(e=>{if(e.id!==t)return e;let r=typeof n.person==`string`?n.person.trim():e.person,i=typeof n.totalCents==`number`?Math.max(0,Math.round(n.totalCents)):e.totalCents,a=typeof n.paidCents==`number`?Math.max(0,Math.round(n.paidCents)):e.paidCents,o=Math.min(a,i),s=typeof n.note==`string`?n.note.trim():e.note,c=i>0&&o>=i?e.closedAt??Date.now():null;return{...e,person:r||e.person,totalCents:i,paidCents:o,note:s,closedAt:c}});return{...e,pending:r}}function j(e,t){return e.expenses.filter(e=>r(e.date)===t)}function M(e){return e.reduce((e,t)=>e+t.amountCents,0)}var N=`expense_auth_v1`;function P(){try{let e=localStorage.getItem(N);if(!e)return{users:[],currentUser:null};let t=JSON.parse(e);return{users:Array.isArray(t.users)?t.users.filter(e=>typeof e==`object`&&!!e&&typeof e.username==`string`&&typeof e.password==`string`&&e.username.trim().length>0):[],currentUser:typeof t.currentUser==`string`&&t.currentUser.trim()?t.currentUser:null}}catch{return{users:[],currentUser:null}}}function F(e){localStorage.setItem(N,JSON.stringify(e))}function I(e){return e.trim()}function L(e){return e.replace(/[&<>"']/g,e=>{switch(e){case`&`:return`&amp;`;case`<`:return`&lt;`;case`>`:return`&gt;`;case`"`:return`&quot;`;case`'`:return`&#39;`;default:return e}})}function R(e,t){return e.expenses.find(e=>e.id===t)}function z(e,t){return e.pending.find(e=>e.id===t)}function B(e,t){let n=new Blob([t],{type:`application/json;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}function V(e){return new Promise((t,n)=>{let r=new FileReader;r.onerror=()=>n(Error(`Failed to read file`)),r.onload=()=>t(String(r.result??``)),r.readAsText(e)})}function H(e,t){let n=e.querySelector(`[data-toast]`);n&&(n.textContent=t,n.dataset.show=`true`,window.setTimeout(()=>{n.dataset.show=`false`},2400))}function U(){return`
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
  `}function W(){return`
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
  `}function G(t,n,r){let i=t.querySelector(`[data-category-list]`);i&&(i.innerHTML=n.categories.map(e=>`<option value="${L(e)}"></option>`).join(``));let a=j(n,r.ym),o=r.query.trim().toLowerCase(),s=a.filter(e=>{let t=r.category===`All`?!0:e.category===r.category,n=o?e.note.toLowerCase().includes(o):!0;return t&&n}),c=S(n,r.ym),l=M(a),u=c-l,d=n.pending.filter(e=>e.closedAt===null),f=d.reduce((e,t)=>e+(t.totalCents-t.paidCents),0),p=s.length===0?``:`<div class="historyCards">
          ${s.map(t=>`<article class="hCard">
                <div class="hCard__top">
                  <div class="hCard__left">
                    <div class="hCard__note">${L(t.note||`—`)}</div>
                    <div class="hCard__meta muted">
                      <span class="mono">${t.date}</span>
                      <span class="dot">•</span>
                      <span>${L(t.category)}</span>
                    </div>
                  </div>
                  <div class="hCard__amt mono">${e(t.amountCents,n.currency)}</div>
                </div>
                <div class="hCard__actions">
                  <button class="btn btn--xs btn--accent" data-edit="${t.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${t.id}">Delete</button>
                </div>
              </article>`).join(``)}
        </div>`,m=s.length===0?`<div class="empty">No expenses for this filter.</div>`:`<div class="tableHint muted" aria-hidden="true">Swipe → to see more</div>
      <div class="tableWrap" aria-label="Expense history table (scrollable)">
        <div class="table">
          <div class="table__head">
            <div>Date</div>
            <div>Category</div>
            <div class="right">Amount</div>
            <div>Note</div>
            <div class="right">Actions</div>
          </div>
          ${s.map(t=>{let r=t.note||`—`;return`<div class="table__row">
                <div class="mono">${t.date}</div>
                <div>${L(t.category)}</div>
                <div class="right mono">${e(t.amountCents,n.currency)}</div>
                <div class="noteCell" title="${L(r)}">
                  <div class="noteCell__note">${L(r)}</div>
                </div>
                <div class="right actions">
                  <button class="btn btn--xs btn--accent" data-edit="${t.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${t.id}">Delete</button>
                </div>
              </div>`}).join(``)}
        </div>
      </div>`,h=t.querySelector(`[data-content]`);h&&(h.innerHTML=`
    <section class="grid2">
      <div class="card">
        <div class="card__k">Income (${r.ym})</div>
        <div class="card__v" data-income-display>${e(c,n.currency)}</div>
        <div class="card__s muted">
          <label class="field field--inline">
            <span class="field__label">Set income</span>
            <input class="input input--sm" inputmode="decimal" data-income placeholder="0.00" value="${(c/100).toFixed(2)}" />
          </label>
        </div>
      </div>
      <div class="card">
        <div class="card__k">Spent</div>
        <div class="card__v" data-spent-display>${e(l,n.currency)}</div>
        <div class="card__s muted">All expenses in the selected month</div>
      </div>
      <div class="card card--span">
        <div class="card__k">Balance (Income − Spent)</div>
        <div class="card__v ${u<0?`is-neg`:``}" data-balance-display>${e(u,n.currency)}</div>
        <div class="card__s muted">${u<0?`You spent more than your income`:`What you have left after expenses`}</div>
      </div>
    </section>

    <section class="panel">
      <div class="panel__head">
        <div>
          <div class="panel__title">Pending (owed to you)</div>
          <div class="panel__sub muted">${d.length} open • ${e(f,n.currency)} remaining</div>
        </div>
        <button class="btn btn--primary" data-open-pending>Add pending</button>
      </div>
      ${d.length===0?`<div class="empty">No pending items. Add one when someone owes you money.</div>`:`<div class="pendingList">
              ${d.map(t=>{let r=Math.max(0,t.totalCents-t.paidCents),i=t.note?`<span class="pending__noteInline muted">• ${L(t.note)}</span>`:``;return`<article class="pending">
                    <div class="pending__row">
                      <div>
                        <div class="pending__headLine">
                          <span class="pending__person">${L(t.person)}</span>
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

    <section class="panel">
      <div class="historyHead">
        <div class="historyHead__meta">
          <div class="panel__title">History</div>
          <div class="panel__sub muted">${s.length} shown • ${a.length} total in month</div>
        </div>
        <div class="historyHead__filters">
          <label class="field">
            <span class="field__label">Category</span>
            <select class="input input--sm" data-filter-category>
              <option value="All">All</option>
              ${n.categories.map(e=>`<option value="${L(e)}" ${r.category===e?`selected`:``}>${L(e)}</option>`).join(``)}
            </select>
          </label>
          <label class="field">
            <span class="field__label">Search note</span>
            <input class="input input--sm" data-filter-q value="${L(r.query)}" placeholder="e.g. rent" />
          </label>
        </div>
      </div>
      ${p}
      ${m}
    </section>
  `)}function K(e,t){let n=e.querySelector(`[data-expense-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function q(e,t,r){let i=e.querySelector(`[data-expense-form]`),a=e.querySelector(`[data-expense-modal-title]`);if(!i||!a)return;let o=!!r.editingId;a.textContent=o?`Edit expense`:`Add expense`;let s=i.elements.namedItem(`amount`),c=i.elements.namedItem(`date`),l=i.elements.namedItem(`category`),u=i.elements.namedItem(`note`);if(!(!s||!c||!l||!u))if(o){let e=R(t,r.editingId);if(!e){r.editingId=null,s.value=``,c.value=n(),l.value=t.categories[0]??``,u.value=``;return}s.value=(e.amountCents/100).toFixed(2),c.value=e.date,l.value=e.category,u.value=e.note}else s.value=``,c.value=n(),l.value=t.expenses[0]?.category??t.categories[0]??``,u.value=``}function J(e,t){let n=e.querySelector(`[data-pending-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function Y(e,t){let n=e.querySelector(`[data-pay-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function X(e){let t=e.querySelector(`[data-pay-form]`);if(!t)return;let n=t.elements.namedItem(`amount`);n&&(n.value=``)}function Z(e,t,n){let r=e.querySelector(`[data-pending-form]`),i=e.querySelector(`[data-pending-modal-title]`);if(!r||!i)return;let a=r.elements.namedItem(`person`),o=r.elements.namedItem(`total`),s=r.elements.namedItem(`paid`),c=r.elements.namedItem(`note`);if(!a||!o||!s||!c)return;if(!n){i.textContent=`Add pending (owed to you)`,a.value=``,o.value=``,s.value=``,c.value=``;return}let l=z(t,n);if(!l){i.textContent=`Add pending (owed to you)`,a.value=``,o.value=``,s.value=``,c.value=``;return}i.textContent=`Edit pending`,a.value=l.person,o.value=(l.totalCents/100).toFixed(2),s.value=(l.paidCents/100).toFixed(2),c.value=l.note}function Q(n){let r=P();if(!r.currentUser){n.innerHTML=W();let e=n.querySelector(`[data-auth-form]`);e?.addEventListener(`submit`,t=>{t.preventDefault();let i=t.submitter?.dataset.authAction,a=e.elements.namedItem(`username`),o=e.elements.namedItem(`password`);if(!a||!o||!i)return;let s=a.value.trim(),c=o.value.trim();if(!s||!c){alert(`Enter username and password`);return}r=P();let l=r.users.find(e=>e.username.toLowerCase()===s.toLowerCase());if(i===`register`){if(l){alert(`Username already exists`);return}r.users.push({username:s,password:c}),r.currentUser=s,F(r),Q(n);return}if(!l||l.password!==c){alert(`Invalid username or password`);return}r.currentUser=l.username,F(r),Q(n)});return}n.innerHTML=U();let a=v(),o={ym:i(),query:``,category:`All`,editingId:null,isExpenseModalOpen:!1,isPendingModalOpen:!1,pendingEditId:null,isPayModalOpen:!1,pendingPayId:null},s=n.querySelector(`[data-month]`);s&&(s.value=o.ym);let c=()=>G(n,a,o);c();let l=null,u=null,d=t=>{let r=M(j(a,o.ym)),i=t-r,s=n.querySelector(`[data-income-display]`),c=n.querySelector(`[data-spent-display]`),l=n.querySelector(`[data-balance-display]`);s&&(s.textContent=e(t,a.currency)),c&&(c.textContent=e(r,a.currency)),l&&(l.textContent=e(i,a.currency),l.classList.toggle(`is-neg`,i<0))},f=()=>{u!==null&&window.clearTimeout(u);let e=document.activeElement,t=e instanceof HTMLInputElement&&e.matches(`[data-filter-q]`),r=t&&e.selectionStart!==null?e.selectionStart:null;u=window.setTimeout(()=>{if(c(),u=null,t){let e=n.querySelector(`[data-filter-q]`);if(e){e.focus();let t=r??e.value.length;e.setSelectionRange(t,t)}}},120)},p=n.querySelector(`[data-menu]`),m=n.querySelector(`[data-menu-panel]`),h=()=>{m&&(m.hidden=!0)};p?.addEventListener(`click`,()=>{m&&(m.hidden=!m.hidden)}),document.addEventListener(`click`,e=>{let t=e.target;t&&(t.closest(`[data-menu]`)||t.closest(`[data-menu-panel]`)||h())}),s?.addEventListener(`change`,()=>{let e=s.value;/^\d{4}-\d{2}$/.test(e)&&(o.ym=e,c())}),n.addEventListener(`click`,async e=>{let t=e.target;if(!t)return;if(t.closest(`[data-open-expense]`)){o.editingId=null,o.isExpenseModalOpen=!0,K(n,!0),q(n,a,o),h();return}if(t.closest(`[data-close-expense]`)){o.editingId=null,o.isExpenseModalOpen=!1,K(n,!1),h();return}let r=t.closest(`[data-edit]`);if(r?.dataset.edit){o.editingId=r.dataset.edit,o.isExpenseModalOpen=!0,K(n,!0),q(n,a,o),h();return}let i=t.closest(`[data-del]`);if(i?.dataset.del){let e=i.dataset.del;if(!confirm(`Delete this expense?`))return;a=E(a,e),y(a),c(),H(n,`Expense deleted`),h();return}if(t.closest(`[data-export]`)){B(`expense-tracker-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(a,null,2)),h(),H(n,`Exported`);return}if(t.closest(`[data-logout]`)){let e=P();e.currentUser=null,F(e),Q(n);return}if(t.closest(`[data-open-pending]`)){o.isPendingModalOpen=!0,o.pendingEditId=null,J(n,!0),Z(n,a,null),h();return}if(t.closest(`[data-close-pending]`)){o.isPendingModalOpen=!1,o.pendingEditId=null,J(n,!1),h();return}if(t.closest(`[data-close-pay]`)){o.isPayModalOpen=!1,o.pendingPayId=null,Y(n,!1),h();return}let l=t.closest(`[data-pend-edit]`);if(l&&l.getAttribute(`data-pend-edit`)){let e=l.getAttribute(`data-pend-edit`);o.isPendingModalOpen=!0,o.pendingEditId=e,J(n,!0),Z(n,a,e),h();return}let u=t.closest(`[data-pend-pay]`);if(u&&u.getAttribute(`data-pend-pay`)){let e=u.getAttribute(`data-pend-pay`);o.isPayModalOpen=!0,o.pendingPayId=e,Y(n,!0),X(n);return}let d=t.closest(`[data-pend-del]`);if(d&&d.getAttribute(`data-pend-del`)){let e=d.getAttribute(`data-pend-del`);if(!confirm(`Delete this pending item?`))return;a=k(a,e),y(a),c(),H(n,`Pending deleted`);return}if(t.closest(`[data-reset]`)){if(!confirm(`This will erase all expenses and budgets. Continue?`))return;b(),a=v(),o={...o,query:``,category:`All`,editingId:null},s&&(s.value=o.ym),K(n,!1),J(n,!1),Y(n,!1),c(),h(),H(n,`Reset complete`);return}if(t.closest(`[data-import]`)){h();return}}),n.addEventListener(`input`,e=>{let n=e.target;if(!n)return;let r=n.closest(`[data-income]`);if(r){let e=r.value.trim(),n=e===``?0:t(e);if(n===null)return;d(n),l!==null&&window.clearTimeout(l),l=window.setTimeout(()=>{a=C(a,o.ym,n),y(a),l=null},450);return}let i=n.closest(`[data-filter-q]`);if(i){o.query=i.value,f();return}let s=n.closest(`[data-filter-category]`);if(s){let e=s.value;o.category=e===`All`?`All`:e,c();return}}),n.addEventListener(`blur`,e=>{let n=e.target;if(!n)return;let r=n.closest(`[data-income]`);if(!r)return;let i=r.value.trim(),s=i===``?0:t(i);s!==null&&(l!==null&&window.clearTimeout(l),a=C(a,o.ym,s),y(a),d(s))},!0);let g=n.querySelector(`[data-import]`);g?.addEventListener(`change`,async()=>{let e=g.files?.[0];if(e)try{let t=await V(e),r=JSON.parse(t);localStorage.setItem(`expense_tracker_v1`,JSON.stringify(r)),a=v(),c(),H(n,`Imported`)}catch{H(n,`Import failed (invalid JSON)`)}finally{g.value=``}});let _=n.querySelector(`[data-expense-form]`);_?.addEventListener(`submit`,e=>{if(e.preventDefault(),!_)return;let r=_.elements.namedItem(`amount`),i=_.elements.namedItem(`date`),s=_.elements.namedItem(`category`),l=_.elements.namedItem(`note`);if(!r||!i||!s||!l)return;let u=r.value.trim();if(!u){H(n,`Amount is required`);return}let d=t(u),f=i.value,p=I(s.value),m=l.value;if(d===null||d<=0){H(n,`Enter an amount like 50 or 50.00`);return}if(!/^\d{4}-\d{2}-\d{2}$/.test(f)){H(n,`Pick a valid date`);return}o.editingId?(a=T(a,o.editingId,{amountCents:d,date:f,category:p,note:m}),H(n,`Expense updated`)):(a=w(a,{amountCents:d,date:f,category:p,note:m}),H(n,`Expense added`)),y(a),o.editingId=null,o.isExpenseModalOpen=!1,K(n,!1),c()});let x=n.querySelector(`[data-pending-form]`);x?.addEventListener(`submit`,e=>{if(e.preventDefault(),!x)return;let r=x.elements.namedItem(`person`),i=x.elements.namedItem(`total`),s=x.elements.namedItem(`paid`),l=x.elements.namedItem(`note`);if(!r||!i||!s||!l)return;let u=r.value.trim(),d=t(i.value),f=s.value.trim(),p=f===``?0:t(f),m=l.value;if(!u){H(n,`Enter a person`);return}if(d===null||d<=0){H(n,`Enter a valid total`);return}if(p===null||p<0){H(n,`Enter a valid paid amount`);return}a=o.pendingEditId?A(a,o.pendingEditId,{person:u,totalCents:d,paidCents:p,note:m}):D(a,{person:u,totalCents:d,paidCents:p,note:m}),y(a),o.isPendingModalOpen=!1,o.pendingEditId=null,J(n,!1),x.reset(),c(),H(n,`Saved`)});let S=n.querySelector(`[data-pay-form]`);S?.addEventListener(`submit`,e=>{if(e.preventDefault(),!S)return;let r=S.elements.namedItem(`amount`);if(!r)return;let i=r.value.trim();if(!i){H(n,`Amount is required`);return}let s=t(i);if(s===null||s<=0){H(n,`Enter an amount like 50 or 50.00`);return}o.pendingPayId&&(a=O(a,o.pendingPayId,s),y(a),o.isPayModalOpen=!1,o.pendingPayId=null,Y(n,!1),S.reset(),c(),H(n,`Payment recorded`))})}var $=document.querySelector(`#app`);if(!$)throw Error(`Missing #app element`);Q($);
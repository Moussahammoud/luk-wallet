(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){let n=e/100;try{return new Intl.NumberFormat(void 0,{style:`currency`,currency:t,maximumFractionDigits:2}).format(n)}catch{return`${t} ${n.toFixed(2)}`}}function t(e){let t=e.trim();if(!t)return null;let n=t.replace(/,/g,``),r=Number(n);if(!Number.isFinite(r))return null;let i=Math.round(r*100);return Number.isFinite(i)?i:null}function n(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function r(e){return e.slice(0,7)}function i(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}`}function a(e){let t=Math.random().toString(16).slice(2);return`${e}_${Date.now().toString(16)}_${t}`}var o=[],s=`expense_tracker_v1`;function c(){return{version:1,currency:`USD`,openingBalanceCents:0,categories:[...o],incomeByMonth:{},incomes:[],expenses:[],pending:[],budgets:[]}}function l(e){return typeof e==`object`&&!!e}function u(e){return typeof e==`string`&&/^\d{4}-\d{2}-\d{2}$/.test(e)}function d(e){return e.trim()}function f(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.category,r=n.monthlyCents;if(typeof e!=`string`||typeof r!=`number`||!Number.isFinite(r))continue;let i=d(e);i&&t.push({category:i,monthlyCents:Math.max(0,Math.round(r))})}return t}function p(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.date,i=n.category,a=n.amountCents,o=n.note,s=n.createdAt;if(typeof e!=`string`||e.length<3||!u(r)||typeof i!=`string`||typeof a!=`number`||!Number.isFinite(a)||typeof o!=`string`||typeof s!=`number`||!Number.isFinite(s))continue;let c=d(i);c&&t.push({id:e,date:r,category:c,amountCents:Math.round(a),note:o,createdAt:s})}return t.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),t}function m(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.date,i=n.amountCents,a=n.note,o=n.createdAt;typeof e!=`string`||e.length<3||u(r)&&(typeof i!=`number`||!Number.isFinite(i)||typeof a==`string`&&(typeof o!=`number`||!Number.isFinite(o)||t.push({id:e,date:r,amountCents:Math.max(0,Math.round(i)),note:a.trim(),createdAt:o})))}return t.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),t}function h(e){let t=[];if(!Array.isArray(e))return t;for(let n of e){if(!l(n))continue;let e=n.id,r=n.person,i=n.totalCents,a=n.paidCents,o=n.note,s=n.createdAt,c=n.closedAt;if(typeof e!=`string`||e.length<3||typeof r!=`string`||typeof i!=`number`||!Number.isFinite(i)||typeof a!=`number`||!Number.isFinite(a)||typeof o!=`string`||typeof s!=`number`||!Number.isFinite(s)||!(c===null||typeof c==`number`&&Number.isFinite(c)))continue;let u=r.trim();if(!u)continue;let d=Math.max(0,Math.round(i)),f=Math.max(0,Math.round(a)),p=f>=d&&d>0?typeof c==`number`?c:Date.now():null;t.push({id:e,person:u,totalCents:d,paidCents:Math.min(f,d),note:o.trim(),createdAt:s,closedAt:p})}return t.sort((e,t)=>e.closedAt===t.closedAt?t.createdAt-e.createdAt:e.closedAt===null?-1:1),t}function g(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){if(typeof n!=`string`)continue;let e=d(n);e&&e!==`General`&&(t.includes(e)||t.push(e))}return t}function _(e){if(!l(e))return{};let t={};for(let[n,r]of Object.entries(e))/^\d{4}-\d{2}$/.test(n)&&(typeof r!=`number`||!Number.isFinite(r)||(t[n]=Math.max(0,Math.round(r))));return t}function v(e,t){let n=[],r=e=>{let t=d(e);t&&t!==`General`&&(n.includes(t)||n.push(t))};for(let t of e)r(t);for(let e of t)r(e);return n}function y(){try{let e=localStorage.getItem(s);if(!e)return c();let t=JSON.parse(e);if(!l(t))return c();let n=typeof t.currency==`string`&&t.currency?t.currency:`USD`,r=t.openingBalanceCents,i=typeof r==`number`&&Number.isFinite(r)?Math.round(r):0,a=p(t.expenses),o=m(t.incomes),u=f(t.budgets);return{version:1,currency:n,openingBalanceCents:i,categories:v(g(t.categories),v(u.map(e=>e.category),a.map(e=>e.category))),incomeByMonth:_(t.incomeByMonth),incomes:o,expenses:a,pending:h(t.pending),budgets:u}}catch{return c()}}function b(e){localStorage.setItem(s,JSON.stringify(e))}function ee(){localStorage.removeItem(s)}function x(e,t){let n=d(t);return!n||n===`General`||e.categories.includes(n)?e:{...e,categories:[...e.categories,n]}}function S(e,t){return{...e,openingBalanceCents:Math.round(t)}}function C(e,t){let n=d(t.category);if(!n)return e;let r={id:a(`exp`),date:t.date,category:n,amountCents:Math.round(t.amountCents),note:t.note.trim(),createdAt:Date.now()},i=x({...e,expenses:[r,...e.expenses]},n);return i.expenses.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),i}function te(e,t){let n=Math.max(0,Math.round(t.amountCents));if(n<=0)return e;let r=[{id:a(`inc`),date:t.date,amountCents:n,note:t.note.trim(),createdAt:Date.now()},...e.incomes];return r.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),{...e,incomes:r}}function ne(e,t,n){let r=e.incomes.map(e=>e.id===t?{...e,...n.date?{date:n.date}:{},...typeof n.amountCents==`number`?{amountCents:Math.max(0,Math.round(n.amountCents))}:{},...typeof n.note==`string`?{note:n.note.trim()}:{}}:e).filter(e=>e.amountCents>0);return r.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),{...e,incomes:r}}function re(e,t){return{...e,incomes:e.incomes.filter(e=>e.id!==t)}}function ie(e,t,n){let r=e;if(typeof n.category==`string`){let e=d(n.category);e&&(r=x(r,e))}let i=e.expenses.map(e=>e.id===t?{...e,...n.date?{date:n.date}:{},...typeof n.category==`string`&&d(n.category)?{category:d(n.category)}:{},...typeof n.amountCents==`number`?{amountCents:Math.round(n.amountCents)}:{},...typeof n.note==`string`?{note:n.note.trim()}:{}}:e);return i.sort((e,t)=>e.date===t.date?t.createdAt-e.createdAt:t.date.localeCompare(e.date)),{...r,expenses:i}}function ae(e,t){return{...e,expenses:e.expenses.filter(e=>e.id!==t)}}function oe(e,t){let n=t.person.trim();if(!n)return e;let r=Math.max(0,Math.round(t.totalCents)),i=Math.max(0,Math.round(t.paidCents??0));if(r<=0)return e;let o=Math.min(i,r),s=o>=r?Date.now():null,c={id:a(`pend`),person:n,totalCents:r,paidCents:o,note:(t.note??``).trim(),createdAt:Date.now(),closedAt:s};return{...e,pending:[c,...e.pending]}}function se(e,t,n){let r=Math.max(0,Math.round(n));if(r<=0)return e;let i=e.pending.map(e=>{if(e.id!==t)return e;let n=Math.min(e.totalCents,e.paidCents+r);return{...e,paidCents:n,closedAt:n>=e.totalCents?e.closedAt??Date.now():null}});return{...e,pending:i}}function ce(e,t){return{...e,pending:e.pending.filter(e=>e.id!==t)}}function w(e,t,n){let r=e.pending.map(e=>{if(e.id!==t)return e;let r=typeof n.person==`string`?n.person.trim():e.person,i=typeof n.totalCents==`number`?Math.max(0,Math.round(n.totalCents)):e.totalCents,a=typeof n.paidCents==`number`?Math.max(0,Math.round(n.paidCents)):e.paidCents,o=Math.min(a,i),s=typeof n.note==`string`?n.note.trim():e.note,c=i>0&&o>=i?e.closedAt??Date.now():null;return{...e,person:r||e.person,totalCents:i,paidCents:o,note:s,closedAt:c}});return{...e,pending:r}}function T(e,t){return e.expenses.filter(e=>r(e.date)===t)}function E(e,t){return e.incomes.filter(e=>r(e.date)===t)}function D(e){return e.reduce((e,t)=>e+t.amountCents,0)}function O(e){return e.reduce((e,t)=>e+t.amountCents,0)}var k=`expense_auth_v1`,A=`expense_saved_creds_v1`;function j(){try{let e=localStorage.getItem(k);if(!e)return{users:[],currentUser:null,biometricByUser:{}};let t=JSON.parse(e),n=Array.isArray(t.users)?t.users.filter(e=>typeof e==`object`&&!!e&&typeof e.username==`string`&&typeof e.password==`string`&&e.username.trim().length>0):[],r=typeof t.currentUser==`string`&&t.currentUser.trim()?t.currentUser:null,i={};if(t.biometricByUser&&typeof t.biometricByUser==`object`)for(let[e,n]of Object.entries(t.biometricByUser))typeof e==`string`&&typeof n==`string`&&e.trim()&&n.trim()&&(i[e.trim().toLowerCase()]=n.trim());return{users:n,currentUser:r,biometricByUser:i}}catch{return{users:[],currentUser:null,biometricByUser:{}}}}function M(e){localStorage.setItem(k,JSON.stringify(e))}function N(){try{let e=localStorage.getItem(A);if(!e)return null;let t=JSON.parse(e);if(typeof t.username!=`string`||typeof t.password!=`string`)return null;let n=t.username.trim(),r=t.password;return!n||!r?null:{username:n,password:r}}catch{return null}}function P(e,t){localStorage.setItem(A,JSON.stringify({username:e.trim(),password:t}))}function F(){localStorage.removeItem(A)}function le(e){let t=``;for(let n of e)t+=String.fromCharCode(n);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/g,``)}function ue(e){let t=e.length%4==0?``:`=`.repeat(4-e.length%4),n=e.replace(/-/g,`+`).replace(/_/g,`/`)+t,r=atob(n),i=new Uint8Array(r.length);for(let e=0;e<r.length;e+=1)i[e]=r.charCodeAt(e);return i}function I(e){let t=new Uint8Array(e);return crypto.getRandomValues(t),t}function L(e){return e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}function R(){return window.PublicKeyCredential!==void 0&&!!navigator.credentials}function z(e){return e.trim().toLowerCase()}async function B(e){if(!R())return null;let t=await navigator.credentials.create({publicKey:{challenge:L(I(32)),rp:{name:`Loukman Wallet`,id:window.location.hostname},user:{id:L(I(32)),name:e,displayName:e},pubKeyCredParams:[{type:`public-key`,alg:-7},{type:`public-key`,alg:-257}],authenticatorSelection:{authenticatorAttachment:`platform`,residentKey:`preferred`,userVerification:`required`},timeout:6e4,attestation:`none`}});return t?le(new Uint8Array(t.rawId)):null}async function V(e){if(!R())return!1;try{return!!await navigator.credentials.get({publicKey:{challenge:L(I(32)),allowCredentials:[{type:`public-key`,id:L(ue(e))}],userVerification:`required`,timeout:6e4}})}catch{return!1}}function H(e){return e.trim()}function U(e){return e.replace(/[&<>"']/g,e=>{switch(e){case`&`:return`&amp;`;case`<`:return`&lt;`;case`>`:return`&gt;`;case`"`:return`&quot;`;case`'`:return`&#39;`;default:return e}})}function de(e,t){return e.expenses.find(e=>e.id===t)}function fe(e,t){return e.pending.find(e=>e.id===t)}function pe(e,t){return e.incomes.find(e=>e.id===t)}function me(e,t){let n=new Blob([t],{type:`application/json;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(r)}function he(e){return new Promise((t,n)=>{let r=new FileReader;r.onerror=()=>n(Error(`Failed to read file`)),r.onload=()=>t(String(r.result??``)),r.readAsText(e)})}function W(e,t){let n=e.querySelector(`[data-toast]`);n&&(n.textContent=t,n.dataset.show=`true`,window.setTimeout(()=>{n.dataset.show=`false`},2400))}function ge(){return`
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <div class="brand__logo" aria-hidden="true">₹</div>
        <div class="brand__text">
          <div class="brand__title">Loukman Wallet</div>
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
            <button class="menu__item" data-faceid-toggle>Enable Face ID unlock</button>
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
  `}function _e(){return`
  <div class="auth">
    <div class="auth__card">
      <div class="brand">
        <div class="brand__logo" aria-hidden="true">₹</div>
        <div class="brand__text">
          <div class="brand__title">Loukman Wallet</div>
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
          <label class="field field--full">
            <span class="field__label" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" name="savePassword" />
              <span>Save password on this device</span>
            </span>
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
  `}function ve(e){return`
  <div class="auth">
    <div class="auth__card">
      <div class="brand">
        <div class="brand__logo" aria-hidden="true">₹</div>
        <div class="brand__text">
          <div class="brand__title">Loukman Wallet</div>
          <div class="brand__sub">Unlock with Face ID</div>
        </div>
      </div>
      <div class="muted">Signed in as <strong>${U(e)}</strong></div>
      <div class="form__actions auth__actions">
        <button class="btn btn--primary" data-unlock-faceid>Unlock with Face ID</button>
        <button class="btn" data-unlock-password>Use username/password</button>
        <button class="btn" data-unlock-logout>Logout</button>
      </div>
    </div>
  </div>
  `}function ye(t,n,r){let i=t.querySelector(`[data-category-list]`);i&&(i.innerHTML=n.categories.map(e=>`<option value="${U(e)}"></option>`).join(``));let a=T(n,r.ym),o=E(n,r.ym),s=r.query.trim().toLowerCase(),c=a.filter(e=>{let t=r.category===`All`?!0:e.category===r.category,n=s?e.note.toLowerCase().includes(s):!0;return t&&n}),l=O(o),u=D(a),d=l-u,f=O(n.incomes),p=D(n.expenses),m=n.openingBalanceCents+f-p,h=n.pending.filter(e=>e.closedAt===null),g=h.reduce((e,t)=>e+(t.totalCents-t.paidCents),0),_=c.length===0?``:`<div class="historyCards">
          ${c.map(t=>`<article class="hCard">
                <div class="hCard__top">
                  <div class="hCard__left">
                    <div class="hCard__note">${U(t.note||`—`)}</div>
                    <div class="hCard__meta muted">
                      <span class="mono">${t.date}</span>
                      <span class="dot">•</span>
                      <span>${U(t.category)}</span>
                    </div>
                  </div>
                  <div class="hCard__amt mono">${e(t.amountCents,n.currency)}</div>
                </div>
                <div class="hCard__actions">
                  <button class="btn btn--xs btn--accent" data-edit="${t.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${t.id}">Delete</button>
                </div>
              </article>`).join(``)}
        </div>`,v=c.length===0?`<div class="empty">No expenses for this filter.</div>`:`<div class="tableHint muted" aria-hidden="true">Swipe → to see more</div>
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
                <div>${U(t.category)}</div>
                <div class="right mono">${e(t.amountCents,n.currency)}</div>
                <div class="noteCell" title="${U(r)}">
                  <div class="noteCell__note">${U(r)}</div>
                </div>
                <div class="right actions">
                  <button class="btn btn--xs btn--accent" data-edit="${t.id}">Edit</button>
                  <button class="btn btn--xs btn--danger" data-del="${t.id}">Delete</button>
                </div>
              </div>`}).join(``)}
        </div>
      </div>`,y=t.querySelector(`[data-content]`);y&&(y.innerHTML=`
    <section class="grid2">
      <div class="card card--span">
        <div class="card__k">Money you have now</div>
        <div class="card__v ${m<0?`is-neg`:``}" data-current-money-display>${e(m,n.currency)}</div>
        <div class="card__s muted">
          <label class="field field--inline">
            <span class="field__label">Starting money</span>
            <input class="input input--sm" inputmode="decimal" data-opening-balance value="${(n.openingBalanceCents/100).toFixed(2)}" />
          </label>
        </div>
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
      <div class="card card--span">
        <div class="card__k">This month total (IN − OUT)</div>
        <div class="card__v ${d<0?`is-neg`:``}">${e(d,n.currency)}</div>
        <div class="card__s muted">${d<0?`This month is negative so far`:`This month is positive so far`}</div>
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
      ${o.length===0?`<div class="empty">No IN entries yet. Add one when someone gives you money.</div>`:`<div class="inCards">
              ${o.map(t=>`<article class="inCard">
                    <div class="inCard__top">
                      <div class="inCard__left">
                        <div class="inCard__note">${U(t.note||`—`)}</div>
                        <div class="inCard__meta muted">
                          <span class="mono">${t.date}</span>
                          <span class="dot">•</span>
                          <span>IN</span>
                        </div>
                      </div>
                      <div class="inCard__amt mono">${e(t.amountCents,n.currency)}</div>
                    </div>
                    <div class="inCard__actions">
                      <button class="btn btn--xs btn--accent" data-in-edit="${t.id}">Edit</button>
                      <button class="btn btn--xs btn--danger" data-in-del="${t.id}">Delete</button>
                    </div>
                  </article>`).join(``)}
            </div>
            <div class="inTableWrap tableWrap" aria-label="IN history table (scrollable)">
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
                      <div class="noteCell" title="${U(r)}">
                        <div class="noteCell__note">${U(r)}</div>
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
              ${n.categories.map(e=>`<option value="${U(e)}" ${r.category===e?`selected`:``}>${U(e)}</option>`).join(``)}
            </select>
          </label>
          <label class="field">
            <span class="field__label">Search note</span>
            <input class="input input--sm" data-filter-q value="${U(r.query)}" placeholder="e.g. rent" />
          </label>
        </div>
      </div>
      ${_}
      ${v}
    </section>

    <section class="panel">
      <div class="panel__head">
        <div>
          <div class="panel__title">Pending (owed to you)</div>
          <div class="panel__sub muted">${h.length} open • ${e(g,n.currency)} remaining</div>
        </div>
        <button class="btn btn--primary" data-open-pending>Add pending</button>
      </div>
      ${h.length===0?`<div class="empty">No pending items. Add one when someone owes you money.</div>`:`<div class="pendingList">
              ${h.map(t=>{let r=Math.max(0,t.totalCents-t.paidCents),i=t.note?`<span class="pending__noteInline muted">• ${U(t.note)}</span>`:``;return`<article class="pending">
                    <div class="pending__row">
                      <div>
                        <div class="pending__headLine">
                          <span class="pending__person">${U(t.person)}</span>
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
  `)}function G(e,t){let n=e.querySelector(`[data-expense-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function K(e,t){let n=e.querySelector(`[data-income-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function q(e){let t=e.querySelector(`[data-income-form]`),r=e.querySelector(`[data-income-modal-title]`);if(!t||!r)return;let i=t.elements.namedItem(`amount`),a=t.elements.namedItem(`date`),o=t.elements.namedItem(`note`);!i||!a||!o||(r.textContent=`Add IN (money received)`,i.value=``,a.value=n(),o.value=``)}function be(e,t,n){let r=e.querySelector(`[data-income-form]`),i=e.querySelector(`[data-income-modal-title]`);if(!r||!i)return;let a=r.elements.namedItem(`amount`),o=r.elements.namedItem(`date`),s=r.elements.namedItem(`note`);if(!a||!o||!s)return;if(!n){q(e);return}let c=pe(t,n);if(!c){q(e);return}i.textContent=`Edit IN entry`,a.value=(c.amountCents/100).toFixed(2),o.value=c.date,s.value=c.note}function J(e,t,r){let i=e.querySelector(`[data-expense-form]`),a=e.querySelector(`[data-expense-modal-title]`);if(!i||!a)return;let o=!!r.editingId;a.textContent=o?`Edit expense`:`Add expense`;let s=i.elements.namedItem(`amount`),c=i.elements.namedItem(`date`),l=i.elements.namedItem(`category`),u=i.elements.namedItem(`note`);if(!(!s||!c||!l||!u))if(o){let e=de(t,r.editingId);if(!e){r.editingId=null,s.value=``,c.value=n(),l.value=t.categories[0]??``,u.value=``;return}s.value=(e.amountCents/100).toFixed(2),c.value=e.date,l.value=e.category,u.value=e.note}else s.value=``,c.value=n(),l.value=t.expenses[0]?.category??t.categories[0]??``,u.value=``}function Y(e,t){let n=e.querySelector(`[data-pending-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function X(e,t){let n=e.querySelector(`[data-pay-modal]`);n&&(n.dataset.open=t?`true`:`false`,n.setAttribute(`aria-hidden`,t?`false`:`true`))}function xe(e){let t=e.querySelector(`[data-pay-form]`);if(!t)return;let n=t.elements.namedItem(`amount`);n&&(n.value=``)}function Z(e,t,n){let r=e.querySelector(`[data-pending-form]`),i=e.querySelector(`[data-pending-modal-title]`);if(!r||!i)return;let a=r.elements.namedItem(`person`),o=r.elements.namedItem(`total`),s=r.elements.namedItem(`paid`),c=r.elements.namedItem(`note`);if(!a||!o||!s||!c)return;if(!n){i.textContent=`Add pending (owed to you)`,a.value=``,o.value=``,s.value=``,c.value=``;return}let l=fe(t,n);if(!l){i.textContent=`Add pending (owed to you)`,a.value=``,o.value=``,s.value=``,c.value=``;return}i.textContent=`Edit pending`,a.value=l.person,o.value=(l.totalCents/100).toFixed(2),s.value=(l.paidCents/100).toFixed(2),c.value=l.note}function Q(n){let r=j();if(!r.currentUser){n.innerHTML=_e();let e=n.querySelector(`[data-auth-form]`),t=N();if(e&&t){let n=e.elements.namedItem(`username`),r=e.elements.namedItem(`password`),i=e.elements.namedItem(`savePassword`);n&&(n.value=t.username),r&&(r.value=t.password),i&&(i.checked=!0)}e?.addEventListener(`submit`,t=>{t.preventDefault();let i=t.submitter?.dataset.authAction,a=e.elements.namedItem(`username`),o=e.elements.namedItem(`password`),s=e.elements.namedItem(`savePassword`);if(!a||!o||!i)return;let c=a.value.trim(),l=o.value.trim(),u=!!s?.checked;if(!c||!l){alert(`Enter username and password`);return}r=j();let d=r.users.find(e=>e.username.toLowerCase()===c.toLowerCase());if(i===`register`){if(d){alert(`Username already exists`);return}r.users.push({username:c,password:l}),r.currentUser=c,M(r),u?P(c,l):F(),Q(n);return}if(!d||d.password!==l){alert(`Invalid username or password`);return}r.currentUser=d.username,M(r),u?P(d.username,l):F(),Q(n)});return}r=j();let a=r.currentUser;if(a){let e=r.biometricByUser[z(a)];if(e){n.innerHTML=ve(a);let t=n.querySelector(`[data-unlock-faceid]`),r=n.querySelector(`[data-unlock-password]`),i=n.querySelector(`[data-unlock-logout]`);t?.addEventListener(`click`,async()=>{await V(e)?Q(n):alert(`Face ID verification failed`)}),r?.addEventListener(`click`,()=>{let e=j();e.currentUser=null,M(e),Q(n)}),i?.addEventListener(`click`,()=>{let e=j();e.currentUser=null,M(e),Q(n)});return}}n.innerHTML=ge();{let e=n.querySelector(`[data-faceid-toggle]`),t=r.currentUser;e&&t&&(e.textContent=r.biometricByUser[z(t)]?`Disable Face ID unlock`:`Enable Face ID unlock`)}let o=y(),s={ym:i(),query:``,category:`All`,editingId:null,editingIncomeId:null,isExpenseModalOpen:!1,isIncomeModalOpen:!1,isPendingModalOpen:!1,pendingEditId:null,isPayModalOpen:!1,pendingPayId:null},c=n.querySelector(`[data-month]`);c&&(c.value=s.ym);let l=()=>ye(n,o,s);l();let u=null,d=()=>{u!==null&&window.clearTimeout(u);let e=document.activeElement,t=e instanceof HTMLInputElement&&e.matches(`[data-filter-q]`),r=t&&e.selectionStart!==null?e.selectionStart:null;u=window.setTimeout(()=>{if(l(),u=null,t){let e=n.querySelector(`[data-filter-q]`);if(e){e.focus();let t=r??e.value.length;e.setSelectionRange(t,t)}}},120)},f=n.querySelector(`[data-menu]`),p=n.querySelector(`[data-menu-panel]`),m=()=>{p&&(p.hidden=!0)};f?.addEventListener(`click`,()=>{p&&(p.hidden=!p.hidden)}),document.addEventListener(`click`,e=>{let t=e.target;t&&(t.closest(`[data-menu]`)||t.closest(`[data-menu-panel]`)||m())}),c?.addEventListener(`change`,()=>{let e=c.value;/^\d{4}-\d{2}$/.test(e)&&(s.ym=e,l())}),n.addEventListener(`click`,async e=>{let t=e.target;if(!t)return;if(t.closest(`[data-open-expense]`)){s.editingId=null,s.isExpenseModalOpen=!0,G(n,!0),J(n,o,s),m();return}if(t.closest(`[data-open-income]`)){s.editingIncomeId=null,s.isIncomeModalOpen=!0,K(n,!0),q(n),m();return}if(t.closest(`[data-close-expense]`)){s.editingId=null,s.isExpenseModalOpen=!1,G(n,!1),m();return}if(t.closest(`[data-close-income]`)){s.editingIncomeId=null,s.isIncomeModalOpen=!1,K(n,!1),m();return}let i=t.closest(`[data-in-edit]`);if(i&&i.getAttribute(`data-in-edit`)){let e=i.getAttribute(`data-in-edit`);s.editingIncomeId=e,s.isIncomeModalOpen=!0,K(n,!0),be(n,o,e),m();return}let a=t.closest(`[data-in-del]`);if(a&&a.getAttribute(`data-in-del`)){let e=a.getAttribute(`data-in-del`);if(!confirm(`Delete this IN entry?`))return;o=re(o,e),b(o),l(),W(n,`IN deleted`),m();return}let u=t.closest(`[data-edit]`);if(u?.dataset.edit){s.editingId=u.dataset.edit,s.isExpenseModalOpen=!0,G(n,!0),J(n,o,s),m();return}let d=t.closest(`[data-del]`);if(d?.dataset.del){let e=d.dataset.del;if(!confirm(`Delete this expense?`))return;o=ae(o,e),b(o),l(),W(n,`Expense deleted`),m();return}if(t.closest(`[data-export]`)){me(`expense-tracker-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(o,null,2)),m(),W(n,`Exported`);return}let f=t.closest(`[data-faceid-toggle]`);if(f){let e=r.currentUser;if(!e){W(n,`Please login again`);return}let t=z(e);if(r.biometricByUser[t]){delete r.biometricByUser[t],M(r),f.textContent=`Enable Face ID unlock`,m(),W(n,`Face ID unlock disabled`);return}let i=await B(e);if(!i){W(n,`Face ID is not available on this device`);return}r.biometricByUser[t]=i,M(r),f.textContent=`Disable Face ID unlock`,m(),W(n,`Face ID unlock enabled`);return}if(t.closest(`[data-logout]`)){let e=j();e.currentUser=null,M(e),Q(n);return}if(t.closest(`[data-open-pending]`)){s.isPendingModalOpen=!0,s.pendingEditId=null,Y(n,!0),Z(n,o,null),m();return}if(t.closest(`[data-close-pending]`)){s.isPendingModalOpen=!1,s.pendingEditId=null,Y(n,!1),m();return}if(t.closest(`[data-close-pay]`)){s.isPayModalOpen=!1,s.pendingPayId=null,X(n,!1),m();return}let p=t.closest(`[data-pend-edit]`);if(p&&p.getAttribute(`data-pend-edit`)){let e=p.getAttribute(`data-pend-edit`);s.isPendingModalOpen=!0,s.pendingEditId=e,Y(n,!0),Z(n,o,e),m();return}let h=t.closest(`[data-pend-pay]`);if(h&&h.getAttribute(`data-pend-pay`)){let e=h.getAttribute(`data-pend-pay`);s.isPayModalOpen=!0,s.pendingPayId=e,X(n,!0),xe(n);return}let g=t.closest(`[data-pend-del]`);if(g&&g.getAttribute(`data-pend-del`)){let e=g.getAttribute(`data-pend-del`);if(!confirm(`Delete this pending item?`))return;o=ce(o,e),b(o),l(),W(n,`Pending deleted`);return}if(t.closest(`[data-reset]`)){if(!confirm(`This will erase all app data (income, IN, expenses, pending, budgets). Continue?`))return;ee(),o=y(),s={...s,query:``,category:`All`,editingId:null,editingIncomeId:null},c&&(c.value=s.ym),G(n,!1),K(n,!1),Y(n,!1),X(n,!1),l(),m(),W(n,`Reset complete`);return}if(t.closest(`[data-import]`)){m();return}}),n.addEventListener(`input`,r=>{let i=r.target;if(!i)return;let a=i.closest(`[data-opening-balance]`);if(a){let r=a.value.trim(),i=r===``?0:t(r);if(i===null)return;o=S(o,i),b(o);let s=n.querySelector(`[data-current-money-display]`);if(s){let t=o.openingBalanceCents+O(o.incomes)-D(o.expenses);s.textContent=e(t,o.currency),s.classList.toggle(`is-neg`,t<0)}return}let c=i.closest(`[data-filter-q]`);if(c){s.query=c.value,d();return}let u=i.closest(`[data-filter-category]`);if(u){let e=u.value;s.category=e===`All`?`All`:e,l();return}});let h=n.querySelector(`[data-import]`);h?.addEventListener(`change`,async()=>{let e=h.files?.[0];if(e)try{let t=await he(e),r=JSON.parse(t);localStorage.setItem(`expense_tracker_v1`,JSON.stringify(r)),o=y(),l(),W(n,`Imported`)}catch{W(n,`Import failed (invalid JSON)`)}finally{h.value=``}});let g=n.querySelector(`[data-expense-form]`);g?.addEventListener(`submit`,e=>{if(e.preventDefault(),!g)return;let r=g.elements.namedItem(`amount`),i=g.elements.namedItem(`date`),a=g.elements.namedItem(`category`),c=g.elements.namedItem(`note`);if(!r||!i||!a||!c)return;let u=r.value.trim();if(!u){W(n,`Amount is required`);return}let d=t(u),f=i.value,p=H(a.value),m=c.value;if(d===null||d<=0){W(n,`Enter an amount like 50 or 50.00`);return}if(!/^\d{4}-\d{2}-\d{2}$/.test(f)){W(n,`Pick a valid date`);return}s.editingId?(o=ie(o,s.editingId,{amountCents:d,date:f,category:p,note:m}),W(n,`Expense updated`)):(o=C(o,{amountCents:d,date:f,category:p,note:m}),W(n,`Expense added`)),b(o),s.editingId=null,s.isExpenseModalOpen=!1,G(n,!1),l()});let _=n.querySelector(`[data-pending-form]`);_?.addEventListener(`submit`,e=>{if(e.preventDefault(),!_)return;let r=_.elements.namedItem(`person`),i=_.elements.namedItem(`total`),a=_.elements.namedItem(`paid`),c=_.elements.namedItem(`note`);if(!r||!i||!a||!c)return;let u=r.value.trim(),d=t(i.value),f=a.value.trim(),p=f===``?0:t(f),m=c.value;if(!u){W(n,`Enter a person`);return}if(d===null||d<=0){W(n,`Enter a valid total`);return}if(p===null||p<0){W(n,`Enter a valid paid amount`);return}o=s.pendingEditId?w(o,s.pendingEditId,{person:u,totalCents:d,paidCents:p,note:m}):oe(o,{person:u,totalCents:d,paidCents:p,note:m}),b(o),s.isPendingModalOpen=!1,s.pendingEditId=null,Y(n,!1),_.reset(),l(),W(n,`Saved`)});let v=n.querySelector(`[data-pay-form]`);v?.addEventListener(`submit`,e=>{if(e.preventDefault(),!v)return;let r=v.elements.namedItem(`amount`);if(!r)return;let i=r.value.trim();if(!i){W(n,`Amount is required`);return}let a=t(i);if(a===null||a<=0){W(n,`Enter an amount like 50 or 50.00`);return}s.pendingPayId&&(o=se(o,s.pendingPayId,a),b(o),s.isPayModalOpen=!1,s.pendingPayId=null,X(n,!1),v.reset(),l(),W(n,`Payment recorded`))});let x=n.querySelector(`[data-income-form]`);x?.addEventListener(`submit`,e=>{if(e.preventDefault(),!x)return;let r=x.elements.namedItem(`amount`),i=x.elements.namedItem(`date`),a=x.elements.namedItem(`note`);if(!r||!i||!a)return;let c=r.value.trim();if(!c){W(n,`Amount is required`);return}let u=t(c),d=i.value,f=a.value;if(u===null||u<=0){W(n,`Enter an amount like 50 or 50.00`);return}if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){W(n,`Pick a valid date`);return}s.editingIncomeId?(o=ne(o,s.editingIncomeId,{amountCents:u,date:d,note:f}),W(n,`IN updated`)):(o=te(o,{amountCents:u,date:d,note:f}),W(n,`IN added`)),b(o),s.editingIncomeId=null,s.isIncomeModalOpen=!1,K(n,!1),x.reset(),l()})}var $=document.querySelector(`#app`);if(!$)throw Error(`Missing #app element`);Q($),`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/luk-wallet/sw.js`).catch(()=>{})});
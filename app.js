(() => {
  'use strict';

  /* ------------------------------------------------------------------
     Spend Notes: a quiet place to jot down what you spend.
     Everything is stored in this browser (localStorage). Nothing is sent
     anywhere. The starter tiles below are generic on purpose; the person
     using the app renames them to whatever fits their life.
  ------------------------------------------------------------------ */

  const STORE_KEY = 'spendnotes.v1';
  const MAX_DIGITS = 8; // up to $999,999.99
  const NOTE_MAX = 200;
  const DAY = 86400000;

  const STARTER_TILES = [
    ['Food', '🍎'],
    ['Car', '🚗'],
    ['Pets', '🐾'],
    ['Home', '🏠'],
    ['Health', '🌿'],
    ['Fun', '🎈'],
    ['Kids', '🧸'],
  ];

  const EMOJI_CATS = [
    { id: 'popular', label: 'Popular' },
    { id: 'food', label: 'Food & drink' },
    { id: 'shop', label: 'Shopping' },
    { id: 'home', label: 'Home & bills' },
    { id: 'transport', label: 'Transport' },
    { id: 'money', label: 'Money' },
    { id: 'health', label: 'Health' },
    { id: 'fun', label: 'Fun & travel' },
    { id: 'family', label: 'Family' },
    { id: 'other', label: 'Other' },
  ];

  const EMOJI_LIBRARY = [
    { e: '🛒', k: ['cart', 'groceries', 'store', 'shopping'], cats: ['popular', 'home'] },
    { e: '🍔', k: ['burger', 'fast food', 'dining'], cats: ['popular', 'food'] },
    { e: '🚗', k: ['car', 'drive', 'gas', 'auto'], cats: ['popular', 'transport'] },
    { e: '🏠', k: ['home', 'rent', 'house', 'mortgage'], cats: ['popular', 'home'] },
    { e: '💳', k: ['card', 'credit', 'payment'], cats: ['popular', 'money'] },
    { e: '☕', k: ['coffee', 'cafe', 'latte'], cats: ['popular', 'food'] },
    { e: '🎬', k: ['movie', 'cinema', 'film'], cats: ['popular', 'fun'] },
    { e: '✈️', k: ['flight', 'travel', 'plane', 'trip'], cats: ['popular', 'fun'] },
    { e: '💊', k: ['medicine', 'pharmacy', 'health'], cats: ['popular', 'health'] },
    { e: '🎁', k: ['gift', 'present', 'birthday'], cats: ['popular', 'shop'] },
    { e: '📱', k: ['phone', 'mobile', 'cell'], cats: ['popular', 'home'] },
    { e: '💰', k: ['money', 'savings', 'cash'], cats: ['popular', 'money'] },
    { e: '🐶', k: ['dog', 'pet'], cats: ['popular', 'family'] },
    { e: '👶', k: ['baby', 'kid', 'child'], cats: ['popular', 'family'] },
    { e: '🏋️', k: ['gym', 'fitness', 'workout'], cats: ['popular', 'health'] },
    { e: '🍺', k: ['beer', 'bar', 'drinks'], cats: ['popular', 'food'] },

    { e: '🍕', k: ['pizza'], cats: ['food'] },
    { e: '🍜', k: ['noodles', 'ramen', 'takeout'], cats: ['food'] },
    { e: '🍣', k: ['sushi'], cats: ['food'] },
    { e: '🍩', k: ['donut', 'dessert', 'sweet'], cats: ['food'] },
    { e: '🍦', k: ['ice cream'], cats: ['food'] },
    { e: '🍷', k: ['wine'], cats: ['food'] },
    { e: '🥗', k: ['salad', 'healthy'], cats: ['food'] },
    { e: '🍳', k: ['breakfast', 'eggs', 'cooking'], cats: ['food'] },
    { e: '🧋', k: ['bubble tea', 'boba'], cats: ['food'] },
    { e: '🍿', k: ['popcorn', 'snacks'], cats: ['food'] },

    { e: '🛍️', k: ['shopping', 'bag'], cats: ['shop'] },
    { e: '👗', k: ['clothes', 'dress', 'fashion'], cats: ['shop'] },
    { e: '👟', k: ['shoes', 'sneakers'], cats: ['shop'] },
    { e: '👜', k: ['purse', 'bag'], cats: ['shop'] },
    { e: '💄', k: ['makeup', 'beauty'], cats: ['shop'] },
    { e: '📦', k: ['package', 'delivery', 'order'], cats: ['shop'] },
    { e: '💍', k: ['jewelry', 'ring'], cats: ['shop'] },
    { e: '🕶️', k: ['sunglasses'], cats: ['shop'] },

    { e: '🧹', k: ['cleaning', 'chores'], cats: ['home'] },
    { e: '🪴', k: ['plant', 'garden'], cats: ['home'] },
    { e: '🛋️', k: ['furniture', 'couch'], cats: ['home'] },
    { e: '💡', k: ['electricity', 'utilities', 'lightbulb'], cats: ['home'] },
    { e: '🔌', k: ['utilities', 'power'], cats: ['home'] },
    { e: '🔧', k: ['repair', 'maintenance', 'tools'], cats: ['home'] },
    { e: '🧾', k: ['receipt', 'bill', 'invoice'], cats: ['home', 'money'] },

    { e: '⛽', k: ['gas', 'fuel', 'petrol'], cats: ['transport'] },
    { e: '🚕', k: ['taxi', 'rideshare', 'cab'], cats: ['transport'] },
    { e: '🚌', k: ['bus', 'transit'], cats: ['transport'] },
    { e: '🚆', k: ['train', 'rail'], cats: ['transport'] },
    { e: '🅿️', k: ['parking'], cats: ['transport'] },
    { e: '🚲', k: ['bike', 'bicycle'], cats: ['transport'] },
    { e: '🛵', k: ['scooter', 'moped'], cats: ['transport'] },

    { e: '🏦', k: ['bank'], cats: ['money'] },
    { e: '💸', k: ['expense', 'spending'], cats: ['money'] },
    { e: '🧮', k: ['budget', 'calculate'], cats: ['money'] },
    { e: '📊', k: ['chart', 'report', 'budget'], cats: ['money'] },
    { e: '🪙', k: ['coin', 'savings'], cats: ['money'] },
    { e: '💼', k: ['work', 'business'], cats: ['money'] },

    { e: '🏥', k: ['hospital', 'doctor'], cats: ['health'] },
    { e: '🦷', k: ['dentist', 'dental'], cats: ['health'] },
    { e: '🧘', k: ['yoga', 'wellness'], cats: ['health'] },
    { e: '🩺', k: ['doctor', 'checkup'], cats: ['health'] },
    { e: '🚴', k: ['cycling', 'exercise'], cats: ['health'] },
    { e: '🥦', k: ['vegetables', 'diet'], cats: ['health'] },

    { e: '🎮', k: ['games', 'gaming'], cats: ['fun'] },
    { e: '🎟️', k: ['tickets', 'event'], cats: ['fun'] },
    { e: '🎉', k: ['party', 'celebration'], cats: ['fun'] },
    { e: '🏖️', k: ['vacation', 'beach', 'holiday'], cats: ['fun'] },
    { e: '🗺️', k: ['travel', 'trip', 'map'], cats: ['fun'] },
    { e: '🎵', k: ['music', 'streaming'], cats: ['fun'] },
    { e: '📚', k: ['books', 'education'], cats: ['fun'] },
    { e: '🎨', k: ['hobby', 'art'], cats: ['fun'] },

    { e: '🐱', k: ['cat', 'pet'], cats: ['family'] },
    { e: '🎂', k: ['birthday', 'cake'], cats: ['family'] },
    { e: '👪', k: ['family'], cats: ['family'] },
    { e: '🧸', k: ['kids', 'toys'], cats: ['family'] },

    { e: '✨', k: ['sparkle', 'misc', 'new'], cats: ['other'] },
    { e: '⭐', k: ['star', 'favorite'], cats: ['other'] },
    { e: '❤️', k: ['heart', 'love'], cats: ['other'] },
    { e: '🔥', k: ['fire', 'hot'], cats: ['other'] },
    { e: '🎓', k: ['school', 'tuition', 'education'], cats: ['other'] },
    { e: '🔖', k: ['bookmark', 'subscription'], cats: ['other'] },
  ];

  /* ---------------------------- helpers ---------------------------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function h(tag, attrs = {}, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  function uid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function fmt(cents) {
    const abs = Math.abs(cents);
    const dollars = Math.floor(abs / 100).toLocaleString('en-US');
    const rest = String(abs % 100).padStart(2, '0');
    return (cents < 0 ? '-' : '') + '$' + dollars + '.' + rest;
  }

  // "12.50" -> 1250. Returns null if it isn't a sensible amount.
  function parseMoney(input) {
    const s = String(input).trim().replace(/[$,\s]/g, '');
    if (!/^\d*\.?\d{0,2}$/.test(s) || s === '' || s === '.') return null;
    const [d, c = ''] = s.split('.');
    const cents = parseInt(d || '0', 10) * 100 + parseInt((c + '00').slice(0, 2), 10);
    return cents > 0 && cents <= 99999999 ? cents : null;
  }

  function ymd(date) {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
  }

  const sum = (list) => list.reduce((t, e) => t + e.cents, 0);
  const nameOf = (c) => (c && c.name.trim()) || 'Untitled';
  const labelOf = (c) => (c ? `${c.emoji ? c.emoji + ' ' : ''}${nameOf(c)}` : 'Other');

  /* ----------------------------- state ----------------------------- */

  function defaultState() {
    return {
      version: 1,
      categories: STARTER_TILES.map(([name, emoji]) => ({ id: uid(), name, emoji, hidden: false })),
      entries: [],
      settings: { method: 'card', bars: true, lastBackup: null, nudgeUntil: 0, recentEmoji: [] },
    };
  }

  // Accepts anything (stored data or an uploaded backup) and returns a clean
  // state object, or null if it clearly isn't one of ours.
  function sanitize(raw) {
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.categories) || !Array.isArray(raw.entries)) {
      return null;
    }
    const cats = [];
    const catIds = new Set();
    for (const c of raw.categories) {
      if (!c || typeof c.id !== 'string' || catIds.has(c.id)) continue;
      catIds.add(c.id);
      cats.push({
        id: c.id,
        name: String(c.name == null ? '' : c.name).slice(0, 30),
        emoji: String(c.emoji == null ? '' : c.emoji).slice(0, 8),
        hidden: !!c.hidden,
      });
    }
    if (cats.length === 0) {
      defaultState().categories.forEach((c) => { cats.push(c); catIds.add(c.id); });
    }

    const entries = [];
    const entryIds = new Set();
    for (const e of raw.entries) {
      if (!e || typeof e.id !== 'string' || entryIds.has(e.id)) continue;
      const cents = Number(e.cents);
      const ts = Number(e.ts);
      if (!Number.isInteger(cents) || cents < 0 || !Number.isFinite(ts)) continue;
      entryIds.add(e.id);
      const entry = {
        id: e.id,
        cents,
        ts,
        method: e.method === 'cash' ? 'cash' : 'card',
        categoryId: typeof e.categoryId === 'string' ? e.categoryId : '',
      };
      const note = typeof e.note === 'string' ? e.note.trim().slice(0, NOTE_MAX) : '';
      if (note) entry.note = note;
      entries.push(entry);
    }

    // Entries pointing at a tile that no longer exists go into a hidden "Other".
    let other = null;
    for (const e of entries) {
      if (catIds.has(e.categoryId)) continue;
      if (!other) {
        other = { id: uid(), name: 'Other', emoji: '📝', hidden: true };
        cats.push(other);
        catIds.add(other.id);
      }
      e.categoryId = other.id;
    }

    const s = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
    return {
      version: 1,
      categories: cats,
      entries,
      settings: {
        method: s.method === 'cash' ? 'cash' : 'card',
        bars: s.bars !== false,
        lastBackup: Number(s.lastBackup) > 0 ? Number(s.lastBackup) : null,
        nudgeUntil: Number(s.nudgeUntil) || 0,
        recentEmoji: Array.isArray(s.recentEmoji)
          ? s.recentEmoji.filter((e) => typeof e === 'string' && e).map((e) => e.slice(0, 8)).slice(0, 8)
          : [],
      },
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const clean = sanitize(JSON.parse(raw));
        if (clean) return clean;
      }
    } catch (err) { /* fall through to a fresh start */ }
    return defaultState();
  }

  let state = load();

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      toast('Couldn’t save on this device. Try saving a backup file.');
      return false;
    }
  }

  /* ------------------------------ toast ----------------------------- */

  let toastTimer = null;
  function toast(message, action, ms = 5000) {
    const t = $('#toast');
    clearTimeout(toastTimer);
    t.replaceChildren(
      h('span', { class: 'toast-msg', text: message }),
      action && h('button', {
        type: 'button',
        class: 'toast-btn',
        text: action.label,
        onclick: () => { clearTimeout(toastTimer); t.hidden = true; action.fn(); },
      })
    );
    t.hidden = false;
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
    toastTimer = setTimeout(() => { t.hidden = true; }, ms);
  }

  /* ------------------------------ modal ----------------------------- */

  let onModalDismiss = null;

  function openModal(...nodes) {
    const card = $('#modal-card');
    card.replaceChildren(...nodes);
    $('#modal').hidden = false;
    const first = card.querySelector('input, select, button');
    if (first) first.focus();
  }

  function closeModal() {
    onModalDismiss = null;
    $('#modal').hidden = true;
    $('#modal-card').replaceChildren();
  }

  function dismissModal() {
    const cb = onModalDismiss;
    closeModal();
    if (cb) cb();
  }

  function confirmModal(title, body, okLabel) {
    return new Promise((resolve) => {
      const done = (v) => { closeModal(); resolve(v); };
      openModal(
        h('h2', { class: 'modal-title', text: title }),
        h('p', { class: 'modal-body', text: body }),
        h('div', { class: 'modal-actions' },
          h('button', { type: 'button', class: 'btn ghost', text: 'Cancel', onclick: () => done(false) }),
          h('button', { type: 'button', class: 'btn primary', text: okLabel, onclick: () => done(true) })
        )
      );
      onModalDismiss = () => resolve(false);
    });
  }

  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') dismissModal(); });

  /* ----------------------------- routing ---------------------------- */

  const SCREENS = ['home', 'lookback', 'tiles', 'settings'];
  let current = 'home';
  let focusTileId = null;

  function go(name) {
    const n = ((history.state && history.state.n) || 0) + 1;
    history.pushState({ n }, '', '#' + (name === 'home' ? '' : name));
    route();
  }

  function back() {
    if (history.state && history.state.n) {
      history.back();
    } else {
      history.replaceState(null, '', location.pathname + location.search);
      route();
    }
  }

  function route() {
    const name = (location.hash || '').replace('#', '') || 'home';
    current = SCREENS.includes(name) ? name : 'home';
    if (!$('#modal').hidden) closeModal();
    $$('.screen').forEach((s) => { s.hidden = s.dataset.screen !== current; });
    if (current === 'home') renderHome();
    if (current === 'lookback') { lb.cat = null; renderLookback(); }
    if (current === 'tiles') renderEditor();
    if (current === 'settings') renderSettings();
    if (current !== 'tiles') window.scrollTo(0, 0);
  }

  document.addEventListener('click', (e) => {
    const goBtn = e.target.closest('[data-go]');
    if (goBtn) { go(goBtn.dataset.go); return; }
    if (e.target.closest('[data-back]')) back();
  });
  window.addEventListener('popstate', route);

  /* ------------------------------ home ------------------------------ */

  let digits = '';
  const currentCents = () => (digits ? parseInt(digits, 10) : 0);

  function renderAmount() {
    const el = $('#amount');
    const c = currentCents();
    el.textContent = fmt(c);
    el.classList.toggle('zero', c === 0);
  }

  function pressKey(key) {
    if (key === 'back') {
      digits = digits.slice(0, -1);
    } else if (digits === '' && /^0+$/.test(key)) {
      return;
    } else if (digits.length + key.length <= MAX_DIGITS) {
      digits += key;
    }
    renderAmount();
  }

  function renderMethod() {
    $$('#method-seg button').forEach((b) => {
      b.setAttribute('aria-checked', String(b.dataset.method === state.settings.method));
    });
  }

  function renderTiles() {
    const box = $('#tiles');
    const visible = state.categories.filter((c) => !c.hidden);
    box.replaceChildren(
      ...(visible.length
        ? visible.map((c) => h('button', { type: 'button', class: 'tile', 'data-id': c.id, 'aria-label': nameOf(c) },
            h('span', { class: 'tile-emoji', 'aria-hidden': 'true', text: c.emoji || '•' }),
            h('span', { class: 'tile-name', text: nameOf(c) })))
        : [h('p', { class: 'tiles-empty', text: 'No tiles yet. Tap “Edit tiles” to add some.' })])
    );
  }

  // Optional note for the next entry. Tucked away until she wants it.
  let note = '';
  let noteOpen = false;

  function renderNote() {
    const input = $('#note-input');
    input.hidden = !noteOpen;
    $('#note-toggle').hidden = noteOpen;
    if (input.value !== note) input.value = note;
  }

  $('#note-toggle').addEventListener('click', () => {
    noteOpen = true;
    renderNote();
    $('#note-input').focus();
  });
  $('#note-input').addEventListener('input', (e) => { note = e.target.value; });
  $('#note-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') e.target.blur(); });

  function renderHome() {
    renderAmount();
    renderMethod();
    renderNote();
    renderTiles();
  }

  function nudgeAmount() {
    const el = $('#amount');
    el.classList.remove('pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
    toast('Type an amount first, then tap a tile.', null, 2500);
  }

  function addEntry(categoryId) {
    const cents = currentCents();
    if (!cents) { nudgeAmount(); return; }
    const entry = { id: uid(), cents, method: state.settings.method, categoryId, ts: Date.now() };
    const n = note.trim();
    if (n) entry.note = n;
    state.entries.push(entry);
    save();
    digits = '';
    note = '';
    noteOpen = false;
    renderAmount();
    renderNote();
    const cat = state.categories.find((c) => c.id === categoryId);
    toast(`Saved ${fmt(cents)} · ${labelOf(cat)}`, {
      label: 'Undo',
      fn: () => {
        state.entries = state.entries.filter((e) => e.id !== entry.id);
        save();
      },
    });
  }

  $('#pad').addEventListener('click', (e) => {
    const k = e.target.closest('.key');
    if (k && !k.dataset.skipClick) pressKey(k.dataset.key);
  });

  // Long-press the backspace key to clear the whole amount.
  (() => {
    const backKey = $('.key[data-key="back"]');
    let t = null;
    const stop = () => clearTimeout(t);
    backKey.addEventListener('pointerdown', () => {
      delete backKey.dataset.skipClick;
      t = setTimeout(() => { digits = ''; renderAmount(); backKey.dataset.skipClick = '1'; }, 550);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => backKey.addEventListener(ev, stop));
  })();

  $('#method-seg').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-method]');
    if (!b) return;
    state.settings.method = b.dataset.method;
    save();
    renderMethod();
  });

  // Tap a tile to save; long-press and drag a tile to reorder it.
  const homeDrag = makeDragReorder($('#tiles'), '.tile', (draggedId, targetId) => {
    moveCategoryBefore(draggedId, targetId);
    renderTiles();
  });

  (() => {
    const box = $('#tiles');
    let timer = null;
    let dragging = false;
    let sx = 0;
    let sy = 0;

    box.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('.tile');
      if (!t) return;
      dragging = false;
      sx = e.clientX;
      sy = e.clientY;
      const pointerId = e.pointerId;
      clearTimeout(timer);
      timer = setTimeout(() => {
        dragging = true;
        homeDrag.begin(pointerId, t.dataset.id, sx, sy);
      }, 600);
    });
    box.addEventListener('pointermove', (e) => {
      if (!dragging && (Math.abs(e.clientX - sx) > 10 || Math.abs(e.clientY - sy) > 10)) clearTimeout(timer);
    });
    ['pointerup', 'pointercancel'].forEach((ev) => box.addEventListener(ev, () => clearTimeout(timer)));
    box.addEventListener('contextmenu', (e) => e.preventDefault());
    box.addEventListener('click', (e) => {
      const t = e.target.closest('.tile');
      if (!t) return;
      if (dragging) { dragging = false; return; }
      addEntry(t.dataset.id);
    });
  })();

  $('#edit-tiles-btn').addEventListener('click', () => go('tiles'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#modal').hidden) { dismissModal(); return; }
    if (current !== 'home' || !$('#modal').hidden) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (/^[0-9]$/.test(e.key)) pressKey(e.key);
    else if (e.key === 'Backspace') pressKey('back');
  });

  /* ---------------------------- look back --------------------------- */

  const lb = { mode: 'month', offset: 0, cat: null };

  function period() {
    const now = new Date();
    const short = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    let start;
    let end;
    let label;
    if (lb.mode === 'month') {
      start = new Date(now.getFullYear(), now.getMonth() + lb.offset, 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      label = lb.offset === 0
        ? 'This month'
        : start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    } else {
      const sinceMonday = (now.getDay() + 6) % 7;
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - sinceMonday + lb.offset * 7);
      end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
      const last = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      label = lb.offset === 0 ? 'This week' : `${short(start)} – ${short(last)}`;
    }
    return { start: start.getTime(), end: end.getTime(), label };
  }

  function shiftPeriod(dir) {
    lb.offset += dir;
    lb.cat = null;
    renderLookback();
  }

  function renderLookback() {
    const root = $('#lookback-body');
    root.replaceChildren();
    const p = period();
    const inRange = state.entries.filter((e) => e.ts >= p.start && e.ts < p.end);

    root.append(
      h('div', { class: 'period-nav' },
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Earlier', text: '‹', onclick: () => shiftPeriod(-1) }),
        h('div', { class: 'period-label', text: p.label }),
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Later', text: '›', disabled: lb.offset >= 0, onclick: () => shiftPeriod(1) })
      ),
      h('div', { class: 'seg seg-small', role: 'radiogroup', 'aria-label': 'Period length' },
        ['month', 'week'].map((m) => h('button', {
          type: 'button',
          role: 'radio',
          'aria-checked': String(lb.mode === m),
          text: m === 'month' ? 'Month' : 'Week',
          onclick: () => { lb.mode = m; lb.offset = 0; lb.cat = null; renderLookback(); },
        })))
    );

    if (lb.cat) renderEntriesView(root, inRange);
    else renderSummaryView(root, inRange);
  }

  function renderSummaryView(root, inRange) {
    const total = sum(inRange);
    root.append(
      h('div', { class: 'total-block' },
        h('div', { class: 'total-amount', text: fmt(total) }),
        inRange.length ? h('p', { class: 'warm', text: 'Here’s where things went.' }) : null)
    );

    if (!inRange.length) {
      root.append(h('p', { class: 'empty', text: 'Nothing noted for this stretch yet.' }));
    } else {
      const rows = state.categories
        .map((c) => ({ c, amount: sum(inRange.filter((e) => e.categoryId === c.id)) }))
        .filter((r) => r.amount > 0);

      root.append(
        h('ul', { class: 'cat-list' }, rows.map((r) => h('li', {},
          h('button', { type: 'button', class: 'cat-row', onclick: () => { lb.cat = r.c.id; renderLookback(); } },
            h('span', { class: 'cat-emoji', 'aria-hidden': 'true', text: r.c.emoji || '•' }),
            h('span', { class: 'cat-name', text: nameOf(r.c) }),
            h('span', { class: 'cat-amt', text: fmt(r.amount) }),
            state.settings.bars
              ? h('span', { class: 'bar-track', 'aria-hidden': 'true' },
                  h('span', { class: 'bar-fill', style: `width:${Math.max(2, Math.round((r.amount / total) * 100))}%` }))
              : null)))),
        h('button', { type: 'button', class: 'text-btn', text: 'See every entry', onclick: () => { lb.cat = '__all'; renderLookback(); } })
      );

      const cash = sum(inRange.filter((e) => e.method === 'cash'));
      root.append(
        h('details', { class: 'more' },
          h('summary', { text: 'Cash and card' }),
          h('p', { text: `Cash ${fmt(cash)} · Card ${fmt(total - cash)}` }))
      );
    }

    const s = state.settings;
    const stale = !s.lastBackup || Date.now() - s.lastBackup > 30 * DAY;
    if (state.entries.length >= 5 && stale && Date.now() > s.nudgeUntil) {
      root.append(
        h('div', { class: 'nudge' },
          h('p', { text: 'It’s been a while since your last backup. Saving one keeps your notes safe if you ever change phones.' }),
          h('div', { class: 'btn-row' },
            h('button', { type: 'button', class: 'btn primary', text: 'Save backup', onclick: exportBackup }),
            h('button', { type: 'button', class: 'btn ghost', text: 'Not now', onclick: () => {
              state.settings.nudgeUntil = Date.now() + 14 * DAY;
              save();
              renderLookback();
            } })))
      );
    }
  }

  function renderEntriesView(root, inRange) {
    const all = lb.cat === '__all';
    const cat = state.categories.find((c) => c.id === lb.cat);
    const subset = inRange.filter((e) => all || e.categoryId === lb.cat).sort((a, b) => b.ts - a.ts);
    const catById = new Map(state.categories.map((c) => [c.id, c]));

    root.append(
      h('button', { type: 'button', class: 'text-btn left', text: '‹ All categories', onclick: () => { lb.cat = null; renderLookback(); } }),
      h('h2', { class: 'sub-title', text: all ? 'Every entry' : labelOf(cat) }),
      h('div', { class: 'sub-total', text: fmt(sum(subset)) })
    );

    if (!subset.length) {
      root.append(h('p', { class: 'empty', text: 'Nothing here.' }));
      return;
    }

    root.append(
      h('ul', { class: 'entry-list' }, subset.map((e) => {
        const date = new Date(e.ts).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const sub = (all ? labelOf(catById.get(e.categoryId)) + ' · ' : '') + (e.method === 'cash' ? 'Cash' : 'Card');
        return h('li', {},
          h('button', { type: 'button', class: 'entry', onclick: () => openEntryEditor(e) },
            h('span', { class: 'entry-main' },
              h('span', { class: 'entry-date', text: date }),
              h('span', { class: 'entry-sub', text: sub }),
              e.note ? h('span', { class: 'entry-note', text: e.note }) : null),
            h('span', { class: 'entry-amt', text: fmt(e.cents) })));
      }))
    );
  }

  function openEntryEditor(entry) {
    let method = entry.method;
    const amount = h('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', value: (entry.cents / 100).toFixed(2) });
    const cat = h('select', {},
      state.categories
        .filter((c) => !c.hidden || c.id === entry.categoryId)
        .map((c) => h('option', { value: c.id, text: labelOf(c) })));
    cat.value = entry.categoryId;
    const date = h('input', { type: 'date', value: ymd(new Date(entry.ts)) });
    const noteIn = h('input', {
      type: 'text', maxlength: String(NOTE_MAX), autocomplete: 'off', placeholder: 'Optional', value: entry.note || '',
    });
    const note = h('p', { class: 'field-note', 'aria-live': 'polite' });

    const seg = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Payment type' },
      ['card', 'cash'].map((m) => h('button', {
        type: 'button',
        role: 'radio',
        'data-m': m,
        'aria-checked': String(method === m),
        text: m === 'card' ? 'Card' : 'Cash',
        onclick: () => {
          method = m;
          $$('button', seg).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.m === method)));
        },
      })));

    const onSave = () => {
      const cents = parseMoney(amount.value);
      if (!cents) { note.textContent = 'Enter an amount like 12.50.'; amount.focus(); return; }
      let ts = entry.ts;
      if (date.value && date.value !== ymd(new Date(entry.ts))) {
        const [y, m, d] = date.value.split('-').map(Number);
        const old = new Date(entry.ts);
        ts = new Date(y, m - 1, d, old.getHours(), old.getMinutes(), old.getSeconds()).getTime();
      }
      entry.cents = cents;
      entry.categoryId = cat.value;
      entry.method = method;
      entry.ts = ts;
      const newNote = noteIn.value.trim();
      if (newNote) entry.note = newNote;
      else delete entry.note;
      save();
      closeModal();
      renderLookback();
    };

    const onDelete = () => {
      const index = state.entries.findIndex((e) => e.id === entry.id);
      if (index < 0) return;
      const [removed] = state.entries.splice(index, 1);
      save();
      closeModal();
      renderLookback();
      toast('Entry removed.', {
        label: 'Undo',
        fn: () => {
          state.entries.push(removed);
          save();
          if (current === 'lookback') renderLookback();
        },
      });
    };

    openModal(
      h('h2', { class: 'modal-title', text: 'Edit entry' }),
      h('label', { class: 'field' }, h('span', { text: 'Amount' }), amount),
      note,
      seg,
      h('label', { class: 'field' }, h('span', { text: 'Tile' }), cat),
      h('label', { class: 'field' }, h('span', { text: 'Date' }), date),
      h('label', { class: 'field' }, h('span', { text: 'Note' }), noteIn),
      h('div', { class: 'modal-actions' },
        h('button', { type: 'button', class: 'btn ghost', text: 'Cancel', onclick: closeModal }),
        h('button', { type: 'button', class: 'btn primary', text: 'Save', onclick: onSave })),
      h('button', { type: 'button', class: 'link-btn', text: 'Remove this entry', onclick: onDelete })
    );
  }

  /* --------------------------- tile editor -------------------------- */

  function focusRowControl(id, act) {
    const row = $(`.trow[data-id="${id}"]`);
    const btn = row && $(`[data-act="${act}"]`, row);
    if (btn && !btn.disabled) btn.focus();
  }

  function flashRow(id) {
    const row = $(`.trow[data-id="${id}"]`);
    if (!row) return;
    row.classList.add('flash');
    setTimeout(() => row.classList.remove('flash'), 900);
  }

  function emojisByCat(catId) {
    return EMOJI_LIBRARY.filter((item) => item.cats.includes(catId));
  }

  function emojisBySearch(q) {
    return EMOJI_LIBRARY.filter((item) => item.k.some((kw) => kw.includes(q)));
  }

  function openEmojiPicker(tile) {
    let activeCat = 'popular';

    const grid = h('div', { class: 'emoji-grid' });
    const tabs = h('div', { class: 'emoji-tabs', role: 'radiogroup', 'aria-label': 'Emoji category' });
    const recentLabel = h('p', { class: 'emoji-row-label', text: 'Recent' });
    const recentRow = h('div', { class: 'emoji-chips' });
    const search = h('input', {
      type: 'text', class: 'emoji-picker-search', autocomplete: 'off',
      placeholder: 'Search — try “coffee” or “car”',
      oninput: (e) => {
        const q = e.target.value.trim().toLowerCase();
        if (!q) {
          renderRecent();
          tabs.hidden = false;
          renderGrid(emojisByCat(activeCat));
          return;
        }
        recentLabel.hidden = true;
        recentRow.hidden = true;
        tabs.hidden = true;
        renderGrid(emojisBySearch(q));
      },
    });

    function renderGrid(list) {
      grid.replaceChildren(
        ...(list.length
          ? list.map((item) => h('button', { type: 'button', text: item.e, onclick: () => pick(item.e) }))
          : [h('p', { class: 'emoji-empty', text: 'No matches — try a category below.' })])
      );
    }

    function renderTabs() {
      tabs.replaceChildren(
        ...EMOJI_CATS.map((c) => h('button', {
          type: 'button', class: 'emoji-tab', role: 'radio', 'aria-checked': String(c.id === activeCat), text: c.label,
          onclick: () => {
            activeCat = c.id;
            search.value = '';
            renderTabs();
            renderGrid(emojisByCat(activeCat));
          },
        }))
      );
    }

    function renderRecent() {
      const recent = state.settings.recentEmoji;
      recentLabel.hidden = recent.length === 0;
      recentRow.hidden = recent.length === 0;
      recentRow.replaceChildren(
        ...recent.map((e) => h('button', { type: 'button', class: 'emoji-chip', text: e, onclick: () => pick(e) }))
      );
    }

    function pick(emoji) {
      tile.emoji = emoji;
      state.settings.recentEmoji = [emoji, ...state.settings.recentEmoji.filter((e) => e !== emoji)].slice(0, 8);
      save();
      closeModal();
      renderEditor();
      flashRow(tile.id);
    }

    renderTabs();
    renderRecent();
    renderGrid(emojisByCat(activeCat));

    openModal(
      h('h2', { class: 'modal-title', text: 'Choose an emoji' }),
      search,
      recentLabel,
      recentRow,
      tabs,
      grid,
      h('button', { type: 'button', class: 'link-btn', text: 'Cancel', onclick: closeModal })
    );
  }

  // Moves the dragged category to sit right before the target category.
  function moveCategoryBefore(draggedId, targetId) {
    const arr = state.categories;
    const i = arr.findIndex((c) => c.id === draggedId);
    if (i < 0) return;
    const [item] = arr.splice(i, 1);
    const j = arr.findIndex((c) => c.id === targetId);
    arr.splice(j < 0 ? arr.length : j, 0, item);
  }

  // Pointer-driven drag-to-reorder for a list of items inside `container`.
  // `onMove(draggedId, targetId)` is called whenever the dragged item crosses
  // over another item, and is responsible for re-rendering.
  function makeDragReorder(container, itemSelector, onMove) {
    let dragId = null;
    let sx = 0;
    let sy = 0;

    function elementUnder(x, y, el) {
      const prev = el.style.pointerEvents;
      el.style.pointerEvents = 'none';
      const hit = document.elementFromPoint(x, y);
      el.style.pointerEvents = prev;
      return hit && hit.closest(itemSelector);
    }

    function begin(pointerId, id, x, y) {
      dragId = id;
      sx = x;
      sy = y;
      const el = $(`${itemSelector}[data-id="${id}"]`, container);
      if (el) el.classList.add('dragging');
      try { container.setPointerCapture(pointerId); } catch (_) { /* no-op */ }
    }

    container.addEventListener('pointermove', (e) => {
      if (!dragId) return;
      e.preventDefault();
      const el = $(`${itemSelector}[data-id="${dragId}"]`, container);
      if (!el) return;
      el.style.transform = `translate(${e.clientX - sx}px, ${e.clientY - sy}px)`;
      const target = elementUnder(e.clientX, e.clientY, el);
      if (target && target.dataset.id !== dragId) {
        onMove(dragId, target.dataset.id);
        const moved = $(`${itemSelector}[data-id="${dragId}"]`, container);
        if (moved) moved.classList.add('dragging');
        sx = e.clientX;
        sy = e.clientY;
      }
    });

    function end(e) {
      if (!dragId) return;
      const el = $(`${itemSelector}[data-id="${dragId}"]`, container);
      if (el) { el.style.transform = ''; el.classList.remove('dragging'); }
      dragId = null;
      try { container.releasePointerCapture(e.pointerId); } catch (_) { /* no-op */ }
      save();
    }
    container.addEventListener('pointerup', end);
    container.addEventListener('pointercancel', end);

    return { begin };
  }

  const editorDrag = makeDragReorder($('#tiles-list'), '.trow', (draggedId, targetId) => {
    moveCategoryBefore(draggedId, targetId);
    renderEditor();
  });

  function renderEditor() {
    const ul = $('#tiles-list');
    ul.replaceChildren(
      ...state.categories.map((c) => h('li', { class: 'trow' + (c.hidden ? ' is-hidden' : ''), 'data-id': c.id },
        h('span', {
          class: 'trow-handle', 'aria-hidden': 'true', text: '≡',
          onpointerdown: (e) => { e.preventDefault(); editorDrag.begin(e.pointerId, c.id, e.clientX, e.clientY); },
        }),
        h('button', {
          type: 'button', class: 'emoji-in', text: c.emoji || '🙂',
          'aria-label': 'Change picture for ' + nameOf(c),
          onclick: () => openEmojiPicker(c),
        }),
        h('input', {
          type: 'text', class: 'name-in', value: c.name, maxlength: '30', placeholder: 'Name this tile',
          autocomplete: 'off', 'aria-label': 'Tile name',
          oninput: (e) => { c.name = e.target.value; save(); },
        }),
        h('button', {
          type: 'button', class: 'mini', 'data-act': 'hide', text: c.hidden ? 'Show' : 'Hide',
          'aria-label': (c.hidden ? 'Show' : 'Hide') + ' ' + nameOf(c),
          onclick: () => { c.hidden = !c.hidden; save(); renderEditor(); focusRowControl(c.id, 'hide'); },
        }))
      )
    );

    if (focusTileId) {
      const row = $(`.trow[data-id="${focusTileId}"]`);
      focusTileId = null;
      if (row) {
        row.classList.add('flash');
        if (row.scrollIntoView) row.scrollIntoView({ block: 'center' });
        $('.name-in', row).focus({ preventScroll: true });
      }
    }
  }

  $('#add-tile-btn').addEventListener('click', () => {
    const tile = { id: uid(), name: '', emoji: '✨', hidden: false };
    state.categories.push(tile);
    save();
    focusTileId = tile.id;
    renderEditor();
  });

  /* ----------------------- settings + backup ------------------------ */

  function renderSettings() {
    const s = state.settings;
    $('#backup-status').textContent = s.lastBackup
      ? 'Last backup: ' + new Date(s.lastBackup).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : 'No backup saved yet.';
    $('#opt-bars').checked = s.bars;
  }

  $('#opt-bars').addEventListener('change', (e) => { state.settings.bars = e.target.checked; save(); });

  function exportBackup() {
    state.settings.lastBackup = Date.now();
    save();
    const payload = {
      app: 'spend-notes',
      version: 1,
      exportedAt: new Date().toISOString(),
      categories: state.categories,
      entries: state.entries,
      settings: state.settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: `spend-notes-backup-${ymd(new Date())}.json` });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast('Backup saved.');
    if (current === 'settings') renderSettings();
    if (current === 'lookback') renderLookback();
  }

  function readFileText(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsText(file);
    });
  }

  async function restoreFromFile(file) {
    let clean = null;
    try {
      const raw = JSON.parse(await readFileText(file));
      if (raw && raw.app === 'spend-notes') clean = sanitize(raw);
    } catch (err) { /* handled below */ }
    if (!clean) {
      toast('That doesn’t look like a Spend Notes backup.');
      return;
    }
    const ok = await confirmModal(
      'Restore this backup?',
      `It has ${clean.entries.length} ${clean.entries.length === 1 ? 'entry' : 'entries'} and ${clean.categories.length} tiles. ` +
      'This replaces what’s on this phone right now.',
      'Restore'
    );
    if (!ok) return;
    state = clean;
    save();
    digits = '';
    toast(`Restored ${clean.entries.length} ${clean.entries.length === 1 ? 'entry' : 'entries'}.`);
    renderSettings();
  }

  $('#export-btn').addEventListener('click', exportBackup);
  $('#restore-btn').addEventListener('click', () => $('#restore-file').click());
  $('#restore-file').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (file) restoreFromFile(file);
  });

  /* ----------------------------- install ---------------------------- */

  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
    $('#install-btn').hidden = false;
  });
  $('#install-btn').addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    try { await installPrompt.userChoice; } catch (err) { /* ignore */ }
    installPrompt = null;
    $('#install-btn').hidden = true;
  });

  /* ------------------------------ start ----------------------------- */

  route();
  save();

  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();

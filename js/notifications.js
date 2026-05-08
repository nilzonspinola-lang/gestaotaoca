/**
 * Módulo de Notificações compartilhadas — Quadro de Tarefas TAOCA
 * --------------------------------------------------------------
 * Uso:
 *   <link rel="stylesheet" href="css/notifications.css">
 *   <script src="js/notifications.js"></script>
 *
 *   // Inserir o ícone no cabeçalho:
 *   TaocaNotif.mount(document.querySelector('.hero-actions-top'));
 *
 *   // Registrar uma ação relevante:
 *   TaocaNotif.log({
 *     event_type: 'task_completed',
 *     icon: '✅',
 *     actor: 'Marco',
 *     title: 'Marco concluiu #5 — Definir CNAE',
 *     details: 'Categoria: Institucional',
 *     task_id: '...',
 *     task_number: 5,
 *   });
 */
(function (global) {
  const TABLE = 'activity_log';
  const POLL_MS = 12000;
  const MAX_ITEMS = 50;
  const SEEN_KEY = 'taoca-notif-last-seen-iso';

  // ---------- Utilidades ----------
  function nowIso() { return new Date().toISOString(); }
  function nowBR() {
    return new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }
  function escapeHtml(text) {
    return String(text == null ? '' : text).replace(/[&<>"']/g, (m) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
    ));
  }
  function timeAgo(iso) {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    const diff = Math.max(0, Date.now() - then);
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'agora';
    if (m < 60) return `há ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `há ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `há ${d} d`;
    return new Date(iso).toLocaleDateString('pt-BR');
  }
  function getLastSeen() {
    try { return localStorage.getItem(SEEN_KEY) || ''; } catch (e) { return ''; }
  }
  function setLastSeen(iso) {
    try { localStorage.setItem(SEEN_KEY, iso); } catch (e) {}
  }

  // ---------- API ----------
  async function fetchLogs() {
    try {
      const res = await fetch(`tables/${TABLE}?limit=${MAX_ITEMS}`);
      if (!res.ok) return [];
      const json = await res.json();
      const data = (json.data || []).filter((r) => !r.deleted);
      data.sort((a, b) => {
        const da = a.created_at_iso || '';
        const db = b.created_at_iso || '';
        return db.localeCompare(da);
      });
      return data.slice(0, MAX_ITEMS);
    } catch (e) {
      console.warn('[notif] fetch falhou', e);
      return [];
    }
  }

  async function postLog(payload) {
    try {
      const body = Object.assign({
        created_at: nowBR(),
        created_at_iso: nowIso(),
      }, payload);
      const res = await fetch(`tables/${TABLE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('POST falhou');
      // Após registrar, atualiza o painel imediatamente se já estiver montado
      if (state.mounted) refresh();
      return await res.json();
    } catch (e) {
      console.warn('[notif] log falhou', e);
      return null;
    }
  }

  // ---------- UI ----------
  const state = {
    mounted: false,
    items: [],
    open: false,
    bellEl: null,
    badgeEl: null,
    panelEl: null,
    listEl: null,
    pollTimer: null,
  };

  function buildUi(container) {
    const wrap = document.createElement('div');
    wrap.className = 'notif-wrap';
    wrap.innerHTML = `
      <button type="button" class="notif-bell" id="notif-bell" aria-label="Notificações" aria-expanded="false" aria-haspopup="true">
        <span class="notif-bell-icon">🔔</span>
        <span class="notif-badge" id="notif-badge" style="display:none;">0</span>
      </button>
      <div class="notif-panel" id="notif-panel" role="menu">
        <header class="notif-panel-head">
          <h4>Notificações</h4>
          <button type="button" class="notif-mark-read" id="notif-mark-read">Marcar todas como lidas</button>
        </header>
        <div class="notif-list" id="notif-list">
          <div class="notif-empty">Carregando…</div>
        </div>
      </div>
    `;
    container.appendChild(wrap);

    state.bellEl = wrap.querySelector('#notif-bell');
    state.badgeEl = wrap.querySelector('#notif-badge');
    state.panelEl = wrap.querySelector('#notif-panel');
    state.listEl = wrap.querySelector('#notif-list');

    state.bellEl.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });
    wrap.querySelector('#notif-mark-read').addEventListener('click', (e) => {
      e.stopPropagation();
      markAllRead();
    });
    document.addEventListener('click', (e) => {
      if (!state.open) return;
      if (e.target.closest('.notif-wrap')) return;
      closePanel();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.open) closePanel();
    });
  }

  function togglePanel() {
    state.open ? closePanel() : openPanel();
  }
  function openPanel() {
    state.open = true;
    state.panelEl.classList.add('open');
    state.bellEl.setAttribute('aria-expanded', 'true');
    renderList();
  }
  function closePanel() {
    state.open = false;
    state.panelEl.classList.remove('open');
    state.bellEl.setAttribute('aria-expanded', 'false');
  }

  function unreadCount() {
    const last = getLastSeen();
    if (!last) return state.items.length;
    return state.items.filter((it) => (it.created_at_iso || '') > last).length;
  }
  function updateBadge() {
    const n = unreadCount();
    if (n <= 0) {
      state.badgeEl.style.display = 'none';
    } else {
      state.badgeEl.style.display = 'inline-flex';
      state.badgeEl.textContent = n > 99 ? '99+' : String(n);
    }
  }
  function renderList() {
    if (!state.items.length) {
      state.listEl.innerHTML = '<div class="notif-empty">Nenhuma notificação ainda.</div>';
      return;
    }
    const last = getLastSeen();
    state.listEl.innerHTML = state.items.map((it) => {
      const isNew = !last || (it.created_at_iso || '') > last;
      return `
        <div class="notif-item${isNew ? ' is-new' : ''}">
          <div class="notif-item-icon">${escapeHtml(it.icon || '🔵')}</div>
          <div class="notif-item-body">
            <div class="notif-item-title">${escapeHtml(it.title || '')}</div>
            ${it.details ? `<div class="notif-item-details">${escapeHtml(it.details)}</div>` : ''}
            <div class="notif-item-meta">
              ${it.actor ? `<span class="notif-item-actor">${escapeHtml(it.actor)}</span> ·` : ''}
              <span class="notif-item-time" title="${escapeHtml(it.created_at || '')}">${escapeHtml(timeAgo(it.created_at_iso))}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  function markAllRead() {
    if (!state.items.length) return;
    const newest = state.items[0].created_at_iso || nowIso();
    setLastSeen(newest);
    updateBadge();
    renderList();
  }

  async function refresh() {
    state.items = await fetchLogs();
    updateBadge();
    if (state.open) renderList();
  }

  // ---------- API pública ----------
  const api = {
    async mount(container) {
      if (!container) return;
      if (state.mounted) return;
      buildUi(container);
      state.mounted = true;
      await refresh();
      if (state.pollTimer) clearInterval(state.pollTimer);
      state.pollTimer = setInterval(refresh, POLL_MS);
    },
    log(payload) {
      // Não bloqueia a chamada — registra em background
      return postLog(payload);
    },
    refresh,
  };

  global.TaocaNotif = api;
})(window);

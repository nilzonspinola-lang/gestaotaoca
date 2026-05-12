/* ============================================================
   TAOCA SHELL — sidebar de navegação + topbar + auth gate
   Inclui em qualquer página chamando: TaocaShell.mount({...})
   ============================================================ */
(function () {
  const SESSION_KEY = 'taoca-auth-ok';
  const USER_KEY = 'taoca-user';
  const USER_ID_KEY = 'taoca-user-id';
  const USER_ROLE_KEY = 'taoca-user-role';

  function getCurrentUser() {
    try { return sessionStorage.getItem(USER_KEY) || 'Equipe'; } catch (e) { return 'Equipe'; }
  }
  function getCurrentUserId() {
    try { return sessionStorage.getItem(USER_ID_KEY) || ''; } catch (e) { return ''; }
  }
  function getCurrentRole() {
    try { return sessionStorage.getItem(USER_ROLE_KEY) || 'user'; } catch (e) { return 'user'; }
  }
  function isAdmin() { return getCurrentRole() === 'admin'; }

  function ensureAuth() {
    try {
      if (sessionStorage.getItem(SESSION_KEY) !== '1') {
        window.location.replace('login.html');
        return false;
      }
    } catch (e) {
      window.location.replace('login.html');
      return false;
    }
    return true;
  }

  // Ícones SVG monocromáticos minimalistas (stroke 1.5)
  const ICON = {
    home:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>',
    dashboard:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="10" rx="1.5"/><rect x="13" y="3" width="8" height="6" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="15" width="8" height="6" rx="1.5"/></svg>',
    estrategia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    vendas:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l-1.5 10a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>',
    producao:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V10"/><path d="M20 21V10"/><path d="M3 10h18"/><path d="M6 10V7a6 6 0 0 1 12 0v3"/></svg>',
    tarefas:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 11l3 3 5-6"/></svg>',
    atas:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h11l4 4v14H5z"/><path d="M16 3v4h4"/><path d="M9 12h7"/><path d="M9 16h7"/></svg>',
    clientes:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="3.5"/><path d="M3 20c.8-3.3 3.3-5 6-5s5.2 1.7 6 5"/><circle cx="17" cy="8" r="2.5"/><path d="M15 14c2.5-.5 5 1 5.5 4"/></svg>',
    financeiro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l5-5 4 4 7-8"/><path d="M14 8h6v6"/></svg>',
    cadastros:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/><circle cx="18" cy="18" r="2"/></svg>',
    search:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    logout:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5"/><path d="M15 12H4"/></svg>',
  };

  // Estrutura de navegação — clean, sem emojis
  const NAV = [
    {
      group: 'Visão',
      items: [
        { id: 'home',       label: 'Home',       icon: ICON.home,       href: 'index.html' },
        { id: 'dashboard',  label: 'Painel',     icon: ICON.dashboard,  href: 'dashboard.html' },
        { id: 'estrategia', label: 'Estratégia', icon: ICON.estrategia, href: 'estrategia.html' },
      ],
    },
    {
      group: 'Comercial',
      items: [
        { id: 'vendas',    label: 'Vendas',    icon: ICON.vendas,    href: 'vendas.html' },
        { id: 'clientes',  label: 'Clientes',  icon: ICON.clientes,  href: 'clientes.html' },
        { id: 'financeiro',label: 'Financeiro',icon: ICON.financeiro,href: 'financeiro.html' },
      ],
    },
    {
      group: 'Operação',
      items: [
        { id: 'producao',  label: 'Produção',  icon: ICON.producao, href: 'producao.html' },
        { id: 'tarefas',   label: 'Tarefas',   icon: ICON.tarefas,  href: 'tarefas.html' },
        { id: 'atas',      label: 'ATAs',      icon: ICON.atas,     href: 'atas.html' },
      ],
    },
    {
      group: 'Cadastros',
      items: [
        { id: 'cadastros', label: 'Cadastros', icon: ICON.cadastros, href: 'cadastros.html' },
      ],
    },
  ];

  function renderSidebar(activeId) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'taoca-sidebar';

    // Logo apenas — sem badge "Taoca OS", sem texto duplicado
    sidebar.innerHTML = `
      <div class="logo-block">
        <img src="assets/taoca-logo.png" alt="Taoca" class="brand-logo" />
      </div>
    `;

    NAV.forEach((group) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'nav-group';
      groupEl.innerHTML = `<div class="nav-group-title">${group.group}</div>`;
      group.items.forEach((item) => {
        const link = document.createElement('a');
        link.className = 'nav-link' + (item.id === activeId ? ' active' : '');
        link.href = item.href;
        link.title = item.label;
        link.innerHTML = `
          <span class="icon">${item.icon}</span>
          <span class="label">${item.label}</span>
        `;
        groupEl.appendChild(link);
      });
      sidebar.appendChild(groupEl);
    });

    // Footer — apenas usuário e logout discreto
    const user = getCurrentUser();
    const footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    footer.innerHTML = `
      <div class="user-chip">
        <div class="user-avatar">${(user[0] || 'T').toUpperCase()}</div>
        <span class="footer-text">${user}</span>
      </div>
      <button class="logout-link" id="taoca-logout-btn" type="button" title="Sair" aria-label="Sair">${ICON.logout}</button>
    `;
    sidebar.appendChild(footer);

    return sidebar;
  }

  function renderTopbar(opts) {
    const top = document.createElement('div');
    top.className = 'taoca-topbar';
    top.innerHTML = `
      <div class="page-title-block">
        <h1 class="page-title">${opts.title || ''}</h1>
        ${opts.subtitle ? `<div class="page-subtitle">${opts.subtitle}</div>` : ''}
      </div>
      <div class="topbar-actions" id="taoca-topbar-actions">
        <button class="icon-btn" title="Buscar" id="taoca-search-btn" aria-label="Buscar">${ICON.search}</button>
      </div>
    `;
    return top;
  }

  function mount(opts) {
    if (!ensureAuth()) return;
    opts = opts || {};
    const activeId = opts.active || '';

    // Recria estrutura
    const body = document.body;
    const oldContent = body.innerHTML;

    const app = document.createElement('div');
    app.className = 'taoca-app';

    const sidebar = renderSidebar(activeId);
    app.appendChild(sidebar);

    const main = document.createElement('main');
    main.className = 'taoca-main';

    const topbar = renderTopbar(opts);
    main.appendChild(topbar);

    const content = document.createElement('div');
    content.className = 'taoca-content';
    content.id = 'taoca-content-root';
    content.innerHTML = oldContent;
    main.appendChild(content);

    app.appendChild(main);

    body.innerHTML = '';
    body.appendChild(app);

    // Logout
    document.getElementById('taoca-logout-btn').addEventListener('click', () => {
      try {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(USER_KEY);
        sessionStorage.removeItem(USER_ID_KEY);
        sessionStorage.removeItem(USER_ROLE_KEY);
      } catch (e) {}
      window.location.replace('login.html');
    });

    // Busca placeholder → abre IA
    const searchBtn = document.getElementById('taoca-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', () => {
      if (window.TaocaAI && typeof window.TaocaAI.open === 'function') {
        window.TaocaAI.open();
      }
    });

    return content;
  }

  window.TaocaShell = { mount, ensureAuth, getCurrentUser, getCurrentUserId, getCurrentRole, isAdmin, NAV };
})();

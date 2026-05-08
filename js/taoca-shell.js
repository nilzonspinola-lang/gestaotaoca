/* ============================================================
   TAOCA SHELL — sidebar de navegação + topbar + auth gate
   Inclui em qualquer página chamando: TaocaShell.mount({...})
   ============================================================ */
(function () {
  const SESSION_KEY = 'taoca-auth-ok';
  const USER_KEY = 'taoca-user';

  function getCurrentUser() {
    try { return sessionStorage.getItem(USER_KEY) || 'Equipe'; } catch (e) { return 'Equipe'; }
  }

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

  // Estrutura de navegação — agrupada
  const NAV = [
    {
      group: 'Visão Executiva',
      items: [
        { id: 'home',       label: 'Home',          icon: '🏠', href: 'index.html' },
        { id: 'dashboard',  label: 'Painel',        icon: '📊', href: 'dashboard.html' },
        { id: 'estrategia', label: 'Estratégia',    icon: '🎯', href: 'estrategia.html' },
      ],
    },
    {
      group: 'Operação',
      items: [
        { id: 'producao',  label: 'Produção',  icon: '🍄', href: 'producao.html' },
        { id: 'tarefas',   label: 'Tarefas',   icon: '✅', href: 'tarefas.html' },
        { id: 'atas',      label: 'ATAs',      icon: '📑', href: 'atas.html' },
      ],
    },
    {
      group: 'Negócio',
      items: [
        { id: 'clientes',   label: 'Clientes',    icon: '👥', href: 'clientes.html' },
        { id: 'financeiro', label: 'Financeiro',  icon: '💰', href: 'financeiro.html' },
      ],
    },
  ];

  function renderSidebar(activeId) {
    const sidebar = document.createElement('aside');
    sidebar.className = 'taoca-sidebar';

    // Logo (a imagem já contém o nome "TAOCA" e o slogan — não duplicar texto)
    sidebar.innerHTML = `
      <div class="logo-block">
        <img src="assets/taoca-logo.png" alt="Taoca — Natureza, qualidade e afeto" class="brand-logo" />
        <div class="brand-os">Taoca OS</div>
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
          ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
        `;
        groupEl.appendChild(link);
      });
      sidebar.appendChild(groupEl);
    });

    // Footer
    const user = getCurrentUser();
    const footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    footer.innerHTML = `
      <span class="footer-text">${user}</span>
      <button class="logout-link" id="taoca-logout-btn" type="button" title="Sair">Sair</button>
    `;
    sidebar.appendChild(footer);

    return sidebar;
  }

  function renderTopbar(opts) {
    const top = document.createElement('div');
    top.className = 'taoca-topbar';
    top.innerHTML = `
      <div class="page-title-block">
        <div class="breadcrumb">${opts.breadcrumb || 'Taoca OS'}</div>
        <h1 class="page-title">${opts.title || 'Bem-vindo'}</h1>
      </div>
      <div class="topbar-actions" id="taoca-topbar-actions">
        <button class="icon-btn" title="Buscar (em breve)" id="taoca-search-btn">🔍</button>
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
      } catch (e) {}
      window.location.replace('login.html');
    });

    // Busca placeholder
    const searchBtn = document.getElementById('taoca-search-btn');
    if (searchBtn) searchBtn.addEventListener('click', () => {
      if (window.TaocaAI && typeof window.TaocaAI.open === 'function') {
        window.TaocaAI.open();
      } else {
        alert('Use o botão da Taoca IA no canto inferior direito para fazer perguntas.');
      }
    });

    return content;
  }

  window.TaocaShell = { mount, ensureAuth, getCurrentUser, NAV };
})();

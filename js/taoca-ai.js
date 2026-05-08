/* ============================================================
   TAOCA IA — assistente flutuante (modo demonstração)
   Responde com base nos dados disponíveis (tasks, clientes etc)
   sem necessidade de backend de IA — usa heurísticas locais.
   ============================================================ */
(function () {
  const STORAGE_KEY = 'taoca-ai-history';

  const FAB_ICON = `🤖`;

  const SUGGESTIONS = [
    'Quantas tarefas concluí esta semana?',
    'Quais clientes estão sem contato há mais tempo?',
    'Resumo do mês',
    'O que devo fazer hoje?',
    'Como está a produção?',
    'Gerar ATA a partir de um texto',
  ];

  let panel, body, input, fab;
  let history = [];

  function load() {
    try { history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { history = []; }
  }
  function save() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-30))); } catch (e) {}
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }

  function renderMessage(msg) {
    const el = document.createElement('div');
    el.className = 'tai-msg ' + (msg.from === 'user' ? 'user' : 'bot');
    el.innerHTML = msg.html || escapeHtml(msg.text || '');
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function renderSuggestions() {
    const wrap = document.createElement('div');
    wrap.className = 'tai-msg bot';
    wrap.innerHTML = `
      <div style="margin-bottom:8px;">Aqui vão algumas perguntas que posso responder:</div>
      <div class="tai-suggestions">
        ${SUGGESTIONS.map(s => `<button class="tai-chip" data-q="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('')}
      </div>
    `;
    body.appendChild(wrap);
    wrap.querySelectorAll('.tai-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-q');
        if (q) sendUser(q);
      });
    });
    body.scrollTop = body.scrollHeight;
  }

  // ----- Acesso a dados -----
  async function fetchTasks() {
    try {
      const res = await fetch('tables/tasks?limit=500');
      if (!res.ok) return [];
      const j = await res.json();
      return (j.data || []).filter(r => !r.deleted);
    } catch (e) { return []; }
  }

  async function fetchTable(name) {
    try {
      const res = await fetch(`tables/${name}?limit=500`);
      if (!res.ok) return [];
      const j = await res.json();
      return (j.data || []).filter(r => !r.deleted);
    } catch (e) { return []; }
  }

  function startOfDay(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function startOfWeek(d) { const x = startOfDay(d); const day = (x.getDay()+6)%7; x.setDate(x.getDate()-day); return x; }
  function startOfMonth(d) { const x = startOfDay(d); x.setDate(1); return x; }
  function parseCompleted(t) {
    if (t.completed_at_iso) { const d = new Date(t.completed_at_iso); if (!isNaN(d)) return d; }
    if (t.completed_at) {
      const m = String(t.completed_at).match(/(\d{2})\/(\d{2})\/(\d{4})[ ,]+(\d{2}):(\d{2})/);
      if (m) return new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]);
    }
    return null;
  }

  // ----- Engine de resposta (heurística local) -----
  async function respond(question) {
    const q = (question || '').toLowerCase();

    // Saudações
    if (/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite)/.test(q)) {
      return { html: `Olá! 🍄 Sou a <strong>Taoca IA</strong>, sua assistente de gestão. Posso analisar tarefas, lotes, clientes e finanças. O que você quer saber?` };
    }

    // Tarefas concluídas
    if (q.includes('conclu') || q.includes('feita') || q.includes('completa')) {
      const tasks = await fetchTasks();
      const now = new Date();
      let scope = 'total';
      let start = null;
      if (q.includes('hoje')) { scope = 'hoje'; start = startOfDay(now); }
      else if (q.includes('semana')) { scope = 'esta semana'; start = startOfWeek(now); }
      else if (q.includes('mês') || q.includes('mes')) { scope = 'este mês'; start = startOfMonth(now); }

      const done = tasks.filter(t => t.status === 'concluida');
      const filtered = start ? done.filter(t => { const d = parseCompleted(t); return d && d >= start; }) : done;
      return { html: `Você concluiu <strong>${filtered.length}</strong> tarefa(s) ${scope === 'total' ? 'no total' : scope}. ${filtered.length ? '🎉 Continue assim!' : 'Bora começar agora! 💪'}` };
    }

    // Tarefas atrasadas / pendentes
    if (q.includes('atras') || q.includes('vencid')) {
      const tasks = await fetchTasks();
      const today = startOfDay(new Date());
      const late = tasks.filter(t => {
        if (t.status === 'concluida' || !t.due_date) return false;
        const m = String(t.due_date).match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return false;
        const d = new Date(+m[1], +m[2]-1, +m[3]);
        return d < today;
      });
      if (!late.length) return { html: '✨ Sem tarefas atrasadas! Você está em dia.' };
      const list = late.slice(0, 5).map(t => `• <strong>#${t.task_number || ''}</strong> ${escapeHtml(t.title)}`).join('<br>');
      return { html: `⚠️ Existem <strong>${late.length}</strong> tarefa(s) atrasadas:<br><br>${list}${late.length>5?`<br><br>... e mais ${late.length-5}.`:''}` };
    }

    // Pendentes
    if (q.includes('pendent') || q.includes('faltand') || q.includes('fazer hoje') || q.includes('fazer agora')) {
      const tasks = await fetchTasks();
      const pend = tasks.filter(t => t.status !== 'concluida');
      const today = startOfDay(new Date());
      const ordered = pend.slice().sort((a,b) => {
        const da = a.due_date ? new Date(a.due_date) : new Date(8640000000000000);
        const db = b.due_date ? new Date(b.due_date) : new Date(8640000000000000);
        return da - db;
      });
      const top = ordered.slice(0,5);
      if (!top.length) return { html: '🎉 Você não tem tarefas pendentes!' };
      const list = top.map(t => {
        const due = t.due_date ? `<span style="color:#C77B5C">(${t.due_date.split('-').reverse().join('/')})</span>` : '';
        return `• ${escapeHtml(t.title)} ${due}`;
      }).join('<br>');
      return { html: `📋 Suas próximas <strong>${top.length}</strong> tarefa(s) prioritárias:<br><br>${list}` };
    }

    // Resumo / mês
    if (q.includes('resumo') || q.includes('mês') || q.includes('mes') || q.includes('como está') || q.includes('como estamos')) {
      const tasks = await fetchTasks();
      const total = tasks.length;
      const done = tasks.filter(t => t.status === 'concluida').length;
      const pct = total ? Math.round((done/total)*100) : 0;
      const monthStart = startOfMonth(new Date());
      const monthDone = tasks.filter(t => { if (t.status !== 'concluida') return false; const d = parseCompleted(t); return d && d >= monthStart; }).length;
      return { html: `<strong>📊 Resumo da Taoca</strong><br><br>
        • Tarefas no total: <strong>${total}</strong><br>
        • Concluídas: <strong>${done}</strong> (${pct}%)<br>
        • Concluídas este mês: <strong>${monthDone}</strong><br>
        • Pendentes: <strong>${total-done}</strong><br><br>
        ${pct >= 70 ? '🌟 Excelente ritmo!' : pct >= 40 ? '🌱 No caminho certo, vamos manter o foco.' : '💪 Hora de acelerar, podemos planejar prioridades juntos.'}` };
    }

    // Clientes
    if (q.includes('client')) {
      const cli = await fetchTable('customers');
      if (!cli.length) return { html: 'Ainda não tenho clientes cadastrados. Vá em <strong>Clientes → Novo Cliente</strong> para começar.' };
      const ativos = cli.filter(c => (c.status || '').toLowerCase() === 'ativo').length;
      return { html: `Temos <strong>${cli.length}</strong> cliente(s) cadastrado(s) — <strong>${ativos}</strong> ativos.` };
    }

    // Produção / cogumelos / lotes
    if (q.includes('produ') || q.includes('lote') || q.includes('cogumel') || q.includes('cultivo')) {
      const lotes = await fetchTable('lots');
      if (!lotes.length) return { html: 'Ainda não há lotes registrados. Cadastre o primeiro em <strong>Produção → Novo Lote</strong>. 🍄' };
      const ativos = lotes.filter(l => l.status !== 'colhido' && l.status !== 'descartado').length;
      return { html: `🍄 Temos <strong>${ativos}</strong> lote(s) em cultivo de um total de ${lotes.length}.` };
    }

    // Financeiro
    if (q.includes('finan') || q.includes('caixa') || q.includes('vendi') || q.includes('faturament')) {
      return { html: 'O módulo Financeiro está em <strong>Financeiro</strong> no menu lateral. Em breve trarei análises automáticas (faturamento, margem por SKU, projeções). 💰' };
    }

    // ATA
    if (q.includes('ata') || q.includes('reuni')) {
      return { html: 'Para criar uma ATA: vá em <strong>ATAs → Nova ATA</strong>. Cole as decisões da reunião e eu transformo em tarefas automaticamente. 📑' };
    }

    // Padrão — fallback
    return { html: `Hmm, ainda estou aprendendo a responder isso. Tente algo como:<br><br>
      • <em>"Quantas tarefas concluí esta semana?"</em><br>
      • <em>"O que devo fazer hoje?"</em><br>
      • <em>"Há tarefas atrasadas?"</em><br>
      • <em>"Resumo do mês"</em>` };
  }

  async function sendUser(text) {
    if (!text) return;
    const userMsg = { from: 'user', text };
    history.push(userMsg);
    renderMessage(userMsg);
    save();

    // typing
    const typing = document.createElement('div');
    typing.className = 'tai-msg bot';
    typing.innerHTML = `<span class="spinner-dot"></span> <span class="spinner-dot" style="animation-delay:.2s"></span> <span class="spinner-dot" style="animation-delay:.4s"></span>`;
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    try {
      const reply = await respond(text);
      typing.remove();
      const botMsg = { from: 'bot', html: reply.html };
      history.push(botMsg);
      renderMessage(botMsg);
      save();
    } catch (e) {
      typing.remove();
      renderMessage({ from: 'bot', html: '⚠️ Tive um problema para processar. Tente de novo.' });
    }
  }

  function build() {
    fab = document.createElement('button');
    fab.className = 'tai-fab';
    fab.title = 'Taoca IA';
    fab.innerHTML = `<span>${FAB_ICON}</span><span class="pulse"></span>`;
    document.body.appendChild(fab);

    panel = document.createElement('div');
    panel.className = 'tai-panel';
    panel.innerHTML = `
      <div class="tai-header">
        <div class="avatar">🍄</div>
        <div class="info">
          <div class="name">Taoca IA</div>
          <div class="status">Online · sua assistente de gestão</div>
        </div>
        <button class="close-btn" id="tai-close" title="Fechar">✕</button>
      </div>
      <div class="tai-body" id="tai-body"></div>
      <form class="tai-footer" id="tai-form">
        <input type="text" class="input" id="tai-input" placeholder="Pergunte algo…" autocomplete="off" />
        <button type="submit" class="send-btn" title="Enviar">➤</button>
      </form>
    `;
    document.body.appendChild(panel);

    body = panel.querySelector('#tai-body');
    input = panel.querySelector('#tai-input');

    fab.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
    panel.querySelector('#tai-close').addEventListener('click', close);
    panel.querySelector('#tai-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) return;
      input.value = '';
      sendUser(v);
    });
  }

  function greet() {
    const user = (window.TaocaShell && window.TaocaShell.getCurrentUser && window.TaocaShell.getCurrentUser()) || 'amigo(a)';
    const greet = new Date().getHours() < 12 ? 'Bom dia' : (new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite');
    renderMessage({ from: 'bot', html: `${greet}, <strong>${escapeHtml(user)}</strong>! 🍄<br>Sou a <strong>Taoca IA</strong>, sua copiloto de gestão. Posso analisar tarefas, produção, clientes e estratégia.` });
    renderSuggestions();
  }

  function open() {
    panel.classList.add('open');
    if (!history.length) greet();
    setTimeout(() => input.focus(), 100);
  }
  function close() { panel.classList.remove('open'); }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => { build(); load(); history.forEach(renderMessage); });
    } else {
      build(); load(); history.forEach(renderMessage);
    }
  }

  window.TaocaAI = { open, close, sendUser };
  init();
})();

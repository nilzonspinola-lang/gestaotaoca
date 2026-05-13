/* ============================================================
   TAOCA DATA — camada de dados local (localStorage)
   API: TaocaData.list(table), .get(table, id), .create(table, obj),
        .update(table, id, patch), .remove(table, id), .seedIfEmpty()
   ============================================================ */
(function () {
  const APP_VERSION = '0.7.0';
  const PREFIX = 'taoca:';
  const SCHEMAS = ['products', 'customers', 'cost_centers', 'sales', 'expenses', 'production', 'tasks', 'users', 'suppliers', 'rooms', 'production_cycles'];

  // Constantes de produção
  const CBS_RATIO = 4;         // 1 kg de cogumelo colhido → 4 kg de CBS
  const CYCLE_DAYS = 30;       // Ciclo médio de produção (inoculação → colheita)
  const ROOM_COUNT = 3;

  function key(table) { return PREFIX + table; }

  function readAll(table) {
    try {
      const raw = localStorage.getItem(key(table));
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function writeAll(table, arr) {
    try { localStorage.setItem(key(table), JSON.stringify(arr)); } catch (e) {}
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ----- Auth helpers -----
  // Hash leve (não é segurança real — apenas evita senha em texto puro no localStorage).
  // Quando migrarmos para Supabase, substituiremos por bcrypt server-side.
  function hashPassword(pwd) {
    const SALT = 'taoca-v1::';
    const s = SALT + String(pwd || '');
    let h1 = 0x811c9dc5 | 0, h2 = 0xdeadbeef | 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x01000193);
      h2 = Math.imul(h2 ^ c, 0x85ebca6b);
    }
    const hex = (n) => ('00000000' + (n >>> 0).toString(16)).slice(-8);
    return 'h1::' + hex(h1) + hex(h2);
  }
  function verifyPassword(pwd, hash) {
    return hashPassword(pwd) === String(hash || '');
  }
  function findUserByUsername(username) {
    const u = String(username || '').trim().toLowerCase();
    if (!u) return null;
    return readAll('users').find(r => String(r.username || '').toLowerCase() === u) || null;
  }
  function authenticate(username, password) {
    const user = findUserByUsername(username);
    if (!user) return { ok: false, error: 'invalid' };
    if (user.active === false) return { ok: false, error: 'inactive' };
    if (!verifyPassword(password, user.password)) return { ok: false, error: 'invalid' };
    return {
      ok: true,
      user: { id: user.id, username: user.username, name: user.name, role: user.role || 'user' },
    };
  }

  function list(table, filterFn) {
    const arr = readAll(table);
    return filterFn ? arr.filter(filterFn) : arr;
  }
  function get(table, id) {
    return readAll(table).find(r => r.id === id) || null;
  }
  function create(table, obj) {
    const arr = readAll(table);
    const rec = Object.assign({}, obj, {
      id: obj.id || uid(),
      created_at: obj.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    arr.push(rec);
    writeAll(table, arr);
    return rec;
  }
  function update(table, id, patch) {
    const arr = readAll(table);
    const i = arr.findIndex(r => r.id === id);
    if (i < 0) return null;
    arr[i] = Object.assign({}, arr[i], patch, { updated_at: new Date().toISOString() });
    writeAll(table, arr);
    return arr[i];
  }
  function remove(table, id) {
    const arr = readAll(table).filter(r => r.id !== id);
    writeAll(table, arr);
    return true;
  }
  function clearAll() {
    SCHEMAS.forEach(t => { try { localStorage.removeItem(key(t)); } catch (e) {} });
    // Também limpa as flags de seed, para que o próximo carregamento re-semeie do zero.
    try {
      Object.keys(localStorage)
        .filter(k => k.indexOf(PREFIX + 'seed:') === 0)
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }

  // ----- Controle de seed -----
  // Cada bloco do seed marca uma flag "já rodei". Se o usuário apagar tudo manualmente
  // depois, NÃO re-semeamos — respeitamos a vontade do usuário.
  function seedKey(name) { return PREFIX + 'seed:' + name; }
  function seedDone(name) {
    try { return localStorage.getItem(seedKey(name)) === '1'; } catch (e) { return false; }
  }
  function markSeed(name) {
    try { localStorage.setItem(seedKey(name), '1'); } catch (e) {}
  }
  function shouldSeed(name, table) {
    // Só popula se: (1) ainda não rodou esse seed E (2) a tabela está vazia.
    if (seedDone(name)) return false;
    if (readAll(table).length > 0) {
      // Tabela já tem dados (pode ter vindo de versão anterior) — marca como feito e não toca.
      markSeed(name);
      return false;
    }
    return true;
  }

  function seedIfEmpty() {
    // ----- Produtos -----
    if (shouldSeed('products', 'products')) {
      const products = [
        { id: 'p-par120',  sku: 'PAR-120',  name: 'Cogumelo Paris Fresco — Bandeja 120g',  category: 'Fresco',     unit: 'bandeja', weight_g: 120,  price: 5.00,  active: true },
        { id: 'p-par200',  sku: 'PAR-200',  name: 'Cogumelo Paris Fresco — Bandeja 200g',  category: 'Fresco',     unit: 'bandeja', weight_g: 200,  price: 7.00,  active: true },
        { id: 'p-par500',  sku: 'PAR-500',  name: 'Cogumelo Paris Fresco — Saco 500g',     category: 'Fresco',     unit: 'saco',    weight_g: 500,  price: 17.50, active: true },
        { id: 'p-par1000', sku: 'PAR-1000', name: 'Cogumelo Paris Fresco — Saco 1kg',      category: 'Fresco',     unit: 'saco',    weight_g: 1000, price: 35.00, active: true },
        { id: 'p-cbsgr',   sku: 'CBS-GR',   name: 'CBS — Condicionador Biológico de Solo (granel)', category: 'Subproduto', unit: 'kg', weight_g: 1000, price: 2.00, unit_cost: 1.00, active: true },
      ];
      products.forEach(p => create('products', Object.assign({ created_at: new Date().toISOString() }, p)));
      markSeed('products');
    }

    // ----- Centros de custo -----
    if (shouldSeed('cost_centers', 'cost_centers')) {
      const centers = [
        { id: 'cc-mo',    name: 'Mão de obra (ajudantes)', type: 'fixo',     description: '3 ajudantes × 2 períodos' },
        { id: 'cc-comp',  name: 'Composto / Substrato',    type: 'variavel', description: '~9.000 kg/mês a R$ 0,85/kg' },
        { id: 'cc-energ', name: 'Energia elétrica',        type: 'fixo',     description: '~4.000 kWh/mês' },
        { id: 'cc-emb',   name: 'Embalagem',               type: 'variavel', description: 'Bandejas, sacos, etiquetas' },
        { id: 'cc-trans', name: 'Transporte / Frete',      type: 'variavel', description: 'Entregas a clientes' },
        { id: 'cc-mkt',   name: 'Marketing',               type: 'variavel', description: 'Divulgação, redes sociais' },
        { id: 'cc-imp',   name: 'Impostos e taxas',        type: 'variavel', description: 'Tributação sobre vendas' },
        { id: 'cc-out',   name: 'Outros',                  type: 'variavel', description: '' },
      ];
      centers.forEach(c => create('cost_centers', Object.assign({ created_at: new Date().toISOString() }, c)));
      markSeed('cost_centers');
    }

    // ----- Despesas -----
    // ⚠️ NÃO há mais seed de despesas. O usuário cadastra suas próprias despesas
    // em Financeiro → "+ Nova despesa" ou usa "Replicar fixos" do mês anterior.
    // (Os exemplos antigos — Mão de obra, Composto, Energia — foram removidos.)
    markSeed('expenses'); // marca como "já feito" para garantir que nunca tente popular

    // ----- Produção mensal base -----
    if (shouldSeed('production', 'production')) {
      const m = new Date().toISOString().slice(0, 7);
      create('production', {
        month: m,
        kg_cogumelo: 2250,
        kg_cbs: 0,
        notes: 'Capacidade de referência conforme planilha de custos',
      });
      markSeed('production');
    }

    // ----- Clientes — apenas se vazio, semeia 4 exemplos por segmento -----
    if (shouldSeed('customers', 'customers')) {
      const seedCli = [
        { name: 'Hotel Exemplo (excluir)',         segment: 'Hoteis',         contact: '', doc: '', payment_terms: '30 dias', notes: 'Cliente de exemplo — pode editar/excluir' },
        { name: 'Supermercado Exemplo (excluir)',  segment: 'Supermercados',  contact: '', doc: '', payment_terms: '21 dias', notes: 'Cliente de exemplo — pode editar/excluir' },
        { name: 'Restaurante Exemplo (excluir)',   segment: 'Restaurantes',   contact: '', doc: '', payment_terms: 'À vista',  notes: 'Cliente de exemplo — pode editar/excluir' },
        { name: 'Distribuidora Exemplo (excluir)', segment: 'Distribuidoras', contact: '', doc: '', payment_terms: '30 dias', notes: 'Cliente de exemplo — pode editar/excluir' },
      ];
      seedCli.forEach(c => create('customers', c));
      markSeed('customers');
    }

    // ----- Usuários — seed dos sócios como administradores -----
    if (shouldSeed('users', 'users')) {
      const seedUsers = [
        { id: 'u-nilzon', username: 'nilzon', name: 'Nílzon',  password: hashPassword('taoca@2025'), role: 'admin', active: true },
        { id: 'u-marco',  username: 'marco',  name: 'Marco',   password: hashPassword('taoca@2025'), role: 'admin', active: true },
      ];
      seedUsers.forEach(u => create('users', Object.assign({ created_at: new Date().toISOString() }, u)));
      markSeed('users');
    }

    // ----- Fornecedores — seed inicial (3 exemplos para edição) -----
    if (shouldSeed('suppliers', 'suppliers')) {
      const seedSup = [
        { name: 'Fornecedor de Composto (editar)', category: 'Composto',  doc: '', contact: '', payment_terms: '30 dias', notes: 'Substrato para cultivo de cogumelos' },
        { name: 'Fornecedor de Embalagem (editar)', category: 'Embalagem', doc: '', contact: '', payment_terms: 'À vista',  notes: 'Bandejas, sacos, etiquetas' },
        { name: 'Concessionária de Energia (editar)', category: 'Energia', doc: '', contact: '', payment_terms: '30 dias', notes: '' },
      ];
      seedSup.forEach(s => create('suppliers', s));
      markSeed('suppliers');
    }

    // ----- Salas de produção — 3 salas, cada uma com 1/3 da capacidade total -----
    if (shouldSeed('rooms', 'rooms')) {
      // Capacidade total mensal (kg) — lê do registro de produção se houver, senão usa 2250
      const prod = readAll('production');
      const totalCap = prod.length && prod[0].kg_cogumelo ? prod[0].kg_cogumelo : 2250;
      const perRoom = Math.round((totalCap / ROOM_COUNT) * 100) / 100;
      const seedRooms = [
        { id: 'r-1', name: 'Sala 1', mushroom_type: 'Cogumelo Paris', capacity_kg_month: perRoom, product_id: 'p-par200', notes: 'Foco inicial: Cogumelo Paris', active: true },
        { id: 'r-2', name: 'Sala 2', mushroom_type: 'Cogumelo Paris', capacity_kg_month: perRoom, product_id: 'p-par200', notes: 'Foco inicial: Cogumelo Paris', active: true },
        { id: 'r-3', name: 'Sala 3', mushroom_type: 'Cogumelo Paris', capacity_kg_month: perRoom, product_id: 'p-par200', notes: 'Foco inicial: Cogumelo Paris', active: true },
      ];
      seedRooms.forEach(r => create('rooms', Object.assign({ created_at: new Date().toISOString() }, r)));
      markSeed('rooms');
    }

    // production_cycles fica vazio no seed — usuário cria os ciclos reais.

    // ----- Tarefas — seed das 10 tarefas iniciais -----
    if (shouldSeed('tasks', 'tasks')) {
      const seedTasks = [
        { task_number: 1,  category: 'juridico',     title: 'Elaborar contrato de compra e venda da Fazenda Monteiro & Spínola', description: 'Redigir e revisar o contrato principal com cláusulas, condições e validações necessárias.', status: 'concluida', completed_by: 'Nilzon e Marco',  completed_at: '29/04/2026 16:34', completed_at_iso: '2026-04-29T16:34:00', due_date: '', created_by: 'Nilzon' },
        { task_number: 2,  category: 'institucional', title: 'Informar a Cláudio o capital social da empresa TAOCA',           description: 'Consolidar o valor aprovado e comunicar formalmente a informação societária.',          status: 'concluida', completed_by: 'Marco',           completed_at: '30/04/2026 10:39', completed_at_iso: '2026-04-30T10:39:00', due_date: '', created_by: 'Nilzon' },
        { task_number: 3,  category: 'institucional', title: 'Alinhar com Feijó o endereço em Mata de São João',                description: 'Confirmar o endereço fiscal correto para abertura do CNPJ sem retrabalho.',              status: 'pendente',  completed_by: '',                 completed_at: '',                 completed_at_iso: '',                  due_date: '2026-05-01', created_by: 'Nilzon' },
        { task_number: 4,  category: 'institucional', title: 'Definir CNAE',                                                      description: 'Escolher o enquadramento mais adequado às atividades principais e secundárias.',         status: 'concluida', completed_by: 'Marco e Nilzon',   completed_at: '30/04/2026 10:39', completed_at_iso: '2026-04-30T10:39:00', due_date: '', created_by: 'Nilzon' },
        { task_number: 5,  category: 'juridico',     title: 'Finalizar Contrato Meridiano em nome de Marco e Nilzon',           description: 'Fechar a formalização final do contrato com os nomes corretos e pendências ajustadas.',  status: 'concluida', completed_by: 'Nilzon',          completed_at: '30/04/2026 14:16', completed_at_iso: '2026-04-30T14:16:00', due_date: '', created_by: 'Nilzon' },
        { task_number: 6,  category: 'consultoria',  title: 'Listar perguntas para consultoria Carlos ABF',                      description: 'Organizar dúvidas prioritárias para aproveitar melhor a reunião de consultoria.',         status: 'concluida', completed_by: 'Marco e Nilzon',   completed_at: '29/04/2026 16:47', completed_at_iso: '2026-04-29T16:47:00', due_date: '', created_by: 'Nilzon' },
        { task_number: 7,  category: 'outras',       title: 'Agendar VAP na Fazenda Monteiro & Spínola',                         description: 'Definir contato, data e alinhamento prático da visita na fazenda.',                       status: 'pendente',  completed_by: '',                 completed_at: '',                 completed_at_iso: '',                  due_date: '2026-05-13', created_by: 'Nilzon' },
        { task_number: 8,  category: 'fiscal',       title: 'Finalizar declaração do IR',                                        description: 'Reunir documentos, revisar dados e concluir o envio da declaração.',                      status: 'pendente',  completed_by: '',                 completed_at: '',                 completed_at_iso: '',                  due_date: '2026-05-07', created_by: 'Nilzon' },
        { task_number: 9,  category: 'institucional', title: 'Fazer reserva de Hotel',                                            description: 'Naturatech',                                                                              status: 'concluida', completed_by: 'Marco',           completed_at: '30/04/2026 14:27', completed_at_iso: '2026-04-30T14:27:00', due_date: '', created_by: 'Nilzon' },
        { task_number: 10, category: 'fiscal',       title: 'Emitir Nota Fiscal em nome de Adriano Feijó',                       description: '',                                                                                        status: 'concluida', completed_by: 'Nilzon',          completed_at: '30/04/2026 11:38', completed_at_iso: '2026-04-30T11:38:00', due_date: '', created_by: 'Nilzon' },
      ];
      seedTasks.forEach(t => create('tasks', t));
      markSeed('tasks');
    }
  }

  // ----- Constantes úteis -----
  const SEGMENTS = ['Hoteis', 'Supermercados', 'Restaurantes', 'Distribuidoras'];
  const SEGMENT_LABEL = {
    Hoteis: 'Hotéis',
    Supermercados: 'Supermercados',
    Restaurantes: 'Restaurantes',
    Distribuidoras: 'Distribuidoras',
  };

  // ----- Helpers de cálculo -----
  function parseISO(s) {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  function monthKey(d) { return d.toISOString().slice(0, 7); }
  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999); }

  function fmtBRL(v) {
    if (v == null || isNaN(v)) v = 0;
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  }
  function fmtNum(v, d) {
    if (v == null || isNaN(v)) v = 0;
    return v.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  }
  function fmtKg(v) { return fmtNum(v, 2) + ' kg'; }
  function fmtPct(v) {
    if (!isFinite(v)) return '—';
    return (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  }

  // ----- Helpers de produção -----
  // Status de ciclo: 'planejado' (inoculado, ainda não colhido) | 'colhido' (colheita registrada) | 'descartado'
  function cycleCBS(cycle) {
    const harvested = Number(cycle.kg_harvested) || 0;
    if (cycle.kg_cbs != null) return Number(cycle.kg_cbs) || 0;
    return harvested * CBS_RATIO;
  }
  function avgPricePerKg() {
    // preço médio /kg ponderado pelas vendas; se não houver venda, usa média simples dos SKUs Paris (excluindo CBS)
    const sales = readAll('sales');
    if (sales.length) {
      let totRev = 0, totKg = 0;
      sales.forEach(s => {
        totRev += Number(s.total) || 0;
        totKg += Number(s.kg) || 0;
      });
      if (totKg > 0) return totRev / totKg;
    }
    const products = readAll('products').filter(p => p.category === 'Fresco' && p.weight_g > 0);
    if (!products.length) return 0;
    const sum = products.reduce((acc, p) => acc + ((p.price || 0) / (p.weight_g / 1000)), 0);
    return sum / products.length;
  }
  function expectedHarvestDate(inoculatedISO, days) {
    const d = parseISO(inoculatedISO);
    if (!d) return null;
    const out = new Date(d);
    out.setDate(out.getDate() + (Number(days) || CYCLE_DAYS));
    return out;
  }
  function forecastNext30Days() {
    // Soma kg previstos para ciclos 'planejado' cuja data prevista de colheita cai nos próximos 30 dias
    const now = new Date();
    const limit = new Date(); limit.setDate(limit.getDate() + 30);
    const cycles = readAll('production_cycles').filter(c => c.status === 'planejado' || !c.status);
    let kg = 0;
    cycles.forEach(c => {
      const exp = c.expected_harvest_date ? parseISO(c.expected_harvest_date) : expectedHarvestDate(c.inoculated_at, c.cycle_days);
      if (!exp) return;
      if (exp >= now && exp <= limit) kg += Number(c.kg_expected) || 0;
    });
    return { kg, value: kg * avgPricePerKg() };
  }
  function harvestedThisMonth() {
    const m = monthKey(new Date());
    let kg = 0, cbs = 0;
    readAll('production_cycles').forEach(c => {
      if (c.status !== 'colhido' || !c.harvested_at) return;
      if (String(c.harvested_at).slice(0, 7) !== m) return;
      kg += Number(c.kg_harvested) || 0;
      cbs += cycleCBS(c);
    });
    return { kg, cbs };
  }
  function harvestedByRoom(roomId, monthISO) {
    let kg = 0, cbs = 0, count = 0;
    readAll('production_cycles').forEach(c => {
      if (c.room_id !== roomId) return;
      if (c.status !== 'colhido') return;
      if (monthISO && String(c.harvested_at || '').slice(0, 7) !== monthISO) return;
      kg += Number(c.kg_harvested) || 0;
      cbs += cycleCBS(c);
      count++;
    });
    return { kg, cbs, count };
  }

  window.TaocaData = {
    list, get, create, update, remove, clearAll, seedIfEmpty,
    SEGMENTS, SEGMENT_LABEL,
    CBS_RATIO, CYCLE_DAYS, ROOM_COUNT,
    fmtBRL, fmtNum, fmtKg, fmtPct, parseISO, monthKey, startOfMonth, endOfMonth,
    // Auth
    hashPassword, verifyPassword, authenticate, findUserByUsername,
    // Produção
    cycleCBS, avgPricePerKg, expectedHarvestDate, forecastNext30Days,
    harvestedThisMonth, harvestedByRoom,
  };

  // Auto-seed na primeira carga
  try { seedIfEmpty(); } catch (e) { console.warn('seed', e); }
})();

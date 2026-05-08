/* ============================================================
   TAOCA DATA — camada de dados local (localStorage)
   API: TaocaData.list(table), .get(table, id), .create(table, obj),
        .update(table, id, patch), .remove(table, id), .seedIfEmpty()
   ============================================================ */
(function () {
  const PREFIX = 'taoca:';
  const SCHEMAS = ['products', 'customers', 'cost_centers', 'sales', 'expenses', 'production'];

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
  }

  function seedIfEmpty() {
    // ----- Produtos -----
    if (readAll('products').length === 0) {
      const products = [
        { id: 'p-par120',  sku: 'PAR-120',  name: 'Cogumelo Paris Fresco — Bandeja 120g',  category: 'Fresco',     unit: 'bandeja', weight_g: 120,  price: 5.00,  active: true },
        { id: 'p-par200',  sku: 'PAR-200',  name: 'Cogumelo Paris Fresco — Bandeja 200g',  category: 'Fresco',     unit: 'bandeja', weight_g: 200,  price: 7.00,  active: true },
        { id: 'p-par500',  sku: 'PAR-500',  name: 'Cogumelo Paris Fresco — Saco 500g',     category: 'Fresco',     unit: 'saco',    weight_g: 500,  price: 17.50, active: true },
        { id: 'p-par1000', sku: 'PAR-1000', name: 'Cogumelo Paris Fresco — Saco 1kg',      category: 'Fresco',     unit: 'saco',    weight_g: 1000, price: 35.00, active: true },
        { id: 'p-cbsgr',   sku: 'CBS-GR',   name: 'CBS — Condicionador Biológico de Solo (granel)', category: 'Subproduto', unit: 'kg', weight_g: 1000, price: 2.00, unit_cost: 1.00, active: true },
      ];
      products.forEach(p => create('products', Object.assign({ created_at: new Date().toISOString() }, p)));
    }

    // ----- Centros de custo -----
    if (readAll('cost_centers').length === 0) {
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
    }

    // ----- Despesas fixas mensais (mês corrente) -----
    if (readAll('expenses').length === 0) {
      const today = new Date();
      const m = today.toISOString().slice(0, 7); // YYYY-MM
      const day = '15';
      const date = `${m}-${day}`;
      const seedExp = [
        { cost_center_id: 'cc-mo',    description: '3 ajudantes × 2 períodos', value: 12941.46, recurrent: true,  date },
        { cost_center_id: 'cc-comp',  description: '9.000 kg × R$ 0,85',       value: 7650.00,  recurrent: true,  date },
        { cost_center_id: 'cc-energ', description: '4.000 kWh × R$ 0,85',      value: 3400.00,  recurrent: true,  date },
      ];
      seedExp.forEach(e => create('expenses', e));
    }

    // ----- Produção mensal base -----
    if (readAll('production').length === 0) {
      const m = new Date().toISOString().slice(0, 7);
      create('production', {
        month: m,
        kg_cogumelo: 2250,
        kg_cbs: 0,
        notes: 'Capacidade de referência conforme planilha de custos',
      });
    }

    // ----- Clientes — apenas se vazio, semeia 4 exemplos por segmento -----
    if (readAll('customers').length === 0) {
      const seedCli = [
        { name: 'Hotel Exemplo (excluir)',         segment: 'Hoteis',         contact: '', doc: '', payment_terms: '30 dias', notes: 'Cliente de exemplo — pode editar/excluir' },
        { name: 'Supermercado Exemplo (excluir)',  segment: 'Supermercados',  contact: '', doc: '', payment_terms: '21 dias', notes: 'Cliente de exemplo — pode editar/excluir' },
        { name: 'Restaurante Exemplo (excluir)',   segment: 'Restaurantes',   contact: '', doc: '', payment_terms: 'À vista',  notes: 'Cliente de exemplo — pode editar/excluir' },
        { name: 'Distribuidora Exemplo (excluir)', segment: 'Distribuidoras', contact: '', doc: '', payment_terms: '30 dias', notes: 'Cliente de exemplo — pode editar/excluir' },
      ];
      seedCli.forEach(c => create('customers', c));
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

  window.TaocaData = {
    list, get, create, update, remove, clearAll, seedIfEmpty,
    SEGMENTS, SEGMENT_LABEL,
    fmtBRL, fmtNum, fmtKg, fmtPct, parseISO, monthKey, startOfMonth, endOfMonth,
  };

  // Auto-seed na primeira carga
  try { seedIfEmpty(); } catch (e) { console.warn('seed', e); }
})();

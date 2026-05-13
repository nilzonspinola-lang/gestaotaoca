# 5. Modelo de Dados

> Todas as tabelas vivem no `localStorage` sob a chave `taoca-os-db-v1`,
> acessadas através da API `TaocaData`. Cada registro tem `id` (UUID),
> `created_at`, `updated_at` e `deleted` (soft delete).

---

## 📊 Tabelas

### `users`
```ts
{
  id: string (uuid),
  username: string,
  name: string,
  password_hash: string,
  role: 'admin' | 'operator',
  active: boolean,
  last_login_at: ISO string | null,
  created_at: ISO string,
  updated_at: ISO string,
  deleted: false
}
```

### `tasks`
```ts
{
  id, task_number: int,
  title: string,
  description: string,
  category: 'Comercial' | 'Produção' | 'Financeiro' | 'Administrativo' | 'Marketing',
  status: 'a-fazer' | 'em-andamento' | 'em-revisao' | 'concluida',
  assignee: string,
  due_date: 'YYYY-MM-DD',
  completed_at_iso: ISO string | null,
  created_at, updated_at, deleted
}
```

### `customers`
```ts
{
  id, name, email, phone,
  segment: 'Restaurante' | 'Mercado' | 'Direto' | 'Distribuidor' | 'Outro',
  status: 'ativo' | 'inativo',
  last_contact_at: ISO string,
  notes: string,
  created_at, updated_at, deleted
}
```

### `products`
```ts
{
  id, name, sku,
  category_id: string (ref → categories.id),
  type: 'Fresco' | 'Processado' | 'CBS' | 'Outro',
  price_per_kg: number,
  unit_cost: number,
  active: boolean,
  created_at, updated_at, deleted
}
```

### `categories`
```ts
{
  id, name, description,
  created_at, updated_at, deleted
}
```

### `cost_centers`
```ts
{
  id, name, description,
  type: 'Fixo' | 'Variável',
  created_at, updated_at, deleted
}
```

### `suppliers` ⭐ (novo)
```ts
{
  id, name,
  category: 'Composto' | 'Embalagem' | 'Energia' | 'Transporte' | 'Marketing' | 'Servicos' | 'Outros',
  contact_name, phone, email, document (CNPJ),
  cost_center_id: string | null (ref → cost_centers.id),
  notes: string,
  created_at, updated_at, deleted
}
```

### `rooms` ⭐ (novo)
```ts
{
  id, name: 'Sala 1' | 'Sala 2' | 'Sala 3',
  mushroom_type: string (default 'Cogumelo Paris'),
  product_id: string | null (ref → products.id),
  capacity_kg_month: number (default 750),
  notes: string,
  created_at, updated_at, deleted
}
```

### `production_cycles` ⭐ (novo)
```ts
{
  id,
  room_id: string (ref → rooms.id),
  mushroom_type: string,
  inoculated_at: 'YYYY-MM-DD',
  expected_harvest_date: 'YYYY-MM-DD',  // = inoculated_at + 30d
  kg_expected: number,
  kg_harvested: number | null,
  kg_cbs: number | null,                 // = kg_harvested × 4 (auto)
  harvested_at: 'YYYY-MM-DD' | null,
  status: 'plan' | 'late' | 'done' | 'disc',
  notes: string,
  created_at, updated_at, deleted
}
```

### `sales`
```ts
{
  id, sale_number: int,
  customer_id, product_id,
  quantity: number,
  unit_price: number,
  total: number,
  sale_date: 'YYYY-MM-DD',
  segment: string,
  invoice_number: string,
  payment_method: string,
  notes: string,
  created_at, updated_at, deleted
}
```

### `expenses`
```ts
{
  id, description,
  amount: number,
  type: 'Fixo' | 'Variável',
  cost_center_id: string | null,
  supplier_id: string | null,
  expense_date: 'YYYY-MM-DD',
  recurring: boolean,
  notes: string,
  created_at, updated_at, deleted
}
```

### `atas`
```ts
{
  id, ata_number,
  date, participants: string[],
  agenda, decisions,
  task_ids: string[] (refs → tasks.id),
  created_at, updated_at, deleted
}
```

---

## 🔗 Relacionamentos principais

```
suppliers ─→ cost_centers (opcional)
rooms     ─→ products      (opcional, vinculação de SKU principal)
production_cycles ─→ rooms (obrigatório)
sales     ─→ customers     (obrigatório)
sales     ─→ products      (obrigatório)
expenses  ─→ cost_centers  (opcional)
expenses  ─→ suppliers     (opcional)
atas      ─→ tasks[]       (n-n)
```

---

## 💾 Persistência

- **Local (MVP):** tudo em `localStorage.taoca-os-db-v1`
- **Tamanho típico:** < 1 MB (limite do navegador é ~5-10 MB)
- **Backup manual:** exportar JSON via console (`TaocaData.exportAll()`)
- **Backup futuro (Supabase):** automático na nuvem

---

## 🌱 Seeds (dados iniciais)

Na primeira execução, o sistema cria:
- 3 usuários (nilzon, marco, operador)
- 10 tarefas iniciais
- 3 salas (Sala 1, 2, 3 — todas Cogumelo Paris, 750 kg/mês)
- 3 fornecedores exemplo (Composto, Embalagem, Energia)
- Produtos base (Cogumelo Paris Fresco, CBS)
- Categorias e Centros de Custo padrão
- Despesas fixas exemplo (Mão de obra, Energia, Composto)

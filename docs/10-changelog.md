# 10. Changelog

> Histórico de entregas do Taoca OS, ordenado da mais recente para a mais antiga.

---

## v0.6.0 — Login mais clean (13/05/2026)

**Commit:** `5b9d666`

- Removidos emojis decorativos do login (🌿, 👤, 🔒, ⚠️)
- Removidas folhas/cogumelo SVG do fundo
- Ícone de mostrar/ocultar senha: emoji → SVG monocromático
- Botão "Entrar" simplificado (sem gradiente nem shadow forte)
- Tipografia mais discreta, card mais compacto

---

## v0.5.1 — Botão Entrar simplificado (13/05/2026)

**Commit:** `93fb866`

- Texto do botão: "Entrar no Taoca OS" → "Entrar"

---

## v0.5.0 — Robô flutuante arrastável (13/05/2026)

**Commit:** `6c1c325`

- FAB do assistente Taoca IA agora é arrastável (mouse + touch)
- Posição salva em localStorage (persiste entre sessões)
- Threshold de 6px diferencia clique de arrasto
- Painel de chat se reposiciona automaticamente ao lado do FAB
- Suporte completo a PointerEvents + fallback mouse/touch
- Cursor grab/grabbing + feedback visual durante arrasto

---

## v0.4.0 — Fornecedores + Produção 3 salas + Estratégico (13/05/2026)

**Commit:** `14143b0`

### Entrega 1 — Fornecedores em Cadastros
- Tabela `suppliers` em TaocaData com 7 categorias
- Aba "Fornecedores" em cadastros.html com CRUD
- Seed: 3 fornecedores exemplo (Composto, Embalagem, Energia)
- Vínculo opcional com centro de custo

### Entrega 2 — Produção reformulada
- Tabelas `rooms` e `production_cycles` em TaocaData
- Constantes `CBS_RATIO=4`, `CYCLE_DAYS=30`, `ROOM_COUNT=3`
- Seed: 3 salas (Sala 1, 2, 3) com Cogumelo Paris, 750 kg/mês cada
- Helpers: `cycleCBS`, `forecastNext30Days`, `harvestedThisMonth`, etc
- producao.html reformulado: KPIs, 3 cards de salas, tabela de ciclos
- Modais inoculação/colheita com auto-cálculo de CBS (4× cogumelo)

### Entrega 3 — Estratégico
- Renomeado "Estratégia" → "Estratégico" no sidebar
- estrategia.html reformulado com seletor de período, 8 KPIs
- CAC automático (marketing ÷ novos clientes)
- Painel Margem por segmento + Quadrante Faturamento × Margem
- Receita por sala, Recorrência, Composição de custos
- Box de insights automáticos

---

## v0.3.0 — Gestão de usuários (anterior)

**Commit:** `42708ae`

- Sistema de papéis Administrador / Operador
- Tela de gestão de usuários no Cadastros
- Guards: não auto-rebaixar, não remover último admin, etc
- Login refatorado para usar `TaocaData.authenticate`

---

## v0.2.0 — Tarefas migradas para localStorage (anterior)

**Commit:** `29b1d63`

- Migração do módulo Tarefas de `tables/tasks` (backend velho) para `TaocaData`
- 10 tarefas iniciais seeded
- Listener de visibilidade e storage (sincronização entre abas)
- Removido polling de 8 segundos

---

## v0.1.0 — MVP inicial

- 13 páginas HTML criadas
- Design system Taoca implementado
- Sidebar shell unificado
- Módulos básicos: Dashboard, Tarefas, Vendas, Financeiro, Produção,
  Clientes, Cadastros, ATAs, Estratégia
- Assistente Taoca IA com heurísticas locais
- Autenticação básica

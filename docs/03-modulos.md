# 3. Módulos detalhados

## 🏠 1. Dashboard (`index.html`)

Visão executiva inicial após o login.

**Conteúdo:**
- KPIs do dia (vendas, tarefas, alertas)
- Cards de acesso rápido aos módulos
- Resumo das tarefas pendentes
- Indicadores de produção

---

## ✅ 2. Tarefas (`tarefas.html`)

Kanban completo com 4 colunas: **A fazer** → **Em andamento** → **Em revisão** → **Concluída**.

**Recursos:**
- Categorias: Comercial, Produção, Financeiro, Administrativo, Marketing
- Prazos (data limite) com destaque visual de atraso
- 10 tarefas iniciais seeded
- Drag-and-drop entre colunas
- Edição inline e modal completa
- Filtros por categoria e responsável

---

## 💰 3. Vendas (`vendas.html`)

Lançamento de vendas individuais.

**Campos:**
- Cliente (vinculado ao cadastro)
- Produto / SKU
- Quantidade (kg ou unidade)
- Preço unitário e total
- Data, NF, segmento
- Forma de pagamento

**KPIs:** ticket médio, faturamento do período, ranking de clientes.

---

## 🧪 4. Produção (`producao.html`) — **reformulado**

> ⭐ Módulo central da operação. Trata o pós-colheita e a geração de CBS.

### 4.1 Estrutura
- **3 salas físicas:** Sala 1, Sala 2, Sala 3
- **Capacidade:** 750 kg/mês cada (total 2.250 kg/mês)
- **Tipo inicial:** Cogumelo Paris (todas as 3)

### 4.2 KPIs (4 cards)
1. **Colheita do mês** (kg)
2. **CBS gerado** (kg)
3. **Previsão 30 dias** (kg + R$)
4. **Capacidade total** (kg/mês)

### 4.3 Cards por sala
Cada sala mostra:
- Nome, tipo de cogumelo, capacidade
- Colhido no mês / CBS gerado no mês
- Ciclos ativos
- Barra de utilização da capacidade
- Botão **+ Inocular ciclo**

### 4.4 Ciclos de produção
Cada ciclo passa por:

```
[ Inoculação ]
      │
      │ +30 dias (CYCLE_DAYS, configurável)
      ▼
[ Previsão de colheita ]
      │
      │ registrar colheita real
      ▼
[ Colhido ]
      │
      │ kg × 4 (CBS_RATIO)
      ▼
[ CBS gerado automaticamente ]
```

### 4.5 Status do ciclo
- 🟢 **Em produção** (planejado, dentro do prazo)
- 🟡 **Atrasado** (passou da data prevista sem colheita)
- 🔵 **Colhido** (registrado)
- ⚫ **Descartado** (perda)

### 4.6 Constantes
| Constante | Valor | Significado |
|---|---|---|
| `CBS_RATIO` | 4 | 1 kg cogumelo → 4 kg CBS |
| `CYCLE_DAYS` | 30 | Duração padrão do ciclo |
| `ROOM_COUNT` | 3 | Número de salas |

---

## 📊 5. Financeiro (`financeiro.html`)

DRE simplificado + composição de custos.

**Seções:**
- Receitas (vendas do período)
- Custos fixos (mão de obra, energia)
- Custos variáveis (composto, embalagem)
- Margem bruta
- Resultado (lucro/prejuízo)
- Gráficos: receita × custo, evolução mensal

---

## 👥 6. Clientes (`clientes.html`)

CRM básico.

**Campos:** nome, e-mail, telefone, segmento (Restaurante, Mercado, Direto…),
status (ativo/inativo), data do último contato, observações.

---

## 📋 7. Cadastros (`cadastros.html`)

Hub de cadastros auxiliares em 4 abas:

### 7.1 Produtos
Cogumelo Paris Fresco, CBS, etc. — com preço /kg e custo unitário.

### 7.2 Categorias
Fresco, Processado, CBS, etc.

### 7.3 Fornecedores ⭐ **(novo)**
7 categorias:
- **Composto**
- **Embalagem**
- **Energia**
- **Transporte**
- **Marketing**
- **Serviços**
- **Outros**

Cada fornecedor pode ter vínculo opcional com um **Centro de Custo**.

### 7.4 Centros de Custo
Agrupadores para alocação de despesas.

---

## 📑 8. ATAs (`atas.html`)

Registro de reuniões com:
- Data, participantes, pauta
- Decisões tomadas
- Tarefas geradas (vinculadas ao módulo Tarefas)

---

## 📈 9. Estratégico (`estrategia.html`) — **reformulado**

> ⭐ Painel executivo para tomada de decisão estratégica.

### 9.1 Seletor de período
Mês atual / mês anterior / 3m / 6m / 12m / tudo.

### 9.2 KPIs gerais (8)
1. **Faturamento** do período
2. **Resultado** (com cor: verde lucro / vermelho prejuízo)
3. **Clientes ativos** (+ novos no período, % recorrência)
4. **CAC** — Custo de Aquisição (marketing ÷ novos clientes) **— automático**
5. **Ticket médio**
6. **Preço médio por kg**
7. **Custo por kg de produção**
8. **% Embalagem no custo total**

### 9.3 Painéis analíticos
- **Margem por segmento** — barras + badge verde/âmbar/vermelho
- **Quadrante Faturamento × Margem** — posicionamento estratégico
- **Receita por sala** — kg × preço médio
- **Recorrência de clientes** — total / ativos / recorrentes / novos
- **Composição de custos** — ordenada, com tipo Fixo/Variável

### 9.4 Insights automáticos
Box condicional que destaca:
- Melhor segmento (revenue × margem)
- Alerta se margem < 0
- Alerta se embalagem > 20% do custo

# 6. Regras de Negócio

> Lógicas críticas que regem cálculos automáticos do sistema.
> Toda alteração aqui exige revisão de impacto em todos os módulos afetados.

---

## 🍄 RN-01 — Conversão Cogumelo → CBS

**Regra:** Para cada **1 kg** de cogumelo colhido, são gerados **4 kg de CBS**
(composto beneficiado seco, subproduto pós-colheita).

```js
CBS_RATIO = 4
kg_cbs = kg_harvested × CBS_RATIO  // a menos que sobrescrito manualmente
```

**Onde aplica:**
- Modal de colheita em Produção (auto-preenche o campo CBS)
- KPI "CBS gerado" no Dashboard de Produção
- Função `cycleCBS(cycle)` em `taoca-data.js`

**Sobrescrita:** o usuário pode digitar manualmente um valor diferente de `kg × 4`
se a colheita gerar mais ou menos CBS que o padrão (ex: perda).

---

## 📅 RN-02 — Duração padrão do ciclo

**Regra:** Um ciclo de produção dura **30 dias** entre inoculação e colheita prevista.

```js
CYCLE_DAYS = 30
expected_harvest_date = inoculated_at + 30 dias
```

**Configurável por ciclo:** o usuário pode ajustar a duração no modal de inoculação
(ex: 28 dias, 32 dias). O default é 30.

---

## 🏭 RN-03 — Capacidade por sala

**Regra:** Capacidade mensal padrão de cada sala = **2.250 kg ÷ 3 = 750 kg/mês**.

```js
capacity_kg_month = totalCap / ROOM_COUNT  // 2.250 / 3 = 750
```

Esse valor é usado para:
- Barra de utilização (%) em cada card de sala
- Cálculo de previsão agregada de 30 dias
- Alerta visual se utilização > 90%

---

## 💸 RN-04 — CAC automático

**Regra:** Custo de Aquisição de Cliente é calculado automaticamente:

```
CAC = total gasto em Marketing no período  ÷  novos clientes no período
```

**Detalhamento:**
- "Gasto em Marketing" = soma de `expenses` com `cost_center` da categoria Marketing,
  OU `suppliers` com categoria Marketing
- "Novos clientes" = clientes com `created_at` dentro do período selecionado
- Se `novos clientes = 0`, exibe "—" em vez de divisão por zero

**Onde aplica:** KPI no painel Estratégico.

---

## 📈 RN-05 — Previsão de 30 dias (kg e R$)

**Regra:** Soma dos `kg_expected` de todos os ciclos com status `plan` (Em produção)
cuja `expected_harvest_date` esteja nos próximos 30 dias.

```js
forecast_kg = Σ kg_expected (ciclos planejados, próximos 30d)
forecast_brl = forecast_kg × avgPricePerKg()
```

**`avgPricePerKg()`:** média ponderada pelo histórico de vendas; se não houver
vendas, retorna média dos produtos do tipo Fresco.

---

## 🎯 RN-06 — Alocação de custos por segmento

**Regra:** Quando o painel Estratégico mostra "Margem por segmento", o custo total
do período é rateado proporcionalmente à receita de cada segmento:

```
custo_segmento = custo_total × (receita_segmento / receita_total)
margem_segmento = (receita_segmento − custo_segmento) / receita_segmento
```

---

## 🟢🟡🔴 RN-07 — Cores de margem

**Regra:** Badge de margem por segmento:

| Margem | Cor | Significado |
|---|---|---|
| ≥ 30% | 🟢 Verde | Excelente |
| 0% a 29% | 🟡 Âmbar | Atenção |
| < 0% | 🔴 Vermelho | Prejuízo |

---

## 📦 RN-08 — Alerta de embalagem

**Regra:** Se a despesa em embalagem (`suppliers.category = 'Embalagem'`) for
**> 20% do custo total**, o painel Estratégico exibe alerta no box de Insights.

---

## ♻️ RN-09 — Status do ciclo (transições)

```
plan ─ (passou da data prevista, sem colheita) ─→ late
plan ─ (registrar colheita)                    ─→ done
plan ─ (marcar como perdido)                   ─→ disc
late ─ (registrar colheita tardia)             ─→ done
late ─ (marcar como perdido)                   ─→ disc
```

Uma vez `done` ou `disc`, o ciclo é considerado fechado.

---

## 👥 RN-10 — Cliente ativo vs recorrente

| Categoria | Critério |
|---|---|
| **Ativo** | `status = 'ativo'` no cadastro |
| **Recorrente** | Tem ≥ 2 vendas no período analisado |
| **Novo** | `created_at` dentro do período selecionado |

**Taxa de recorrência** = recorrentes / ativos × 100%.

---

## 💰 RN-11 — Ticket médio

```
ticket_medio = faturamento_periodo / numero_vendas_periodo
```

Calculado sobre vendas com `deleted = false`.

---

## 🧾 RN-12 — Resultado (Lucro/Prejuízo)

```
resultado = receita_total − (custos_fixos + custos_variaveis)
```

Onde:
- `receita_total` = soma de `sales.total` no período
- `custos_fixos` = `expenses` com `type = 'Fixo'`
- `custos_variaveis` = `expenses` com `type = 'Variável'`

---

## 🔒 RN-13 — Soft delete

Nenhum registro é excluído de fato. Ao "excluir", o campo `deleted` é
marcado como `true`. Todas as queries de listagem filtram `deleted = false`.

Isso permite:
- Histórico completo para auditoria
- Possibilidade de "restaurar" registros no futuro
- Estatísticas históricas sem perda de dados

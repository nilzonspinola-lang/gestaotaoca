# 1. Visão Geral — Taoca OS

> **Taoca OS** é o sistema de gestão (ERP enxuto) da **Taoca Cogumelos**, desenvolvido
> sob medida para a operação de cultivo, beneficiamento e venda de cogumelos frescos.

---

## 🍄 Propósito

Centralizar em um único painel todas as informações executivas e operacionais
da empresa, com foco em:

- **Visão executiva** — KPIs financeiros, produtivos e estratégicos em tempo real
- **Operação de produção** — controle de salas, ciclos, colheita e geração de CBS
- **Gestão comercial** — clientes, vendas, ticket médio, recorrência e CAC
- **Finanças** — DRE simplificado, custo por kg, composição de custos, margem por segmento
- **Tarefas e ATAs** — alinhamento da equipe e reuniões com decisões rastreáveis

---

## 📦 Módulos do sistema

| # | Módulo | Função principal |
|---|---|---|
| 1 | **Dashboard** | Resumo executivo com KPIs do dia/mês |
| 2 | **Tarefas** | Kanban com prazos, status e categorias |
| 3 | **Vendas** | Lançamento de vendas, NF, segmentos |
| 4 | **Produção** | 3 salas, ciclos, colheita, geração automática de CBS |
| 5 | **Financeiro** | DRE, custos fixos/variáveis, fluxo de caixa |
| 6 | **Clientes** | Cadastro, segmentação, histórico de compras |
| 7 | **Cadastros** | Produtos, Categorias, Centros de custo, **Fornecedores** |
| 8 | **ATAs** | Registro de reuniões e decisões |
| 9 | **Estratégico** | KPIs gerais, quadrante Faturamento × Margem, CAC, insights |

---

## 👥 Público-alvo

- **Nílzon (sócio gestor)** — visão executiva completa
- **Marco (sócio)** — visão executiva completa (perfil Administrador)
- **Operadores** — operação diária (tarefas, produção, vendas)

---

## 🌱 Identidade visual

- **Paleta:** verdes (#1F3A28 → #6B9B6F), creme (#FAF7F2), terracota (#C77B5C)
- **Tipografia:** serif para títulos, sans-serif para corpo
- **Ícones:** SVG monocromáticos (sem emojis decorativos)
- **Tom:** profissional, sereno, conectado à natureza

---

## 📍 Status atual

- ✅ MVP funcional rodando em sandbox
- ✅ 13 páginas implementadas e testadas (HTTP 200)
- ✅ Autenticação local com papéis (Administrador / Operador)
- ✅ Persistência via `localStorage` (preparado para migração ao Supabase)
- 🔜 Publicação em `gestao.taoca.com.br` via HostGator
- 🔜 Migração para Supabase (backend real, multi-usuário em nuvem)

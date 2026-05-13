# 🍄 Taoca OS

> Sistema de gestão (ERP enxuto) da **Taoca Cogumelos** — cultivo, beneficiamento e venda.

[![Status](https://img.shields.io/badge/Status-MVP%20Pronto-green)]()
[![Versão](https://img.shields.io/badge/Versão-0.6.0-blue)]()
[![Deploy](https://img.shields.io/badge/Deploy-HostGator-orange)]()

---

## 📦 Módulos

| Módulo | Descrição |
|---|---|
| 🏠 Dashboard | KPIs executivos do dia/mês |
| ✅ Tarefas | Kanban com 4 colunas, prazos e categorias |
| 💰 Vendas | Lançamento e histórico de vendas |
| 🧪 Produção | 3 salas, ciclos e geração automática de CBS (1:4) |
| 📊 Financeiro | DRE, custos fixos/variáveis, fluxo |
| 👥 Clientes | CRM básico com segmentação |
| 📋 Cadastros | Produtos, Categorias, Centros, Fornecedores |
| 📑 ATAs | Reuniões com decisões rastreáveis |
| 📈 Estratégico | 8 KPIs gerais, CAC, quadrante F×M, insights |

---

## 🚀 Quick Start

### Rodar localmente
```bash
# Clone o repositório
git clone https://github.com/nilzonspinola-lang/gestaotaoca.git
cd gestaotaoca

# Inicie um servidor estático
python3 -m http.server 3000

# Abra no navegador
# http://localhost:3000/login.html
```

### Acesso em produção (após deploy)
- **URL:** `https://gestao.taoca.com.br`
- **Usuários iniciais:** `nilzon`, `marco`, `operador`

---

## 🏗️ Stack

- **Frontend:** HTML5 + CSS3 + JavaScript vanilla (sem build step)
- **Persistência:** `localStorage` (MVP) → Supabase (Etapa 3)
- **Hosting:** HostGator (hospedagem compartilhada)
- **Domínio:** Registro.br → HostGator

---

## 📚 Documentação

Toda a documentação técnica e funcional vive em [`/docs`](docs/README.md):

- [01 — Visão Geral](docs/01-visao-geral.md)
- [02 — Arquitetura](docs/02-arquitetura.md)
- [03 — Módulos](docs/03-modulos.md)
- [04 — Usuários e Papéis](docs/04-usuarios-e-papeis.md)
- [05 — Modelo de Dados](docs/05-modelo-de-dados.md)
- [06 — Regras de Negócio](docs/06-regras-de-negocio.md)
- [07 — Design System](docs/07-design-system.md)
- [08 — Roadmap](docs/08-roadmap.md)
- **[09 — Deploy](docs/09-deploy.md)** ⭐
- [10 — Changelog](docs/10-changelog.md)

---

## 🎨 Identidade

- **Paleta:** verdes Taoca (#1F3A28 → #6B9B6F), creme (#FAF7F2), terracota (#C77B5C)
- **Tipografia:** serif para títulos, sans-serif para corpo
- **Ícones:** SVG monocromáticos

---

## 🌱 Roadmap rápido

- ✅ **Etapa 0:** MVP funcional (13 páginas, 9 módulos)
- 🟡 **Etapa 1:** Deploy em `gestao.taoca.com.br` (HostGator)
- 🔜 **Etapa 2:** E-mail profissional `@taoca.com.br`
- 🔜 **Etapa 3:** Migração para Supabase (backend real, multi-dispositivo)
- 🔜 **Etapa 4:** Exportação PDF, PWA mobile, BI avançado

Detalhes em [docs/08-roadmap.md](docs/08-roadmap.md).

---

## 📜 Licença

Software proprietário © Taoca Cogumelos. Todos os direitos reservados.

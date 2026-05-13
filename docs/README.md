# 📚 Documentação Taoca OS

> Toda a documentação técnica e funcional do sistema **Taoca OS** —
> ERP enxuto da Taoca Cogumelos.

---

## 📑 Índice

| # | Documento | Conteúdo |
|---|---|---|
| 01 | [Visão Geral](01-visao-geral.md) | O que é o Taoca OS, módulos, propósito |
| 02 | [Arquitetura](02-arquitetura.md) | Stack atual, estrutura de pastas, camada de dados |
| 03 | [Módulos](03-modulos.md) | Detalhe de cada um dos 9 módulos |
| 04 | [Usuários e Papéis](04-usuarios-e-papeis.md) | Admin/Operador, regras de proteção |
| 05 | [Modelo de Dados](05-modelo-de-dados.md) | Tabelas, campos, relacionamentos |
| 06 | [Regras de Negócio](06-regras-de-negocio.md) | CBS 1:4, CAC automático, alocação de custos |
| 07 | [Design System](07-design-system.md) | Paleta, tipografia, componentes |
| 08 | [Roadmap](08-roadmap.md) | Etapas futuras (Supabase, mobile, BI) |
| 09 | **[Deploy](09-deploy.md)** | **Como publicar em gestao.taoca.com.br** ⭐ |
| 10 | [Changelog](10-changelog.md) | Histórico de versões |

---

## 🚀 Quick Start

### Acesso ao sistema (após deploy)
- **URL:** `https://gestao.taoca.com.br`
- **Usuários iniciais:** `nilzon`, `marco`, `operador`
- **Trocar senha:** Cadastros → Usuários

### Para desenvolvedores
1. Clone o repositório
2. Abra qualquer página HTML diretamente no navegador
   (ou rode um servidor estático: `python -m http.server 3000`)
3. Login com qualquer usuário seeded
4. Dados ficam em `localStorage`

---

## 🏗️ Stack

- HTML5 / CSS3 / JavaScript vanilla (sem build)
- `localStorage` (MVP) → Supabase (Etapa 3)
- Hospedagem: HostGator (compartilhada)
- Domínio: Registro.br → HostGator

---

## 📍 Status atual

✅ MVP funcional
🟡 Em fase de publicação (`gestao.taoca.com.br`)
🔜 Migração para Supabase
🔜 E-mail profissional `@taoca.com.br`

---

## 🔗 Links

- **Repositório:** `github.com/nilzonspinola-lang/gestaotaoca` (privado)
- **Sandbox dev:** `https://3000-iosplwayox8sefpgyqf3f-583b4d74.sandbox.novita.ai`
- **Produção:** `https://gestao.taoca.com.br` (em breve)

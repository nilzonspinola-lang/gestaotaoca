# 2. Arquitetura

## 🧱 Stack atual (MVP)

| Camada | Tecnologia | Observações |
|---|---|---|
| **Front-end** | HTML5 + CSS3 + JavaScript vanilla | Sem framework, sem build step |
| **Persistência** | `localStorage` via `TaocaData` | Cada usuário tem sua base local |
| **Autenticação** | Hash FNV+xorshift (placeholder) | Será migrado para Supabase Auth |
| **Hosting (a publicar)** | HostGator (hospedagem compartilhada) | Subdomínio `gestao.taoca.com.br` |
| **Domínio** | Registro.br → HostGator | DNS gerenciado pela HostGator |

---

## 📁 Estrutura de pastas

```
gestaotaoca/
├── index.html              ← Home / Dashboard executivo
├── login.html              ← Tela de autenticação
├── dashboard.html          ← Dashboard operacional
├── tarefas.html            ← Kanban de tarefas
├── vendas.html             ← Lançamento de vendas
├── financeiro.html         ← DRE e fluxo
├── producao.html           ← 3 salas + ciclos + CBS
├── clientes.html           ← CRM básico
├── cadastros.html          ← Produtos, Categorias, Centros, Fornecedores
├── atas.html               ← Atas de reunião
├── estrategia.html         ← Painel estratégico (KPIs gerais)
│
├── css/
│   ├── taoca-design-system.css     ← Design system completo
│   └── notifications.css            ← Toasts e alertas
│
├── js/
│   ├── taoca-data.js       ← Camada de dados (localStorage abstraction)
│   ├── taoca-shell.js      ← Sidebar/shell compartilhado
│   └── taoca-ai.js         ← Assistente flutuante (Taoca IA)
│
├── assets/
│   └── taoca-logo.png      ← Logo da marca
│
├── img/                    ← Imagens auxiliares
│
└── docs/                   ← Esta documentação
```

---

## 🗄️ Camada de dados — `TaocaData`

Abstração sobre `localStorage` que simula um banco relacional simples.

### Tabelas (SCHEMAS)
```
users               ← Usuários do sistema (admin/operador)
tasks               ← Tarefas Kanban
customers           ← Clientes
products            ← Produtos / SKUs
categories          ← Categorias de produto
cost_centers        ← Centros de custo
suppliers           ← Fornecedores (7 categorias)
rooms               ← Salas de produção (3 salas, 750 kg/mês cada)
production_cycles   ← Ciclos de cultivo
sales               ← Vendas
expenses            ← Despesas / custos
atas                ← Atas de reunião
```

### API pública (`window.TaocaData`)
- `list(table)` — lista todos os registros
- `get(table, id)` — obtém por ID
- `create(table, data)` — cria com ID UUID
- `update(table, id, patch)` — atualiza parcialmente
- `remove(table, id)` — exclusão lógica (`deleted = true`)
- `authenticate(user, pass)` — login com hash + papel
- Helpers de produção: `cycleCBS`, `forecastNext30Days`, `harvestedByRoom`, etc

---

## 🔮 Stack futura (Etapa 2 — Supabase)

| Camada | Atual | Futura |
|---|---|---|
| Persistência | localStorage | **Supabase Postgres** |
| Auth | Hash local | **Supabase Auth** (e-mail + senha, OAuth) |
| Real-time | ❌ | **Supabase Realtime** (atualização entre dispositivos) |
| Backup | Manual | Automático na nuvem |
| Multi-usuário | Mesmo navegador | Qualquer dispositivo, em qualquer lugar |

A migração será **sem mudar o front-end** — basta substituir `taoca-data.js` por
um wrapper que chama Supabase em vez de localStorage. A API pública permanece igual.

---

## 🌐 Topologia de publicação

```
[ Usuário ]
     │
     │ https://gestao.taoca.com.br
     ▼
[ HostGator — public_html/gestao/ ]
     │
     │ serve arquivos estáticos
     ▼
[ Navegador do usuário ]
     │
     ├─ localStorage (dados)        ← MVP atual
     └─ Supabase (Postgres)         ← Etapa 2
```

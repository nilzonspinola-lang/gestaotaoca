# 8. Roadmap

> Evolução planejada do Taoca OS, organizada em etapas.

---

## ✅ Etapa 0 — MVP (CONCLUÍDA)

**Status:** ✅ Pronto para produção

- [x] Design system completo (paleta Taoca, tipografia, componentes)
- [x] Sidebar shell unificado em todas as páginas
- [x] 13 páginas implementadas (HTTP 200 em todas)
- [x] Autenticação local com hash + papéis (Admin/Operador)
- [x] Persistência via localStorage com `TaocaData`
- [x] Módulo Tarefas (Kanban completo, 10 tarefas seed)
- [x] Módulo Vendas
- [x] Módulo Financeiro (DRE básico)
- [x] Módulo Produção (3 salas, ciclos, CBS 1:4 automático)
- [x] Módulo Clientes (CRM básico)
- [x] Módulo Cadastros (4 abas: Produtos, Categorias, Centros, Fornecedores)
- [x] Módulo ATAs
- [x] Módulo Estratégico (8 KPIs, quadrante F×M, insights automáticos)
- [x] Assistente Taoca IA flutuante e arrastável

---

## 🟢 Etapa 1 — Publicação (EM EXECUÇÃO)

**Status:** 🟡 Em andamento

- [x] Documentação consolidada em `/docs`
- [x] Repositório no GitHub (privado): `nilzonspinola-lang/gestaotaoca`
- [ ] Merge da branch `genspark_ai_developer` em `main`
- [ ] Upload na HostGator (`public_html/gestao/`)
- [ ] Subdomínio `gestao.taoca.com.br` configurado no cPanel
- [ ] SSL Let's Encrypt ativado
- [ ] Teste de produção em `https://gestao.taoca.com.br`
- [ ] Troca de senhas iniciais
- [ ] Treinamento básico Nílzon + Marco

**Entregável:** Sistema acessível em `https://gestao.taoca.com.br` pelos sócios.

---

## 🟡 Etapa 2 — E-mail profissional

**Status:** 🔜 Próximo após publicação

- [ ] Criar contas de e-mail no cPanel HostGator:
  - `contato@taoca.com.br`
  - `nilzon@taoca.com.br`
  - `marco@taoca.com.br`
- [ ] Configurar SPF, DKIM, DMARC (anti-spam)
- [ ] Configurar webmail e clientes (Gmail/Outlook)
- [ ] Assinaturas de e-mail padronizadas
- [ ] (Opcional) Migrar para Google Workspace se quiser Gmail+Drive integrado

---

## 🔵 Etapa 3 — Migração para Supabase

**Status:** 🔜 Planejado (próximos 30-60 dias)

**Por quê:**
- Multi-dispositivo (acesso do celular, casa, escritório)
- Dados na nuvem (sem risco de perder se trocar de navegador)
- Multi-usuário real (cada um com sua conta)
- Backup automático
- Real-time (atualização entre usuários)

**Como:**
1. Criar projeto Supabase
2. Modelar tabelas Postgres (replicando schemas atuais)
3. Configurar Row Level Security (RLS) por papel
4. Substituir `js/taoca-data.js` por wrapper Supabase
5. Migrar dados existentes via export/import
6. Configurar autenticação Supabase Auth
7. Testes paralelos antes de cortar produção

**Sem mudar:** UI, fluxo de uso, design.

---

## 🟣 Etapa 4 — Funcionalidades avançadas

**Status:** 🔜 Após Supabase

### Relatórios e exportação
- [ ] Exportar relatórios em PDF (Financeiro, Estratégico, Produção)
- [ ] Exportar dados em Excel/CSV
- [ ] Relatório mensal automático por e-mail

### Notificações
- [ ] E-mail quando tarefa atrasa
- [ ] WhatsApp Business API para alertas críticos
- [ ] Push notifications no navegador

### Integrações
- [ ] Nota fiscal (NFe) automática
- [ ] Integração com banco (Pix, Open Finance)
- [ ] Marketplace (iFood, Rappi) — se vender direto ao consumidor

### Mobile
- [ ] PWA (Progressive Web App) — instalável no celular como app
- [ ] (Futuro) App nativo iOS/Android

### BI / Analytics
- [ ] Gráficos avançados (Chart.js ou similar)
- [ ] Comparativos ano-a-ano
- [ ] Projeções com tendência (regressão linear simples)

---

## 🟠 Etapa 5 — Escala

**Status:** 🔮 Visão futura (6-12 meses)

- [ ] Multi-empresa (se vier a abrir outra unidade)
- [ ] Multi-usuário com permissões granulares
- [ ] API pública para integrações externas
- [ ] Marketplace de plugins (se virar produto)
- [ ] Logs de auditoria detalhados
- [ ] Dashboard cliente externo (B2B)

---

## 📌 Prioridades imediatas (próximos 30 dias)

1. ✅ Publicar em `gestao.taoca.com.br`
2. 🟡 Configurar e-mail profissional `@taoca.com.br`
3. 🟡 Migrar para Supabase (backend real)
4. 🟡 Implementar exportação em PDF do Estratégico
5. 🟡 PWA básico (instalar como app no celular)

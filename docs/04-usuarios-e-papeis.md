# 4. Usuários e Papéis

## 🔐 Sistema de autenticação

Login local via `TaocaData.authenticate(user, pass)`, com hash FNV+xorshift.

> ⚠️ Este é um placeholder do MVP. Na Etapa 2 será substituído por
> **Supabase Auth** (e-mail + senha, OAuth Google opcional, recuperação por e-mail).

---

## 👤 Papéis

### 1. Administrador
Acesso completo ao sistema, incluindo:
- Todos os módulos (Dashboard, Vendas, Produção, Financeiro, Estratégico, etc)
- Gestão de usuários (criar, editar, ativar/desativar)
- Configurações do sistema
- Visualização do painel Estratégico
- Exportação de dados

### 2. Operador
Acesso operacional:
- Dashboard, Tarefas, Vendas, Produção, Clientes
- Cadastros (consulta)
- ATAs
- ❌ Sem acesso ao Estratégico
- ❌ Sem acesso à gestão de usuários
- ❌ Sem acesso ao Financeiro completo

---

## 👨‍💼 Usuários iniciais (seeded)

| Usuário | Nome | Papel | Status |
|---|---|---|---|
| `nilzon` | Nílzon Spínola | Administrador | Ativo |
| `marco` | Marco (sócio) | Administrador | Ativo |
| `operador` | Operador padrão | Operador | Ativo |

> ⚠️ As senhas iniciais são definidas no primeiro deploy.
> **Após o primeiro login, troque imediatamente** em **Cadastros → Usuários**.

---

## 🛡️ Regras de proteção

O sistema possui guards (proteções) que impedem operações perigosas:

1. **Não é possível auto-rebaixar:** um Admin não pode tirar sua própria
   permissão de admin (evita lock-out).
2. **Não é possível remover o último admin:** sempre deve haver ao menos
   um usuário com papel Administrador ativo.
3. **Não é possível auto-desativar:** o admin logado não pode marcar
   a si mesmo como inativo.
4. **Usuário inativo não loga:** retorna erro `inactive` na tela de login.

---

## 🔄 Migração futura

Na Etapa 2 (Supabase), cada usuário do `TaocaData.users` será migrado
para um usuário real do Supabase Auth com:

- E-mail profissional (`@taoca.com.br`)
- Senha forte (hash bcrypt)
- Papel armazenado em `user_metadata.role`
- Recuperação de senha por e-mail
- (Opcional) Login com Google

A interface de "Gestão de Usuários" no Cadastros permanecerá
praticamente idêntica.

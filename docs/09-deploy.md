# 9. Deploy — Publicação na HostGator

> **Objetivo:** Publicar o Taoca OS em `https://gestao.taoca.com.br` usando
> a hospedagem HostGator já contratada, e configurar e-mail profissional
> `@taoca.com.br`.

---

## 📋 Pré-requisitos (já temos)

- ✅ Domínio `taoca.com.br` registrado no Registro.br
- ✅ Domínio apontado para a HostGator (DNS do Registro.br já configurado)
- ✅ Plano de hospedagem ativo na HostGator
- ✅ Acesso ao cPanel da HostGator (login + senha)
- ✅ Código do sistema versionado no GitHub (privado)

---

## 🎯 Plano em 5 fases

| Fase | O que será feito | Quem faz | Tempo |
|---|---|---|---|
| **1** | Criar subdomínio `gestao.taoca.com.br` no cPanel | Nílzon | 5 min |
| **2** | Empacotar o sistema em ZIP | Genspark | 2 min |
| **3** | Fazer upload via File Manager do cPanel | Nílzon | 10 min |
| **4** | Ativar SSL (HTTPS) gratuito | Nílzon | 5 min |
| **5** | Criar e-mails profissionais `@taoca.com.br` | Nílzon | 15 min |

**Tempo total estimado:** ~40 minutos.

---

## 🚀 FASE 1 — Criar o subdomínio no cPanel

### Passo a passo (você, Nílzon)

1. **Acesse o cPanel** da HostGator:
   - URL típica: `https://br123.hostgator.com.br:2083` (a HostGator envia por e-mail no primeiro acesso)
   - Ou via Portal do Cliente HostGator → "Acessar cPanel"

2. **Encontre a seção "Domínios"** (procure pelo ícone, geralmente perto do topo).

3. **Clique em "Subdomínios"** (ou "Subdomains").

4. **Crie o subdomínio:**
   - **Subdomínio:** `gestao`
   - **Domínio:** `taoca.com.br` (selecione no dropdown)
   - **Diretório raiz:** o sistema preenche automaticamente como
     `public_html/gestao` ou `public_html/gestao.taoca.com.br` —
     **anote esse caminho exato**.

5. **Clique em "Criar".**

6. ✅ Pronto! Em 10-30 minutos a HostGator propaga o DNS interno.

> 💡 Se o cPanel pedir IP, ignore — ele já sabe.

---

## 📦 FASE 2 — Empacotar o sistema (eu faço aqui)

Eu vou gerar um arquivo `taoca-os-deploy.zip` contendo:

- Todas as páginas HTML
- Pastas `css/`, `js/`, `assets/`, `img/`, `docs/`
- Um `.htaccess` otimizado (cache, compressão, segurança)
- Um arquivo `README.txt` curto na raiz

**Nada de `node_modules`, `.git`, ou arquivos desnecessários.** ZIP leve, ~500 KB.

---

## 📤 FASE 3 — Upload via File Manager

### Passo a passo (você, Nílzon)

1. **Baixe o ZIP** que vou te enviar (link que aparece no chat).

2. **No cPanel**, abra **"Gerenciador de Arquivos"** (File Manager).

3. Navegue até a pasta criada no Fase 1:
   - Provavelmente `public_html/gestao/`
   - Ou `public_html/gestao.taoca.com.br/`

4. **Apague o arquivo `index.html` padrão da HostGator** (a página "Em construção"), se houver.

5. **Clique em "Upload"** (botão no topo).

6. **Arraste o `taoca-os-deploy.zip`** ou selecione manualmente.

7. Aguarde 100% (barra verde).

8. Volte para o File Manager. **Clique com o botão direito no ZIP** → **"Extract" (Extrair)**.

9. Confirme o destino (a mesma pasta `public_html/gestao/`).

10. Após extrair, **delete o ZIP** para economizar espaço.

11. **Teste:** abra `http://gestao.taoca.com.br` (sem o "s" ainda, só HTTP).
    Você deve ver a tela de login do Taoca OS. ✅

---

## 🔒 FASE 4 — Ativar SSL (HTTPS)

A HostGator oferece Let's Encrypt gratuito.

### Passo a passo (você, Nílzon)

1. **No cPanel**, encontre **"SSL/TLS Status"** (na seção Segurança).

2. Localize a linha do subdomínio **`gestao.taoca.com.br`**.

3. Marque a caixa de seleção dessa linha.

4. Clique em **"Run AutoSSL"** (ou "Executar AutoSSL").

5. Aguarde 2-5 minutos.

6. A coluna de status deve virar 🟢 verde.

7. **Teste em HTTPS:** `https://gestao.taoca.com.br` — deve abrir com cadeado.

### Forçar HTTPS (opcional mas recomendado)

No `.htaccess` que vou incluir no ZIP, já vai estar configurado. Se quiser
fazer manualmente, edite `public_html/gestao/.htaccess` e garanta que tem:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📧 FASE 5 — E-mail profissional `@taoca.com.br`

### Passo a passo (você, Nílzon)

1. **No cPanel**, vá em **"Contas de E-mail"** (Email Accounts).

2. Clique em **"Criar"** (Create).

3. **Crie as contas iniciais sugeridas:**

   | E-mail | Para | Espaço |
   |---|---|---|
   | `contato@taoca.com.br` | Contato geral / clientes | 2 GB |
   | `nilzon@taoca.com.br` | Você (sócio) | 5 GB |
   | `marco@taoca.com.br` | Marco (sócio) | 5 GB |
   | `financeiro@taoca.com.br` | NFs, boletos | 2 GB |

4. Para cada uma: **defina senha forte** (anote em local seguro, ex: Bitwarden).

5. **Acessar webmail:**
   - URL: `https://taoca.com.br/webmail`
   - Ou: `https://gestao.taoca.com.br:2096`
   - Login com o e-mail completo + senha.

### Configurar no Gmail (recomendado)

Para receber e enviar `@taoca.com.br` dentro do seu Gmail pessoal:

1. Gmail → ⚙️ **Configurações** → **Contas e importação**
2. **"Verificar e-mail de outras contas"** → **Adicionar conta**
3. Insira o e-mail e siga o assistente com os dados:
   - **Servidor POP:** `mail.taoca.com.br`
   - **Porta:** 995 (POP3 com SSL)
   - **Usuário:** e-mail completo
   - **Senha:** a que você definiu
4. **"Enviar e-mail como"** → **Adicionar outro endereço**
   - **Servidor SMTP:** `mail.taoca.com.br`
   - **Porta:** 465 (SSL) ou 587 (TLS)
   - **Usuário:** e-mail completo
   - **Senha:** a mesma

> 💡 Os dados exatos a HostGator mostra na tela de "Configurar Cliente de E-mail"
> dentro da conta de e-mail criada.

### Configurar SPF, DKIM e DMARC (anti-spam)

Para que seus e-mails não caiam no spam:

1. No cPanel, vá em **"Autenticação de E-mail"** (Email Authentication).
2. **SPF:** clique em **"Habilitar"**.
3. **DKIM:** clique em **"Habilitar"**.
4. **DMARC** (opcional mas recomendado):
   - Em "Editor de Zona DNS", adicione um registro TXT:
   - **Host:** `_dmarc.taoca.com.br`
   - **Valor:** `v=DMARC1; p=quarantine; rua=mailto:contato@taoca.com.br`

---

## ✅ Checklist final

Após completar tudo, valide:

- [ ] `https://gestao.taoca.com.br` abre com cadeado verde
- [ ] Tela de login aparece corretamente
- [ ] Consigo logar com `nilzon` / senha inicial
- [ ] Todas as 13 páginas do menu lateral carregam
- [ ] Dados de seed aparecem (3 salas, 10 tarefas, etc)
- [ ] Mobile (celular) abre normalmente
- [ ] `contato@taoca.com.br` envia e recebe e-mail
- [ ] Troquei as senhas iniciais dos 3 usuários

---

## 🔄 Atualizações futuras

Sempre que houver uma nova versão do sistema, o processo será:

1. Eu gero um novo ZIP atualizado
2. Você sobe via File Manager (substituindo os arquivos antigos)
3. **Importante:** o `localStorage` dos usuários não é apagado, então
   os dados continuam preservados.

Na Etapa 3 (Supabase), esse processo ficará automático via Git Hook.

---

## 🆘 Troubleshooting

### "Não aparece nada em gestao.taoca.com.br"
- Aguarde 30 minutos após criar o subdomínio (propagação interna)
- Limpe cache do navegador (Ctrl+F5 / Cmd+Shift+R)
- Teste em janela anônima
- Verifique se o `index.html` está em `public_html/gestao/`

### "Aparece página padrão da HostGator"
- O index.html da HostGator não foi removido
- Volte ao File Manager e apague `default.html` ou `index.html` antigo

### "SSL não ativa (sem cadeado)"
- Aguarde 30 minutos após criar o subdomínio
- Re-execute o AutoSSL no cPanel
- Se persistir: abrir ticket na HostGator pedindo Let's Encrypt manual

### "E-mail não chega"
- Verifique pasta de Spam
- Confirme se SPF e DKIM estão habilitados
- Use ferramenta `mail-tester.com` para diagnosticar

### "Sistema funciona mas dados somem"
- localStorage é **por navegador/dispositivo**
- Cada usuário verá seus próprios dados
- Para compartilhar dados entre dispositivos → Etapa 3 (Supabase)

---

## 📞 Contatos úteis

- **Suporte HostGator:** chat 24/7 no portal do cliente
- **Suporte Registro.br:** apenas se precisar mexer no DNS principal
- **Documentação Taoca OS:** pasta `/docs` deste repositório

# 11. Deploy Automático (GitHub Actions → HostGator)

> A partir de agora, **todo push na branch `main`** dispara o deploy
> automático para `gestao.taoca.com.br` em ~30 segundos.

---

## ⚙️ Como funciona

```
Alteração no código
        │
        ▼
git push origin main
        │
        ▼
GitHub Actions detecta o push
        │
        ▼
Workflow .github/workflows/deploy.yml roda
        │
        ▼
SamKirkland/FTP-Deploy-Action envia via FTPS
        │
        ▼
HostGator recebe os arquivos em /gestao.taoca.com.br/
        │
        ▼
Site atualizado ✨
```

---

## 🔐 Secrets configurados no GitHub

| Nome | O que é |
|---|---|
| `FTP_SERVER` | Endereço FTP da HostGator (ex: `ftp.taoca.com.br`) |
| `FTP_USERNAME` | Usuário da conta FTP `deploy-taoca` |
| `FTP_PASSWORD` | Senha da conta FTP (criptografada) |

Configurados em: **GitHub → Settings → Secrets and variables → Actions**

---

## 📂 Conta FTP dedicada

A conta FTP `deploy-taoca` foi criada no cPanel com:
- **Diretório raiz:** `/gestao.taoca.com.br`
- **Quota:** ilimitada
- **Permissão:** apenas essa pasta (não acessa o resto do servidor)

Isso garante que mesmo se as credenciais vazarem, o estrago é limitado a essa pasta.

---

## 🚫 O que NÃO é enviado para o servidor

O workflow ignora automaticamente:

- `.git/` e `.github/` — controle de versão
- `node_modules/` — dependências locais
- `docs/` — documentação (fica só no GitHub)
- `*.zip` — pacotes de deploy antigos
- `*.log` — logs
- `.DS_Store` — arquivos de macOS
- `README.md`, `DEPLOY-README.txt`, `.gitignore`

Resultado: o servidor fica **enxuto**, só com o que o sistema precisa.

---

## 🚀 Como fazer um deploy

### Automático (recomendado)
```bash
# 1. Faz a alteração no código
# 2. Commita
git add .
git commit -m "fix: algo"
# 3. Envia para a main
git push origin main
# Pronto! Em ~30s o site está atualizado.
```

### Manual (botão no GitHub)
1. Acesse: https://github.com/nilzonspinola-lang/gestaotaoca/actions
2. Clique em "Deploy para HostGator (gestao.taoca.com.br)"
3. Botão "Run workflow" no canto superior direito
4. Selecione a branch `main` → "Run workflow"

---

## 📊 Acompanhar deploys

Todos os deploys ficam registrados em:
👉 https://github.com/nilzonspinola-lang/gestaotaoca/actions

Cada deploy mostra:
- ✅ Verde = sucesso
- ❌ Vermelho = falha (clica para ver o erro)
- 🟡 Amarelo = em execução

E você recebe um e-mail automaticamente do GitHub se algum deploy falhar.

---

## ⚡ Otimizações ativas

1. **Diff incremental:** o action mantém um arquivo `.ftp-deploy-sync-state.json`
   no servidor que rastreia o que já foi enviado. Em deploys subsequentes,
   só envia os arquivos que **realmente mudaram**.
2. **FTPS** (FTP com SSL/TLS) para segurança das credenciais em trânsito.
3. **Timeout de 30 min** suficiente para a primeira subida completa.

---

## 🆘 Troubleshooting

### Deploy falha com erro de SSL
- Edite `.github/workflows/deploy.yml`
- Troque `protocol: ftps` por `protocol: ftp`
- Commit + push

### Deploy falha com "Authentication failed"
- Verifique os 3 secrets no GitHub (podem estar com espaços ou erros)
- Crie novamente a conta FTP no cPanel para garantir
- Confirme que o usuário FTP tem como diretório raiz `/gestao.taoca.com.br`

### Site não atualiza após deploy bem-sucedido
- Cache do navegador → Ctrl+F5 ou Cmd+Shift+R
- Cache do servidor HostGator → aguarde 1-2 minutos
- Os arquivos `.html` já têm cache-busting `?v=X.Y.Z` no `taoca-data.js`

### Quero fazer rollback de uma versão ruim
1. No GitHub, encontre o último commit bom
2. Faça: `git revert <commit-ruim>` e push
3. O deploy automático restaura a versão boa

---

## 🎯 Próximos passos (opcional)

- **Preview deploy:** criar branch `staging` que faz deploy para
  `staging.taoca.com.br` antes de ir para produção
- **Slack/WhatsApp notification:** receber notificações no celular
- **Backup automático antes de cada deploy:** copia versão anterior
  para `/backups/YYYY-MM-DD/`

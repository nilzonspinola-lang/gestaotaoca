# Quadro de Tarefas - Nílzon e Marco

Aplicação web para gestão de tarefas, atas de reunião e dashboard de acompanhamento.

## 📋 Estrutura do Projeto

```
quadro-tarefas/
├── index.html              # Quadro de Tarefas (página principal)
├── atas.html               # Página de Atas de Reunião
├── dashboard.html          # Dashboard de acompanhamento
├── css/
│   └── notifications.css   # Estilos do sistema de notificações
└── js/
    └── notifications.js    # Lógica do sistema de notificações
```

## 🚀 Como usar

### Opção 1: Abrir diretamente no navegador
Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, Safari).

### Opção 2: Servidor local
```bash
# Com Python
python3 -m http.server 8000

# Com Node.js
npx serve .
```
Depois acesse: `http://localhost:8000`

## 🌐 Hospedagem no GitHub Pages

1. Faça o push deste repositório no GitHub
2. Vá em **Settings → Pages**
3. Em **Source**, selecione a branch `main` e a pasta `/ (root)`
4. Salve. Em alguns minutos seu site estará disponível em
   `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

## 📝 Páginas

- **index.html** — Quadro principal de tarefas
- **dashboard.html** — Visão geral e métricas
- **atas.html** — Registro de atas de reuniões

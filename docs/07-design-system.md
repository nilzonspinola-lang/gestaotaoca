# 7. Design System — Taoca

> Identidade visual aplicada em todo o sistema, definida em
> `css/taoca-design-system.css`.

---

## 🎨 Paleta de cores

### Verdes Taoca
| Token | Hex | Uso |
|---|---|---|
| `--taoca-green-900` | `#1F3A28` | Texto forte, bordas escuras |
| `--taoca-green-800` | `#2F5D3A` | Botões primários, sidebar |
| `--taoca-green-700` | `#4A7856` | Estados hover, badges |
| `--taoca-green-500` | `#6B9B6F` | Acentos suaves, ícones |

### Cremes / Terracotas
| Token | Hex | Uso |
|---|---|---|
| `--taoca-cream-50` | `#FAF7F2` | Fundo principal |
| `--taoca-clay-100` | `#F4E8DD` | Backgrounds suaves |
| `--accent` (terracota) | `#C77B5C` | CTAs secundários, alertas |

### Semânticas
| Token | Uso |
|---|---|
| `--danger` `#DC2626` | Erros, prejuízo |
| `--warning` `#F59E0B` | Avisos, atenção |
| `--success` `#16A34A` | Sucesso, lucro |
| `--text-primary` `#1F2937` | Texto principal |
| `--text-secondary` `#6B7280` | Texto secundário |
| `--text-muted` `#9CA3AF` | Texto auxiliar |
| `--border-soft` `#E5E7EB` | Bordas sutis |

---

## ✍️ Tipografia

| Família | Aplicação |
|---|---|
| `--font-serif` (Cormorant Garamond) | Títulos, h1, h2 |
| `--font-sans` (Inter / system) | Corpo, labels, botões, tabelas |

### Escala
- h1: 1.8rem, peso 700, serif
- h2: 1.5rem, peso 600, serif
- h3: 1.2rem, peso 600, sans
- body: 0.95rem, peso 400, sans
- small: 0.85rem
- micro: 0.75rem

---

## 📐 Espaçamento e raios

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 6px | Inputs pequenos, badges |
| `--radius-md` | 10px | Botões, inputs |
| `--radius-lg` | 14px | Cards |
| `--radius-2xl` | 22px | Modais, painéis grandes |

---

## 🌫️ Sombras

```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06)
--shadow-md: 0 4px 12px rgba(0,0,0,0.08)
--shadow-lg: 0 10px 30px rgba(0,0,0,0.10)
--shadow-xl: 0 20px 50px rgba(0,0,0,0.14)
```

---

## ⚡ Transições

```css
--t-fast: 0.15s ease
--t-base: 0.25s ease
--t-slow: 0.4s ease
```

---

## 🧩 Componentes principais

### Card padrão
```html
<div class="card">
  <h3>Título</h3>
  <div class="card-body">…</div>
</div>
```

### Botões
```html
<button class="btn btn-primary">Salvar</button>
<button class="btn btn-ghost">Cancelar</button>
<button class="btn btn-danger">Excluir</button>
```

### Input
```html
<div class="field">
  <label>Nome</label>
  <input type="text" class="input" />
</div>
```

### Badges / Pills
```html
<span class="pill pill-green">Ativo</span>
<span class="pill pill-amber">Atenção</span>
<span class="pill pill-red">Prejuízo</span>
```

### Modal
```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-head">Título</div>
    <div class="modal-body">…</div>
    <div class="modal-foot">…</div>
  </div>
</div>
```

### Tabela
```html
<table class="t-table">
  <thead><tr><th>Coluna</th></tr></thead>
  <tbody><tr><td>Dado</td></tr></tbody>
</table>
```

---

## 🤖 Componente Taoca IA

Botão flutuante (FAB) com painel de chat.

**Características:**
- Posição padrão: canto inferior direito
- **Arrastável** (mouse + touch), posição salva em localStorage
- Painel se posiciona automaticamente ao lado do FAB
- Pulse animation discreto para chamar atenção

---

## 🎯 Princípios de design

1. **Sereno e profissional** — paleta natural, sem cores berrantes
2. **Minimalismo intencional** — espaços em branco respeitados
3. **Hierarquia visual clara** — uso de peso, tamanho e cor para guiar o olhar
4. **Consistência radical** — mesmo padrão em todas as páginas
5. **Mobile-friendly** — quebras em 768px, 1024px, sidebar colapsável
6. **Ícones SVG** — sem emojis decorativos em UI séria; emojis apenas em
   contextos lúdicos (chat da IA, mensagens motivacionais)

---

## ❌ Anti-padrões (o que NÃO fazer)

- Gradientes muito chamativos em CTAs principais
- Múltiplas cores de destaque na mesma tela
- Bordas grossas (max 1-2px)
- Sombras exageradas (preferir sutis)
- Emojis em labels formais (usuário, senha, etc)
- Tipografia muito pequena (< 0.75rem) em texto importante

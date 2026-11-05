# STRAHL — Site Institucional

## Stack
HTML/CSS/JS puro, SPA sem framework, sem build step.
Abrir index.html diretamente no browser para testar.

## Estrutura de pastas
```
strahl-site/
├── index.html                        ← todas as páginas em um único arquivo
├── assets/
│   ├── css/main.css                  ← todos os estilos
│   ├── js/main.js                    ← navegação e galeria
│   ├── datasheets/
│   │   ├── template-datasheet.html   ← TEMPLATE base para novos datasheets
│   │   ├── datasheet-3076ck-print.html
│   │   ├── datasheet-4079ck-print.html
│   │   └── datasheet-5276ck-print.html
│   └── images/
│       └── cekton/
│           ├── 5276zCK/              ← pasta por produto (padrão novo)
│           │   ├── imagem_5276zCK-principal.jpg
│           │   ├── imagem_5276zCK-frente.jpg
│           │   ├── imagem_5276zCK-lateral.jpg
│           │   ├── imagem_5276zCK-traseira.jpg
│           │   ├── thumb_5276zCK-principal.jpg
│           │   ├── thumb_5276zCK-frente.jpg
│           │   ├── thumb_5276zCK-lateral.jpg
│           │   ├── thumb_5276zCK-traseira.jpg
│           │   ├── desenho_5276zCK.png
│           │   └── 5276zCK-Referencia.pdf
│           └── produto_3076ck_*.jpg  ← padrão antigo (3076 e 4079 ainda usam)
└── AGENTS.md                         ← este arquivo
```

## Páginas (seções dentro do index.html)
| ID | Conteúdo |
|---|---|
| page-home | Home — hero, setores, quem somos, categorias |
| page-cekton | Linha Cekton — tabelas de SKUs e produtos |
| page-datasheet | Datasheet 3076/CK |
| page-datasheet-4079 | Datasheet 4079/CK |
| page-datasheet-5276 | Datasheet 5276/CK |

## Navegação
Feita por JS puro via `goTo('nome-da-pagina')`.
Novas páginas devem:
1. Adicionar `<div class="page" id="page-NOME">...</div>` no index.html
2. Adicionar link no menu de navegação com `onclick="goTo('NOME')"`
3. Não precisam de arquivo separado — tudo fica no index.html

## Padrão visual
- Cores: vermelho (#c0392b) = 380-440V | azul (#2e6da4) = 220-240V | navy (#1a2744)
- Fonte: Barlow + Barlow Condensed (Google Fonts)
- Ícones: Material Symbols Outlined (Google)
- Sem framework CSS — estilos todos em main.css

## Convenções
- Todo conteúdo em português brasileiro
- Sem dependências externas de imagem (tudo local em assets/images/)
- Sem servidor necessário — abrir index.html direto no browser

## Contexto do produto
STRAHL é fabricante brasileiro de materiais elétricos industriais.
Linha Cekton = plugues e tomadas industriais (principal linha do site).
3076/CK = plugue 16A 2P+T · 4079/CK = plugue 125A 3P+T Alta Corrente · 5276/CK = plugue 32A 3P+N+T.

---

## ▶ COMO GERAR UM NOVO DATASHEET (leia isto antes de qualquer trabalho)

### Passo 0 — Arquivos que o usuário fornece
Todos ficam em `assets/images/cekton/CODIGOzCK/` (pasta já criada pelo usuário):
- `imagem_CODIGOzCK-principal.jpg` — 1200×1200px JPEG
- `imagem_CODIGOzCK-frente.jpg`
- `imagem_CODIGOzCK-lateral.jpg`
- `imagem_CODIGOzCK-traseira.jpg`
- `desenho_CODIGOzCK.png` — desenho técnico exportado como PNG
- `CODIGOzCK-Referencia.pdf` — PDF de referência com specs

### Passo 1 — Gerar thumbs (bash, ImageMagick)
```bash
BASE=assets/images/cekton/CODIGOzCK
for pos in principal frente lateral traseira; do
  convert "$BASE/imagem_CODIGOzCK-${pos}.jpg" -resize 300x300 -quality 85 "$BASE/thumb_CODIGOzCK-${pos}.jpg"
done
```

### Passo 2 — Criar arquivo de impressão
Copiar `assets/datasheets/template-datasheet.html` para `datasheet-CODIGOck-print.html`
e substituir todos os `{{PLACEHOLDER}}` (ver lista no topo do template).

### Passo 3 — Adicionar página ao index.html
Copiar o bloco de um datasheet existente (ex: page-datasheet-5276) e substituir:
- ID da div: `id="page-datasheet-NOME"`
- Referências de imagem: `cekton/CODIGOzCK/imagem_CODIGOzCK-*.jpg`
- Referências de thumb: `cekton/CODIGOzCK/thumb_CODIGOzCK-*.jpg`
- Referência do desenho: `cekton/CODIGOzCK/desenho_CODIGOzCK.png`
- Função JS da galeria: `dsCODIGOSetImg`
- Link do botão Comprar: `variant_id=XXXX`
- Link do botão Baixar PDF: `datasheet-CODIGOck-print.html`
- Todos os valores técnicos (corrente, polos, tensão, IP, IK, etc.)

### Passo 4 — Adicionar função de galeria no main.js
```javascript
function dsCODIGOSetImg(thumb, src) {
  document.querySelectorAll('#page-datasheet-NOME .ds-thumb').forEach(function(t) { t.classList.remove('active'); });
  thumb.classList.add('active');
  var main = document.getElementById('ds-CODIGO-main-photo');
  if (main) main.src = src;
}
```

### Passo 5 — Adicionar SKU na tabela da Linha Cekton
No index.html, seção `page-cekton`, adicionar linha com:
```html
<td><a class="sku featured" href="javascript:void(0)" onclick="goTo('datasheet-NOME')">CODIGO/CK</a></td>
```

### Passo 6 — Commit e push no branch correto
```bash
git checkout -b datasheet/CODIGOck
git add assets/images/cekton/CODIGOzCK/ assets/datasheets/datasheet-CODIGOck-print.html index.html assets/js/main.js
git commit -m "feat: adiciona datasheet CODIGO/CK"
git push origin datasheet/CODIGOck
```

---

## Padrão de imagens (novo — a partir de 5276/CK)
Cada produto tem sua própria pasta `assets/images/cekton/CODIGOzCK/` com:

| Arquivo | Dimensão | Fornecido por |
|---|---|---|
| `imagem_CODIGOzCK-principal.jpg` | 1200×1200px | Usuário |
| `imagem_CODIGOzCK-frente.jpg` | 1200×1200px | Usuário |
| `imagem_CODIGOzCK-lateral.jpg` | 1200×1200px | Usuário |
| `imagem_CODIGOzCK-traseira.jpg` | 1200×1200px | Usuário |
| `thumb_CODIGOzCK-principal.jpg` | 300×300px | Gerado (Codex) |
| `thumb_CODIGOzCK-frente.jpg` | 300×300px | Gerado (Codex) |
| `thumb_CODIGOzCK-lateral.jpg` | 300×300px | Gerado (Codex) |
| `thumb_CODIGOzCK-traseira.jpg` | 300×300px | Gerado (Codex) |
| `desenho_CODIGOzCK.png` | — | Usuário (exportado do CAD/PDF) |
| `CODIGOzCK-Referencia.pdf` | — | Usuário |

**Nota:** 3076/CK e 4079/CK ainda usam o padrão antigo (`produto_CODIGOCK_*.jpg`).
Migrar quando houver atualização das imagens desses produtos.

## Tabela de variant_id (Loja STRAHL)
| Produto | variant_id |
|---|---|
| 3076/CK | 2409 |
| 4079/CK | 2419 |
| 5276/CK | 2471 |

## Workflow de equipe
- Branch padrão: `datasheet/CODIGOck` — nunca commitar direto no main
- PR aberto no GitHub → Ismael revisa e aprova → merge
- Repositório: github.com/strahl-web/strahl-site
- Guia para novos membros: Google Drive strahlmkt@gmail.com → STRAHL-Site/Datasheets/Referencias/

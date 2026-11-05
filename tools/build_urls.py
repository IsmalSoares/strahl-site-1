"""Gera o site publicado: um arquivo HTML por página, com URL própria, título, descrição e canonical.

Fonte única: index-fonte.html (todas as páginas juntas; é nele que se edita o conteúdo).
Uso (na pasta do site):
    python3 tools/build_urls.py teste      -> GitHub Pages de teste (https://ismalsoares.github.io/strahl-site-1/), com noindex
    python3 tools/build_urls.py local      -> teste no computador (python3 -m http.server), links terminam em .html
    python3 tools/build_urls.py producao   -> www.strahl.com, sem noindex, com sitemap.xml e robots.txt

As URLs mantêm as já indexadas do site anterior (www.strahl.com/linhas/...). A tabela fica em ROTAS,
igual à de assets/js/main.js.
"""
import html, os, re, shutil, sys

MODO = sys.argv[1] if len(sys.argv) > 1 else 'local'
assert MODO in ('teste', 'local', 'producao'), 'modo: teste | local | producao'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMINIO = 'https://www.strahl.com/'
BASE = {'teste': '/strahl-site-1/', 'local': '/', 'producao': '/'}[MODO]
EXT = '.html' if MODO == 'local' else ''

ROTAS = {
    'home': '', 'cekton': 'linhas/tomadas-e-plugues-industriais', 'storm-block': 'linhas/storm-block', 'schuko': 'linhas/schuko',
    'mining-termoplastica': 'linhas/tomadas-e-plugues-mining-block',
    'mining-ultrarresistente': 'linhas/tomadas-e-plugues-mining-block/ultrarresistente',
    'mining-aluminio': 'linhas/tomadas-e-plugues-mining-block/carcaca-de-aluminio',
    'mining-altacorrente': 'linhas/tomadas-e-plugues-mining-block/alta-corrente',
    'unidades-combinadas': 'linhas/unidades-combinadas', 'qd': 'linhas/quadros-de-distribuicao',
    'cmas': 'linhas/centros-de-medicao-agrupada', 'caixas-modulares': 'linhas/caixas-modulares', 'qgbt-qdc': 'linhas/qgbt-e-qdc',
    'caixas-metalicas': 'linhas/caixas-metalicas-e-barramentos-blindados', 'caixas-individuais': 'linhas/caixas-de-medicao-individuais',
    'caixas-passagem': 'linhas/caixas-de-passagem-e-distribuicao', 'acessorios': 'linhas/acessorios',
    'hidrometro': 'linhas/caixas-para-hidrometro', 'individualizacao-agua': 'linhas/individualizacao-de-medicao-de-agua',
    'predial-residencial': 'linhas/predial-e-residencial',
    'segmento-industrial': 'segmentos/linha-industrial', 'construcao-civil': 'segmentos/construcao-civil',
    'distribuidores': 'segmentos/distribuidores', 'revendedores': 'segmentos/revendedores',
    'sobre': 'strahl', 'contato': 'contato', 'representantes': 'representantes', 'cursos': 'cursos-e-treinamentos',
    'datasheet': 'produtos/3076-ck', 'datasheet-4079': 'produtos/4079-ck', 'datasheet-5276': 'produtos/5276-ck',
    'datasheet-bem4406': 'produtos/bem-4406', 'datasheet-bm4206': 'produtos/bm-4206',
}
# URLs antigas sem página nova: levam para outra página (no servidor final, preferir redirecionamento 301)
REDIRECIONA = {'linhas/strahl-mobi-plug-e-mobi-box': ''}

# Títulos e descrições escritos à mão; as demais páginas usam o h1 e o primeiro parágrafo do resumo
SEO = {
    'home': ('STRAHL | Tomadas Industriais e Caixas de Medição de Energia e Água',
             'Fabricante brasileiro desde 1986 de tomadas e plugues industriais, caixas e centros de medição homologados, caixas para hidrômetro e quadros de distribuição.'),
    'sobre': ('Sobre a STRAHL | Materiais Elétricos desde 1986',
              'Conheça a STRAHL: indústria brasileira de materiais elétricos desde 1986, com planta própria de 20.000 m² em São Paulo, qualidade NBR ISO 9001 e produtos homologados.'),
    'contato': ('Contato | STRAHL', 'Fale com a STRAHL: WhatsApp de vendas 11 5039-3999, telefones 11 2818-3838 e 11 5026-2000, e-mail vendas@strahl.com. Av. Cel. Sezefredo Fagundes, 4600, São Paulo.'),
    'representantes': ('Representantes em todo o Brasil | STRAHL', 'A STRAHL tem representantes comerciais em todo o Brasil. Fale com a nossa equipe e encontre o representante que atende a sua região.'),
    'cursos': ('Cursos e Treinamentos | STRAHL', 'Cursos e treinamentos STRAHL sobre caixas em policarbonato, padrões de entrada e tomadas industriais. Envie a sua sugestão de tema.'),
    'cekton': ('Tomadas e Plugues Industriais Cekton | STRAHL', None),
    'storm-block': ('Tomadas e Plugues Industriais IP67 Storm Block | STRAHL', None),
    'schuko': ('Tomadas e Plugues Schuko, Padrão Alemão | STRAHL', None),
    'mining-termoplastica': ('Tomadas e Plugues Mining Block com Bloqueio Mecânico | STRAHL', None),
    'mining-ultrarresistente': ('Mining Block Ultrarresistente 16A a 63A | STRAHL', None),
    'mining-aluminio': ('Mining Block Carcaça de Alumínio 125A a 300A | STRAHL', None),
    'mining-altacorrente': ('Mining Block Alta Corrente 400A e 630A | STRAHL', None),
    'cmas': ('CMAs: Centros de Medição Agrupada e Caixas de Entrada de Energia | STRAHL', None),
    'distribuidores': ('Para Distribuidores de Material Elétrico | STRAHL', None),
    'revendedores': ('Para Revendedores de Material Elétrico | STRAHL', None),
    'datasheet': ('Plugue Industrial Cekton 3076/CK 16A 2P+T 220 a 240V | STRAHL',
                  'Ficha técnica do plugue industrial Cekton 3076/CK: 16A, 2P+T, 6h, 220 a 240V, IP44, Nylon 6.6. Especificações, dimensões e normas.'),
    'datasheet-4079': ('Plugue Industrial Cekton 4079/CK 16A 3P+T 220 a 240V | STRAHL',
                       'Ficha técnica do plugue industrial Cekton 4079/CK: 16A, 3P+T, 9h, 220 a 240V, IP44, Nylon 6.6. Especificações, dimensões e normas.'),
    'datasheet-5276': ('Plugue Industrial Cekton 5276/CK 32A 3P+N+T 380 a 440V | STRAHL',
                       'Ficha técnica do plugue industrial Cekton 5276/CK: 32A, 3P+N+T, 6h, 380 a 440V, Nylon 6.6. Especificações, dimensões e normas.'),
    'datasheet-bem4406': ('Tomada Mining Block BEM/4406 400A 3P+T | STRAHL',
                          'Ficha técnica da tomada de sobrepor Mining Block BEM/4406: 400A, 3P+T, 6h, 400V, com bloqueio eletromecânico. Especificações e dimensões.'),
    'datasheet-bm4206': ('Tomada Mining Block BM/4206 com Bloqueio Mecânico 32A | STRAHL',
                         'Ficha técnica da tomada Mining Block BM/4206 com bloqueio mecânico, IP67. Especificações, dimensões e normas.'),
}


def texto(h):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()


def corta(t, n=158):
    if len(t) <= n:
        return t
    return t[:n].rsplit(' ', 1)[0].rstrip(',;:') + '…'


def url(pid):
    r = ROTAS[pid]
    return (r + EXT) if r else ''


fonte = open(os.path.join(ROOT, 'index-fonte.html'), encoding='utf-8').read()
i_main = fonte.index('<main id="main-content">')
cabeca = fonte[:i_main]
rodape = fonte[fonte.index('<!-- ══════════════ KIT TÉCNICO'):]
inicios = [(m.start(), m.group(1)) for m in re.finditer(r'<div class="page[^"]*" id="page-([^"]+)"', fonte)]
fim_paginas = fonte.index('<!-- ══════════════ KIT TÉCNICO')
blocos = {}
for k, (ini, pid) in enumerate(inicios):
    fim = inicios[k + 1][0] if k + 1 < len(inicios) else fim_paginas
    blocos[pid] = fonte[ini:fim].replace('</main><!-- /#main-content -->', '')

faltando = set(ROTAS) - set(blocos)
assert not faltando, f'páginas sem bloco na fonte: {faltando}'


def ajusta_cabeca(pid, titulo, desc):
    h = cabeca
    if MODO == 'producao':
        h = re.sub(r'<!-- AMBIENTE DE TESTE[^\n]*\n<meta name="robots" content="noindex, nofollow">\n', '', h)
    canon = DOMINIO + ROTAS[pid]
    h = re.sub(r'<title>.*?</title>', f'<title>{html.escape(titulo)}</title>', h, count=1, flags=re.S)
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(desc)}">', h, count=1)
    h = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(titulo)}">', h, count=1)
    h = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{html.escape(desc)}">', h, count=1)
    h = h.replace('<meta charset="utf-8">\n', f'<meta charset="utf-8">\n<base href="{BASE}">\n', 1)
    h = h.replace('<meta property="og:type" content="website">',
                  f'<meta property="og:type" content="website">\n<meta property="og:url" content="{canon}">\n<link rel="canonical" href="{canon}">', 1)
    h = h.replace('<html lang="pt-BR">', f'<html lang="pt-BR" data-ext="{EXT}">', 1)
    return h


def links_reais(h):
    """<a ... href="javascript:void(0)" ... onclick="goTo('x')"> vira <a href="URL da página x"> (rastreável pelo Google)."""
    def troca(m):
        tag = m.group(0)
        g = re.search(r"""onclick="goTo\('([^']+)'\)\"""", tag)
        if not g or g.group(1) not in ROTAS or 'javascript:void(0)' not in tag:
            return tag
        tag = re.sub(r"""\s*onclick="goTo\('[^']+'\)\"""", '', tag)
        return tag.replace('href="javascript:void(0)"', f'href="{url(g.group(1))}"')
    return re.sub(r'<a\b[^>]*>', troca, h)


gerados = []
for pid in ROTAS:
    bloco = blocos[pid]
    bloco = re.sub(r'<div class="page[^"]*" id="page-', '<div class="page active" id="page-', bloco, count=1)
    if pid in SEO and SEO[pid][1]:
        titulo, desc = SEO[pid]
    else:
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', bloco, re.S)
        nome = texto(h1.group(1)) if h1 else pid
        titulo = SEO[pid][0] if pid in SEO else f'{nome} | STRAHL'
        resumo = re.search(r'<div class="lr-summary">.*?<p>(.*?)</p>', bloco, re.S)
        hero = re.search(r'<div class="uc-hero-left">.*?<p>(.*?)</p>|<p class="desc">(.*?)</p>', bloco, re.S)
        desc = texto(resumo.group(1)) if resumo else texto((hero.group(1) or hero.group(2)) if hero else nome)
    pagina = ajusta_cabeca(pid, titulo, corta(desc)) + '<main id="main-content">\n' + bloco + '\n</main>\n\n' + rodape
    pagina = links_reais(pagina)
    destino = os.path.join(ROOT, (ROTAS[pid] or 'index') + '.html')
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    open(destino, 'w', encoding='utf-8').write(pagina)
    gerados.append(ROTAS[pid])

for antiga, nova in REDIRECIONA.items():
    alvo = BASE + (nova + EXT if nova else '')
    d = os.path.join(ROOT, antiga + '.html')
    os.makedirs(os.path.dirname(d), exist_ok=True)
    open(d, 'w', encoding='utf-8').write(f'''<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>STRAHL</title>
<link rel="canonical" href="{DOMINIO + nova}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url={alvo}">
</head><body><p>Esta página mudou. <a href="{alvo}">Ir para o site da STRAHL</a>.</p>
<script>location.replace("{alvo}");</script></body></html>
''')

linhas_sm = ''.join(f'  <url><loc>{DOMINIO + r}</loc></url>\n' for r in gerados)
open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write(
    f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{linhas_sm}</urlset>\n')
robots = ('User-agent: *\nAllow: /\n\nSitemap: https://www.strahl.com/sitemap.xml\n' if MODO == 'producao'
          else 'User-agent: *\nDisallow: /\n')
open(os.path.join(ROOT, 'robots.txt'), 'w', encoding='utf-8').write(robots)
print(f'{MODO}: {len(gerados)} páginas, {len(REDIRECIONA)} redirecionamento, sitemap com {len(gerados)} URLs')

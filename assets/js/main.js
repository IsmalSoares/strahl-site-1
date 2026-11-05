  // ─── Mobile nav accordion groups ───
  function toggleMobileGroup(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('open');
  }

  // ─── Mobile nav toggle ───
  function toggleMobileNav() {
    var nav = document.getElementById('mobile-nav');
    var btn = document.getElementById('nav-toggle');
    if (!nav) return;
    var isOpen = nav.style.display === 'flex';
    // Encosta o painel logo abaixo do topo, qualquer que seja a altura do header
    var header = document.querySelector('header');
    if (header) nav.style.top = header.getBoundingClientRect().bottom + 'px';
    nav.style.display = isOpen ? 'none' : 'flex';
    document.body.classList.toggle('nav-open', !isOpen);
    if (btn) btn.setAttribute('aria-expanded', String(!isOpen));
  }
  function closeMobileNav() {
    var nav = document.getElementById('mobile-nav');
    var btn = document.getElementById('nav-toggle');
    if (nav) nav.style.display = 'none';
    if (btn) btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  // ─── Datasheet image switcher (3076) ───
  function dsSetImg(thumb, src) {
    document.querySelectorAll('#page-datasheet .ds-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumb.classList.add('active');
    var main = document.getElementById('ds-main-photo');
    if (main) main.src = src;
  }

  // ─── Datasheet image switcher (4079) ───
  function ds4079SetImg(thumb, src) {
    document.querySelectorAll('#page-datasheet-4079 .ds-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumb.classList.add('active');
    var main = document.getElementById('ds-4079-main-photo');
    if (main) main.src = src;
  }

  // ─── Datasheet image switcher (5276) ───
  function ds5276SetImg(thumb, src) {
    document.querySelectorAll('#page-datasheet-5276 .ds-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumb.classList.add('active');
    var main = document.getElementById('ds-5276-main-photo');
    if (main) main.src = src;
  }

  // ─── Endereço de cada página no site publicado (uma URL por página) ───
  // Mantém as URLs já indexadas do strahl.com. Ver build_urls.py.
  var ROTAS = {
    'home': '',
    'cekton': 'linhas/tomadas-e-plugues-industriais',
    'storm-block': 'linhas/storm-block',
    'schuko': 'linhas/schuko',
    'mining-termoplastica': 'linhas/tomadas-e-plugues-mining-block',
    'mining-ultrarresistente': 'linhas/tomadas-e-plugues-mining-block/ultrarresistente',
    'mining-aluminio': 'linhas/tomadas-e-plugues-mining-block/carcaca-de-aluminio',
    'mining-altacorrente': 'linhas/tomadas-e-plugues-mining-block/alta-corrente',
    'unidades-combinadas': 'linhas/unidades-combinadas',
    'qd': 'linhas/quadros-de-distribuicao',
    'cmas': 'linhas/centros-de-medicao-agrupada',
    'caixas-modulares': 'linhas/caixas-modulares',
    'qgbt-qdc': 'linhas/qgbt-e-qdc',
    'caixas-metalicas': 'linhas/caixas-metalicas-e-barramentos-blindados',
    'caixas-individuais': 'linhas/caixas-de-medicao-individuais',
    'caixas-passagem': 'linhas/caixas-de-passagem-e-distribuicao',
    'acessorios': 'linhas/acessorios',
    'hidrometro': 'linhas/caixas-para-hidrometro',
    'individualizacao-agua': 'linhas/individualizacao-de-medicao-de-agua',
    'predial-residencial': 'linhas/predial-e-residencial',
    'segmento-industrial': 'segmentos/linha-industrial',
    'construcao-civil': 'segmentos/construcao-civil',
    'distribuidores': 'segmentos/distribuidores',
    'revendedores': 'segmentos/revendedores',
    'sobre': 'strahl',
    'contato': 'contato',
    'representantes': 'representantes',
    'cursos': 'cursos-e-treinamentos',
    'datasheet': 'produtos/3076-ck',
    'datasheet-4079': 'produtos/4079-ck',
    'datasheet-5276': 'produtos/5276-ck',
    'datasheet-bem4406': 'produtos/bem-4406',
    'datasheet-bm4206': 'produtos/bm-4206'
  };

  // ─── Core page switcher ───
  // No arquivo completo (index-fonte.html) todas as páginas estão juntas e a troca é feita aqui.
  // No site publicado cada página é um arquivo; se a página pedida não está neste arquivo, abre a URL dela.
  function goTo(page) {
    if (!document.getElementById('page-' + page) && ROTAS.hasOwnProperty(page)) {
      var base = document.querySelector('base');
      var ext = document.documentElement.getAttribute('data-ext') || '';
      var rota = ROTAS[page];
      location.href = (base ? base.getAttribute('href') : '/') + (rota ? rota + ext : '');
      return;
    }
    closeMobileNav();
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
    marcarMenu(page);
  }

  // Sublinha no menu a seção da página aberta (também ao carregar cada página publicada)
  function marcarMenu(page) {
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    var navMap = {
      'home': null,
      'cekton': 'nav-plugues',
      'datasheet': 'nav-plugues',
      'datasheet-4079': 'nav-plugues',
      'datasheet-5276': 'nav-plugues',
      'storm-block': 'nav-plugues',
      'mining-termoplastica': 'nav-plugues',
      'mining-ultrarresistente': 'nav-plugues',
      'mining-aluminio': 'nav-plugues',
      'mining-altacorrente': 'nav-plugues',
      'schuko': 'nav-plugues',
      'unidades-combinadas': 'nav-uc',
      'qd': 'nav-qd',
      'cmas': 'nav-cma',
      'caixas-modulares': 'nav-cma',
      'qgbt-qdc': 'nav-cma',
      'caixas-metalicas': 'nav-cma',
      'caixas-individuais': 'nav-cma',
      'caixas-passagem': 'nav-cma',
      'acessorios': 'nav-cma',
      'hidrometro': 'nav-agua',
      'individualizacao-agua': 'nav-agua',
      'sobre': 'nav-sobre',
      'contato': 'nav-contato',
      'representantes': 'nav-contato',
      'cursos': 'nav-sobre'
    };
    document.querySelectorAll('.seg-item').forEach(function(el) { el.classList.toggle('active', el.getAttribute('data-page') === page); });
    var navId = navMap[page];
    if (navId) {
      var navEl = document.getElementById(navId);
      if (navEl) navEl.classList.add('active');
    }
  }

  // ─── Dropdown toggle on click ───
  function toggleDropdown(e) {
    e.stopPropagation();
    var dropdown = e.currentTarget.closest('.nav-dropdown');
    var isOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
    if (!isOpen) dropdown.classList.add('open');
  }

  document.addEventListener('click', function() {
    document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
  });

  // ─── SKU links ───
  document.addEventListener('click', function(e) {
    var sku = e.target.closest('a.sku');
    if (!sku) return;
    e.preventDefault();
    var code = sku.textContent.trim();
    if (code === '3076/CK') goTo('datasheet');
    if (code === '4079/CK') goTo('datasheet-4079');
    if (code === '5276/CK') goTo('datasheet-5276');
  });

  // ─── DS sub-nav buttons (with anchor scroll) ───
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.ds-nav-btn');
    if (!btn) return;
    var navBar = btn.closest('.ds-nav-bar');
    if (navBar) navBar.querySelectorAll('.ds-nav-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var targetId = btn.getAttribute('data-target');
    if (targetId) {
      var target = document.getElementById(targetId);
      if (target) {
        var headerH = 92;  // header sticky
        var navH = navBar ? navBar.offsetHeight : 0;
        var offset = target.getBoundingClientRect().top + window.pageYOffset - headerH - navH - 16;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  });

  // ─── SD Viewer: toggle foto/desenho (Unidades Combinadas) ───
  function sdToggle(btn, showId, hideId) {
    var viewer = btn.closest('.sd-viewer');
    viewer.querySelectorAll('.sd-tab').forEach(function(t) { t.classList.remove('active'); });
    btn.classList.add('active');
    var show = document.getElementById(showId);
    var hide = document.getElementById(hideId);
    if (show) { show.classList.add('sd-active'); show.style.display = ''; }
    if (hide) { hide.classList.remove('sd-active'); hide.style.display = 'none'; }
  }

  // ─── Storm Block: tab de tipo de produto ───
  function sbTab(btn, type) {
    document.querySelectorAll('#page-storm-block .sb-panel').forEach(function(p) { p.style.display = 'none'; });
    var panel = document.getElementById('sb-' + type);
    if (panel) panel.style.display = '';
    document.querySelectorAll('#page-storm-block .mining-series-btn').forEach(function(b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
  }

// ─── Cat thumb zoom — overlay filho direto do body, sempre acima de tudo ───
(function() {
  var GAP = 12, MARGIN = 8, SIZE = 220;
  var overlay = null;

  function getOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'cat-zoom-overlay';
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'z-index:99999',
      'width:' + SIZE + 'px',
      'height:' + SIZE + 'px',
      'background:#fff',
      'border:1px solid #dde2ea',
      'border-radius:6px',
      'padding:8px',
      'box-shadow:0 8px 32px rgba(0,0,0,.20)',
      'pointer-events:none',
      'box-sizing:border-box'
    ].join(';');
    var img = document.createElement('img');
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block';
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    return overlay;
  }

  document.addEventListener('mouseover', function(e) {
    var wrap = e.target.closest('.cat-thumb-wrap');
    if (!wrap) return;
    var thumb = wrap.querySelector('.cat-thumb');
    if (!thumb) return;
    var ov = getOverlay();
    ov.querySelector('img').src = thumb.src;
    var r = wrap.getBoundingClientRect();
    var top  = r.top + r.height / 2 - SIZE / 2;
    var left = r.right + GAP;
    if (left + SIZE > window.innerWidth  - MARGIN) left = r.left - SIZE - GAP;
    if (top  < MARGIN) top = MARGIN;
    if (top  + SIZE > window.innerHeight - MARGIN) top = window.innerHeight - SIZE - MARGIN;
    ov.style.left    = left + 'px';
    ov.style.top     = top  + 'px';
    ov.style.display = 'block';
  });

  document.addEventListener('mouseout', function(e) {
    var wrap = e.target.closest('.cat-thumb-wrap');
    if (!wrap) return;
    if (wrap.contains(e.relatedTarget)) return;
    if (overlay) overlay.style.display = 'none';
  });
})();

// Datasheet: troca imagem principal com ID customizado
function dsSetImgCustom(imgId, thumb, src) {
  var el = document.getElementById(imgId);
  if (el) el.src = src;
  var panel = thumb.closest('.ds-thumbs');
  if (panel) panel.querySelectorAll('.ds-thumb').forEach(function(t){ t.classList.remove('active'); });
  thumb.classList.add('active');
}


  // ─── Kit Técnico: formulário que envia o pedido para o WhatsApp de vendas ───
  // Datasheets, desenhos e DWG são enviados pela equipe após o contato.
  var KIT_WHATSAPP = '551150393999';

  function abrirKitTecnico(produto) {
    var ov = document.getElementById('kit-overlay');
    if (!ov) return;
    var campo = document.getElementById('kit-produto');
    if (campo) campo.value = produto || '';
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
    var nome = document.getElementById('kit-nome');
    if (nome) setTimeout(function() { nome.focus(); }, 50);
  }

  function fecharKitTecnico() {
    var ov = document.getElementById('kit-overlay');
    if (ov) ov.classList.remove('open');
    document.body.style.overflow = '';
  }

  function enviarKitTecnico(e) {
    e.preventDefault();
    var f = e.target;
    var v = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var linhas = [
      'Olá, STRAHL! Gostaria de solicitar o *Kit Técnico* (datasheet, desenhos e DWG).',
      '',
      '*Produto/linha:* ' + (v('kit-produto') || '-'),
      '*Nome:* ' + v('kit-nome'),
      '*Empresa:* ' + v('kit-empresa'),
      '*E-mail:* ' + v('kit-email'),
      '*WhatsApp:* ' + v('kit-telefone'),
      '*Perfil:* ' + v('kit-perfil'),
      '*Projeto/concessionária/região:* ' + (v('kit-projeto') || '-')
    ];
    if (v('kit-mensagem')) linhas.push('*Mensagem:* ' + v('kit-mensagem'));
    linhas.push('', 'Autorizo o contato da STRAHL conforme a LGPD.');
    var url = 'https://api.whatsapp.com/send/?phone=' + KIT_WHATSAPP + '&text=' + encodeURIComponent(linhas.join('\n')) + '&type=phone_number&app_absent=0';
    window.open(url, '_blank');
    fecharKitTecnico();
    f.reset();
  }

  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') fecharKitTecnico(); });

  // ─── Formulário da página Contato: abre o WhatsApp de vendas com a mensagem preenchida ───
  function enviarContato(e) {
    e.preventDefault();
    var f = e.target;
    var v = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var linhas = [
      'Olá, STRAHL! Vim pelo site e gostaria de falar com vendas.',
      '',
      '*Assunto:* ' + v('ct-assunto'),
      '*Linha de interesse:* ' + (v('ct-linha') || '-'),
      '*Nome:* ' + v('ct-nome'),
      '*Empresa:* ' + (v('ct-empresa') || '-'),
      '*E-mail:* ' + v('ct-email'),
      '*WhatsApp:* ' + v('ct-telefone'),
      '*Cidade/UF:* ' + v('ct-cidade'),
      '*Mensagem:* ' + v('ct-mensagem'),
      '',
      'Autorizo o contato da STRAHL conforme a LGPD.'
    ];
    var url = 'https://api.whatsapp.com/send/?phone=' + KIT_WHATSAPP + '&text=' + encodeURIComponent(linhas.join('\n')) + '&type=phone_number&app_absent=0';
    window.open(url, '_blank');
    f.reset();
  }


  // ─── Abrir página pelo endereço (#nome-da-pagina), ex.: index.html#contato ───
  function abrirPorHash() {
    var id = decodeURIComponent((location.hash || '').replace('#', ''));
    if (id && (document.getElementById('page-' + id) || ROTAS.hasOwnProperty(id))) goTo(id);
  }
  window.addEventListener('hashchange', abrirPorHash);
  document.addEventListener('DOMContentLoaded', abrirPorHash);
  document.addEventListener('DOMContentLoaded', function() {
    var ativa = document.querySelector('.page.active');
    if (ativa) marcarMenu(ativa.id.replace('page-', ''));
  });


  // ─── Ajustes para celular ───
  // 1) Graus IP/IK: copia cada coluna da grade (número, ícone e descrição) para uma lista vertical,
  //    mostrada só em telas pequenas (CSS .ip-list). A grade original continua no computador.
  // 2) Tabelas "Qual escolher?": cada célula recebe o nome da coluna, usado nos cartões do celular.
  // 3) Tabelas de seleção: só a tabela rola de lado, não o bloco com o título.
  function ajustesCelular() {
    document.querySelectorAll('.page div').forEach(function(card) {
      var grades = Array.prototype.filter.call(card.children, function(c) {
        return /grid-template-columns:\s*repeat\(/.test(c.getAttribute('style') || '');
      });
      var cab = card.firstElementChild;
      if (grades.length < 3 || !cab || !/Algarismo/.test(cab.textContent)) return;
      var nums = grades[0].children, icos = grades[1].children, txts = grades[2].children;
      var ul = document.createElement('ul');
      ul.className = 'ip-list';
      for (var i = 0; i < nums.length; i++) {
        var on = /var\(--red\)/.test(nums[i].getAttribute('style') || '');
        var li = document.createElement('li');
        if (on) li.className = 'ip-on';
        li.innerHTML = '<div class="ip-num">' + nums[i].textContent.trim() + '</div>' +
          '<div class="ip-ico">' + (icos[i] ? icos[i].innerHTML : '') + '</div>' +
          '<div class="ip-txt">' + (txts[i] ? txts[i].textContent.trim() : '') + '</div>';
        ul.appendChild(li);
      }
      grades.forEach(function(g) { g.classList.add('ip-grid'); });
      grades[grades.length - 1].insertAdjacentElement('afterend', ul);
    });
    document.querySelectorAll('table.lr-compare').forEach(function(t) {
      var heads = Array.prototype.map.call(t.querySelectorAll('thead th'), function(th) { return th.textContent.trim(); });
      t.querySelectorAll('tbody tr').forEach(function(tr) {
        Array.prototype.forEach.call(tr.children, function(td, i) { if (heads[i]) td.setAttribute('data-label', heads[i]); });
      });
    });
    document.querySelectorAll('.ip-block table.sel-table').forEach(function(t) {
      if (t.parentElement.classList.contains('table-scroll')) return;
      var w = document.createElement('div');
      w.className = 'table-scroll';
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }
  document.addEventListener('DOMContentLoaded', ajustesCelular);

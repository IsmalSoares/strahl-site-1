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

  // ─── Core page switcher ───
  function goTo(page) {
    closeMobileNav();
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });

    // Atualiza sublinhado ativo no nav
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
      'qd': 'nav-qd'
    };
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

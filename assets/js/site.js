(function () {
  var root = document.documentElement;

  // 밝게·어둡게
  var themeBtn = document.getElementById('theme-toggle');
  function isDark() {
    var t = root.dataset.theme;
    if (t) return t === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // 분류 펼침은 바깥을 누르면 닫음
  var cats = document.querySelector('.nav__cats');
  document.addEventListener('click', function (e) { if (cats && cats.open && !cats.contains(e.target)) cats.open = false; });

  // 목차
  var prose = document.getElementById('prose');
  var toc = document.getElementById('toc');
  if (prose && toc) {
    var heads = prose.querySelectorAll('h2, h3');
    if (heads.length >= 2) {
      var list = document.getElementById('toc-list');
      var links = [];
      heads.forEach(function (h, i) {
        if (!h.id) h.id = 'sec-' + (i + 1);
        var li = document.createElement('li');
        li.className = 'toc-' + h.tagName.toLowerCase();
        var a = document.createElement('a');
        a.href = '#' + h.id; a.textContent = h.textContent;
        li.appendChild(a); list.appendChild(li); links.push(a);
      });
      toc.hidden = false;
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              links.forEach(function (l) { l.classList.toggle('is-on', l.getAttribute('href') === '#' + en.target.id); });
            }
          });
        }, { rootMargin: '-15% 0px -70% 0px' });
        heads.forEach(function (h) { io.observe(h); });
      }
    }
  }

  // 찾기
  var box = document.getElementById('search');
  var input = document.getElementById('search-input');
  var out = document.getElementById('search-list');
  var data = null, picked = 0, lastFocus = null;
  function load() {
    if (data) return Promise.resolve(data);
    return fetch(window.SEARCH_URL).then(function (r) { return r.json(); }).then(function (d) { data = d; return d; });
  }
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    var q = input.value.trim().toLowerCase();
    var words = q.split(/\s+/).filter(Boolean);
    var hits = (data || []).filter(function (p) {
      var hay = (p.t + ' ' + (p.g || []).join(' ') + ' ' + p.s + ' ' + p.x).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }).slice(0, 12);
    picked = 0;
    if (!hits.length) { out.innerHTML = '<li class="none">' + (q ? T.no_hit : T.no_posts) + '</li>'; return; }
    out.innerHTML = hits.map(function (p, i) {
      return '<li><a href="' + esc(p.u) + '"' + (i === 0 ? ' class="is-on"' : '') + '><span class="t">' + esc(p.t) + '</span><span class="s">' + esc(p.d) + ' · ' + esc(p.s).slice(0, 90) + '</span></a></li>';
    }).join('');
  }
  function openSearch() {
    lastFocus = document.activeElement;
    box.hidden = false; input.value = ''; input.focus();
    load().then(render).catch(function () { out.innerHTML = '<li class="none">' + T.load_fail + '</li>'; });
  }
  function closeSearch() { box.hidden = true; if (lastFocus) lastFocus.focus(); }
  function move(d) {
    var as = out.querySelectorAll('a'); if (!as.length) return;
    as[picked].classList.remove('is-on');
    picked = (picked + d + as.length) % as.length;
    as[picked].classList.add('is-on'); as[picked].scrollIntoView({ block: 'nearest' });
  }
  if (box) {
    document.getElementById('search-open').addEventListener('click', openSearch);
    document.getElementById('search-close').addEventListener('click', closeSearch);
    box.addEventListener('click', function (e) { if (e.target === box) closeSearch(); });
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { var a = out.querySelector('a.is-on'); if (a) location.href = a.href; }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) closeSearch();
      var tag = (e.target.tagName || '').toLowerCase();
      if (e.key === '/' && box.hidden && tag !== 'input' && tag !== 'textarea') { e.preventDefault(); openSearch(); }
    });
  }
})();

/* Lightweight client-side search over search-index.json.
   No dependencies. Token-based scoring on title/tags/body. */
(function () {
  var input = document.getElementById('q');
  var results = document.getElementById('results');
  var meta = document.getElementById('search-meta');
  if (!input || !results) return;

  var INDEX = [];
  var ready = false;

  fetch('assets/search-index.json')
    .then(function (r) { return r.json(); })
    .then(function (data) { INDEX = data; ready = true; run(getQuery()); })
    .catch(function () { meta.textContent = 'Could not load the search index.'; });

  function getQuery() {
    var m = new URLSearchParams(location.search).get('q');
    if (m) { input.value = m; }
    return input.value;
  }

  function esc(s) { return s.replace(/[&<>"]/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  function highlight(text, terms) {
    var out = esc(text);
    terms.forEach(function (t) {
      if (t.length < 2) return;
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function score(entry, terms) {
    var s = 0;
    var title = entry.title.toLowerCase();
    var tags = (entry.tags || []).join(' ').toLowerCase();
    var body = entry.body.toLowerCase();
    terms.forEach(function (t) {
      if (title.indexOf(t) !== -1) s += 10;
      if (tags.indexOf(t) !== -1) s += 6;
      var idx = body.indexOf(t), n = 0;
      while (idx !== -1) { n++; idx = body.indexOf(t, idx + t.length); }
      s += Math.min(n, 5) * 2;
    });
    return s;
  }

  function snippet(entry, terms) {
    var body = entry.body;
    var lower = body.toLowerCase();
    var pos = -1;
    for (var i = 0; i < terms.length; i++) { pos = lower.indexOf(terms[i]); if (pos !== -1) break; }
    if (pos === -1) pos = 0;
    var start = Math.max(0, pos - 90);
    var end = Math.min(body.length, pos + 190);
    var frag = (start > 0 ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '');
    return highlight(frag, terms);
  }

  function run(query) {
    if (!ready) return;
    var q = (query || '').trim().toLowerCase();
    results.innerHTML = '';
    if (!q) { meta.textContent = 'Type to search ' + INDEX.length + ' entries across the timeline.'; return; }
    var terms = q.split(/\s+/).filter(Boolean);
    var scored = INDEX
      .map(function (e) { return { e: e, s: score(e, terms) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });

    meta.textContent = scored.length + ' result' + (scored.length === 1 ? '' : 's') + ' for “' + query.trim() + '”';
    scored.slice(0, 40).forEach(function (x) {
      var e = x.e;
      var div = document.createElement('div');
      div.className = 'result';
      div.innerHTML =
        '<p class="crumb">' + esc(e.section || '') + (e.date ? ' · ' + esc(e.date) : '') + '</p>' +
        '<a class="result-title" href="' + e.url + '">' + highlight(e.title, terms) + '</a>' +
        '<p>' + snippet(e, terms) + '</p>';
      results.appendChild(div);
    });
  }

  var t;
  input.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var u = new URL(location);
      if (input.value) u.searchParams.set('q', input.value); else u.searchParams.delete('q');
      history.replaceState(null, '', u);
      run(input.value);
    }, 120);
  });
})();

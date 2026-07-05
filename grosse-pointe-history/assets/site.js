/* Shared: theme toggle + active nav highlight. */
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('gp-theme'); } catch (e) {}
  if (saved) root.setAttribute('data-theme', saved);

  function wire() {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var setLabel = function () {
        var isDark = root.getAttribute('data-theme') === 'dark' ||
          (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
        btn.textContent = isDark ? '☀' : '☾';
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      };
      setLabel();
      btn.addEventListener('click', function () {
        var isDark = root.getAttribute('data-theme') === 'dark' ||
          (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
        var next = isDark ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('gp-theme', next); } catch (e) {}
        setLabel();
      });
    }
    // active nav
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === here) a.setAttribute('aria-current', 'page');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();

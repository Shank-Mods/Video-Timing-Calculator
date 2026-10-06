/* Shared tool switcher for the Video-Timing-Calculator pages: turns the page's <h1> title into a dropdown menu.
   Lives in the repo root. Each page loads it with one <script> tag (and links shared.css).
   TO ADD A NEW TOOL: add one line to TOOLS below (path is relative to the repo root),
   then add the <script> tag and the shared.css link to the new page. Nothing else needs editing. */
(function () {
  var TOOLS = [
    { name: "Timing Calculator", path: "" },
    { name: "Resolution Graph", path: "resolution-graph/" },
    { name: "CRT Mask Calculator", path: "crt-mask-calculator/" }
  ];

  // Saved light/dark choice (falls back to the system setting when nothing is saved)
  var KEY = "vtc-theme", root = document.documentElement;
  try { var sv = localStorage.getItem(KEY); if (sv === "light" || sv === "dark") root.setAttribute("data-theme", sv); } catch (e) {}
  var effective = function () {
    return root.getAttribute("data-theme") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  };

  var h1 = document.querySelector("main h1") || document.querySelector("h1");
  if (!h1) return;
  var tag = document.querySelector('script[src$="tools.js"]');
  var base = new URL(".", tag ? tag.src : location.href);
  var norm = function (p) { return p.replace(/index\.html$/, "").replace(/\/+$/, ""); };
  var here = norm(location.pathname);

  var css = document.createElement("style");
  css.textContent =
    ".tools-wrap{position:relative}" +
    ".tools-wrap h1{padding-right:48px}" +
    ".tools-theme{position:absolute;right:0;top:0;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;padding:0;" +
    "color:var(--ink,#1a2230);background:var(--panel,#fff);border:1px solid var(--line,#d3d9e2);border-radius:8px;cursor:pointer}" +
    ".tools-theme:hover{border-color:var(--accent,#2a56c6)}" +
    ".tools-theme:focus-visible{outline:2px solid var(--accent,#2a56c6);outline-offset:1px}" +
    ".tools-theme svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
    ".tools-btn{display:inline-flex;align-items:center;gap:.35em;max-width:100%;margin:0 0 0 -10px;padding:2px 10px;font:inherit;letter-spacing:inherit;text-align:left;" +
    "color:inherit;background:transparent;border:1px solid transparent;border-radius:8px;cursor:pointer}" +
    ".tools-btn:hover,.tools-btn[aria-expanded=true]{background:var(--panel,#fff);border-color:var(--line,#d3d9e2)}" +
    ".tools-btn:focus-visible{outline:2px solid var(--accent,#2a56c6);outline-offset:1px}" +
    ".tools-btn svg{width:.55em;height:.55em;flex:none;stroke:var(--accent,#2a56c6);fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;transition:transform .15s}" +
    ".tools-btn[aria-expanded=true] svg{transform:rotate(180deg)}" +
    ".tools-menu{position:absolute;left:0;top:100%;z-index:50;margin-top:2px;min-width:250px;max-width:calc(100vw - 24px);padding:6px;" +
    "font:500 15px/1.3 'IBM Plex Sans',system-ui,sans-serif;letter-spacing:0;" +
    "background:var(--panel,#fff);border:1px solid var(--line,#d3d9e2);border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.25)}" +
    ".tools-menu[hidden]{display:none}" +
    ".tools-menu a{display:block;padding:11px 12px;border-radius:4px;color:var(--ink,#1a2230);text-decoration:none}" +
    ".tools-menu a:hover{background:var(--bg,#eceff3)}" +
    ".tools-menu a[aria-current]{background:var(--hero,#e7edfb);color:var(--accent,#2a56c6);font-weight:600}";
  document.head.appendChild(css);

  var title = h1.textContent.trim();
  var wrap = document.createElement("div");
  wrap.className = "tools-wrap";
  h1.parentNode.insertBefore(wrap, h1);
  wrap.appendChild(h1);

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tools-btn";
  btn.setAttribute("aria-haspopup", "true");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "tools-menu");
  btn.setAttribute("aria-label", title + " - switch tool");
  btn.appendChild(document.createTextNode(title));
  btn.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>');
  h1.textContent = "";
  h1.appendChild(btn);

  var menu = document.createElement("nav");
  menu.id = "tools-menu";
  menu.className = "tools-menu";
  menu.setAttribute("aria-label", "Tools");
  menu.hidden = true;
  TOOLS.forEach(function (t) {
    var url = new URL(t.path, base);
    var a = document.createElement("a");
    a.href = url.href;
    a.textContent = t.name;
    if (norm(url.pathname) === here) a.setAttribute("aria-current", "page");
    menu.appendChild(a);
  });
  wrap.appendChild(menu);

  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var tb = document.createElement("button");
  tb.type = "button";
  tb.className = "tools-theme";
  var paint = function () {
    var dark = effective() === "dark";
    tb.innerHTML = dark ? SUN : MOON;
    tb.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    tb.title = dark ? "Switch to light mode" : "Switch to dark mode";
  };
  tb.addEventListener("click", function () {
    var next = effective() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    paint();
  });
  paint();
  wrap.appendChild(tb);

  var set = function (open) { menu.hidden = !open; btn.setAttribute("aria-expanded", open ? "true" : "false"); };
  btn.addEventListener("click", function (e) { e.stopPropagation(); set(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) set(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { set(false); btn.focus(); } });
  window.addEventListener("pageshow", function () { set(false); });
})();

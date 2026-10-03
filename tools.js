/* Shared "Tools" navigation bar for the Video-Timing-Calculator pages.
   Lives in the repo root. Each page loads it with one <script> tag.
   TO ADD A NEW TOOL: add one line to TOOLS below (path is relative to the repo root),
   then add the same <script> tag to the new page. Nothing else needs editing. */
(function () {
  var TOOLS = [
    { name: "Timing Calculator", path: "" },
    { name: "Resolution Graph", path: "resolution-graph/" }
  ];

  var tag = document.querySelector('script[src$="tools.js"]');
  var base = new URL(".", tag ? tag.src : location.href);
  var norm = function (p) { return p.replace(/index\.html$/, "").replace(/\/+$/, ""); };
  var here = norm(location.pathname);

  var css = document.createElement("style");
  css.textContent =
    ".tools-nav{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;padding:6px 12px;" +
    "font:14px/1.2 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;" +
    "border-bottom:1px solid color-mix(in srgb,currentColor 18%,transparent)}" +
    ".tools-nav span{opacity:.6;margin-right:4px}" +
    ".tools-nav a{color:inherit;text-decoration:none;padding:7px 12px;border-radius:999px;border:1px solid transparent}" +
    ".tools-nav a:hover{border-color:color-mix(in srgb,currentColor 35%,transparent)}" +
    ".tools-nav a[aria-current]{background:color-mix(in srgb,currentColor 14%,transparent);font-weight:600}";
  document.head.appendChild(css);

  var nav = document.createElement("nav");
  nav.className = "tools-nav";
  nav.setAttribute("aria-label", "Tools");
  nav.innerHTML = "<span>Tools:</span>";
  TOOLS.forEach(function (t) {
    var url = new URL(t.path, base);
    var a = document.createElement("a");
    a.href = url.href;
    a.textContent = t.name;
    if (norm(url.pathname) === here) a.setAttribute("aria-current", "page");
    nav.appendChild(a);
  });
  document.body.insertBefore(nav, document.body.firstChild);
})();

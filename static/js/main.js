document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("is-open");
    });
  }

  var heroCode = document.getElementById("hero-code-body");
  if (heroCode) {
    typewriteHeroCode(heroCode);
  }

  if (document.querySelector(".skills__diagram")) {
    drawSkillLines();
    window.addEventListener("load", drawSkillLines);
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(drawSkillLines, 150);
    });
  }

  var pills = document.querySelectorAll(".filter-pill");
  var groups = document.querySelectorAll(".year-group");
  if (pills.length && groups.length) {
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("is-active"); });
        pill.classList.add("is-active");
        var year = pill.getAttribute("data-year");
        groups.forEach(function (group) {
          var show = year === "all" || group.getAttribute("data-year") === year;
          group.style.display = show ? "" : "none";
        });
      });
    });
  }
});

function drawSkillLines() {
  var svgNS = "http://www.w3.org/2000/svg";
  var diagram = document.querySelector(".skills__diagram");
  var svg = diagram && diagram.querySelector(".skills__lines");
  var hub = diagram && diagram.querySelector(".skills__hub");
  if (!diagram || !svg || !hub) return;
  if (getComputedStyle(svg).display === "none") return;

  var leftNodes = diagram.querySelectorAll('.skills__node[data-side="left"]');
  var rightNodes = diagram.querySelectorAll('.skills__node[data-side="right"]');
  if (!leftNodes.length && !rightNodes.length) return;

  var containerRect = diagram.getBoundingClientRect();
  var hubRect = hub.getBoundingClientRect();
  var hubY = hubRect.top - containerRect.top + hubRect.height / 2;
  var hubLeftX = hubRect.left - containerRect.left;
  var hubRightX = hubRect.right - containerRect.left;

  svg.innerHTML =
    '<defs><marker id="skills-arrow" viewBox="0 0 8 8" refX="6" refY="4"' +
    ' markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
    '<path d="M0,0 L8,4 L0,8 Z" class="skills__arrow"></path></marker></defs>';

  function addPath(d) {
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "skills__line");
    path.setAttribute("marker-end", "url(#skills-arrow)");
    svg.appendChild(path);
  }

  function addDot(x, y) {
    var circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 2.5);
    circle.setAttribute("class", "skills__dot");
    svg.appendChild(circle);
  }

  if (leftNodes.length) addDot(hubLeftX, hubY);
  if (rightNodes.length) addDot(hubRightX, hubY);

  leftNodes.forEach(function (node) {
    var r = node.getBoundingClientRect();
    var nodeX = r.right - containerRect.left;
    var nodeY = r.top - containerRect.top + r.height / 2;
    var trunkX = hubLeftX - (hubLeftX - nodeX) / 2;
    addPath(
      "M " + hubLeftX + " " + hubY +
      " L " + trunkX + " " + hubY +
      " L " + trunkX + " " + nodeY +
      " L " + nodeX + " " + nodeY
    );
  });

  rightNodes.forEach(function (node) {
    var r = node.getBoundingClientRect();
    var nodeX = r.left - containerRect.left;
    var nodeY = r.top - containerRect.top + r.height / 2;
    var trunkX = hubRightX + (nodeX - hubRightX) / 2;
    addPath(
      "M " + hubRightX + " " + hubY +
      " L " + trunkX + " " + hubY +
      " L " + trunkX + " " + nodeY +
      " L " + nodeX + " " + nodeY
    );
  });
}

function typewriteHeroCode(container) {
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var lineEls = Array.prototype.slice.call(container.querySelectorAll(".line"));
  if (!lineEls.length) return;
  var lines = lineEls.map(function (el) {
    return el.textContent.replace(/\u200B/g, "");
  });

  // Freeze the box height so clearing/retyping the content never shifts layout.
  container.style.minHeight = container.offsetHeight + "px";
  container.innerHTML = "";

  var caret = document.createElement("span");
  caret.className = "caret";

  var lineIndex = 0;
  var charIndex = 0;
  var currentLineEl = null;

  function nextLine() {
    currentLineEl = document.createElement("div");
    currentLineEl.className = "line";
    container.appendChild(currentLineEl);
    currentLineEl.appendChild(caret);
    charIndex = 0;
  }

  function tick() {
    var line = lines[lineIndex];
    if (charIndex < line.length) {
      currentLineEl.insertBefore(
        document.createTextNode(line.charAt(charIndex)),
        caret
      );
      charIndex++;
      setTimeout(tick, 12 + Math.random() * 14);
      return;
    }
    lineIndex++;
    if (lineIndex < lines.length) {
      setTimeout(function () {
        nextLine();
        tick();
      }, 160);
    } else {
      setTimeout(function () {
        if (caret.parentNode) caret.parentNode.removeChild(caret);
        container.style.minHeight = "";
      }, 600);
    }
  }

  nextLine();
  tick();
}

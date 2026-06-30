(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function observeReveal() {
    var els = document.querySelectorAll(".reveal");
    if (reduced) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function observeStagger() {
    var parents = document.querySelectorAll(".stagger-parent");
    var hero = document.getElementById("hero");
    if (hero) {
      hero.querySelectorAll(".stagger-parent").forEach(function (p) {
        p.classList.add("is-visible");
      });
    }
    if (reduced) {
      parents.forEach(function (p) {
        p.classList.add("is-visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.15 },
    );
    parents.forEach(function (p) {
      if (!hero || !hero.contains(p)) io.observe(p);
    });
  }

  function initGalleryHover() {
    document.querySelectorAll(".gallery-row--hover").forEach(function (row) {
      row.querySelectorAll(".gallery-card").forEach(function (card) {
        card.addEventListener("mouseenter", function () {
          row.classList.add("is-hovering");
        });
        card.addEventListener("mouseleave", function () {
          row.classList.remove("is-hovering");
        });
      });
    });
  }

  function initLightbox() {
    var lb = document.getElementById("screenshot-lightbox");
    if (!lb) return;
    var lbImg = lb.querySelector(".lightbox-img");
    var lbClose = lb.querySelector(".lightbox-close");

    function openLb(src, alt) {
      if (!src) return;
      lbImg.src = src;
      lbImg.alt = alt || "";
      lbImg.loading = "eager";
      lb.hidden = false;
      document.body.classList.add("lightbox-open");
      requestAnimationFrame(function () {
        lb.classList.add("is-active");
      });
    }

    function closeLb() {
      lb.classList.remove("is-active");
      document.body.classList.remove("lightbox-open");
      setTimeout(function () {
        lb.hidden = true;
        lbImg.removeAttribute("src");
      }, 350);
    }

    document.querySelectorAll(".lightbox-trigger").forEach(function (el) {
      el.addEventListener("click", function () {
        openLb(el.currentSrc || el.src, el.alt);
      });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLb();
    });
    if (lbClose) lbClose.addEventListener("click", closeLb);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lb.hidden) closeLb();
    });
  }

  function initPhoneScroll() {
    document.querySelectorAll(".phone-scroll-wrap").forEach(function (wrap) {
      var screen = wrap.querySelector(".phone-screen--scroll");
      var btn = wrap.querySelector(".phone-scroll-btn");
      if (!screen || !btn) return;
      var animId = null;
      var start = 0;
      var paused = false;
      var DUR = 5000;

      function cancelAnim() {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }

      function ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function run(ts) {
        if (!start) start = ts;
        var max = screen.scrollHeight - screen.clientHeight;
        var p = Math.min((ts - start) / DUR, 1);
        screen.scrollTop = ease(p) * max;
        if (p < 1 && !paused) animId = requestAnimationFrame(run);
        else {
          animId = null;
          start = 0;
          btn.classList.remove("is-playing");
        }
      }

      function pauseScroll() {
        if (btn.classList.contains("is-playing")) {
          paused = true;
          cancelAnim();
          btn.classList.remove("is-playing");
        }
      }

      btn.addEventListener("click", function () {
        cancelAnim();
        paused = false;
        screen.scrollTop = 0;
        start = 0;
        btn.classList.add("is-playing");
        animId = requestAnimationFrame(run);
      });
      screen.addEventListener("scroll", pauseScroll, { passive: true });
      screen.addEventListener("wheel", pauseScroll, { passive: true });
      screen.addEventListener("touchstart", pauseScroll, { passive: true });
    });
  }

  function initTilt() {
    if (reduced) return;

    document.querySelectorAll(".tilt-card").forEach(function (el) {
      var layers = el.querySelectorAll("[data-depth]");
      var gridBg = el.querySelector(".device-showcase__grid-bg");

      function onMove(e) {
        var r = el.getBoundingClientRect();
        var mx = ((e.clientX - r.left) / r.width) * 2 - 1;
        var my = ((e.clientY - r.top) / r.height) * 2 - 1;
        el.style.setProperty("--rx", mx * 7 + "deg");
        el.style.setProperty("--ry", -my * 7 + "deg");
        el.classList.add("is-tilting");
        if (gridBg) {
          gridBg.style.setProperty("--px0", mx * 12 + "px");
          gridBg.style.setProperty("--py0", my * 12 + "px");
        }
        layers.forEach(function (l) {
          var d = parseFloat(l.getAttribute("data-depth")) || 0.04;
          l.style.transform =
            "translate3d(" + mx * d * 500 + "px," + my * d * 500 + "px,0)";
        });
      }

      function reset() {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        el.classList.remove("is-tilting");
        if (gridBg) {
          gridBg.style.setProperty("--px0", "0px");
          gridBg.style.setProperty("--py0", "0px");
        }
        layers.forEach(function (l) {
          l.style.transform = "";
        });
      }

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", reset);
    });
  }

  function initComparison() {
    document.querySelectorAll("[data-compare]").forEach(function (wrap) {
      var range = wrap.querySelector(".compare-range");
      var mockup = wrap.querySelector(".compare-mockup");
      if (!range || !mockup) return;
      function setPos(v) {
        var pct = Math.max(0, Math.min(100, Number(v)));
        mockup.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
        var handle = wrap.querySelector(".compare-handle");
        if (handle) handle.style.left = pct + "%";
      }
      range.addEventListener("input", function () {
        setPos(range.value);
      });
      setPos(range.value || 50);
    });
  }

  function initCodeWindow() {
    document.querySelectorAll(".code-window").forEach(function (win) {
      var tabs = win.querySelectorAll(".code-tab");
      var panes = win.querySelectorAll(".code-pane");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var id = tab.getAttribute("data-tab");
          tabs.forEach(function (t) {
            t.classList.toggle("is-active", t === tab);
          });
          tab.style.transform = "scale(0.98)";
          setTimeout(function () {
            tab.style.transform = "";
          }, 120);
          panes.forEach(function (p) {
            var active = p.getAttribute("data-pane") === id;
            p.classList.toggle("is-active", active);
            if (active) {
              p.querySelectorAll(".code-line").forEach(function (line, i) {
                line.style.transitionDelay = reduced ? "0ms" : i * 45 + "ms";
              });
            }
          });
        });
      });
      var first = win.querySelector(".code-pane.is-active");
      if (first) {
        first.querySelectorAll(".code-line").forEach(function (line, i) {
          line.style.transitionDelay = reduced ? "0ms" : i * 45 + "ms";
        });
      }
    });
  }

  function initPageSpeed() {
    document.querySelectorAll(".ps-ring").forEach(function (ring) {
      if (reduced) {
        ring.classList.add("is-visible");
        var score = parseInt(ring.getAttribute("data-score"), 10) || 0;
        var val = ring.querySelector(".ps-ring-val");
        if (val) val.textContent = String(score);
        return;
      }
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-visible");
            var target = parseInt(e.target.getAttribute("data-score"), 10) || 0;
            var valEl = e.target.querySelector(".ps-ring-val");
            if (!valEl) return;
            var start = performance.now();
            function step(ts) {
              var p = Math.min((ts - start) / 1200, 1);
              valEl.textContent = String(Math.round(p * target));
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.unobserve(e.target);
          });
        },
        { threshold: 0.35 },
      );
      io.observe(ring);
    });
  }

  function initParallax() {
    if (reduced) return;
    document.querySelectorAll(".parallax-stage").forEach(function (stage) {
      var cards = stage.querySelectorAll(".parallax-card");
      if (!cards.length) return;
      var visible = false;
      var ticking = false;
      var io = new IntersectionObserver(
        function (entries) {
          visible = entries[0].isIntersecting;
        },
        { threshold: 0 },
      );
      io.observe(stage);
      window.addEventListener(
        "scroll",
        function () {
          if (!visible || ticking) return;
          ticking = true;
          requestAnimationFrame(function () {
            var rect = stage.getBoundingClientRect();
            var center = window.innerHeight * 0.5 - rect.top;
            var mobile = window.innerWidth < 640;
            cards.forEach(function (card, i) {
              var speed = parseFloat(card.getAttribute("data-speed")) || 0.2;
              var rot = mobile ? 0 : i % 2 === 0 ? -1.5 : 1.5;
              var base = [0, 24, 48, 72][i] || 0;
              card.style.transform =
                "translateY(" +
                (base + center * speed * (mobile ? 0.06 : 0.15)) +
                "px) rotate(" +
                rot +
                "deg)";
              card.style.willChange = visible ? "transform" : "auto";
            });
            ticking = false;
          });
        },
        { passive: true },
      );
    });
  }

  observeReveal();
  observeStagger();
  initGalleryHover();
  initLightbox();
  initPhoneScroll();
  initTilt();
  initComparison();
  initCodeWindow();
  initPageSpeed();
  initParallax();
})();

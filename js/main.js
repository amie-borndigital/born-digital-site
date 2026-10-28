/* Born Digital: mobile menu, FAQ accordion and gentle scroll reveal. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");

  if (toggle && menu) {
    var focusable = function () {
      return Array.prototype.slice.call(menu.querySelectorAll("a, button"));
    };

    var openMenu = function () {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.style.overflow = "hidden";
      var first = focusable()[0];
      if (first) first.focus();
    };

    var closeMenu = function (returnFocus) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", function () {
      if (menu.hidden) openMenu();
      else closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (menu.hidden) return;
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }
      // Keep keyboard focus inside the open menu (and its toggle).
      if (event.key === "Tab") {
        var items = [toggle].concat(focusable());
        var index = items.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (!event.shiftKey && index === items.length - 1) {
          event.preventDefault();
          items[0].focus();
        }
      }
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(false);
    });

    // Close the menu if the window grows to desktop width.
    var desktop = window.matchMedia("(min-width: 1200px)");
    var onChange = function () { if (desktop.matches && !menu.hidden) closeMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- FAQ accordion ---------- */
  var buttons = document.querySelectorAll(".accordion__button");

  Array.prototype.forEach.call(buttons, function (button) {
    var panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;

    // Panels are open in the HTML so the answers are readable without JavaScript.
    button.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");
    panel.setAttribute("inert", "");

    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      panel.classList.toggle("is-open", !open);
      if (open) panel.setAttribute("inert", "");
      else panel.removeAttribute("inert");
    });
  });

  /* ---------- Service cards: fade and slide in once, staggered ---------- */
  var cardGroups = document.querySelectorAll(".offer-grid, .service-grid");

  if ("IntersectionObserver" in window && cardGroups.length) {
    Array.prototype.forEach.call(cardGroups, function (group) {
      Array.prototype.forEach.call(group.querySelectorAll(".card-anim"), function (card, i) {
        card.style.setProperty("--reveal-delay", i * 100 + "ms");
      });
    });

    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var card = entry.target;
        card.classList.add("is-revealed");
        cardObserver.unobserve(card);
        // Drop the stagger once the card is in, so hover responds straight away.
        setTimeout(function () { card.style.removeProperty("--reveal-delay"); }, 1000);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

    Array.prototype.forEach.call(document.querySelectorAll(".card-anim"), function (card) {
      cardObserver.observe(card);
    });
    // Hide the cards for the reveal only now that the observer is ready.
    root.classList.add("cards-animate");
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  Array.prototype.forEach.call(reveals, function (el) { observer.observe(el); });
})();

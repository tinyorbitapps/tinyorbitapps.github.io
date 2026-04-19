const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const navAnchors = navLinks.querySelectorAll('a[href^="#"]');
const topButton = document.getElementById("back-to-top");
let currentAnimationFrame = null;

function getScrollOffset() {
  const header = navToggle.closest(".site-header");
  return header ? header.offsetHeight + 12 : 100;
}

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function animateScrollTo(top) {
  if (currentAnimationFrame) {
    cancelAnimationFrame(currentAnimationFrame);
  }

  const startY = window.scrollY;
  const distance = top - startY;
  const duration = 900;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      currentAnimationFrame = requestAnimationFrame(step);
    } else {
      currentAnimationFrame = null;
    }
  }

  currentAnimationFrame = requestAnimationFrame(step);
}

function smoothScrollTo(targetSelector) {
  const target = document.querySelector(targetSelector);

  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
  animateScrollTo(Math.max(top, 0));
}

function closeMenu() {
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  navLinks.classList.toggle("is-open", !isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    event.preventDefault();
    smoothScrollTo(anchor.getAttribute("href"));

    if (window.innerWidth <= 760) {
      closeMenu();
    }
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = event.target.closest(".navbar");

  if (!clickedInsideNav && navLinks.classList.contains("is-open")) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

function toggleTopButton() {
  topButton.classList.toggle("is-visible", window.scrollY > 320);
}

topButton.addEventListener("click", () => {
  animateScrollTo(0);
});

window.addEventListener("scroll", toggleTopButton, { passive: true });
toggleTopButton();

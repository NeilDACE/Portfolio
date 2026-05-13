const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("full-screen-menu");
const englishButton = document.getElementById("english-button");
const germanButton = document.getElementById("german-button");

menuToggle.addEventListener("click", () => {
  menuOverlay.classList.toggle("is-open");
  document.body.classList.toggle("no-scroll");
  if (menuToggle.classList.contains("is-active")) {
    menuToggle.classList.remove("is-active");
    menuToggle.classList.add("is-closed");
    menuToggle.setAttribute("aria-expanded", "false");
  } else {
    menuToggle.classList.remove("is-closed");
    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
  }
});

const menuLinks = document.querySelectorAll(".menu-link, .menu-footer-left");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("is-active");
    menuToggle.classList.add("is-closed");
    menuOverlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

englishButton.addEventListener("click", () => {
  englishButton.classList.add("active");
  germanButton.classList.remove("active");
});

germanButton.addEventListener("click", () => {
  germanButton.classList.add("active");
  englishButton.classList.remove("active");
});

const arrow = document.querySelectorAll(".arrow-left-link, .arrow-right-link");

arrow.forEach((icon) => {
  icon.addEventListener(
    "mouseenter",
    () => {
      if (icon.classList.contains("arrow-left-link")) {
        icon.classList.add("arrow-left-has-hovered");
      } else if (icon.classList.contains("arrow-right-link")) {
        icon.classList.add("arrow-right-has-hovered");
      }
    },
    { once: true },
  );
});

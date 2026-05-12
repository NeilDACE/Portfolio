const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("full-screen-menu");

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

const menuLinks = document.querySelectorAll(".menu-link");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("is-active");
    menuToggle.classList.add("is-closed");
    menuOverlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

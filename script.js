const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("full-screen-menu");

menuToggle.addEventListener("click", () => {
  menuOverlay.classList.toggle("is-open");
  document.body.classList.toggle("no-scroll");
});

const menuLinks = document.querySelectorAll(".menu-link");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuOverlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  });
});

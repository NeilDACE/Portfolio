const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("full-screen-menu");
const englishButton = document.getElementById("english-button");
const germanButton = document.getElementById("german-button");
const englishButtonMobile = document.getElementById("english-button-mobile");
const germanButtonMobile = document.getElementById("german-button-mobile");
const mobileMenu = document.getElementById("mobile-language-switcher");
const LANGUAGE_STORAGE_KEY = "portfolio-language";
let pageLanguage = "en";

/**
 * Reads the persisted language from localStorage.
 *
 * @returns {"en" | "de" | null} The persisted language or null when missing.
 */
function getStoredLanguage() {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "de") {
      return storedLanguage;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists the selected language in localStorage.
 *
 * @param {"en" | "de"} language - The language code to persist.
 */
function setStoredLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {}
}

/**
 * Initializes the page state and binds all UI interactions.
 */
function initPage() {
  bindUiEvents();
  const initialLanguage = getStoredLanguage() || "en";
  applyLanguage(initialLanguage);
  updateSendButtonState();
}

/**
 * Binds all UI event listeners.
 */
function bindUiEvents() {
  if (menuToggle && menuOverlay) {
    addPressListener(menuToggle, handleMenuToggle);
  }
  bindMenuLinks();
  bindLanguageSwitcher();
  bindProjectItemToggle();
  bindArrowHoverAnimations();
  bindPrivacyToggle();
}

/**
 * Binds click and touchstart to the same handler while preventing duplicate
 * invocations that can happen from synthetic click events after touch.
 *
 * @param {Element} element - The element that receives the listeners.
 * @param {(event: Event) => void} handler - Callback for both interactions.
 */
function addPressListener(element, handler) {
  let lastTouchTimestamp = 0;
  element.addEventListener(
    "touchstart",
    (event) => {
      lastTouchTimestamp = Date.now();
      handler(event);
    },
    { passive: false },
  );
  element.addEventListener("click", (event) => {
    if (Date.now() - lastTouchTimestamp < 500) return;
    handler(event);
  });
}

/**
 * Enables mobile tap-to-toggle behavior for project items.
 */
function bindProjectItemToggle() {
  const projectItems = document.querySelectorAll(".project-item");
  if (!projectItems.length) return;
  projectItems.forEach((item) => {
    addPressListener(item, (event) => {
      if (event.target.closest("a")) return;
      item.classList.add("is-open");
    });
  });
}

/**
 * Applies the selected language to all translatable elements.
 *
 * @param {"en" | "de"} language - The language code to apply.
 */
function applyLanguage(language) {
  const translateElements = document.querySelectorAll("[data-de], [data-en]");
  pageLanguage = language;
  setStoredLanguage(language);
  setLanguageButtonStates(language);
  translateElements.forEach((element) => {
    const translatedText = element.dataset[language];
    if (translatedText) element.textContent = translatedText;
  });
}

/**
 * Updates desktop and mobile language button active states.
 *
 * @param {"en" | "de"} language - The active language.
 */
function setLanguageButtonStates(language) {
  const buttonPairs = [
    [englishButton, germanButton],
    [englishButtonMobile, germanButtonMobile],
  ];
  buttonPairs.forEach(([enButton, deButton]) => {
    if (!enButton || !deButton) return;
    const activeBtn = language === "en" ? enButton : deButton;
    const inactiveBtn = language === "en" ? deButton : enButton;
    setActiveLanguage(activeBtn, inactiveBtn);
  });
}

/**
 * Marks the active language button and clears the inactive one.
 *
 * @param {HTMLElement} activeBtn - The button that should become active.
 * @param {HTMLElement} inactiveBtn - The button that should become inactive.
 */
function setActiveLanguage(activeBtn, inactiveBtn) {
  activeBtn.classList.add("active");
  inactiveBtn.classList.remove("active");
}

/**
 * Binds click handlers to all menu links so the overlay closes on navigation.
 */
function bindMenuLinks() {
  const menuLinks = document.querySelectorAll(".menu-link, .menu-footer-left");
  menuLinks.forEach((link) => {
    addPressListener(link, closeMenu);
  });
}

/**
 * Binds the language switcher buttons.
 */
function bindLanguageSwitcher() {
  const languageButtons = [
    [englishButton, "en"],
    [germanButton, "de"],
    [englishButtonMobile, "en"],
    [germanButtonMobile, "de"],
  ];
  languageButtons.forEach(([button, language]) => {
    if (!button) return;
    addPressListener(button, () => {
      applyLanguage(language);
    });
  });
}

/**
 * Binds the one-time hover animation to all decorative arrows.
 */
function bindArrowHoverAnimations() {
  const arrows = document.querySelectorAll(
    ".arrow-left-link, .arrow-right-link",
  );
  arrows.forEach((icon) => {
    icon.addEventListener("mouseenter", () => handleArrowHover(icon), {
      once: true,
    });
  });
}

/**
 * Plays the burger icon animation in the requested direction.
 *
 * @param {"open" | "close"} direction - Animation direction to play.
 */
function playBurgerAnimation(direction) {
  if (!menuToggle) return;
  menuToggle.classList.remove("is-active", "is-closed");
  void menuToggle.offsetWidth;
  if (direction === "open") {
    menuToggle.classList.add("is-active");
    return;
  }
  menuToggle.classList.add("is-closed");
}

/**
 * Toggles the full-screen menu and updates the button state.
 */
function handleMenuToggle() {
  if (!menuToggle || !menuOverlay) return;
  const isOpening = !menuOverlay.classList.contains("is-open");
  menuOverlay.classList.toggle("is-open", isOpening);
  setMobileLanguageMenuVisibility(isOpening);
  document.body.classList.toggle("no-scroll", isOpening);
  playBurgerAnimation(isOpening ? "open" : "close");
  menuToggle.setAttribute("aria-expanded", String(isOpening));
}

/**
 * Sets visibility for the mobile language switcher.
 *
 * @param {boolean} isVisible - Whether the switcher should be visible.
 */
function setMobileLanguageMenuVisibility(isVisible) {
  if (!mobileMenu) return;
  mobileMenu.classList.toggle("visible", isVisible);
}

/**
 * Closes the full-screen menu and restores page scrolling.
 */
function closeMenu() {
  if (!menuToggle || !menuOverlay) return;
  playBurgerAnimation("close");
  menuOverlay.classList.remove("is-open");
  setMobileLanguageMenuVisibility(false);
  document.body.classList.remove("no-scroll");
  menuToggle.setAttribute("aria-expanded", "false");
}

/**
 * Adds the hover animation class to an arrow link.
 *
 * @param {Element} icon - The arrow link element.
 */
function handleArrowHover(icon) {
  const className = icon.classList.contains("arrow-left-link")
    ? "arrow-left-has-hovered"
    : "arrow-right-has-hovered";
  icon.classList.add(className);
}

document.addEventListener("DOMContentLoaded", () => {
  initPage();
  AOS.init();
});

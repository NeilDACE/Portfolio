const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("full-screen-menu");
const englishButton = document.getElementById("english-button");
const germanButton = document.getElementById("german-button");
const englishButtonMobile = document.getElementById("english-button-mobile");
const germanButtonMobile = document.getElementById("german-button-mobile");
const mobileMenu = document.getElementById("mobile-language-switcher");
const privacyButtonIcon = document.getElementById("checkboxIcon");
let privacyPolicyIsChecked = false;
let pageLanguage = "de";

/**
 * Initializes the page state and binds all UI interactions.
 */
function initPage() {
  bindUiEvents();
  if (englishButton && germanButton) {
    const initialLanguage = englishButton.classList.contains("active")
      ? "en"
      : "de";
    applyLanguage(initialLanguage);
  }
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
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return;
      }
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
 * Enables or disables the submit button based on the privacy state.
 */
function updateSendButtonState() {
  const sendMessageButton = document.getElementById("sendMessageButton");
  if (!sendMessageButton) return;
  sendMessageButton.disabled = !privacyPolicyIsChecked;
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
 * Binds the privacy policy toggle button.
 */
function bindPrivacyToggle() {
  const privacyButton = document.getElementById("privacyButton");
  if (!privacyButton) return;
  addPressListener(privacyButton, handlePrivacyToggle);
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

/**
 * Toggles the privacy checkbox icon and updates the submit button state.
 *
 * @param {Event} event - The click event from the privacy button.
 */
function handlePrivacyToggle(event) {
  event.preventDefault();
  privacyPolicyIsChecked = !privacyPolicyIsChecked;
  if (privacyButtonIcon) {
    privacyButtonIcon.src = privacyPolicyIsChecked
      ? "assets/imgs/checked-icon.svg"
      : "assets/imgs/unchecked-icon.svg";
    privacyButtonIcon.alt = privacyPolicyIsChecked
      ? "checked icon"
      : "unchecked icon";
  }
  updateSendButtonState();
}

/**
 * Validates the name input value.
 *
 * @param {string} name - The raw name input value.
 * @returns {boolean} True when the name is valid.
 */
function isNameValid(name) {
  return /^[a-zA-Z\s]+$/.test(name);
}

/**
 * Validates the email input value.
 *
 * @param {string} email - The raw email input value.
 * @returns {boolean} True when the email is valid.
 */
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates the message input value.
 *
 * @param {string} message - The raw message input value.
 * @returns {boolean} True when the message length is valid.
 */
function isMessageValid(message) {
  const trimmed = message.trim();
  return trimmed.length >= 10 && trimmed.length <= 500;
}

/**
 * Toggles the visibility class on an error message element.
 *
 * @param {string} elementId - The error message element id.
 * @param {boolean} show - Whether the element should be visible.
 */
function toggleError(elementId, show) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.classList.toggle("visible", show);
}

/**
 * Returns the feedback icon for a given input field.
 *
 * @param {string} fieldId - The input field id.
 * @returns {HTMLImageElement | null} The matching feedback icon.
 */
function getFeedbackIcon(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return null;
  const inputGroup = field.closest(".input-group");
  if (!inputGroup) return null;
  return inputGroup.querySelector(".input-feedback-icon");
}

/**
 * Updates an input feedback icon based on field validity.
 *
 * @param {string} fieldId - The input field id.
 * @param {boolean} valid - Whether the field is valid.
 */
function updateInputFeedback(fieldId, valid) {
  const feedbackIcon = getFeedbackIcon(fieldId);
  if (!feedbackIcon) return;
  feedbackIcon.src = valid
    ? "assets/imgs/accept-icon.svg"
    : "assets/imgs/not-accept-icon.svg";
  feedbackIcon.alt = valid ? "accept icon" : "not accept icon";
  feedbackIcon.classList.add("visible");
}

/**
 * Validates the name field and updates its UI state.
 *
 * @returns {boolean} True when the name is valid.
 */
function checkName() {
  const nameInputValue = document.getElementById("name").value;
  const valid = isNameValid(nameInputValue);
  toggleError("nameMessageError", !valid);
  updateInputFeedback("name", valid);
  return valid;
}

/**
 * Validates the email field and updates its UI state.
 *
 * @returns {boolean} True when the email is valid.
 */
function checkEmail() {
  const emailInputValue = document.getElementById("email").value;
  const valid = isEmailValid(emailInputValue);
  toggleError("emailMessageError", !valid);
  updateInputFeedback("email", valid);
  return valid;
}

/**
 * Validates the message field and updates its UI state.
 *
 * @returns {boolean} True when the message is valid.
 */
function checkMessage() {
  const messageInputValue = document.getElementById("message").value;
  const valid = isMessageValid(messageInputValue);
  toggleError("messageMessageError", !valid);
  updateInputFeedback("message", valid);
  return valid;
}

/**
 * Validates the full form.
 *
 * @returns {boolean} True when all required fields are valid.
 */
function validateForm() {
  const nameValid = checkName();
  const emailValid = checkEmail();
  const messageValid = checkMessage();
  const privacyValid = privacyPolicyIsChecked;
  return nameValid && emailValid && messageValid && privacyValid;
}

/**
 * Builds the payload object for the backend request.
 *
 * @returns {{name: string, email: string, message: string}} The form payload.
 */
function buildFormData() {
  return {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };
}

/**
 * Updates the visible form message.
 *
 * @param {string} message - The message to display.
 * @param {boolean} isSuccess - Whether the message indicates success.
 */
function showFormMessage(message, isSuccess) {
  const formMessage = document.getElementById("formMessage");
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.className = isSuccess
    ? "form-message success"
    : "form-message error";
  formMessage.classList.add("visible");
}

/**
 * Resets all input feedback icons to their initial state.
 */
function resetInputFeedbackIcons() {
  document.querySelectorAll(".input-feedback-icon").forEach((icon) => {
    icon.src = "assets/imgs/not-accept-icon.svg";
    icon.alt = "not accept icon";
    icon.classList.remove("visible");
  });
}

/**
 * Resets the form fields and related UI state.
 */
function resetFormFields() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";
  privacyPolicyIsChecked = false;
  if (privacyButtonIcon) {
    privacyButtonIcon.src = "assets/imgs/unchecked-icon.svg";
    privacyButtonIcon.alt = "unchecked icon";
  }
  resetInputFeedbackIcons();
  updateSendButtonState();
}

/**
 * Sends the form payload to the backend.
 *
 * @param {{name: string, email: string, message: string}} payload - The form payload.
 * @returns {Promise<Response>} The fetch response.
 */
function sendFormData(payload) {
  return fetch("contact.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Handles the backend response for a submitted form.
 *
 * @param {{success: boolean, error?: string}} result - The backend result.
 */
function handleSubmitResult(result) {
  if (result.success) {
    showFormMessage("✓ Message sent successfully!", true);
    resetFormFields();
    return;
  }
  showFormMessage("✗ Mail delivery failed: " + result.error, false);
}

/**
 * Handles request errors during form submission.
 *
 * @param {Error} error - The request error.
 */
function handleSubmitError(error) {
  showFormMessage("✗ Network error: " + error.message, false);
}

/**
 * Sends the form data to the backend and handles the response.
 *
 * @param {Event} event - The form submit event.
 */
async function submitForm(event) {
  event.preventDefault();
  if (!validateForm()) return;
  try {
    const response = await sendFormData(buildFormData());
    const result = await response.json();
    handleSubmitResult(result);
  } catch (error) {
    handleSubmitError(error);
  }
}

const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("full-screen-menu");
const englishButton = document.getElementById("english-button");
const germanButton = document.getElementById("german-button");
const privacyButton = document.getElementById("privacyButton");
const privacyButtonIcon = document.getElementById("checkboxIcon");
let privacyPolicyIsChecked = false;
const sendMessageButton = document.getElementById("sendMessageButton");

menuToggle.addEventListener("click", () => {
  menuOverlay.classList.toggle("is-open");
  document.body.classList.toggle("no-scroll");
  const isActive = menuToggle.classList.contains("is-active");
  menuToggle.classList.toggle("is-active");
  menuToggle.classList.toggle("is-closed");
  menuToggle.setAttribute("aria-expanded", !isActive);
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

const setActiveLanguage = (activeBtn, inactiveBtn) => {
  activeBtn.classList.add("active");
  inactiveBtn.classList.remove("active");
};

englishButton.addEventListener("click", () =>
  setActiveLanguage(englishButton, germanButton),
);
germanButton.addEventListener("click", () =>
  setActiveLanguage(germanButton, englishButton),
);

const arrows = document.querySelectorAll(".arrow-left-link, .arrow-right-link");
arrows.forEach((icon) => {
  icon.addEventListener(
    "mouseenter",
    () => {
      const className = icon.classList.contains("arrow-left-link")
        ? "arrow-left-has-hovered"
        : "arrow-right-has-hovered";
      icon.classList.add(className);
    },
    { once: true },
  );
});

privacyButton?.addEventListener("click", (event) => {
  event.preventDefault();
  privacyPolicyIsChecked = !privacyPolicyIsChecked;
  privacyButtonIcon.src = privacyPolicyIsChecked
    ? "assets/imgs/checked-icon.svg"
    : "assets/imgs/unchecked-icon.svg";
  privacyButtonIcon.alt = privacyPolicyIsChecked
    ? "checked icon"
    : "unchecked icon";
  updateSendButtonState();
});

function isNameValid(name) {
  return /^[a-zA-Z\s]+$/.test(name);
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isMessageValid(message) {
  const trimmed = message.trim();
  return trimmed.length >= 10 && trimmed.length <= 500;
}

function toggleError(elementId, show) {
  document.getElementById(elementId).classList.toggle("visible", show);
}

function getFeedbackIcon(fieldId) {
  return document
    .getElementById(fieldId)
    .closest(".input-group")
    .querySelector(".input-feedback-icon");
}

function updateInputFeedback(fieldId, valid) {
  const feedbackIcon = getFeedbackIcon(fieldId);
  feedbackIcon.src = valid
    ? "assets/imgs/accept-icon.svg"
    : "assets/imgs/not-accept-icon.svg";
  feedbackIcon.alt = valid ? "accept icon" : "not accept icon";
  feedbackIcon.classList.add("visible");
}

function checkName() {
  const nameInputValue = document.getElementById("name").value;
  const valid = isNameValid(nameInputValue);
  toggleError("nameMessageError", !valid);
  updateInputFeedback("name", valid);
  return valid;
}

function checkEmail() {
  const emailInputValue = document.getElementById("email").value;
  const valid = isEmailValid(emailInputValue);
  toggleError("emailMessageError", !valid);
  updateInputFeedback("email", valid);
  return valid;
}

function checkMessage() {
  const messageInputValue = document.getElementById("message").value;
  const valid = isMessageValid(messageInputValue);
  toggleError("messageMessageError", !valid);
  updateInputFeedback("message", valid);
  return valid;
}

function checkPrivacyPolicy() {
  toggleError("privacyPolicyError", !privacyPolicyIsChecked);
  return privacyPolicyIsChecked;
}

function validateForm() {
  const nameValid = checkName();
  const emailValid = checkEmail();
  const messageValid = checkMessage();
  const privacyValid = privacyPolicyIsChecked;
  return nameValid && emailValid && messageValid && privacyValid;
}

function buildFormData() {
  return {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };
}

function showFormMessage(message, isSuccess) {
  const formMessage = document.getElementById("formMessage");
  formMessage.textContent = message;
  formMessage.className = isSuccess
    ? "form-message success"
    : "form-message error";
  formMessage.classList.add("visible");
}

function updateSendButtonState() {
  sendMessageButton.disabled = !privacyPolicyIsChecked;
}

function resetInputFeedbackIcons() {
  document.querySelectorAll(".input-feedback-icon").forEach((icon) => {
    icon.src = "assets/imgs/not-accept-icon.svg";
    icon.alt = "not accept icon";
    icon.classList.remove("visible");
  });
}

function resetFormFields() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";
  privacyPolicyIsChecked = false;
  privacyButtonIcon.src = "assets/imgs/unchecked-icon.svg";
  privacyButtonIcon.alt = "unchecked icon";
  resetInputFeedbackIcons();
  updateSendButtonState();
}

async function submitForm(event) {
  event.preventDefault();
  if (!validateForm()) return;
  try {
    const response = await fetch("contact.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildFormData()),
    });
    const result = await response.json();
    if (result.success) {
      showFormMessage("✓ Message sent successfully!", true);
      resetFormFields();
    } else {
      showFormMessage("✗ Mail delivery failed: " + result.error, false);
    }
  } catch (error) {
    showFormMessage("✗ Network error: " + error.message, false);
  }
}

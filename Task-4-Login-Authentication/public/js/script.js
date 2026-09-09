document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".password-toggle");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const input = document.getElementById(targetId);

      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
      } else {
        input.type = "password";
        button.textContent = "Show";
      }
    });
  });

  // Confirm password validation
  const registerForm = document.querySelector(
    'form[action="/register"]'
  );

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      const password = document.getElementById("password");
      const confirmPassword =
        document.getElementById("confirmPassword");

      if (
        password &&
        confirmPassword &&
        password.value !== confirmPassword.value
      ) {
        event.preventDefault();

        alert("Passwords do not match.");
        confirmPassword.focus();
      }
    });
  }
});
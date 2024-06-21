const form = document.getElementById('registration-form');
const nameInput = document.getElementById('name');
const rollNumberInput = document.getElementById('roll-number');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let errorMessage = "";

  if (nameInput.value === "") {
    errorMessage = "Name is required";
    nameInput.nextElementSibling.textContent = errorMessage;
  } else {
    nameInput.nextElementSibling.textContent = "";
  }

  if (rollNumberInput.value === "") {
    errorMessage = "Roll number is required";
    rollNumberInput.nextElementSibling.textContent = errorMessage;
  } else {
    rollNumberInput.nextElementSibling.textContent = "";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.match(emailRegex)) {
    errorMessage = "Please enter a valid email address";
    emailInput.nextElementSibling.textContent = errorMessage;
  } else {
    emailInput.nextElementSibling.textContent = "";
  }

  // Password validation
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{6,}$/;
  if (!passwordInput.value.match(passwordRegex)) {
    errorMessage = "Password must be at least 6 characters and contain at least one uppercase letter, lowercase letter, and special character";
    passwordInput.nextElementSibling.textContent = errorMessage;
  } else {
    passwordInput.nextElementSibling.textContent = "";
  }

  // Submit the form only if there are no errors
  if (errorMessage === "") {
    // Simulate form submission (replace with your actual form submission logic)
    alert("Registration successful!");
  }
});

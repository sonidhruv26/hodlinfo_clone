// Dark/light mode toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// 60s countdown timer
let countdown = 30;
const countdownElement = document.getElementById("countdown");
const countdownTimer = document.querySelector(".countdown-timer");
setInterval(() => {
  countdown--;
  countdownElement.textContent = countdown;
  if (countdown === 0) {
    // Show alert that data is updated
    document.querySelector(".alert").classList.toggle("d-none");
    countdown = 30;
  }
}, 1000);

// Update the page according to crypto selected
const currency = document.getElementById("currency");
const crypto = document.getElementById("crypto");
currency.addEventListener("change", () => {
  window.location.href = `/?currency=${currency.value}&crypto=${crypto.value}`;
});
crypto.addEventListener("change", () => {
  window.location.href = `/?currency=${currency.value}&crypto=${crypto.value}`;
});
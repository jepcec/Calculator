const lightTheme = "styles/light.css";
const darkTheme = "styles/dark.css";
const sunIcon = "assets/SunIcon.svg";
const moonIcon = "assets/MoonIcon.svg";
const themeIcon = document.getElementById("theme-icon");
const res = document.getElementById("result");
const toast = document.getElementById("toast");

function calculate(value) {
  // Auto-close parentheses if needed
  let open = (value.match(/\(/g) || []).length;
  let close = (value.match(/\)/g) || []).length;
  let toClose = open - close;
  let fixedValue = value;
  if (toClose > 0) {
    fixedValue += ")".repeat(toClose);
  }
  // Remove spaces for robustness
  fixedValue = fixedValue.replace(/\s+/g, "");
  // Reemplazar el operador % por el operador módulo de JS
  // y mantener el porcentaje para casos como 50% (sin operandos a la derecha)
  let sanitizedValue = fixedValue.replace(/\^/g, "**");
  // Primero, reemplazar los casos de porcentaje (número seguido de % y no seguido de un número)
  sanitizedValue = sanitizedValue.replace(/([0-9.]+)%([^0-9]|$)/g, '($1/100)$2');
  // Luego, reemplazar los casos de módulo (a % b)
  sanitizedValue = sanitizedValue.replace(/([0-9.]+)%([0-9.]+)/g, '($1%$2)');
  sanitizedValue = sanitizedValue
    .replace(/√\(/g, 'Math.sqrt(')
    .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)')
    .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)')
    .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)')
    .replace(/log\(/g, 'Math.log(');

  let calculatedValue;
  try {
    calculatedValue = eval(sanitizedValue || null);
  } catch (e) {
    calculatedValue = NaN;
  }

  if (isNaN(calculatedValue) || sanitizedValue.match(/\(\)/)) {
    res.value = "Error";
    setTimeout(() => {
      res.value = "";
    }, 1300);
  } else {
    res.value = calculatedValue;
  }
}

// Swaps the stylesheet to achieve dark mode.
function changeTheme() {
  const theme = document.getElementById("theme");
  setTimeout(() => {
    toast.innerHTML = "Calculator";
  }, 1500);
  if (theme.getAttribute("href") === lightTheme) {
    theme.setAttribute("href", darkTheme);
    themeIcon.setAttribute("src", sunIcon);
    toast.innerHTML = "Dark Mode 🌙";
  } else {
    theme.setAttribute("href", lightTheme);
    themeIcon.setAttribute("src", moonIcon);
    toast.innerHTML = "Light Mode ☀️";
  }
}

// Displays entered value on screen.
function liveScreen(enteredValue) {
  if (!res.value) {
    res.value = "";
  }
  res.value += enteredValue;
}

//adding event handler on the document to handle keyboard inputs
document.addEventListener("keydown", keyboardInputHandler);

//function to handle keyboard inputs
function keyboardInputHandler(e) {
  e.preventDefault();
  //numbers
  if (e.key >= "0" && e.key <= "9") {
    res.value += e.key;
  }
  //operators
  if (["+", "-", "*", "/", "^"].includes(e.key)) {
    res.value += e.key;
  }
  //decimal key
  if (e.key === ".") {
    res.value += ".";
  }
  // scientific functions (keyboard shortcuts)
  if (e.key === "r") { // sqrt
    res.value += "√(";
  }
  if (e.key === "%") {
    res.value += "%";
  }
  if (e.key === "s") { // sin
    res.value += "sin(";
  }
  if (e.key === "c") { // cos
    res.value += "cos(";
  }
  if (e.key === "t") { // tan
    res.value += "tan(";
  }
  if (e.key === "l") { // log natural
    res.value += "log(";
  }
  //press enter to see result
  if (e.key === "Enter") {
    calculate(res.value);
  }
  //backspace for removing the last input
  if (e.key === "Backspace") {
    res.value = res.value.substring(0, res.value.length - 1);
  }
}

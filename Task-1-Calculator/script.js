const display = document.getElementById("display");
const previousDisplay = document.getElementById("previous-display");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let expression = "";

// Update calculator display
function updateDisplay() {
    display.textContent = currentInput;
    previousDisplay.textContent = expression;
}

// Add number or decimal point
function inputNumber(value) {
    if (waitingForSecondOperand) {
        currentInput = value === "." ? "0." : value;
        waitingForSecondOperand = false;
        return;
    }

    if (value === "." && currentInput.includes(".")) {
        return;
    }

    if (currentInput === "0" && value !== ".") {
        currentInput = value;
    } else {
        currentInput += value;
    }
}

// Convert display operator to calculation operator
function calculate(a, b, selectedOperator) {
    switch (selectedOperator) {
        case "+":
            return a + b;

        case "−":
            return a - b;

        case "×":
            return a * b;

        case "÷":
            if (b === 0) {
                return null;
            }
            return a / b;

        default:
            return b;
    }
}

// Format result
function formatResult(value) {
    if (!Number.isFinite(value)) {
        return "Error";
    }

    return Number.parseFloat(value.toFixed(10)).toString();
}

// Handle operator
function handleOperator(nextOperator) {
    const inputValue = Number.parseFloat(currentInput);

    if (Number.isNaN(inputValue)) {
        return;
    }

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;

        expression = `${formatResult(firstOperand)} ${operator}`;

        updateDisplay();

        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(
            firstOperand,
            inputValue,
            operator
        );

        if (result === null) {
            showError("Cannot divide by zero");
            return;
        }

        currentInput = formatResult(result);
        firstOperand = result;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;

    expression = `${currentInput} ${operator}`;

    updateDisplay();
}

// Calculate final result
function handleEquals() {
    if (operator === null || firstOperand === null) {
        return;
    }

    const secondOperand = Number.parseFloat(currentInput);

    if (Number.isNaN(secondOperand)) {
        return;
    }

    const result = calculate(
        firstOperand,
        secondOperand,
        operator
    );

    if (result === null) {
        showError("Cannot divide by zero");
        return;
    }

    expression =
        `${formatResult(firstOperand)} ${operator} ` +
        `${formatResult(secondOperand)} =`;

    currentInput = formatResult(result);

    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;

    updateDisplay();
}

// Clear calculator
function clearCalculator() {
    currentInput = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    expression = "";

    updateDisplay();
}

// Delete last character
function deleteLastCharacter() {
    if (waitingForSecondOperand) {
        return;
    }

    if (
        currentInput.length === 1 ||
        (currentInput.length === 2 && currentInput.startsWith("-"))
    ) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}

// Show error
function showError(message) {
    currentInput = "Error";
    expression = message;

    updateDisplay();

    setTimeout(() => {
        clearCalculator();
    }, 1500);
}

// Button event handling
keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const number = button.dataset.number;
    const selectedOperator = button.dataset.operator;
    const action = button.dataset.action;

    if (number !== undefined) {
        inputNumber(number);
        updateDisplay();
        return;
    }

    if (selectedOperator) {
        handleOperator(selectedOperator);
        updateDisplay();
        return;
    }

    switch (action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteLastCharacter();
            break;

        case "equals":
            handleEquals();
            break;

        default:
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        inputNumber(key);
        updateDisplay();
        return;
    }

    if (key === "+") {
        handleOperator("+");
        updateDisplay();
        return;
    }

    if (key === "-") {
        handleOperator("−");
        updateDisplay();
        return;
    }

    if (key === "*") {
        handleOperator("×");
        updateDisplay();
        return;
    }

    if (key === "/") {
        event.preventDefault();
        handleOperator("÷");
        updateDisplay();
        return;
    }

    if (key === "Enter" || key === "=") {
        handleEquals();
        updateDisplay();
        return;
    }

    if (key === "Backspace") {
        deleteLastCharacter();
        return;
    }

    if (key === "Escape") {
        clearCalculator();
    }
});

updateDisplay();
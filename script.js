
// 1. Basic mathematical functions

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Nice try! You cannot divide by zero.";
    }

    return a / b;
}


// 2. Operate function

function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);

        case "-":
            return subtract(a, b);

        case "*":
            return multiply(a, b);

        case "/":
            return divide(a, b);

        default:
            return null;
    }
}


// 3. Calculator variables

let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let justCalculated = false;


// 4. Display

const display = document.querySelector("#display");

let displayValue = "0";

function updateDisplay() {
    display.textContent = displayValue;
}


// 5. Number input

function inputDigit(digit) {

    if (displayValue.startsWith("Nice try!")) {
        clearCalculator();
    }

    if (justCalculated) {
        displayValue = digit;
        firstNumber = null;
        operator = null;
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (waitingForSecondNumber) {
        displayValue = digit;
        waitingForSecondNumber = false;
    } else {
        displayValue =
            displayValue === "0"
                ? digit
                : displayValue.length < 15
                    ? displayValue + digit
                    : displayValue;
    }

    updateDisplay();
}


// 6. Decimal input

function inputDecimal() {

    if (displayValue.startsWith("Nice try!")) {
        clearCalculator();
    }

    if (justCalculated) {
        displayValue = "0.";
        justCalculated = false;
        firstNumber = null;
        operator = null;
    } else if (waitingForSecondNumber) {
        displayValue = "0.";
        waitingForSecondNumber = false;
    } else if (!displayValue.includes(".")) {
        displayValue += ".";
    }

    updateDisplay();
}


// 7. Calculate and round result

function calculate(a, op, b) {

    let result = operate(op, a, b);

    if (typeof result !== "number") {
        return result;
    }

    if (!Number.isFinite(result)) {
        return "Error";
    }

    return String(Number(result.toPrecision(12)));
}


// 8. Operator selection

function chooseOperator(nextOperator) {

    if (displayValue.startsWith("Nice try!")) {
        return;
    }

    const inputValue = Number(displayValue);

    if (operator && !waitingForSecondNumber) {

        const result = calculate(
            firstNumber,
            operator,
            inputValue
        );

        displayValue = String(result);

        if (typeof result !== "number" &&
            !Number.isFinite(Number(result))) {
            firstNumber = null;
            operator = null;
            waitingForSecondNumber = false;
            justCalculated = true;
            updateDisplay();
            return;
        }

        firstNumber = result;

    } else if (firstNumber === null || justCalculated) {

        firstNumber = inputValue;
    }

    operator = nextOperator;
    waitingForSecondNumber = true;
    justCalculated = false;

    updateDisplay();
}


// 9. Equals button

function calculateResult() {

    if (
        operator === null ||
        waitingForSecondNumber ||
        firstNumber === null
    ) {
        return;
    }

    const secondNumber = Number(displayValue);

    const result = calculate(
        firstNumber,
        operator,
        secondNumber
    );

    displayValue = String(result);

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    justCalculated = true;

    updateDisplay();
}


// 10. Clear calculator

function clearCalculator() {

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    justCalculated = false;
    displayValue = "0";

    updateDisplay();
}


// 11. Backspace

function backspace() {

    if (displayValue.startsWith("Nice try!") || justCalculated) {
        clearCalculator();
        return;
    }

    if (waitingForSecondNumber) {
        return;
    }

    displayValue = displayValue.slice(0, -1);

    if (displayValue === "" || displayValue === "-") {
        displayValue = "0";
    }

    updateDisplay();
}


// 12. Button event listeners

document.querySelectorAll("[data-digit]").forEach(button => {

    button.addEventListener("click", () => {
        inputDigit(button.dataset.digit);
    });

});

document.querySelectorAll("[data-operator]").forEach(button => {

    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });

});

document.querySelector('[data-action="equals"]')
    .addEventListener("click", calculateResult);

document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document.querySelector('[data-action="decimal"]')
    .addEventListener("click", inputDecimal);

document.querySelector('[data-action="backspace"]')
    .addEventListener("click", backspace);


// 13. Keyboard support

document.addEventListener("keydown", event => {

    if (/^[0-9]$/.test(event.key)) {
        inputDigit(event.key);
    }

    if (["+", "-", "*", "/"].includes(event.key)) {
        chooseOperator(event.key);
    }

    if (event.key === "Enter" || event.key === "=") {
        calculateResult();
    }

    if (event.key === ".") {
        inputDecimal();
    }

    if (event.key === "Backspace") {
        backspace();
    }

    if (event.key === "Escape") {
        clearCalculator();
    }

});

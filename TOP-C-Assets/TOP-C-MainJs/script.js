const calcContainer = document.querySelector(".calc-con");
const calcHead = document.querySelector('.calc-head');
const displayOneEl = document.getElementById("display-one");
const displayOperators = document.getElementById("display-op");
const displayTwoEl = document.getElementById("display-two");
const allClearBtn = document.querySelector(".all-clear");
const deleteBtn = document.querySelector(".delete");
const numbersBtn = document.querySelectorAll(".number");
const operatorsBtn = document.querySelectorAll(".operation");
const equalBtn = document.querySelector(".equal");
const btnStyling = document.querySelector("#btn-class");
const conStyling = document.querySelector("#con-class");

/**
 * This adds the functionality to the number buttons.
 */
numbersBtn.forEach((num) => {
  num.addEventListener("click", updateNumbers);
});

/**
 * This adds the functionality to the operator buttons.
 */
operatorsBtn.forEach((operation) => {
  operation.addEventListener("click", updateOperator);
});

/**
 * This adds the functionality to the DEL button.
 */
deleteBtn.addEventListener("click", deleteOne);

/**
 * This adds the functionality to the AC button.
 */
allClearBtn.addEventListener("click", clearAll);

/**
 * This adds the functionality to the equal button.
 */
equalBtn.addEventListener("click", equal);

/**
 * This allow the user to use the keyboard to input the numbers and operators.
 */
document.addEventListener("keyup", getKeyUpFunction);

/**
 * This function is used to determine the callback function to be used.based on
 * the key pressed on the keyboard.
 * @param {*} e - The event object.
 * @returns - The callback function.
 */
function getKeyUpFunction(e) {
  if (
    (e.key === ".") ||
    (!isNaN(parseFloat(e.key)) && isFinite(e.key))
  ) {
    highlightUiButton(e.key);
    //If the key pressed is a number or a decimal point.
    return updateNumbers(e); //Call the updateNumbers function.
  } else if (
    (e.key === "+") ||
    e.key === "-" ||
    e.key === "*" ||
    e.key === "/"
  ) {
    highlightUiButton(e.key);
    //If the key pressed is an operator.
    return updateOperator(e); //Call the updateOperator function.
  } else if (e.key === "Enter") {
    highlightUiButton(e.key);
    //If the key pressed is the enter key.
    return equal(); //Call the equal function.
  } else if (e.key === "Backspace") {
    highlightUiButton(e.key);
    //If the key pressed is the backspace key.
    return deleteOne(); //Call the deleteOne function.
  } else if (e.key === "Delete") {
    highlightUiButton(e.key);
    //If the key pressed is the delete key.
    return clearAll(); //Call the clearAll function.
  }
}

function highlightUiButton(key) {
  const isEscaped = ['+', '-', '*', '/'].includes(key) ? '\\' : '';
  const button = document.querySelector(`#btn-${isEscaped}${key}`);
  const classToUse = key === 'Enter' ? 'highlight-2' : 'highlight';
  button.classList.add(classToUse);
  setTimeout(() => {
    button.classList.remove(classToUse);
  }, 500);
}

/**
 * This function is used to update the display when numbers are pressed.
 * @param {*} e - The event object.
 * @returns - void.
 */
function updateNumbers(e) {
  let numVal; //This variable is used to store the value of the number.
  if (e.type === "click") {
    //If the event is a click event.
    numVal = e.target.innerHTML; //Get the innerHtml of the target element.
  } else if (
    (e.type === "keyup" && e.key === ".") ||
    (!isNaN(parseFloat(e.key)) && isFinite(e.key))
  ) {
    //If the event is a keyup event and the key pressed is a number or a decimal point.
    numVal = e.key; //Get the key pressed.
  } else {
    //Otherwise, return.
    return;
  }

  sayText(numVal === '.' ? 'point' : numVal); //Say the number.

  // These set of conditions are used to determine which display should be
  // updated based on the state of the displays.
  if (displayTwoEl.innerHTML === "0") {
    //If the innerHtml of displayTwoEl is equal to zero.
    displayTwoEl.innerHTML = numVal; //Set the innerHtml of displayTwoEl to the numVal.
  } else if (displayTwoEl.innerHTML.includes(".") && numVal === ".") {
    //If the innerHtml of displayTwoEl contains a decimal point and the numVal is a decimal point.
    return;
  } else if (displayOneEl.innerHTML === "") {
    //If the innerHtml of displayOneEl is equal to empty string.
    displayTwoEl.innerHTML = numVal; //Set the innerHtml of displayTwoEl to the numVal.
    displayOneEl.innerHTML = "0";
  } else if (displayTwoEl.innerHTML !== "0") {
    //If the innerHtml of displayTwoEl is not equal to zero.
    displayTwoEl.innerHTML += numVal; //Add the numVal to the innerHtml of displayTwoEl.
  }
}

/**
 * This function is used to update the display when operators are pressed based
 * on the keyboard or mouse click.
 * @param {*} e - The event object.
 * @returns void.
 */
function updateOperator(e) {
  let operationVal; //This variable is used to store the value of the operation.
  if (e.type === "click") {
    //If the event is a click event.
    operationVal = e.target.innerHTML; //Get the innerHtml of the target element.
  } else if (
    (e.type === "keyup" && e.key === "+") ||
    e.key === "-" ||
    e.key === "*" ||
    e.key === "/"
  ) {
    //If the event is a keyup event and the key pressed is an operator.
    operationVal =
      e.key === "-" ? "−" : e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key; //Get the key pressed.
  } else {
    //Otherwise, return.
    return;
  }

  sayText(operationVal);

  //These set of conditions are used to determine which display should be
  //updated based on the state of the displays.
  if (displayTwoEl.innerHTML === "0" && displayOneEl.innerHTML !== "0") {
    //If the innerHtml of displayTwoEl is equal to zero and the innerHtml of displayOneEl is not equal to zero.
    displayOperators.innerHTML = operationVal; //Set the innerHtml of displayOperators to the operationVal.
  } else if (
    displayOneEl.innerHTML === "" &&
    displayOperators.innerHTML === ""
  ) {
    //If both the innerHtml of displayOneEl and displayOperators are equal to empty string.
    displayOperators.innerHTML = operationVal; //Set the innerHtml of displayOperators to the operationVal.
    displayOneEl.innerHTML = displayTwoEl.innerHTML; //Set the innerHtml of displayOneEl to the innerHtml of displayTwoEl.
    displayTwoEl.innerHTML = "0"; //Set the innerHtml of displayTwoEl to zero.
  } else if (displayOneEl.innerHTML !== "0" && displayTwoEl.innerHTML !== "0") {
    //If the innerHtml of displayOneEl and displayTwoEl are not equal to zero.
    displayOneEl.innerHTML = compute(); //Compute the current value of the display.
    displayOperators.innerHTML = operationVal; //Set the innerHtml of displayOperators to the operationVal.
    displayTwoEl.innerHTML = "0";
  } else if (displayTwoEl.innerHTML !== "0") {
    //If the innerHtml of displayTwoEl is not equal to zero.
    displayOperators.innerHTML = operationVal; //Set the innerHtml of displayOperators to the operationVal.
    displayOneEl.innerHTML = displayTwoEl.innerHTML; //Set the innerHtml of displayOneEl to the innerHtml of displayTwoEl.
    displayTwoEl.innerHTML = "0";
  }
}

/**
 * This function is used to reset all the displays.
 */
function clearAll() {
  //Set the innerHtml of displayOneEl and displayTwoEl to zero.
  displayOneEl.innerHTML = "0";
  displayOperators.innerHTML = "";
  displayTwoEl.innerHTML = "0";
  sayText('all clear');
}

/**
 * This function is used to delete one character from the display.
 */
function deleteOne() {
  if (displayOneEl.innerHTML === "") {
    //If the innerHtml of displayOneEl is equal to empty string.
    displayOneEl.innerHTML = "0";
  } else if (displayTwoEl.innerHTML.length === 1) {
    //If the innerHtml of displayTwoEl is equal to one, set the innerHtml of displayTwoEl to zero.
    displayTwoEl.innerHTML = "0";
  } else {
    //Otherwise, remove the last character from the innerHtml of displayTwoEl.
    displayTwoEl.innerHTML = displayTwoEl.innerHTML.slice(0, -1); //Remove the last character from the innerHtml of displayTwoEl.
  }
}

/**
 * This function is used to compute the result based on the values of the
 * displays.
 * @returns {string} - The result of the computation
 */
function compute() {
  const num1 = parseFloat(displayOneEl.innerHTML); //convert the innerHtml of displayOneEl to a number
  const num2 = parseFloat(displayTwoEl.innerHTML); //convert the innerHtml of displayTwoEl to a number
  const operator = displayOperators.innerHTML; //retrieve the last character of the innerHtml of displayOneEl
  let result = 0; //This variable is used to store the result of the computation.
  if (operator === "+") {
    //if the operator is equal to '+', execute the result of addition() function
    result = num1 + num2;
  } else if (operator === "−" || operator === "-") {
    //if the operator is equal to '−', execute the result of subtraction() function
    result = num1 - num2;
  } else if (operator === "×" || operator === "*") {
    //if the operator is equal to '×', execute the result of multiplication() function
    result = num1 * num2;
  } else if (operator === "÷" || operator === "/") {
    //if the operator is equal to '÷', execute the result of division() function
    result = num1 / num2;
  }
  return result;
}

/**
 * This function is used to update the display when the equals button is
 * pressed.
 */
function equal() {
  if (displayOneEl.innerHTML !== "0" && displayTwoEl.innerHTML !== "0") {
    //If the innerHtml of displayOneEl and displayTwoEl are not equal to zero.
    displayTwoEl.innerHTML = compute(); //Compute the current value of the display.
    displayOperators.innerHTML = "";
    displayOneEl.innerHTML = "";
  } else {
    displayOneEl.innerHTML = "0";
    displayOperators.innerHTML = "";
    displayTwoEl.innerHTML = "0";
  }

  sayText(`equals ${displayTwoEl.innerHTML}`)
}

let synth = window.speechSynthesis;
let voiceChoice;
setTimeout(() => {
  voiceChoice = synth.getVoices()[4];
}, 500);

/**
 * This function is used to say a message
 * @param {string} message - The message to be spoken.
 */
function sayText(message) {
  const utterThis = new SpeechSynthesisUtterance(message);
  utterThis.voice = voiceChoice;
  synth.speak(utterThis);
}

/**
 * This function gets the center coordinates of an element.
 * @param {*} el - the element to get the coordinates of.
 * @returns an object with the coordinates of the center of the element.
 */
function getCenter(el) {
  const rect = el.getBoundingClientRect(); // Get the coordinates of the element
  return {
    x: rect.left + rect.width / 2, // The x coordinate of the center of the element.
    y: rect.top + rect.height / 2 // The y coordinate of the center of the element.
  };
}

// This tilts the calculator based on the position of the mouse from the center of the calculator.
document.body.addEventListener("mousemove", (e) => {
  // This holds the coordinates of the center of the whole calculator.
  const calcCenter = getCenter(calcContainer);

  // Destructure the coordinates of center of the calculator.
  const { x: calcX, y: calcY } = calcCenter;
  // The difference between the mouse coordinates and the center of the calculator.
  const yRotation = calcY - e.clientY;
  const xRotation = calcX - e.clientX;

  // Set the visual thickness of the calculator when it is tilted
  const calcThickness = 15;
  // Set the color of the sides or thickness of the calculator when it is tilted
  const thicknessColor = '#f1c1c1';
  const displayShadowColor = '#00000042';
  // Calculate the angle of the rotation
  const targetXRotation = (yRotation/25) % 360;
  const targetYRotation = (xRotation/30) % 360;

  // Set the shadow of the display based on the angle of the rotation.
  calcHead.style.boxShadow = `inset ${xRotation/120}px ${yRotation/120}px 6px ${displayShadowColor}`;

  // Set dynamic styling for buttons and  calculator container based on the angle of the rotation.
  btnStyling.innerHTML = `
    .calc-num-btn {
      box-shadow: ${xRotation/120}px ${yRotation/120}px 8px #00000050;
    }
  `;
  conStyling.innerHTML = `
    .calc-con {
      transform: rotateX(${targetXRotation}deg) rotateY(${targetYRotation}deg);
      box-shadow: ${xRotation/15}px ${yRotation/15}px 12px #0000003d, ${xRotation/50}px ${yRotation/50}px 0 ${thicknessColor};
    }
  `
});

/**
 * TODO:
 * - Handle more than one input (operator pressed will also calculate)
 * - Handle multiple pushes of operator OR equals
 * - Allow key press inputs (not just clicks)
 * - Limit input
 * - Hover states
 */

const filterElementsByClass = (elements) => (className) => {
  // Converting NodeList to Array (Alternative: [...elements])
  return Array.from(elements).filter((element) =>
    element.classList.contains(className)
  );
};

// Must use normal function because of `this`
function onClick(fn) {
  this.addEventListener('click', (event) => {
    fn(event);
  });
}

const calculate = () => {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
  };

  const performOperation = new Function(
    `return ${firstValue} ${symbols[operation]} ${secondValue}`
  );
  firstValue = performOperation();
  display.value = firstValue;
};

const clearAll = () => {
  firstValue = '';
  secondValue = '';
  operation = '';
  display.value = '0';
};

// ======================================================

// Elements
const display = document.querySelector('input');
const numbers = document.querySelectorAll('.number');
const decimal = document.querySelector('#decimal');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('#equals');
const clear = document.querySelector('#clear');

// App state
let firstValue = '';
let secondValue = '';
let operation;

// Handle numbers (Trick: when to move onto second number)
for (const number of [...numbers]) {
  onClick.bind(number)((e) => {
    const value = e.target.value;
    if (!operation) {
      firstValue =
        !firstValue || firstValue === '0' ? value : firstValue + value;
      display.value = firstValue; // update
    } else {
      secondValue =
        !secondValue || secondValue === '0' ? value : secondValue + value;
      display.value = secondValue; // update
    }
  });
}

// Handle decimals (Trick: 0 and multiple decimals)
onClick.bind(decimal)((e) => {
  if (!operation && !firstValue.includes('.')) {
    firstValue = !firstValue ? '0.' : firstValue + '.';
    display.value = firstValue; // update
  } else if (operation && !secondValue.includes('.')) {
    secondValue = !secondValue ? '0.' : secondValue + '.';
    display.value = secondValue; // update
  }
});

// Handle operators
for (const operator of operators) {
  onClick.bind(operator)((e) => {
    operation = e.target.id;
  });
}

// Handle equals
onClick.bind(equals)(calculate);

// Handle clear
onClick.bind(clear)(clearAll);

/**
 * - Equal won't do anything
 * - Operators same as equal
 */

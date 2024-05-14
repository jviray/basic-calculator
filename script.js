/**
 * TODO:
 * - Allow key press inputs (not just clicks)
 * - Limit input
 * - Add hover states
 * - Check other solutions online
 * - Fix divide by 0
 * - Deploy
 * - Refactor
 * - Add media queries
 */

// Must use normal function because of `this`
function onClick(fn) {
  this.addEventListener('click', (event) => {
    fn(event);
  });
}

const handleInput = (current, input) => {
  // Start new value OR append digit to current value
  return !current || current === '0' ? input : current + input;
};

const handleDecimal = (current) => {
  // Append to 0 or append '.' to current value
  return !current || current === '0' ? '0.' : current + '.';
};

const clearState = () => {
  firstValue = null;
  tempFirstValue = null;
  secondValue = null;
  tempSecondValue = null;
  operation = null;
};

const setDisplay = (number) => {
  display.value = number.toString();
};

const calculate = () => {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
  };

  /**
   * After every calculation, `firstValue` gets cleared out.
   * Setting `display.value` here when `firstValue` is empty,
   * allows calculations to be done by pressing equals sign
   * repeatedly.
   */
  if (!firstValue) {
    firstValue = display.value;
  }

  /**
   * Set `secondvalue`, but only when tempSecondValue is present
   * or no secondValue
   */
  if (tempSecondValue || !secondValue) {
    secondValue = display.value;
    tempSecondValue = null;
  }

  if (operation) {
    const evaluate = new Function(
      `return ${firstValue} ${symbols[operation]} ${secondValue}`
    );

    setDisplay(evaluate());

    // Clear out firstValue to trigger starting a new value
    firstValue = null;
  }
};

// Elements
const display = document.querySelector('input');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const equals = document.querySelector('#equals');
const decimal = document.querySelector('#decimal');
const clear = document.querySelector('#clear');

// State
let firstValue = null;
let tempFirstValue = null;
let secondValue = null;
let tempSecondValue = null;
let operation = null;

// Handle numbers
for (const number of [...numbers]) {
  onClick.bind(number)((e) => {
    const input = e.target.value;

    if (!firstValue) {
      tempFirstValue = handleInput(tempFirstValue, input);
      setDisplay(tempFirstValue);
    } else {
      tempSecondValue = handleInput(tempSecondValue, input);
      setDisplay(tempSecondValue);
    }
  });
}

// Handle decimal
onClick.bind(decimal)((e) => {
  // Don't allow multiple decimals
  if (display.value.includes('.')) return;

  if (!firstValue) {
    tempFirstValue = handleDecimal(tempFirstValue);
    setDisplay(tempFirstValue);
  } else {
    tempSecondValue = handleDecimal(tempSecondValue);
    setDisplay(tempSecondValue);
  }
});

// Handle operators
for (const operator of operators) {
  onClick.bind(operator)((e) => {
    /**
     * Only run calculation if both below are present.
     * This enables chaining operations, while allowing
     * operators to be switched out without triggering a calculation
     */
    if (firstValue && tempSecondValue) {
      calculate();
    }

    firstValue = display.value;
    tempFirstValue = null;
    operation = e.target.id;
  });
}

// Handle equal
onClick.bind(equals)(() => {
  calculate();
});

// Handle clear
onClick.bind(clear)(() => {
  clearState();
  setDisplay('0');
});

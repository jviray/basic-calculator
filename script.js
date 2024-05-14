/**
 * TODO:
 * - Allow key press inputs (not just clicks)
 * - Limit input
 * - Add hover states
 * - Check other solutions
 * - Fix divide by 0
 * - Deploy
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

const clearState = () => {
  firstValue = null;
  tempFirstValue = null;
  secondValue = null;
  tempSecondValue = null;
  operation = null;
};

const setDisplay = (number) => {
  display.value = Number(number);
};

const calculate = () => {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
  };

  if (!firstValue) {
    firstValue = display.value;
  }

  // Any other times to fill in when value non existent
  // - 2 +
  // - + 2

  // Insert secondValue w/ tempSecondValue
  // But we only want to do that when we have value in tempSecondValue
  // i.e. - We don't want to keep re-setting it
  if (tempSecondValue) {
    secondValue = display.value;
    tempSecondValue = null;
  }

  if (!secondValue) {
    secondValue = display.value;
  }

  if (operation) {
    const evaluate = new Function(
      `return ${firstValue} ${symbols[operation]} ${secondValue}`
    );

    setDisplay(evaluate());

    // Clear out firstValue
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

/**
 * Handle numbers
 * - Trick: Knowing when to start new value
 */
for (const number of [...numbers]) {
  onClick.bind(number)((e) => {
    const input = e.target.value;

    // Options: for triggering new value
    // - Can use temp placeholders
    // But when do we clear out
    // Clear out after setting the real values

    if (!firstValue) {
      tempFirstValue = handleInput(tempFirstValue, input);
      setDisplay(tempFirstValue);
    } else {
      tempSecondValue = handleInput(tempSecondValue, input);
      setDisplay(tempSecondValue);
    }
  });
}

/**
 * Handle decimal
 * - Trick: Append to decimal to 0; don't allow multiple decimals
 */
onClick.bind(decimal)((e) => {
  if (!operation && !firstValue.includes('.')) {
    firstValue = !firstValue ? '0.' : firstValue + '.';
    display.value = firstValue; // update
  } else if (operation && !secondValue.includes('.')) {
    secondValue = !secondValue ? '0.' : secondValue + '.';
    display.value = secondValue; // update
  }
});

/**
 * Handle operators
 * - Should assign firstValue?
 */
for (const operator of operators) {
  onClick.bind(operator)((e) => {
    // This enables chaining on an operation to the current display.
    // It assumes that after a calculation is executed, the state is cleared
    // out. So for example, if a simple operation is done, we clear state
    // so that when new numbers are pressed, the calculator starts a new number
    // rather than appending numbers to the current display.
    //
    // But what if we don't need to clear out state when calculating.
    // Instead, reassign firstValue to result and also show result on display.
    // Clear out secondValue.
    //
    // NVM, looks like the apple calculator doesn't re-assign the first value when
    // calculating either. In fact, it retains the secondValue, and even the operation.
    // So far from 1 + 2 = example it looks likes it just calculates and displays while keep
    // everything else. When typing a new number it replaces the first number. But
    // how does it know to do that?
    //
    //
    // if (!firstValue) {
    //   firstValue = display.value;
    // }
    //
    // Pressing operator for sure indicates when to move on to second number.
    // Nvm - based on fristValue because operation is not deleted or cleared out so still there after calc.
    // Pressing equal to calculate only requires an operation!
    // If no number is present then 0 is used.
    // Shows calculation result on display.
    //
    // IMPORTANT: even after calc, all state remains the same!
    // With current handling of inputs, typing a new number will append a digit to the
    // current value. So we know for sure that area needs to change.
    //
    // Possible solution: Instead of updating first and second value we only change display when handling input
    // Then when operation is pressed, that's when we: save display as firstValue and save operation.
    // Then when equal is pressed, we save display as secondValue.
    // Calculator will look at state to perform calc and then show result on display.
    // Everything is still saved (or maybe firstValue is deleted?)
    //
    // If first value is deleted then when we press operation we still dave display as first value!!!!

    // ....

    // Only run calc if both first AND second values exist
    // This is incorret, need to change.
    // Current wrong behavior: When we run a simple calc,
    // pressing an operator once wont run calc. However,
    // it does re-set firstValue using the display.
    if (firstValue && tempSecondValue) {
      calculate();
    }

    firstValue = display.value;
    tempFirstValue = null;
    operation = e.target.id;
  });
}

/**
 * Handle equals:
 */
onClick.bind(equals)(() => {
  calculate();
});

// Handle clear
onClick.bind(clear)(() => {
  clearState();
  setDisplay('0');
});

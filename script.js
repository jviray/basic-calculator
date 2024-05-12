const filterElementsByClass = (elements) => (className) => {
  // Converting NodeList to Array (Alternative: [...elements])
  return Array.from(elements).filter((element) =>
    element.classList.contains(className)
  );
};

const resultDisplay = document.querySelector('input');
const buttons = document.querySelectorAll('button');
const searchButtonsFor = filterElementsByClass(buttons);
const numbers = searchButtonsFor('number');

for (const number of numbers) {
  number.addEventListener('click', (event) => {
    resultDisplay.value = number.value;
  });
}

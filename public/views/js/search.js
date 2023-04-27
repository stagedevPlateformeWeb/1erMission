/**
 * Redirects the user to the main index page with search query and price range parameters.
 * @param {string} searchQuery - The search query.
 */
function RedirectionVersIndex(searchQuery) {
  window.location.href = `/?search=${encodeURIComponent(searchQuery)}&min=${rechercheAvecPrix()[0]}&max=${rechercheAvecPrix()[1]}`;
}


const inputMinimum = document.getElementById('inputMinimum');
const inputMaximum = document.getElementById('inputMaximum');


/**
 * Handles price input values and returns an array with the minimum and maximum price values.
 * @returns {number[]} An array containing the minimum and maximum price values.
 */
function rechercheAvecPrix() {
  // Si la valeur minimale est supérieure à la valeur maximale, on inverse les valeurs
  if (parseInt(inputMinimum.value) > parseInt(inputMaximum.value)) {
    let temp = inputMinimum.value;
    if (temp > 1000|| temp < 0) {
      temp = 1000;
    }
    inputMinimum.value = inputMaximum.value;
    inputMaximum.value = temp;
    // Si la valeur minimale est inférieure à 0, on la met à 0
  } else if (parseInt(inputMinimum.value) < 0 || parseInt(inputMinimum.value) > 1000) {
    inputMaximum.value = 0;
  }

  // Si la valeur maximale est inférieure à la valeur minimale, on inverse les valeurs
  if (parseInt(inputMaximum.value) < parseInt(inputMinimum.value)) {
    let temp = inputMaximum.value;
    if (temp > 1000|| temp < 0) {
      temp = 1000;
    }
    inputMaximum.value = inputMinimum.value;
    inputMinimum.value = temp;
    // Si la valeur maximale est inférieure à 0, on la met à 0
  } else if (parseInt(inputMaximum.value) < 0 || parseInt(inputMaximum.value) > 1000) {
    inputMinimum.value = 1000;
  }
  return [inputMinimum.value, inputMaximum.value];
}

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');


// Add event listeners for click and keypress events

searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value.trim();
  RedirectionVersIndex(searchQuery);
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const searchQuery = searchInput.value.trim();
    RedirectionVersIndex(searchQuery);
  }
});

function RedirectionVersIndex(searchQuery) {
  window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
}

const inputMinimum = document.getElementById('inputMinimum');
const inputMaximum = document.getElementById('inputMaximum');

// Fonction qui permet de voir les valeurs saisies dans les inputs
function rechercheAvecPrix() {
  // Si la valeur minimale est supérieure à la valeur maximale, on inverse les valeurs
  if (inputMinimum.value > inputMaximum.value) {
    let temp = inputMinimum.value;
    inputMinimum.value = inputMaximum.value;
    inputMaximum.value = temp;
    // Si la valeur minimale est inférieure à 0, on la met à 0
  } else if (inputMinimum.value < 0 || inputMinimum.value > 1000) {
    inputMaximum.value = 0;
  }

  // Si la valeur maximale est inférieure à la valeur minimale, on inverse les valeurs
  if (inputMaximum.value < inputMinimum.value) {
    let temp = inputMaximum.value;
    inputMaximum.value = inputMinimum.value;
    inputMinimum.value = temp;
    // Si la valeur maximale est inférieure à 0, on la met à 0
  } else if (inputMaximum.value < 0 || inputMaximum.value > 1000) {
    inputMinimum.value = 1000;
  }
}

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');

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

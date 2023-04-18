function RedirectionVersIndex(searchQuery) {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const minPriceValue = minPrice.value;
  const maxPriceValue = maxPrice.value;
  console.log(minPriceValue);
  console.log(maxPriceValue);
  window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
}

const pointMinimum = document.getElementById('point-minimum');
const pointMaximum = document.getElementById('point-maximum');

let minValue = 0;
let maxValue = 100;

// J'initialiser la position des points
pointMinimum.style.left = "0px";
pointMaximum.style.right = "0px";

// On attend que l'utilisateur clique sur un point pour commencer le glisser
pointMinimum.addEventListener("mousedown", startDrag);
pointMaximum.addEventListener("mousedown", startDrag);

// Fonction pour commencer à glisser le point
function startDrag(event) {
  console.log("Début du glissement");
  const point = event.target;
  if (point === pointMinimum) {
    var initPosition = parseFloat(point.style.left);
  } else {
    var initPosition = parseFloat(point.style.right);
  }
  console.log(initPosition);

  // On attend que l'utilisateur bouge la souris
  document.addEventListener("mousemove", drag);

  // On attend que l'utilisateur relâche le clic
  document.addEventListener("mouseup", stopDrag);

  // Fonction pour gérer le déplacement du point
  function drag(event) {
    console.log("là");
    // On calcule la nouvelle position du point
    const newPosition =
        Math.min(
            100,
            Math.max(0, initPosition + ((event.clientX / window.innerWidth) * 100 - initPosition))
        );
    console.log(newPosition);

    // On déplace le point
    if (point === pointMinimum) {
      point.style.left = newPosition + "px";
    } else {
      point.style.right = newPosition + "px";
    }

    // On met à jour la coordonnée du point
    if (point === pointMinimum) {
      minValue = Math.round(parseFloat(newPosition) / 100 * (maxValue - minValue));
      console.log("Nouvelle valeur minimale : " + minValue);
    } else if (point === pointMaximum) {
      maxValue = Math.round(parseFloat(newPosition) / 100 * (maxValue - minValue) + minValue);
      console.log("Nouvelle valeur maximale : " + maxValue);
    }
  }

  // Fonction pour arrêter de glisser le point
  function stopDrag(event) {
    // On attend que l'utilisateur relâche la souris
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  }
}
/*
var valeurXMinimum = 0;

var valeurXMaximum = 0;

pointMinimum.addEventListener("mousedown", () => {
  console.log(valeurXMinimum + document.getElementById('point-minimum').offsetWidth);
  if (valeurXMinimum + document.getElementById('point-minimum').offsetWidth > valeurXMaximum) {
    console.log("test")
    valeurXMinimum += 1;
    document.getElementById('point-minimum').style.left = valeurXMinimum + "%";
    console.log(valeurXMinimum);
  }
});
pointMaximum.addEventListener("mousedown", () => {
  if (valeurXMaximum + document.getElementById('point-maximum').offsetWidth < valeurXMinimum && valeurXMinimum != 0 && valeurXMaximum != 0) {
    valeurXMaximum += 1;
    document.getElementById('point-maximum').style.right = valeurXMaximum + "%";
    console.log(valeurXMaximum);
  }
});
*/
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

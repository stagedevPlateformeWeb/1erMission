async function fetchProducts(searchQuery = '') {
  try {
    // Si searchQuery n'est pas fourni, on le récupère depuis l'URL
    if (!searchQuery) {
      const urlParams = new URLSearchParams(window.location.search);
      searchQuery = urlParams.get('search') || '';
      valeurMin = urlParams.get('min') || '';
      valeurMax = urlParams.get('max') || '';
    }

    // Si searchQuery est fourni, on l'ajoute à l'URL
    const url = searchQuery
      ? `http://localhost:4000/api/products?search=${encodeURIComponent(searchQuery)}&min=${encodeURIComponent(valeurMin)}&max=${encodeURIComponent(valeurMax)}`
      : 'http://localhost:4000/api/products';

    const response = await fetch(url);
    const products = await response.json();
    const productList = document.querySelector('.product-list');

    if (!productList) {
      return;
    }


    productList.innerHTML = '';

    products.forEach((product) => {
      if (product.name === null) {
        product.name = 'Sans nom';
      }
      if (product.price === null) {
        product.price = '--';
      }
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
        <h3>${product.name}</h3> 
        <h1>Prix: ${product.price}€</h1>
      `;
      productList.appendChild(productDiv);
      productDiv.addEventListener('click', () => {
        window.location.href = `/productDetails?productId=${product.id}`;
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalCount = cart.getItems().reduce((count, item) => count + item.quantity, 0);
  cartCount.textContent = totalCount;
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// fetchProducts sans paramètre pour charger tous les produits au début
fetchProducts();
updateCartCount();

let listeImages = ["https://nospensees.fr/wp-content/uploads/2016/10/Femme-buvant-de-leau.jpg", "https://consommerpropre.fr/wp-content/uploads/2021/03/potomanie-besoin-irrepressible-de-boire-de-l-eau_1b3cf37d6f14c45a2bebc1c94757fdffe4660546.jpeg", "https://images.radio-canada.ca/v1/ici-premiere/16x9/eclr-verre-eau.jpg"];

var indiceCourant = 1;

listeImages = shuffle(listeImages);

document.getElementById("image-instagram").src = listeImages[indiceCourant];

const boutonGaucheCarousel = document.getElementById("bouton-gauche");

boutonGaucheCarousel.addEventListener("click", () => {
  if (indiceCourant == 1 || indiceCourant == 2) {
    indiceCourant -= 1;
  }
  document.getElementById("image-instagram").src = listeImages[indiceCourant];
});


const boutonDroitCarousel = document.getElementById("bouton-droite");


if (boutonDroitCarousel) {
  boutonDroitCarousel.addEventListener("click", () => {
    if (indiceCourant == 0 || indiceCourant == 1) {
      indiceCourant += 1;
    }
    document.getElementById("image-instagram").src = listeImages[indiceCourant];
  });
}

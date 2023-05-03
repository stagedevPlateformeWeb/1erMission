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

function carouselManager(apiInsta) {
    const carousel = document.querySelector(".carousel-images-container");

    const carouselImages = document.querySelector(".carousel-images");

    let jsonCarousel = shuffle(apiInsta.publications);

    for (let i = 0; i < jsonCarousel.length; i++) {
      // Création du label de la publication
        let labelPublication = document.createElement("label");
        labelPublication.setAttribute("for", "slider-" + (i + 1));
        labelPublication.id = "publication-" + (i + 1);

        // Création de la div pour la carte de la publication
        let divPublication = document.createElement("div");
        divPublication.classList.add("card");

        // Création de l'image de la publication
        let divPublicationImage = document.createElement("div");
        divPublicationImage.classList.add("image");
        let imgPublication = document.createElement("img");
        imgPublication.src = jsonCarousel[i].image_url;
        divPublicationImage.appendChild(imgPublication);

        // Création des informations de la publication
        let divPublicationInfo = document.createElement("div");
        divPublicationInfo.classList.add("info-publication");

        let spanPublicationTitre = document.createElement("span");
        spanPublicationTitre.classList.add("name");
        spanPublicationTitre.textContent = jsonCarousel[i].titre;
        divPublicationInfo.appendChild(spanPublicationTitre);

        let lienPublication = document.createElement("a");
        lienPublication.href = "#"; // TODO: Ajouter le lien vers la publication dans le JSON (si possible)
        lienPublication.classList.add("acceder-publication");
        lienPublication.textContent = "Accéder";

        divPublication.appendChild(divPublicationImage);
        divPublication.appendChild(divPublicationInfo);
        divPublication.appendChild(lienPublication);
        console.log(divPublication);
        labelPublication.appendChild(divPublication);

        console.log(labelPublication);
        // Ajout de la publication dans le carousel
        carouselImages.appendChild(labelPublication);
    }
    // Ajout du carousel dans le conteneur
    carousel.appendChild(carouselImages);

}


// fetchProducts sans paramètre pour charger tous les produits au début
fetchProducts();
updateCartCount();
var jsonString = '{"publications": ' +
    '[{"titre": "Chocolat au lait", "image_url": "https://www.bonschocolatiers.com/_Images/Products/palomas/1280/0111000802-1-Tablette-Chocolat-Lait-45-90g-180515.jpg", "likes": 300}, ' +
    '{"titre": "Chocolat noir", "image_url": "https://joel-vilcoq-chocolatier.fr/152-large_default/chocolats.jpg", "likes": 299}, ' +
    '{"titre": "Chocolat blanc", "image_url": "https://chaudun.com/wp-content/uploads/2017/11/tablette-chocolat-blanc.png", "likes": 0}' +
    ']}';
carouselManager(JSON.parse(jsonString));


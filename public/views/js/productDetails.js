async function fetchProductDetails() {
  const productId = new URLSearchParams(window.location.search).get('productId');
  try {
    const response = await fetch(`http://localhost:4000/api/products/${productId}`);
    const product = await response.json();
    const productDetails = document.querySelector('.product-details');
    
    productDetails.innerHTML = `
      <h2>${product.name}</h2>
      <img src="${product.image_url}" alt="${product.name}" width="300" height="300">
      <p>Prix: ${product.price}€</p>
      <p>Description: ${product.description}</p>
      <button id="add-to-cart">Ajouter au panier</button>
    `;
    
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', () => {
      cart.addItem(product, 1);
      alert('Produit ajouté au panier');
      updateCartCount(); // Mettre à jour le compteur de panier chaque fois qu'un article est ajouté
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des détails du produit:', error);
  }
}

fetchProductDetails();

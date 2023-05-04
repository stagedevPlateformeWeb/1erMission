/**
 * Fetches the product details from the API and displays them on the page.
 * Also handles adding the product to the cart.
 * @async
 */
async function fetchProductDetails() {
  const productId = new URLSearchParams(window.location.search).get('productId');
  const clicksKey = `clicks_${productId}`;
  const productClicks = sessionStorage.getItem(clicksKey) || 0;
  console.log(`Clicks for product ${productId}: ${productClicks}`);

  try {
    const response = await fetch(`http://localhost:4000/api/products/${productId}`);
    const product = await response.json();
    const productDetails = document.querySelector('.product-details');
   
   
    if (product.description === null) {
      product.description = 'Aucune description disponible';
    } else if (product.name === null) {
      product.name = 'Aucun nom disponible';
    } else if (product.price === null) {
      product.price = 'Aucun prix disponible';
    } else if (product.image_url === null) {
      product.image_url = 'Aucune image disponible';
    }
    
    productDetails.innerHTML = `
  <h2>${product.name}</h2>
  <img src="${product.image_url}" alt="${product.name}" width="300" height="300">
  <label>Prix: ${product.price}€</label>
  <div class="description">
    <label>Description:</label>
    <p>${product.description}</p>
  </div>
  <button id="add-to-cart">Ajouter au panier</button>
`;
    
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', () => {
      cart.addItem(product, 1);
      alert('Produit ajouté au panier');
      updateCartCount();
    });} catch (error) {
      console.error('Erreur lors de la récupération des détails du produit:', error);
      }
      }
      

       // Retrieve the product ID from the URL and call the fetchProductDetails() function
      if (new URLSearchParams(window.location.search).get('productId')) {
      fetchProductDetails();
      }
      

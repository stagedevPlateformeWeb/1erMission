async function fetchProducts(searchQuery = '') {
  try {
    // Si searchQuery n'est pas fourni, on le récupère depuis l'URL
    if (!searchQuery) {
      const urlParams = new URLSearchParams(window.location.search);
      searchQuery = urlParams.get('search') || '';
    }
    
    // Si searchQuery est fourni, on l'ajoute à l'URL
    const url = searchQuery
      ? `http://localhost:4000/api/products?search=${encodeURIComponent(searchQuery)}`
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

// fetchProducts sans paramètre pour charger tous les produits au début
fetchProducts();
updateCartCount();

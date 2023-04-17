async function fetchProducts(searchQuery) {
  try {
    const url = searchQuery
      ? `http://localhost:4000/api/products?search=${encodeURIComponent(searchQuery)}`
      : 'http://localhost:4000/api/products';
      
    const response = await fetch(url);
    const products = await response.json();
    const productList = document.querySelector('.product-list');
    
    productList.innerHTML = '';
    
    products.forEach((product) => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>Prix: ${product.price}€</p>
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

// Appelez fetchProducts sans paramètre pour charger tous les produits au début
fetchProducts();
updateCartCount();

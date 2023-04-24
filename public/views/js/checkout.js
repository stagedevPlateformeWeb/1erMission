function displayCartItems() {
  const cartSummary = document.querySelector('.cart-summary');
  const cartItems = cart.getItems();

  // Créer un élément pour afficher le coût total
  const totalCostElement = document.createElement('h4');
  
  function updateTotalCost() {
    const totalCost = cart.getTotal();
    totalCostElement.innerHTML = `Coût total : ${totalCost.toFixed(2)}€`;
  }
  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalCount = cart.getItems().reduce((count, item) => count + item.quantity, 0);
    cartCount.textContent = totalCount;
  }
  
  cartItems.forEach((item) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
      <h3>${item.product.name}</h3>
      <p>Quantité : <span class="item-quantity">${item.quantity}</span></p>
      <div>
        <button type="button" class="decrement">-</button>
        <button type="button" class="increment">+</button>
      </div>
      <p>Prix unitaire : ${item.product.price}€</p>
      <p>Prix total : <span class="item-total-price">${(item.product.price * item.quantity).toFixed(2)}</span>€</p>
    `;

    const h3 = cartItemDiv.querySelector('h3');
    h3.addEventListener('click', () => {
      window.location.href = `/productDetails?productId=${item.product.id}`;
    });

    const decrementBtn = cartItemDiv.querySelector('.decrement');
    const incrementBtn = cartItemDiv.querySelector('.increment');
    const itemQuantity = cartItemDiv.querySelector('.item-quantity');
    const itemTotalPrice = cartItemDiv.querySelector('.item-total-price');

    function updatePrice() {
      itemTotalPrice.textContent = (item.product.price * item.quantity).toFixed(2);
    }

    decrementBtn.addEventListener('click', () => {
      const newQuantity = Math.max(item.quantity - 1, 0);
      cart.updateItemQuantity(item.product.id, newQuantity);
      item.quantity = newQuantity;
      itemQuantity.textContent = newQuantity;
      updatePrice();
      updateTotalCost();
      updateCartCount();
    });

    incrementBtn.addEventListener('click', () => {
      const newQuantity = Math.min(item.quantity + 1, 10);
      cart.updateItemQuantity(item.product.id, newQuantity);
      item.quantity = newQuantity;
      itemQuantity.textContent = newQuantity;
      updatePrice();
      updateTotalCost();
      updateCartCount();
    });

    cartSummary.appendChild(cartItemDiv);
  });

  updateTotalCost();
  cartSummary.appendChild(totalCostElement);

}

  
  async function isLoggedIn() {
    const response = await fetch('/api/isLoggedIn');
    const { isLoggedIn } = await response.json();
    return isLoggedIn;
  }
  
  async function placeOrder() {
    const placeOrderButton = document.getElementById('place-order');
  
    placeOrderButton.addEventListener('click', async () => {
      // Vérifier si l'utilisateur est connecté
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        alert('Veuillez vous connecter pour passer une commande.');
        window.location.href = '/login';
        return;
      }
  
      // Traitez la commande ici (Stripe ou PayPal)
      // Utilisez l'API de Stripe ou PayPal
  
      // Si le panier est vide, on ne fait rien
      if (cart.getItems().length === 0) {
        return;
      }
  
      // Vider le panier
      cart.clear();
  
      alert('Commande passée avec succès !');
  
      // Rediriger vers la page d'accueil
      window.location.href = '/';
    });
  }
  
  if (document.querySelector('.cart-summary')) {
    displayCartItems();
  }
  
  if (document.getElementById('place-order')) {
    placeOrder();
  }
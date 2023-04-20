const totalCostElement = document.createElement('h4');

function getTotalCost() {
  return cart.getTotal();
}
function updateTotalCost() {
  const totalCost = getTotalCost();
  totalCostElement.innerHTML = `Coût total : ${totalCost.toFixed(2)}€`;

  paymentRequest.update({ total: { label: 'Coût total', amount: Math.round(totalCost * 100) } });
}

function displayCartItems() {
  const cartSummary = document.querySelector('.cart-summary');
  const cartItems = cart.getItems();

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

      if (newQuantity === 0) {
        if (confirm("Voulez-vous supprimer ce produit du panier ?")) {
          cart.removeItem(item.product.id);
          cartItemDiv.remove();
        } else {
          item.quantity = 1;
          itemQuantity.textContent = 1;
          cart.updateItemQuantity(item.product.id, 1);
          updatePrice();
          updateTotalCost();
          updateCartCount();
        }
      }
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

  
      // Si le panier est vide, on ne fait rien
      if (cart.getItems().length === 0) {
        return;
      }
    
      // Créer une commande
      await handlePayment();

      
    });
  }
  
  if (document.querySelector('.cart-summary')) {
    displayCartItems();
  }
  
  if (document.getElementById('place-order')) {
    placeOrder();
  }
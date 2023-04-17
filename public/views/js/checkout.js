function displayCartItems() {
  const cartSummary = document.querySelector('.cart-summary');
  const cartItems = cart.getItems();

  let totalCost = 0;

  cartItems.forEach((item) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
      <h3>${item.product.name}</h3>
      <p>Quantité : ${item.quantity}</p>
      <p>Prix unitaire : ${item.product.price}€</p>
      <p>Prix total : ${(item.product.price * item.quantity).toFixed(2)}€</p>
    `;
    cartItemDiv.addEventListener('click', () => {
      window.location.href = `/productDetails?productId=${item.product.id}`;
    });
    cartSummary.appendChild(cartItemDiv);

    // update coût total
    totalCost += item.product.price * item.quantity;
  });

  // Créer un élément pour afficher le coût total
  const totalCostElement = document.createElement('h4');
  totalCostElement.innerHTML = `Coût total : ${totalCost.toFixed(2)}€`;
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
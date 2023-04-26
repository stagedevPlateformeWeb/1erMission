let orderBool = false;
async function saveAbandonedCart(userEmail, cartItems) {
    const response = await fetch('/api/save-abandoned-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userEmail, cartItems })
    });
  
    if (!response.ok) {
      console.error('Erreur lors de la sauvegarde du panier abandonné');
    }
  }

  async function getUserEmail() {
    const response = await fetch('/api/getUserEmail');
    const { userEmail } = await response.json();
    return userEmail;
  }
  

  async function isLoggedIn() {
    const response = await fetch('/api/isLoggedIn');
    const { isLoggedIn } = await response.json();
    return isLoggedIn;
  }

  async function beforeUnload(){
    //récuperer email utilisateur
    const userEmail = await getUserEmail();

    //récuperer panier si abandonné
    window.addEventListener('beforeunload', (event) => {
      // Vérifie si l'utilisateur est connecté et s'il y a des articles dans le panier
      if (isLoggedIn() && cart.getItems().length > 0 && orderBool === false) {
        saveAbandonedCart(userEmail, cart.getItems());
      }
    });
  }

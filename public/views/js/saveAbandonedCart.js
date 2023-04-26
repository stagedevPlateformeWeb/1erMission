
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
  

  function beforeUnload(orderBool){
    //récuperer panier si abandonné
    window.addEventListener('beforeunload', (event) => {
      // Vérifie si l'utilisateur est connecté et s'il y a des articles dans le panier
      if (IsLoggedIn() && cart.getItems().length > 0 && orderBool === false) {
        saveAbandonedCart(userEmail, cart.getItems());
      }
    });
  }

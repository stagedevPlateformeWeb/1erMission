
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
  
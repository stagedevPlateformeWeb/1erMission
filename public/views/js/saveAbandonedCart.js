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

async function getUserInfo() {
  const response = await fetch('/api/getUserInfo');
  const { userEmail, userName, userFirstName } = await response.json();
  return { userEmail, userName, userFirstName };
}

async function isLoggedIn() {
  const response = await fetch('/api/isLoggedIn');
  const { isLoggedIn } = await response.json();
  return isLoggedIn;
}

async function beforeUnload() {
  // récupérer l'email de l'utilisateur
  const userInfo = await getUserInfo();

  const userEmail = userInfo.userEmail;
  
  //si userEmail est null, on ne fait rien
 if(!userEmail){
    console.error('Erreur lors de la récupération de l\'email de l\'utilisateur');
    return;
  }


  // récupérer le panier si abandonné
  window.addEventListener('beforeunload', async (event) => {
    // Vérifie si l'utilisateur est connecté et s'il y a des articles dans le panier
    const loggedIn = await isLoggedIn();
    if (loggedIn && cart.getItems().length > 0 && orderBool === false) {
      saveAbandonedCart(userEmail, cart.getItems());
    }
  });
}


let orderBool = false;
function getNom() {
  return localStorage.getItem('nom');
}
function getPrenom() {
  return localStorage.getItem('prenom');
}
function getEmail() {
  return localStorage.getItem('email');
}
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


async function beforeUnload() {
  // récupérer l'email de l'utilisateur

  const userEmail = getEmail();
  
  //si userEmail est null, on ne fait rien
 if(!userEmail){
    console.error('Erreur lors de la récupération de l\'email de l\'utilisateur');
    return;
  }


  // récupérer le panier si abandonné
  window.addEventListener('beforeunload', async (event) => {
    
    if (userEmail!=null && cart.getItems().length > 0 && orderBool === true) {
      saveAbandonedCart(userEmail, cart.getItems());
    }
  });
}


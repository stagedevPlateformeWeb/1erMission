let orderBool = false;

function getOrderBool() {
  return localStorage.getItem('orderBool');
}
function setOrderBoolTrue() {
  localStorage.setItem('orderBool', true);
}
function setOrderBoolFalse() {
  localStorage.setItem('orderBool', false);
}
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

async function saveCartUnload() {
  // récupérer l'email de l'utilisateur

  const userEmail = getEmail();
  
  //si userEmail est null, on ne fait rien
 if(!userEmail){
    console.error('Erreur lors de la récupération de l\'email de l\'utilisateur');
    return;
  }else if (userEmail && cart.getItems().length > 0 && getOrderBool() === true) {
      saveAbandonedCart(userEmail, cart.getItems());
    }
}





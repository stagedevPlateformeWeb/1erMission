// let paypalButtonsRendered = false;

// //test
// const paypalButton = document.getElementById('pay-via-paypal');

// paypalButton.addEventListener('click', async () => {

//   // Si le panier est vide, afficher un message d'alerte et ne rien faire
//   if (cart.getItems().length === 0) {
//     alert("Votre panier est vide. Veuillez ajouter des articles avant de passer une commande.");
//     return;
//   }

//   // Afficher le bouton PayPal pour procéder au paiement si les boutons PayPal ne sont pas déjà affichés
//   if (!paypalButtonsRendered) {
//     document.getElementById('paypal-button-container').style.display = 'block';

//     // Rendre le bouton PayPal avec le montant du panier
//     renderPayPalButton();

//     // Mettre à jour la variable pour indiquer que les boutons PayPal sont affichés
//     paypalButtonsRendered = true;
//   }
// });

// /**
// * Hides the PayPal buttons on the page.
// */
// function hidePayPalButtons() {
// const paypalButtonContainer = document.getElementById('paypal-button-container');
// if (paypalButtonContainer) {
//   paypalButtonContainer.style.display = 'none';
// }
// }


// /**
// * Renders the PayPal button with the correct cart total.
// */
// function renderPayPalButton() {
// const oldPayPalButtons = document.querySelectorAll('.paypal-button');
// oldPayPalButtons.forEach((button) => button.remove());

// const cartTotal = cart.getTotal().toFixed(2);

// paypal.Buttons({
//   createOrder: function (data, actions) {
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             value: cartTotal,
//           },
//         },
//       ],
//     });
//   },
//   onApprove: function (data, actions) {
//     return actions.order.capture().then(function (details) {
//       alert('transaction completed by ' + details.payer.name.given);
//     });
//   },
// }).render('#paypal-button-container');
// }
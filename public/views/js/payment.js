
/**
 * Element representing the "Pay with card" button.
 */
const payCardButton = document.getElementById('payCard');

/**
 * Event listener for the "Pay with card" button click event.
 * Initiates the Stripe payment process.
 */
payCardButton.addEventListener('click', async () => {
  await handlePaymentStripe();
});


// Appeler la fonction renderPayPalButton directement pour afficher les boutons PayPal dès le chargement de la page
renderPayPalButton();

function renderPayPalButton() {
  const cartTotal = cart.getTotal().toFixed(2);

  paypal.Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: cartTotal,
            },
          },
        ],
      });
    },
    onApprove: async function (data, actions) {
      return actions.order.capture().then(async function (details) {
        alert('Transaction effectuée par ' + details.payer.name.given_name);

        // Ajoutez l'appel à transferUserData ici, en utilisant l'identifiant de l'utilisateur qui vient de payer.
        // Remplacez "userId" par la variable contenant l'identifiant réel de l'utilisateur.
        await transferUserData(userId);
      });
    },
  }).render('#paypal-button-container');
}


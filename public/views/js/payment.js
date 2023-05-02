let paymentClicked = false;
document.addEventListener('DOMContentLoaded', async () => {
  /**
   * Élément représentant le bouton "Payer avec carte".
   */
  const payCardButton = document.getElementById('payCard');

  if (payCardButton) {
    /**
     * Gestionnaire d'événements pour l'événement de clic sur le bouton "Payer avec carte".
     * Initialise le processus de paiement Stripe.
     */
    payCardButton.addEventListener('click', async () => {
      paymentClicked = true;
      await handlePaymentStripe();
    });
  }

  const paypalButton = document.getElementById('pay-via-paypal');
  if(paypalButton) {
    paypalButton.addEventListener('click', async () => {
      paymentClicked = true;
    });
  }

  const allLinks = document.querySelectorAll('html a');
  allLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      if (paymentClicked===false) {
        event.preventDefault();
        window.location.href = '/cancel';
      }
    });
  });
});

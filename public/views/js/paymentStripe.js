/**
 * The Stripe instance used for processing payments.
 */
const stripe = Stripe(
  'pk_test_51MyZGYLm2HjfbIuBARSWwaUFK3nqk2GMJOlut1EJENvTkKZv9mBPrmGdPRxrfNIp0KWdrxEWedVH6dt1jLAU42g000hhxMJLgU'
);


/**
 * Handles payment attempts, including any required actions if the payment is not completed.
 * @async
 */
async function handlePaymentAttempt() {
  // Fonction pour gérer les tentatives de paiement
}


/**
 * Handles Stripe payments by creating a checkout session and redirecting the user to the Stripe payment page.
 * @async
 */
async function handlePaymentStripe() {
  const lineItems = cart.getItems().map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.product.name
      },
      unit_amount: item.product.price * 100
    },
    quantity: item.quantity
  }));

  // Récupérer les informations de l'utilisateur
  const userInfo = await getUserInfo();

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lineItems,
      customerEmail: userInfo.userEmail,
      customerName: `${userInfo.userFirstName} ${userInfo.userName}`
    })
  });

  const session = await response.json();

  // Redirige l'utilisateur vers la page de paiement Stripe
  const result = await stripe.redirectToCheckout({
    sessionId: session.id
  });

  if (result.error) {
    console.error(result.error.message);
  }
}

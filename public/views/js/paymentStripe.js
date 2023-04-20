const stripe = Stripe(
    'pk_test_51MyZGYLm2HjfbIuBARSWwaUFK3nqk2GMJOlut1EJENvTkKZv9mBPrmGdPRxrfNIp0KWdrxEWedVH6dt1jLAU42g000hhxMJLgU'
    );

    async function handlePayment() {
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
      
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ lineItems })
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

// détails de la transaction
const paymentRequest = stripe.paymentRequest({
    country: 'FR',
    currency: 'eur',
    total: {
      label: 'Coût total',
      amount: Math.round(getTotalCost() * 100),
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });
  
  // Verif si Apple Pay est disponible
  paymentRequest.canMakePayment().then((result) => {
    if (result) {
      const applePayButton = document.getElementById('apple-pay-button');
      applePayButton.style.display = 'block';
  
      applePayButton.addEventListener('click', async () => {
        const result = await paymentRequest.show();
  
        if (result.error) {
          console.error(result.error.message);
        } else {
          // Gérez le succès du paiement ici
          console.log('Paiement réussi avec Apple Pay');
          window.location.href = '/success';
        }
      });
    }
  });
  

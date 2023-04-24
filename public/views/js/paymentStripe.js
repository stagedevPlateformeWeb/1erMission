const stripe = Stripe(
    'pk_test_51MyZGYLm2HjfbIuBARSWwaUFK3nqk2GMJOlut1EJENvTkKZv9mBPrmGdPRxrfNIp0KWdrxEWedVH6dt1jLAU42g000hhxMJLgU'
    );

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



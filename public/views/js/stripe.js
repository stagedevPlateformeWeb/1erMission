//  clé publique Stripe
const stripePublicKey = 'pk_test_51MyZGYLm2HjfbIuBARSWwaUFK3nqk2GMJOlut1EJENvTkKZv9mBPrmGdPRxrfNIp0KWdrxEWedVH6dt1jLAU42g000hhxMJLgU';
const stripe = Stripe(stripePublicKey);

const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const { paymentMethod, error } = await stripe.createPaymentMethod(
    'card', 
    cardElement, // cardElement est un objet du type Element qui représente un formulaire de carte bancaire généré par Stripe
    {
      billing_details: {
        name: event.target.name.value,
        email: event.target.email.value,
      },
    }
  );

  if (error) {
    console.error(error);
    return;
  }

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment_method_id: paymentMethod.id,
      amount: parseFloat(document.getElementById('amount').value),
    }),
  });

  if (response.ok) {
    window.location.href = '/success';
  } else {
    window.location.href = '/failure';
  }
});

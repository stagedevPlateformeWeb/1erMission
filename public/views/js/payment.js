const payCardButton = document.getElementById('payCard');

payCardButton.addEventListener('click', async () => {
    await handlePaymentStripe();
});

const payPaypalButton = document.getElementById('payPaypal');

payPaypalButton.addEventListener('click', async () => {
    //fonction paypal
});
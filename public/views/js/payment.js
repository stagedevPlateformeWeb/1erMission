const payCardButton = document.getElementById('payCard');

payCardButton.addEventListener('click', async () => {
    await handlePayment();
});

const payPaypalButton = document.getElementById('payPaypal');

payPaypalButton.addEventListener('click', async () => {
    //fonction paypal
});
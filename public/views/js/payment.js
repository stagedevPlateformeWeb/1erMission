const payCardButton = document.getElementById('payCard');

payCardButton.addEventListener('click', async () => {
    await handlePaymentStripe();
});
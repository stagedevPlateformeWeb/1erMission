document.addEventListener('DOMContentLoaded', async () => {
    const payCardButton = document.getElementById('payCard');
  
    if (payCardButton) {
      payCardButton.addEventListener('click', async () => {
        orderBool = true;
        await handlePaymentStripe();
      });
    }
  
    // Récupérer le panier si abandonné
    await beforeUnload(orderBool);
  });
  
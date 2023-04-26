const payCardButton = document.getElementById('payCard');

let orderBool = false;
payCardButton.addEventListener('click', async () => {
    orderBool = true;   
    await handlePaymentStripe();
});

  //recuperer panier si abandonné
  beforeUnload(orderBool);
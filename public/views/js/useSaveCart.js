document.addEventListener('DOMContentLoaded', async () => {

    // si la page cancelPayment est chargée, on sauvegarde le panier
    if(document.getElementById('paymentCanceled')) { 
        saveCart();
    }

});
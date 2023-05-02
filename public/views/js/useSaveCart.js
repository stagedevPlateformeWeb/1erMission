document.addEventListener('DOMContentLoaded', async () => {

if(document.getElementById('paymentCanceled')) { 
    console.log("l'email est :"+ getEmail());
    saveCartUnload();
}

});
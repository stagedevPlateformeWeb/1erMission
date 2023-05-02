document.addEventListener('DOMContentLoaded', async () => {

if(document.getElementById('paymentCanceled')) { 
    setOrderBoolTrue();
    saveCartUnload();
    setOrderBoolFalse();
}

});
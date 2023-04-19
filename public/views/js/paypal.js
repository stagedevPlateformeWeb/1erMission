function createPayPalButton() {
    paypal
      .Buttons({
        createOrder: async function (data, actions) {
          const response = await fetch("/api/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: cart.getItems(),
            }),
          });
  
          const orderData = await response.json();
          return orderData.orderID;
        },
        onApprove: async function (data, actions) {
          const response = await fetch("/api/checkout/" + data.orderID, {
            method: "POST",
          });
  
          if (response.ok) {
            alert("Paiement effectué avec succès !");
            cart.clear();
            window.location.href = "/";
          } else {
            alert("Erreur lors du paiement. Veuillez réessayer.");
          }
        },
      })
      .render("#paypal-button-container");
  }
  
  if (document.getElementById("paypal-button-container")) {
    createPayPalButton();
  }
document.addEventListener('DOMContentLoaded', async () => {
  /**
 * Element representing the "Pay with card" button.
 */
  const payCardButton = document.getElementById('payCard');
  if (payCardButton) {
    payCardButton.addEventListener('click', async () => {
      orderBool = true;
      await handlePaymentStripe();
    });
  }

  // Récupérer le panier si abandonné
  beforeUnload();
});

/**
 * Event listener for the "Pay with card" button click event.
 * Initiates the Stripe payment process.
 */
payCardButton.addEventListener('click', async () => {
    await handlePaymentStripe();
});


/**
 * Elements representing the input fields for user information.
 */
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const emailInput = document.getElementById('email');


/**
 * Event listeners for changes to the user information input fields.
 */
nomInput.addEventListener('change', handleInputChange);
prenomInput.addEventListener('change', handleInputChange);
emailInput.addEventListener('change', handleInputChange);


/**
 * Asynchronously handles input change events, saving user data to the server.
 * @async
 * @param {Event} event - The input change event.
 */
async function handleInputChange(event) {
  const nom = nomInput.value;
  const prenom = prenomInput.value;
  const email = emailInput.value;

  if (nom && prenom && email) {
    try {
      const response = await fetch('/api/save-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom, prenom, email }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement des données');
      }

      console.log('Données enregistrées avec succès');
    } catch (error) {
      console.error(error);
    }
  }
}



  
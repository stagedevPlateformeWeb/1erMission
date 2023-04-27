const payCardButton = document.getElementById('payCard');

payCardButton.addEventListener('click', async () => {
    await handlePaymentStripe();
});


const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const emailInput = document.getElementById('email');

nomInput.addEventListener('change', handleInputChange);
prenomInput.addEventListener('change', handleInputChange);
emailInput.addEventListener('change', handleInputChange);

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


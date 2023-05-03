document.addEventListener('DOMContentLoaded', async () => {
/**
 * Elements representing the input fields for user information.
 */
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const emailInput = document.getElementById('email');
const adresseInput = document.getElementById('adresse');
const codePostalInput = document.getElementById('codePostal');
const villeInput = document.getElementById('ville');
const telephoneInput = document.getElementById('telephone');

/**
 * Event listeners for changes to the user information input fields.
 */
nomInput.addEventListener('change', handleInputChange);
prenomInput.addEventListener('change', handleInputChange);
emailInput.addEventListener('change', handleInputChange);
adresseInput.addEventListener('change', handleInputChange);
codePostalInput.addEventListener('change', handleInputChange);
villeInput.addEventListener('change', handleInputChange);
telephoneInput.addEventListener('change', handleInputChange);

/**
 * Asynchronously handles input change events, saving user data to the server.
 * @async
 * @param {Event} event - The input change event.
 */
async function handleInputChange(event) {
  const nom = nomInput.value;
  const prenom = prenomInput.value;
  const email = emailInput.value;
  const adresse = adresseInput.value;
  const codePostal = codePostalInput.value;
  const ville = villeInput.value;
  const telephone = telephoneInput.value;

  try {
    const response = await fetch('/api/save-user-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, prenom, email, adresse, codePostal, ville, telephone }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'enregistrement des données');
    }
    console.log('Données enregistrées avec succès');
  } catch (error) {
    console.error(error);
  }

  localStorage.setItem('nom', nom);
  localStorage.setItem('prenom', prenom);
  localStorage.setItem('email', email);
}

});
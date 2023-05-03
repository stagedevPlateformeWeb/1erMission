/**
 * Éléments représentant les champs de saisie pour les informations de l'utilisateur.
 */
const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const emailInput = document.getElementById('email');

  nomInput.addEventListener('change', handleInputChange);
  prenomInput.addEventListener('change', handleInputChange);
  emailInput.addEventListener('change', handleInputChange);

  /**
   * Gère de manière asynchrone les événements de modification des entrées, en enregistrant les données utilisateur sur le serveur.
   * @async
   * @param {Event} event - L'événement de changement d'entrée.
   */
  async function handleInputChange(event) {
    const nom = nomInput.value;
    const prenom = prenomInput.value;
    const email = emailInput.value;
    submitForm(nom, prenom, email);
  }

  /**
   * Soumet le formulaire et enregistre les données utilisateur sur le serveur.
   * @async
   * @param {string} nom - Le nom de l'utilisateur.
   * @param {string} prenom - Le prénom de l'utilisateur.
   * @param {string} email - L'email de l'utilisateur.
   */
  async function submitForm(nom, prenom, email) {
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
          throw new Error("Erreur lors de l'enregistrement des données");
        }

        console.log('Données enregistrées avec succès');
      } catch (error) {
        console.error(error);
      }

      // Enregistre les données utilisateur dans le stockage local
      localStorage.setItem('nom', nom);
      localStorage.setItem('prenom', prenom);
      localStorage.setItem('email', email);
    }
  }
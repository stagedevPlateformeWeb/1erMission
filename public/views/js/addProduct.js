/**
 * Adds an event listener to the add-product-form to handle form submissions
 * and add a new product.
 * @listens submit
 */
document.getElementById('add-product-form').addEventListener('submit', async (event) => {
  // Empêche le comportement de soumission par défaut du formulaire
  event.preventDefault();

  // Récupère les valeurs des champs du formulaire
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  const image_url = document.getElementById('image_url').value;

  try {
    // Envoie une requête POST pour ajouter le nouveau produit
    const response = await fetch('/api/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, description, image_url }),
    });

    // Si la réponse est OK, affiche une alerte de succès et réinitialise le formulaire
    if (response.ok) {
      alert('Produit ajouté avec succès');
      document.getElementById('add-product-form').reset();
    } else {
      // Sinon, affiche une alerte avec le message d'erreur récupéré dans la réponse
      const errorMessage = await response.text();
      alert(`Erreur lors de l'ajout du produit : ${errorMessage}`);
    }
  } catch (error) {
    // Affiche une erreur dans la console en cas d'échec de la requête
    console.error('Erreur lors de l\'ajout du produit :', error);
  }
});
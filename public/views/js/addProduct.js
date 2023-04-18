document.getElementById('add-product-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value;
  const image_url = document.getElementById('image_url').value;

  try {
    const response = await fetch('/api/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, description, image_url }),
    });

    if (response.ok) {
      alert('Produit ajouté avec succès');
      document.getElementById('add-product-form').reset();
    } else {
      const errorMessage = await response.text();
      alert(`Erreur lors de l'ajout du produit : ${errorMessage}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du produit :', error);
  }
});

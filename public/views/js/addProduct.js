document.getElementById('add-product-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const imageUrl = document.getElementById('image-url').value;
  
    const response = await fetch('/api/add-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        price: price,
        description: description,
        image_url: imageUrl,
      }),
    });
  
    if (response.status === 201) {
      alert('Produit ajouté avec succès');
      window.location.href = '/'; // Rediriger vers la liste des produits
    } else {
      alert('Erreur lors de l\'ajout du produit');
    }
  });
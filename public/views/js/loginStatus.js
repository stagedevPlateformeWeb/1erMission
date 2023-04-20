async function updateLoginStatus() {

  const response = await fetch('/api/isLoggedIn');
  const { isLoggedIn, user } = await response.json();

  const loginContainer = document.getElementById('login-container');
  loginContainer.innerHTML = '';

  if (isLoggedIn) {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Déconnexion';
    logoutButton.onclick = async () => {
      await fetch('/api/logout');
      updateLoginStatus();
    };
    loginContainer.appendChild(logoutButton);

    const userInfo = document.createElement('span');
    userInfo.textContent = `Connecté en tant que : ${user.email}`;
    loginContainer.appendChild(userInfo);

    // Appel de la fonction pour afficher le bouton "Ajouter un produit"
    showAddProductButton(user);

  } else {
    const loginButton = document.createElement('button');
    loginButton.innerHTML = '<img src="img/login.png" alt="Login">';
    loginButton.onclick = () => {
      window.location.href = '/login';
    };
    loginContainer.appendChild(loginButton);
  }
}

function showAddProductButton(user) {
  const addProductButton = document.getElementById('add-product-button');

  if (user && user.role === 'admin') {
    addProductButton.style.display = 'block';
    addProductButton.onclick = () => {
      window.location.href = '/ajouter-un-produit';
    };
  } else {
    addProductButton.style.display = 'none';
  }
}

updateLoginStatus();
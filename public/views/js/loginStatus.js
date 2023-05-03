/**
 * Asynchronously updates the login status on the page.
 * Displays the user email and a logout button if the user is logged in,
 * otherwise displays a login button.
 * @async
 */




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

        const panelAdmin = document.createElement('button');
        panelAdmin.textContent = "Aller au panel administrateur";
        panelAdmin.onclick = () => {
            window.location.href = '/admin';
        }
        loginContainer.appendChild(panelAdmin);
    }
    else {
      const loginButton = document.createElement('button');
      loginButton.innerHTML = '<img src="../assets/bx-user.svg" alt="Login">';
      loginButton.onclick = () => {
        window.location.href = '/login';
      };
      loginContainer.appendChild(loginButton);
    }
  }


  /* administrateur page ajouter produit */

  const adminAddProduct = document.getElementById("ajouterProduit");
    adminAddProduct.addEventListener( () => {
        window.location.href("/admin/ajouterProduit");
    });









// Call the function to update the login status on page load.
updateLoginStatus();
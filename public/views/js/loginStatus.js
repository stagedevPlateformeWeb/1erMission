/**
Cette fonction met à jour l'état de connexion de l'utilisateur en effectuant une requête asynchrone
vers l'API '/api/isLoggedIn'. Si l'utilisateur est connecté, la fonction affiche un bouton de déconnexion
et les informations utilisateur. Sinon, elle affiche un bouton de connexion.
@function updateLoginStatus
@async
@returns {Promise<void>} Ne retourne rien.
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
    } else {
      const loginButton = document.createElement('button');
      loginButton.innerHTML = '<img src="assets/bx-user.svg" alt="Login">';
      loginButton.onclick = () => {
        window.location.href = '/login';
      };
      loginContainer.appendChild(loginButton);
    }
  }

// Appelle la fonction updateLoginStatus pour mettre à jour l'état de connexion de l'utilisateur
updateLoginStatus();
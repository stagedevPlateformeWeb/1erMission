document.addEventListener('DOMContentLoaded', async () => {
    const userIsLoggedIn = await isLoggedIn();
    if (userIsLoggedIn) {
      const userInfo = await getUserInfo();
      document.getElementById('nom').value = userInfo.userName || '';
      document.getElementById('prenom').value = userInfo.userFirstName || '';
      document.getElementById('email').value = userInfo.userEmail || '';
    }
  });
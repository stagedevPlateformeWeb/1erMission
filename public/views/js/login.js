/**
 * When the DOM content is loaded, this function adds event listeners to the login and signup forms
 * to handle form submissions and perform user authentication or registration.
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
      /**
     * Handles the login form submission and attempts to authenticate the user.
     * If successful, redirects to the home page, otherwise displays an error message.
     * @async
     * @param {Event} e - The submit event.
     */
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          alert('Connexion réussie !');
          window.location.href = '/';
        } else {
          alert('Erreur lors de la connexion. Veuillez réessayer.');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        alert('Erreur lors de la connexion. Veuillez réessayer.');
      }
    });
  }

  if (signupForm) {
      /**
     * Handles the signup form submission and attempts to register the user.
     * If successful, redirects to the home page, otherwise displays an error message.
     * @async
     * @param {Event} e - The submit event.
     */
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm.email.value;
        const name = signupForm.name.value;
        const first_name = signupForm.first_name.value;
        const password = signupForm.password.value;
      
        try {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, name, first_name, password })
          });
      
          if (response.ok) {
            alert('Inscription réussie !');
            window.location.href = '/';
          } else {
            alert('Erreur lors de l\'inscription. Veuillez réessayer.');
          }
        } catch (error) {
          console.error('Erreur lors de l\'inscription:', error);
          alert('Erreur lors de l\'inscription. Veuillez réessayer.');
        }
      });
    }
      
});

const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHashedPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('Hashed password:', hashedPassword);
}

// Remplacez 'your_password' par le mot de passe souhaité pour l'administrateur
generateHashedPassword('tyty');
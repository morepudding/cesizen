import bcrypt from 'bcrypt';

const password = "Admin123!";
const saltRounds = 10;

bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log("Mot de passe hashé:", hash);
  })
  .catch(err => {
    console.error("Erreur:", err);
  });
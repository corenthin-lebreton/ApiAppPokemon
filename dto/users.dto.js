const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const checkCreateUser = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    console.log("dto " + username);
    const userExist = await User.exists({ username: username });

    if (username === null || username === undefined) {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }
    if (userExist) {
      res
        .status(400)
        .send("Nom d'utilisateur déjà utilisé. Veuillez vous connecter.");
      return;
    }

    if (username?.length <= 0) {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }

    if (username?.length < 2) {
      res.status(400).send("Entrer un nom utilisateur plus grand.");
      return;
    }

    if (username?.length >= 30) {
      res.status(400).send("Entrer un nom utilisateur plus petit.");
    }

    if (typeof username !== "string") {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }

    if (password === null || password === undefined) {
      res.status(400).send("Entrer un mot de passe valide.");
      return;
    }

    if (!(username && password && confirmPassword)) {
      res.status(400).send("Tous les champs sont nécessaires");
      return;
    }

    if (password?.length <= 0) {
      res.status(400).send("Entrer un mot de passe valide.");
      return;
    }

    if (
      !password?.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~+-.,:;=?_]).{8,}$"
      )
    ) {
      res.status(400).send("Entrer un mot de passe solide.");
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).send("Les mots de passe ne correspondent pas.");
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur serveur");
  }
};

const checkLoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (username === null || username === undefined) {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }

    if (username?.length <= 0) {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }

    if (username?.length < 2) {
      res.status(400).send("Entrer un nom utilisateur plus grand.");
      return;
    }

    if (username?.length >= 30) {
      res.status(400).send("Entrer un nom utilisateur plus petit.");
      return;
    }

    if (typeof username !== "string") {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }

    if (password === null || password === undefined) {
      res.status(400).send("Entrer un mot de passe valide.");
      return;
    }

    if (!(username && password)) {
      res.status(400).send("Tous les champs sont nécessaires");
      return;
    }

    if (password?.length <= 0) {
      res.status(400).send("Entrer un mot de passe valide.");
      return;
    }

    next();
  } catch (error) {
    res.status(500).send("Erreur serveur");
  }
};

const checkPatchValue = async (req, res, next) => {
  try {
    const user = req.user;
    const { newUsername, oldPassword, newPassword } = req.body;

    if (newUsername?.length <= 0) {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }

    if (newUsername?.length < 2) {
      res.status(400).send("Entrer un nom utilisateur plus grand.");
      return;
    }

    if (newUsername?.length >= 30) {
      res.status(400).send("Entrer un nom utilisateur plus petit.");
    }

    if (typeof newUsername !== "string") {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }
    if (newUsername === null) {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }

    if (
      oldPassword &&
      (await bcrypt.compare(oldPassword, user.password)) &&
      !newPassword?.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~+-.,:;=?_]).{8,}$"
      )
    ) {
      res.status(400).send("Entrer un mot de passe solide.");
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Erreur serveur");
  }
};

module.exports = { checkCreateUser, checkPatchValue, checkLoginUser };

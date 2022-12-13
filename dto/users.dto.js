const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const checkCreateUser = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    const userExist = await User.exists({ username: username });

    if (username === null || username === undefined) {
      res.status(400).send("Entrer un nom utilisateur valide.");
      return;
    }
    if (userExist) {
      res
        .status(400)
        .json({
          message: "Nom d'utilisateur déjà utilisé. Veuillez vous connecter.",
        });
      return;
    }

    if (username?.length <= 0) {
      res.status(400).json({ message: "Entrer un nom utilisateur valide." });
      return;
    }

    if (username?.length < 2) {
      res
        .status(400)
        .json({ message: "Entrer un nom utilisateur plus grand." });
      return;
    }

    if (username?.length >= 30) {
      res
        .status(400)
        .send({ message: "Entrer un nom utilisateur plus petit." });
    }

    if (typeof username !== "string") {
      res.status(400).json({ message: "Entrer un nom utilisateur valide." });
      return;
    }

    if (password === null || password === undefined) {
      res.status(400).json({ message: "Entrer un mot de passe valide." });
      return;
    }

    if (!(username && password && confirmPassword)) {
      res.status(400).json({ message: "Tous les champs sont nécessaires" });
      return;
    }

    if (password?.length <= 0) {
      res.status(400).json({ message: "Entrer un mot de passe valide." });
      return;
    }

    if (
      !password?.match(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~+-.,:;=?_]).{8,}$"
      )
    ) {
      res.status(400).json({ message: "Entrer un mot de passe solide." });
      return;
    }

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas." });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const checkLoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).json({ message: "Tous les champs sont nécessaires" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { checkCreateUser, checkLoginUser };

const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Pokedex = require("../models/pokedexSchema");

const createUserController = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    console.log("controllers: " + username);
    encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.username = username;
    newUser.password = encryptedPassword;
    var token = jwt.sign({ user_id: newUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "30h",
    });

    await newUser.save();

    res.status(200).json({ username: newUser.username, token: token });
    return;
  } catch (error) {
    console.log(error);
    return res.status(500).send("Erreur serveur");
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      res.status(200).json({ username: user.username, token: token });
    } else {
      res.status(401).send("Nom utilisateur ou mot de passe incorrect");
    }
  } catch (error) {
    res.status(500).send("Erreur serveur");
  }
};

const patchUserController = async (req, res) => {
  try {
    const user = req.user;
    const { newUsername, oldPassword, newPassword } = req.body;

    user.username = newUsername ?? user.username;

    if (newPassword) {
      var encryptedNewPassword = await bcrypt.hash(newPassword, 10);

      if (user && (await bcrypt.compare(oldPassword, user.password))) {
        user.password = encryptedNewPassword;
      } else {
        res.status(401).send("Mot de passe incorrect");
        return;
      }
    }

    await user.save();

    res.status(200).json({
      message: "utilisateur modifié",
      user: user.username,
    });

    return;
  } catch (error) {
    res.status(500).send("Erreur serveur");
  }
};

const deleteUserController = async (req, res) => {
  const user = req.user;
  await Pokedex.deleteMany({ user: user._id });
  await user.remove();
  res.status(200).send("Utilisateur supprimé avec succès");
};

module.exports = {
  createUserController,
  patchUserController,
  deleteUserController,
  loginUser,
};

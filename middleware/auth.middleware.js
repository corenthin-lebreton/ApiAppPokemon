const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const isAuthentificated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      res.status(401).send("Vous n'êtes pas authentifié");
      return;
    }

    const cleanToken = token.split(" ")[1];

    try {
      var decodedToken = jwt.verify(cleanToken, process.env.TOKEN_KEY);
    } catch (error) {
      res.status(401).send("Token invalide.");
      return;
    }

    var user = await User.findOne({ _id: decodedToken.user_id });

    if (!user) {
      res.status(401).send("Nom utilisateur incorrect");
      return;
    }

    if (decodedToken.exp * 1000 < Date.now()) {
      res.status(401).send("Token expiré");
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).send("Erreur auth");
  }
};

module.exports = { isAuthentificated };

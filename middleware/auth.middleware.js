const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const isAuthentificated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
      res.status(401).json({ message: "Vous n'êtes pas authentifié" });
      return;
    }

    const cleanToken = token.split(" ")[1];

    try {
      var decodedToken = jwt.verify(cleanToken, process.env.TOKEN_KEY);
    } catch (error) {
      res.status(401).json({ message: "Token invalide." });
      return;
    }

    var user = await User.findOne({ _id: decodedToken.user_id });

    if (!user) {
      res.status(401).json({ message: "Nom utilisateur incorrect" });
      return;
    }

    if (decodedToken.exp * 1000 < Date.now()) {
      res.status(401).json({ message: "Token expiré" });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur auth" });
  }
};

module.exports = { isAuthentificated };

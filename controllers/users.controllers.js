const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { LobbyMaker } = require("matchmaking");

function getPlayerKey(player) {
  console.log("getPlayerKey " + player);
  return player.id;
}

function runGame(players) {
  console.log("Game started with:");
  console.log("RunGame : " + players);
}

const lobby = new LobbyMaker(runGame, getPlayerKey);

const createUserController = async (req, res) => {
  try {
    const { username, password } = req.body;
    encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();

    newUser.username = username;
    newUser.password = encryptedPassword;
    newUser.pokedollarz = 6;

    var token = jwt.sign({ user_id: newUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "30h",
    });

    await newUser.save();

    res.status(200).json({ username: newUser.username, token: token });
    return;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: "4h",
      });
      res.status(200).json({ username: user.username, token: token });
    } else {
      res
        .status(401)
        .json({ message: "Nom utilisateur ou mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getCoinControllers = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ pokedollarz: user.pokedollarz });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const reduceCoinControllers = async (req, res) => {
  try {
    const user = req.user;

    user.pokedollarz -= 1;

    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const addCoinControllers = async (req, res) => {
  try {
    const user = req.user;

    user.pokedollarz += 1;

    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//------------------------------Game Creation--------------------------------

const createGameControllers = (req, res) => {
  try {
    const user = req.user;

    const { roomName, isPrivate, password } = req.body;
    console.log("private " + isPrivate);

    if (isPrivate) {
      console.log("privé");

      lobby.createRoom(
        user,
        { name: roomName },
        {
          private: false,
          password: password,
          maxLobbySize: 2,
          autoStartWithMaxSize: true,
          autoStartWithMinSize: false,
        }
      );
      console.log("j'ai crée la room");
    } else {
      console.log("public");
      lobby.createRoom(
        user,
        { name: roomName },
        {
          private: false,
          maxLobbySize: 2,
          autoStartWithMaxSize: true,
          autoStartWithMinSize: false,
        }
      );
      console.log("j'ai crée la room");
    }
    console.log(lobby.listRooms());
    res.status(200).json({ message: "room created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getAllRoomController = (req, res) => {
  try {
    //get all rooms created from all players

    console.log(lobby.listRooms());
    res.status(200).json(lobby.listRooms());

    // res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const joinRoomController = (req, res) => {
  try {
    const user = req.user;
    const { password, private, id } = req.body;

    //check if room password is correct when private is true

    if (private === true && password == lobby.getRoom(id).password) {
      lobby.joinRoom(user, id, password);
      res.status(200).json({ message: "room joined" });
    } else if (private === false) {
      lobby.joinRoom(user, id);
      res.status(200).json({ message: "room joined" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
module.exports = {
  createUserController,
  loginUserController,
  getCoinControllers,
  reduceCoinControllers,
  addCoinControllers,
  createGameControllers,
  getAllRoomController,
  joinRoomController,
};

const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { LobbyMaker } = require("../packages/matchmaking");
const ArrayForFight = require("../models/arrayForFight.js");

function getPlayerKey(player) {
  console.log("getPlayerKey " + player);
  return player.id;
}

function runGame(players) {
  console.log("Game started with:");
  console.log("RunGame : " + players);
  playerJoined = true;
}

const lobby = new LobbyMaker(runGame, getPlayerKey);

lobby.createRoom("room1", 2);

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

const getUserNameController = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ username: user.username });
  } catch (error) {
    console.log(error);
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

const createGameControllers = async (req, res) => {
  try {
    const user = req.user;

    const { roomName, isPrivate, password } = req.body;

    if (isPrivate) {
      lobby.createRoom(user, roomName, {
        private: false,
        password: password,
        maxLobbySize: 2,
        autoStartWithMaxSize: true,
        autoStartWithMinSize: false,
      });
    } else {
      lobby.createRoom(user, roomName, {
        private: false,
        maxLobbySize: 2,
        autoStartWithMaxSize: true,
        autoStartWithMinSize: false,
      });
    }

    res.status(200).json({ message: "room created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getAllRoomController = (req, res) => {
  try {
    res.status(200).json(lobby.listRooms());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const joinRoomController = async (req, res) => {
  try {
    const user = req.user;
    const { password, private, id } = req.body;

    if (private) {
      const error = lobby.joinRoom(id, user, password);

      if (error) {
        res.status(401).json({ message: "Mot de passe incorrect" });
      } else {
        console.log(lobby.listRooms());
        res.status(200).json({ message: "room joined" });
      }
    } else if (!private) {
      console.log(id);
      const error = lobby.joinRoom(id, user);
      console.log(error);
      console.log(lobby.listRooms());
      res.status(200).json({ message: "room joined" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const isNewPlayerJoined = (req, res) => {
  try {
    const user = req.user;

    const rooms = lobby.listRooms();

    const isPlayerInRoom = rooms.filter(
      (room) =>
        room.currentPlayers.findIndex((value) => {
          return value.id === user.id;
        }) !== -1
    );

    if (isPlayerInRoom.length > 0) {
      console.log("current: " + isPlayerInRoom[0].currentPlayers);
      if (
        isPlayerInRoom[0].currentPlayers.length == isPlayerInRoom[0].maxPlayers
      ) {
        res.status(200).json({ message: "new player joined" });
      } else {
        res.status(200).json({ message: "waiting for new player" });
      }
    } else {
      res.status(200).json({ message: "Error you aren't in a room yet" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const isPlayerSendPokemonsListController = async (req, res) => {
  const user = req.user;
  const rooms = lobby.listRooms();

  const playersInRoom = rooms.filter(
    (room) =>
      room.currentPlayers.findIndex((value) => {
        return value.id === user.id;
      }) !== -1
  );

  if (playersInRoom.length === 0) {
    res.status(200).json({ message: "Error you aren't in a room yet" });
  } else {
    const ennemy = playersInRoom[0].currentPlayers.find((player) => {
      console.log(player);
      return player.id !== user.id;
    });

    const contentEnnemy = ArrayForFight.findOne({
      user: ennemy.id,
    });

    if (contentEnnemy) {
      res.status(200).json({ message: "ennemy is ready" });
    } else {
      res
        .status(200)
        .json({ message: "ennemy is selecting his pokemons for now" });
    }
  }
};

module.exports = {
  createUserController,
  loginUserController,
  getUserNameController,
  getCoinControllers,
  reduceCoinControllers,
  addCoinControllers,
  createGameControllers,
  getAllRoomController,
  joinRoomController,
  isNewPlayerJoined,
  isPlayerSendPokemonsListController,
};

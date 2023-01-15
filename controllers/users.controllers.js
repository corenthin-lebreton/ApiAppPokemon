const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { LobbyMaker } = require("../packages/matchmaking");
const ArrayForFight = require("../models/arrayForFight.js");

function getPlayerKey(player) {
  return player.id;
}

function runGame(players) {
  console.log("RunGame : " + players);
  playerJoined = true;
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

//------------------------------Game Creation----------------------------------

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
        res.status(200).json({ message: "room joined" });
      }
    } else if (!private) {
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

    const contentEnnemy = await ArrayForFight.findOne({
      user: ennemy._id,
    });

    if (!contentEnnemy) {
      res
        .status(200)
        .json({ message: "ennemy is selecting his pokemons for now" });
    } else {
      const pokemonsHost = await ArrayForFight.findOne({
        user: user._id,
      });

      if (!pokemonsHost) {
        res.status(200).json({ message: "you need to select your pokemons" });
      } else {
        async function getStatsFromPokemons(pokemons) {
          return await Promise.all(
            pokemons.pokemonsForFight.map(async (pokemon) => {
              const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemon}`
              );
              const data = await res.json();
              const hp = data.stats.filter((stat) => {
                return stat.stat.name === "hp";
              });

              const attack = data.stats.filter((stat) => {
                return stat.stat.name === "attack";
              });

              const defense = data.stats.filter((stat) => {
                return stat.stat.name === "defense";
              });

              const speed = data.stats.filter((stat) => {
                return stat.stat.name === "speed";
              });
              return {
                id: data.id,
                hp: hp[0].base_stat,
                attack: attack[0].base_stat,
                defense: defense[0].base_stat,
                speed: speed[0].base_stat,
              };
            })
          );
        }

        const statsHost = await getStatsFromPokemons(pokemonsHost);
        const statsEnnemy = await getStatsFromPokemons(contentEnnemy);

        function fight() {
          let host = 0;
          let ennemy = 0;

          while (true) {
            let hostPokemon = statsHost[host];
            let ennemyPokemon = statsEnnemy[ennemy];

            while (hostPokemon.hp > 0 && ennemyPokemon.hp > 0) {
              if (hostPokemon.speed > ennemyPokemon.speed) {
                ennemyPokemon.hp -=
                  (2 / 5 + 2) * (hostPokemon.attack / ennemyPokemon.defense) +
                  2;
                if (ennemyPokemon.hp > 0) {
                  hostPokemon.hp -=
                    (2 / 5 + 2) * (ennemyPokemon.attack / hostPokemon.defense) +
                    2;
                }
              } else {
                hostPokemon.hp -=
                  (2 / 5 + 2) * (ennemyPokemon.attack / hostPokemon.defense) +
                  2;
                if (hostPokemon.hp > 0) {
                  ennemyPokemon.hp -=
                    (2 / 5 + 2) * (hostPokemon.attack / ennemyPokemon.defense) +
                    2;
                }
              }
            }

            if (hostPokemon.hp <= 0) {
              host++;
              hostPokemon = statsHost[host];
            } else if (ennemyPokemon.hp <= 0) {
              ennemy++;
              ennemyPokemon = statsEnnemy[ennemy];
            }

            if (host === statsHost.length) {
              return "ennemy";
            } else if (ennemy === statsEnnemy.length) {
              return "host";
            }
          }
        }

        const winner = fight();

        const isEnnemyWon = await ArrayForFight.findOne({
          user: ennemy._id,
        });
        console.log(isEnnemyWon);
        pokemonsHost.isPlayerWon = true;

        await pokemonsHost.save();

        if (isEnnemyWon.isPlayerWon) {
          lobby.deleteRoom(playersInRoom[0].id);

          await contentEnnemy.remove();
          await pokemonsHost.remove();
        }
        if (winner === "host") {
          const coinForHost = await User.findOne({
            _id: user._id,
          });

          coinForHost.pokedollarz += 1;

          await coinForHost.save();
          res.status(200).json({
            message: "you won the game and you get 1 coin",
            contentEnnemy: contentEnnemy.pokemonsForFight,
            pokemonHost: pokemonsHost.pokemonsForFight,
          });
        } else {
          res.status(200).json({
            message: "you lost the game",
            contentEnnemy: contentEnnemy.pokemonsForFight,
            pokemonHost: pokemonsHost.pokemonsForFight,
          });
        }
      }
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

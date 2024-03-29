"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let errorMessages = {
  roomIsFull: "Room is full",
  roomNotFound: "Room not found",
  playerAlreadyInRoom: "Player already in room",
  playerNotInRoom: "Player is not in room",
  wrongPassword: "Wrong password",
  passwordRequried: "Password is required",
  morePlayersToStart: "Room needs more players to start",
};
class LobbyMaker {
  constructor(resolver, getKey) {
    this.createRoom = (newPlayer, roomName, options) => {
      let playerKey = this.getKey(newPlayer);
      for (let player of Array.from(this.rooms.values())
        .map((val) => val.players)
        .flat()) {
        if (this.getKey(player) == playerKey) {
          return new Error(errorMessages.playerAlreadyInRoom);
        }
      }
      let settings = this.getRoomSettings(options);
      this.rooms.set(this.nextFreeId, {
        players: [newPlayer],
        settings,
        name: roomName,
      });
      return this.nextFreeId++;
    };
    this.joinRoom = (roomId, newPlayer, password) => {
      if (!this.rooms.has(roomId)) return new Error(errorMessages.roomNotFound);
      let room = this.rooms.get(roomId);
      if (room.settings.maxLobbySize == room.players.length)
        return new Error(errorMessages.roomIsFull);
      if (room.settings.password != "" && !password)
        return new Error(errorMessages.passwordRequried);
      if (room.settings.password != "" && password != room.settings.password)
        return new Error(errorMessages.wrongPassword);
      let newPlayerKey = this.getKey(newPlayer);
      for (let player of room.players) {
        if (this.getKey(player) == newPlayerKey) {
          return new Error(errorMessages.playerAlreadyInRoom);
        }
      }
      room.players.push(newPlayer);
      if (
        room.settings.minLobbySize <= room.players.length &&
        room.settings.autoStartWithMinSize
      )
        this.startGame(roomId);
      else if (
        room.settings.maxLobbySize == room.players.length &&
        room.settings.autoStartWithMaxSize
      )
        this.startGame(roomId);
    };
    this.startGame = (roomId) => {
      if (!this.rooms.has(roomId)) return new Error(errorMessages.roomNotFound);
      let room = this.rooms.get(roomId);
      if (room.settings.minLobbySize > room.players.length)
        return new Error(errorMessages.morePlayersToStart);
      this.resolver(room.players);
    };
    this.leaveRoom = (roomId, player) => {
      let playerKey = this.getKey(player);
      if (!this.rooms.has(roomId)) return new Error(errorMessages.roomNotFound);
      let room = this.rooms.get(roomId);
      let index = room.players.findIndex(
        (player) => this.getKey(player) == playerKey
      );
      if (index == -1) return new Error(errorMessages.playerNotInRoom);
      room.players.splice(index, 1);
      if (room.players.length == 0) this.deleteRoom(roomId);
    };
    this.deleteRoom = (roomId) => {
      this.rooms.delete(roomId);
    };
    this.listRooms = () => {
      let rooms = [];
      for (let room of this.rooms) {
        let [id, { players, settings, name }] = room;
        if (settings.private) continue;
        rooms.push({
          id,
          name,
          passwordIsRequired: settings.password != "",
          currentPlayers: players,
          maxPlayers: settings.maxLobbySize,
        });
      }
      return rooms;
    };
    this.resolver = resolver;
    this.rooms = new Map();
    this.getKey = getKey;
    this.nextFreeId = Number.MIN_SAFE_INTEGER;
  }
  joinRoomByName(roomName, newPlayer, password) {
    for (let room of this.rooms) {
      let [id, { name }] = room;
      if (name == roomName) {
        this.joinRoom(id, newPlayer, password);
      }
    }
  }
  getRoomSettings(options) {
    if (!options) return this.defaultSettings();
    let returnSetings = {
      autoStartWithMinSize: (options && options.autoStartWithMinSize) || false,
      autoStartWithMaxSize: (options && options.autoStartWithMaxSize) || false,
      password: (options && options.password) || "",
      private: (options && options.private) || false,
      maxLobbySize:
        (options &&
          options.maxLobbySize &&
          options.maxLobbySize > 0 &&
          options.maxLobbySize) ||
        2,
      minLobbySize:
        (options &&
          options.minLobbySize &&
          options.minLobbySize > 0 &&
          options.minLobbySize) ||
        (options &&
          options.maxLobbySize &&
          options.maxLobbySize > 0 &&
          options.maxLobbySize) ||
        2,
    };
    return returnSetings;
  }
  defaultSettings() {
    let settings = {
      autoStartWithMinSize: false,
      autoStartWithMaxSize: false,
      password: "",
      private: false,
      maxLobbySize: 2,
      minLobbySize: 2,
    };
    return settings;
  }
}
exports.LobbyMaker = LobbyMaker;
//# sourceMappingURL=lobby.js.map

const Game = require("./../models/game");
const User = require("./../models/user");
const { Types } = require("mongoose");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  async index(_, res) {
    const games = await Game.find()
      .populate("organizer")
      .populate("playerList");

    return res.status(StatusCodes.OK).json(games);
  },

  async store(req, res) {
    const { title, description, dateTime, location, organizer } = req.body;

    if (!title || !dateTime || !location || !description || !organizer) {
      return res.status(StatusCodes.BAD_REQUEST).send();
    }

    try {
      await Game.create({
        title,
        description,
        dateTime,
        location,
        organizer,
      });

      return res.status(StatusCodes.CREATED).send();
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  },

  async update(req, res) {
    const { title, description, date, time, location } = req.body;

    const id = req.params.id;

    // Build the update object
    const update = Object.fromEntries(
      Object.entries({
        title,
        description,
        date,
        time,
        location,
      }).filter(([key, value]) => value !== undefined)
    );

    try {
      const updatedGame = await Game.findOneAndUpdate({ _id: id }, update, {
        new: true,
      }).populate("playerList", "fullName");

      if (!updatedGame) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Game not found." });
      }

      return res.json(updatedGame);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },

  async delete(req, res) {
    const id = req.params.id;

    try {
      const deletedGame = await Game.findOneAndDelete({ _id: id });

      if (!deletedGame) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Game not found." });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: "Game deleted successfully." });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
  async findById(req, res) {
    const gameId = req.params.id;

    try {
      const game = await Game.findById(gameId)
        .populate("organizer")
        .populate("playerList");

      if (!game) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Game not found." });
      }

      return res.status(StatusCodes.OK).json(game);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
  async addUserToPlayerList(req, res) {
    const { gameId, userId } = req.params;

    // verifica se o jogo existe
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // verifica se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // verifica se o usuário já está na lista de jogadores
    const playerList = game.playerList.map((player) => player.toString());
    if (playerList.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already in the player list" });
    }

    // adiciona o usuário à lista de jogadores
    game.playerList.push(new Types.ObjectId(userId));
    await game.save();

    return res.json({ message: "User added to player list", game });
  },
  async removeUserFromPlayerList(req, res) {
    const { gameId, userId } = req.params;

    // verifica se o jogo existe
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // verifica se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // verifica se o usuário já está na lista de jogadores
    const playerList = game.playerList.map((player) => player.toString());
    console.log(playerList);
    console.log(userId);
    if (!playerList.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is not in the player list" });
    }

    // remove o usuário da lista de jogadores
    game.playerList = game.playerList.filter(
      (player) => player.toString() !== userId
    );
    await game.save();

    return res.json({ message: "User removed from player list", game });
  },
};

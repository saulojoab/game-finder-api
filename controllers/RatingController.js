const Rating = require("./../models/rating");
const { Types } = require("mongoose");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  async index(_, res) {
    const games = await Rating.find().populate("user").populate("game");

    return res.status(StatusCodes.OK).json(games);
  },

  async store(req, res) {
    const { user, game, rating } = req.body;

    if (!user || !game || !rating) {
      return res.status(StatusCodes.BAD_REQUEST).send();
    }

    try {
      await Rating.create({
        game,
        user,
        rating,
      });

      return res.status(StatusCodes.CREATED).send();
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  },

  async update(req, res) {
    const { game, user, rating } = req.body;

    // Build the update object
    const update = Object.fromEntries(
      Object.entries({
        game,
        user,
        rating,
      }).filter(([, value]) => value !== undefined)
    );

    try {
      const updatedRating = await Rating.findOneAndUpdate(
        { user, game },
        update,
        {
          new: true,
        }
      ).populate("user", "game");

      if (!updatedRating) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Rating not found." });
      }

      return res.json(updatedRating);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
  async findByUser(req, res) {
    const { id } = req.params;

    try {
      const ratings = await Rating.find({ user: id })
        .populate("user")
        .populate("game");

      return res.json(ratings);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
  async findByGame(req, res) {
    const { id } = req.params;

    try {
      const ratings = await Rating.find({ game: id })
        .populate("user")
        .populate("game");

      return res.json(ratings);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
  async findByUserAndGame(req, res) {
    const { user, game } = req.params;

    try {
      const rating = await Rating.findOne({ user, game })
        .populate("user")
        .populate("game");

      console.log(rating);

      return res.json(rating);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
};

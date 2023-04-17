const User = require("./../models/user");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

module.exports = {
  async index(_, res) {
    const users = await User.find();

    return res.status(StatusCodes.OK).json(users);
  },

  async store(req, res) {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      gender,
      location,
      skillLevel,
      preferredPosition,
      teamPreferences,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !phoneNumber ||
      !dateOfBirth ||
      !gender ||
      !location ||
      !skillLevel ||
      !preferredPosition ||
      !teamPreferences
    ) {
      return res.status(StatusCodes.BAD_REQUEST);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        dateOfBirth,
        gender,
        location,
        skillLevel,
        preferredPosition,
        teamPreferences,
      });

      return res.status(StatusCodes.CREATED).send();
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  },

  async update(req, res) {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      gender,
      location,
      skillLevel,
      preferredPosition,
      teamPreferences,
      paymentInformation,
    } = req.body;

    const id = req.params.id;

    // Build the update object
    const update = Object.fromEntries(
      Object.entries({
        fullName,
        email,
        password,
        phoneNumber,
        dateOfBirth,
        gender,
        location,
        skillLevel,
        preferredPosition,
        teamPreferences,
        paymentInformation,
      }).filter(([key, value]) => value !== undefined)
    );

    try {
      const updatedUser = await User.findOneAndUpdate({ _id: id }, update, {
        new: true,
      });

      if (!updatedUser) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found." });
      }

      return res.json(updatedUser);
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
      const deletedUser = await User.findOneAndDelete({ _id: id });

      if (!deletedUser) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found." });
      }

      return res
        .status(StatusCodes.OK)
        .json({ message: "User deleted successfully." });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },

  async find(req, res) {
    const id = req.params.id;

    try {
      const foundUser = await User.findOne({ _id: id });

      if (!foundUser) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found." });
      }

      return res.json(foundUser);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const foundUser = await User.findOne({ email });

      if (!foundUser) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Invalid email or password." });
      }

      // Compare the entered password with the hashed password
      const isMatch = await bcrypt.compare(password, foundUser.password);

      if (!isMatch) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Invalid email or password." });
      }

      return res.json({ message: "Login successful.", user: foundUser });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error." });
    }
  },
};

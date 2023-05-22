const { Router } = require("express");

const UserController = require("./controllers/UserController");
const GameController = require("./controllers/GameController");
const RatingController = require("./controllers/RatingController");

const routes = Router();

routes.get("/users", UserController.index);
routes.post("/users", UserController.store);
routes.put("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.delete);
routes.get("/users/:id", UserController.find);
routes.post("/users/login", UserController.login);

routes.get("/games", GameController.index);
routes.post("/games", GameController.store);
routes.put("/games/:id", GameController.update);
routes.delete("/games/:id", GameController.delete);
routes.get("/games/:id", GameController.findById);
routes.post("/games/:gameId/:userId", GameController.addUserToPlayerList);
routes.delete(
  "/games/:gameId/:userId",
  GameController.removeUserFromPlayerList
);
routes.get("/games/user/:userId", GameController.getAllGamesFromUser);

routes.get("/ratings", RatingController.index);
routes.post("/ratings", RatingController.store);
routes.put("/ratings", RatingController.update);
routes.get("/ratings/user/:id", RatingController.findByUser);
routes.get("/ratings/game/:id", RatingController.findByGame);
routes.get("/ratings/:game/:user", RatingController.findByUserAndGame);

module.exports = routes;

const { Router } = require("express");

const UserController = require("./controllers/UserController");

const routes = Router();

routes.get("/users", UserController.index);
routes.post("/users", UserController.store);
routes.put("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.delete);
routes.get("/users/:id", UserController.find);
routes.post("/users/login", UserController.login);

module.exports = routes;

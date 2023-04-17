require("dotenv").config();
var app = require("./app");
var http = require("http");

var port = process.env.PORT || "8765";
app.set("port", port);

var server = http.createServer(app);
server.listen(port, () => console.log(`OK Computer - Running at ${port}`));

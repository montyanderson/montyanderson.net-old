const express = require("express");
const redis = require("redis");

global.db = redis.createClient();
const app = express();

app.set("view engine", "jade");

app.get("/", function(req, res) {
	res.render("index");
});

app.listen(8080, "127.0.0.1");

var express = require("express"),
	app = express();

var ect = require("ect")({
	"watch": true,
	"root": __dirname + "/views",
	"ext": ".ect"
});

app.set("view engine", "ect");
app.engine("ect", ect.render);

app.get("/", function(req, res) {
	res.render("index");
});

app.get("/git", function(req, res) {
	res.render("git");
});

app.get("/records", function(req, res) {
	res.render("records");
});

var ip = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_PORT || process.argv[2] || 8080;

app.listen(port, ip, function() {});
var express = require("express"),
	app = express();

var ect = require("ect")({
	"watch": true,
	"root": __dirname + "/views",
	"ext": ".ect"
});

app.set("view engine", "ect");
app.engine("ect", ect.render);

app.use(express.static("static"));

var page = function(path, file) {
	app.get(path, function(req, res) {
		res.render(file);
	});
}

page("/", "index");
page("/git", "git");
page("/portfolio", "portfolio");
page("/records", "records");
page("/thoughts", "thoughts");

var ip = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "";
var port = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_PORT || process.argv[2] || 8080;

app.listen(port, ip, function() {});
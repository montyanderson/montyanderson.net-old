var express = require("express"),
	fs = require("fs");
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

/* Blog */

var posts = fs.readdirSync("blog");
posts = posts.sort();
console.log(posts);

app.get("/blog", function(req, res) {
	var posts = [];
	var count = 0;

	var callback = function(error, data) {
		if(!error && count != 6) {   // read file ``
			if(data) {
				posts.unshift(JSON.parse(data));
			}

			fs.readFile("blog/" + count + ".json", callback);
		} else if (count != 6) {     // failed to read file
			fs.readFile("blog/" + count + ".json", callback);
		} else {
			res.render("blog", {posts: posts});
		}

		count++;
	}

	callback();
});

/* Start the server */

var ip = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "";
var port = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_PORT || process.argv[2] || 8080;

app.listen(port, ip, function() {});

var fs = require("fs"),
	express = require("express"),
	Mustache = require("mustache");

var build = require("./build.js");

var app = express();

app.engine("mustache", function(filePath, options, callback) {
	fs.readFile(__dirname + "/templates/layout.mustache", function(layoutError, layout) {
		if (layoutError) return callback(new Error(layoutError));

		fs.readFile(filePath, function(pageError, page) {
			if (pageError) return callback(new Error(pageError));

			var html = Mustache.render(layout.toString(), options, {page: page.toString()});
			return callback(null, html);
		});
	});
});

app.set("views", __dirname + "/views");
app.set("view engine", "mustache");

var page = function(path, file) {
	app.get(path, function(req, res) {
		res.render(file);
	});
};

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
		if(!error && count != 6) {   // read file
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
	};

	callback();
});

build();

/* Start the server */

var ip = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "";
var port = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_PORT || process.argv[2] || 8080;

app.listen(port, ip, function() {});

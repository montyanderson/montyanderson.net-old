var fs = require("fs"),
    path = require("path"),
    express = require("express"),
    mustache = require("mustache"),
    sm = require("sitemap");

var app = express();

app.engine("mustache", function(filePath, options, callback) {
    var layoutPath = path.join(__dirname, app.get("layouts"), options.layout) + ".mustache";

    fs.readFile(layoutPath, function(layoutError, layout) {
        if(layoutError) return callback(new Error(layoutError));

        fs.readFile(filePath, function(pageError, page) {
            if(pageError) return callback(new Error(pageError));

            var html = mustache.render(layout.toString(), options, {page: page.toString()});
            return callback(null, html);
        });
    });
});

app.set("views", "./templates/views");
app.set("layouts", "./templates/layouts");
app.set("view engine", "mustache");

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.render("index", {
        layout: "main",
        repos: repos.slice(0, 3),
        totalRepos: repos.length,
        age: Math.round(Math.abs((new Date().getTime() - new Date("04/29/2001").getTime()) / (24*60*60*1000))) / 365.00,
        since1970: new Date().getTime()
    });
});

app.get("/git", function(req, res) {
    res.render("git", {
        layout: "main",
        repos: repos
    });
});

var sitemap = sm.createSitemap({
    hostname: "http://montyanderson.net",
    cacheTime: 600000,
    urls: [
        {url: "/",  changefreq: "weekly", priority: 1},
        {url: "/git",  changefreq: "daily", priority: 0.5}
    ]
});

app.get("/sitemap.xml", function(req, res) {
    sitemap.toXML( function (xml) {
        res.header("Content-Type", "application/xml");
        res.send(xml);
    });
});

var repos = [];
var languages = [];

require("./repos.js")(function(data) {
    repos = data.repos;
    languages = data.languages;
});

var port = process.env.PORT || process.argv[3] || 8080;
var ip =  process.env.IP || process.argv[4] || "";
app.listen(port, ip);

console.log("Server started at " + ip + ":" + port + ".");

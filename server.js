var fs = require("fs"),
    path = require("path"),
    express = require("express"),
    mustache = require("mustache"),
    async = require("async"),
    merge = require("merge"),
    compression = require("compression"),
    sm = require("sitemap");

var app = express();

app.engine("mustache", function(filePath, options, callback) {
    var files = [];

    files.push(path.join(app.get("layouts"), options.layout) + ".mustache");
    files.push(filePath);

    if(options.data)
        files.push(path.join(app.get("data"), options.data) + ".json");

    async.map(files, fs.readFile, function(err, data) {
        if(err) return callback(new Error(err));

        options.pages = pages;

        if(data[2])
            merge(options, JSON.parse(data[2]));

        var html = mustache.render(data[0].toString(), options, {page: data[1].toString()});
        return callback(null, html);
    });
});

app.set("views", __dirname + "/templates/views");
app.set("layouts", __dirname + "/templates/layouts");
app.set("data", __dirname + "/templates/data");
app.set("view engine", "mustache");

app.use(compression());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules/materialize-css/bin/"));

app.get("/", function(req, res) {
    res.render("index", {
        layout: "main",
        data: "index",
        repos: repos.slice(0, 3),
        totalRepos: repos.length,
        age: Math.round(Math.abs((new Date().getTime() - new Date("04/29/2001").getTime()) / (24*60*60*1000))) / 365.00,
        since1970: new Date().getTime()
    });
});

app.get("/git", function(req, res) {
    res.redirect("/");
})

app.get("/portfolio", function(req, res) {
    res.render("portfolio", {
        title: "Portfolio",
        data: "portfolio",
        layout: "main"
    });
});

app.get("/albums", function(req, res) {
    res.render("albums", {
        title: "Albums",
        data: "albums",
        layout: "main"
    });
});

var pages = [
    {
        url: "/",
        title: "Home",
        changefreq: "weekly",
        priority: 1
    },
    {
        url: "/portfolio",
        title: "Portfolio",
        changefreq: "weekly",
        priority: 0.5
    },
    {
        url: "/albums",
        title: "Albums",
        changefreq: "weekly",
        priority: 0.5
    }
];

var sitemap = sm.createSitemap({
    hostname: "http://montyanderson.net",
    cacheTime: 600000,
    urls: pages
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

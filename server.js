var fs = require("fs"),
    path = require("path"),
    express = require("express"),
    mustache = require("mustache"),
    compression = require("compression"),
    sm = require("sitemap");

var app = express();

app.engine("mustache", function(filePath, options, callback) {
    var layoutPath = path.join(app.get("layouts"), options.layout) + ".mustache";

    fs.readFile(layoutPath, function(layoutError, layout) {
        if(layoutError) return callback(new Error(layoutError));

        fs.readFile(filePath, function(pageError, page) {
            if(pageError) return callback(new Error(pageError));

            var html = mustache.render(layout.toString(), options, {page: page.toString()});
            return callback(null, html);
        });
    });
});

app.set("views", __dirname + "/templates/views");
app.set("layouts", __dirname + "/templates/layouts");
app.set("view engine", "mustache");

app.use(compression());
app.use(express.static(__dirname + "/public"));

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
        title: "Git",
        layout: "main",
        repos: repos
    });
});

app.get("/portfolio", function(req, res) {
    res.render("portfolio", {
        title: "Portfolio",
        layout: "main",
        portfolio: [
            {
                title: "SmartPlay",
                titleColor: "orange",
                image: "images/smartplay.png",
                imageHref: "http://sp.montyanderson.net",
                description: "A smart playlist generator for spotify, that uses freely available data from Last.fm and Spotify to generate playlists made for the user. It was originally created for the programming competition <i>Young Rewired State 2015</i>, but has managed to become successful after the event.",
                links: [
                    {
                        title: "sp.montyanderson.net",
                        href: "http://sp.montyanderson.net"
                    },
                    {
                        title: "Github",
                        href: "https://github.com/montyanderson/SmartPlay"
                    }
                ]
            },
            {
                title: "Cardboard City",
                titleColor: "black",
                image: "images/cardboard-city.png",
                imageHref: "http://cc.montyanderson.net",
                description: "An interactive, real-time web interface for the Cardboard City art exhibition run by Exploring Senses at the Phoenix Art Gallery in Brighton.",
                links: [
                    {
                        title: "cc.montyanderson.net",
                        href: "http://cc.montyanderson.net"
                    },
                    {
                        title: "Github",
                        href: "https://github.com/montyanderson/cardboardcity-webgui"
                    }
                ]
            },
            {
                title: "xmath",
                titleColor: "white",
                image: "images/xmath.png",
                imageHref: "https://github.com/montyanderson/xmath",
                description: "A fast, scalable Mathematics library for C++.",
                links: [
                    {
                        title: "Github",
                        href: "https://github.com/montyanderson/xmath"
                    }
                ]
            },
            {
                title: "Catwalk Cakes",
                titleColor: "pink",
                image: "images/catwalk-cakes.png",
                imageHref: "#",
                description: "A modern website for local cake shop, <i>Catwalk Cakes</i>."
            }
        ]
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

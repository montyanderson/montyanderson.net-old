var fs = require("fs"),
    path = require("path"),
    express = require("express"),
    mustache = require("mustache"),
    request = require("request"),
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

function updateRepos() {
    request({
        url: "https://api.github.com/users/montyanderson/repos?sort=updated",
        headers: {
            "User-Agent": "montyanderson"
        }
    }, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body);

            if(data) {
                repos = data.filter(function(repo) {
                    if(repo.description.substring(0, 1) != ":") {
                        return true;
                    } else {
                        return false;
                    }
                });

                var languages = [];

                repos.forEach(function(repo) {
                    if(languages[repo]) {
                        languages[repo] += 1;
                    } else {
                        languages[repo] = 1;
                    }
                });
            }
        } else {
            console.log(error);
        }
    });
}

updateRepos();
setInterval(updateRepos, 5 * 60 * 1000);

var port = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || process.argv[3] || 8080;
var ip =  process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_PORT || process.arguments[4] || "*";
app.listen(port);

console.log("Server started at port " + port + ".");

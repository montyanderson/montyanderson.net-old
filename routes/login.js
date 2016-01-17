var router = module.exports = require("express").Router();
var request = require("request");
var fs = require("fs");

try {
    var client_id = fs.readFileSync(__dirname + "/../.client_id").toString().trim();
    var client_secret = fs.readFileSync(__dirname + "/../.client_secret").toString().trim();
} catch(e) {
    console.log(e);
}

var user_agent = "montyanderson";

router.all("/login", function(req, res) {
    if(client_id) return res.redirect("https://github.com/login/oauth/authorize?client_id=" + client_id);
    res.end();
});

router.all("/logout", function(req, res) {
    req.session.user = undefined;
    req.session.access_token = undefined;
    res.redirect(req.headers.referer || "/");
});

router.all("/auth", function(req, res, next) {
    if(!req.query.code) return res.redirect("/");

    request({
        url: "https://github.com/login/oauth/access_token",
        type: "POST",
        headers: {
            Accept: "application/json",
            "User-Agent": user_agent
        },
        form: {
            client_id: client_id,
            client_secret: client_secret,
            code: req.query.code
        }
    }, function(err, apires, body) {
        if(err) return next();
        var data = JSON.parse(body);

        if(data.access_token) req.session.access_token = data.access_token;
        next();
    });
}, function(req, res, next) {
    if(!req.session.access_token) return next();

    request({
        url: "https://api.github.com/user?access_token=" + req.session.access_token,
        headers: {
            Accept: "application/json",
            "User-Agent": user_agent,
            Authorization: "token " + req.session.access_token
        }
    }, function(err, apires, body) {
        if(err) return next();
        var data = JSON.parse(body);
        if(data.login) req.session.user = data;
        next();
    });
}, function(req, res) {
    res.redirect("/");
});

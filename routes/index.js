var router = module.exports = require("express").Router();
var models = require("../models/");

router.all("/", function(req, res, next) {
    models.Repo.find({}).sort({updated_at: -1}).limit(3).exec(function(err, repos) {
        res.locals.repos = repos;
        next();
    });
}, function(req, res) {
    res.render("index");
});

var router = module.exports = require("express").Router();
var request = require("request");

var models = require("../models/");

router.all("/admin", function(req, res, next) {
    if(res.locals.admin == true) return next();
    res.render("admin");
}, function(req, res, next) {
    if(!req.body["new-project"]) return next();

    (new models.Project({
        title: req.body.title,
        body: req.body.body
    })).save(function(err) {
        next();
    });
}, function(req, res, next) {
    if(!req.body["edit-project"] || !req.body.title || !req.body.body) return next();

    console.log("Updating!");

    models.Project.update({_id: req.body["edit-project"]}, {$set: req.body}).exec(function(err) {
        console.log(err);
        next();
    });
}, function(req, res, next) {
    if(!req.body["edit-project"]) return next();

    models.Project.find({_id: req.body["edit-project"]}, function(err, data) {
        console.log(data);
        if(err || !data || !data[0]) return next();
        res.locals.project = data[0];
        next();
    });
}, function(req, res, next) {
    if(!req.body.delete) return next();
    models.Project.remove({_id: req.body.delete}, next);
}, function(req, res, next) {
    models.Project.find({}).sort({date:-1}).exec(function(err, projects) {
        if(err || !projects) return next();
        res.locals.projects = projects;
        next();
    });
}, function(req, res) {
    res.render("admin");
});

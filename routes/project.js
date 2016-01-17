var router = module.exports = require("express").Router();
var marked = require("marked");
var models = require("../models/");

router.all("/project/:project", function(req, res, next) {
    models.Project.find({_id: req.params.project}, function(err, data) {
        if(err || !data || !data[0]) return next();
        res.locals.project = {
            title: data[0].title,
            body: marked(data[0].body)
        };

        next();
    });
}, function(req, res) {
    res.render("project");
});

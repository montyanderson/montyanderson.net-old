var fs = require("fs");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/montyanderson");

var models = module.exports = {};

models._connection = mongoose.connection;

fs.readdirSync(__dirname).forEach(function(file) {
    var mod = require(__dirname + "/" + file);

    for(var model in mod) {
        models[model] = mod[model];
    }
});

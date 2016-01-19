var fs = require("fs");
var handlebars = require("handlebars");
var async = require("async");

handlebars.registerHelper("splice", function(a, from, to, options) {
    var s = "";

    for(var i = from; i < to; i++)
        s += options.fn(a[i]);

    return s;
});

var layouts = [];
var layoutsPath = __dirname + "/views/layouts/";

fs.readdirSync(layoutsPath).forEach(function(file) {
    var path = layoutsPath + file;
    var layout = fs.readFileSync(path).toString();
    layouts[path] = handlebars.compile(layout);
});

var views = [];
var viewsPath = __dirname + "/views/";

fs.readdirSync(viewsPath).forEach(function(file) {
    var path = viewsPath + file;

    if(path.indexOf(".handlebars") != -1) {
        var view = fs.readFileSync(path).toString();
        views[path] = handlebars.compile(view);
    }
});

/*
var partialsPath = __dirname + "/views/partials/";

fs.readdirSync(partialsPath, function(file) {
    var path = partialsPath + file;
    var partial = fs.readFileSync(path).toString();
    handlebars.registerPartial(file.split(".")[0], partial);
});
*/

module.exports = function(path, options, callback) {
    var view = views[path](options);

    if(options.layout != false) {
        options.view = view;
        var layout = layouts[layoutsPath + (options.layout || "main") + ".handlebars"](options);
        return callback(null, layout);
    }

    callback(null, view);
};

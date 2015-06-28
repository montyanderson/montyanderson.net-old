var fs = require("fs"),
    browserify = require("browserify"),
    less = require("less");

module.exports = function() {
    console.log("Building stylesheets...");
    less.render(fs.readFileSync(__dirname + "/client/main.less").toString()).then(function(output) {
            fs.writeFileSync(__dirname + "/static/bundle.css", output.css);
    }, function(err) {
        console.log(err);
    });
};

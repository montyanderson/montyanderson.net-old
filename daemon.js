var models = require("./models/");
var request = require("request");
var async = require("async");

var username = "montyanderson";

function getGithub() {
    request({
        url: "https://api.github.com/users/" + username + "/repos?sort=updated",
        headers: {
            "User-Agent": "montyanderson"
        }
    }, function(err, res, body) {
        if(err) return getGithub();

        var repos = JSON.parse(body);

        async.map(repos, function(data, callback) {
            var query = models.Repo.update({full_name: data.full_name}, {$set: data}, {upsert: true});
            query.exec(callback);
        }, function(err) {
            console.log(err || "Got " + repos.length + " repos!");
            setTimeout(getGithub, 1000 * 60);
        })
    });
}

getGithub();

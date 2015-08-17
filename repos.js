var request = require("request");

module.exports = function(callback) {
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
                    var repos = [];
                    var languages = [];

                    data.forEach(function(repo) {
                        if(repo.description.substring(0, 1) != ":") {
                            repos.push({
                                name: repo.name,
                                homepage: repo.homepage,
                                html_url: repo.html_url,
                                language: repo.language,
                                description: repo.description
                            });


                            if(languages[repo.language]) {
                                languages[repo.language] += 1;
                            } else {
                                languages[repo.language] = 1;
                            }
                        }
                    });

                    callback({repos: repos, languages: languages});
                }
            } else {
                console.log(error);
            }
        });
    }

    updateRepos();
    setInterval(updateRepos, 5 * 60 * 1000);
};

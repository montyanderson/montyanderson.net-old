module.exports = function(inject, count, callback) {

	function process(res) {
		localStorage.github = JSON.stringify({res: res, time: new Date().getTime()});

		var repos = [];

		res.forEach(function(repo) {
			if(repo.description.substring(0, 1) != ":") {
				repos.push(repo);
			}
		});

		$(inject).html("");

		count = parseInt(count) || repos.length;

		var i = 0;
		while(i < count && repos[i] != undefined) {
			if(!repos[i].homepage) { repos[i].homepage = repos[i].html_url }
			if(!repos[i].description) { repos[i].description = " - " }
			if(i % 3 === 0) { $("#git-projects").append("<div class='row'></div>") }

			$(inject).children().last().append(
				Mustache.render($("#git-template").html(), repos[i])
			);

			i++;
		}

		if(callback != undefined) {callback(res)}

		$(inject).addClass("animated fadeInUp");
	}

	if(!localStorage || !localStorage.github || localStorage.github == "" || new Date().getTime() - JSON.parse(localStorage.github).time > 60000) {
		$.ajax({
			url: "https://api.github.com/users/montyanderson/repos?sort=updated"
		}).done(process).fail(function() {
			getGithubRepos(inject, count, callback);
		});
	} else {
		console.log("github repos loaded from localStorage cache");
		process(JSON.parse(localStorage.github).res);
	}

};

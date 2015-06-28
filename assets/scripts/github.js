module.exports = function(inject, callback) {

	/* jshint ignore:start */

	var template = '<div class="col m12 l4">\
		<div class="card darken-1">\
				<div class="orange card-content white-text">\
				<span class="card-title">{{name}}</span>\
				<p>{{description}} <br /><span class="red-text">{{language}}</span></p>\
				</div>\
				<div class="red card-action">\
				<a href="{{html_url}}">Github</a>\
				<a href="{{homepage}}">Homepage</a>\
				</div>\
		</div>\
	</div>';

	function process(res) {
		console.log(res);
		var repos = [];

		res.forEach(function(repo) {
			if(repo.description.substring(0, 1) != ":") {
				repos.push(repo);
			}
		});

		$(inject).html("");

		var count;

		if(parseInt($(inject).data("count")) {
			count = parseInt($(inject).data("count"));
		} else {
			count = repos.length;
		}

		console.log(count);
		console.log(repos.length);

		var i = 0;
		while(i < count && repos[i] != undefined) {
			if(!repos[i].homepage) { repos[i].homepage = repos[i].html_url }
			if(!repos[i].description) { repos[i].description = " - " }
			if(i % 3 == 0) { $("#git-projects").append("<div class='row'></div>") }

			$(inject).children().last().append(
				Mustache.render(template, repos[i])
			);

			i++;
		}

		if(callback != undefined) {callback(res)}

		$(inject).addClass("animated fadeInUp");
	}

	$.ajax({
		url: "https://api.github.com/users/montyanderson/repos?sort=updated"
	}).done(process);
}

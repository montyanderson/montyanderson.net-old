window.$ = require("jquery");
window.Mustache = require("mustache");
//require("materialize-css");

require("./mobile-shim.js")();
var github = require("./github.js");
var instagram = require("./instagram.js");

if($("#git-projects").length > 0) {
	$("#git").hide();

	github("#git-projects", function() {
		$("#git").show();
	});
}

if($("#instagram-photos").length > 0) {
	instagram("#instagram-photos", 4);
}

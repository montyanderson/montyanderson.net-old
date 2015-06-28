module.exports = (inject, count, callback) {
	$.ajax({
		url: "https://api.instagram.com/v1/users/1777572832/media/recent",
		dataType: "jsonp",
		data: {
			client_id: "162f7c500bc0450796be623a3affd110"
		}
	}).done(function(res) {
		$(inject).html("");

		count = parseInt(count) || res.data.length;

		var i = 0;
		while(i < count && res.data[i] != undefined) {
			if(i % 4 == 0) { $(inject).append("<div class='row'></div>") }

			var date = new Date(res.data[i].created_time * 1000)
			/* https://stackoverflow.com/questions/19582235/turning-instagrams-created-time-key-into-an-actual-date */

			if(res.data[i].caption == null) {
				res.data[i].caption = {
					text: ""
				}
			}

			$(inject).children().last().append(Mustache.render($("#photo-template").html(), {
				image: res.data[i].images.standard_resolution.url,
				title: res.data[i].caption.text,
				link: res.data[i].link,
				date: date
			}));

			i++;
		}

		if(callback != undefined) {callback()}
		$(inject).attr("class", "animated fadeInUpBig");

		$(".photo").tooltip({delay: 0});

		$(".photo").click(function() {
			location.href = $(this).attr("data-link");
		});

		$(".photo").css("cursor", "pointer");
	});
}

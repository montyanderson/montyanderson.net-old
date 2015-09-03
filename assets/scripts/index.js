window.jQuery = window.$ = require("jquery");

$(document).ready(function() {
    $(".parallax").parallax();
});

if(navigator.userAgent.toLowerCase().indexOf("android") > -1) {
    $("video").each(function() {
        if($(this).data("poster"))
            $(this).attr("poster", $(this).data("poster"));
    });
}

jQuery(document).on("click", "video", function(){
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
});

module.exports = function() {
    var resize = function() {
        var minsize = 360;

        if($(window).width() < 360) {
            console.log("unresponsive mode (>360px)");
            $(".flow-text").addClass("flowtext");
        } else {
            console.log("responsive mode (>360px)");
            $(".flow-text").removeClass("flowtext");
        }
    }

    resize();
    $(window).resize(resize);
}

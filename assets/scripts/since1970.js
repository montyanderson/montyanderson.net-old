var $ = require("jquery");

module.exports = function() {
    setInterval(function() {
        $(".since1970").text(parseInt($(".since1970").html()) + 1);
    }, 1);
};

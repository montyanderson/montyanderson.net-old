var $ = require("jquery");

module.exports = function() {
    console.log("dfg");

    if(!localStorage.visited) {
        localStorage.visited = 1;
    } else {
        localStorage.visited = parseInt(localStorage.visited) + 1;
    }

    console.log(localStorage.visited);
    $(".visited").text(localStorage.visited);
};

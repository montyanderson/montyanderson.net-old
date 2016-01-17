var gulp = require("gulp");
var less = require("gulp-less");
var cssnano = require("gulp-cssnano");

gulp.task("watch", function() {
    gulp.watch("./styles/*.less", ["styles"]);
});

gulp.task("styles", function() {
    return gulp.src("./styles/main.less")
        .pipe(less({
            paths:[__dirname + "/styles/", __dirname + "/node_modules/"]
        }))
        .pipe(cssnano())
        .pipe(gulp.dest("./public/"));
});

gulp.task("default", ["styles"])
gulp.task("dev", ["default", "watch"]);

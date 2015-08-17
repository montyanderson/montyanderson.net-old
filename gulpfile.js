var gulp = require("gulp"),
    less = require("gulp-less"),
    streamify = require("gulp-streamify"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    minify = require("gulp-minify-css"),
    jshint = require("gulp-jshint"),
    source = require("vinyl-source-stream"),
    browserify = require("browserify"),
    path = require("path");

var paths = {
        styles: ["./assets/styles/*.less"],
        scripts: ["./assets/scripts/*.js"]
};

function logError(err) {
    console.log(err);
    this.emit("end");
}

gulp.task("watch", function() {
    gulp.watch(paths.styles, ["styles"]);
    gulp.watch(paths.scripts, ["scripts", "lint"]);
});

gulp.task("styles", function() {
    return gulp.src("./assets/styles/main.less")
        .pipe(less({
            paths: [__dirname + "/assets/styles/"]
        }))
        .on("error", logError)
        .pipe(minify())
        .pipe(rename("bundle.css"))
        .pipe(gulp.dest("./public/"));
});

gulp.task("scripts", function() {
    return browserify("./assets/scripts/index.js")
    .bundle()
    .on("error", logError)
    .pipe(source("bundle.js"))
    .pipe(streamify(uglify()))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest("./public/"));
});

gulp.task("lint", function() {
    return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task("default", ["styles", "scripts", "lint"]);
gulp.task("dev", ["default", "watch"]);

import gulp from "gulp";
import open from "gulp-open";

gulp.task("open-app", function () {
  return gulp
    .src("pages/sign-in.html") // <- return the stream
    .pipe(open());
});

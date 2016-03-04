var gulp = require('gulp');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var spawn = require('child_process').spawn,
node;

// minification of JS CSS HTML
gulp.task('minifyScripts', function() {
  gulp.src('app/js/*.js')
//  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('public/'));
})

gulp.task('minifyCss', function() {
  gulp.src('app/css/*')
  // .pipe(minifyCss())
  // .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('public/'));
})

gulp.task('minifyHmtl', function() {
  gulp.src('app/index.html')
  // minify here
  .pipe(gulp.dest('public/'));
})

gulp.task('watch', function() {
  gulp.watch('app/js/*.js', ['minifyScripts']);
  gulp.watch('app/css/*', ['minifyCss']);
  gulp.watch('app/index.html', ['minifyHmtl']);
  gulp.watch('index.js', ['server']);
})

gulp.task('default', ['server', 'minifyScripts', 'minifyCss', 'minifyHmtl', 'watch']);

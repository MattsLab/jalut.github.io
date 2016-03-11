var gulp = require('gulp'),
sass = require('gulp-sass');
notify = require("gulp-notify");
bower = require('gulp-bower');
uglify = require('gulp-uglify');
concat = require('gulp-concat');
jshint = require('gulp-jshint');
order = require("gulp-order");
addsrc = require('gulp-add-src');

var config = {
  sassPath: './app/style',
  bowerDir: './bower_components',
  resDir: './assets'
};

// Run Bower
gulp.task('bower', function () {
  return bower()
  .pipe(gulp.dest(config.bowerDir))
});

// Move Icons to /public
gulp.task('icons', function () {
  return gulp.src([config.bowerDir + '/font-awesome/fonts/**.*'])
  .pipe(gulp.dest('./assets/fonts'));
});

// Lint Task
gulp.task('lint', function () {
  return gulp.src('/assets/js/dist/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Move and concat JS
gulp.task('js', function () {
  return gulp.src([
    config.bowerDir + '/jquery/dist/jquery.js',
    config.bowerDir + '/bootstrap/dist/js/bootstrap.js',
    config.bowerDir + '/tether/dist/js/tether.js',
  ])
  .pipe(gulp.dest('./assets/js/'));
});

gulp.task('compress', function () {
  gulp.src('assets/js/main.js')
  .pipe(addsrc('assets/js/*.js'))
  .pipe(order([
    'assets/js/jquery.js',
    'assets/js/bootstrap.js',
    'assets/js/tether.js',
    'assets/js/main.js'
  ]))
  .pipe(concat('main.min.js'))
  //.pipe(uglify({mangle: false}))
  .pipe(gulp.dest('assets/js/dist/'));
});
// Rerun the task when a file changes
gulp.task('watch', function () {
  // Watch JS files
  gulp.watch([config.resDir + '/js/*.js', config.resDir + '/*.js'], ['js']);
  // Watch SCSS files
  gulp.watch([config.sassPath + '/**/*.scss'], ['sass']);
});

gulp.task('default', ['bower', 'icons', 'js', 'compress', 'lint', 'watch']);

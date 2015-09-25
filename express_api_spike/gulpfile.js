'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('sass', function() {
  gulp.src('./public/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./public/**/*.scss',['sass']);
});

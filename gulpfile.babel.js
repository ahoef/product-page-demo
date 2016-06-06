import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import sass from 'gulp-ruby-sass';
import babelify from 'babelify';

gulp.task('default', ['browserify', 'sass', 'watch']);

gulp.task('browserify', () => {
  return browserify('js/src/app.js')
    .transform('babelify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('js/dest'));
});

gulp.task('sass', () => {
  return sass('css/src/site.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('css/dest'));
});

gulp.task('watch', function() {
    gulp.watch('js/src/*.js', ['browserify']);
    gulp.watch('css/src/*.scss', ['sass']);
});


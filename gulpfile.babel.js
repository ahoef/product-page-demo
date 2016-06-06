import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import sass from 'gulp-ruby-sass';
import jsonServer from 'gulp-json-srv';
import babelify from 'babelify';
import nunjucks from 'gulp-nunjucks';
import connect from 'gulp-connect';

gulp.task('default', ['connect', 'browserify', 'sass', 'watch', 'nunjucks']);

gulp.task('connect', function() {
  connect.server();
});

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

gulp.task('nunjucks', () =>
    gulp.src('templates/main.html')
        .pipe(nunjucks.precompile())
        .pipe(gulp.dest('js/dest'))
);

// gulp.task('server', function () {
//     jsonServer.start(); // start serving 'db.json' on port 3000
// });

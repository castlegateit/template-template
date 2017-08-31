var gulp = require('gulp');
var concat = require('gulp-concat');
var maps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var del = require('del');

var src = './src';
var dst = '.';

gulp.task('clean:css', function () {
    return del(dst + '/css/*');
});

gulp.task('clean:js', function () {
    return del(dst + '/js/*');
});

gulp.task('compile:css', ['clean:css'], function () {
    return gulp.src(src + '/scss/**/*.scss')
        .pipe(maps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({browsers: ['Android 4', 'Explorer 9', 'Safari 7']}))
        .pipe(maps.write('.'))
        .pipe(gulp.dest(dst + '/css'));
});

gulp.task('compile:js', ['clean:js'], function () {
    return gulp.src([
        src + '/js/lib/jquery.js',
        src + '/js/lib/jquery.!(*.*).js',
        src + '/js/lib/jquery.*.js',
        src + '/js/lib/**/*.js',
        src + '/js/settings.js',
        src + '/js/**/*.js'
    ])
        .pipe(plumber())
        .pipe(maps.init())
        .pipe(concat('script.js'))
        .pipe(uglify({compress: false, output: {beautify: true}}))
        .pipe(maps.write('.'))
        .pipe(gulp.dest(dst + '/js'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch(src + '/scss/**/*.scss', ['compile:css']);
    gulp.watch(src + '/js/**/*.js', ['compile:js']);
});

gulp.task('default', ['compile:css', 'compile:js']);

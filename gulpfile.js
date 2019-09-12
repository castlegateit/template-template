var gulp = require('gulp');
var concat = require('gulp-concat');
var maps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var del = require('del');
var fs = require('fs');
var http = require('http');

var src = './src';
var dst = './assets';

gulp.task('clean:css', gulp.series(function () {
    return del(dst + '/css/*');
}));

gulp.task('clean:js', gulp.series(function () {
    return del(dst + '/js/*');
}));

gulp.task('compile:css', gulp.series(['clean:css'], function () {
    return gulp.src(src + '/scss/**/*.scss')
        .pipe(maps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({
            remove: false
        }))
        .pipe(maps.write('.'))
        .pipe(gulp.dest(dst + '/css'));
}));

gulp.task('compile:js', gulp.series(['clean:js'], function () {
    return gulp.src([
        src + '/js/lib/jquery.js',
        src + '/js/lib/jquery.!(*.*).js',
        src + '/js/lib/jquery.*.js',
        src + '/js/lib/**/*.js',
        src + '/js/settings.js',
        src + '/js/**/*.js'
    ], {
        allowEmpty: true
    })
        .pipe(plumber())
        .pipe(maps.init())
        .pipe(concat('script.js'))
        .pipe(uglify({
            compress: false,
            output: {
                beautify: true
            }
        }))
        .pipe(maps.write('.'))
        .pipe(gulp.dest(dst + '/js'));
}));

gulp.task('serve', gulp.series(function () {
    http.createServer(function (request, response) {
        var file = __dirname + request.url;

        if (file.endsWith('/')) {
            file = file + 'index.html';
        }

        fs.readFile(file, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.end('page not found');

                return;
            }

            response.writeHead(200);
            response.end(data);
        });
    }).listen(8080);
}));

gulp.task('default', gulp.series(['compile:css', 'compile:js']));

gulp.task('watch', gulp.parallel(['default', 'serve'], function () {
    gulp.watch(src + '/scss/**/*.scss', gulp.series(['compile:css']));
    gulp.watch(src + '/js/**/*.js', gulp.series(['compile:js']));
}));

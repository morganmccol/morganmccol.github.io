/**
* Load Gulp Plugins
**/
var gulp = require('gulp'); // Gulp
var del  = require('del'); // Delete dist files

// BrowserSync plugins
var browsersync = require('browser-sync').create();; // Live update browser

// CSS plugins
var sass = require('gulp-sass'); // Compile Sass files

// JS plugins
var concat = require('gulp-concat'); // Combine JS files
var uglify = require('gulp-uglify'); // Minifies JS files
var rename = require('gulp-rename'); // Renames JS files

// Image plugins
var imagemin = require('gulp-imagemin'); // Compresses images
var cache    = require('gulp-cache'); // Creates image cache

// BrowserSync variables
var reload = browsersync.reload; // Reload browser
var files  = './**/*.html';

// CSS variables
var sassinput   = './src/sass/**/*.scss';
var sassoutput  = './dist/css';
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed'
};

// JS variables
var jsinput = './src/js/main.js';
var jsmin = [
    './src/js/min/**/*.js',
    './src/js/scripts/**/*.js'
];
var jsvendor = [
    './src/js/vendor/modernizr.custom.js',
    './src/js/vendor/jquery.min.js',
    './src/js/vendor/jquery.easings.min.js',
    './src/js/vendor/bootstrap.min.js'
];
var jsoutput = './dist/js';

// Image variables
var imginput  = './src/img/*';
var imgoutput = './dist/img';

// Clean dist folder
gulp.task('clean', function() {
    return del(['./dist/']);
});

// Clear cache
gulp.task('clear', function (done) {
    return cache.clearAll(done);
});

// Set up BrowserSync
gulp.task('browser-sync', function() {
    browsersync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('reload', function() {
    return gulp
        .src(files)
        .pipe(reload({stream:true}));
})

// Compile Sass into CSS
gulp.task('sass', function () {
    return gulp
        .src(sassinput)
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(sassoutput))
        .pipe(reload({stream:true}));
});

// Combine and minify JS
gulp.task('js', function() {
    return gulp
        .src(jsinput)
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsoutput))
        .pipe(reload({stream:true}));
});

gulp.task('jsmin', function() {
    return gulp
        .src(jsmin)
        .pipe(concat('scripts.js'))
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest(jsoutput))
        .pipe(reload({stream:true}));
});

gulp.task('jsvendor', function() {
    return gulp
        .src(jsvendor)
        .pipe(gulp.dest(jsoutput))
        .pipe(reload({stream:true}));
});

// Compress images
gulp.task('img', function() {
    return gulp
        .src(imginput)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(imgoutput))
        .pipe(reload({stream:true}));
});

// Watch for changes and run tasks
gulp.task('watch', ['browser-sync'], function() {
    return gulp
        .watch(sassinput, ['sass'])
        .on('change', function(event) {
        console.log(event.path + ' was ' + event.type + ' ...');
    });
    return gulp
        .watch(jsinput, ['js', 'jsmin', 'jsvendor'])
        .on('change', function(event) {
        console.log(event.path + ' was ' + event.type + ' ...');
    });
    return gulp
        .watch(imginput, ['img'])
        .on('change', function(event) {
        console.log(event.path + ' was ' + event.type + ' ...');
    });
    return gulp
        .watch(files, ['reload'])
        .on('change', function(event) {
        console.log(event.path + ' was ' + event.type + ' ...');
    });
});

// Default tasks
gulp.task('default', ['sass', 'js', 'jsmin', 'jsvendor', 'img']);

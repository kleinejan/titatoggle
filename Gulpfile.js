var gulp = require('gulp'),
    // less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass');
    fileinclude = require('gulp-file-include'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    highlight = require('gulp-highlight');
path = require('path');
del = require('del');


gulp.task('fileinclude', function () {
    gulp.src(['index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(highlight())
        .pipe(gulp.dest('./docs'));
});


gulp.task('scss:main', function () {
    return gulp.src('./scss/main.scss')
        .pipe(sass({
            paths: [path.join(__dirname, 'scss', 'includes')]
        }).on('error', sass.logError)).pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./docs/css'))
        .pipe(browserSync.stream());
});

gulp.task('scss:slider', function () {
    return gulp.src('./scss/titatoggle.scss')
        .pipe(sass({
            paths: [path.join(__dirname, 'scss', 'includes')]
        })).pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '-dist'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('scss:slider-min', function () {
    return gulp.src('./scss/titatoggle.scss')
        .pipe(sass({
            paths: [path.join(__dirname, 'scss', 'includes')]
        })).pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })).pipe(cssmin())
        .pipe(rename({suffix: '-dist-min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy:src', function () {
    return gulp.src('./scss/_titatoggle.scss')
        .pipe(rename({basename: "titatoggle",}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy:js', function () {
    return gulp.src('node_modules/highlight.js/lib/**/*.*')
        .pipe(gulp.dest('./docs/js'));
});

gulp.task('browser-sync', function () {
    browserSync.init({
        injectChanges: true,
        server: {
            baseDir: "./docs"
        }
    });
    gulp.watch("scss/**/*.*", ['scss']);
    gulp.watch("_includes/**/*.*", ['fileinclude']);
    gulp.watch("docs/**/*.*").on("change", reload);

});

gulp.task('scss', function (callback) {
    runSequence(['scss:main', 'scss:slider', 'scss:slider-min'],
        callback
    )
});

gulp.task('default', function (callback) {
    runSequence(['copy:js', 'copy:src', 'scss', 'fileinclude'], 'browser-sync',
        callback
    )
});

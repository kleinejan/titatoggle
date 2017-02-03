var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    fileinclude = require('gulp-file-include'),
    ghpages = require('gulp-gh-pages'),
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
        .pipe(gulp.dest('./gh-pages'));
});


gulp.task('less:main', function () {
    return gulp.src('./less/main.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        })).pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./gh-pages/css'))
        .pipe(browserSync.stream());
});

gulp.task('less:slider', function () {
    return gulp.src('./less/titatoggle.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        })).pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '-dist'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('less:slider-min', function () {
    return gulp.src('./less/titatoggle.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        })).pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })).pipe(cssmin())
        .pipe(rename({suffix: '-dist-min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy:src', function () {
    return gulp.src('./less/_titatoggle.less')
        .pipe(rename({basename: "titatoggle",}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy:js', function () {
    return gulp.src('node_modules/highlight.js/lib/**/*.*')
        .pipe(gulp.dest('./gh-pages/js'));
});

gulp.task('deploy', function () {
    return gulp.src('./gh-pages/**/*')
        .pipe(ghPages());
});

gulp.task('browser-sync', function () {
    browserSync.init({
        injectChanges: true,
        server: {
            baseDir: "./gh-pages"
        }
    });
    gulp.watch("less/**/*.*", ['less']);
    gulp.watch("_includes/**/*.*", ['fileinclude']);
    gulp.watch("gh-pages/**/*.*").on("change", reload);

});

gulp.task('less', function (callback) {
    runSequence(['less:main', 'less:slider', 'less:slider-min'],
        callback
    )
});

gulp.task('default', function (callback) {
    runSequence(['copy:js', 'copy:src', 'less', 'fileinclude', 'browser-sync'],
        callback
    )
});

gulp.task('publish', function (callback) {
    runSequence(['copy:js', 'copy:src', 'less', 'fileinclude'],
        callback
    )
});
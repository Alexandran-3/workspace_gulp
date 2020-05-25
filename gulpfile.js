"use strict";

var gulp            = require("gulp"),
    sass            = require("gulp-sass"),
    autoprefixer    = require('gulp-autoprefixer'),
    browserSync     = require("browser-sync"),
    sourcemaps      = require("gulp-sourcemaps"),
    notify          = require("gulp-notify"),
    rename          = require('gulp-rename'),
    cleancss        = require('gulp-clean-css'),
    babel           = require("gulp-babel"),
    concat          = require("gulp-concat"),
    uglify          = require("gulp-uglify");

gulp.task("sass", function(){
    return gulp.src("assets/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', notify.onError()))//permet l'utilisation de gulp-sass
    .pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("assets/css"))
    .pipe(notify({ message: 'TASK: Fichier SCSS bien compilé', onLast: true}))
    .pipe(browserSync.stream());
}); 

gulp.task("scripts", function() {
    return gulp.src([
        'assets/libs/jquery/jquery-3.4.1.min.js',
        "assets/js/src/**/*.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ["@babel/env"]
        }))
        .pipe(concat("scripts.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("assets/js/dist"))
        .pipe(notify( {message: 'TASK: js complété!', onLast: true}))
        .pipe(browserSync.reload({ stream: true}));
})

gulp.task('code', function() {
    return gulp.src('**/*.html')
    .pipe(browserSync.reload({ stream: true }))
});
gulp.task("watch", function(){
    gulp.watch("assets/scss/**/*.scss", gulp.parallel("sass"));
    gulp.watch('**/*.html', gulp.parallel('code'));
    gulp.watch(["./assets/js/src/**/*.js", 'assets/libs/**/*.js'], gulp.parallel("scripts"));
});

gulp.task("browser-sync", function(){
    browserSync.init({
        server: {
            baseDir:"./"
        },
        reloadDelay: 200,
        files: [
            "./assets/css/*.css",
            "./assets/js/**/*.js",
            "./**/*.html"
        ]
    })
});

gulp.task("default", gulp.parallel("sass", "browser-sync", "watch", "scripts", "code"));
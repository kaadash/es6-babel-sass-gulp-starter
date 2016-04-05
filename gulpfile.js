"use strict";

const gulp = require('gulp');
const util = require('gulp-util');
const useref = require('gulp-useref');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream');
const autoprefixer = require('gulp-autoprefixer');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();

let config = {
    production: !!util.env.production
};

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('html', () => {
    return gulp.src('*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets', () => {
   return gulp.src(['assets/**'])
        .pipe(gulp.dest('dist/assets')); 
})

gulp.task('sass', () => {
	gulp.src('src/styles/*.scss')
        .pipe(config.production ? sass({outputStyle: 'compressed'}) : sass() )
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.stream());
});

gulp.task('es6', () => {
   return browserify({entries: 'src/scripts/app.js', extensions: ['.js'], debug: true})
        .transform(babelify, {presets: ['es2015']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream());
});

gulp.task('watch', () => {
	gulp.watch('src/styles/**/*.scss',['sass']);
    gulp.watch('src/scripts/*.js', () => {
        runSequence(
            'es6',
            'html'
        );    
    });
	gulp.watch('*.html', ['html']);
});

gulp.task('default', () => {
    runSequence(
        'es6',
        'html',
        ['copy-assets', 'serve', 'sass', 'watch']
    );
});
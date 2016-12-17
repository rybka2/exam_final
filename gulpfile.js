'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'), // Ребилд только измененных файлов
    plumber = require('gulp-plumber'), // Защита gulp от вылета
    uglify = require('gulp-uglify'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleancss = require('gulp-clean-css'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    twig = require('gulp-twig'), // JS шаблонизатор с синтаксисом TWIG
    concat = require('gulp-concat'),
    rimraf = require('rimraf'), // Очистка директорий
    browserSync = require("browser-sync"),
    jasmine = require("gulp-jasmine"),
    data = require('./src/content'),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        cssimg: 'build/css/img/',
        images: 'build/images/',
        fonts: 'build/fonts/',
    },
    src: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        jsmain: 'src/js/main.js',
        scss: 'src/scss/*.*',
        srcSprite: 'src/scss/sprite/**/*.*',
        buildSprite: 'src/scss/',
        cssSprite: 'src/tmp/',
        cssimg: 'src/scss/img/**/*.*',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        scss: 'src/**/*.scss',
        sprite: 'src/scss/sprite/**/*.*',
        cssimg: 'src/scss/img/**/*.*',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};


var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
    browserSync(config); // Запуск веб-сервера
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(plumber())
        .pipe(twig(data))
        .pipe(gulp.dest(path.build.html))
       .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js')) 
        // .pipe(uglify()) // For minify JS files
        .pipe(sourcemaps.write('/')) 
        .pipe(gulp.dest(path.build.js))
       .pipe(reload({stream: true}));
});

gulp.task('sprite:build', function() {
  var spriteData =
    gulp.src(path.src.srcSprite) // путь, откуда берем картинки для спрайта
      .pipe(spritesmith({
        imgName: 'img/sprite.png',
        cssName: 'sprite.css',
        padding: 10
      }));
  spriteData.img.pipe(gulp.dest(path.src.buildSprite)).pipe(reload({stream: true})); // путь, куда сохраняем картинку
  spriteData.css.pipe(gulp.dest(path.src.cssSprite)).pipe(reload({stream: true})); // путь, куда сохраняем стили

});

gulp.task('style:build', function () {
    gulp.src(path.src.scss) 
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(prefixer())
        .pipe(concat('styles.css'))
        //.pipe(cleancss()) // For minify CSS files
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('cssimg:build', function () {
    gulp.src(path.src.cssimg) 
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.cssimg))
    //    .pipe(reload({stream: true}));
});

gulp.task('images:build', function () {
    gulp.src(path.src.images)
      .pipe(plumber())
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()],
          interlaced: true
      }))
      .pipe(gulp.dest(path.build.images))
      .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'sprite:build',
    'style:build',
    'fonts:build',
    'cssimg:build',
    'images:build'
]);

gulp.task('watch', function () {
  watch([path.watch.html], function (event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.sprite], function (event, cb) {
    gulp.start('sprite:build');
  });
  watch([path.watch.scss], function (event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function (event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.cssimg], function (event, cb) {
    gulp.start('cssimg:build');
  });
  watch([path.watch.images], function (event, cb) {
    gulp.start('images:build');
  });
  watch([path.watch.fonts], function (event, cb) {
    gulp.start('fonts:build');
  });
});


gulp.task('default', ['build', 'webserver', 'watch']);
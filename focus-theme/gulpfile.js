var autoprefixer    = require('autoprefixer'),
    browserSync     = require('browser-sync').create(),
    concat          = require('gulp-concat'),
    cssnano         = require('cssnano'),
    del             = require('del'),
    gulp            = require('gulp'),
    imagemin        = require('gulp-imagemin'),
    nunjucks        = require('gulp-nunjucks-render'),
    postcss         = require('gulp-postcss'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-sass'),
    sequence        = require('run-sequence');

var paths = {
    dest: 'dist',
    html: {
        src: 'src/html/pages/**/*.njk',
        dest: 'src/html/templates',
        watch: 'src/html/**/*.njk'
    },
    css: {
        src: 'src/scss/**/*.scss',
        dest: 'dist/css'
    },
    img: {
        src: 'src/img/**/*{png,jpg,gif,svg,ico}',
        dest: 'dist/img'
    },
    js: {
        src: 'src/js/*',
        jquery: 'node_modules/jquery/dist/jquery.slim.min.js',
        popper: 'node_modules/popper.js/dist/umd/popper.min.js',
        bootjs: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
        masonry: 'node_modules/masonry-layout/dist/masonry.pkgd.min.js',
        imgloaded: 'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
        zoom: 'node_modules/zoom-vanilla.js/dist/zoom-vanilla.min.js',
        main: 'src/js/main.js',
        dest: 'dist/js',
    }
};

// Delete the dist folder to start fresh
gulp.task('clean', function() {
     return del(paths.dest);
});

// Render njk templates
gulp.task('html', function() {
    return gulp
    .src(paths.html.src)
    .pipe(nunjucks({
        path: [paths.html.dest]
    }))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
});

// Compile and minify sass
gulp.task('scss', function() {
    var plugins = [
        autoprefixer({browsers: ['last 2 versions']}),
        //cssnano()
    ];
    return gulp
    .src(paths.css.src)
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
});

// Concatenate JS files
gulp.task('js', function () {
    return gulp
        .src([
            paths.js.jquery,
            paths.js.popper,
            paths.js.bootjs,
            paths.js.masonry,
            paths.js.imgloaded,
            paths.js.zoom,
            paths.js.main
        ])
        .pipe(concat('theme.min.js'))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
});

// Compress images
gulp.task('img', function() {
    return gulp
        .src(paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest));
});

// Static server
gulp.task('server', ['watch'], function() {
    browserSync.init({
        server: paths.dest
    })
});

// Watch for file changes
gulp.task('watch', function() {
    gulp.watch(paths.html.watch, ['html']);
    gulp.watch(paths.css.src, ['scss']);
    gulp.watch([paths.img.src], ['img']);
    gulp.watch([paths.js.src], ['js']);
});

// Default tasks
gulp.task('default', function(cb) {
    sequence('clean', 'html', ['scss', 'img', 'js'], 'server', cb);
});

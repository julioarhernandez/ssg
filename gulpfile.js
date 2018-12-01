const gulp = require('gulp'),
 concat = require('gulp-concat'),
 sass = require('gulp-sass'),
 child = require('child_process'),
 gutil = require('gulp-util'),
cssnano = require('gulp-cssnano'),
autoprefixer = require('gulp-autoprefixer'),
stripComments = require('gulp-strip-json-comments'),
browserSync = require('browser-sync').create(),
embedJSON = require('gulp-embed-json'),
gulpSequence = require('gulp-sequence'),
sitemap = require('gulp-sitemap'),
stripJS = require('gulp-strip-comments'),
uglify = require('gulp-uglify'),
htmlmin = require('gulp-htmlmin'),
siteRoot = '_site',
cssFiles = 'devassets/scss/app.scss';

gulp.task('css', () => {
  gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', cssFiles])
    .pipe(sass({ 
        outputStyle: 'compressed',
        sourceComments: 'map',
        sourceMap: 'sass',
    }).on('error', sass.logError))
    .pipe(stripComments())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cssnano()) // Use cssnano to minify CSS
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('assets/css/'))
});

// Generate Manifest JSON for PWA
gulp.task('manifest', function () {
    gulp.src('manifest.json')
        .pipe(gulp.dest(siteRoot));
});

// Generate Embed JSON
gulp.task('embedjson', function () {
    gulp.src(siteRoot + '/**/*.html')
        .pipe(embedJSON({
            mimeTypes: 'application/ld+json',
            root: './assets/json/',
            minify: true
        }))
        .pipe(gulp.dest(siteRoot));
});

// Generate Minified html
gulp.task('minhtml', function () {
    gulp.src(siteRoot + '/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(siteRoot));
});


// Generate Sitemaps
gulp.task('sitemap', function () {
    gulp.src(siteRoot + '/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'http://www.bizmarketing.us/',
            priority: function(siteUrl, loc, entry) {
                // Give pages inside root path (i.e. no slashes) a higher priority
                return (loc === siteUrl)? 1 : 0.5;
            }
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('jekyll', () => {
    const jekyll = child.spawn('jekyll', ['build',
      '--watch',
      '--incremental',
      '--drafts'
    ]);
  
    const jekyllLogger = (buffer) => {
      buffer.toString()
        .split(/\n/)
        .forEach((message) => gutil.log('Jekyll: ' + message));
    };
  
    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
  });



gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});

// Concatenating js files
gulp.task('scripts', function () {
    // jQuery first, then Popper.js, then Bootstrap JS, then other JS libraries, and last app.js
    return gulp.src([
            'devassets/js/core/jquery.min.js', 
            'devassets/js/core/popper.min.js', 
            'devassets/js/core/bootstrap.min.js', 
            // 'devassets/js/plugins/moment.min.js', 
            'devassets/js/plugins/bootstrap-tagsinput.js', 
            'devassets/js/plugins/presentation-page/rellax.min.js', 
            // 'devassets/js/plugins/bootstrap-datetimepicker.js', 
            // 'devassets/js/plugins/bootstrap-selectpicker.js', 
            // 'devassets/js/plugins/bootstrap-switch.js', 
            'devassets/js/plugins/jasny-bootstrap.min.js', 
            'devassets/js/plugins/jquery-ui-1.12.1.custom.min.js', 
            'devassets/js/plugins/nouislider.min.js', 
            'devassets/js/now-ui-kit.js', 
            'devassets/js/loadCSS.js',
            'devassets/js/app.js'
        ])
        .pipe(concat('app.js'))
        .pipe(stripJS())
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest('./assets/js/'))
        console.log('Concatenating JavaScript files into single file');
});


// gulp.watch(cssFiles, ['css']);
// Watches for changes while gulp is running
gulp.task('watch', ['css'], function () {
    // Live reload with BrowserSync
    browserSync.reload;
    gulp.watch(['src/assets/js/**/*.js'], ['scripts', browserSync.reload]);
    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'devassets/scss/**/*.scss'], ['css', browserSync.reload]);
    console.log('Watching for changes');
});

gulp.task('production', gulpSequence(['css', 'scripts', 'jekyll', 'manifest', 'sitemap', 'serve', 'watch'], ['embedjson', 'minhtml']));
gulp.task('default', gulpSequence(['css', 'scripts', 'jekyll', 'manifest', 'sitemap', 'serve', 'watch'], ['embedjson']));
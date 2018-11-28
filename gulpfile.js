const gulp = require('gulp'),
 concat = require('gulp-concat'),
 sass = require('gulp-sass'),
 child = require('child_process'),
 gutil = require('gulp-util'),
cssnano = require('gulp-cssnano'),
autoprefixer = require('gulp-autoprefixer'),
stripComments = require('gulp-strip-json-comments'),
browserSync = require('browser-sync').create(),
gulpSequence = require('gulp-sequence'),
sitemap = require('gulp-sitemap'),
stripJS = require('gulp-strip-comments'),
uglify = require('gulp-uglify'),
siteRoot = '_site',
cssFiles = 'devassets/scss/app.scss';

gulp.task('css', () => {
  gulp.src(cssFiles)
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


gulp.watch(cssFiles, ['css']);

gulp.task('default', gulpSequence(['css', 'scripts', 'sitemap', 'jekyll', 'manifest', 'serve']));
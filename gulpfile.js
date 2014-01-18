var gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    filter = require('gulp-filter'),
    ignore = require('gulp-ignore'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    debug = require('gulp-debug'),
    rev = require('gulp-rev'),
    es = require('event-stream'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),

    livereload = require('gulp-livereload'),
    http = require('http'),
    ecstatic = require('ecstatic'),
    tinylr = require('tiny-lr'),

    spawn = require('child_process').spawn,
    open = require('open');

var task  = gulp.task.bind(gulp),
    glob  = gulp.src.bind(gulp),
    dest  = gulp.dest.bind(gulp),
    run   = gulp.run.bind(gulp),
    watch = gulp.watch.bind(gulp);

task('default', function () {
  run('clean');
  run('lint');
  run('compile-less');
  run('minify');
});

var lr = tinylr();

task('run', function () {

  // start live reload server
  lr.listen(35729);

  // compile less on file changes
  watch('**/*.less', function () {
    run('clean', 'compile-less');
  });

  run('clean', 'lint', 'compile-less');
  run('nodemon');
});

task('compile-less', function () {
  return glob([
      'public/styles/vendor/*.css',
      'public/styles/gib.less',
    ])
    .pipe(less())
    .pipe(concat('gib.css'))
    .pipe(dest('public/resources'))
    .pipe(livereload(lr));
});

task('minify', ['compile-less'], function (done) {

  var isProduction = process.env.NODE_ENV === 'production';

  return glob('public/resources/gib.css')
    .pipe(rev())
    .pipe(gulpif(isProduction, minifyCss()))
    .pipe(dest('public/resources'))
    .pipe(es.wait(function (err, data) {

      glob('public/resources/**.css')
        .pipe(filter('!**/gib-*.css'))
        .pipe(rimraf());
    }));
});

task('clean', function () {
  return glob('public/resources/*')
    .pipe(rimraf({ force: true }));
});

task('lint', function () {
  return glob(['**/*.js',
        '!node_modules/**',
        '!public/resources/**',
        '!**/vendor/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

task('nodemon', ['compile-less'], function () {
  var nodemon = spawn('./run');
  nodemon.stdout.pipe(process.stdout);
  nodemon.stderr.pipe(process.stderr);
});

task('browser', function () {
  open('http://localhost:3000');
});

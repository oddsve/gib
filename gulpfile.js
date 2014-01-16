var gulp = require('gulp'),
    gulpLess = require('gulp-less'),
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

var lr = tinylr();

task('default', function () {
  run('less');
});

task('run', function () {
  // spawn nodemon
  var nodemon = spawn('./run');
  nodemon.stdout.pipe(process.stdout);
  nodemon.stderr.pipe(process.stderr);

  // start live reload server
  lr.listen(35729);

  // run default compilation
  run('default');

  // compile less on file changes
  watch('**/*.less', function () {
    run('less');
  });

  open('http://localhost:3000');
});

task('less', function () {
  glob('public/styles/gib.less')
    .pipe(gulpLess())
    .pipe(dest('public/resources'))
    .pipe(livereload(lr))
});

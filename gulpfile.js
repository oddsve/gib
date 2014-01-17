var gulp = require('gulp'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    debug = require('gulp-debug'),
    rev = require("gulp-rev"),

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
  run('lint');
  run('clean');
  run('less');
});

var lr = tinylr();

var lessDone = new process.EventEmitter();

task('run', function () {
  run('default');

  // start live reload server
  lr.listen(35729);

  // compile less on file changes
  watch('**.less', function () {
    run('clean');
    run('less');
  });

  lessDone.on('done', function () {
    run('nodemon');
    run('browser');
  });
});

task('less', function () {
  var task = glob([
    'public/styles/vendor/*.css',
    'public/styles/gib.less',
    ])
    .pipe(less())
    .pipe(concat('gib.css'))
    .pipe(rev())
    .pipe(dest('public/resources'))
    .pipe(livereload(lr));

  task.on('end', function () {
    lessDone.emit('done');
  });
});

task('css', function () {
  glob('public/resources/**.css')
    .pipe(concat())
})

task('clean', function () {
  glob('public/resources*')
    .pipe(rimraf({ force: true }));
});

task('lint', function () {
  glob(['**/*.js',
        '!node_modules/**',
        '!public/resources/**',
        '!**/vendor/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

task('nodemon', function () {
  var nodemon = spawn('./run');
  nodemon.stdout.pipe(process.stdout);
  nodemon.stderr.pipe(process.stderr);
});

task('browser', function () {
  open('http://localhost:3000');
});

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const eventStream = require('event-stream');

const $ = require('../plugins');
const conf = require('../conf').scripts;

const bundler = (entry) => {
  const bOpts = conf.browserifyOpts;
  var b;

  bOpts.entries = [conf.common, entry]

  b = browserify(bOpts);


  const bundle = () => {
    return b.bundle()
      .on('error', err => {
        console.log(`bundle error: ${err}`);
      })
      .pipe(source(entry))
      .pipe($.rename({
        dirname: '',
        extname: '.js'
      }))
      .pipe(gulp.dest(conf.dest));
  };

  b
  .on('update', bundle)
  .on('log', message => {
    console.log(message);
  });

  return bundle();
};

gulp.task('browserify', () => {
  const tasks = conf.entryFiles.map(entry => {
    return bundler(entry);
  });
  return eventStream.merge.apply(null, tasks);
});


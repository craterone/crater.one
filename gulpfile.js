const gulp = require('gulp');
const runSequence = require('run-sequence');

require('./gulp/conf');
require('./gulp/tasks/scripts');
require('./gulp/tasks/cleanCss');
require('./gulp/tasks/copy');
require('./gulp/tasks/clean');
require('./gulp/tasks/pug');
require('./gulp/tasks/sass');
require('./gulp/tasks/replace');
require('./gulp/tasks/uglify');

gulp.task('build', cb => {
  runSequence(
    'cleanDest',
    ['pug', 'sass', 'browserify', 'copyToDest'],
    'cleanBuild',
    'replaceHtml',
    'cleanCss',
    'uglify',
    ['copyToBuild'],
    cb
  );
});

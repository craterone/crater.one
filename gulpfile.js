const gulp = require('gulp');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');

const DIR = require('./gulp/conf').DIR;

requireDir('./gulp/tasks');


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

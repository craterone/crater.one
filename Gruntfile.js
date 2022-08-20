
const src_path = 'src';

const dst_path = 'dist';

const html_files = {};
html_files[`${dst_path}/index.html`] = [`${src_path}/html/*.pug`];


const dst_js_path = `${dst_path}/js`;



module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: `${dst_js_path}/main.js`,
        dest: `${dst_js_path}/main.min.js`,
      }
    },
    pug: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: html_files
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/main.css': 'src/css/main.scss'
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/js/main.js': ['src/js/main.js']
        },
        options: {
          transform: [
            ['babelify', {
              babelrc: false,
              presets: ['es2015']
            }],
            'envify',
            'glslify'
          ]
        }
      }
    },
    clean: {
      build: [dst_path],
      js: [`${dst_js_path}/*.js`, `!${dst_js_path}/*.min.js`]
    },
    copy: {
      img: {
        files: [
          { expand: true, cwd: src_path, src: ['img/**'], dest: dst_path },
        ],
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['clean:build', 'sass', 'pug', 'browserify', 'uglify', 'copy:img', 'clean:js']);

};
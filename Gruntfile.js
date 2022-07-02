
const src_path = `src`;


const dst_path = `dist`;

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
        files: {
          'dist/index.html': ['src/html/*.pug',]
        }
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
    clean: [dst_path]

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'sass', 'pug', 'browserify', 'uglify'
]);

};
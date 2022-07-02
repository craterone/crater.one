module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
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
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'pug','browserify']);

};
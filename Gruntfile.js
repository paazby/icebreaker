// Grunt has 3 components
// 1. load plugins: looks exactly like require
// 2. configure plugins
// 3. configure tasks you're going to invoke on the comman line
// 
// configure plugins is always the same format
// plugin: {
//   options: {
//     xx: xx
//   }, 
//   subtasks: {
//     xx: xx
//   }
// 
// subtasks: every grunt file has a default behaviour, subtasks
//           allow you to define behaviour other than default


module.exports = function(grunt) {
   
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
 
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
 
   jshint: {
      files: [
        // Add filespec list here
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      scripts: {
        files: [
          'lib/*.js',
          '*.js'
        ]
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    },
  });

  // Exactly like require
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('default',[]);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin',
    'jshint'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
     } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'build',
    'test',
    'upload'
  ]);


};

module.exports = function (grunt) {
  'use strict';

  
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    connect: {
      dev: {
        options: {
          port: 8000,
          base: './www'
        }
      }
    },
// assemble: {
//   options: {
//     flatten: true,
//     assets: '<%= site.assets %>',

//     // Metadata
//     site: '<%= site %>',

//     // Templates
//     partials: '<%= site.includes %>',
//     layoutdir: '<%= site.layouts %>',
//     layout: '<%= site.layout %>',
//   },
//   docs: {
//     src: ['templates/*.hbs'],
//     dest: '<%= site.dest %>/'
//   }
// }
    assemble: {
         options: {
           layout: 'compile_homepage.html',// The final build file
           layoutdir: './www/layouts/',
           partials: './www/layouts/partials/**/*.html'
         },
         // button000: {
         //    files: {'_demo/button-000/': ['button-000/index.html']},
         //    options: {layout: 'none'}, // override task-level layout
         // },
         posts: {
           files: [
           {
             cwd: './www/content/',
             dest: './www/',//files that are processed they will be placed here
             expand: true,
             src: ['**/*.html', '!_body_contents/**/*.html'] //do not take _body_contents folder. take everything else.
           }, 
           {
             cwd: './www/content/_body_contents/',
             dest: './www/',//files that are processed they will be placed here
             expand: true,
             src: '**/*.html'
           }
           ]
         }
       }

  });

  /* load every plugin in package.json */
  grunt.loadNpmTasks('grunt-contrib-connect');

  /* grunt tasks */
  grunt.registerTask('default', ['connect']);

};
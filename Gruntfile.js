module.exports = function (grunt) {
  'use strict';

  
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    assemble: {
      options: {// global options
        // This is just present always, idk what it does..
        flatten: true,
        // header.html, footer.html, etc common partials
        partials: 'www/partials/*.html',
        homePageUrl:'https://udayraj123.github.io', //for pdf viewing
        assets: 'assets',                 //folder(without a trailing '/') containing your css,js files as well as data files like .pdf
        layoutdir: 'www/layouts',         //the directory to find below file
        layout: 'master_layout.html',     // contains outermost covering layout. 
        // Currently it's just {{> header }}{{> body }}{{> footer }}, feel creative!
      },
      compileAllPages:{
        files:       {/*
        The Syntax is: 
            target     :     [sub_layouts],
        files in sublayouts array can contain different arrangements of these partials like {{> calender}}, feel super creative!
        Currently, they just contain plain html.
        */
          'about.html'    :     ['www/contents/make_about.html'],
          'blog.html'     :     ['www/contents/make_blog.html'],
          'contact.html'  :     ['www/contents/make_contact.html'],
          'gallery.html'  :     ['www/contents/make_gallery.html'],
          'index.html'    :     ['www/contents/make_index.html'],
          'resume.html'   :     ['www/contents/make_resume.html'],
        },
      },
    }
  });

  /* load every plugin in package.json */
  grunt.loadNpmTasks('grunt-assemble');

  /* grunt tasks */
  grunt.registerTask('default', ['assemble']);

};

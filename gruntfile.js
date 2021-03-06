module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
          livereload: true,
      },
      scripts: {
        files: ['src/assets/js/**/*.js'],
        tasks: ['jshint'],
        options: {
            spawn: false,
        },
      },
      images: {
        files: ['src/assets/img/**/*.{png,jpg,gif}'],
        tasks: ['imagemin'],
        //tasks: ['copy:images'],
        options: {
          spawn: false,
        }
      },
      svg: {
        files: ['src/assets/img/*.svg'],
        tasks: ['svgmin'],
        options: {
          spawn: false,
        }
      },
      svgdefs: {
        files: ['src/assets/img/svgdefs/*.svg'],
        tasks: ['svgstore', 'svgmin'],
        options: {
          spawn: false,
        }
      },

      iconfonts: {
        files: ['src/assets/fonts/icons/*.svg'],
        tasks: ['webfont', 'copy:iconfonts'],
      },

      styles: {
        files: ['src/assets/sass/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer:dev'],
        options: {
            spawn: false,
        }
      },

      handlebars: {
        files: ['src/templates/layouts/*.hbs', 'src/templates/partials/**/*.hbs', 'src/templates/pages/*.hbs', 'src/templates/data/*.json'],
        tasks: ['assemble'],
      },
    },


    webfont: {
        icons: {
            src: 'src/assets/fonts/icons/*.svg',
            dest: 'src/assets/fonts',
            destCss: 'src/assets/sass/base',
            options: {
                htmlDemo: false,
                stylesheet: 'scss',
                relativeFontPath: '../fonts',
                engine: 'node',
                font: 'icons',
                fontHeight: 256,
                templateOptions: {
                    baseClass: 'icon',
                    classPrefix: '',
                }
            }
        }
    },

    // Assembles your page content with html layout
    assemble: {
      options: {
        layoutdir: 'src/templates/layouts',
        layout: 'default.hbs',
        partials: ['src/templates/partials/**/*.hbs'],
        assets: './src/assets',
        helpers: [
          'handlebars-helpers',
          'helper-aggregate',
          './src/templates/helpers/**/*.js',
        ],

        //flatten: true,
        marked: {
          gfm: false,
        },
      },

      pages: {
        files: [{
          cwd: './src/templates/pages/',
          dest: 'dist/',
          expand: true,
          src: '**/*.hbs',
        }],
      },

    },

    htmlmin: {
      dist: {
        options: {
          removeComments: false,
          collapseWhitespace: false,
          preserveLineBreaks: true,
        },
        files: [{
            expand: true,
            cwd: 'dist/',
            src: '**/*.html',
            dest: 'dist/'
        }]
      },
    },

    prettify: {
      options: {
        indent: 4,
        condense: true,
        indent_inner_html: true,
        unformatted: [
          //"a",
          "pre"
        ]
      },
      dist: {
        files: [{
            expand: true,
            cwd: 'dist/',
            src: '**/*.html',
            dest: 'dist/'
        }]
      }
    },


    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['src/assets/js/{,**/}*.js', '!src/assets/js/libs/**/*.js']
    },

    imagemin: {
        dist: {
            files: [{
                expand: true,
                cwd: 'src/assets/img/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'dist/assets/img/'
            }]
        }
    },

    svgstore: {
      options: {
        //prefix : 'icon-', // This will prefix each ID
        svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
          //viewBox : '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg'
        },
        formatting: {
          indent_size : 2
        },
        cleanup: [
          'stroke',
          'fill'
        ]
      },
      default : {
        files: {
          'src/assets/img/svgdefs.svg': ['src/assets/img/svgdefs/*.svg'],
        },
      },
    },

    svgmin: {
        options: {
            plugins: [
                {
                    cleanupIDs: false
                }, {
                    removeViewBox: true
                }, {
                    removeUselessStrokeAndFill: false
                }
            ]
        },
        dist: {
            files: [{
                expand: true,
                cwd: 'src/assets/img/',
                src: [
                  '**/*.svg',
                  //'!svgdefs/*',
                  //'!svgdefs.svg',
                ],
                dest: 'dist/assets/img/'
            }]
        }
    },

    
    // Grunt-sass 
    sass: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/assets/sass',
          src: ['**/*.scss'],
          dest: 'dist/assets/css',
          ext: '.css'
        }]
      },
      options: {
        sourceMap: false,
        //sourceMap: 'dist/assets/css/default.css.map', 
        //sourceMapRoot: 'src/assets/sass/',
        //outFile: 'dist/assets/css',
        outputStyle: 'nested', 
        imagePath: "../img/",
        precision: 2,
      }
    },

    autoprefixer: {

        options: {
          browsers: ['last 2 versions', 'ie >= 9']
        },
        dev: {
            files: {
                'dist/assets/css/default.css': 'dist/assets/css/default.css',
            },

            files: [{
                expand: true,
                cwd: 'dist/assets/css/',
                src: '*.css',
                dest: 'dist/assets/css/'
            }],

        },
    },

    clean: {
      dist: {
        src: ['dist/*', '!dist/.htaccess'],
      }
    },

    copy: {
      iconfonts: {
        files: [
          {
            expand: true, 
            cwd: 'src/assets/fonts/', 
            src: [
              'icons.*',
            ],
            dest: 'dist/assets/fonts/',
          }
        ]
      },
      assets: {
        files: [
          {
            expand: true, 
            cwd: 'src/assets/fonts/', 
            src: [
              //'*.{svg,woff,eot,ttf}',
              'icons.*',
              'BodoniSvtyTwo*.*',
            ],
            dest: 'dist/assets/fonts/',
          },
          {
            expand: true, 
            cwd: 'src/assets/js/libs/', 
            src: [
              'jquery-1.*.min.js',
              'jquery-validate/localization/*.min.js',
            ],
            dest: 'dist/assets/js/libs',
          }
        ],
      },
      images: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/img/',
            src: ['**/*.{png,jpg,gif}'],
            dest: 'dist/assets/img/'
          },
        ],
      },

    },

    useminPrepare: {
      html: 'dist/*.html',
    },

    usemin: {
      html: 'dist/*.html',
      options: {
          dirs: ['dist/']
      }
    },


    uglify: {
      manual_js: {
        files: [
          {
            expand: true, 
            cwd: 'src/assets/js/', 
            src: [
              'nf_segments.js',
            ],
            dest: 'dist/assets/js/',
          }
        ]
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /(\.\.\/src\/assets\/|src\/assets\/|assets\/)/g,
              replacement: 'assets/',
            },
          ]
        },
        files: [
          {
            expand: true, 
            //flatten: true, 
            cwd: 'dist',
            src: ['**/*.html'],
            dest: 'dist/.'
          }
        ]
      },
    },


  });

  // Load plugins
  require('matchdep').filterDev(['grunt-*', 'assemble']).forEach(grunt.loadNpmTasks);


  grunt.registerTask('common', ['assemble', 'prettify', 'sass:dev', 'autoprefixer', 'svgstore', 'svgmin', 'imagemin', 'copy:assets']);

  // Default task(s).
  grunt.registerTask('default', ['clean:dist', 'common', 'watch']);

  // Build minified assets
  grunt.registerTask('build', [
    'clean:dist',
    'common',
    //'htmlmin', 
    //'imagemin',
    //'svgmin',
    'useminPrepare', 
    'concat',
    'cssmin',
    'uglify',
    'usemin',
    'replace:dist',
  ]);

};
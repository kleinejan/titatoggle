module.exports = function(grunt) {
require( 'time-grunt' )( grunt );
require( 'load-grunt-tasks' )( grunt );
    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            styles: {
                // Which files to watch (all .less files recursively in the less directory)
                files: ['less/*.less'],
                tasks: ['less:develop','autoprefixer:docs_file'],
                options: {
                    nospawn: true,
                    atBegin:true
                }
            },

            html:{
                files : [ '_layouts/*.html',
                '_includes/*.*',
                '_posts/*.markdown',
                '_config.yml',
                'pages/**',
                'index.html',
                '404.html' ],
                tasks : [ 'shell:jekyllBuild','less:develop','autoprefixer:docs_file'],
                options : {
                    spawn : true,
                    interrupt : true,
                    atBegin : true,
                    livereload : true
                }
            }
        },
        clean: {
            docs: {
                src: ['gh-pages']
            },
            dist: {
                src: ['dist']
            },
            css: {
                src: ['css']
            }
        },
        copy: {
            deploy: {
                files: [
                // includes files within path
                { expand: true,  cwd: 'less/', src: ['_titatoggle.less'], dest: 'dist/' },
                ]
            }
        },

        shell : {
            jekyllBuild : {
                command : 'jekyll build'
            },
            jekyllServe : {
                command : 'jekyll serve'
            }
        },
        less: {
            develop: {
                options: {
                    sourceMap: true
                },
                files: {
                    "gh-pages/css/main.css": "less/main.less"
                }
            },
            deploy: {
                files: {
                    "dist/titatoggle-dist.css": "less/slider.less"
                }
            },
            deployMin: {
                options: {
                    cleancss: true
                },
                files: {
                    "dist/titatoggle-dist-min.css": "less/slider.less"
                }
            }
        },
        autoprefixer: {

            options: {
              browsers: ['last 2 versions']
            },

            // prefix the specified file
            docs_file: {
              src: 'gh-pages/css/main.css',
              dest: 'gh-pages/css/main.css'
            },
            deploy_file: {
              src: 'dist/titatoggle-dist.css',
              dest: 'dist/titatoggle-dist.css'
            },
        },
        'gh-pages': {
            options: {
              base: 'gh-pages'
            },
            src: ['**']
          }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-gh-pages');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('deploy', ['clean','shell:jekyllBuild','less:develop','less:deploy','less:deployMin','autoprefixer','copy:deploy','gh-pages']);
    grunt.registerTask('default', 'watch');

};

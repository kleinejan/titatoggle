module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            styles: {
                // Which files to watch (all .less files recursively in the less directory)
                files: ['less/*.less'],
                tasks: ['less:develop'],
                options: {
                    nospawn: true,
                    atBegin:true
                }
            },
        },
        copy: {
            deploy: {
                files: [
                // includes files within path
                {expand: true,  cwd: 'less/', src: ['_slider.less'], dest: 'dest/'},
                ]
            }
        },
        clean: {
            main: {
                src: ['dest']
            }
        },
        less: {
            develop: {
                options: {
                    sourceMap: true
                },
                files: {
                    "css/main.css": "less/main.less"
                }
            },
            deploy: {
                options: {
                    cleancss: true
                },
                files: {
                    "dest/slider-dist.css": "less/slider.less"
                }
            }
        },


    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('deploy', ['clean','less:develop','less:deploy','copy:deploy']);
    grunt.registerTask('default', ['watch']);

};

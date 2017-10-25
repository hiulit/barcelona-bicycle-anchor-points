'use strict';

var LIVERELOAD_PORT = 35730;
var SERVER_PORT = 9001;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    var target = grunt.option('target') || '';
    var config = {
        src: 'src',
        dist: 'dist',
        tmp: '.tmp'
    }

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        config: config,
        clean: {
            dist: [
                '<%= config.tmp %>/',
                '<%= config.dist %>/'
            ]
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                // hostname: 'localhost',
                hostname: '0.0.0.0',
                livereload: LIVERELOAD_PORT
            },
            livereload: {
                options: {
                    //keepalive: true,
                    // base: [config.src],
                    open: {
                        target: 'http://localhost:<%= connect.options.port %>'
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, config.dist)
                        ];
                    }
                }
            }
        },
        watch: {
            options: {
                spawn: false,
                livereload: LIVERELOAD_PORT
            },
            // assets: {
            //     files: [
            //         '<%= config.src %>/assets/{,*/,**/}*.*'
            //     ],
            //     tasks: [
            //         'copy'
            //     ]
            // },
            styles: {
                files: [
                    '<%= config.src %>/{,*/,**/}*.styl'
                ],
                tasks: [
                    'stylus'
                ]
            }
            // scripts: {
            //     files: [
            //         '<%= config.src %>/{,*/,**/}*.js'
            //     ],
            //     tasks: [
            //         'concat'
            //     ]
            // }
        },
        stylus: {
            dist: {
                options: {
                    sourcemap: {
                        inline: true
                    },
                    'include css': true,
                    compress: false
                },
                files: {
                    '<%= config.src %>/styles/main.css': '<%= config.src %>/styles/main.styl'
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'stylus',
        // 'json_bake',
        // 'bake',
        // 'concat',
        // 'copy',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', function (target) {
        if (typeof target === 'undefined') {
            target = 'dev';
        }

        grunt.task.run([
            'clean',
            'stylus',
            // 'json_bake',
            // 'bake',
            // 'obfuscator',
            // 'concat',
            // 'copy',
            // 'critical',
            // 'cssmin',
            // 'htmlmin',
            // 'sitemaps',
            // 'image',
            'connect:livereload',
            'watch'
        ]);
    });
};

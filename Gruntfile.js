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
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.src %>/assets/',
                        src: [
                            '{,*/,**/}*.*',
                            '!old/{,*/,**/}*.*'
                        ],
                        dest: '<%= config.dist %>/assets/'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.src %>/',
                        src: ['{,*/,**/}*.html'],
                        dest: '<%= config.dist %>/'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/leaflet/dist/images/',
                        src: ['{,*/,**/}*.*'],
                        dest: '<%= config.dist %>/styles/images/'
                    }
                ]
            }
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
                    base: [config.dist],
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
            assets: {
                files: [
                    '<%= config.src %>/assets/{,*/,**/}*.*',
                    '<%= config.src %>/{,*/,**/}*.html'
                ],
                tasks: [
                    'copy'
                ]
            },
            styles: {
                files: [
                    '<%= config.src %>/{,*/,**/}*.styl'
                ],
                tasks: [
                    'stylus'
                ]
            },
            scripts: {
                files: [
                    '<%= config.src %>/{,*/,**/}*.js',
                    '!<%= config.src %>/scripts/unusedFunctions.js'
                ],
                tasks: [
                    'concat'
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                '<%= config.dist %>/scripts/main.js': ['<%= config.dist %>/scripts/main.js']
                }
            }
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
                    '<%= config.dist %>/styles/main.css': '<%= config.src %>/styles/main.styl'
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/styles/',
                    src: ['{,*/,**/}*.css'],
                    dest: '<%= config.dist %>/styles/',
                    ext: '.css'
                }]
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'node_modules/leaflet/dist/leaflet.js',
                    'node_modules/proj4/dist/proj4.js',
                    'node_modules/proj4leaflet/src/proj4leaflet.js',
                    '<%= config.src %>/scripts/{,*/,**/}*.js',
                    '!<%= config.src %>/scripts/unusedFunctions.js'
                ],
                dest: '<%= config.dist %>/scripts/main.js'
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'stylus',
        'concat',
        'copy',
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
            'cssmin',
            'concat',
            'uglify',
            'copy',
        ]);
    });
};

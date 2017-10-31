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
            tmp: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.src %>/',
                        src: [
                            'assets/{,*/,**/}*.*',
                            'data/{,*/,**/}*.json',
                            '{,*/,**/}*.html'
                            // '!old/{,*/,**/}*.*'
                        ],
                        dest: '<%= config.tmp %>/'
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: 'node_modules/leaflet/dist/images/',
                        src: ['{,*/,**/}*.*'],
                        dest: '<%= config.tmp %>/styles/images/'
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
                    base: [config.tmp],
                    open: {
                        target: 'http://localhost:<%= connect.options.port %>'
                    }
                }
            },
            tmp: {
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
                    '<%= config.src %>/data/{,*/,**/}*.json',
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
                    'stylus',
                    'postcss'
                ]
            },
            scripts: {
                files: [
                    '<%= config.src %>/{,*/,**/}*.js'
                    // '!<%= config.src %>/scripts/unusedFunctions.js'
                ],
                tasks: [
                    'concat'
                ]
            }
        },
        uglify: {
            tmp: {
                files: {
                '<%= config.tmp %>/scripts/main.js': ['<%= config.tmp %>/scripts/main.js']
                }
            }
        },
        stylus: {
            options: {
                sourcemap: {
                    inline: true
                },
                'include css': true,
                compress: false
            },
            tmp: {
                files: {
                    '<%= config.tmp %>/styles/main.css': '<%= config.src %>/styles/main.styl'
                }
            }
        },
        postcss: {
            options: {
                map: true, // inline sourcemaps
                sourcesContent: true,
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
                    // require('autoprefixer')({browsers: ['> 0%', 'ie 8-10', 'Android >= 2.3']}) // add vendor prefixes
                ]
            },
            tmp: {
                src: '<%= config.tmp %>/styles/main.css'
            }
        },
        cssmin: {
            options: {
                sourceMap: false
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: '<%= config.tmp %>/styles/',
                    src: ['{,*/,**/}*.css'],
                    dest: '<%= config.tmp %>/styles/',
                    ext: '.css'
                }]
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            tmp: {
                src: [
                    'node_modules/leaflet/dist/leaflet.js',
                    'node_modules/proj4/dist/proj4.js',
                    'node_modules/proj4leaflet/src/proj4leaflet.js',
                    '<%= config.src %>/scripts/api/api.js',
                    '<%= config.src %>/scripts/main.js'
                    // '!<%= config.src %>/scripts/unusedFunctions.js'
                ],
                dest: '<%= config.tmp %>/scripts/main.js'
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'stylus',
        'postcss',
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
            'postcss',
            'cssmin',
            'concat',
            'uglify',
            'copy',
        ]);
    });
};

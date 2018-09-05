'use strict';

var LIVERELOAD_PORT = 35730;
var TMP_PORT = 9001;
var DIST_PORT = 9002;

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
            tmp: [
                '<%= config.tmp %>/'
            ],
            dist: [
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
                            'manifest.json',
                            '{,*/,**/}*.html',
                            '{,*/,**/}*.{png,ico}'
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
            },
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.src %>/',
                        src: [
                            'assets/{,*/,**/}*.*',
                            'data/{,*/,**/}*.json',
                            'manifest.json',
                            '{,*/,**/}*.html',
                            '{,*/,**/}*.{png,ico}'
                            // '!old/{,*/,**/}*.*'
                        ],
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
                // port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                // hostname: 'localhost',
                hostname: '0.0.0.0',
                livereload: LIVERELOAD_PORT
            },
            tmp: {
                options: {
                    //keepalive: true,
                    port: grunt.option('port') || TMP_PORT,
                    base: [config.tmp],
                    open: {
                        target: 'http://localhost:<%= connect.tmp.options.port %>'
                    }
                }
            },
            dist: {
                options: {
                    keepalive: true,
                    port: grunt.option('port') || DIST_PORT,
                    base: [config.dist],
                    open: {
                        target: 'http://localhost:<%= connect.dist.options.port %>'
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
                    'copy:tmp'
                ]
            },
            styles: {
                files: [
                    '<%= config.src %>/{,*/,**/}*.styl'
                ],
                tasks: [
                    'stylus:tmp',
                    'postcss:tmp'
                ]
            },
            scripts: {
                files: [
                    '<%= config.src %>/{,*/,**/}*.js'
                    // '!<%= config.src %>/scripts/unusedFunctions.js'
                ],
                tasks: [
                    'concat:tmp'
                ]
            }
        },
        uglify: {
            tmp: {
                files: {
                '<%= config.tmp %>/scripts/main.js': ['<%= config.tmp %>/scripts/main.js']
                }
            },
            dist: {
                files: {
                '<%= config.dist %>/scripts/main.js': ['<%= config.dist %>/scripts/main.js']
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
            },
            dist: {
                files: {
                    '<%= config.dist %>/styles/main.css': '<%= config.src %>/styles/main.styl'
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
            },
            dist: {
                src: '<%= config.dist %>/styles/main.css'
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
            tmp: {
                src: [
                    'node_modules/leaflet/dist/leaflet.js',
                    'node_modules/leaflet-easybutton/src/easy-button.js',
                    'node_modules/proj4/dist/proj4.js',
                    'node_modules/proj4leaflet/src/proj4leaflet.js',
                    '<%= config.src %>/APIKeys.js',
                    '<%= config.src %>/scripts/api/api.js',
                    '<%= config.src %>/scripts/main.js'
                    // '!<%= config.src %>/scripts/unusedFunctions.js'
                ],
                dest: '<%= config.tmp %>/scripts/main.js'
            },
            dist: {
                src: [
                    'node_modules/leaflet/dist/leaflet.js',
                    'node_modules/leaflet-easybutton/src/easy-button.js',
                    'node_modules/proj4/dist/proj4.js',
                    'node_modules/proj4leaflet/src/proj4leaflet.js',
                    '<%= config.src %>/APIKeys.js',
                    '<%= config.src %>/scripts/api/api.js',
                    '<%= config.src %>/scripts/main.js'
                    // '!<%= config.src %>/scripts/unusedFunctions.js'
                ],
                dest: '<%= config.dist %>/scripts/main.js'
            }
        },
        prompt: {
            target: {
                options: {
                    questions: [
                        {
                            config: 'what-to-do',
                            type: 'list', // list, checkbox, confirm, input, password
                            message: 'What do you want to do?',
                            default: 'local', // default value if nothing is entered
                            choices: [
                                {
                                    name: 'Develop in a localhost server [> grunt local]',
                                    value: 'local'
                                },
                                {
                                    name: 'Build for production and start a localhost server [> grunt build-connect]',
                                    value: 'build-connect'
                                },
                                {
                                    name: 'Build for production [> grunt build]',
                                    value: 'build'
                                },
                                {
                                  name: 'Update bicycle anchor points JSON [> grunt update-json]',
                                    value: 'update-json'
                                }
                            ]
                        }
                    ]
                }
            }
        },
        shell: {
            "update-json": {
                command: 'node update-json.js'
            }
        }
    });

    grunt.registerTask('tasks', function () {
        grunt.task.run([
            'prompt',
            'what-to-do'
        ]);
    });

    grunt.registerTask('what-to-do', function (a, b) {
        grunt.task.run([grunt.config('what-to-do')]);
    });

    grunt.registerTask('default', function(target) {
        grunt.task.run(['tasks']);
    });

    grunt.registerTask('local', function (target) {
        if (typeof target === 'undefined') {
            target = 'local';
        }

        grunt.task.run([
            'clean:tmp',
            'stylus:tmp',
            'postcss:tmp',
            'concat:tmp',
            'copy:tmp',
            'connect:tmp',
            'watch'
        ]);
    });

    grunt.registerTask('build-connect', function (target) {
        if (typeof target === 'undefined') {
            target = 'build-connect';
        }

        grunt.task.run([
            'clean:dist',
            'shell:update-json',
            'stylus:dist',
            'postcss:dist',
            'cssmin:dist',
            'concat:dist',
            'uglify:dist',
            'copy:dist',
            'connect:dist'
        ]);
    });

    grunt.registerTask('build', function (target) {
        if (typeof target === 'undefined') {
            target = 'build';
        }

        grunt.task.run([
            'clean:dist',
            'shell:update-json',
            'stylus:dist',
            'postcss:dist',
            'cssmin:dist',
            'concat:dist',
            'uglify:dist',
            'copy:dist',
        ]);
    });


    grunt.registerTask('update-json', function (target) {
        if (typeof target === 'undefined') {
            target = 'update-json';
        }

        grunt.task.run([
            'shell:update-json'
        ]);
    });
};

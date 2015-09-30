var arduino = process.env.ARDUINO_PATH;

var boards = {
    "uno" :{
        package: "arduino:avr:uno",
    },
    "nano": {
        cpu: "atmega328",
        package: "arduino:avr:nano:cpu=atmega328",
    },
    "promini": {
        cpu: "16MHzatmega328",
        package: "arduino:avr:pro:cpu=16MHzatmega328",
    },
};

module.exports = function(grunt) {
 
    // configure the tasks
    grunt.initConfig({
        exec: {
            compile_firmata: {
                cwd: "firmware/",
                command:function(board) {
                    return arduino + " --verify --verbose-build --board "  + boards[board].package + 
                    " --pref build.path=bin/firmata/" + board +  " build/hcsr04_firmata/hcsr04_firmata.ino";
                },
            },
        },

        copy: {
            options: {
                timestamp: true,
            },

            firmata: {
                cwd: 'firmware/src/',
                flatten: true,
                src: [ 'libs/**', 'controller_src/hcsr04_firmata/*' ],
                dest: 'firmware/build/hcsr04_firmata/',
                expand: true,
                filter: 'isFile',
            },
            backpack: {
                cwd: 'firmware/src/',
                flatten: true,
                src: [ 'controller_src/backpack_backpack/*' ],
                dest: 'firmware/build/hcsr04_backpack/',
                expand: true,
                filter: 'isFile',
            },
        },
        clean: {
            firmware_build: {
                src: [  
                        'firmware/build/hcsr04_firmata',
                        'firmware/build/hcsr04_backpack',
                     ]
            },
            compiled_bins: {
                src: [
                        'firmware/bin/backpack/*',
                        'firmware/bin/firmata/*'
                    ]
            },
        },
    });
 
    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('build', ['clean', 'copy']);
    grunt.registerTask('compile', ['build', 'exec:compile_firmata:uno', 'exec:compile_firmata:nano', 'exec:compile_firmata:promini' ]);
};

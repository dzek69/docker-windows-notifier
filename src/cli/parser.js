const DEFAULT = {};
DEFAULT.toString = () => "*";

const list = (value, arr) => {
    if (arr[0] === DEFAULT) {
        arr.length = 0;
    }
    const values = value.split(",").map(x => x.trim()).filter(Boolean);
    arr.push(values.includes("*") ? "*" : values);
    return arr;
};

const fileHandler = (value, arr) => {
    if (arr[0] === DEFAULT) {
        arr.length = 0;
    }
    arr.push(value);
    return arr;
};

const cliHandler = () => {
    const program = require("commander");

    program
        .version("1.1.1", "-v, --version")
        .option("-f, --file [path or `*` to use docker-compose.yml]", "docker-compose files to be parsed", fileHandler, [DEFAULT])
        .option("-s, --service [name,name,...]", "services from each docker-compose file of which volumes should be monitored, comma-separated", list, [DEFAULT])
        .option("--debug", "debug mode, more logging, more verbose errors")
    ;

    program.on('--help', function() {
        console.log('');
        console.log('');
        console.log('  Important:');
        console.log('');
        console.log('    - Only version 3 of docker-compose files are supported');
        console.log('    - Start your Docker containers before running this program to avoid triggering a lot of notifications that are created during setup phase of your containers. I feel this may even crash your container start-up sometimes. Better safe than sorry');
        console.log('    - Run this when current working directory is the same as docker-compose file location');
        console.log('    - Commands are sent to containers via `container_name` specified in docker-compose service, so make sure to define names before using this program');
        console.log('    - Program is tested with relative to docker-compose paths only');
        console.log('    - If your watch paths are overlapping (ie: ./test and ./test/files) or are duplicated then notifications will be triggered more than once for single change');
        console.log('');
        console.log('');
        console.log('  Notes:');
        console.log('');
        console.log("    - By default this program will get `docker-compose.yml` file and will watch every volume on every service.");
        console.log("    - You can specify multiple docker-compose files.");
        console.log("    - If you want to watch just some of services be sure to pass -s argument for every docker-compose file.");
        console.log("    - You can pass -f * to use `docker-compose.yml` file");
        console.log("    - You can pass -s * to watch every service");
        console.log("    - You can pass just -f or -s argument");
        console.log("    - Selecting volumes to watch is currently not supported");
        console.log('');
        console.log('');
        console.log('  Examples:');
        console.log('');
        console.log('    $ docker-windows-notifier --file * --service * -f docker-compose.dev.yml -s node');
        console.log('    Watch every service of `docker-compose.yml` and `node` service of `docker-compose.dev.yml`');
        console.log('');
        console.log('    $ docker-windows-notifier -s node,python');
        console.log('    Watch `node` and `python` services of `docker-compose.yml`');
    });

    program.parse(process.argv);

    const { service, file, debug } = program;
    return {
        files: file,
        services: service,
        debug: debug,
    };
};

module.exports = cliHandler;

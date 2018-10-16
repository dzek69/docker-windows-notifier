"use strict";

const DEFAULT = {};
DEFAULT.toString = () => "*";

const list = (value, arr) => {
    if (arr[0] === DEFAULT) {
        arr.length = 0; // eslint-disable-line no-param-reassign
    }
    const values = value.split(",").map(x => x.trim()).filter(Boolean);
    arr.push(values.includes("*") ? "*" : values);
    return arr;
};

const fileHandler = (value, arr) => {
    if (arr[0] === DEFAULT) {
        arr.length = 0; // eslint-disable-line no-param-reassign
    }
    arr.push(value);
    return arr;
};

const cliHandler = () => { // eslint-disable-line max-lines-per-function
    const program = require("commander"); // eslint-disable-line global-require

    program
        .version("1.1.1", "-v, --version")
        .option(
            "-f, --file [path or `*` to use docker-compose.yml]",
            "docker-compose files to be parsed",
            fileHandler, [DEFAULT],
        )
        .option(
            "-s, --service [name,name,...]",
            "services from each docker-compose file of which volumes should be monitored, comma-separated",
            list, [DEFAULT],
        )
        .option("--debug", "debug mode, more logging, more verbose errors")
        .option("--disable-update-check", "disables checking if there is a new version on startup");
    program.on("--help", function handleHelp() { // eslint-disable-line max-statements
        /* eslint-disable max-len */
        console.info("");
        console.info("");
        console.info("  Important:");
        console.info("");
        console.info("    - Only version 3 of docker-compose files are supported");
        console.info("    - Start your Docker containers before running this program to avoid triggering a lot of notifications that are created during setup phase of your containers. I feel this may even crash your container start-up sometimes. Better safe than sorry");
        console.info("    - Run this when current working directory is the same as docker-compose file location");
        console.info("    - Commands are sent to containers via `container_name` specified in docker-compose service, so make sure to define names before using this program");
        console.info("    - Program is tested with relative to docker-compose paths only");
        console.info("    - If your watch paths are overlapping (ie: ./test and ./test/files) or are duplicated then notifications will be triggered more than once for single change");
        console.info("");
        console.info("");
        console.info("  Notes:");
        console.info("");
        console.info("    - By default this program will get `docker-compose.yml` file and will watch every volume on every service.");
        console.info("    - You can specify multiple docker-compose files.");
        console.info("    - If you want to watch just some of services be sure to pass -s argument for every docker-compose file.");
        console.info("    - You can pass -f * to use `docker-compose.yml` file");
        console.info("    - You can pass -s * to watch every service");
        console.info("    - You can pass just -f or -s argument");
        console.info("    - Selecting volumes to watch is currently not supported");
        console.info("");
        console.info("");
        console.info("  Examples:");
        console.info("");
        console.info("    $ docker-windows-notifier --file * --service * -f docker-compose.dev.yml -s node");
        console.info("    Watch every service of `docker-compose.yml` and `node` service of `docker-compose.dev.yml`");
        console.info("");
        console.info("    $ docker-windows-notifier -s node,python");
        console.info("    Watch `node` and `python` services of `docker-compose.yml`");
        /* eslint-enable max-len */
    });

    program.parse(process.argv);

    const { service, file, debug, disableUpdateCheck } = program;
    return {
        files: file,
        services: service,
        debug: debug,
        disableUpdateCheck: disableUpdateCheck,
    };
};

module.exports = cliHandler;

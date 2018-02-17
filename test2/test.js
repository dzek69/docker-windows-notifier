const chokidar = require("chokidar");

const fn = () => {
    console.log("Another service, see test2/test.js and don't forget about separate volume: test2/files/*.", Date.now())
};

setInterval(fn, 1200);
fn();

const DIR = "/files";

const onReady = () => {
    console.log("Ready for watching", DIR)
};

const onEvent = (event, file) => {
    console.log(event, "happend on", file);
};

chokidar
    .watch(DIR)
    .on('ready', onReady)
    .on('all', onEvent)
;
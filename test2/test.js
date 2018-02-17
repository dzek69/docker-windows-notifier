const chokidar = require("chokidar");

console.log("I am a message from `node / test2` service, see test2/test.js and don't forget you can mess with separate volume in `test2/files/`. You will be notified about any change in this volume.", Date.now())

const DIR = "/files";
const onReady = () => {
    console.log("Ready for watching", DIR)
};
const onEvent = (event, file) => {
    console.log(event, "happend on", file);
};
chokidar
    .watch(DIR, { ignoreInitial: true })
    .on('ready', onReady)
    .on('all', onEvent)
;
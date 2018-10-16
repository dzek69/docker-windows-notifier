"use strict";

const chokidar = require("chokidar");

const dropCommonPrefix = require("./utils/dropCommonPrefix");
const normalizePath = require("./utils/normalizePath");
const join = require("./utils/unixJoin");

const { resetPrivileges } = require("./utils/docker");

const watchVolume = (volume, service, fileName, debug) => {
    const { source, target } = volume;

    console.info(
        `- Using "${source}" path from "${service.name}" service defined in `
        + `"${fileName}" as watch root that will cause updates in "${target}"`,
    );

    const onReady = () => {
        console.info(
            `- Watching for changes in "${source}" from "${service.name}" service defined in "${fileName}" is ready`,
        );
    };

    const onEvent = async (event, path) => {
        debug && console.info(`+ File ${path} got ${event} event`);

        const changedPath = normalizePath(path);
        const targetUpdatePath = dropCommonPrefix(changedPath, source);

        const targetFile = join(target, targetUpdatePath);

        try {
            await resetPrivileges(service.name, targetFile);
            console.info(`+ Triggered notification for ${path}`);
        }
        catch (e) {
            console.error(`! Can not trigger notification for ${path}: ${(debug && e.stack) || e.message}`);
        }
    };

    chokidar
        .watch(source || ".", { ignoreInitial: true })
        .on("ready", onReady)
        .on("all", onEvent);
};

const watchService = (service, fileName, debug) => {
    service.volumes.forEach(volume => {
        watchVolume(volume, service, fileName, debug);
    });
};

const watchFile = (file, debug) => {
    file.services.forEach((service) => {
        watchService(service, file.file, debug);
    });
};

const watch = (files, debug) => {
    files.forEach(file => watchFile(file, debug));
};

module.exports = watch;

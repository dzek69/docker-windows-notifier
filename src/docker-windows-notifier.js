#!/usr/bin/env node

"use strict";

const cliHandler = require("./cliHandler");
const watch = require("./watch");
const newVersionCheck = require("./utils/newVersionCheck");

const app = require("../package.json");

const main = async () => {
    const result = await cliHandler(app.version);
    await watch(result.files, result.verbose);
    if (!result.disableUpdateCheck) {
        await newVersionCheck(app.version).then(
            newVersionCheck.handleResult.bind(null, result.verbose),
            newVersionCheck.handleError.bind(null, result.verbose),
        );
    }
};

main().catch((e) => {
    if (e.safe) {
        console.error(e.message);
        console.error("Run this program with --help to get more info.");
        process.exit(1); // eslint-disable-line no-process-exit
        return;
    }
    console.error("Sorry, error just happend.");
    console.error("Message:");
    console.error(process.argv.includes("--debug") ? e.stack : e.message);
    console.error("");
    console.error("If you believe this is our fault please report this error here: https://github.com/dzek69/docker-windows-notifier/issues");
    process.exit(1); // eslint-disable-line no-process-exit
});

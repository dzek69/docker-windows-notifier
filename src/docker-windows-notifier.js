#!/usr/bin/env node

const cliHandler = require("./cliHandler");
const watch = require("./watch");

const main = async () => {
    const result = await cliHandler();
    await watch(result.files, result.verbose);
};

main().catch((e) => {
    if (e.safe) {
        console.error(e.message);
        console.error("Run this program with --help to get more info.");
        process.exit(1);
        return;
    }
    console.error("Sorry, error just happend.");
    console.error("Message:");
    console.error(process.argv.includes("--debug") ? e.stack : e.message);
    console.error("");
    console.error("If you believe this is our fault please report this error here: https://github.com/dzek69/docker-windows-notifier/issues");
    process.exit(1);
});
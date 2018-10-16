"use strict";

const { exec, execFile } = require("child_process");
const ensureError = require("./ensureError");

const run = command => {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(ensureError(err));
                return;
            }
            resolve({
                stdout, stderr,
            });
        });
    });
};

run.file = (file, args) => {
    return new Promise((resolve, reject) => {
        const options = {
            env: process.env,
        };
        execFile(file, args, options, (err, stdout, stderr) => {
            if (err) {
                reject(ensureError(err));
                return;
            }
            resolve({
                stdout, stderr,
            });
        });
    });
};

module.exports = run;

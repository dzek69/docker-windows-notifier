"use strict";

const { exec } = require("child_process");
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

module.exports = run;

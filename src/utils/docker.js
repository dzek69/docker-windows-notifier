"use strict";

const run = require("./run");

const resetPrivileges = async (container, file) => {
    try {
        const command = `docker exec ${container} sh -c "chmod $(stat -c %a \\"${file}\\") \\"${file}\\""`;

        const { stdout, stderr } = await run(command);
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout.trim();
    }
    catch (e) {
        const error = new Error(`Cannot set chmod to ${file}`);
        error.details = e;
        throw error;
    }
};

module.exports = {
    resetPrivileges,
};

const run = require("./run");

const resetPrivileges = async (container, file) => {
    try {
        file = file.replace(/'/g, `'"'"'`); // Thanks https://stackoverflow.com/a/1250279

        const command = `docker exec ${container} sh -c 'chmod $(stat -c %a "${file}") "${file}"'`;
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

const run = require("./run");

const resetPrivileges = async (container, file) => {
    try {
        const { stdout, stderr } = await run(`docker exec ${container} chmod $(stat -c %a ${file}) ${file}`);
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

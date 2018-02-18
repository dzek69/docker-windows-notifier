const run = require("./run");

const getPrivileges = async (container, file) => {
    try {
        const { stdout, stderr } = await run(`docker exec ${container} stat -c %a ${file}`);
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout.trim();
    }
    catch (e) {
        const error = new Error(`Cannot read chmod from ${file}`);
        error.details = e;
        throw error;
    }
};

const setPrivileges = async (container, file, privileges) => {
    try {
        const { stdout, stderr } = await run(`docker exec ${container} chmod ${privileges} ${file}`);
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
    getPrivileges,
    setPrivileges,
};

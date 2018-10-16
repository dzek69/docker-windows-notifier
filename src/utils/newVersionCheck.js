const semver = require("semver");
const fetch = require("node-fetch");

const UPDATE_CHECK_URL = "https://raw.githubusercontent.com/dzek69/docker-windows-notifier/master/package.json";
const RELEASES_PAGE = "https://github.com/dzek69/docker-windows-notifier/releases";

const newVersionCheck = async (currentVersion) => {
    const data = await fetch(UPDATE_CHECK_URL).then(r => r.json());
    const newestVersion = data.version;

    if (semver.gt(newestVersion, currentVersion)) {
        return newestVersion;
    }
};

newVersionCheck.handleResult = (debug, result) => {
    if (!result) {
        if (debug) {
            console.info(`: You are running latest version.`);
        }
        return;
    }
    console.info(":");
    console.info(`: New version ${result} is available. See ${RELEASES_PAGE} for download.`);
    console.info(":");
};

newVersionCheck.handleError = (debug, error) => {
    console.error("Error: Failed to verify if update is available. Check your internet connection.");
    if (debug) {
        console.error(error);
    }
};

module.exports = newVersionCheck;
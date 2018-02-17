const validator = ({ files, containers }) => {
    const resultFiles = files.map(f => String(f));
    const resultContainers = containers.map(c => String(c));

    if (resultFiles.length !== resultContainers.length) {
        const error = new Error(
            "Invalid count of docker-compose files or containers specified."
        );
        error.safe = true;
        throw error;
    }

    return {
        files: resultFiles, containers: resultContainers,
    }
};

module.exports = validator;
const validator = ({ files, services }) => {
    const resultFiles = files.map(f => String(f));
    const resultServices = services.map(c => String(c));

    if (resultFiles.length !== resultServices.length) {
        const error = new Error(
            "Invalid count of docker-compose files or containers specified."
        );
        error.safe = true;
        throw error;
    }

    return {
        files: resultFiles, services: resultServices,
    }
};

module.exports = validator;
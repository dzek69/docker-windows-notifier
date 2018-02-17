const normalizer = ({ files, services }) => {
    return files.map((file, key) => {
        return {
            file: file === "*" ? "docker-compose.yml" : file,
            services: services[key].split(","),
        }
    });
};

module.exports = normalizer;
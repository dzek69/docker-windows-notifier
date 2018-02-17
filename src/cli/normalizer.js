const normalizer = ({ files, containers }) => {
    return files.map((file, key) => {
        return {
            file: file === "*" ? "docker-compose.yml" : file,
            containers: containers[key].split(","),
        }
    });
};

module.exports = normalizer;
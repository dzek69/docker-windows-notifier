const fs = require("fs-extra");
const { parse } = require("yamljs");
const normalizePath = require("../utils/normalizePath");

const getServices = (available, wanted, file) => {
    if (wanted[0] === "*") {
        return available;
    }

    let lastChecked = null;
    const isAvailable = w => {
        lastChecked = w;
        return available.includes(w);
    };

    if (!wanted.every(isAvailable)) {
        const error = new Error(`"${lastChecked}" service isn't available in "${file}"`);
        error.safe = true;
        throw error;
    }
    return wanted;
};

const loader = list => {
    return Promise.all(list.map(async ({ file, containers }) => {
        const yml = await fs.readFile(file);
        const compose = parse(String(yml));
        const availableServices = Object.entries(compose.services)
            .map(([serviceKey, serviceData]) => {
                if (!serviceData.container_name) {
                    const error = new Error(`"container_name" is required to be specified in ${file}: ${serviceKey}`);
                    error.safe = true;
                    throw error;
                }
                return {
                    key: serviceKey,
                    name: serviceData.container_name,
                };
            });
        const availableNames = availableServices.map(s => s.name);
        const servicesNamesList = getServices(availableNames, containers, file);
        const servicesList = servicesNamesList.map((name) => {
            return availableServices.find(s => s.name === name);
        });

        const services = servicesList.map(({ key, name }) => {
            const volumesList = compose.services[key].volumes || [];
            const volumes = volumesList.map((volume) => {
                const [source, target] = volume.split(":");
                const sourcePath = normalizePath(source);
                const targetPath = normalizePath(target);
                return {
                    source: sourcePath,
                    target: targetPath,
                }
            });
            return {
                name, volumes,
            }
        });

        return {
            file: file,
            services: services,
        }
    }))
};

module.exports = loader;
"use strict";

const { parse } = require("yamljs");
const normalizePath = require("../utils/normalizePath");
const run = require("../utils/run");

const getServices = (available, wanted, file) => {
    if (wanted[0] === "*") {
        return available;
    }

    let lastChecked;

    const isAvailable = w => {
        lastChecked = w;
        return available.includes(w);
    };

    if (!wanted.every(isAvailable)) {
        const error = new Error(
            `"${lastChecked}" service isn't available in "${file}", did you mixed service key with container_name?`,
        );
        error.safe = true;
        throw error;
    }
    return wanted;
};

const getSourceType = (source, definedType) => {
    if (definedType && definedType !== "bind") {
        return definedType;
    }
    if (!source.includes("/") && !source.includes("\\")) {
        return "volume";
    }
    return "bind";
};

const AMBIGUOUS_VOLUME_PATH = { __: "AVP" }; // it's just for reference check anyway

const parseVolume = volume => {
    if (typeof volume === "string") {
        return parseVolume.string(volume);
    }
    return parseVolume.object(volume);
};
parseVolume.string = (volume) => {
    const MAX_PARSEABLE_PARTS = 4;
    const parts = volume.split(":");
    if (parts.length > MAX_PARSEABLE_PARTS) {
        return {
            type: AMBIGUOUS_VOLUME_PATH,
            target: parts[parts.length - 2], // eslint-disable-line no-magic-numbers
        };
    }
    parts.pop(); // mode, not needed
    const target = parts.pop();
    const source = parts.join(":");
    if (!target) {
        return { source: null, target: source, type: "volume" };
    }
    const type = getSourceType(source);
    return { source, target, type };
};
parseVolume.object = (volume) => {
    const { source, target } = volume;
    const type = getSourceType(source, volume.type);
    return { source, target, type };
};

const COMPOSE_SUPPORTED_VERSION = 3;

// @TODO split the function
const loader = list => { // eslint-disable-line max-lines-per-function
    return Promise.all(list.map(async ({ file, services }) => { // eslint-disable-line max-lines-per-function
        const { stdout: yml } = await run.file("docker-compose", [
            "-f",
            file,
            "config",
        ]);

        const compose = parse(String(yml));
        if (Math.floor(Number(compose.version)) !== COMPOSE_SUPPORTED_VERSION) {
            const error = new Error(
                `Only version 3 of docker compose files are supported, unsupported version in file: ${file}`,
            );
            error.safe = true;
            throw error;
        }
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
        const servicesNamesList = getServices(availableNames, services, file);
        const servicesList = servicesNamesList.map((name) => {
            return availableServices.find(s => s.name === name);
        });

        const servicesResult = servicesList.map(({ key, name }) => {
            const volumesList = compose.services[key].volumes || [];
            const volumes = volumesList.map((volume) => {
                const { source, target, type } = parseVolume(volume);
                if (type !== "bind") {
                    console.info(`- Skipping ${target} from ${key} service of ${file} as it's not bind volume`);
                    return;
                }
                if (type === AMBIGUOUS_VOLUME_PATH) {
                    console.info(
                        `- Skipping ${target} from ${key} service of ${file} as it cannot be parsed from string. `
                        + `Too much colons. Please use long volume format.`,
                    );
                    return;
                }
                const sourcePath = normalizePath(source);
                const targetPath = normalizePath(target);
                return {
                    source: sourcePath,
                    target: targetPath,
                };
            }).filter(Boolean);
            return {
                name, volumes,
            };
        });

        return {
            file: file,
            services: servicesResult,
        };
    }));
};

module.exports = loader;

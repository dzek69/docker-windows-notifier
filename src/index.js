const fs = require("fs-extra");
const { parse }= require("yamljs");
const chokidar = require("chokidar");

const dropCommonPrefix = require("./utils/dropCommonPrefix");
const normalizePath = require("./utils/normalizePath");
const join = require("./utils/unixJoin");

const { getPrivileges, setPrivileges } = require("./utils/docker");

const COMPOSE_PATH = "./docker-compose.yml";
const SERVICE = "web";
const CONTAINER_NAME = "web1";

(async function main() {
    try {
        const yml = await fs.readFile(COMPOSE_PATH);
        const compose = parse(String(yml));
        const volumes = compose.services[SERVICE].volumes;
        const vol = volumes[0];
        const [source, target] = vol.split(":");
        console.log(`Using "${source}" path from "${SERVICE}" service defined in "${COMPOSE_PATH}" as watch root that will cause updates in "${target}"`);

        const sourcePath = normalizePath(source);
        const targetPath = normalizePath(target);

        const onReady = () => {
            console.log(`Ready to catch updates`);
        };

        const onEvent = async (event, path) => {
            console.log(`File ${path} got ${event} event`);

            const changedPath = normalizePath(path);
            const targetUpdatePath = dropCommonPrefix(changedPath, sourcePath);

            const target = join(targetPath, targetUpdatePath);

            try {
                const privileges = await getPrivileges(CONTAINER_NAME, target);
                await setPrivileges(CONTAINER_NAME, target, privileges);
                console.log(`Refreshed ${path}`);
            }
            catch (e) {
                console.error(`Can not force reload ${path}: ${e.stack}`);
            }
        };

        chokidar
            .watch(source, { ignoreInitial: true })
            .on('ready', onReady)
            .on('all', onEvent)
        ;
    }
    catch (e) {
        console.error("Couldn't run docker windows notifier server", e);
        process.exit(1);
    }
})();
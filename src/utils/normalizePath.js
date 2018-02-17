class Normalizer {
    constructor(path) {
        this.path = path;
    }

    get() {
        return this.path;
    }

    windowsToUnix() {
        this.path = this.path.replace(/\\/g, "/");
        return this;
    }

    clearDots() {
        const absolute = this.path.substr(0, 1) === "/" ? "/" : "";
        this.path = absolute + this.path.split("/").filter(Boolean).filter(p => p !== ".").join("/");     return this;
    }
}

const normalize = (path) => {
    const normalizer = new Normalizer(path);
    return normalizer.windowsToUnix().clearDots().get();
};

// @todo stuff for future unit tests
// const paths = [
//     "../test/qwert",
//     "./test",
//     "ignor",
//     "/master/of/disaster",
//     "..\\elo",
//     ".\\.\\..\\elo",
//     "../././eeelo",
// ];
//
// paths.forEach((path) => {
//     console.log(`${path} ---> ${normalize(path)}`);
// });

module.exports = normalize;
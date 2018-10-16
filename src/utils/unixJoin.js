"use strict";

const trimSlashes = s => s.replace(/^\/+|\/+$/g, "");
const trimEndSlashes = s => s.replace(/\/+$/g, "");
const singlifySlashes = s => s.replace(/\/{2,}/g, "/");

const join = (...args) => {
    let first;

    first = true;
    return args.map(arg => {
        if (!first) {
            return singlifySlashes(trimSlashes(arg));
        }
        first = false;
        return singlifySlashes(trimEndSlashes(arg));
    }).join("/");
};

// @todo use in future unit tests
// const paths = [
//     ["/app", "test.file"],
//     ["app", "test.file"],
//     ["///app", "///test.file///"],
//     ["///app///", "test.file///"],
//     ["app/", "/test/file/path.file/"]
// ];
//
// paths.forEach(path => {
//     console.log(`${path} --> ${join(...path)}`)
// });

module.exports = join;

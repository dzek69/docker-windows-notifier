"use strict";

const ensureError = e => {
    if (e instanceof Error) {
        return e;
    }
    return new Error(e);
};

module.exports = ensureError;

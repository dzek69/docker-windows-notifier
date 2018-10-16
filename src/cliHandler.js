"use strict";

const parser = require("./cli/parser");
const validator = require("./cli/validator");
const normalizer = require("./cli/normalizer");
const loader = require("./cli/loader");

const handler = async (appVersion) => {
    const parsed = parser(appVersion);
    const validated = validator(parsed);
    const normalized = normalizer(validated);
    const loaded = await loader(normalized);

    return {
        verbose: parsed.debug,
        files: loaded,
        disableUpdateCheck: parsed.disableUpdateCheck,
    };
};

module.exports = handler;

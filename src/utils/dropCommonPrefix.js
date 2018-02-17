const common = require("common-prefix");

const dropPrefix = (target, another) => {
    const prefix = common([target, another]);
    return target.substr(prefix.length);
};

module.exports = dropPrefix;
const noop = () => {};
setInterval(noop, 123456789); // to keep process living

console.log(Date.now(), "I am a script from `web / web1` container. Edit `test/test.js` (or anything in `test` directory) to see reload in action.");
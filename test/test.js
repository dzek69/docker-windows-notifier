const fn = () => {
    console.log("Edit test/test.js to see reload in action.", Date.now())
};

setInterval(fn, 1000);
fn();
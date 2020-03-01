const searchtendersUrl = 'https://ted.europa.eu/TED/search/expertSearch.do';

const browserOptions = {
    headless: false,
    slowMo: 250, // slow down by 250ms
    // devtools: true,
}

let keyboardOptions = {}

if (browserOptions.slowMo) {
    keyboardOptions.delay = 0;
}

exports.searchtendersUrl = searchtendersUrl;
exports.browserOptions   = browserOptions;
exports.keyboardOptions  = keyboardOptions;

var links = require('all-the-links');
var fs = require('fs');

var processedLinks = {};

html.pipe(links()).pipe(process.stdout);

var Crawler = require('./crawler');
var fs = require('fs');
var parse = require('csv');
var os = require('os');

var pages = [

];

var outputfolder = 'out/';
var writers = {};

var crawlPages = function crawlPages(pages) {
    var crawl = function crawl() {
        new Crawler({
            'verbose': false,
            'url': pages.shift(),
            'maxDepth': 9999
        }, (crawler) => {
            // console.log(crawler.queue);
            // crawler.queue.getWithStatus('failed', () => {
            //     console.log(arguments, "failed");
            // });
            // crawler.queue.getWithStatus('failed', () => {
            //     console.log(arguments);
            // });
            crawler.queue.forEach(function(queueItem) {
                writeCsv(queueItem);
                // var fileoutput = Object.keys(queueItem).map((k) => {
                //     if (k === 'stateData') {
                //         //console.log(Object.keys(queueItem[k]));
                //         return Object.keys(queueItem[k]).map((stateDataEntry) => {
                //             return queueItem[k][stateDataEntry];
                //         }).join(',');
                //     }
                //     return queueItem[k];
                // }).join(',');
                // writers[queueItem.stateData.code].write(fileoutput + os.EOL);
                // writers.all.write(fileoutput + os.EOL);
            });

            if (pages.length > 0) {
                crawlPages(pages);
            }
        });
    };
    crawl();
};
writeCsv = function writeCsv(queueItem) {
    var level1Fields = [
        'url',
        'protocol',
        'host',
        'port',
        'path',
        'depth',
        'fetched',
        'status',
    ];
    var level2Fields = [
        'requestLatency',
        'requestTime',
        'contentLength',
        'contentType',
        'code',
        'headers'
    ];
    //write header to new file
    if (!writers[queueItem.stateData.code]) {
        writers[queueItem.stateData.code] = fs.createWriteStream(outputfolder + queueItem.stateData.code + '.csv');
        writers[queueItem.stateData.code].write(level1Fields.join(',') + ',' + level2Fields.join(',') + os.EOL);
    };
    if (!writers.all) {
        writers.all = fs.createWriteStream(outputfolder + 'all.csv');
        writers.all.write(level1Fields.join(',') + ',' + level2Fields.join(',') + os.EOL);
    }
    var out = '';
    level1Fields.forEach((currentValue, index, array) => {
        out += (queueItem[currentValue] || '') + ',';
    });
    if (!!queueItem.stateData) {
        level2Fields.forEach((currentValue, index, array) => {
            if (typeof queueItem.stateData[currentValue] === 'string') {
                out += (queueItem.stateData[currentValue] || '') + ',';
            } else {
                try {
                    out += JSON.stringify(queueItem.stateData[currentValue]) || '';
                }
                catch (e) {}
                out += ',';
            }
        });
    } else {
        level2Fields.forEach((currentValue, index, array) => {
            out += ',';
        });
    }
    writers.all.write(out + os.EOL);
    writers[queueItem.stateData.code].write(out + os.EOL);
};
crawlPages(pages);


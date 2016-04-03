var Crawler = require('simplecrawler');

var cupocrawler = function cupocrawler(config, completeCallback) {
    this.config = {};
    this.config.url = config.url || 'www.blogdechollos.com';
    this.crawler = new Crawler(this.config.url);
    this.crawler.maxDepth = config.maxDepth || 1;
    this.crawler.maxConcurrency = config.maxConcurrency || 2;
    this.config.verbose = !!config.verbose;
    this.config.writers = config.writers || {};
    console.log('start crawling:', this.config.url);
    var self = this;
    log = function logonVerbosemode() {
        if (self.config.verbose) {
            console.log(arguments);
        }
    };
    this.crawler.on('complete', () => {
        log('completed: ', this.config.url);
        completeCallback(this.crawler);
    });
    this.crawler.on('fetchheaders', (queueItem, res) => {
        log('crawling url :', queueItem.url);
    });

    this.crawler.start();
};
module.exports = cupocrawler;

// //var writers = {};
// // var outputfolder = 'out/';
// // var crawler = new Crawler('www.blogdechollos.com');

// // crawler.maxDepth = 1;
// // crawler.maxConcurrency = 1;

        // console.log(queueItem.url);
        // if (!writers[res.statusCode]) {
        //     writers[res.statusCode] = fs.createWriteStream(outputfolder + res.statusCode);
        // }
        // writers[res.statusCode].write(queueItem.url + ','  + res.statusCode + os.EOL);

// crawler.on('fetchheaders', function(queueItem, res) {
//     //console.log(queueItem.url);
//     if (!writers[res.statusCode]) {
//         writers[res.statusCode] = fs.createWriteStream(outputfolder + res.statusCode);
//     }
//     writers[res.statusCode].write(queueItem.url + ','  + res.statusCode + os.EOL);
// });

// var parser = parse.parse({delimiter: ','}, function name(err, data) {
//     data.splice(0, 1);
//     data.forEach(function crawlerAdd(data) {
//         crawler.queueURL(data[0]);
//     });
//     crawler.start();
// });

// crawler.on('complete', function() {
//     console.log(crawler.queue.errors());
//     crawler.queue.getWithStatus('failed', function(failedItems) {
//         if (!!failedItems) {
//             failedItems.forEach(function(queueItem) {
//                 console.log('Whoah, the request for %s failed!', queueItem.url);
//             });
//         }
//     });
//     crawler.queue.getWithStatus('notfound', function itemsNotfound(items) {
//         console.log(items);
//         // items.forEach(function eachNotFoundItem(item) {
//         //     console.log('Whoah, the request for %s failed!', item.url);
//         // });
//     });

//     //console.log(crawler.queue);
// });

// fs.createReadStream(__dirname + '/data/urls.csv').pipe(parser);
//
//


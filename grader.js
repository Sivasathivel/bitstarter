#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";


//SAKTHI1
var DOWNLOAD_DEFAULT = "downloaded.html";
var sys = require('util');
var http = require('http');
var https = require('https');
var url = require('url');
var qs = require('querystring');
//var multipart = require('./multipartform');
var zlib = null;
var Iconv = null;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
/*
try {
  zlib = require('zlib');
} catch (err) {}

try {
  Iconv = require('iconv').Iconv;
} catch (err) {}
*/
var file_download = function(file_URL) {
    console.log(file_URL + "\n");
    var fName = url.parse(file_URL).pathname.split('/').pop();
    console.log(fName + "\n");
    fName = fName || DOWNLOAD_DEFAULT;
    console.log(fName + "\n");
    var file  = fs.createWriteStream(fName);
    var curl_cmd = spawn('curl',[file_URL]);
    curl_cmd.stdout.on('data',function(data) { file.write(data);});
    curl_cmd.stdout.on('end',function(data) {
	file.end();
	console.log(fName + "has been downloaded");
	});
    curl_cmd.on('exit', function(code) {
	if(code != 0) {
	    console.log('Failed: ' + code);
	    }
	});
    return fName;
}


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url <url_file>', 'URL to index.html',DOWNLOAD_DEFAULT)
        .parse(process.argv);
    
    if(!program.file) {
	console.log(program.url);
	var checkJson = checkHtmlFile(file_download(program.url), program.checks);
	} else {
	    var checkJson = checkHtmlFile(program.file, program.checks);
	    }
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}

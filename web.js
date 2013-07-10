var fs = require('fs');
var express = require('express');
var data = fs.readFileSync("index.html","utf8");
var app = express.createServer(express.logger());
console.log(data);
app.get('/', function(request, response) {
  response.send(data);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


/*/ Modified by Sivasathivel K on 10 Jul 2013

var fs = require('fs');
var express = require('express');

var data = fs.readFileSync("index.html","utf8");
var app = express.createrServer(express.logger());
app.get('/', function(request, response) {
    response.send(data);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Linstening on Port:" + port);
});
*/


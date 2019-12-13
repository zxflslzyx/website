var express = require("express");
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, "./public"))).listen(80);



console.log('listen ok test test');
console.log('listen ok test test');
console.log('listen ok test test');




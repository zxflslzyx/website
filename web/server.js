var express = require("express");
var app = express();
var path = require('path');


console.log('listen ok test test');


app.use(express.static(path.join(__dirname, "./public"))).listen(80);

app.get('/404', function (req, res) {
    res.send('test')
  })






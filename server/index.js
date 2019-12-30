var express = require("express");
var app = express();
var path = require("path");

console.log("listen ok test test");

app.use(express.static(path.join(__dirname, "../web/public"))).listen(80);



app.get("/ejs", function(req, res) {
  res.send("<h1>WTF u r talkin' boutf<h1>");
});

app.get("*", function(req, res) {
  res.send("WTF u r talkin' bout??");
});

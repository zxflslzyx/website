var express = require("express");
var app = express();
var path = require("path");
var ejs = require("ejs");
const fs = require("fs");

console.log("listen ok test test");

app.get("/home", function(req, res) {
  fs.readdir(path.join(__dirname, "../web/public"), function(err, data) {
    if (err) {
      res.send("<h1>getDir error</h1>");
    } else {
      //  只取出 文件夹
      data = data.filter(item => {
        return !/\..*$/.test(item);
      });

      let linkArr = [];
      data = data.map(item => {
        let obj = {};
        let jsonData = fs.readFileSync(path.join(__dirname, `../web/public/${item}/page.json`), "utf-8");
        obj.name = JSON.parse(jsonData).name;
        obj.url = `/${item}`;
        linkArr.push(obj);
      });

      console.log(JSON.stringify(linkArr));

      // 创建用于渲染的数据
      let ejsData = {
        data: linkArr
      };
      // 将数据在浏览器进行展现
      res.render(path.join(__dirname, "./views/index/index.ejs"), ejsData);
    }
  });
});

app.use(express.static(path.join(__dirname, "../web/public"))).listen(80);

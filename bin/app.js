var http = require("http");
var spawn = require("child_process").spawn;

function run_cmd(cmd, args, callback) {
  var child = spawn(cmd, args);
  var resp = "";

  child.stdout.on("data", function (buffer) {
    resp += buffer.toString();
  });
  child.stdout.on("end", function () {
    callback(resp);
  });

  child.stdout.on("error", (err) => {
    console.error("启动子进程失败");
  });
}

run_cmd("sh", ["./setup.sh"], function (text) {
  console.log(text + "xixi");
});

console.log("exec ./bin/app.js...");

// const { spawn } = require('child_process');
// const subprocess = spawn('错误的命令');

// subprocess.on('error', (err) => {
//   console.error('启动子进程失败');
// });

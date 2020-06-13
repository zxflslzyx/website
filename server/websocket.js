const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);


// io.emit("some event", { for: "everyone" });

// io.on("connection", (socket) => {
//   console.log("hhello");
//   socket.on("sendMsg", (msg) => {
//     console.log("[log]===> receive msg:", msg);
//     io.emit("sendMsg", msg);
//   });
// });

let signList = ["1587376316756","admin"];

io.on("connection", (socket) => {
  let onlineNum = io.eio.clientsCount;

  io.emit("showOnlineNum", { num: onlineNum });

  signList.forEach((item) => {
    let eventName = `sendMsg_${item}`;

    socket.on(eventName, (msg) => {
      console.log(`[log]===> receive ${eventName} msg:`, msg);
      io.emit(eventName, msg);
    });
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

console.log("listening on *:3000");

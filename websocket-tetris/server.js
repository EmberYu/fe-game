var ws = require("nodejs-websocket");

const PORT = 8888;

var clientCount = 0;

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection");
    clientCount++;
    conn.nikename = `user${clientCount}`;
    var mes = {};
    mes.type = "enter",
    mes.data = conn.nikename + ' comes in';
    broadcast(JSON.stringify(mes));
    conn.on("text", function (str) {
        console.log("Received " + str);
        var mes = {};
        mes.type = `message`;
        mes.data = str;
        broadcast(JSON.stringify(mes));
        conn.sendText(str.toUpperCase() + "!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed");
        var mes = {};
        mes.type = `leave`;
        mes.data = `${conn.nikename} left`;
        broadcast(JSON.stringify(mes));
    })
    conn.on("error", function (err) {
        console.log("handle err");
        console.log(err);
    })
}).listen(PORT);

console.log(`listening on port ${PORT}, press ctrl + c to exit`);

function broadcast(str) {
    server.connections.forEach(function(connection) {
        connection.sendText(str);
    })
}
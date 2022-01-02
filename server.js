const fs = require("fs");
const http = require("http");
/*
 * HTTP SERVER
 */
const videoPath = process.env.VIDEO_PATH;
if ((!videoPath) && (process.env.HOST_VIDEO != "no")) {
    console.error("NO VIDEO PATH ENVIROMENT VARIABLE");
    process.exit(-1);
}
let server = http.createServer((req, res) => {
    // CLIENT HTML
    if (req.url == "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        let rs = fs.createReadStream("client.html");
        rs.on("data", d => res.write(d));
        rs.on("end", _ => {
            res.end();
            res.socket.end();
        });
    }
    // MASTER HTML
    if (req.url == "/master") {
        res.writeHead(200, { "Content-Type": "text/html" });
        let rs = fs.createReadStream("master.html");
        rs.on("data", d => res.write(d));
        rs.on("end", _ => {
            res.end();
            res.socket.end();
        });
    }
    // FULL VIDEO MP4
    if (req.url == "/video" && process.env.HOST_VIDEO == "yes") {
        let range = req.headers.range;
        if (!range) {
            res.sendStatus(416);
            res.end();
            return;
        }
        let stats = fs.statSync(videoPath);
        let positions = range.replace(/bytes=/, "").split("-");
        let start = parseInt(positions[0], 10);
        let total = stats.size;
        let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        let chunksize = (end - start) + 1;
        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });
        let stream = fs.createReadStream(videoPath, { start: start, end: end })
        stream.pipe(res);
    }
});
server.listen(8080);
/*
 * WEBSOCKET SERVER
 */
const ws = require("ws");
let clients = {};

function createId() {
    let ret = "";
    for (let i = 0; i < 20; i++) {
        ret += String(Math.round(Math.random() * 10))[0];
    }
    return ret;
}
let wss = new ws.Server({
    port: 3000
});
wss.on("connection", (sock, req) => {
    sock.master = (req.url == "/master");
    let id = createId();
    while (clients[id]) {
        id = createId();
    }
    sock.id = id;
    sock.on("message", msg => {
        msg = msg.toString();
        if (sock.master) {
            console.log(`Broadcasting message from master with id ${sock.id}: ${msg}`);
            for (clientID in clients) {
                if (!clients[clientID].master) {
                    clients[clientID].send(msg);
                }
            }
        }
    });
    sock.on("close", _ => {
        console.log(`Disconnected ${sock.master?"master":"client"} with id ${sock.id}.`);
        sock.close();
        delete clients[sock.id];
    });
    console.log(`Connected ${sock.master?"master":"client"} with id ${sock.id}.`);
    clients[sock.id] = sock;
});
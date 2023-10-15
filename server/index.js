const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const http = new (require("http").Server)(app);
const { Server } = require("socket.io");
const { Client } = require("ssh2");
const io = new Server(http, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

http.listen(port, () => {
  console.log("listening on port " + port);
});

app.get("/", (_req, res) => {
  res.send("Hello world!");
});

let cmd = "";
let shellStream = null;
io.on("connection", (socket) => {
  console.log("user connected. Id: " + socket.id);
  socket.on("exec-client2ser", (data) => {
    cmd = data.trim();
    shellStream.write(`${data}\n`);
  });

  socket.on("disconnect", () =>
    console.log("user disconnected. Id: " + socket.id),
  );
});

/**
 * Description
 * @param {Client} connection
 * @param {Error | undefined} err
 * @param {import('ssh2').ClientChannel} stream
 * @param {Server} socket
 * @returns {void}
 */
const sshCallback = (connection, err, stream, socket) => {
  if (err) {
    throw err;
  }

  stream
    .on("data", (data) => {
      data = data.trim();
      const skip = ["\r\n", "\u001b[?2004l\r", "\u001b[?2004h", cmd].includes(
        data,
      );
      if (socket && !skip) {
        data = data.replace(`${cmd}\r\n`, "");
        socket.emit("exec-ser2client", data);
      }
    })
    .on("close", (code, signal) => {
      connection.end();
    });
};

app.post("/connect", (req, res) => {
  console.log(req.body);
  const ipAddress = req.body.ipAddress;
  const user = req.body.user;
  const password = req.body.password;

  // Setting up connection to remote server.
  try {
    const sshConnection = new Client();
    sshConnection
      .on("ready", () => {
        console.log("Client :: ready");
        sshConnection.shell((err, stream) => {
          stream.setEncoding("utf8");
          shellStream = stream;
          sshCallback(sshConnection, err, shellStream, io);
        });
        res.send(true);
      })
      .connect({
        host: ipAddress,
        port: 22,
        username: user,
        password: password,
        debug: console.log,
      });
  } catch (err) {
    res.send(false);
  }
});

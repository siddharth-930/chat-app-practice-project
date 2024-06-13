const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cors = require("cors");
const { log } = require("console");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const secretKeyJwt = "jfkldfhdhsl";

const port = 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("hello workd");
});

// app.get("/login", (req, res) => {
//   const token = jwt.sign({ _id: "fsdfsesef" }, secretKeyJwt);
//   res
//     .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
//     .json({
//       message: "login success",
//     });
// });

// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;

//     if (!token) return next(new Error("Authentication Error"));

//     const decoded = jwt.verify(token, secretKeyJwt);  
//     next();
//   });
// });

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  //  console.log("Id",socket.id);
  //  socket.emit("welcome", `Welcome to the server`);

  // when we have to broadcast the message but for exampla certain user oined so the below code will show the message that his user joined except this user
  //  socket.broadcast.emit("welcome", `${socket.id}joined the server,`);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    io.to(room).emit("receive-message", message);
  });

  // socket.on("join-room", (room) => {
  //   socket.json(room);
  //   console.log(`user has joined room: ${room}`);
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server is running on ${port}`);
});

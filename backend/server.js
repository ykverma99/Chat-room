import express from "express";
import { createServer } from "http";
import {Server} from 'socket.io'
import * as path from 'path'

const app = express();
const http = createServer(app);
const io = new Server(http)


app.use(express.static('frontend'));
let users = {}

io.on("connection",socket=>{
    socket.on("user-add",name=>{
        users[socket.id] = name
        socket.broadcast.emit("user",name)
    })

    socket.on("msg:post",(msg)=>{
        socket.broadcast.emit("msg",{message:msg,name:users[socket.id]})
    })

    // socket.on("disconnect",(name)=>{
    //     console.log(name);
    //     socket.broadcast.emit("left",users[socket.id])
    //     delete users[socket.id]
    // })
})


http.listen(8080, () => {
  console.log("Server is running");
});

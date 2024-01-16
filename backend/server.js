import express from "express";
import { createServer } from "http";
import {Server} from 'socket.io'
import * as path from 'path'
import { fileURLToPath } from "url";

const app = express();
const http = createServer(app);
const io = new Server(http)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const staticPath = path.join(__dirname,'../frontend')


app.use(express.static(staticPath));
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

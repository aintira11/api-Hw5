import http from "http";
import { app } from "./app";

const port = process.env.port || 3000;  //ได้เลขพอต 3000
const server = http.createServer(app);     //ได้ออฟเจ้กของเซปเว่อ //ใส่ (app) รู้จักกันแล้ว

server.listen(port, () => {    //เปิดพอต แล้วทำ ....ต่อ
    console.log("Server is started");
});
import express from "express";
import {router as movie} from "./api/movie";
import {router as upload} from "./api/upload";
import {router as person} from "./api/person";
import {router as star} from "./api/star";
import {router as creator} from "./api/creator";
import bodyParser from "body-parser";
export const app = express();  //export เพื่อเอาไปใช้ที่อื่นได้
import cors from "cors";


app.use(
    cors({
        //อนุญาติให้ เว็บนี้ไปเรียกเท่านั้น
      origin: "*",
    })
  );
  

app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/get",movie);  
app.use("/search",movie);
app.use("/insert",movie);
app.use("/delete",movie);

app.use("/getperson",person); 
app.use("/add",person); 
app.use("/deletePerson",person); 

app.use("/addStar_M",star); 
app.use("/deleteStar_M",star); 

app.use("/add_Creator_M",creator); 
app.use("/delete_Creator_M",creator); 

app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));

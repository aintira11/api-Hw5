import express from "express";
import path from "path";
import multer from "multer";

export const router = express.Router();

// class FileMiddleware {
//     //attibute filename
//     filename = "";
//     //attibute diskLoader
//     //Create object of diskLoader for saving file
//     public readonly diskLoader = multer({
//         //
//       storage: multer.diskStorage({
//         //จะเซปลงที่โฟลเด้อไหน
//         destination: (_req, _file, cb) => {
//           cb(null, path.join(__dirname, "../uploads")); //save ลง โฟลเด้อนี้ uploads
//         },
//         // filename = random unique name
//         filename: (req, file, cb) => {
//           const uniqueSuffix =
//             Date.now() + "-" + Math.round(Math.random() * 10000);
//           this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
//           cb(null, this.filename);
//         },
//       }),
//       //upload ได้ไม่เกิน 64 MByte
//       limits: {
//         fileSize: 67108864, // 64 MByte
//       },
//     });
//   }

// //POSt /upload
// const fileUpload = new FileMiddleware();
// router.post("/", fileUpload.diskLoader.single("file"), (req, res)=>{
//     res.json({ filename: "/uploads/" + fileUpload.filename });
// });

//Get /upload
router.get("/",(req,res)=>{
    res.send('Method GET in upload.ts');
});

//1.connext
import {initializeApp} from "firebase/app";
import { getStorage, ref,uploadBytesResumable,getDownloadURL} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC6nSAsn5Gue4SPqjVBSYU0wyhUb1Qwm4M",
    authDomain: "tripbooking-app-9eb55.firebaseapp.com",
    projectId: "tripbooking-app-9eb55",
    storageBucket: "tripbooking-app-9eb55.appspot.com",
    messagingSenderId: "577460082363",
    appId: "1:577460082363:web:89c47090d2be1b725a3b9e",
    measurementId: "G-V4F8NS3JFK"
  };
  initializeApp(firebaseConfig);
  const storage = getStorage();


class FileMiddleware {
    //attibute filename
    filename = "";
    //attibute diskLoader
    //Create object of diskLoader for saving file
    public readonly diskLoader = multer({
        //
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 67108864, // 64 MByte
      },
    });
  }

//POSt /upload
const fileUpload = new FileMiddleware();
router.post("/", fileUpload.diskLoader.single("file"), async(req, res)=>{
    //2. upload file to firebase Storage
    const filename = Date.now() + "-" + Math.round(Math.random()*1000)+".png";
    //dafine saving filename on firebase Storage
    const storageRef = ref(storage,"/images/" + filename);
    //define flie datail
    const metadata ={
        contentType : req.file!.mimetype
    }
    //upload to firebase storage
    const snapshot =await uploadBytesResumable(storageRef,req.file!.buffer,metadata);
   
    // 
    const url =await getDownloadURL(snapshot.ref);
    res.status(200).json({
        file : "http://localhost:3000/uploads" + fileUpload.filename
    });
});
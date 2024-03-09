import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";

export const router =express.Router();  //เอาไปใช้ข้างนอกด้วยเลย export

router.get("/allpe",(req, res)=>{
       const sql = "select * from Persons1";
       conn.query(sql, (err, result)=>{ 
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    })
    
});
  
    //เพิ่ม ข้อมูล คน
  router.post("/person",(req, res)=>{
    const person = req.body;
        let sql =
        "INSERT INTO `Persons1`(`name`, `birthdate`, `photo`) VALUES (?,?,?)";
        sql = mysql.format(sql,[
            person.name,
            person.birthdate,
            person.photo,
           
        ])
        conn.query(sql, (err, result) => {
            if (err) throw err;
            //return data
            res.status(201)
              .json({ affected_row: result.affectedRows,
                 last_idx: result.insertId });
          });
 });

 // Delete 
 router.delete("/:person_id",(req,res)=>{
    const id = req.params.person_id;
    let sql = "delete from Persons1 where person_id = ?";
    conn.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        })

    });
 });

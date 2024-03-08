import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";

export const router =express.Router();  

    //เพิ่ม ข้อมูล ผู้สร้าง ในหนัง
  router.post("/addCreator",(req, res)=>{
    const creator = req.body;
        let sql =
        "INSERT INTO `Creators1`(`movie_id`, `person_id`) VALUES (?,?)";
        sql = mysql.format(sql,[
            creator.movie_id,
            creator.person_id
        ])
        conn.query(sql, (err, result) => {
            if (err) throw err;
            //return data
            res.status(201)
              .json({ affected_row: result.affectedRows,
                 last_idx: result.insertId });
          });
 });

 // Delete ข้อมูล ผู้สร้าง ของหนัง
 router.delete("/:creator_id",(req,res)=>{
    const id = req.params.creator_id;
    let sql = "delete from Creators1 where creator_id = ?";
    conn.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        })
    });
 });

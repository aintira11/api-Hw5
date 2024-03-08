import express from "express";
import { conn } from "../dbconnect";
import mysql from "mysql";

export const router =express.Router();  

  
    //เพิ่ม ข้อมูล ดารา ในหนัง
  router.post("/addStar",(req, res)=>{
    const star = req.body;
        let sql =
        "INSERT INTO `Stars1`(`movie_id`, `person_id`) VALUES (?,?)";
        sql = mysql.format(sql,[
            star.movie_id,
            star.person_id
        ])
        conn.query(sql, (err, result) => {
            if (err) throw err;
            //return data
            res.status(201)
              .json({ affected_row: result.affectedRows,
                 last_idx: result.insertId });
          });
 });

 // Delete ข้อมูลดารา ของหนัง
 router.delete("/:star_id",(req,res)=>{
    const id = req.params.star_id;
    let sql = "delete from Stars1 where star_id = ?";
    conn.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        })

    });
 });

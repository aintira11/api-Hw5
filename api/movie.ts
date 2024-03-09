
import express from "express";
import { conn } from "../dbconnect";

export const router =express.Router();  //เอาไปใช้ข้างนอกด้วยเลย export

router.get("/all",(req, res)=>{
    const sql = `SELECT * FROM Movies1`;
    conn.query(sql, (err, result)=>{ 
     if(err){
         res.json(err);
     }else{
         res.json(result);
     }
 })
 
});


//ค้นหาโดยชื่อ
//JSON_OBJECT ใน MySQL ช่วยในการสร้างอ็อบเจกต์ JSON จากคอลัมน์ในตาราง โดยสามารถระบุคอลัมน์และค่าที่ต้องการให้แปลงเป็นอ็อบเจกต์ JSON ได้
// JSON_ARRAYAGG ใช้เพื่อสร้าง JSON array
//JOIN แยกกัน
router.get("/:title", (req, res) => {
    const title = req.params.title; 
    const sql = `
        SELECT 
            JSON_OBJECT(
                'movie', JSON_OBJECT(
                    'movie_id', Movies1.movie_id,
                    'title', Movies1.title,
                    'plot', Movies1.plot,
                    'year', Movies1.year,
                    'type', Movies1.type,
                    'genres',Movies1.genres,
                    'rating', Movies1.rating,
                    'runtime',Movies1.runtime,
                    'poster', Movies1.poster
                ),
                'stars', (
                    SELECT JSON_ARRAYAGG(  
                        JSON_OBJECT(
                            'person_id', Persons1.person_id,
                            'name', Persons1.name,
                            'photo', Persons1.photo,
                            'birthdate', Persons1.birthdate
                        )
                    )
                    FROM Stars1
                    LEFT JOIN Persons1 ON Stars1.person_id = Persons1.person_id
                    WHERE Stars1.movie_id = Movies1.movie_id
                ),
                'creators', (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'person_id', Persons1.person_id,
                            'name', Persons1.name,
                            'photo', Persons1.photo,
                            'birthdate', Persons1.birthdate
                        )
                    )
                    FROM Creators1
                    LEFT JOIN Persons1 ON Creators1.person_id = Persons1.person_id
                    WHERE Creators1.movie_id = Movies1.movie_id
                )
            ) AS movie_details
        FROM Movies1
        WHERE Movies1.title LIKE ?
    `;


    conn.query(sql, ["%" + title + "%"], (err, result) => {
        if (err) {
            res.json(err);
        } else {
            const movies = result.map((row: any) => JSON.parse(row.movie_details));

            res.json({ movies });
        }
    });
});


import mysql from "mysql";  
    //เพิ่ม ข้อมูล หนัง
  router.post("/movies",(req, res)=>{
    const movies = req.body;
        let sql =
        "INSERT INTO `Movies1`(`title`, `plot`, `year`, `type`, `genres`, `runtime`, `rating`, `poster`) VALUES (?,?,?,?,?,?,?,?)";
        sql = mysql.format(sql,[
            movies.title,
            movies.plot,
            movies.year,
            movies.type,
            movies.genres,
            movies.runtime,
            movies.rating,
            movies.poster,
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
 router.delete("/:movie_id",(req,res)=>{
    const id = req.params.movie_id;
    let sql = "delete from Movies1 where movie_id = ?";
    conn.query(sql,[id],(err,result)=>{
        if(err) throw err;
        res.status(200).json({
            affected_row: result.affectedRows
        })

    });
 });

 




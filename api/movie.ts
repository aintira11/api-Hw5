
import express from "express";
import { conn, queryAsync } from "../dbconnect";

export const router =express.Router();  //เอาไปใช้ข้างนอกด้วยเลย export

router.get("/",(req, res)=>{
       const sql = "select * from Movies1";
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
                'stars', JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'person_id', Persons1.person_id,
                        'name', Persons1.name,
                        'photo', Persons1.photo,
                        'birthdate', Persons1.birthdate
                    )
                ),
                'creators', JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'person_id', Persons2.person_id,
                        'name', Persons2.name,
                        'photo', Persons2.photo,
                        'birthdate', Persons2.birthdate
                    )
                )
            ) AS movie_details
        FROM Movies1
        LEFT JOIN Stars1 ON Movies1.movie_id = Stars1.movie_id
        LEFT JOIN Persons1 ON Stars1.person_id = Persons1.person_id
        LEFT JOIN Creators1 ON Movies1.movie_id = Creators1.movie_id
        LEFT JOIN Persons1 AS Persons2 ON Creators1.person_id = Persons2.person_id
        WHERE Movies1.title LIKE ?
        GROUP BY Movies1.movie_id;
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
import { Format } from "../model/models";
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

 

 //put /trip/1111
//  router.put("/:id",(req,res)=>{
//     const id = +req.params.id;
//     const trip: Format = req.body;
//     let sql =
//     "update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
//     sql = mysql.format(sql, [
//         trip.name,
//         trip.country,
//         trip.destinationid,
//         trip.coverimage,
//         trip.detail,
//         trip.price,
//         trip.duration,
//         id
//       ]);
//       conn.query(sql,(err,result)=>{
//         if (err) throw err;
//         res.status(201)
//           .json({ affected_row: result.affectedRows });
//       });
//     });

//put เหมือนเดิม แต่แบบ dynamic
 //put /trip/1111
router.put("/:id", async(req,res)=>{
    //Receive data
    const id = +req.params.id;
    const trip: Format = req.body;

    //การไปเอาอันเดิม
    //Get original data from table by id
    let sql = 'selete * from trip where idx = ?';
    sql = mysql.format(sql,[id]);
    //Quer and Wait for result
    const result = await queryAsync(sql);
    const jsonStr =JSON.stringify(result);
    const jsonObj = JSON.parse(jsonStr);
    const tripOriginal : Format =jsonObj[0];

    //Merge new daat to original
    let updateTrip = {...tripOriginal, ...trip};

    console.log(result);
    res.status(200).json({});

    sql ="update  `trip` set `name`=?, `country`=?, `destinationid`=?, `coverimage`=?, `detail`=?, `price`=?, `duration`=? where `idx`=?";
    sql = mysql.format(sql, [
      updateTrip.name,
      updateTrip.country,
      updateTrip.destinationid,
      updateTrip.coverimage,
      updateTrip.detail,
      updateTrip.price,
      updateTrip.duration,
      id,
    ]);
    
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({ affected_row: result.affectedRows });
    });
});


  
  


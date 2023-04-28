const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'movie_db'
  },
  console.log(`Connected to the movie_db database.`)
);

var addMovie = {
    movie_name: "Title of the Movie"
}

app.post('/api/add-movie', (req, res) => {
    console.info(`${req.method} request received to /api/add-movie`);
    let movie_name = req.body.movie_name;
    console.log(req.body.movie_name);
    db.query(`INSERT INTO movies (movie_name) VALUES ("${movie_name}");`, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send("database error");
        } else {
            db.query(`INSERT INTO reviews (movie_id) VALUES (${result.insertId});`, (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(400).send("database error");
                } else {
                    console.log(result);
                    res.send("Success!");
                }
            });
        }
    });
});

app.get('/api/movies', (req, res) => {
    console.info(`${req.method} request received to /api/movies`);
    db.query(`SELECT * FROM movies;`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send("database error");
        } else {
            console.log(result);
            res.json(result);
        }
    })
});


// db.query(`DELETE FROM course_names WHERE id = ?`, num, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log("affectedRows: ", result.affectedRows);
// });

// // Query database
// db.query('SELECT * FROM course_names', function (err, results) {
//   console.log(results);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

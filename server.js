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
    password: '', // add your own password here
    database: 'movie_db'
  },
  console.log(`Connected to the movie_db database.`)
);


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
                    res.send("Movie added!");
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
            console.log("Movies retrieved!");
            res.json(result);
        }
    });
});

app.delete('/api/movie/:id', (req, res) => {
    console.info(`${req.method} request received to /api/movie/:id`);
    db.query(`DELETE FROM movies WHERE id = ${req.params.id};`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send("database error");
        } else {
            console.log("Movie deleted!");
            res.json(result);
        }
    });
});

app.get('/api/movie-reviews', (req, res) => {
    console.info(`${req.method} request received to /api/movie-reviews`);
    db.query(`SELECT movies.movie_name AS Title, reviews.review AS Review, reviews.id AS ReviewID
                FROM movies JOIN reviews ON movies.id = reviews.movie_id;`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send("database error");
        } else {
            console.log("Movie reviews retrieved!");
            res.json(result);
        }
    });
});

app.put('/api/review/:id', (req, res) => {
    console.info(`${req.method} request received to /api/review/:id`);
    db.query(`UPDATE reviews
                SET review = "${req.body.review}"
                WHERE id = ${req.params.id};`, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send("database error");
        } else {
            console.log("Movie review updated!");
            res.json(result);
        }
    });
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

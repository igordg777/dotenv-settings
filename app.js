const express = require('express');
const app = express();
const dotenv = require('dotenv');
const pg = require('pg')

let envFile;
switch (process.env.NODE_ENV) {
    case 'production':
        envFile = '.env.prod';
        break;
    case 'development':
        envFile = '.env.dev';
        break;
    case 'test':
        envFile = '.env.test';
        break;
    default:
        throw new Error('NODE_ENV не определен или имеет недопустимое значение');
}

// Загружаем переменные из файла
dotenv.config({ path: envFile });

console.log(`Running in ${process.env.NODE_ENV} mode`);


const config = {
    user: process.env.DB_USER,
    database: 'ited',
    password: process.env.DB_PASS,
    port: process.env.DB_HOST
};

const pool = new pg.Pool(config);

app.get('/get-users', function (req, res) {
    let req_to_db = `SELECT * FROM users;`

    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);


        }

        client.query(req_to_db, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }

            console.log(result.rows);

            res.status(200).json({ response: result.rows })
        })
    })
})

app.get('/', function (req, res) {
    res.send('ITED code school');
})

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
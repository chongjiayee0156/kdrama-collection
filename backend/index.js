import express from "express";
import mysql from "mysql";
import path from "path";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from "cors";

const __dirname = dirname(fileURLToPath(import.meta.url));
 
const app = express();

app.listen(4000, ()=>{
    console.log('connected to backend server')
})

app.use(express.json())
app.use(cors())
app.get('/',(req,res) => {
    const p = `..\\frontend\\index.html`
    const filep = path.join(__dirname, p)
    console.log(filep);
    res.sendFile(filep);
})

const db= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'test'
})


app.get('/books',(req, res) => {
    const q = "SELECT * FROM books"
    db.query(q, (err, data)=>{
        if (err){
            return res.send(err)
        }
        return res.json(data)
    })
})

app.post('/books',(req, res) => {
    console.log("post")

    const q = "INSERT INTO books (`title`, `desc`, `price`, `cover`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
      ];

      console.log(values)
    
      db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        console.log("inserted")
        return res.json(data);
      });
    });

app.delete('/books/:id',(req, res) => {
    const q = 'DELETE FROM books WHERE id = ?'
    const val = req.params.id
    console.log(val)

    db.query(q, [val], (err)=>{
        if (err) {
        console.log(err)
        return res.send(err);}
        else{
        console.log('deleted')
        return res.json('deleted')
        }
    }) 
})

app.put('/books/:id', (req, res) => {
    const q = 'UPDATE books SET `title` = ?, `desc` = ?, `price` = ?, `cover` = ? WHERE id = ?'
    const values= [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
    ]
    const id = req.params.id

    db.query(q, [...values, id], (err, data)=>{
        if (err){
            console.log(err)
            return res.send(err)
        }else{
            console.log('updated')
            return res.json(data)
        }
    })
})

// q: whats the difference btw : app.use(express.json())
//  & res.json("data")

// 1. app.use(express.json()): = objectify server side input

// This middleware is used on the server side to parse incoming JSON requests. When included in your Express application using app.use(express.json()), it tells Express to parse the incoming request body as JSON. It transforms the raw JSON string in the request body into a JavaScript object, making it accessible via req.body in subsequent middleware or route handlers.
// Example:
// javascript
// Copy code
// const express = require('express');
// const app = express();

// app.use(express.json());

// app.post('/example', (req, res) => {
//     const data = req.body; // Parsed JSON data
//     console.log(data);
//     res.json(data);
// });
// In this example, express.json() is used as middleware to parse the incoming JSON in the request body.

// 2. res.json("data"): = stringify server side output

// This is used on the server side to send a JSON response to the client. The res.json() method in Express sends a JSON response to the client, converting the provided JavaScript object or primitive value into a JSON string.
// Example:
// javascript
// Copy code
// const express = require('express');
// const app = express();

// app.get('/example', (req, res) => {
//     const data = { message: 'Hello, world!' };
//     res.json(data); // Sends a JSON response to the client
// });
// In this example, res.json("data") sends the string "data" as a JSON response.
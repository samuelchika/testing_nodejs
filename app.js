const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const app = express();
const mongodb = require('./mongodb/mongodb.connect');


mongodb.connect();
app.use(express.json());

app.use('/todos', todoRoutes);

app.use((err, req, res, next) => { 
    res.status(500).json({message: err.message});
})
app.get("/", (req, res) => {
    res.json("Hello, World!!");
});


module.exports = app;
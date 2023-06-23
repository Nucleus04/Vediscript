const express = require('express');
const cors = require("cors");
const bodyparser = require("body-parser");
const route = require("./routes")
const connectToMongoDb = require("./models/dbConnection");
const config = require("./config");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const port = process.env.PORT || config.PORT;
let io = null;
app.use(cors());

app.use(bodyparser.urlencoded({extended : true})); 
app.use(bodyparser.json()); 

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/", route());

app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).send('Internal Server Error');
});

connectToMongoDb().then(() => {
    console.log("Successfully connected to mongodb");

    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    io = socketio(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        socket.on("unload", (data) => {
            console.log("data before unload", data);
        })
    })
}).catch((error) => {
    console.log(error);
});

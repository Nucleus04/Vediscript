const express = require('express');
const cors = require("cors");
const bodyparser = require("body-parser");
const route = require("./routes")
const connectToMongoDb = require("./models/dbConnection");
const config = require("./config");

const app = express();
const port = process.env.PORT || config.PORT;


app.use(cors());

app.use(bodyparser.urlencoded({extended : true})); 
app.use(bodyparser.json()); 

app.use("/", route());

connectToMongoDb().then(() => {
    console.log("Successfully connected to mongodb");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.log(error);
});

const express = require('express');
const cors = require("cors");
const bodyparser = require("body-parser");
const route = require("./routes")

const app = express();


app.use(cors());

app.use(bodyparser.urlencoded({extended : true})); 
app.use(bodyparser.json()); 

app.use("/", route());

const port = process.env.PORT || 5000;
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
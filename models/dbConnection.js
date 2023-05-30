const mongoose = require("mongoose");
const config = require("../config");

module.exports = async() => {
    return mongoose.connect(config.mongodb.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}


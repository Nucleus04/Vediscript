const bcrypt = require("bcrypt");
const UserModel = require("../models/User");

class UserSignup {
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async passwordHash () {
        const COST = 12;
        return bcrypt.hash(this.password, COST);
    }

    async save () {
        const hashPassword = await this.passwordHash();
        const data = {
            name: this.name,
            email: this.email,
            password: hashPassword,
        }
        const user = new UserModel(data);
        return user.save();
    }
}
module.exports = UserSignup;
const UserModel = require("../models/User");
const ProjectModel = require("../models/Project");
const ProjectController = require("./ProjectController");
const bcrypt = require("bcrypt");
const config = require("../config");
const jwt = require("jsonwebtoken");

class UserLogin {
    constructor( email, password ) {
        this.email = email;
        this.password = password;
    }

    async findUser() {
        try {
            const user = await UserModel.findOne({email: this.email});
            if(user) {
                const project = new ProjectController();
                const projectList = await project.get(user._id);
                user.projects = projectList;
                return user;
            } else {
                return false;
            }
        } catch (error) {
            console.log("Error in finding user: ", error);
        }
    }
    
    async checkPassword(password) {
        const isMatch = await bcrypt.compare(this.password, password);
        if(isMatch){
            return true;
        } else {
            return false;
        }
    }

    generateToken ( user ) {
        const key = config.authentication.secret_key;
        const token = jwt.sign({userId: user._id}, key);
        return token;
    }

}

module.exports = UserLogin;
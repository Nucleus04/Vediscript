const express = require("express");
const router = express.Router();
const LoginModel = require("../../controller/SinginController");

module.exports = () => {
    router.post("/", async(req, res) => {
        const { email, password} = req.body;
        const user = new LoginModel( email, password);
        const isUserExist = await user.findUser();
        if(!isUserExist){
            res.sendStatus(401);
        } else {
            
            const { password } = isUserExist;
            const isPasswordCorrect = await user.checkPassword(password);
          
            if(isPasswordCorrect) {
                const token = user.generateToken(isUserExist);
                console.log(token);
                const userData  = {
                    email: isUserExist.email,
                    name: isUserExist.name,
                }
                res.json({
                    token,
                    userData,
                });
            } else {
                res.sendStatus(500);
            }
        }
    });
    return router;
}
const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = () => {

    const authenticateToken = (req, res, next) => {
        const authorizationHeader = req.headers.authorization;
        if(authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];
            jwt.verify(token, config.authentication.secret_key, (err, user) => {
                if(err) {
                    res.sendStatus(403);
                }
                else{
                    next();
                }
            })
        } else {
            res.sendStatus(401);
        }

    }

    return authenticateToken;
}
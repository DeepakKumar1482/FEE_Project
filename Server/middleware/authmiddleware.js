const jwt = require('jsonwebtoken');
const authmiddleware = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        const secretKey = "DeepakKumar1482";
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: "Authentication failed"
                })
            } else {
                req.userName = decoded.id;
                next();
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
module.exports = authmiddleware;
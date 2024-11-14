const jwt = require('jsonwebtoken');
const ProfileModel = require('../schema/userProfileSchema');
// const authmiddleware = (req, res, next) => {
//     try {
//         const token = req.headers['authorization'].split(" ")[1];
//         const secretKey = "DeepakKumar1482";
//         jwt.verify(token, secretKey, (err, decoded) => {
//             if (err) {
//                 res.status(401).json({
//                     success: false,
//                     message: "Authentication failed"
//                 })
//             } else {
//                 req.userName = decoded.id;
//                 next();
//             }
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         })
//     }
// }

const authmiddleware = async(req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(" ")[1];
        if(!token){
            const error = new Error("Unauthorized access");
            error.statusCode = 400;
            throw error;
        }
    
        const decodedToken = jwt.verify(token, process.env.secretKey);
        const user = await ProfileModel.findOne({username: decodedToken.id});
    
        if(!user){
            const error = new Error("Invalid token");
            error.statusCode = 400;
            throw error;
        }
        
        req.user = user;
        req.userName = user.username;
        next();
    } catch (err) {
        const error = new Error(err?.message || "Middleware Error");
        error.statusCode = 500;
        throw error;
    }
}
module.exports = authmiddleware;
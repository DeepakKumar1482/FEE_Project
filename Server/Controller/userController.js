const { getFirestore, collection, addDoc, where, query, getDocs } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const app = getFirestore(db);
const usersRef = collection(app, "users");
const { v4: uuidv4 } = require('uuid');
const newUserController = async(req, res) => {

    try {
        const { name, username, techStack, university } = req.body;
        const docRef = await addDoc(usersRef, {
            name: name,
            username: username,
            techStack: techStack,
            studyingAt: university,
            githubid: req.body.githubName,
            imageurl: req.body.imageurl,
            savedposts: [],
            connections: []
        });

        res.status(200).send({
            success: true,
            message: "Saved",
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const IsUserExist = async(req, res) => {
    try {
        const usernameQuery = query(usersRef, where("username", "==", req.body.user));
        const usernameSnapshot = await getDocs(usernameQuery);
        const uid = uuidv4();
        if (!usernameSnapshot.empty) {
            return res.status(200).send({
                success: false,
                message: "Username already taken",
                data: 0
            });
        }
        return res.status(200).send({
            success: true,
            data: uid
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal server error",
        })
    }
}
module.exports = {
    newUserController,
    IsUserExist
};
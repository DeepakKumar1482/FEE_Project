const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const { db } = require('../Firebase/config.js');
const newUserController = async(req, res) => {
    const app = getFirestore(db);
    try {
        const docRef = await addDoc(collection(app, "users"), {
            name: req.body.name,
            username: req.body.username,
            techStack: req.body.techStack,
            studyingAt: req.body.university,
            githubid: req.body.githubName,
            imageurl: req.body.imageurl,
            savedposts: [],
            connections: []
        });
        console.log("Document written with ID: ", docRef.id);
        res.status(200).send({
            success: true,
            message: "Data sent successfully",
        });
    } catch (e) {
        console.log(e);
    }
}
module.exports = newUserController;
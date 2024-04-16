const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const app = getFirestore(db);
const usersRef = collection(app, "users");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
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
        const secretKey = "DeepakKumar1482"
        const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' })
        res.status(200).send({
            success: true,
            message: "Saved",
            token
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
const CreatePostController = async(req, res) => {
    try {
        const username = req.userName;
        const { imageurl, description, githubRepo, tech, time, date } = req.body;
        // const {} = req.body;
        const usernameQuery = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(usernameQuery);
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const updatedSavedPosts = [...userData.savedposts, {
                imageurl,
                description,
                githubRepo,
                tech,
                timing: {
                    time,
                    date
                }
            }];
            setDoc(doc.ref, { savedposts: updatedSavedPosts }, { merge: true });
        });
        res.status(200).send({
            success: true,
            message: 'Saved'
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
    IsUserExist,
    CreatePostController
};
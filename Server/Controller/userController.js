const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const app = getFirestore(db);
const usersRef = collection(app, "users");
const postsRef = collection(app, "posts");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const LogincheckController = async(req, res) => {
    try {
        const { username, password } = req.body;
        // Check if the user exists
        const usernameQuery = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(usernameQuery);
        if (querySnapshot.empty) {
            return res.status(200).send({
                success: false,
                message: "Invalid credentials"
            });
        }

        // If the user exists, compare the provided password with the stored hash
        let userPassword;
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            userPassword = userData.password;
        });
        console.log('userPassword', userPassword);
        console.log('entered password', password);
        const ismatch = await bcrypt.compare(password, userPassword);
        if (!ismatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            });
        }

        // If the password is correct, return a success message
        const secretKey = "DeepakKumar1482"
        const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' })
        res.status(200).send({
            success: true,
            message: 'Logged in',
            token
        });

    } catch (e) {
        // If there's an error, return an internal server error message
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
        console.log(e);
    }
}
const newUserController = async(req, res) => {

    try {
        const { name, username, techStack, university, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const docRef = await addDoc(usersRef, {
            name: name,
            username: username,
            password: hashedpassword,
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
        imageurls = req.body.imageUrls;
        const { description, githubRepo, tech, currDate, currTime } = req.body;
        const usernameQuery = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(usernameQuery);
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const updatedSavedPosts = [...userData.savedposts, {
                imageurls,
                description,
                githubRepo,
                tech,
                Time: {
                    date: currDate,
                    time: currTime
                }
            }];
            setDoc(doc.ref, { savedposts: updatedSavedPosts }, { merge: true });
        });
        let name, avatar;
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            name = userData.name;
            avatar = userData.imageurl;
        })
        const post = await addDoc(postsRef, {
            post: [{
                name,
                avatar,
                username,
                imageurls,
                description,
                githubRepo,
                tech,
                Time: {
                    date: currDate,
                    time: currTime
                }
            }]
        })
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
    CreatePostController,
    LogincheckController,
    LogincheckController
};
const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const app = getFirestore(db);
const usersRef = collection(app, "users");
const postsRef = collection(app, "posts");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Pusher = require("pusher");

const LogincheckController = async(req, res) => {
    try {
        const { username, password } = req.body;

        // Initialize Firestore and reference to users collection
        const db = getFirestore();
        const usersRef = collection(db, 'users');

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

        const isMatch = await bcrypt.compare(password, userPassword);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            });
        }

        // If the password is correct, generate a JWT token
        const secretKey = "DeepakKumar1482"; // Replace with your actual secret key
        const token = await jwt.sign({ id: username }, secretKey, { expiresIn: '6d' });

        res.status(200).send({
            success: true,
            message: 'Logged in',
            token
        });

    } catch (e) {
        console.log("This is error ", e);
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};
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
const pusher = new Pusher({
    appId: "1848765",
    key: "abee743b1c2ab29528ad",
    secret: "611406db68cb01640e40",
    cluster: "ap2",
    useTLS: true
});

const MessageController = (req, res) => {
    try {
        const { recipient, message } = req.body;
        const sender = req.userName;

        console.log(`Received message from ${sender} to ${recipient}: ${message}`);

        if (!sender || !recipient || !message) {
            return res.status(400).send({ success: false, message: 'Invalid data' });
        }

        // Trigger Pusher event for the recipient's personal channel
        pusher.trigger(`user-${recipient}`, 'new-message', {
            sender,
            recipient,
            message,
            timestamp: new Date().toISOString()
        });

        console.log(`Message sent to Pusher channel user-${recipient}`);

        res.status(200).send({ success: true, message: 'Message sent' });
    } catch (err) {
        console.error('Error in MessageController:', err);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    newUserController,
    IsUserExist,
    CreatePostController,
    LogincheckController,
    LogincheckController,
    MessageController
};
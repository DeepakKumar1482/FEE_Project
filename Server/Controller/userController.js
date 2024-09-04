const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const app = getFirestore(db);
const usersRef = collection(app, "users");
const postsRef = collection(app, "posts");
const UserModel = require('../schema/userSchema');
const postModel = require('../schema/postSchema');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Pusher = require("pusher");
const upload = require('../middleware/multermiddleware.js');
const cloudinary = require('../cloudinary/config.js'); // Path to your Cloudinary config file
require('dotenv').config();
const secretKey = process.env.secretKey;

const LogincheckController = async(req, res) => {
    try {
        const { username, password } = req.body;

        // Initialize Firestore and reference to users collection
        // const db = getFirestore();
        // const usersRef = collection(db, 'users');

        // Check if the user exists
        // const usernameQuery = query(usersRef, where("username", "==", username));
        // const querySnapshot = await getDocs(usernameQuery);
        // if (querySnapshot.empty) {
        //     return res.status(200).send({
        //         success: false,
        //         message: "Invalid credentials"
        //     });
        // }
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "User मौजूद नहीं है |"
            });
        }
        // If the user exists, compare the provided password with the stored hash
        // let userPassword;
        // querySnapshot.forEach((doc) => {
        //     const userData = doc.data();
        //     userPassword = userData.password;
        // });
        const wrongPasswordMessages = [
            "Galat password? Lagta hai yaadash dhokha de rahi hai!",
            "Yeh toh galat hai! Dimaag thoda zor se chalao.",
            "Arre bhai, password galat dal diya, dobara koshish karo!",
            "Nahi bhai, yeh password nahi chalega. Agla chance lo!",
            "Password galat hai! Aapka dimaag chutti par toh nahi?",
            "Yeh kya bhai, password bhool gaye kya? Try karo phir se!",
            "Aree beta, galat password hai! Thoda aur dhyan se dal!",
            "Nahi nahi, yeh password nahi chalega! Retry karo.",
            "Wah! Kya andaaz hai... bas galat password daal diya!",
            "Password galat hai! Lagta hai dimaag offline hai."
        ];

        const userPassword = user.password;
        const isMatch = await bcrypt.compare(password, userPassword);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: wrongPasswordMessages[Math.floor(Math.random() * wrongPasswordMessages.length)]
            });
        }

        // If the password is correct, generate a JWT token
        // const secretKey = "DeepakKumar1482"; // Replace with your actual secret key
        const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' });

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
        const { githubName, imageurl, name, username, password, university, techStack } = req.body;

        // Check if all required fields are provided
        if (!githubName || !imageurl || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled',
            });
        }

        // Check if the username already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new UserModel({
            githubName,
            imageurl,
            name,
            username,
            password: hashedPassword,
            university,
            techStack,
        });

        await newUser.save();

        // Generate a token if needed (optional)
        const token = newUser.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
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
const uploadcontroller = async(req, res) => {
    try {
        const { githubName, name, username, password, university, techStack } = req.body;
        // Check if all required fields are provided
        if (!githubName || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled',
            });
        }

        if (!req.file) {
            return res.status(400).send('No image provided!');
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const imageurl = result.url;
        // if the username already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // password = hashedPassword
        // Create the user
        const newUser = new UserModel({
            githubid: githubName,
            name,
            username,
            password: hashedPassword,
            studyingAt: university,
            techStack,
            imageurl: imageurl
        });

        await newUser.save();

        // Generate a token if needed (optional)
        // const token = newUser.generateAuthToken();
        const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' })

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            token,
        });

        // The image has been uploaded to Cloudinary, and the URL is available in req.file.path
        // res.status(200).send({
        //         success: true,s
        //         message: 'Image uploaded successfully'
        //     })
        // res.json({ imageUrl: req.file.path });
    } catch (e) {
        console.log(e);
    }
}
module.exports = {
    newUserController,
    IsUserExist,
    CreatePostController,
    LogincheckController,
    LogincheckController,
    MessageController,
    uploadcontroller
};
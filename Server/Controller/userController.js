const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const app = getFirestore(db);
const usersRef = collection(app, "users");
const postsRef = collection(app, "posts");
const UserModel = require('../schema/userSchema');
const postModel = require('../schema/postSchema');
const UserProfileModel = require('../schema/userProfileSchema');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Pusher = require("pusher");
const upload = require('../middleware/multermiddleware.js');
const cloudinary = require('../cloudinary/config.js'); // Path to your Cloudinary config file
require('dotenv').config();
const nodemailer = require('nodemailer');
const secretKey = process.env.secretKey;

const UserRegistrationController = async (req, res) => {
    try {
        const isEmailExist = await UserModel.findOne({ email: req.body.email });
        if (isEmailExist) {
            return res.status(200).json({
                success: false,
                message: 'Email already exists',
            });
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);  // Expire in 2 minutes

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'OTP for verification',
            text: `Your OTP is ${otp}. It's valid for 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log('Error sending email:', error);
            else console.log('Email sent:', info.response);
        });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new UserModel({
            email: req.body.email,
            password: hashedPassword,
            otp:{
                code: otp,
                otpSentAt: otpExpiry
            },
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for the OTP.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Registration error" });
    }
};
const VerifyOtpController = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user || user.otp.code !== req.body.otpValue) {
            return res.status(200).json({
                success: false,
                message: user ? 'Invalid OTP' : 'User not found',
            });
        }

        const now = new Date();
        if (now > user.otp.otpSentAt) {
            return res.status(200).json({
                success: false,
                message: 'OTP expired. Request a new OTP.',
            });
        }

        await UserModel.updateOne({ email: req.body.email }, { $unset: { otp: 1, otpExpiry: 1 } });
        res.status(200).json({
            success: true,
            message: 'OTP verified. Signup successful!',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "OTP verification error" });
    }
};
const LogincheckController = async(req, res) => {
    try {
        const {  password } = req.body;
        
        var isEmail=false;
        const username=req.body.username;
        for(var i=0;i<username.length;i++){
            if(username[i]==='@'){
                isEmail=true;
                break;
            }
        }
        var user;
        if(isEmail){
            console.log("inside Isemail");
            user=await UserProfileModel.findOne({email:req.body.username});
        }else{
            user = await UserProfileModel.findOne({ username:req.body.username });
        }
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "User मौजूद नहीं है |"
            });
        }
       
        const wrongPasswordMessages = [
            "Galat password? Lagta hai yaadash dhokha de rahi hai!",
            "Yeh toh galat hai! Dimaag thoda zor se chalao.",
            "Arre bhai, password galat dal diya, dobara koshish karo!",
            "Nahi bhai, yeh password nahi chalega. Agla chance lo!",
            "Password galat hai! Aapka dimaag chutti par toh nahi?",
            "Yeh kya bhai, password bhool gaye kya? Try karo phir se!",
            "Galat password pe faltu database call kara diya, ab iska bill kon dega???",
        ];

        const userPassword = user.password;
        const isMatch = await bcrypt.compare(password, userPassword);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: wrongPasswordMessages[Math.floor(Math.random() * wrongPasswordMessages.length)]
            });
        }

        
        const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' });

        res.status(200).send({
            success: true,
            username,
            message: 'Logged in',
            token
        });

    } catch (e) {
        console.log("This is error ", e);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
        console.log("first")
    }
};
// const newUserController = async(req, res) => {
//     try {
//         const { githubName, imageurl, name, username, password, university, techStack } = req.body;

//         if (!githubName || !imageurl || !username || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'All required fields must be filled',
//             });
//         }

//         // Check if the username already exists
//         const existingUser = await UserModel.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Username already exists',
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the user
//         const newUser = new UserModel({
//             githubName,
//             imageurl,
//             name,
//             username,
//             password: hashedPassword,
//             university,
//             techStack,
//         });

//         await newUser.save();

//         // Generate a token if needed (optional)
//         // const token = newUser.generateAuthToken();
//         const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' });

//         res.status(201).json({
//             success: true,
//             message: 'User created successfully',
//             token,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal Server Error',
//         });
//     }
// };

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
const SendOtpController = async(req, res) => {
    try {
        var isEmail = /\S+@\S+\.\S+/.test(req.body.email); // Regex to check for email format
    
        if (isEmail) {
            console.log("inside isEmail");
            const user = await UserModel.findOne({ email: req.body.email });
            if (!user) {
                return res.status(200).send({
                    success: false,
                    message: "User not found"
                });
            }
    
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);  // Expire in 2 minutes
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
    
            const mailOptions = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: 'OTP for verification',
                text: `Your OTP is ${otp}. It's valid for 2 minutes.`,
            };
    
            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                        resolve(info);
                    }
                });
            });
    
            user.otp = {
                code: otp,
                otpSentAt: otpExpiry,
            };
    
            await user.save();
    
            res.status(200).send({
                success: true,
                message: "OTP sent successfully",
            });
        }else{
            const userProfile=await UserProfileModel.findOne({username:req.body.email});
            if (!userProfile) {
                return res.status(200).send({
                    success: false,
                    message: "User not found"
                });
            }
            const user = await UserModel.findOne({ email: userProfile.email });

            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);  // Expire in 2 minutes
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
    
            const mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'OTP for verification',
                text: `Your OTP is ${otp}. It's valid for 2 minutes.`,
            };
    
            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                        resolve(info);
                    }
                });
            });
    
            user.otp = {
                code: otp,
                otpSentAt: otpExpiry,
            };
    
            await user.save();
    
            res.status(200).send({
                success: true,
                message: "OTP sent successfully",
            });
        }
    } catch (err) {
        res.status(500).send({
            success: false,
            message: "An error occurred while sending the OTP",
        });
    }    
}
const VerifyForgotOtpController = async(req, res) => {
    try{
        const { email, otp } = req.body;
        var isEmail = /\S+@\S+\.\S+/.test(req.body.email); // Regex to check for email format
        if(isEmail){
            const user = await UserModel.findOne({ email:email });
            if(user.otp.code !== otp){
                return res.status(200).send({
                    success: false,
                    message: "Invalid OTP"
                });
            }
            const now = new Date();
            if(now > user.otp.otpSentAt){
                return res.status(200).send({
                    success: false,
                    message: "OTP expired. Request a new OTP."
                });
            }
            return res.status(200).send({
                success: true,
                message: "OTP verified successfully"
            });
        }else{
            const userProfile=await UserProfileModel.findOne({username:email});
            const user = await UserModel.findOne({ email: userProfile.email });
            if(user.otp.code !== otp){
                return res.status(200).send({
                    success: false,
                    message: "Invalid OTP"
                });
            }
            const now = new Date();
            if(now > user.otp.otpSentAt){
                return res.status(200).send({
                    success: false,
                    message: "OTP expired. Request a new OTP."
                });
            }
            return res.status(200).send({
                success: true,
                message: "OTP verified successfully"
            });
        }
    }catch(err){
        console.log(err);
    }
}
const ResetPasswordController = async(req, res) => {
    try{
        const { email, newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        var isEmail = /\S+@\S+\.\S+/.test(req.body.email); // Regex to check for email format
        if(isEmail){
            const user = await UserModel.findOne({ email: email });
            user.password = hashedPassword;
            await user.save();
            const userProfileUser=await UserProfileModel.findOne({email:email});
            userProfileUser.password=hashedPassword;
            await userProfileUser.save();
            return res.status(200).send({
                success: true,
                message: "Password reset successfully"
            });
        }else{
            const userProfile=await UserProfileModel.findOne({username:email});
            const user = await UserModel.findOne({ email: userProfile.email });
            user.password = hashedPassword;
            await user.save();
            userProfile.password=hashedPassword;
            await userProfile.save();
            return res.status(200).send({
                success: true,
                message: "Password reset successfully"
            });
        }
    }catch(err){
        console.log(err);
    }
}
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
        const { githubid, name, username, password, university, techStack,email } = req.body;
        const user=await UserProfileModel.findOne({username:username});
        if(user){
            return res.status(200).send({
                success: false,
                message: "Username already exists"
            });
        }
        // Check if all required fields are provided
        if (!githubid || !username || !password) {
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
        console.log(imageurl);
        // if the username already exists
        // const existingUser = await UserModel.findOne({ username });
        // if (existingUser) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Username already exists',
        //     });
        // }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // password = hashedPassword
        // Create the user
        const newUser = new UserProfileModel({
            githubid,
            name,
            username,
            password: hashedPassword,
            studyingAt: university,
            techStack,
            imageurl: imageurl,
            email
        });
        console.log("This is new User -> ", newUser);
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
    UserRegistrationController,
    VerifyOtpController,
    IsUserExist,
    VerifyForgotOtpController,
    SendOtpController,
    ResetPasswordController,
    CreatePostController,
    LogincheckController,
    LogincheckController,
    MessageController,
    uploadcontroller
};
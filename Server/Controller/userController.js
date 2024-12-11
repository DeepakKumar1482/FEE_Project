const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const app = getFirestore(db);
const usersRef = collection(app, "users");
const postsRef = collection(app, "posts");
const UserModel = require('../schema/userSchema');
const postModel = require('../schema/postSchema');
const ProfileModel = require('../schema/userProfileSchema');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Pusher = require("pusher");
const upload = require('../middleware/multermiddleware.js');
const cloudinary = require('../cloudinary/config.js'); // Path to your Cloudinary config file
require('dotenv').config();
const nodemailer = require('nodemailer');
const Notifications = require("../models/notifications.model.js");
const secretKey = process.env.secretKey;

const UserRegistrationController = async (req, res) => {
    try {
        const isEmailExist = await UserModel.findOne({ email: req.body.email });
        
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

        const token = jwt.sign({ id: req.body.email }, secretKey, { expiresIn: '6d' });

        if (isEmailExist) {
            const isExistInUserModel=await UserModel.findOne({email:req.body.email});
            if(isExistInUserModel){
                return res.status(200).send({
                    success: false,
                    check:true,
                    message: 'Email already exists'
                })
            }
            const isProfileExist=await ProfileModel.findOne({email:req.body.email});
            console.log("This is isProfileExist -> ",isProfileExist);
            if(isProfileExist==null){
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.log('Error sending email:', error);
                    else console.log('Email sent:', info.response);
                });
                isEmailExist.otp = {
                    code: otp,
                    otpSentAt: otpExpiry,
                }
                await isEmailExist.save();
                return res.status(200).json({
                    success: true,
                    message: 'Please check your email for the OTP.And Verify your email',
                    token
                });
            }else{
            return res.status(200).json({
                success: false,
                message: 'Email already exists',
            });
        }
        }
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
            token
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
        console.log(user.otp.code)

        const check=await UserModel.updateOne({ email: req.body.email }, { $unset: { otp: 1, otpExpiry: 1 } });
        console.log(check);
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

        console.log(username, password);
        for(var i=0;i<username.length;i++){
            if(username[i]==='@'){
                isEmail=true;
                break;
            }
        }
        var user;
        if(isEmail){
            console.log("inside Isemail");
            user=await ProfileModel.findOne({email:req.body.username});
            flag=true;
        }else{
            user = await ProfileModel.findOne({ username:req.body.username });
        }
        console.log("This is user ->",user);
        const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' });
        var isRegistered;
        if(!user){
            isRegistered=await UserModel.findOne({email:req.body.username});
            if(isRegistered){
                return res.status(200).send({
                    success: false,
                    token,
                    // message: "Please make your profile first",
                    isRegisteredCheck:true
                })
            }else{
                return res.status(200).send({
                    success: false,
                    message: "User मौजूद नहीं है |",
                    isRegisteredCheck:false
                })
            }
        }
        // console.log("This is user ->",user);
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "User मौजूद नहीं है |",
                user
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
                isPasswordMatch: true,
                message: wrongPasswordMessages[Math.floor(Math.random() * wrongPasswordMessages.length)]
            });
        }
        res.status(200).send({
            success: true,
            // username,
            message: 'Logged in',
            token,
            user
        });

    } catch (e) {
        console.log("This is error ", e);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};
const GetUserController = async(req, res) => {
    try {
        console.log("This is req -> ", req.body);
        const user = await ProfileModel.findOne({ username: req.body.username });
        // console.log("This is user -> ", user);
        if (!user) {
            console.log("User not found");
            return res.status(200).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send({
            success: true,
            data: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
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
        const user=await ProfileModel.findOne({username:username});
        const userid=user._id;
        const imageUrls = req.body.imageUrls[0];
        console.log("this is imageurls",imageUrls);
        const { description, githubRepo, tech, currDate, currTime } = req.body;
        const newpost=new postModel({
            imageUrls,
            description,
            githubRepo,
            tech,
            Time: {
                date: currDate,
                time: currTime
            },
            userid
        })
        await newpost.save();
        console.log("This is new post -> ",newpost._id);
        console.log(username);
        // const user=await ProfileModel.findOne({username:username});
        // console.log(user.ObjectId);
        user.posts.push(newpost);
        await user.save();
        console.log(user.posts);
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
};
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
            const userProfile=await ProfileModel.findOne({username:req.body.email});
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
            const userProfile=await ProfileModel.findOne({username:email});
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
            const userProfileUser=await ProfileModel.findOne({email:email});
            userProfileUser.password=hashedPassword;
            await userProfileUser.save();
            return res.status(200).send({
                success: true,
                message: "Password reset successfully"
            });
        }else{
            const userProfile=await ProfileModel.findOne({username:email});
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
        const user=await ProfileModel.findOne({username:username});
        if(user){
            return res.status(200).send({
                success: false,
                message: "Username already exists"
            });
        }
        // Check if all required fields are provided
        if (!githubid || !username || !password) {
            console.log(githubid,username);
            console.log("This is password ->",password);
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled',
            });
        }

        // if (!req.file) {
        //     return res.status(400).send('No image provided!');
        // }
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
        const newUser = new ProfileModel({
            githubid,
            name,
            username,
            password: hashedPassword,
            studyingAt: university,
            techStack,
            imageurl: imageurl,
            email
        });
        // console.log("This is new User -> ", newUser);
        await newUser.save();

        // Generate a token if needed (optional)
        // const token = newUser.generateAuthToken();
        // const token = jwt.sign({ id: username }, secretKey, { expiresIn: '6d' })

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            // token,
        });

        // The image has been uploaded to Cloudinary, and the URL is available in req.file.path
        // res.status(200).send({
        //         success: true,s
        //         message: 'Image uploaded successfully'
        //     })
        // res.json({ imageUrl: req.file.path });
    } catch (e) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
        console.log(e);
    }
}
const UpdateAboutController=async(req,res)=>{
    try{
        const user=await ProfileModel.findOne({username:req.body.username});
        console.log(user);
        user.about=req.body.about;
        await user.save();
        res.status(200).send({
            success:true,
            message:"About updated successfully"
        });
    }catch(err){
        console.log(err);
    }
}

const AddConnectionController = async(req, res) => {
    
    try {
        const { sender, receiver } = req.body;
        console.log("This is connectionUsername -> ",sender, receiver   );
        const connectionData=await ProfileModel.findOne({username:receiver.username});
        if(receiver.username===sender){
            return res.status(200).send({
                success:false,
                message:"You cannot add yourself"
            });
        }
        const user = await ProfileModel.findOne({username:sender});
        const receiverNotifications=await Notifications.findOne({User:connectionData._id});
        
        if(receiverNotifications && receiverNotifications.notifications.length>0){
            for(var i=0;i<receiverNotifications.notifications.length;i++){
                console.log("This is receiverNotifications.notifications[i].userid -> ",receiverNotifications.notifications[i].userid);
                console.log("This is user._id -> ",user._id);
                if(receiverNotifications.notifications[i].userid.toString()===user._id.toString()){
                    return res.status(200).send({
                        success:false,
                        message:"You have already sent a request"
                    });
                }
            }

        }



        const SenderNotifications=await Notifications.findOne({User:user._id});
        if(SenderNotifications && SenderNotifications.notifications.length>0){
            for(var i=0;i<SenderNotifications.notifications.length;i++){
                // console.log("This is receiverNotifications.notifications[i].userid -> ",receiverNotifications.notifications[i].userid);
                // console.log("This is user._id -> ",user._id);
                if(SenderNotifications.notifications[i].userid.toString()===connectionData._id.toString()){
                    return res.status(200).send({
                        success:false,
                        message:`${connectionData.username} have already sent a you a request`
                    });
                }
            }

        }
        // console.log("This is the connection id who is going to be added -> ",connectionData._id);
        if(connectionData.connections.includes(sender._id) || user.connections.includes(connectionData._id)){
            return res.status(200).send({
                success:false,
                message:"Connection already exists"
            });
        }

        const UserNotificationsArray=await Notifications.findOne({User:connectionData._id});
        // console.log("This is UserNotificationsArray -> ",UserNotificationsArray);
        if(!UserNotificationsArray){
            const newNotification=new Notifications({
                User:connectionData._id,
                notifications:[]
            });

            newNotification.notifications.push({userid: user});
            await newNotification.save();
        }else{
            console.log("Inside second Notification");
            UserNotificationsArray.notifications.push({userid: user});
            await UserNotificationsArray.save();
        }
        
        // console.log("This is result -> ",result);
        
        // user.connections.push(connectionUsername);
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Connection request sent successfully'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}


const GetNotificationsController = async(req, res) => {
    try{
        console.log(req.query.username);
        const user=await ProfileModel.findOne({username:req.query.username});
        
        const notifications=await Notifications.findOne({User:user._id}).populate({
            path: 'notifications',
            populate: {
                path: "userid",
                select: "username imageurl name"
            }
        })
        if(!notifications){
            return res.status(200).send({
                success:false,
                message:"No notifications"
            });
        }
        console.log(notifications.notifications);
        // console.log("This is isAccpeted -------------->",notifications.notifications[0].isAccepted);
        res.status(200).send({
            success:true,
            data:notifications.notifications,
            // isAccepted:notifications.notifications[0].isAccepted
        });
    }catch(e){
        console.log(e);
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
}
const AcceptConnectionController=async(req,res)=>{
    try{
        const {sender,reciever,notificationid}=req.body;
        // const Notification=await Notifications.findOne({notifications._id:notificationid});
        
        const user=await ProfileModel.findOne({username:sender});
        user.connections.push(reciever);
        console.log("This is Notification id",notificationid)
        await user.save();
        console.log("This is sender id",user._id);
        console.log("This is reciever id",reciever)
        const connectionUser=await ProfileModel.findOne({_id:reciever});
        console.log("This is connectionUser -> ",connectionUser)
        connectionUser.connections.push(user._id);
        await connectionUser.save();

        
        
        const result = await Notifications.findOneAndUpdate(
            { User: user._id }, // Find the document by user _id
            { $pull: { notifications: { _id: notificationid } } } ,// Remove the specific object in the array
            { new: true } 
          );
          console.log("This is result -> ",result);
        //   await result.save();
        res.status(200).send({
            success:true,
            message:"Connection added successfully"
        })
    }catch(e){
        console.log(e)
        res.status(500).send({
            success: false,
            message: "Internal server error"
        })
    }
}

const RejectConnectionController = async(req, res) => {
    try{
        const {sender,reciever,notificationid}=req.body;
        // const Notification=await Notifications.findOne({notifications._id:notificationid});
        
        const user=await ProfileModel.findOne({username:sender});
        // user.connections.push(reciever);
        // console.log("This is Notification id",notificationid)
        // await user.save();
        // console.log("This is sender id",user._id);
        // console.log("This is reciever id",reciever)
        // const connectionUser=await ProfileModel.findOne({_id:reciever});
        // console.log("This is connectionUser -> ",connectionUser)
        // connectionUser.connections.push(user._id);
        // await connectionUser.save();

        
        
        const result = await Notifications.findOneAndUpdate(
            { User: user._id }, // Find the document by user _id
            { $pull: { notifications: { _id: notificationid } } } ,// Remove the specific object in the array
            { new: true } 
          );
          res.status(200).send({
            success:true,
            message:"Connection request rejected"
        })
    }catch(err){
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
        console.log(err);
    }
}

const GetAllUserController = async(req, res) => {
    const { studyingAt, githubid, username, email, techStack } = req.query;
    const filter = {};

    if (studyingAt) filter.studyingAt = { $regex: studyingAt, $options: 'i' };
    if (githubid) filter.githubid = { $regex: githubid, $options: 'i' };
    if (username) filter.username = { $regex: username, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };

    // Handle techStack filtering
    if (techStack) {
        const techArray = techStack.split(',').map((tech) => tech.trim());
        filter.techStack = { $all: techArray.map((tech) => new RegExp(tech, 'i')) };
    }

    try {
        // Include `username` and `imageurl` in the response
        const users = await ProfileModel.find(filter, 'username imageurl'); 
        res.json(users);
        // console.log(users)
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
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
    uploadcontroller,
    GetUserController,
    UpdateAboutController,
    AddConnectionController,
    GetNotificationsController,
    AcceptConnectionController,
    RejectConnectionController,
    GetAllUserController
};
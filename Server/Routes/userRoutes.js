const express = require('express');
const { IsUserExist, CreatePostController, LogincheckController, MessageController, uploadcontroller, UserRegistrationController, VerifyOtpController, SendOtpController, VerifyForgotOtpController, ResetPasswordController } = require('../Controller/userController.js');
const authmiddleware = require('../middleware/authmiddleware.js');
const upload = require('../middleware/multermiddleware.js');
const router = express.Router();
// router.post('/createuser', newUserController);
router.post('/register', UserRegistrationController);
router.post('/verifyotp', VerifyOtpController);
router.post('/OtpSend',SendOtpController);
router.post('/verify-forgot-otp',VerifyForgotOtpController);
router.post('/reset-password',ResetPasswordController);
router.post('/isUserExist', IsUserExist);
router.post('/createpost', authmiddleware, CreatePostController);
router.post('/logincheck', LogincheckController);
router.post('/message', authmiddleware, MessageController);
router.post('/upload', upload.single('image'), uploadcontroller);
module.exports = router
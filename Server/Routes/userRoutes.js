const express = require('express');
const { newUserController, IsUserExist, CreatePostController, LogincheckController, MessageController, uploadcontroller } = require('../Controller/userController.js');
const authmiddleware = require('../middleware/authmiddleware.js');
const upload = require('../middleware/multermiddleware.js');
const router = express.Router();
router.post('/createuser', newUserController);
router.post('/isUserExist', IsUserExist);
router.post('/createpost', authmiddleware, CreatePostController);
router.post('/logincheck', LogincheckController);
router.post('/message', authmiddleware, MessageController);
router.post('/upload', upload.single('image'), uploadcontroller);
module.exports = router
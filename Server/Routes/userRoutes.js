const express = require('express');
const { newUserController, IsUserExist, CreatePostController } = require('../Controller/userController.js');
const authmiddleware = require('../middleware/authmiddleware.js');
const router = express.Router();
router.post('/createuser', newUserController);
router.post('/isUserExist', IsUserExist);
router.post('/createpost', authmiddleware, CreatePostController);
module.exports = router
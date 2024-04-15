const express = require('express');
const { newUserController, IsUserExist } = require('../Controller/userController.js');
const router = express.Router();
router.post('/createuser', newUserController);
router.post('/isUserExist', IsUserExist);
module.exports = router
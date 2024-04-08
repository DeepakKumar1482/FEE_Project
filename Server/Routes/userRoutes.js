const express = require('express');
const newUserController = require('../Controller/userController.js');
const router = express.Router();
router.post('/createuser', newUserController);
module.exports = router
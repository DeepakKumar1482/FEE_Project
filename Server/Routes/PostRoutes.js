const express = require('express');
const authmiddleware = require('../middleware/authmiddleware.js');
const getPostsController = require('../Controller/PostController.js');
const router = express.Router();
router.get('/getposts', getPostsController)
module.exports = router
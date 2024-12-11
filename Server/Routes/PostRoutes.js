const express = require('express');
const authmiddleware = require('../middleware/authmiddleware.js');
const {getPostsController, likePost, bookmark, getSavedPosts, addComment, getComment, getUserProfilepostsController} = require('../Controller/PostController.js');
const router = express.Router();
router.route('/getposts').get(getPostsController)
router.route('/like-post').post(authmiddleware, likePost)
router.route('/save-post').post(authmiddleware, bookmark)
router.route('/getSavePosts').get(authmiddleware, getSavedPosts)
router.route('/addComment').post(authmiddleware, addComment)
router.route('/getComment').post(getComment)
router.route('/getUserProfileposts').get(getUserProfilepostsController);
module.exports = router
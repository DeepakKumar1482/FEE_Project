const Comment = require("../models/comments.model.js");
const postModel = require("../schema/postSchema.js");
const ProfileModel = require("../schema/userProfileSchema.js");

const getPostsController = async(req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const PostsList = await postModel
        .find()
        .sort({createdAt : -1})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate({
            path: "userid",
            select: "username name imageurl",
        });
       const totalPosts = await postModel.countDocuments();
       console.log(totalPosts);
       const hasNextPage = (page*limit) < totalPosts;
        console.log(PostsList[0]);
        res.status(200).json({
            success: true,
            posts: PostsList,
            hasNextPage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const likePost = async(req, res) => {
    try {
        const userId = req.user._id;
        // console.log(userId, "like post");
        const {postId} = req.body;
        console.log("post id: " + postId);
        // 67589ab4c1efbe785c6800b9
        const post = await postModel.findById(postId);
        const user = await ProfileModel.findById(userId);
        console.log("inside like post 1",post.likes.length);
        if(!post){
            return res.status(400).json(
                {
                    success: false,
                    message: "Post not found"
                }
            )
        }
        
        const isAlreadyLiked = post.likes.includes(userId);
        console.log("is already liked", isAlreadyLiked);
        if(isAlreadyLiked){
            post.likes.pull(userId);
            user.likedPosts.pull(postId);
            await post.save();
            await user.save();
            console.log("inside like post 2",post.likes.length);
            return res.status(200).json(
                {
                    success: true,
                    message: "Post disliked successfully",
                    likesCount: post.likes.length
                }
            )
        }
        user.likedPosts.push(postId);
        post.likes.push(userId);
        await post.save();
        await user.save();
        console.log("inside like post 3",post.likes.length);


        return res.status(200).json(
            {
                success: true,
                message: "Post liked successfully",
                likesCount: post.likes.length
            }
        )
    } catch (error) {
        console.error(error.message);
        return res.status(500).json(
            {
                success: false,
                message: "Error while liking post"
            }
        )
    }
}

const bookmark = async(req, res) => {
    try {
        const {postId} = req.body;
        const userId = req.user._id;
        const user = await ProfileModel.findById(userId);
        
        const isAlreadySaved = user.savedposts.includes(postId);
        console.log(isAlreadySaved)
        if(isAlreadySaved){
            user.savedposts.pull(postId);
            await user.save();
            return res.status(200).json(
                {
                    success: true,
                    message: "Saved post removed"
                }
            )
        }
        user.savedposts.push(postId);
        await user.save();
        return res.status(200).json(
            {
                success: true,
                message: "Saved post successfully"
            }
        )

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Error while saving post"
            }
        )
    }
}

const getSavedPosts = async(req, res) => {
    try {
        const userId = req.user._id;
        const savedPosts = await ProfileModel.findById(userId).populate({
            path: "savedposts",
            populate: {
                path: "userid",
                select: "username name imageurl",
            }
        });
        if(!savedPosts){
            return res.status(404).json({
                success: false,
                message: "No saved posts"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Saved post fetched successfully",
            savedPosts: savedPosts.savedposts
        })
        
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Error while saving post"
            }
        )
    }
}

const addComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { text, postId } = req.body;

        if(!text){
            return res.status(401).json(
                {
                    success: false,
                    message: "Please add a comment."
                }
            )
        }
        const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json(
                {
                    success: false,
                    message: "Invalid Post ID"
                }
            )
        }

        const newComment = new Comment({
            userId,
            text
        })
        await newComment.save();

        const addedCommentData = await newComment.populate({
            path: "userId",
            select: "username name imageurl"
        })
        if(!addedCommentData){
            return res.status(403).json({
                success: false,
                message: "Error saving comment"
            })
        }

        post.comments.push(newComment);
        await post.save();

        return res.status(200).json(
            {
                success: true,
                message: "Commented on the post successfully",
                addedCommentData
            }
        )

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Error while commenting on the post"
            }
        )
    }
}

const getComment = async (req, res) => {
    try {
        const {postId} = req.body;
        const {page = 1, limit = 10} = req.query;
        const post = await postModel
        .findById(postId)
        .populate({
            path: "comments",
            populate: {
                path: "userId",
                select: "username name imageurl"
            },
            options: { sort: { createdAt: -1 } },
        })
        if(!post){
            return res.status(200).json(
                {
                    success: false,
                    message: "No comments found"
                }
            )
        }
        return res.status(200).json(
            {
                success: true,
                message: "Fetched Comments successfully",
                commentData: post.comments
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Error while fetching comments"
            }
        )
    }
}
const getUserProfilepostsController = async(req, res) => {
    try{
        const username=req.query.username;
        const UserDetails=await ProfileModel.findOne({username:username});
        const userId = UserDetails._id;
        const userPosts = await ProfileModel.findById(userId).populate({
            path: "posts",
            populate: {
                path: "userid",
                select: "username name imageurl",
            }
        });
        if(!userPosts){
            return res.status(404).json({
                success: false,
                message: "No saved posts"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Saved post fetched successfully",
            UserPosts: userPosts.posts
        })
    }catch(error){
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
module.exports = {getPostsController, likePost, bookmark, getSavedPosts, addComment, getComment,getUserProfilepostsController};
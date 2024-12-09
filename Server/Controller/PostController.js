const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
const postModel = require("../schema/postSchema.js");
const app = getFirestore(db);
const postsRef = collection(app, "posts");

const getPostsController = async(req, res) => {
    try {
        const postsSnapshot = await getDocs(postsRef);
        const postsList = postsSnapshot.docs.map((doc) => ({
            ...doc.data(),
        }));
        res.status(200).json({
            success: true,
            posts: postsList
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likePost = async(req, res) => {
    try {
        const userId = req.user._id;
        const {postId} = req.body;
    
        const post = await postModel.findOne(postId);
        if(!post){
            return res.status(400).json(
                {
                    success: false,
                    message: "Post not found"
                }
            )
        }
    
        post.likes.push(userId);
        await post.save();

        return res.status(200).json(
            {
                success: true,
                message: "Post liked successfully"
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
module.exports = getPostsController;
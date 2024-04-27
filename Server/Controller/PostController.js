const { getFirestore, collection, addDoc, where, query, getDocs, updateDoc, setDoc } = require("firebase/firestore");
const { db } = require('../Firebase/config.js');
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
module.exports = getPostsController;
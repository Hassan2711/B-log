const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const mongoose = require('mongoose');

const router = express.Router();

const blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'loginCredential'
    }
});

const blogPosts = mongoose.model('blogPosts', blogSchema);

router.post('/write', fetchUser, async (req, res) => {
    try {
        const { title, body } = req.body;
        const post = new blogPosts({
            title,
            body,
            user: req.user.id
        });

        const postData = await post.save();
        res.json(postData);
    } catch (error) {
        res.status(500).send("Internal server error" + error.message);
    }
});

router.get('/posts', fetchUser, async (req, res) => {
    try {
        const posts = await blogPosts.find({ user: req.user.id });
        res.json(posts);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

router.get('/posts/:id', fetchUser, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await blogPosts.findOne({ _id: postId, user: req.user.id });
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.json(post);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

router.put('/post/update/:id', fetchUser, async (req, res) => {
    try {
        const { title, body } = req.body;
        const updatedPost = await blogPosts.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, body },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

router.delete('/post/delete/:id', fetchUser, async (req, res) => {
    try {
        const deletedPost = await blogPosts.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedPost) {
            return res.status(404).send("Post not found");
        }
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

module.exports = router;

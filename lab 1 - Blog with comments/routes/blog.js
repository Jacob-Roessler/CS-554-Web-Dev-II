const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const usersData = data.users;
const commentData = data.comments;

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, '').length > 0;
}

const validUserPass = (username, password) => {
    const checkString = (str, variableName) => {
        if (typeof str !== 'string' || str.trim().length === 0)
            throw new Error(`${variableName} must be a non-empty string`);
    };
    if (!username) throw new Error('No username provided!');
    if (!password) throw new Error('No password provided!');

    checkString(username, 'username');
    if (!username.match(/^[0-9a-zA-Z]+$/)) throw new Error('Only alphanumeric characters allowed in username!');
    if (username.trim().length < 4) throw new Error('Username must be at least 4 characters long!');

    checkString(password, 'password');
    if (password.indexOf(' ') >= 0) throw new Error('Password cannot contain spaces!');
    if (password.length < 6) throw new Error('Password must be at least 6 characters long!');
};

router.post('/signup', async (req, res) => {
    const { name, username, password } = req.body;
    if (!name) {
        res.status(400).json({ error: 'No name provided' });
        return;
    }
    if (!stringCheck(name)) {
        res.status(400).json({ error: 'Name must be a non-empty string' });
        return;
    }
    try {
        validUserPass(username, password);
    } catch (e) {
        res.status(400).json({ error: e.message });
        return;
    }

    try {
        const newUser = await usersData.createUser(name, username, password);
        if (!newUser) {
            res.status(500).json({ error: 'Could not create user' });
            return;
        } else {
            res.status(200).json({ _id: newUser._id, name: newUser.name, username: newUser.username });
            return;
        }
    } catch (e) {
        res.status(400).json({ error: e.message });
        return;
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        validUserPass(username, password);
    } catch (e) {
        res.status(400).json({ error: e.message });
        return;
    }

    try {
        const user = await usersData.checkUser(username, password);
        req.session.username = user.username;
        req.session._id = user._id;
        res.status(200).json({ _id: user._id, name: user.name, username: user.username });
        return;
    } catch (e) {
        res.status(400).json({ error: e.message });
        return;
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logged Out' });
});

router.get('/', async (req, res) => {
    //Default show 20 at most 100 can be given ?skip=n or ?take=y
    let take = req.query.take;
    let skip = req.query.skip;
    if (take || parseInt(take) === 0) {
        take = parseInt(take);
        if (typeof take !== 'number') {
            res.status(400).json({ error: 'Invalid type for take' });
            return;
        }
        if (take < 0 || !Number.isInteger(take)) {
            res.status(400).json({ error: 'take must be a positive integer' });
            return;
        }
    } else {
        take = 20;
    }
    if (skip || parseInt(skip) === 0) {
        skip = parseInt(skip);
        if (typeof skip !== 'number') {
            res.status(400).json({ error: 'Invalid type for skip' });
            return;
        }
        if (skip < 0 || !Number.isInteger(skip)) {
            res.status(400).json({ error: 'skip must be a positive integer' });
            return;
        }
    } else {
        skip = 0;
    }
    const postList = await postData.getAllPosts();

    if (skip + take - skip > 100) {
        take = 100;
    }

    res.status(200).json(postList.slice(skip, skip + take));
});

router.get('/:id', async (req, res) => {
    try {
        let post = await postData.getPostById(req.params.id);
        res.status(200).json(post);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
});

router.post('/', async (req, res) => {
    // Only provide title and body user will be taken from session and comments will start as empty
    const { title, body } = req.body;
    if (!title) {
        res.status(400).json({ error: 'Missing title field' });
        return;
    }
    if (!body) {
        res.status(400).json({ error: 'Missing body field' });
        return;
    }
    if (!stringCheck(title)) {
        res.status(400).json({ error: 'title must be a non-empty string' });
        return;
    }
    if (!stringCheck(body)) {
        res.status(400).json({ error: 'body must be a non-empty string' });
        return;
    }
    try {
        const newPost = await postData.createPost(title, body, {
            _id: req.session._id,
            username: req.session.username,
        });
        res.status(200).json(newPost);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/:id', async (req, res) => {
    const updatedData = req.body;
    if (!updatedData.title || !updatedData.body) {
        res.status(400).json({ error: 'You must Supply All fields' });
        return;
    }
    try {
        await postData.getPostById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }

    try {
        const updatedPost = await postData.updatePost(req.params.id, updatedData);
        res.status(200).json(updatedPost);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.patch('/:id', async (req, res) => {
    const requestBody = req.body;
    let updatedObject = {};
    try {
        const oldPost = await postData.getPostById(req.params.id);
        if (requestBody.title && requestBody.title !== oldPost.title) updatedObject.title = requestBody.title;
        if (requestBody.body && requestBody.body !== oldPost.body) updatedObject.body = requestBody.body;
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }
    if (Object.keys(updatedObject).length !== 0) {
        try {
            const updatedPost = await postData.updatePost(req.params.id, updatedObject);
            res.status(200).json(updatedPost);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(400).json({
            error: 'No fields have been changed from their inital values, so no update has occurred',
        });
    }
});

router.post('/:id/comments', async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        res.status(400).json({ error: 'You must supply comment text' });
        return;
    }
    if (!stringCheck(comment)) {
        res.status(400).json({ error: 'Comment text must be a non-empty string' });
        return;
    }

    try {
        await postData.getPostById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }

    try {
        newComment = await commentData.create(
            req.params.id,
            {
                _id: req.session._id,
                username: req.session.username,
            },
            comment
        );
        res.status(200).json(newComment);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/:blogId/:commentId', async (req, res) => {
    const blogId = req.params.blogId;
    const commentId = req.params.commentId;
    if (!blogId) {
        res.status(400).json({ error: 'You must supply blogId' });
        return;
    }
    if (!commentId) {
        res.status(400).json({ error: 'You must supply commentId' });
        return;
    }
    if (!stringCheck(blogId)) {
        res.status(400).json({ error: 'blogId text must be a non-empty string' });
        return;
    }
    if (!stringCheck(commentId)) {
        res.status(400).json({ error: 'commentId text must be a non-empty string' });
        return;
    }

    try {
        await postData.getPostById(blogId);
        res.status(200).json({ deletion: 'success' });
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }

    try {
        await commentData.removeComment(blogId, commentId);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;

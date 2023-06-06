//Name: Jacob Roessler
//Pledge: I pledge my honor that I have abided by the Stevens Honor System.

const express = require('express');
const app = express();

const session = require('express-session');
const { posts } = require('./data');
const { comments } = require('./data');
const configRoutes = require('./routes');

app.use(express.json());

app.use(
    session({
        name: 'AuthCookie',
        secret: 'some secret string!',
        resave: false,
        saveUninitialized: true,
    })
);

app.post('/blog', (req, res, next) => {
    //Middleware that checks if user is logged in or not
    if (!req.session.username || !req.session._id) {
        res.status(403).json({ error: 'Must be logged in to post' });
    } else {
        next();
    }
});
app.put('/blog/:id', async (req, res, next) => {
    if (!req.session.username || !req.session._id) {
        res.status(403).json({ error: 'Must be logged in to update a post' });
        return;
    }
    if (!req.params.id) {
        res.status(400).json({ error: 'Must provide id' });
        return;
    }
    try {
        post = await posts.getPostById(req.params.id);
        if (post.userThatPosted._id !== req.session._id || post.userThatPosted.username !== req.session.username) {
            res.status(403).json({ error: "cannot update a post that isn't yours" });
        } else {
            next();
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
app.patch('/blog/:id', async (req, res, next) => {
    if (!req.session.username || !req.session._id) {
        res.status(403).json({ error: 'Must be logged in to update a post' });
        return;
    }
    if (!req.params.id) {
        res.status(400).json({ error: 'Must provide id' });
        return;
    }
    try {
        post = await posts.getPostById(req.params.id);
        if (post.userThatPosted._id !== req.session._id || post.userThatPosted.username !== req.session.username) {
            res.status(403).json({ error: "cannot update a post that isn't yours" });
        } else {
            next();
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
//Comment Middleware
app.post('/blog/:id/comments', (req, res, next) => {
    //Middleware that checks if user is logged in or not
    if (!req.session.username || !req.session._id) {
        res.status(403).json({ error: 'Must be logged in to post a comment' });
    } else {
        next();
    }
});
app.delete('/blog/:blogId/:commentId', async (req, res, next) => {
    //Middleware that checks if user is logged in or not
    if (!req.session.username || !req.session._id) {
        res.status(403).json({ error: 'Must be logged in to delete a comment' });
        return;
    }
    try {
        const post = await posts.getPostById(req.params.blogId);
        let comment = {};
        for (c of post.comments) {
            if (c._id === req.params.commentId) {
                comment = c;
            }
        }
        if (!comment) {
            res.status(404).json({ error: 'comment not found' });
            return;
        }
        if (
            comment.userThatPostedComment._id !== req.session._id ||
            comment.userThatPostedComment.username !== req.session.username
        ) {
            res.status(403).json({ error: "cannot delete a comment that isn't yours" });
        } else {
            next();
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});

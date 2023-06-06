const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const users = require('./users');
const { ObjectId } = require('mongodb');

function stringToId(id) {
    //Code from 546 lab4 assignment
    //check to make sure we have input at all
    if (!id) throw new Error('Id parameter must be supplied');

    //check to make sure it's a string
    if (typeof id !== 'string') throw new Error('Id must be a string');

    //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
    //if it fails, it will throw an error (you do not have to throw the error, it does it automatically and the catch where you call the function will catch the error just as it catches your other errors).
    let parsedId = ObjectId(id);
    return parsedId;
}

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, '').length > 0;
}

const exportedMethods = {
    async getAllPosts() {
        const postCollection = await posts();
        return await postCollection.find({}).toArray();
    },

    async getPostById(id) {
        if (!id) throw new Error('No id provided');
        if (!stringCheck(id)) throw new Error('Id must be a non-empty string.');
        if (!ObjectId.isValid(id)) throw new Error('Invalid objectId');

        const queryId = stringToId(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: queryId });
        if (post === null) throw new Error('No post with that id.');

        post._id = post._id.toString();
        post.userThatPosted._id = post.userThatPosted._id.toString();
        for (const comment of post.comments) {
            comment._id = comment._id.toString();
            comment.userThatPostedComment._id = comment.userThatPostedComment._id.toString();
        }
        return post;
    },
    async createPost(title, body, userThatPosted) {
        if (!title) throw new Error('No title provided');
        if (!body) throw new Error('No body provided');
        if (!userThatPosted) throw new Error('No user for post provided');
        if (!stringCheck(title)) throw new Error('Title must be a non-empty string');
        if (!stringCheck(body)) throw new Error('Body must be a non-empty string');
        if (typeof userThatPosted !== 'object' || !userThatPosted._id || !userThatPosted.username)
            throw new Error('Invalid user provided');

        const postCollection = await posts();

        const newPost = {
            title: title,
            body: body,
            userThatPosted: { _id: stringToId(userThatPosted._id), username: userThatPosted.username },
            comments: [],
        };

        const newInsertInformation = await postCollection.insertOne(newPost);
        const newId = newInsertInformation.insertedId.toString();
        return await this.getPostById(newId);
    },
    async updatePost(id, updatedPost) {
        if (!id) throw new Error('No id provided');
        if (!stringCheck(id)) throw new Error('Id must be a non-empty string.');
        if (!ObjectId.isValid(id)) throw new Error('Invalid objectId');

        const updatedPostData = {};
        const postCollection = await posts();

        if (updatedPost.title) {
            updatedPostData.title = updatedPost.title;
        }
        if (updatedPost.body) {
            updatedPostData.body = updatedPost.body;
        }
        const queryId = stringToId(id);

        await postCollection.updateOne({ _id: queryId }, { $set: updatedPostData });

        return await this.getPostById(id);
    },
};

module.exports = exportedMethods;

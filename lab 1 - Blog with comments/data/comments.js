const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const { ObjectId } = require('mongodb');

function stringToId(id) {
    //Code from lab4 assignment
    //check to make sure we have input at all
    if (!id) throw 'Id parameter must be supplied';

    //check to make sure it's a string
    if (typeof id !== 'string') throw 'Id must be a string';

    //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
    //if it fails, it will throw an error (you do not have to throw the error, it does it automatically and the catch where you call the function will catch the error just as it catches your other errors).
    let parsedId = ObjectId(id);
    return parsedId;
}

const checkString = (str, variableName) => {
    if (typeof str !== 'string' || str.trim().length === 0)
        throw new Error(`${variableName} must be a non-empty string`);
};

module.exports = {
    async create(postId, userThatPostedComment, comment) {
        if (!postId) throw new Error('No postId provided');
        if (!userThatPostedComment) throw new Error('No user for comment provided');
        if (!comment) throw new Error('No comment text provided');

        checkString(postId, 'postId');
        checkString(comment, 'comment');

        if (!userThatPostedComment._id || !userThatPostedComment.username)
            throw new Error('Invalid user for new comment');
        if (!ObjectId.isValid(postId)) throw new Error('Invalid objectId for post');

        const queryId = stringToId(postId);
        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: queryId });
        if (post === null) throw new Error('No post with that id.');

        const newComment = {
            _id: ObjectId(),
            userThatPostedComment: {
                _id: stringToId(userThatPostedComment._id),
                username: userThatPostedComment.username,
            },
            comment: comment,
        };

        post.comments = post.comments.push(newComment);

        await postCollection.updateOne({ _id: queryId }, { $push: { comments: newComment } });

        return newComment;
    },
    async removeComment(postId, commentId) {
        if (!postId) throw new Error('No commentId provided');
        if (!commentId) throw new Error('No commentId provided');
        checkString(postId, 'postId');
        checkString(commentId, 'commentId');
        if (!ObjectId.isValid(postId)) throw new Error('Invalid objectId for post');
        if (!ObjectId.isValid(commentId)) throw new Error('Invalid objectId for comment');

        queryPostId = stringToId(postId);
        queryCommentId = stringToId(commentId);

        const postCollection = await posts();
        await postCollection.updateOne({ _id: queryPostId }, { $pull: { comments: { _id: queryCommentId } } });
    },
};

const { ApolloServer, gql } = require('apollo-server');
const uuid = require('uuid'); //for generating _id's
const axios = require('axios');

const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//Where data is mapped

//Create the type definitions for the query and our data
const typeDefs = gql`
    type Query {
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
    }

    type ImagePost {
        id: String
        url: String
        posterName: String
        description: String
        userPosted: Boolean
        binned: Boolean
    }

    type Mutation {
        uploadImage(url: String!, description: String, posterName: String): ImagePost

        updateImage(
            id: String!
            url: String
            posterName: String
            description: String
            userPosted: Boolean
            binned: Boolean
        ): ImagePost

        deleteImage(id: String!): ImagePost
    }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            let posts = [];
            let { data } = await axios.get(
                `https://api.unsplash.com/photos/?client_id=8uCgm_Z6bypVi6bzrcDrpeeltWdX54mnnCBdqs30htY&page=${args.pageNum}`
            );
            const cache = await client.lrangeAsync('cache', 0, -1).map(JSON.parse);

            data.map((photo) => {
                const newImagePost = {
                    id: photo.id,
                    url: photo.urls.small,
                    posterName: photo.user.name,
                    description: photo.description ? photo.description : 'No Description',
                    userPosted: false,
                    binned: cache.find((post) => post.id === photo.id) ? true : false,
                };
                posts.push(newImagePost);
            });
            return posts;
        },
        binnedImages: async (_, args) => {
            //Go to redis and retrieve all of the objects that are there some client.getAsync
            let exists = await client.existsAsync('cache');
            if (exists) {
                const cache = await client.lrangeAsync('cache', 0, -1).map(JSON.parse);
                return cache.filter((post) => post.binned === true);
            } else {
                return [];
            }
        },

        userPostedImages: async (_, args) => {
            //Go to redis and retrieve all of the objects that are there some client.getAsync
            let exists = await client.existsAsync('cache');
            if (exists) {
                const cache = await client.lrangeAsync('cache', 0, -1).map(JSON.parse);
                return cache.filter((post) => post.userPosted === true);
            } else {
                return [];
            }
        },
    },

    Mutation: {
        uploadImage: async (_, args) => {
            let posterName = 'No poster name.';
            let description = 'No description.';
            if (args.description && args.description.trim() !== '') {
                posterName = args.posterName;
            }
            if (args.posterName && args.description.trim() !== '') {
                description = args.description;
            }

            const newImagePost = {
                id: uuid.v4(),
                url: args.url,
                posterName: posterName,
                description: description,
                userPosted: true,
                binned: false,
            };

            await client.lpushAsync('cache', JSON.stringify(newImagePost));
            return newImagePost;
        },

        updateImage: async (_, args) => {
            let currentData = {};

            let cache = await client.lrangeAsync('cache', 0, -1).map(JSON.parse);
            currentData = cache.find((post) => post.id === args.id);

            //Post is already in cache and is being binned/unbinned
            if (currentData) {
                //Remove old data from cache
                await client.lremAsync('cache', 0, JSON.stringify(currentData));
                if (currentData.userPosted && !currentData.binned) {
                    //If a user has posted but not binned
                    currentData.binned = true;
                    await client.lpushAsync('cache', JSON.stringify(currentData));
                    return currentData;
                } else if (currentData.userPosted && currentData.binned) {
                    //Want to unbin a userpost
                    currentData.binned = false;
                    await client.lpushAsync('cache', JSON.stringify(currentData));
                    return currentData;
                } else {
                    //Remove from bin
                    currentData.binned = false;
                    return currentData;
                }
            } else {
                //Post is not in cache and must be added
                const newImagePost = {
                    id: args.id,
                    url: args.url,
                    posterName: args.posterName,
                    description: args.description,
                    userPosted: args.userPosted,
                    binned: true,
                };
                await client.lpushAsync('cache', JSON.stringify(newImagePost));
                return newImagePost;
            }

            //args.url ? (updatedPostData.url = args.url) : currentData.url;
            //args.posterName
            //    ? (updatedPostData.posterName = args.posterName)
            //    : currentData.posterName;
            //args.description
            //    ? (updatedPostData.description = args.description)
            //    : currentData.description;
            //args.userPosted
            //    ? (updatedPostData.userPosted = args.userPosted)
            //    : currentData.userPosted;
            //args.binned ? (updatedPostData.binned = args.binned) : currentData.binned;
        },

        deleteImage: async (_, args) => {
            let cache = await client.lrangeAsync('cache', 0, -1).map(JSON.parse);
            currentData = cache.filter((post) => post.id === args.id)[0];

            let exists = client.existsAsync(JSON.stringify(currentData));
            if (exists) {
                await client.lremAsync('cache', 0, JSON.stringify(currentData));
                currentData.userPosted = false;
                return currentData;
            } else {
                console.log('deleteImage was not successful post not found');
            }
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url} 🚀`);
});

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const bcrypt = require('bcryptjs');
const saltRounds = 12;

//546 lab 10 user code used
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

let exportedMethods = {
    async createUser(name, username, password) {
        if (!name) throw new Error('No name provided');
        if (!stringCheck(name)) throw new Error('Name must be a non-empty string');
        validUserPass(username, password);

        const newUsername = username.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userCollection = await users();

        const duplicateUser = await userCollection.findOne({ username: newUsername });
        if (duplicateUser !== null) throw new Error(`User with username: ${newUsername} already exists!`);

        const newUser = {
            name: name,
            username: newUsername,
            password: hashedPassword,
        };
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw new Error('Could not add user.');

        const insertedUser = await userCollection.findOne({ username: newUsername });
        return {
            _id: insertedUser._id.toString(),
            name: insertedUser.name,
            username: insertedUser.username,
        };
    },
    async checkUser(username, password) {
        validUserPass(username, password);

        const newUsername = username.trim().toLowerCase();

        const userCollection = await users();
        const user = await userCollection.findOne({ username: newUsername });
        if (user === null) throw new Error('Either the username or password is invalid');
        if (await bcrypt.compare(password, user.password)) {
            return {
                _id: user._id.toString(),
                name: user.name,
                username: user.username,
            };
        } else {
            throw new Error('Either the username or password is invalid');
        }
    },
};

module.exports = exportedMethods;

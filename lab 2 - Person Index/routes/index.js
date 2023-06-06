const peopleRoutes = require("./people");

const constructorMethod = (app) => {
    app.use("/api/people", peopleRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;

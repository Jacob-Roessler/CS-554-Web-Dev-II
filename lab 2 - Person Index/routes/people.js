const express = require("express");
const router = express.Router();
const data = require("../data");
const bluebird = require("bluebird");
const redis = require("redis");

const peopleData = data.people;

const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/history", async (req, res) => {
    let history = (await client.lrangeAsync("Visitors", 0, 19)).map(JSON.parse);
    res.status(200).json(history);
});

router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: "No id provided" });
        return;
    }
    let exists = await client.existsAsync(req.params.id);
    if (exists) {
        let person = JSON.parse(await client.getAsync(req.params.id));
        res.status(200).json(person);
        await client.lpushAsync("Visitors", JSON.stringify(person));
    } else {
        try {
            let person = await peopleData.getById(req.params.id);
            let jsonString = JSON.stringify(person);
            await client.lpushAsync("Visitors", jsonString);
            await client.setAsync(req.params.id, jsonString);
            res.status(200).json(person);
        } catch (e) {
            res.status(400).json(e.message);
        }
    }
});

module.exports = router;

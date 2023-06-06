const express = require("express");
const axios = require("axios");
const app = express();

const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//Todo add redis stuff

app.listen(3001, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3001");
});

app.get("/pokemon/page/:pagenum", async (req, res) => {
    let pagenum = parseInt(req.params.pagenum);

    const exists = await client.hexistsAsync("pagecache", pagenum);
    if (exists) {
        const data = await client.hgetAsync("pagecache", pagenum);
        res.send(JSON.parse(data));
        return;
    }

    try {
        let { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon?limit=${20}&offset=${pagenum * 20}`
        );
        if (data.results.length === 0) {
            res.status(404).send({ error: `No pokemon on page ${pagenum}` });
            return;
        }

        await client.hsetAsync("pagecache", pagenum, JSON.stringify(data));
        res.send(data);
    } catch (e) {
        res.status(404).send({ error: `Request Failed` });
        console.log(e.message);
    }
});

app.get("/pokemon/:id", async (req, res) => {
    const exists = await client.hexistsAsync("pokemoncache", req.params.id);
    if (exists) {
        const data = await client.hgetAsync("pokemoncache", req.params.id);
        res.send(JSON.parse(data));
        return;
    }

    try {
        let { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}/`);

        if (!data) {
            res.status(404).send({ error: `Pokemon with id ${req.params.id} not found` });
            return;
        }
        await client.hsetAsync("pokemoncache", req.params.id, JSON.stringify(data));
        res.send(data);
    } catch (e) {
        res.status(404).send({ error: `Pokemon with id ${req.params.id} not found` });
        return;
    }
});

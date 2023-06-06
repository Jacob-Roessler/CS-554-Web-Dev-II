const data = require("./lab2.json");

let exportedMethods = {
    getById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // find project
                id = parseInt(id);
                const found = data.find((p) => p.id === id);
                if (found) {
                    resolve(found);
                } else {
                    reject(new Error(`Error: Person with id ${id} not found!`));
                }
            }, 5000);
        });
    },
};

module.exports = exportedMethods;

const addTrainer = (name) => ({
    type: "CREATE_TRAINER",
    payload: {
        name: name,
    },
});

const deleteTrainer = (id) => ({
    type: "DELETE_TRAINER",
    payload: { id: id },
});

const selectTrainer = (id) => ({
    type: "SELECT_TRAINER",
    payload: { id: id },
});

const addPokemon = (id, pokemon) => ({
    type: "ADD_POKEMON",
    payload: {
        id: id,
        pokemon: pokemon,
    },
});

const removePokemon = (id, pokemon) => ({
    type: "REMOVE_POKEMON",
    payload: {
        id: id,
        pokemon: pokemon,
    },
});

module.exports = {
    addTrainer,
    deleteTrainer,
    selectTrainer,
    addPokemon,
    removePokemon,
};

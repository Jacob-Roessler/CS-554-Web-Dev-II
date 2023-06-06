import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "react-bootstrap/Button";

import actions from "../actions";

function AddPokemon() {
    const dispatch = useDispatch();
    const { id } = useParams();
    let pid = parseInt(id);
    const allTrainers = useSelector((state) => state.trainers);
    let activeTrainer = allTrainers.find((trainer) => trainer.selected);

    const addPokemon = (pokemonId) => {
        dispatch(actions.addPokemon(activeTrainer.id, parseInt(pokemonId)));
    };

    const removePokemon = (pokemonId) => {
        dispatch(actions.removePokemon(activeTrainer.id, parseInt(pokemonId)));
    };

    return (
        <div>
            {" "}
            {activeTrainer &&
                (activeTrainer.team.find((p) => p === pid) ? (
                    <Button
                        variant="outline-danger"
                        id={pid}
                        onClick={(e) => removePokemon(e.target.id)}
                    >
                        Remove Pokemon
                    </Button>
                ) : activeTrainer.team.length >= 6 ? (
                    <Button variant="outline-dark">Party Full</Button>
                ) : (
                    <Button
                        variant="outline-success"
                        id={pid}
                        onClick={(e) => addPokemon(e.target.id)}
                    >
                        Add Pokemon
                    </Button>
                ))}
        </div>
    );
}

export default AddPokemon;

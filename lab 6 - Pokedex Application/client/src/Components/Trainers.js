import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Button from "react-bootstrap/Button";

function Trainers() {
    const dispatch = useDispatch();
    const [addBtnToggle, setBtnToggle] = useState(false);
    const [formData, setFormData] = useState({ task: "", taskDesc: "" });
    const allTrainers = useSelector((state) => state.trainers);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const addTrainer = () => {
        dispatch(actions.addTrainer(formData.name));
        document.getElementById("name").value = "";
    };
    const selectTrainer = (id) => {
        dispatch(actions.selectTrainer(id));
    };
    const deleteTrainer = (id) => {
        dispatch(actions.deleteTrainer(id));
    };

    console.log("allTrainers", allTrainers);
    return (
        <div className="trainer-wrapper">
            <h2>Trainers</h2>
            <Button variant="success" onClick={() => setBtnToggle(!addBtnToggle)}>
                Add A Trainer
            </Button>
            <br />
            <br />
            <br />
            {addBtnToggle && (
                <div className="add">
                    <div className="input-selection">
                        <label>
                            Name:
                            <input
                                onChange={(e) => handleChange(e)}
                                id="name"
                                name="name"
                                placeholder="Name..."
                            />
                        </label>
                    </div>
                    <button onClick={addTrainer}>Add Trainer</button>
                </div>
            )}
            <br />
            {allTrainers.map((trainer) => {
                console.log(trainer);
                return (
                    <div className="individual-trainer" key={trainer.id}>
                        <div className="trainer-header">
                            {trainer.name}
                            {trainer.selected && (
                                <Button
                                    variant="success"
                                    id={trainer.id}
                                    onClick={(e) => selectTrainer(e.target.id)}
                                >
                                    Selected
                                </Button>
                            )}
                            {!trainer.selected && (
                                <Button id={trainer.id} onClick={(e) => selectTrainer(e.target.id)}>
                                    Select
                                </Button>
                            )}
                            {!trainer.selected && (
                                <Button
                                    variant="danger"
                                    id={trainer.id}
                                    onClick={(e) => deleteTrainer(e.target.id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                        <CardGroup>
                            {trainer.team.map((pokemonId,index) => {
                                return (
                                    <Card key={`${pokemonId}${index}`}>
                                        {" "}
                                        <Link to={`../pokemon/${pokemonId}`} className="hidden">
                                            {" "}
                                            Open Page
                                            <Card.Img
                                                alt={pokemonId}
                                                variant="top"
                                                style={{ "maxWidth": "18rem" }}
                                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                                            ></Card.Img>
                                        </Link>
                                        <Card.Body></Card.Body>
                                    </Card>
                                );
                            })}
                        </CardGroup>
                    </div>
                );
            })}
        </div>
    );
}

export default Trainers;

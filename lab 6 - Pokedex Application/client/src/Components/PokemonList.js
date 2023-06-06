import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import actions from "../actions";
import AddPokemon from "./AddPokemon";

import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";

const axios = require("axios");

const PokemonList = () => {
    let { pagenum } = useParams();
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const allTrainers = useSelector((state) => state.trainers);
    let activeTrainer = allTrainers.find((trainer) => trainer.selected);

    const [pageNum, setPageNum] = useState(parseInt(pagenum));
    const [lastPageNum, setLastPageNum] = useState(parseInt(-1));
    const [pokemonData, setPokemonData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const paginate = (page) => {
        setPageNum(page);
        navigate(`/pokemon/page/${page}`);
    };

    const addPokemon = (pokemonId) => {
        dispatch(actions.addPokemon(activeTrainer.id, parseInt(pokemonId)));
    };

    const removePokemon = (pokemonId) => {
        dispatch(actions.removePokemon(activeTrainer.id, parseInt(pokemonId)));
    };

    useEffect(() => {
        console.log(`load page ${pageNum}`);

        async function fetchData() {
            try {
                const { data } = await axios.get(`/pokemon/page/${pageNum}`);
                setPokemonData(data.results);
                console.log(data);
                setLastPageNum(Math.floor(data.count / 20));
                setLoading(false);
            } catch (e) {
                setError(true);
                console.log(e);
            }
        }
        setLoading(true);
        setError(false);
        fetchData();
    }, [pageNum]);

    if (error) {
        return (
            <div>
                <h2>404 Error: No data was found for this page</h2>
            </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (pokemonData) {
        return (
            <div className="pokemon-body">
                <div className="pagination">
                    {pageNum !== 0 && (
                        <Button variant="dark" onClick={() => paginate(pageNum - 1)}>
                            Prev
                        </Button>
                    )}
                    {pageNum !== lastPageNum && (
                        <Button variant="dark" onClick={() => paginate(pageNum + 1)}>
                            Next
                        </Button>
                    )}
                </div>
                <Row xs={2} md={5} className="g-4">
                    {pokemonData.map((pokemon, index) => {
                        let id = parseInt(pokemon.url.split("/").at(-2));
                        return (
                            <Col key={pokemon.name}>
                                <Card>
                                    <Card.Img
                                        variant="top"
                                        alt={pokemon.name}
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                                    />
                                    <Card.Body>
                                        <Card.Title>
                                            <Link to={`../pokemon/${id}`}>{pokemon.name}</Link>
                                            <br />
                                            {activeTrainer &&
                                                (activeTrainer.team.find((pid) => pid === id) ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        id={id}
                                                        onClick={(e) => removePokemon(e.target.id)}
                                                    >
                                                        Remove Pokemon
                                                    </Button>
                                                ) : activeTrainer.team.length >= 6 ? (
                                                    <Button variant="outline-dark">
                                                        Party Full
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline-success"
                                                        id={id}
                                                        onClick={(e) => addPokemon(e.target.id)}
                                                    >
                                                        Add Pokemon
                                                    </Button>
                                                ))}
                                        </Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>{" "}
            </div>
        );
    }
};

export default PokemonList;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddPokemon from "./AddPokemon";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
const axios = require("axios");

function Pokemon() {
    let { id } = useParams();
    const [pokemonId, setPokemonId] = useState(id);
    const [pokemonData, setPokemonData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log(`load pokemon ${pokemonId}`);

        async function fetchData() {
            try {
                const { data } = await axios.get(`/pokemon/${pokemonId}`);
                setPokemonData(data);
                console.log(data);
                setLoading(false);
            } catch (e) {
                setError(true);
                console.log(e);
            }
        }
        setLoading(true);
        setError(false);
        fetchData();
    }, []);

    if (error) {
        return <div>404 Pokemon not found</div>;
    } else if (loading) {
        return <div>Loading</div>;
    } else if (pokemonData) {
        return (
            <div className="pokemon-wrapper">
                <Card style={{ width: "18rem" }} className="text-center">
                    <Card.Img
                        variant="top"
                        src={pokemonData.sprites.other["official-artwork"].front_default}
                        alt={pokemonData.name}
                    />
                    <Card.Body>
                        <Card.Title>{pokemonData.name}</Card.Title>
                        <AddPokemon id={pokemonData.id}></AddPokemon>
                        <Card.Header>Types</Card.Header>
                        <ListGroup variant="flush">
                            {pokemonData.types.map((type,index) => {
                                return (
                                    <ListGroup.Item key={type + index}>
                                        Slot {type.slot}: {type.type.name}
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                        <Card.Header>Abilities</Card.Header>
                        <ListGroup variant="flush">
                            {pokemonData.abilities.map((ability,index) => {
                                return (
                                    <ListGroup.Item key={ability + index}>
                                        Slot {ability.slot}: {ability.ability.name}
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    </Card.Body>
                    <Card.Footer className="text-muted"></Card.Footer>
                </Card>
            </div>
        );
    }
}

export default Pokemon;

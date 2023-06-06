import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import {
    makeStyles,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardHeader,
} from '@material-ui/core';
import '../App.css';
const useStyles = makeStyles({
    card: {
        maxWidth: 550,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #1e8678',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
    },
    titleHead: {
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold',
    },
    grid: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    media: {
        height: '100%',
        width: '100%',
    },
    button: {
        color: '#1e8678',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

const Character = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    const [ID, setId] = useState(id);
    const [characterData, setCharacterData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();

    useEffect(() => {
        console.log('useEffect fired');
        async function fetchData() {
            try {
                const md5 = require('blueimp-md5');
                const publickey = 'a073f8cba64ac8124119f0c2b0deb273';
                const privatekey = '316fa043bb6fc4cce48dcf26217ea6b46f32fff5';
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${ID}`;
                const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                try {
                    const { data } = await axios.get(url);
                    const character = data.data.results[0];
                    setCharacterData(character);
                } catch (e) {
                    navigate('NotFound');
                }
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [navigate]);

    let description = null;
    const regex = /(<([^>]+)>)/gi;
    if (characterData && characterData.description) {
        description = characterData && characterData.description.replace(regex, '');
    } else {
        description = 'No description';
    }

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        return (
            <Card className={classes.card} variant='outlined'>
                <CardHeader className={classes.titleHead} title={characterData.name} />
                <CardMedia
                    className={classes.media}
                    component='img'
                    image={
                        `${characterData.thumbnail.path}/portrait_medium.${characterData.thumbnail.extension}`
                            ? `${characterData.thumbnail.path}/portrait_medium.${characterData.thumbnail.extension}`
                            : noImage
                    }
                    title='show image'
                />

                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='div'>
                        <dl>
                            <dt className='title'>Description:</dt>
                            <dd>{description}</dd>

                            <dt className='title'>Comics:</dt>
                            {characterData.comics.available > 0 ? (
                                characterData.comics.items.map((comic, index) => {
                                    if (characterData.comics.available > 1)
                                        return <dd key={index + comic.name}>{comic.name},</dd>;
                                    return <dd key={index + comic.name}>{comic.name}</dd>;
                                })
                            ) : (
                                <dd>No comics</dd>
                            )}

                            <dt className='title'>Series:</dt>
                            {characterData.series.available > 0 ? (
                                characterData.series.items.map((serie, index) => {
                                    if (
                                        characterData.series.available > 1 &&
                                        index !== characterData.series.available
                                    )
                                        return <dd key={index + serie.name}>{serie.name},</dd>;
                                    return <dd key={index + serie.name}>{serie.name}</dd>;
                                })
                            ) : (
                                <dd>No series</dd>
                            )}

                            <dt className='title'>Stories:</dt>
                            {characterData.stories.available > 0 ? (
                                characterData.stories.items.map((story, index) => {
                                    if (characterData.stories.available > 1)
                                        return <dd key={index + story.name}>{story.name},</dd>;
                                    return <dd key={index + story.name}>{story.name}</dd>;
                                })
                            ) : (
                                <dd>No stories</dd>
                            )}
                        </dl>
                        <Link to='/characters/page/0'>Back to all characters...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};

export default Character;

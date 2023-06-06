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

const Series = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    const [ID, setId] = useState(id);
    const [seriesData, setSeriesData] = useState(undefined);
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
                const baseUrl = `https://gateway.marvel.com:443/v1/public/series/${ID}`;
                const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                try {
                    const { data } = await axios.get(url);
                    const series = data.data.results[0];
                    setSeriesData(series);
                    console.log(series);
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
    if (seriesData && seriesData.description) {
        description = seriesData && seriesData.description.replace(regex, '');
    } else {
        description = 'No description';
    }

    let rating = null;
    if (seriesData && seriesData.rating) {
        rating = seriesData && seriesData.rating.replace(regex, '');
    } else {
        rating = 'No rating';
    }

    let startYear = null;
    if (seriesData && seriesData.startYear) {
        startYear = seriesData && seriesData.startYear;
    } else {
        startYear = 'No Start Year';
    }

    let endYear = null;
    if (seriesData && seriesData.endYear) {
        endYear = seriesData && seriesData.endYear;
    } else {
        endYear = 'No End Year';
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
                <CardHeader className={classes.titleHead} title={seriesData.title} />
                <CardMedia
                    className={classes.media}
                    component='img'
                    image={
                        `${seriesData.thumbnail.path}/portrait_medium.${seriesData.thumbnail.extension}`
                            ? `${seriesData.thumbnail.path}/portrait_medium.${seriesData.thumbnail.extension}`
                            : noImage
                    }
                    title='show image'
                />

                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='div'>
                        <dl>
                            <dt className='title'>Description:</dt>
                            <dd>{description}</dd>

                            <dt className='title'>Rating:</dt>
                            <dd>{rating}</dd>

                            <dt className='title'>Start year:</dt>
                            <dd>{startYear}</dd>

                            <dt className='title'>End year:</dt>
                            <dd>{endYear}</dd>

                            <dt className='title'>Creators:</dt>
                            {seriesData.creators.available > 0 ? (
                                seriesData.creators.items.map((creator) => {
                                    if (seriesData.creators.available > 1)
                                        return <dd key={creator.name}>{creator.name},</dd>;
                                    return <dd key={creator.name}>{creator.name}</dd>;
                                })
                            ) : (
                                <dd>No creators</dd>
                            )}

                            <dt className='title'>Characters:</dt>
                            {seriesData.characters.available > 0 ? (
                                seriesData.characters.items.map((character) => {
                                    if (seriesData.characters.available > 1)
                                        return <dd key={character.name}>{character.name},</dd>;
                                    return <dd key={character.name}>{character.name}</dd>;
                                })
                            ) : (
                                <dd>No characters</dd>
                            )}

                            <dt className='title'>Stories:</dt>
                            {seriesData.stories.available > 0 ? (
                                seriesData.stories.items.map((story, index) => {
                                    if (seriesData.stories.available > 1)
                                        return <dd key={index + story.name}>{story.name},</dd>;
                                    return <dd key={index + story.name}>{story.name}</dd>;
                                })
                            ) : (
                                <dd>No stories</dd>
                            )}

                            <dt className='title'>Comics:</dt>
                            {seriesData.comics.available > 0 ? (
                                seriesData.comics.items.map((comic, index) => {
                                    if (seriesData.comics.available > 1)
                                        return <dd key={index + comic.name}>{comic.name},</dd>;
                                    return <dd key={index + comic.name}>{comic.name}</dd>;
                                })
                            ) : (
                                <dd>No comics</dd>
                            )}
                        </dl>
                        <Link to='/series/page/0'>Back to all series...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};

export default Series;

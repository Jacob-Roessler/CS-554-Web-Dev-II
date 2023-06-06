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

const Comic = () => {
    let { id } = useParams();
    let navigate = useNavigate();
    const [ID, setId] = useState(id);
    const [comicData, setComicData] = useState(undefined);
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
                const baseUrl = `https://gateway.marvel.com:443/v1/public/comics/${ID}`;
                const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                try {
                    const { data } = await axios.get(url);
                    const comic = data.data.results[0];
                    setComicData(comic);
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
    if (
        comicData &&
        comicData.textObjects &&
        comicData.textObjects[0] &&
        comicData.textObjects[0].text
    ) {
        description = comicData && comicData.textObjects[0].text.replace(regex, '');
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
                <CardHeader className={classes.titleHead} title={comicData.title} />
                <CardMedia
                    className={classes.media}
                    component='img'
                    image={
                        `${comicData.thumbnail.path}/portrait_medium.${comicData.thumbnail.extension}`
                            ? `${comicData.thumbnail.path}/portrait_medium.${comicData.thumbnail.extension}`
                            : noImage
                    }
                    title='show image'
                />

                <CardContent>
                    <Typography variant='body2' color='textSecondary' component='div'>
                        <dl>
                            <dt className='title'>Description:</dt>
                            <dd>{description}</dd>

                            <dt className='title'>Dates:</dt>
                            {comicData.dates.map((date) => {
                                if (comicData.dates.length > 1)
                                    return (
                                        <dd key={date.type}>
                                            {date.type}: {date.date},
                                        </dd>
                                    );
                                return (
                                    <dd key={date.type}>
                                        {date.type}: {date.date}
                                    </dd>
                                );
                            })}
                            <dt className='title'>Prices:</dt>
                            {comicData.prices.map((price) => {
                                if (comicData.prices.length > 1)
                                    return (
                                        <dd key={price.type}>
                                            {price.type}: {price.price},
                                        </dd>
                                    );
                                return (
                                    <dd key={price.type}>
                                        {price.type}: {price.price}
                                    </dd>
                                );
                            })}

                            <dt className='title'>Creators:</dt>

                            {comicData.available > 0 ? (
                                comicData.creators.items.map((creator) => {
                                    if (comicData.creators.available > 1)
                                        return <dd key={creator.name}>{creator.name},</dd>;
                                    return <dd key={creator.name}>{creator.name}</dd>;
                                })
                            ) : (
                                <dd>No creators</dd>
                            )}
                        </dl>
                        <Link to='/comics/page/0'>Back to all comics...</Link>
                    </Typography>
                </CardContent>
            </Card>
        );
    }
};

export default Comic;

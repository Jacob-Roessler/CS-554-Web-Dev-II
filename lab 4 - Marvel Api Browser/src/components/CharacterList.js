import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Search from './Search';
import Pagination from '@material-ui/lab/Pagination';
import noImage from '../img/download.jpeg';
import { Card, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
    card: {
        maxWidth: 250,
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

const CharacterList = (props) => {
    let { pagenum } = useParams();
    if (parseInt(pagenum) === 0) pagenum = 1;
    let navigate = useNavigate();

    const regex = /(<([^>]+)>)/gi;
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [searchData, setSearchData] = useState(undefined);
    const [characterData, setCharacterData] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastPage, setLastPage] = useState(-1);
    const [errored, setErrored] = useState(false);
    const [pageNum, setPageNum] = useState(parseInt(pagenum));

    let card = null;
    const paginationHandler = (event, value) => {
        value = parseInt(value);
        console.log(value);
        setPageNum(value);
        navigate(`../characters/page/${value}`, { replace: true });
    };

    //const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    //const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    useEffect(() => {
        console.log('search useEffect fired');
        async function fetchData() {
            try {
                console.log(`in fetch searchTerm: ${searchTerm}`);
                const md5 = require('blueimp-md5');
                const publickey = 'a073f8cba64ac8124119f0c2b0deb273';
                const privatekey = '316fa043bb6fc4cce48dcf26217ea6b46f32fff5';
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseUrl = `https://gateway.marvel.com:443/v1/public/characters`;
                const url =
                    baseUrl +
                    '?ts=' +
                    ts +
                    '&nameStartsWith=' +
                    searchTerm +
                    '&limit=' +
                    20 +
                    '&apikey=' +
                    publickey +
                    '&hash=' +
                    hash;
                console.log(url);
                const { data } = await axios.get(url);
                setSearchData(data.data.results);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        if (searchTerm) {
            console.log('searchTerm is set');
            fetchData();
        }
    }, [searchTerm]);

    useEffect(() => {
        console.log('page useEffect fired');
        async function fetchData() {
            try {
                let offset = 20 * (pageNum - 1);
                const md5 = require('blueimp-md5');
                const publickey = 'a073f8cba64ac8124119f0c2b0deb273';
                const privatekey = '316fa043bb6fc4cce48dcf26217ea6b46f32fff5';
                const ts = new Date().getTime();
                const stringToHash = ts + privatekey + publickey;
                const hash = md5(stringToHash);
                const baseUrl = `https://gateway.marvel.com:443/v1/public/characters`;
                const url =
                    baseUrl +
                    '?ts=' +
                    ts +
                    '&limit=' +
                    20 +
                    '&offset=' +
                    offset +
                    '&apikey=' +
                    publickey +
                    '&hash=' +
                    hash;
                console.log(url);
                const { data } = await axios.get(url);
                if (data.data.results.length === 0) {
                    navigate('notfound');
                }
                setCharacterData(data.data.results);
                setLastPage(Math.ceil(data.data.total / 20));
                setLoading(false);
            } catch (e) {
                setErrored(true);
                console.log(e);
            }
        }
        setLoading(true);
        setErrored(false);
        fetchData();
    }, [pageNum, navigate]);

    const searchValue = async (value) => {
        setSearchTerm(value);
    };
    const buildCard = (character) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={character.id}>
                <Card className={classes.card} variant='outlined'>
                    <Link to={`/characters/${character.id}`}>
                        <CardMedia
                            className={classes.media}
                            component='img'
                            image={
                                `${character.thumbnail.path}/portrait_medium.${character.thumbnail.extension}`
                                    ? `${character.thumbnail.path}/portrait_medium.${character.thumbnail.extension}`
                                    : noImage
                            }
                            title='character image'
                        />
                        <CardContent>
                            <Typography
                                className={classes.titleHead}
                                gutterBottom
                                variant='h6'
                                component='h2'
                            >
                                {character.name}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                {character.description
                                    ? character.description.replace(regex, '').substring(0, 139) +
                                      '...'
                                    : 'No Summary'}
                                <span></span>
                            </Typography>
                        </CardContent>
                    </Link>
                </Card>
            </Grid>
        );
    };

    if (searchTerm) {
        card =
            searchData &&
            searchData.map((character) => {
                return buildCard(character);
            });
    } else {
        card =
            characterData &&
            characterData.map((character) => {
                return buildCard(character);
            });
    }
    if (errored) {
        return (
            <div>
                <h2>Error: No data was found for this page</h2>
                <Link className='showlink' to='/characters/page/0'>
                    {' '}
                    return to characters list{' '}
                </Link>
            </div>
        );
    }
    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        if (searchTerm) {
            return (
                <div>
                    <Search page='Characters' searchValue={searchValue} />
                    <br />
                    <br />
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                </div>
            );
        } else {
            return (
                <div>
                    <Search page='Characters' searchValue={searchValue} />
                    <br />
                    <br />
                    <Pagination
                        count={lastPage}
                        page={pageNum}
                        className={classes.pagination}
                        onChange={paginationHandler}
                        variant='outlined'
                        shape='rounded'
                    />{' '}
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                </div>
            );
        }
    }
};

export default CharacterList;

import React from 'react';
import '../App.css';

const Home = () => {
    return (
        <div>
            <p>
                This is a simple example of using React to Query the Marvel API. Start by clicking
                any of the categories above to explore their content.
            </p>

            <p className='hometext'>
                The application queries three of Marvel's end-points however these will not work
                without your own api keys:{' '}
                <a
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://gateway.marvel.com:443/v1/public/characters'
                >
                    https://gateway.marvel.com:443/v1/public/characters
                </a>{' '}
                ,{' '}
                <a
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://gateway.marvel.com:443/v1/public/comics'
                >
                    https://gateway.marvel.com:443/v1/public/comics
                </a>{' '}
                , and{' '}
                <a
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://gateway.marvel.com:443/v1/public/series'
                >
                    https://gateway.marvel.com:443/v1/public/series
                </a>
            </p>
        </div>
    );
};

export default Home;

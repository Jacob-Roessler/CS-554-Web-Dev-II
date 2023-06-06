import React from 'react';

import Card from 'react-bootstrap/Card';

function Home() {
    return (
        <Card className="text-center">
            <Card.Body>
                <Card.Title>Welcome to the react-redux pokemon api for lab 6!</Card.Title>
                <Card.Text>
                    This lab uses an express server backend that caches data in redis in order to speed up repeated api
                    calls. React is used for the frontend that implements redux to store trainers and their teams of
                    pokemon. Go to the trainer page to create your own trainer or just use the default one that is
                    selected at the start. To catch pokemon go to the Pokemon tab on the tap of the page and try
                    catching a few. You can also catch/release pokemon from their individual pages by clicking on them
                    either from the pokemon list or from the trainers tab if you have already added it to your team.
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                Lab by Jacob Roessler (10448394)
                <br />I pledge my honor that I have abided by the Stevens Honor System.
            </Card.Footer>
        </Card>
    );
}

export default Home;

import React, { useState } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';

function NewPost() {
    const [addImage, { data, loading, error }] = useMutation(queries.UPLOAD_IMAGE);

    return (
        <div className='newPost'>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addImage({
                        variables: {
                            url: e.target.url.value,
                            description: e.target.description.value,
                            posterName: e.target.posterName.value,
                        },
                    });

                    alert('Post Added');
                    e.target.reset();
                }}
            >
                <label>Create a Post</label>
                <br />
                <label for='url'>Image url:</label>
                <input type='url' id='url' name='url' required />

                <br />
                <label for='description'>Image Description:</label>
                <input type='text' id='description' name='description' />

                <br />
                <label for='posterName'>Poster name:</label>
                <input type='text' id='posterName' name='posterName' />

                <br />
                <input type='submit' value='Submit' />
            </form>
        </div>
    );
}

export default NewPost;

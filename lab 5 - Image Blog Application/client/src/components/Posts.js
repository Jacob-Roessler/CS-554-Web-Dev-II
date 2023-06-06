import React, { useState, useEffect } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../queries';
import { Link } from 'react-router-dom';

function Posts({ pageName }) {
    const [pageNum, setPageNum] = useState(1);
    let edited = 0;

    let { loading, error, data, fetchMore } = useQuery(
        pageName === 'unsplashImages'
            ? queries.GET_UNSPLASH
            : pageName === 'binnedImages'
            ? queries.GET_BINNED
            : queries.GET_POSTED,
        {
            variables: pageName === 'unsplashImages' ? { pageNum } : {},
            fetchPolicy: 'cache-and-network',
        }
    );

    const [updateBin] = useMutation(queries.EDIT_IMAGE);
    const [deletePost] = useMutation(queries.DELETE_IMAGE);

    useEffect(() => {
        console.log('useEffect has been called');

        fetchMore({
            variables: {
                page: pageNum,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                console.log(pageNum);
            },
        });
    }, [pageNum]);

    if (data) {
        let posts = data[pageName];
        return (
            <div className='posts-body'>
                {pageName === 'userPostedImages' && (
                    <div className='make-post'>
                        <Link className='new-link' to='/new-post'>
                            New Post
                        </Link>
                    </div>
                )}
                {pageName === 'unsplashImages' && (
                    <button
                        className='splash-button'
                        onClick={(e) => {
                            setPageNum(pageNum + 1);
                        }}
                    >
                        Get More
                    </button>
                )}
                {posts.map((post, index) => {
                    return (
                        <div className='card' key={post.id}>
                            <div className='card-body'>
                                <h2 className='card-title'>Post by: {post.posterName}</h2>
                                <h3 className='card-description'> {post.description} </h3>
                                <img
                                    src={post.url}
                                    className='post-image'
                                    alt={post.posterName}
                                ></img>
                                <br />
                                {!post.binned && (
                                    <button
                                        className='button'
                                        onClick={(e) => {
                                            edited = index;
                                            updateBin({
                                                variables: post,
                                            });
                                        }}
                                    >
                                        Add to bin
                                    </button>
                                )}
                                {post.binned && (
                                    <button
                                        className='button'
                                        onClick={(e) => {
                                            edited = index;
                                            updateBin({
                                                variables: {
                                                    id: post.id,
                                                },
                                            });
                                        }}
                                    >
                                        Remove from bin
                                    </button>
                                )}
                                {pageName === 'userPostedImages' && (
                                    <button
                                        className='button'
                                        onClick={(e) => {
                                            edited = index;
                                            deletePost({
                                                variables: {
                                                    id: post.id,
                                                },
                                            });
                                        }}
                                    >
                                        Delete post
                                    </button>
                                )}

                                <br />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }
}

export default Posts;

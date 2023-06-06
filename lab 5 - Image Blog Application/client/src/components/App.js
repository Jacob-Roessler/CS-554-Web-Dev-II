import React from 'react';
import './App.css';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import Posts from './Posts';
import NewPost from './NewPost';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import logo from '../img/trash_can_white.jpg';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'http://localhost:4000',
    }),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div>
                    <header className='App-header'>
                        <h1 className='App-title'>
                            {' '}
                            <img src={logo} className='logo' alt='logo' />
                            Binterest
                        </h1>
                        <nav>
                            <NavLink className='navlink' to='/my-bin'>
                                my bin
                            </NavLink>

                            <NavLink className='navlink' to='/'>
                                images
                            </NavLink>

                            <NavLink className='navlink' to='/my-posts'>
                                my posts
                            </NavLink>
                        </nav>
                    </header>

                    <Route
                        exact
                        path='/'
                        render={(props) => <Posts {...props} pageName={'unsplashImages'} />}
                    />
                    <Route
                        exact
                        path='/my-posts/'
                        render={(props) => <Posts {...props} pageName={'userPostedImages'} />}
                    />
                    <Route
                        exact
                        path='/my-bin/'
                        render={(props) => <Posts {...props} pageName={'binnedImages'} />}
                    />
                    <Route exact path='/new-post/' component={NewPost} />
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;

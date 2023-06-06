import React from 'react';
import logo from './img/marvel-logo.png';
import './App.css';
import CharacterList from './components/CharacterList';
import Character from './components/Character';
import ComicsList from './components/ComicsList';
import Comic from './components/Comic';
import SeriesList from './components/SeriesList';
import Series from './components/Series';
import Home from './components/Home';
import NotFound from './components/NotFound';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <div className='App'>
                <header className='App-header'>
                    <img src={logo} className='App-logo' alt='logo' />
                    <h1 className='App-title'>Welcome to the React.js Marvel API Lab 4</h1>
                    <Link className='showlink' to=''>
                        Home
                    </Link>
                    <Link className='showlink' to='characters/page/0'>
                        Characters
                    </Link>
                    <Link className='showlink' to='comics/page/0'>
                        Comics
                    </Link>
                    <Link className='showlink' to='series/page/0'>
                        Series
                    </Link>
                </header>
                <br />
                <br />
                <div className='App-body'>
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                        <Route exact path='/characters/page/:pagenum' element={<CharacterList />} />
                        <Route exact path='/characters/:id' element={<Character />} />
                        <Route exact path='/comics/page/:pagenum' element={<ComicsList />} />
                        <Route exact path='/comics/:id' element={<Comic />} />
                        <Route exact path='/series/page/:pagenum' element={<SeriesList />} />
                        <Route exact path='/series/:id' element={<Series />} />
                        <Route path='*' element={<NotFound status={404} />} />{' '}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

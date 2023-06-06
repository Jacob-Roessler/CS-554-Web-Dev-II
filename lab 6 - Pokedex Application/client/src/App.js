import "./App.css";
import PokemonList from "./Components/PokemonList";
import Pokemon from "./Components/Pokemon";
import Trainers from "./Components/Trainers";
import Home from "./Components/Home"

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";


function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <header className="App-header">
                        <h1 className="App-title">Lab 6 pokemon api</h1>
                        <nav>
                            <Link className="showlink" to="/trainers">
                                Pokemon Trainers
                            </Link>

                            <Link className="showlink" to="/pokemon/page/0">
                                Pokemon
                            </Link>
                        </nav>
                    </header>

                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/trainers" element={<Trainers />} />
                        <Route path="/pokemon/page/:pagenum" element={<PokemonList />} />
                        <Route path="/pokemon/:id" element={<Pokemon />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;

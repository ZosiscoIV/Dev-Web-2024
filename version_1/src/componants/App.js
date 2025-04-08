import Header from './Header';
import Produits from './produits';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Panier from "./CartPage";
import SearchResults from "./SearchResults";

function App() {
  return (
    <div>
        <Router>
            <Header />
            <main>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/panier" element={<Panier />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>
            </main>
        </Router>
    </div>
  );
}

export default App;

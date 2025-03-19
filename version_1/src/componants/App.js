import Header from './Header';
import Produits from './produits';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Panier from "./CartPage";
import Products from "./Test";

function App() {
  return (
    <div>
        <Router>
            <Header />
            <main>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/panier" element={<Panier />} />
            </Routes>
                <Products />
            </main>
        </Router>
    </div>
  );
}

export default App;

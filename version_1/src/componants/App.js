import Banner from './Banner';
import Header from './Header'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Panier from "./CartPage";

function App() {
  return (
    <div>
        <Router>
            <Header />
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/panier" element={<Panier />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;

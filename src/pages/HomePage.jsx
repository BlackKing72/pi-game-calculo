import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
const HomePage = () => {
    return (
        <div className="homepage">
            <h1>Titulo do Game</h1>
            <Link to='/app'>Jogar</Link>
        </div>
    )
};

export default HomePage;
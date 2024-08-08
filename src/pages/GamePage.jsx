import ValueConverter from "../components/ValueConverter";
import { Button } from "react-bootstrap";

import './GamePage.css';

const GamePage = () => {
    return (
        <div className="game">
            <h3 className="game-question">
                Lorem ipsum dolor sit amet. Et officia perspiciatis ut assumenda obcaecati est 
                voluptatibus omnis ut culpa voluptatem? Et voluptates dolorum qui aperiam esse 
                rem labore tempora et temporibus aspernatur. 
            </h3>

            <div className="game-input">
                <ValueConverter/>
                <ValueConverter/>
                <ValueConverter/>
            </div>

            <Button>Adicionar Valor</Button>
        </div>
    )
};

export default GamePage;
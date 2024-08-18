import ValueConverter from "../components/ValueConverter";
import { Button } from "react-bootstrap";

import './GamePage.css';

const GamePage = () => {
    return (
        <div className="game">
            <h3 className="game-question">
                O médico prescreveu 1,5 mg de cloranfenicol. Mas o medicamento que
                existe na farmácia é de 1 ml, contendo 2 mg. Como proceder?
            </h3>

            <div className="game-input">
                <ValueConverter />
                <ValueConverter />
                <ValueConverter />
            </div>
        </div>
    )
};

export default GamePage;
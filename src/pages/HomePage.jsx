import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { LoadingScreen } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';

import * as perguntasService from "../services/perguntasService";

const HomePage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleOnClick = async () => {
        setLoading(true);
        
        const questao = await perguntasService.buscarQuestaoAleatoria();
        navigate(`/app/` + questao.id);
    };

    return loading
        ? <LoadingScreen />
        : (
            <div className="homepage">
                <h1>Titulo do Game</h1>
                <Button onClick={handleOnClick}>Jogar</Button>
            </div>
        )
};

export default HomePage;
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartPulse } from "@fortawesome/free-solid-svg-icons";

import * as perguntasService from "../services/perguntasService";
import { GameButton } from "../components/game/game-button";

const Resultados = () => {
    const navigate = useNavigate();
    const resultados = JSON.parse(localStorage.getItem('resultadoFinal'));

    if (!resultados) {
        navigate('/');
    }

    const minutos = resultados.minutos;
    const segundos = resultados.segundos;

    const tempoGasto = resultados.horas <= 0 
        ?  `${minutos > 0 ? `${minutos} minitos e ` : ''}${segundos} segundos`
        : '+ de 60 minutos';

    const handleClickMenuPrincipal = () => {
        navigate('/');
    }

    const handleClickJogarNovamente = async () => {
        const questao = await perguntasService.buscarQuestaoAleatoria();
        navigate(`/app/` + questao.id);
    }

    return (
        <div className="absolute inset-0 w-screen h-[100dvh] flex flex-col items-center justify-center transition-all">
            <div className="fixed z-0 inset-0 bg-home bg-repeat bg-cover transition-all" />
            <div className="w-full flex flex-col z-10 flex-grow gap-4 max-w-[50ch] justify-center p-4">
                <div className="bg-slate-50 rounded-lg p-10 flex flex-col gap-4 items-center">
                    <p>Você completou a equação em<br/>{tempoGasto}</p>
                    <hr className="w-full my-4"/>
                    <p>Acertou {resultados.acertos} de {resultados.totalTentativas} tentativas</p>

                    <FontAwesomeIcon className="w-24 h-24 text-red-600" icon={faHeartPulse} flip/>
                    <p>Precisão {Math.round(resultados.precisao)}%</p>
                    <Progress value={resultados.precisao} className="w-full bg-slate-300 *:bg-orange-500" />
                </div>
                <div className="flex gap-2 w-full">
                <GameButton className='w-0 flex-grow' onClick={handleClickMenuPrincipal}>Menu Principal</GameButton>
                <GameButton className='w-0 flex-grow' onClick={handleClickJogarNovamente}>Jogar Novamente</GameButton>
                </div>
            </div>
        </div>
    )
};

export default Resultados;
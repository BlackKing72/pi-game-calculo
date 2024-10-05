import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { LoadingScreen } from '@/components/ui/loading';
import { GameButton } from '@/components/game/game-button';

import * as perguntasService from "../services/perguntasService";

const HomePage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleOnClickJogar = async () => {
        setLoading(true);
        const questao = await perguntasService.buscarQuestaoAleatoria();

        if (questao) {
            navigate(`/app/` + questao.id);
        }

        setLoading(false);
    };

    const opcoes = [
        { nome: 'Jogar',    onClick: handleOnClickJogar,  enabled: true},
        { nome: 'Tutorial', onClick: () => { }, enabled: true},
        { nome: 'Opções',   onClick: () => { }, enabled: true},
    ]

    return loading
        ? <LoadingScreen />
        : (
            <div className="absolute inset-0 w-screen h-[100dvh] flex flex-col items-center justify-center transition-all duration-500 ease-in-out-back">
                <div className="absolute inset-0 w-screen h-[100dvh] z-0 bg-slate-600 bg-home bg-repeat bg-cover transition-all duration-500 ease-in-out-back" />

                <div className="w-full flex flex-col flex-grow gap-4 max-w-[50ch] justify-center p-4">
                    <div className="bg-[#f8fafc10] text-slate-50 backdrop-blur-[4px] z-10 rounded-lg p-10 flex flex-col gap-4 items-center ring-1 ring-[#f8fafc40]">
                        <h1 className="font-bold">OwlCalc</h1>
                        <hr className="mb-8 w-full"/>
                        {
                            opcoes.map((opcao, index) =>
                                <GameButton key={index} disabled={!opcao.enabled} onClick={opcao.onClick}
                                    className="w-full bg-blue-600 hover:bg-blue-800"> {opcao.nome}</GameButton>
                            )
                        }
                    </div>
                </div>
            </div>
        )
};

export default HomePage;
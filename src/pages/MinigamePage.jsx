import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import './MinigamePage.css';
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { buscarConteudoParaRegraDeTres } from '@/components/GameRegraDeTres'
import { buscarConteudoParaGotejamento } from '@/components/GameGotejamento'

import * as perguntasService from '../services/perguntasService';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const MinigamePage = () => {
    const navigate = useNavigate();

    const enableDebugMode = localStorage.getItem('enable-debug-mode');
    const [isDebugMode, setIsDebugMode] = useState(enableDebugMode !== null && enableDebugMode == true);

    const idQuestao = parseInt(useParams().idQuestao);

    const [indexEtapaAtual, setIndexEtapaAtual] = useState(0);
    const [questao, setQuestao] = useState();
    const [etapas, setEtapas] = useState([]);
    const [tempoInicio, setTempoInicio] = useState();
    const [erros, setErros] = useState(0);
    const [acertos, setAcertos] = useState(0);
    const [ultimaEtapa, setUltimaEtapa] = useState(0);

    const [abrirDialogoSucesso, setAbrirDialogoSucesso] = useState(false);
    const [abrirDialogoErro, setAbrirDialogoErro] = useState(false);

    useEffect(() => {
        window.addEventListener('debug-changed', (e) => {
            setIsDebugMode(e.enabled);
        })
        const buscarQuestoes = async () => {
            const questao =
                await perguntasService.buscarQuestoesPorID(idQuestao);

            setQuestao(questao);
            setEtapas(buscarConteudoMinigame(questao))
        };

        buscarQuestoes();
        setTempoInicio(performance.now());
    }, [idQuestao])


    const handleQuandoMudarEtapa = (pageIndex) => {
        const length = isDebugMode ? etapas.length - 1 : ultimaEtapa;
        pageIndex = Math.max(0, Math.min(pageIndex, length));
        setIndexEtapaAtual(pageIndex);
    }

    const handleQuandoTerminarJogo = () => {
        const diferencaTempo = performance.now() - tempoInicio;
        const segundos = Math.round(diferencaTempo / 1000);
        const minutos = Math.round(diferencaTempo / 60000);
        const horas = Math.round(minutos / 60);

        const totalTentativas = acertos + erros;
        const precisao = (acertos / totalTentativas) * 100;

        localStorage.setItem('resultadoFinal', JSON.stringify({
            tempoGasto: diferencaTempo,
            horas: horas,
            minutos: minutos,
            segundos: segundos,
            totalTentativas: totalTentativas,
            acertos: acertos,
            erros: erros,
            precisao: precisao,
        }));

        navigate('/app/resultados');
    }

    const handleQuandoResponder = (resposta) => {
        if (resposta) {
            if (indexEtapaAtual >= etapas.length - 1) {
                handleQuandoTerminarJogo();
                return;
            }
            setAbrirDialogoSucesso(true);
            setUltimaEtapa(value => value + 1);
            setAcertos(value => value + 1);
        } else {
            setAbrirDialogoErro(true);
            setErros(value => value + 1);
        }
    }

    const handleFecharDialogoSucesso = () => {
        setAbrirDialogoSucesso(false);
        handleQuandoMudarEtapa(indexEtapaAtual + 1);
    };


    return !questao
        ? <LoadingScreen />
        : (
            <div className='app-page'>
                <div className='app-container'>
                    <div className='app-main'>
                        <div className="app-header">
                            <p className="app-question">{questao.enunciado}</p>
                        </div>

                        <div className='app-content'>
                            <div className='app-content-container'>
                                {
                                    etapas[indexEtapaAtual](handleQuandoResponder)
                                }
                            </div>
                        </div>

                    </div>

                    <div className="app-footer">
                        <div className='progress'>
                            {
                                etapas.map((_, index) =>
                                    <span key={index} onClick={() => handleQuandoMudarEtapa(index)}
                                        className={`progress-bar ${index === indexEtapaAtual ? 'active' : index < indexEtapaAtual ? 'completed' : ''}`} />
                                )
                            }
                        </div>
                        {
                            !isDebugMode
                                ? null
                                : (
                                    <div className='flex gap-2'>
                                        <Button className='flex-grow' onClick={() => handleQuandoMudarEtapa(indexEtapaAtual - 1)}>Anterior</Button>
                                        <Button className='flex-grow' onClick={() => handleQuandoMudarEtapa(indexEtapaAtual + 1)}>Próximo</Button>
                                    </div>
                                )
                        }
                    </div>
                </div>

                <FeedbackPopup open={abrirDialogoSucesso} title='Você acertou!' onClose={handleFecharDialogoSucesso}>
                    <FontAwesomeIcon className='w-24 h-24 text-lime-500' icon={faCircleCheck} bounce />
                </FeedbackPopup>

                <FeedbackPopup open={abrirDialogoErro} title='Você errou!' onClose={() => setAbrirDialogoErro(false)}>
                    <FontAwesomeIcon className='w-24 h-24 text-red-500' icon={faCircleExclamation} shake />
                </FeedbackPopup>

            </div>
        );
};

function FeedbackPopup({ open, title, children, onClose }) {
    return (
        <Dialog open={open} modal={true}>
            <DialogContent hideCloseButton={true} onClick={onClose}
                className='top-1/2 left-1/2 w-screen max-w-full h-screen flex flex-col gap-12 items-center justify-center rounded-lg bg-[#00000000] border-0 backdrop-blur-sm transition-all'>

                <DialogTitle className='text-slate-50'>{title}</DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogHeader >
                    {children}
                    <p className='absolute left-0 bottom-4 w-full text-center text-slate-50'>Toque na tela para continuar</p>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

function buscarConteudoMinigame(questao) {
    return perguntasService.isQuestaoRegraDeTres(questao)
        ? buscarConteudoParaRegraDeTres(questao)
        : buscarConteudoParaGotejamento(questao);
}

export default MinigamePage;
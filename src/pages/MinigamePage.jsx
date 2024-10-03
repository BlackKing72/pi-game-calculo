import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import './MinigamePage.css';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MinigameSelecionarValor from '@/components/minigames/MinigameSelecionarValor';
import { gerarGrandeza } from '@/models/grandeza.ts';
import { buscarConteudoParaRegraDeTres } from '@/components/GameRegraDeTres.tsx'

import * as perguntasService from '../services/perguntasService';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const MinigamePage = () => {
    const navigate = useNavigate();

    const { idQuestao } = useParams();

    const [indexEtapaAtual, setIndexEtapaAtual] = useState(0);
    const [questao, setQuestao] = useState();
    const [etapas, setEtapas] = useState();

    const [openDialogoSucesso, setOpenDialogSucesso] = useState();
    const [dialogProgress, setDialogProgress] = useState(100);

    const handleQuandoMudarEtapa = (pageIndex) => {
        pageIndex = Math.max(0, Math.min(pageIndex, etapas.length - 1));
        setIndexEtapaAtual(pageIndex);
    }

    const handleQuandoResponder = (resposta) => {
        if (resposta) {
            setOpenDialogSucesso(true);
        } else {
            alert("Resposta Errada!!! T^T");
        }
    }

    const handleOnDialogOpenChanged = (open) => {
        if (open) {
            return
        }

        handleQuandoMudarEtapa(indexEtapaAtual + 1);
        setOpenDialogSucesso(false);
    }

    useEffect(() => {
        const buscarQuestoes = async () => {
            const questao =
                await perguntasService.buscarQuestoesPorID(idQuestao);

            setQuestao(questao);
            setEtapas(buscarConteudoMinigame(questao))
        };

        buscarQuestoes();
    }, [])


    useEffect(() => {
        if (!openDialogoSucesso) {
            return;
        }

        // const interval = setInterval(onUpdate, 1 / 60);

        // function onUpdate() {
        //     setDialogProgress(value => {
        //         let progress = value - 1;    
        //         if (dialogProgress <= 0) {
        //             clearInterval(interval)
        //             progress = 0;
        //             setOpenDialogSucesso(false);
        //         }
        //         return progress;
        //     })
        // }


    }, [openDialogoSucesso])


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
                        <div className='flex gap-2'>
                            <Button className='flex-grow' onClick={() => handleQuandoMudarEtapa(indexEtapaAtual - 1)}>Anterior</Button>
                            <Button className='flex-grow' onClick={() => handleQuandoMudarEtapa(indexEtapaAtual + 1)}>Próximo</Button>
                        </div>
                    </div>
                </div>

                <Dialog open={openDialogoSucesso} onOpenChange={handleOnDialogOpenChanged} modal={true}>
                    <DialogContent hideCloseButton={true} 
                        className='w-full h-full flex flex-col gap-4 items-center justify-center rounded-lg bg-transparent border-0 backdrop-blur-sm'>
                        <DialogHeader >
                            <FontAwesomeIcon className='w-24 h-24 text-lime-500' icon={faCircleCheck} bounce/>
                            <p className='absolute left-0 bottom-8 w-full text-center text-slate-50'>Toque na tela para continuar</p>
                            <div className={`absolute left-0 bottom-0 w-full h-2 bg-lime-500 scale-x-[50%]`}/>
                        </DialogHeader>
                        {/* <DialogClose className='absolute top-4 right-4'>
                            <FontAwesomeIcon icon={faXmark}/>
                        </DialogClose> */}
                    </DialogContent>
                </Dialog>

            </div>
        );
};


function buscarConteudoMinigame(questao) {
    return perguntasService.isQuestaoRegraDeTres(questao)
        ? buscarConteudoParaRegraDeTres(questao)
        : buscarConteudoParaGotejamento(questao);
}

const gerarIndex = (len) => {
    return Math.floor(Math.random() * len);
}

const gerarRespostas = (valor, variacao, quantidade) => {
    const valores = [];

    for (let i = 0; i < quantidade - 1; i++) {
        const index = gerarIndex(valores.length);
        const valorGerado = gerarGrandeza(valor, variacao, true, true);
        valores.splice(index, 0, ...[valorGerado]);
    }

    const index = gerarIndex(valores.length);
    valores.splice(index, 0, ...[valor]);

    return {
        valores: valores,
        resposta: index,
    };
}

/** 
 * @param {perguntasService.QuestaoRegraDeTres} questao 
 */
// function buscarConteudoParaRegraDeTres(questao) {
//     const valoresPrescritos = gerarRespostas(questao.prescricao, questao.prescricao.valor * 2, 3);
//     const valoresMedicamentos = gerarRespostas(questao.medicamento, questao.medicamento.valor * 2, 3);
//     const valoresDiluentes = gerarRespostas(questao.diluente, questao.diluente.valor * 2, 3);

//     const valoresTemMesmaUnidade = questao.prescricao.unidade === questao.medicamento.unidade;

//     return [
//         (onAnswer) =>
//             <MinigameSelecionarValor
//                 key={0}
//                 titulo='O que foi prescrito?'
//                 valores={valoresPrescritos.valores.map(valor => valor.toString())}
//                 quandoResponder={e => {
//                     console.log(`onAnswer prescrição => ${e} ${valoresPrescritos.resposta}`);
//                     onAnswer(e == valoresPrescritos.resposta);
//                 }} />,
//         (onAnswer) =>
//             <MinigameSelecionarValor
//                 key={1}
//                 titulo='Que medicamento tem disponível?'
//                 valores={valoresMedicamentos.valores.map(valor => valor.toString())}
//                 quandoResponder={e => {
//                     console.log(`onAnswer prescrição => ${e} ${valoresMedicamentos.resposta}`);
//                     onAnswer(e == valoresMedicamentos.resposta);
//                 }} />,
//         (onAnswer) =>
//             <MinigameSelecionarValor
//                 key={2}
//                 titulo='Que diluente tem disponível?'
//                 valores={valoresDiluentes.valores.map(valor => valor.toString())}
//                 quandoResponder={e => {
//                     console.log(`onAnswer prescrição => ${e} ${valoresDiluentes.resposta}`);
//                     onAnswer(e == valoresDiluentes.resposta);
//                 }} />,
//         (onAnswer) =>
//             <MinigameConverterValor 
//                 origem={questao.prescricao}
//                 destino={questao.medicamento}/>,
//         (onAnswer) => {
//             return (<p>Etapa 05</p>)
//         },
//         (onAnswer) => {
//             return (<p>Etapa 06</p>)
//         },
//     ];
// };

/** 
 * @param {perguntasService.QuestaoGotejamento} questao 
 */
function buscarConteudoParaGotejamento(questao) {
    const valoresVolume = gerarRespostas(questao.volume, questao.volume.valor * 2, 3);
    const valoresTempo = gerarRespostas(questao.tempo, questao.tempo.valor * 2, 3);

    return [
        (onAnswer) =>
            <MinigameSelecionarValor
                key={0}
                titulo='Que diluente tem disponível?'
                valores={valoresVolume.valores.map(valor => valor.toString())}
                quandoResponder={e => {
                    console.log(`onAnswer prescrição => ${e} ${valoresVolume.resposta}`);
                    onAnswer(e == valoresVolume.resposta);
                }} />,
        (onAnswer) =>
            <MinigameSelecionarValor
                key={1}
                titulo='Que diluente tem disponível?'
                valores={valoresTempo.valores.map(valor => valor.toString())}
                quandoResponder={e => {
                    console.log(`onAnswer prescrição => ${e} ${valoresTempo.resposta}`);
                    onAnswer(e == valoresTempo.resposta);
                }} />,
        (onAnswer) => {
            return (<p>Etapa 04</p>)
        },
        (onAnswer) => {
            return (<p>Etapa 04</p>)
        },
    ];
};

export default MinigamePage;
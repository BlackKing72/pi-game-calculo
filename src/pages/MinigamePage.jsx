import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import './MinigamePage.css';

import MinigameSelecionarValor from '@/components/minigames/MinigameSelecionarValor';
import { gerarGrandeza } from '@/models/grandeza.ts';
import { buscarConteudoParaRegraDeTres } from '@/components/GameRegraDeTres.tsx'

import * as perguntasService from '../services/perguntasService';
import { useParams } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading';

const MinigamePage = () => {
    const { idQuestao } = useParams();

    const [indexEtapaAtual, setIndexEtapaAtual] = useState(0);
    const [questao, setQuestao] = useState();
    const [etapas, setEtapas] = useState();

    const handleQuandoMudarEtapa = (pageIndex) => {
        pageIndex = Math.max(0, Math.min(pageIndex, etapas.length - 1));
        setIndexEtapaAtual(pageIndex);
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



    return !questao
        ? <LoadingScreen /> 
        : (
            <div className='app-page'>
                <div className='app-container'>
                    <div className='app-main'>
                        <MinigameHeader
                            enunciado={questao.enunciado} />
                        <MinigameEtapa
                            etapa={etapas[indexEtapaAtual]}
                            etapaSelecionada={indexEtapaAtual}
                            quandoMudarEtapa={handleQuandoMudarEtapa} />
                    </div>
                    <MinigameFooter
                        quantidadeEtapas={etapas.length}
                        etapaSelecionada={indexEtapaAtual}
                        quandoMudarEtapa={handleQuandoMudarEtapa} />
                </div>
            </div>
        );
};

function MinigameHeader({ enunciado }) {
    return (
        <div className="app-header">
            <p className="app-question">{enunciado}</p>
        </div>
    );
};

function MinigameEtapa({ etapa, etapaSelecionada, quandoMudarEtapa }) {
    const handleQuandoResponder = (resposta) => {
        if (resposta) {
            alert("Resposta Certa!!! ^u^");
            quandoMudarEtapa(etapaSelecionada + 1);
        } else {
            alert("Resposta Errada!!! T^T");
        }
    }

    return (
        <div className='app-content'>
            <div className='app-content-container'>
                {etapa(handleQuandoResponder)}
            </div>
        </div>
    );
};

function MinigameFooter({ quantidadeEtapas, etapaSelecionada, quandoMudarEtapa }) {
    return (
        <div className="app-footer">
            <div className='progress'>
                {
                    [...Array(quantidadeEtapas)].map((_, index) =>
                        index === etapaSelecionada
                            ? <span key={index} className='progress-bar active' />
                            : index < etapaSelecionada
                                ? <span key={index} className='progress-bar completed' />
                                : <span key={index} className='progress-bar' />
                    )
                }
            </div>
            <div className='flex gap-2'>
                <Button className='flex-grow' onClick={() => quandoMudarEtapa(etapaSelecionada - 1)}>Anterior</Button>
                <Button className='flex-grow' onClick={() => quandoMudarEtapa(etapaSelecionada + 1)}>Próximo</Button>
            </div>
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
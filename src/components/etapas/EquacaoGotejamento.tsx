import './EquacaoRegraDeTres.css'

import { EtapaProps } from "../GameGotejamento";

import SwapyContainer, { SwapyGroup } from "../swapy/SwapyContainer";
import SwapyItem from "../swapy/SwapyItem";
import SwapySlot from "../swapy/SwapySlot";
import { Button } from '../ui/button';
import { Input, InputError } from '../ui/input';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { SwapEventArray, SwapEventMap, SwapEventObject, Swapy } from 'swapy';

import * as conversoes from '@/models/conversao';
import { QuestaoGotejamento, QuestaoRegraDeTres } from '@/services/perguntasService';
import { gerarGrandeza, Grandeza } from '@/models/grandeza';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { GotasHora, GotasMin, Horas, MicrogotasHora, MicrogotasMin, Minutos, Unidade } from '@/models/unidade';

type SlotData = string | null;

type PickSlotProps = { className?: string, content?: any, slotID: any, itemID: any }
function PickSlot({ className, content, slotID, itemID }: PickSlotProps) {
    return (
        <SwapySlot className={`p-1 bg-slate-200 border border-transparent ${className || ''}`} slotID={slotID}>
            <SwapyItem className='bg-orange-500' itemID={itemID}>
                <p className='text-sm'>{content}</p>
            </SwapyItem>
        </SwapySlot>
    );
};

type DropSlotProps = { className?: string, slotID: any }
function DropSlot({ className, slotID, children }: PropsWithChildren<DropSlotProps>) {
    return (
        <SwapySlot className={`drop-slot border border-transparent ${className || ''}`} slotID={slotID}>
            {children}
        </SwapySlot>
    )
}

type FakeSlotProps = { className?: string, content?: any }
function FakeSlot({ className, content }: FakeSlotProps) {
    return (
        <div className={`p-1 bg-slate-200 rounded-lg ${className ?? ''}`}>
            <div className='bg-slate-500 rounded-lg w-full h-full flex items-center justify-center'>
                <p className='text-slate-50 text-sm'>{content ?? ''}</p>
            </div>
        </div>
    )
}

const embaralharLista = (lista: any[]) => {
    let resultado = [...lista];
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

const gerarRespostas = (questao: QuestaoGotejamento) => {
    const volumeGerada0 = gerarGrandeza(questao.volume, questao.volume.valor * 1.5, true, true);
    const volumeGerada1 = gerarGrandeza(volumeGerada0, questao.volume.valor * 1.5, true, true);
    const tempoGerada0 = gerarGrandeza(questao.tempo, questao.tempo.valor * 1.5, true, true);
    const tempoGerada1 = gerarGrandeza(tempoGerada0, questao.tempo.valor * 1.5, true, true);

    return embaralharLista([
        questao.volume, questao.tempo, volumeGerada0,
        volumeGerada1, tempoGerada0, tempoGerada1]);
}

const buscarUnidadeDestino = (questao: QuestaoGotejamento) => {
    switch (questao.unidadeDestino) {
        case 'gts/min': return GotasMin;
        case 'gts/hora': return GotasHora;
        case 'mgts/min': return MicrogotasMin;
        case 'mgts/hora': return MicrogotasHora;
    }
}

const buscarUnidadeTempoDestino = (questao: QuestaoGotejamento) => {
    switch (questao.unidadeDestino) {
        case 'gts/min': case 'mgts/min': return Minutos;
        case 'gts/hora': case 'mgts/hora': return Horas;
    }
}

export const precisaConverterValores = (questao: QuestaoGotejamento) => {
    const unidadeOrigem = questao.tempo.unidade; 
    const unidadeDestino = buscarUnidadeTempoDestino(questao);

    return unidadeOrigem !== unidadeDestino;
}

const converterTempoPrescrito = (questao: QuestaoGotejamento) => {
    const unidadeOrigem = questao.tempo.unidade; 
    const unidadeDestino = buscarUnidadeTempoDestino(questao);

    const precisaConverter = unidadeOrigem !== unidadeDestino;
    const conversao = conversoes.buscarConversao(unidadeOrigem, unidadeDestino);
    
    return (precisaConverter && conversao)
        ? conversao.converter(questao.tempo)
        : questao.tempo;
}

/** Retorna um objeto com os valores da questão no formato de texto. */
const extrairValoresDaQuestao = (questao: QuestaoGotejamento) => {
    const tempoPrescrito = converterTempoPrescrito(questao)
    return {
        volumePrescrito: questao.volume.toString(),
        tempoPrescrito: tempoPrescrito.toString(),
        constanteTempo: '3',
        constanteGotas: '20',
        constanteMicrogotas: '60'
    };
}

const arredondarNumero = (numero: number, casasDecimais: number) => {
    const fator = Math.pow(10, casasDecimais);
    return Math.round(numero * fator) / fator;
}

const separarIntegralDecimal = (numero: number, casasDecimais: number) => {
    const fator = Math.pow(10, casasDecimais);
    const decimal = numero * fator % fator / fator;
    return {
        decimal: decimal,
        integral: numero - decimal
    }
}

/*
    Gotas / h           -> volume / tempo * 3
    Gotas / min         -> volume * 20 / tempo
    Microgotas / h      -> volume / tempo
    Microgotas / min    -> volume * 60 / tempo
*/

const calcularResposta = (questao: QuestaoGotejamento) => {
    const volume = questao.volume.valor;
    const tempo = converterTempoPrescrito(questao).valor;

    let resposta: number;
    let unidade: Unidade;
    switch (questao.unidadeDestino) {
        case 'gts/hora':  
            resposta = volume / (tempo * 3); 
            unidade = GotasHora; 
            break;

        case 'gts/min':   
            resposta = (volume * 20) / tempo;
            unidade = GotasMin; 
            break;

        case 'mgts/hora': 
            resposta = volume / tempo;
            unidade = MicrogotasHora;
            break;

        case 'mgts/min':  
            resposta = (volume * 60) / tempo;
            unidade = MicrogotasMin; 
            break;
    };

    return new Grandeza(arredondarNumero(resposta, 2), unidade);
}

/* ---------------------------------------------------------------------------------------------------------------------
--------- Identificar Valores ------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

const IdentificarValores = ({ questao, quandoResponder }: EtapaProps) => {
    // transformar os valores da questão em texto.
    const [valores] = useState(gerarRespostas(questao));

    // guarda as valores que foram colocados no slots de resposta.
    const [slotData, setSlotData] = useState<Grandeza[]>([]);

    const handleOnSwap = (data: any) => {
        // toda vez q algum slot é trocado, guarda os valores que foram colocados dentro 
        // do slots de resposta. o 'data.object.slotXX' retorna o id do slot que é um 
        // index para a array de valores, mas como o 'swapy' salva o id do slot como
        // texto, precisa ser convertido para número de novo.
        setSlotData([
            valores[parseInt(data.object.slotVolume)],
            valores[parseInt(data.object.slotTempo)]
        ]);
    };

    const handleQuandoResponder = () => {
        const resposta = [questao.volume, questao.tempo];
        const estaCorreto = slotData.length > 0 && slotData.every((value, index) => value.equals(resposta[index]))
        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium">Leia o problema e identifique os valores da questão.</p>
            <hr className='w-full my-1' />

            <SwapyContainer animation="spring" className='flex flex-col gap-4' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>
                <SwapyGroup className='flex flex-wrap gap-2 w-full'>
                    {
                        valores.map((valor, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={valor.toString()} className='w-0 flex-grow basis-1/4 h-12' />
                        )
                    }
                </SwapyGroup>
                <SwapyGroup className='flex gap-2 w-full'>
                    <SwapyGroup className='w-0 flex-grow basis-1/4'>
                        <p className="text-sm mb-2">Volume<br />prescrito</p>
                        <DropSlot slotID={'slotVolume'} className='w-full h-12' />
                    </SwapyGroup>
                    <SwapyGroup className='w-0 flex-grow basis-1/4'>
                        <p className="text-sm mb-2">Tempo de<br />adminstraçao</p>
                        <DropSlot slotID={'slotTempo'} className='w-full h-12' />
                    </SwapyGroup>
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Identificar Equação ------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

const IdentificarEquacao = ({ questao, quandoResponder }: EtapaProps) => {
    const [valores] = useState(embaralharLista([GotasMin, GotasHora, MicrogotasMin, MicrogotasHora]));
    
    const [slotData, setSlotData] = useState<Unidade|null>(null);
    const handleOnSwap = (data: any) => {
        setSlotData(valores[parseInt(data.object.slotResposta)]);
    };

    const handleQuandoResponder = () => {
        const resposta = questao.unidadeDestino;
        const estaCorreto = slotData !== null && resposta === slotData.abreviacao;
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium">
                Identifique qual equação você deve usar para resolver o problema
            </p>

            <hr className='w-full my-1' />

            <SwapyContainer animation="spring" className='flex flex-col gap-4' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte o valor correto no campo marcado.</p>
                <SwapyGroup className='flex flex-wrap gap-2 w-full'>
                    {
                        valores.map((valor, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={valor.nome} className='w-0 basis-1/3 flex-grow h-12' />
                        )
                    }
                </SwapyGroup>

                <DropSlot slotID={'slotResposta'} className='w-1/2 flex-grow ml-2 h-12' />
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Identificar Conversão ----------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

const IdentificarConvercao = ({ questao, quandoResponder }: EtapaProps) => {

    const handleQuandoResponder = (respondeuSim: boolean) => {
        const unidadeOrigem = questao.tempo.unidade;
        const unidadeDestino = buscarUnidadeTempoDestino(questao)
        const unidadesSaoDiferentes = unidadeOrigem !== unidadeDestino;

        const estaCorreto = respondeuSim
            ? unidadesSaoDiferentes
            : !unidadesSaoDiferentes;

        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="w-full font-medium">
                Observe as informações abaixo.
            </p>

            <hr className="my-1 w-full" />

            <div className='flex flex-col w-full gap-2'>

                <div className='flex w-full gap-4 flex-grow items-center'>
                    <p className='text-right text-sm flex-grow w-0 basis-1/3'>Tempo Total: </p>
                    <FakeSlot content={questao.tempo.toString()} className='flex-grow w-0 basis-1/3 h-12' />
                </div>

                <div className='flex w-full gap-4 flex-grow items-center'>
                    <p className='text-right text-sm flex-grow w-0 basis-1/3'>Fórmula para o cálculo: </p>
                    <FakeSlot content={buscarUnidadeDestino(questao).nome} className='flex-grow w-0 basis-1/3 h-12' />
                </div>

            </div>

            <hr className="my-1 w-full" />

            <p className="w-full font-medium">
                Observando a unidade de medida e a fórmula para o cálculo, o valor do tempo precisa ser convertido?
            </p>

            <div className='flex gap-2'>
                <Button className='flex-grow' onClick={() => handleQuandoResponder(true)}>Sim</Button>
                <Button className='flex-grow' onClick={() => handleQuandoResponder(false)}>Não</Button>
            </div>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Realizar Conversão ----------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

const buscarOperacaoContraria = (operacao: conversoes.Operacao): conversoes.Operacao => {
    switch (operacao) {
        case 'multiplicar': return 'dividir';
        case 'dividir': return 'multiplicar';
    }
}
const gerarOperacaoAleatoria = (): conversoes.Operacao => {
    return Math.random() > 0.5 ? 'multiplicar' : 'dividir';
}
const gerarRespostasConversao = (conversao: conversoes.Conversao) => {
    const constante = conversao.constante;
    const operacao = conversao.operacao;

    const respostaCorreta = `${conversoes.operacaoToString(conversao.operacao)} ${constante}`;

    return {
        resposta: respostaCorreta,
        valores: embaralharLista([
            respostaCorreta,
            `${conversoes.operacaoToString(buscarOperacaoContraria(operacao))} ${constante}`,
            `${conversoes.operacaoToString(gerarOperacaoAleatoria())} ${Math.round((Math.min(0.1, Math.max(0.9, Math.random())) * constante) * 100 / 100)}`,
        ])
    };
}

const RealizarConversao = ({ questao, quandoResponder }: EtapaProps) => {
    const unidadeOrigem = questao.tempo.unidade;
    const unidadeDestino = buscarUnidadeTempoDestino(questao);

    const conversao = conversoes.buscarConversao(unidadeOrigem, unidadeDestino);

    if (!conversao) {
        throw new Error(`Nenhuma conversão encontrada de ${unidadeOrigem.nome} para ${unidadeDestino.nome}`);
    }

    const [{ resposta, valores }] = useState(gerarRespostasConversao(conversao));
    // const { resposta, valores } = respostaConversao;

    // guarda as valores que foram colocados no slots de resposta.
    const [slotData, setSlotData] = useState<string | null>(null);


    const handleOnSwap = (data: any) => {
        setSlotData(valores[parseInt(data.object.slotResposta)]);
    };

    const handleQuandoResponder = () => {
        const estaCorreto = resposta === slotData;
        quandoResponder(estaCorreto);
    };


    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium">
                Para converter de {unidadeOrigem.nome} para {unidadeDestino.nome} você precisa.
            </p>

            <hr className='w-full my-1' />

            <SwapyContainer animation="spring" className='flex flex-col gap-4 p-1' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>
                <SwapyGroup className='flex flex-wrap gap-2 w-full'>
                    {
                        valores.map((valor, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={valor} className='w-0 flex-grow h-12' />
                        )
                    }
                    <DropSlot slotID={'slotResposta'} className='w-0 flex-grow ml-2 h-12' />
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Equação Parte 01 ---------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

const EquacaoGtsHoras = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo } = extrairValoresDaQuestao(questao);
    const valores = [volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo];

    const [slotData, setSlotData] = useState<SlotData[]>([]);
    const dropSlots = ['slotVolume', 'slotTempo', 'slotConstante'];

    const handleOnSwap = (data: any) => {
        setSlotData([
            valores[parseInt(data.object.slotVolume)],
            valores[parseInt(data.object.slotTempo)],
            valores[parseInt(data.object.slotConstante)]
        ]);
    };

    const handleQuandoResponder = () => {
        const resposta = [volumePrescrito, tempoPrescrito, constanteTempo];
        const estaCorreto = slotData.length > 0 && slotData.every((value, index) => value === resposta[index]);
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Monte a equação na ordem correta.</p>

            <hr className="my-1 w-full" />

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>

                <SwapyGroup className="relative flex flex-wrap gap-2 justify-center w-full">
                    {
                        valores.map((slot, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={slot} className='w-0 max-w-[33.33%] flex-grow basis-1/4 h-12' />
                        )
                    }
                </SwapyGroup>

                <hr className="my-1 w-full" />

                <SwapyGroup className="flex flex-col gap-2 w-full px-8">
                    <SwapyGroup className="flex gap-2 w-full justify-center items-center">
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[0]} />
                    </SwapyGroup>

                    <hr className="w-full bg-slate-400 h-[2px]" />

                    <SwapyGroup className="flex gap-2 w-full justify-center items-center">
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[1]} />
                        <p className='text-4xl'>×</p>
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[2]} />
                    </SwapyGroup>
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

const EquacaoGtsMinutos = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo } = extrairValoresDaQuestao(questao);
    const valores = [volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo];

    const [slotData, setSlotData] = useState<SlotData[]>([]);
    const dropSlots = ['slotVolume', 'slotConstante', 'slotTempo'];

    const handleOnSwap = (data: any) => {
        setSlotData([
            valores[parseInt(data.object.slotVolume)],
            valores[parseInt(data.object.slotConstante)],
            valores[parseInt(data.object.slotTempo)]
        ]);
    };

    const handleQuandoResponder = () => {
        const resposta = [volumePrescrito, constanteGotas, tempoPrescrito];
        const estaCorreto = slotData.length > 0 && slotData.every((value, index) => value === resposta[index]);
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Monte a equação na ordem correta.</p>

            <hr className="my-1 w-full" />

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>

                <SwapyGroup className="relative flex flex-wrap gap-2 justify-center w-full">
                    {
                        valores.map((slot, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={slot} className='w-0 max-w-[33.33%] flex-grow basis-1/4 h-12' />
                        )
                    }
                </SwapyGroup>

                <hr className="my-1 w-full" />

                <SwapyGroup className="flex flex-col gap-2 w-full px-8">
                    <SwapyGroup className="flex gap-2 w-full justify-center items-center">
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[0]} />
                        <p className='text-4xl'>×</p>
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[1]} />
                    </SwapyGroup>

                    <hr className="w-full bg-slate-400 h-[2px]" />

                    <SwapyGroup className="flex gap-2 w-full justify-center items-center">
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[2]} />
                    </SwapyGroup>
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

const EquacaoMgtsHoras = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo } = extrairValoresDaQuestao(questao);
    const valores = [volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo];

    const [slotData, setSlotData] = useState<SlotData[]>([]);
    const dropSlots = ['slotVolume', 'slotTempo'];

    const handleOnSwap = (data: any) => {
        setSlotData([
            valores[parseInt(data.object.slotVolume)],
            valores[parseInt(data.object.slotTempo)]
        ]);
    };

    const handleQuandoResponder = () => {
        const resposta = [volumePrescrito, tempoPrescrito];
        const estaCorreto = slotData.length > 0 && slotData.every((value, index) => value === resposta[index]);
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Monte a equação na ordem correta.</p>

            <hr className="my-1 w-full" />

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>

                <SwapyGroup className="relative flex flex-wrap gap-2 justify-center w-full">
                    {
                        valores.map((slot, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={slot} className='w-0 max-w-[33.33%] flex-grow basis-1/4 h-12' />
                        )
                    }
                </SwapyGroup>

                <hr className="my-1 w-full" />

                <SwapyGroup className="flex flex-col gap-2 w-full px-8 justify-center items-center">
                    <DropSlot className='w-[50%] h-12 drop-slot' slotID={dropSlots[0]} />
                    <hr className="w-[60%] bg-slate-400 h-[2px]" />
                    <DropSlot className='w-[50%] h-12 drop-slot' slotID={dropSlots[1]} />
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

const EquacaoMgtsMinutos = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo } = extrairValoresDaQuestao(questao);
    const valores = [volumePrescrito, tempoPrescrito, constanteGotas, constanteMicrogotas, constanteTempo];

    const [slotData, setSlotData] = useState<SlotData[]>([]);
    const dropSlots = ['slotVolume', 'slotConstante', 'slotTempo'];

    const handleOnSwap = (data: any) => {
        setSlotData([
            valores[parseInt(data.object.slotVolume)],
            valores[parseInt(data.object.slotConstante)],
            valores[parseInt(data.object.slotTempo)]
        ]);
    };

    const handleQuandoResponder = () => {
        const resposta = [volumePrescrito, constanteMicrogotas, tempoPrescrito];
        const estaCorreto = slotData.length > 0 && slotData.every((value, index) => value === resposta[index]);
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Monte a equação na ordem correta.</p>

            <hr className="my-1 w-full" />

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>

                <SwapyGroup className="relative flex flex-wrap gap-2 justify-center w-full">
                    {
                        valores.map((slot, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={slot} className='w-0 max-w-[33.33%] flex-grow basis-1/4 h-12' />
                        )
                    }
                </SwapyGroup>

                <hr className="my-1 w-full" />

                <SwapyGroup className="flex flex-col gap-2 w-full px-8">
                    <SwapyGroup className="flex gap-2 w-full justify-center items-center">
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[0]} />
                        <p className='text-4xl'>×</p>
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[1]} />
                    </SwapyGroup>

                    <hr className="w-full bg-slate-400 h-[2px]" />

                    <SwapyGroup className="flex gap-2 w-full justify-center items-center">
                        <DropSlot className='w-0 max-w-[50%] flex-grow h-12 drop-slot' slotID={dropSlots[2]} />
                    </SwapyGroup>
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

/*
    Gotas / h           -> volume / tempo * 3
    Gotas / min         -> volume * 20 / tempo
    Microgotas / h      -> volume / tempo
    Microgotas / min    -> volume * 60 / tempo
*/

const EquacaoParte1 = ({ questao, quandoResponder }: EtapaProps) => {
    switch (questao.unidadeDestino) {
        case 'gts/min': return <EquacaoGtsMinutos questao={questao} quandoResponder={quandoResponder} />;
        case 'gts/hora': return <EquacaoGtsHoras questao={questao} quandoResponder={quandoResponder} />;
        case 'mgts/min': return <EquacaoMgtsMinutos questao={questao} quandoResponder={quandoResponder} />;
        case 'mgts/hora': return <EquacaoMgtsHoras questao={questao} quandoResponder={quandoResponder} />;
    }
}


/* ---------------------------------------------------------------------------------------------------------------------
--------- Equação Parte 02 ---------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

/*
    Gotas / h           -> volume / tempo * 3
    Gotas / min         -> volume * 20 / tempo
    Microgotas / h      -> volume / tempo
    Microgotas / min    -> volume * 60 / tempo
*/
const ResolverGtsHoras = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, tempoPrescrito, constanteTempo } = extrairValoresDaQuestao(questao);
    const valores = [volumePrescrito, tempoPrescrito, constanteTempo];

    const [multiplicacao, setMultiplicacao] = useState<string>('');
    const [divisao, setDivisao] = useState<number>(0);

    const multiplicacaoValida = () => {
        const valor = parseFloat(multiplicacao);

        if (multiplicacao === '' || Number.isNaN(valor)) 
            return true;

        return valor === questao.volume.valor * 20;
    }

    const handleQuandoResponder = () => {
        const resposta = calcularResposta(questao);
        const estaCorreto = Math.abs(resposta.valor - divisao) <= 0.05;
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Calcule o valor da equação</p>

            <hr className="my-1 w-full" />

            <div className='flex flex-col w-full gap-2'>
                <div className="flex flex-col gap-2 w-full px-8">
                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={valores[0]} />
                    </div>

                    <hr className="w-full bg-slate-400 h-[2px]" />

                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={valores[1]} />
                        <p className='text-4xl'>×</p>
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={valores[2]} />
                    </div>
                </div>

                <hr className="my-1 w-full" />

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={10} content={valores[1]} className='w-0 flex-grow h-12' />
                    <p>x</p>
                    <FakeSlot key={11} content={valores[2]} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <InputError className='w-1/3 mx-1 ' type='number' onChange={e => setMultiplicacao(e.target.value)} 
                        isValid={multiplicacaoValida()}/>
                </div>

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={12} content={valores[0]} className='w-0 flex-grow h-12' />
                    <p>/</p>
                    <FakeSlot key={13} content={multiplicacao} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <Input className='w-1/3 mx-1' type='number' onChange={e => setDivisao(e.target.valueAsNumber)} />
                </div>

            </div>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
}

const ResolverGtsMinutos = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, tempoPrescrito, constanteGotas } = extrairValoresDaQuestao(questao);
    const valores = [volumePrescrito, constanteGotas, tempoPrescrito];

    const [multiplicacao, setMultiplicacao] = useState<string>('');
    const [divisao, setDivisao] = useState<number>(0);

    const multiplicacaoValida = () => {
        const valor = parseFloat(multiplicacao);

        if (multiplicacao === '' || Number.isNaN(valor)) 
            return true;

        return valor === questao.volume.valor * 20;
    }

    const handleQuandoResponder = () => {
        const resposta = calcularResposta(questao);
        const estaCorreto = Math.abs(resposta.valor - divisao) <= 0.05;
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Calcule o valor da equação</p>

            <hr className="my-1 w-full" />

            <div className='flex flex-col w-full gap-2'>
                <div className="flex flex-col gap-2 w-full px-8">
                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={volumePrescrito} />
                        <p className='text-4xl'>×</p>
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={constanteGotas} />
                    </div>

                    <hr className="w-full bg-slate-400 h-[2px]" />

                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={tempoPrescrito} />
                    </div>
                </div>

                <hr className="my-1 w-full" />

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={10} content={volumePrescrito} className='w-0 flex-grow h-12' />
                    <p>x</p>
                    <FakeSlot key={11} content={constanteGotas} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <InputError className='w-1/3 mx-1 ' type='number' onChange={e => setMultiplicacao(e.target.value)}
                        isValid={multiplicacaoValida()}/>
                </div>

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={13} content={multiplicacao} className='w-0 flex-grow h-12' />
                    <p>/</p>
                    <FakeSlot key={12} content={tempoPrescrito} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <Input className='w-1/3 mx-1' type='number' onChange={e => setDivisao(e.target.valueAsNumber)} />
                </div>

            </div>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
}

const ResolverMgtsHoras = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, tempoPrescrito } = extrairValoresDaQuestao(questao);
    const [divisao, setDivisao] = useState<number>(0);

    const handleQuandoResponder = () => {
        const resposta = calcularResposta(questao);
        const estaCorreto = Math.abs(resposta.valor - divisao) <= 0.05;
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Calcule o valor da equação</p>

            <hr className="my-1 w-full" />

            <div className='flex flex-col w-full gap-2'>
                <div className="flex flex-col gap-2 w-full px-8 items-center">
                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={volumePrescrito} />
                    </div>

                    <hr className="w-[60%] bg-slate-400 h-[2px]" />

                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={tempoPrescrito} />
                    </div>
                </div>

                <hr className="my-1 w-full" />

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={13} content={volumePrescrito} className='w-0 flex-grow h-12' />
                    <p>/</p>
                    <FakeSlot key={12} content={tempoPrescrito} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <Input className='w-1/3 mx-1' type='number' onChange={e => setDivisao(e.target.valueAsNumber)} />
                </div>

            </div>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
}

const ResolverMgtsMinutos = ({ questao, quandoResponder }: EtapaProps) => {
    const { volumePrescrito, constanteMicrogotas, tempoPrescrito } = extrairValoresDaQuestao(questao);
    const valores = [volumePrescrito, constanteMicrogotas, tempoPrescrito];

    const [multiplicacao, setMultiplicacao] = useState<string>('');
    const [divisao, setDivisao] = useState<number>(0);

    const multiplicacaoValida = () => {
        const valor = parseFloat(multiplicacao);

        if (multiplicacao === '' || Number.isNaN(valor)) 
            return true;

        return valor === questao.volume.valor * 20;
    }

    const handleQuandoResponder = () => {
        const resposta = calcularResposta(questao);
        const estaCorreto = Math.abs(resposta.valor - divisao) <= 0.05;
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Calcule o valor da equação</p>

            <hr className="my-1 w-full" />

            <div className='flex flex-col w-full gap-2'>
                <div className="flex flex-col gap-2 w-full px-8">
                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={volumePrescrito} />
                        <p className='text-4xl'>×</p>
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={constanteMicrogotas} />
                    </div>

                    <hr className="w-full bg-slate-400 h-[2px]" />

                    <div className="flex gap-2 w-full justify-center items-center">
                        <FakeSlot className='w-0 max-w-[50%] flex-grow h-12' content={tempoPrescrito} />
                    </div>
                </div>

                <hr className="my-1 w-full" />

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={10} content={volumePrescrito} className='w-0 flex-grow h-12' />
                    <p>x</p>
                    <FakeSlot key={11} content={constanteMicrogotas} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <InputError className='w-1/3 mx-1 ' type='number' onChange={e => setMultiplicacao(e.target.value)} 
                        isValid={multiplicacaoValida()}/>
                </div>

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={13} content={multiplicacao} className='w-0 flex-grow h-12' />
                    <p>/</p>
                    <FakeSlot key={12} content={tempoPrescrito} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <Input className='w-1/3 mx-1' type='number' onChange={e => setDivisao(e.target.valueAsNumber)} />
                </div>

            </div>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
}

const EquacaoParte2 = ({ questao, quandoResponder }: EtapaProps) => {
    switch (questao.unidadeDestino) {
        case 'gts/min': return <ResolverGtsMinutos questao={questao} quandoResponder={quandoResponder} />
        case 'gts/hora': return <ResolverGtsHoras questao={questao} quandoResponder={quandoResponder} />
        case 'mgts/min': return <ResolverMgtsMinutos questao={questao} quandoResponder={quandoResponder} />
        case 'mgts/hora': return <ResolverMgtsHoras questao={questao} quandoResponder={quandoResponder} />
    }
}

const ArredondarValor = ({ questao, quandoResponder }: EtapaProps) => {
    const [respostaCorreta] = useState(calcularResposta(questao));

    const arredondarParaBaixo = 'Arredondar para baixo';
    const arredondarParaCima = 'Arredondar para cima';
    const naoArredondar = 'Não arredondar';

    const valores = [naoArredondar, arredondarParaBaixo, arredondarParaCima];
    
    const [slotData, setSlotData] = useState<string|null>(null);
    const handleOnSwap = (data: any) => {
        setSlotData(valores[parseInt(data.object.slotResposta)]);
    }

    const handleQuandoResponder = () => {
        const { decimal } = separarIntegralDecimal(respostaCorreta.valor, 2);

        const resposta = decimal === 0 
            ? naoArredondar : decimal < 0.5 
            ? arredondarParaBaixo : arredondarParaCima;

        let estaCorreto = slotData === resposta;

        quandoResponder(estaCorreto);
    }
    
    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center items-center'>
            <p className="font-medium">Observe o valor.</p>
            <FakeSlot className='w-[50%] h-12' content={`${respostaCorreta.valor} ${respostaCorreta.unidade}`}/>
            <p className="font-medium">Ele precisa ser arredondado?.</p>

            <hr className='w-full my-1' />

            <SwapyContainer animation="spring" className='flex flex-col gap-4 w-full' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte o valor correto nos campo marcado.</p>
                <SwapyGroup className='flex flex-wrap gap-2 w-full items-center justify-center'>
                    {
                        valores.map((valor, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={valor} className='w-0 max-w-[50%] basis-1/3 flex-grow h-12' />
                        )
                    }
                </SwapyGroup>
                
                <hr className='w-full my-1' />

                <DropSlot slotID={'slotResposta'} className='w-[50%] flex-grow ml-2 h-12' />
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
}

const VisualizarResultado = ({ questao, quandoResponder }: EtapaProps) => {
    const unidadeDestino = buscarUnidadeDestino(questao);
    let resposta = calcularResposta(questao);

    const { decimal } = separarIntegralDecimal(resposta.valor, 2);

    resposta.valor = decimal === 0 
        ? resposta.valor : decimal < 0.5 
        ? Math.floor(resposta.valor) : Math.ceil(resposta.valor);


    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center items-center'>
            <p className="font-medium">Parabéns você completou o cálculo!</p>
            <hr className="my-1 w-full" />

            <p >A quantidade de {unidadeDestino.nome} a ser infundidas são:</p>
            <div className='flex w-full gap-4 justify-center'>
                <FakeSlot key={12} content={`${resposta.valor} ${resposta.unidade.abreviacao}`} className='flex-grow max-w-[50%] h-12' />
            </div>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={() => quandoResponder(true)}>Continuar</Button>
        </div>
    );
}

export {
    IdentificarValores,
    IdentificarEquacao,
    IdentificarConvercao,
    RealizarConversao,
    EquacaoParte1,
    EquacaoParte2,    
    ArredondarValor,
    VisualizarResultado,
};
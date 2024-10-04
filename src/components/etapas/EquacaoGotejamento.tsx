import './EquacaoRegraDeTres.css'

import { EtapaProps } from "../GameGotejamento";

import SwapyContainer, { SwapyGroup } from "../swapy/SwapyContainer";
import SwapyItem from "../swapy/SwapyItem";
import SwapySlot from "../swapy/SwapySlot";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { SwapEventArray, SwapEventMap, SwapEventObject, Swapy } from 'swapy';

import * as conversoes from '@/models/conversao';
import { QuestaoGotejamento, QuestaoRegraDeTres } from '@/services/perguntasService';
import { gerarGrandeza, Grandeza } from '@/models/grandeza';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

type SlotData = string | null;

type PickSlotProps = { className?: string, content?: any, slotID: any, itemID: any }
function PickSlot({ className, content, slotID, itemID }: PickSlotProps) {
    return (
        <SwapySlot className={`p-1 bg-slate-200 ${className || ''}`} slotID={slotID}>
            <SwapyItem className='bg-orange-500' itemID={itemID}>
                <p className='text-sm'>{content}</p>
            </SwapyItem>
        </SwapySlot>
    );
};

type DropSlotProps = { className?: string, slotID: any }
function DropSlot({ className, slotID, children }: PropsWithChildren<DropSlotProps>) {
    return (
        <SwapySlot className={`drop-slot ${className || ''}`} slotID={slotID}>
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


/** Retorna um objeto com os valores da questão no formato de texto. */
const extrairValoresDaQuestao = (questao: QuestaoGotejamento) => {

    return {
        volumePrescrito: questao.volume.toString(),
        tempoPrescrito: questao.tempo.toString(),
        volumeAdministrado: 'x',
    };
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



export {
    IdentificarValores,
};
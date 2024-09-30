import './EquacaoRegraDeTres.css'

import { EtapaProps } from "../GameRegraDeTres";
import SwapyContainer from "../swapy/SwapyContainer";
import { SwapyGroup } from "../swapy/SwapyContainer";
import SwapyItem from "../swapy/SwapyItem";
import SwapySlot from "../swapy/SwapySlot";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PropsWithChildren, useEffect, useState } from 'react';
import { SwapEventArray, SwapEventMap, SwapEventObject, Swapy } from 'swapy';

import * as conversoes from '@/models/conversao';
import { QuestaoRegraDeTres } from '@/services/perguntasService';

const extrairValoresDaQuestao = (questao: QuestaoRegraDeTres) => {
    const precisaConverter = questao.prescricao.unidade !== questao.medicamento.unidade;
    const conversao = conversoes.buscarConversao(questao.medicamento.unidade, questao.prescricao.unidade);
    const doseDisponivel = (precisaConverter && conversao)
        ? conversao.converter(questao.medicamento).toString()
        : questao.medicamento.toString();

    return {
        dosePrescrita: questao.prescricao.toString(),
        doseDisponivel: doseDisponivel,
        volumeDisponível: questao.diluente.toString(),
        volumeAdministrado: 'x',
    };
}


const EquacaoParte1 = ({ questao, quandoResponder }: EtapaProps) => {
    const {
        dosePrescrita,
        doseDisponivel,
        volumeDisponível,
        volumeAdministrado
    } = extrairValoresDaQuestao(questao);

    const valores = [dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado];

    const respostas = [
        [dosePrescrita, doseDisponivel,
            volumeAdministrado, volumeDisponível],

        [dosePrescrita, volumeAdministrado,
            doseDisponivel, volumeDisponível],

        // Deixei só os dois modelos de fórmula, ver depois se tem outros jeitos de 
        // organizar a fórmula
    ];

    const [slotData, setSlotData] = useState<(string | null)[]>([null, null, null, null]);
    const dropSlots = ['slotTL', 'slotTR', 'slotBL', 'slotBR'];

    const handleOnSwap = (data: any) => {
        const slotTopLeft = valores[parseInt(data.object.slotTL)];
        const slotTopRight = valores[parseInt(data.object.slotTR)];
        const slotBottomLeft = valores[parseInt(data.object.slotBL)];
        const slotBottomRight = valores[parseInt(data.object.slotBR)];

        setSlotData([slotTopLeft, slotTopRight, slotBottomLeft, slotBottomRight]);
    };

    const handleQuandoResponder = () => {
        let estaCorreto = respostas.some(resposta => {
            return slotData.every((value, index) => value === resposta[index]);
        });

        localStorage.setItem('slotData1', JSON.stringify(slotData));
        quandoResponder(estaCorreto);
    };

    return (
        <div className="flex gap-4 w-full" >
            <SwapyContainer animation="spring" className='flex flex-col w-full' onSwap={handleOnSwap}>
                <SwapyGroup className="flex gap-2 w-full">
                    {
                        valores.map((valor, index) =>
                            <SwapySlot className='w-0 flex-grow h-12 p-1 bg-slate-200' key={index} slotID={index}>
                                <SwapyItem className='bg-orange-500' itemID={index}>
                                    <p>{valor}</p>
                                </SwapyItem>
                            </SwapySlot>
                        )
                    }
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <SwapyGroup className="relative flex flex-wrap gap-x-16 gap-y-4 justify-center w-full">
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <p className='text-8xl font-light'>×</p>
                    </div>
                    {
                        dropSlots.map((slot, index) =>
                            <SwapySlot key={index + 3} slotID={slot} className='w-0 flex-grow flex-shrink basis-1/3 h-12 drop-slot'></SwapySlot>
                        )
                    }
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <Button onClick={handleQuandoResponder}>Responder</Button>
            </SwapyContainer>
        </div>
    );
};

const EquacaoParte2 = ({ questao, quandoResponder }: EtapaProps) => {
    const {
        dosePrescrita,
        doseDisponivel,
        volumeDisponível,
        volumeAdministrado
    } = extrairValoresDaQuestao(questao);

    const data = localStorage.getItem('slotData1');
    const valores: string[] = !data
        ? [dosePrescrita, doseDisponivel, volumeAdministrado, volumeDisponível]
        : JSON.parse(data);

    const [slotData, setSlotData] = useState<(string | null)[]>([null, null, null, null]);

    const respostas = [
        [dosePrescrita, volumeDisponível, volumeAdministrado, doseDisponivel],  // 0 * 1 = 2 * 3
        [dosePrescrita, volumeDisponível, doseDisponivel, volumeAdministrado],  // 0 * 1 = 3 * 2 
        [volumeDisponível, dosePrescrita, doseDisponivel, volumeAdministrado],  // 1 * 0 = 3 * 2
        [volumeDisponível, dosePrescrita, volumeAdministrado, doseDisponivel],  // 1 * 0 = 2 * 3

        [doseDisponivel, volumeAdministrado, dosePrescrita, volumeDisponível],  // 3 * 2 = 0 * 1 
        [doseDisponivel, volumeAdministrado, volumeDisponível, dosePrescrita],  // 3 * 2 = 1 * 0
        [volumeAdministrado, doseDisponivel, dosePrescrita, volumeDisponível],  // 2 * 3 = 0 * 1
        [volumeAdministrado, doseDisponivel, volumeDisponível, dosePrescrita],  // 2 * 3 = 1 * 0
    ];

    const dropSlots = ['slotL1', 'slotL0', 'slotR0', 'slotR1'];
    const handleOnSwap = (data: any) => {
        const slotL1 = valores[parseInt(data.object.slotL1)];
        const slotL0 = valores[parseInt(data.object.slotL0)];
        const slotR0 = valores[parseInt(data.object.slotR0)];
        const slotR1 = valores[parseInt(data.object.slotR1)];

        setSlotData([slotL1, slotL0, slotR0, slotR1]);
    };

    const handleQuandoResponder = () => {
        let estaCorreto = respostas.some(resposta => {
            return slotData.every((value, index) => value === resposta[index]);
        });

        localStorage.setItem('slotData2', JSON.stringify(slotData));
        quandoResponder(estaCorreto);
    }

    return (
        <div className="flex gap-4 w-full" >
            <SwapyContainer animation="spring" className='flex flex-col w-full' onSwap={handleOnSwap}>
                <SwapyGroup className="relative flex flex-wrap gap-x-16 gap-y-4 justify-center w-full">
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <p className='text-8xl font-light'>×</p>
                    </div>
                    {
                        valores.map((slot, index) =>
                            <SwapySlot className='w-0 flex-grow flex-shrink basis-1/3 h-12 p-1 bg-slate-200' key={index} slotID={index}>
                                <SwapyItem className='bg-orange-500' itemID={index}>
                                    <p>{slot}</p>
                                </SwapyItem>
                            </SwapySlot>
                        )
                    }
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <SwapyGroup className="flex gap-2 w-full items-center">
                    {
                        dropSlots.slice(0, 2).map((slot, index) =>
                            <SwapySlot className='w-0 flex-grow h-12 drop-slot' key={index} slotID={slot}></SwapySlot>
                        )
                    }
                    <p className='text-4xl m-2'>=</p>
                    {
                        dropSlots.slice(2, 4).map((slot, index) =>
                            <SwapySlot className='w-0 flex-grow h-12 drop-slot' key={index} slotID={slot}></SwapySlot>
                        )
                    }
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <Button onClick={handleQuandoResponder}>Responder</Button>
            </SwapyContainer>
        </div>
    );
};

const EquacaoParte3 = ({ questao, quandoResponder }: EtapaProps) => {
    const { dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado } = extrairValoresDaQuestao(questao);
    const data = localStorage.getItem('slotData2');
    const valores: string[] = !data
        ? [dosePrescrita, volumeDisponível, volumeAdministrado, doseDisponivel]
        : JSON.parse(data);

    const xEstaNaDireita = valores.indexOf(volumeAdministrado) >= 2;

    const [slotData, setSlotData] = useState<(string | null)[]>([null, null, null, null]);

    const dropSlots = ['slotX0', 'slotT0', 'slotT1', 'slotB0'];
    const handleOnSwap = (data: any) => {
        const slotX0 = valores[parseInt(data.object.slotX0)];
        const slotT0 = valores[parseInt(data.object.slotT0)];
        const slotT1 = valores[parseInt(data.object.slotT1)];
        const slotB0 = valores[parseInt(data.object.slotB0)];

        setSlotData([slotX0, slotT0, slotT1, slotB0]);
    };

    const respostas = [
        [volumeAdministrado, dosePrescrita, volumeDisponível, doseDisponivel], // x = (dp * vd) / dd,
        [volumeAdministrado, volumeDisponível, dosePrescrita, doseDisponivel], // x = (vd * dp) / dd,
    ]

    const handleQuandoResponder = () => {
        let estaCorreto = respostas.some(resposta => {
            return slotData.every((value, index) => value === resposta[index]);
        });

        localStorage.setItem('slotData3', JSON.stringify(slotData));
        quandoResponder(estaCorreto);
    }

    return (
        <div className="flex gap-4 w-full" >
            <SwapyContainer animation="spring" className='flex flex-col w-full' onSwap={handleOnSwap}>
                <SwapyGroup className="flex gap-2 w-full items-center">
                    {
                        valores.slice(0, 2).map((slot, index) =>
                            <SwapySlot className='w-0 flex-grow h-12 p-1 bg-slate-200' key={index} slotID={slot}>
                                <SwapyItem className='bg-orange-500' itemID={index}>
                                    <p>{slot}</p>
                                </SwapyItem>
                            </SwapySlot>
                        )
                    }
                    <p className='text-2xl mx-1'>=</p>
                    {
                        valores.slice(2, 4).map((slot, index) =>
                            <SwapySlot className='w-0 flex-grow h-12 p-1 bg-slate-200' key={index} slotID={slot}>
                                <SwapyItem className='bg-orange-500' itemID={index + 2}>
                                    <p>{slot}</p>
                                </SwapyItem>
                            </SwapySlot>
                        )
                    }
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <SwapyGroup className={`flex gap-2 w-full items-center ${xEstaNaDireita ? 'flex-row-reverse' : ''}`}>
                    {
                        dropSlots.slice(0, 1).map((slot, index) =>
                            <SwapySlot className='w-0 flex-grow h-12 basis-1/3 drop-slot' key={index} slotID={slot}></SwapySlot>
                        )
                    }
                    <p className='text-4xl mx-2'>=</p>
                    <SwapyGroup className='flex flex-col w-0 flex-grow basis-2/3 items-center'>
                        <SwapyGroup className='flex w-full flex-grow items-center'>
                            {
                                dropSlots.slice(1, 2).map((slot, index) =>
                                    <SwapySlot className='w-0 flex-grow h-12 drop-slot' key={index} slotID={slot}></SwapySlot>
                                )
                            }
                            <p className='text-2xl mx-4'>x</p>
                            {
                                dropSlots.slice(2, 3).map((slot, index) =>
                                    <SwapySlot className='w-0 flex-grow h-12 drop-slot' key={index} slotID={slot}></SwapySlot>
                                )
                            }
                        </SwapyGroup>
                        <hr className="my-2 w-full" />
                        {
                            dropSlots.slice(3, 4).map((slot, index) =>
                                <SwapySlot className='flex-grow w-1/2 h-12 drop-slot' key={index} slotID={slot}></SwapySlot>
                            )
                        }
                    </SwapyGroup>
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <Button onClick={handleQuandoResponder}>Responder</Button>
            </SwapyContainer>
        </div>
    );
};

const EquacaoParte4 = ({ questao, quandoResponder }: EtapaProps) => {
    const { dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado } = extrairValoresDaQuestao(questao);

    const data = localStorage.getItem('slotData2');
    const valores: string[] = !data
        ? [volumeAdministrado, dosePrescrita, volumeDisponível, doseDisponivel]
        : JSON.parse(data);

    const [valor, setValor] = useState<number>();

    const handleQuandoResponder = () => {
        const resposta = questao.prescricao.valor * questao.diluente.valor;
        quandoResponder(resposta === valor);
    }

    return (
        <div className="flex gap-4 w-full" >
            <div className='flex flex-col w-full gap-4'>
                <div className='flex gap-2 w-full items-center'>
                    {valores.slice(0, 1).map((slot, index) => <FakeSlot key={index} content={slot} className='w-0 flex-grow basis-1/3 h-12' />)}
                    <p className='text-4xl mx-2'>=</p>
                    <div className='flex flex-col w-0 flex-grow basis-2/3 items-center'>
                        <div className='flex w-full flex-grow items-center'>
                            {valores.slice(1, 2).map((slot, index) => <FakeSlot key={index} content={slot} className='w-0 flex-grow h-12' />)}
                            <p className='text-2xl mx-4'>x</p>
                            {valores.slice(2, 3).map((slot, index) => <FakeSlot key={index} content={slot} className='w-0 flex-grow h-12' />)}
                        </div>
                        <hr className="my-2 w-full" />
                        {valores.slice(3, 4).map((slot, index) => <FakeSlot key={index} content={slot} className='w-1/2 flex-grow h-12' />)}
                    </div>
                </div>
                <hr className="my-1 w-full" />

                <div className='flex gap-4 items-center'>
                    <p className='w-0 flex-grow'>{valores[1]}</p>
                    <p>x</p>
                    <p className='w-0 flex-grow'>{valores[2]}</p>
                    <p>=</p>
                    <Input className='w-1/2' type='number' onChange={e => setValor(e.target.valueAsNumber)} />
                </div>
                <hr className="my-1 w-full" />
                <Button onClick={handleQuandoResponder}>Responder</Button>
            </div>
        </div>
    );
};

type FakeSlotProps = { className?: string, content?: string }
function FakeSlot({ className, content }: FakeSlotProps) {
    return (
        <div className={`p-1 bg-slate-200 rounded-lg ${className ?? ''}`}>
            <div className='bg-slate-500 rounded-lg w-full h-full flex items-center justify-center'>
                <p className='text-slate-50'>{content ?? ''}</p>
            </div>
        </div>
    )
}

export {
    EquacaoParte1,
    EquacaoParte2,
    EquacaoParte3,
    EquacaoParte4,
};
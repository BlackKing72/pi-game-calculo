import './EquacaoRegraDeTres.css'

import { EtapaProps } from "../GameRegraDeTres";
import SwapyContainer from "../swapy/SwapyContainer";
import { SwapyGroup } from "../swapy/SwapyContainer";
import SwapyItem from "../swapy/SwapyItem";
import SwapySlot from "../swapy/SwapySlot";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { SwapEventArray, SwapEventMap, SwapEventObject, Swapy } from 'swapy';

import * as conversoes from '@/models/conversao';
import { gerarRespostas, QuestaoRegraDeTres } from '@/services/perguntasService';
import { Grandeza } from '@/models/grandeza';

type SlotData = string | null;

/** Se necessário converter o valor da dose disponível, senão mantem o valor original. */
const converterDoseDisponivel = (questao: QuestaoRegraDeTres) => {
    // se as unidades forem diferentes precisa converter o valor.
    const precisaConverter = questao.prescricao.unidade !== questao.medicamento.unidade;

    // tenta achar uma conversão disponível para essas unidades.
    // o medicamento é a unidade de origem (a unidade que você quer converter).
    // a prescrição é a unidade de destino (a unidade do valor quando convertido).
    const conversao = conversoes.buscarConversao(questao.medicamento.unidade, questao.prescricao.unidade);

    // se precisar converter e achar uma conversão para as unidades retorna o valor
    // convertido, senão o valor original.
    return (precisaConverter && conversao)
        ? conversao.converter(questao.medicamento)
        : questao.medicamento;
}

/** Retorna um objeto com os valores da questão no formato de texto. */
const extrairValoresDaQuestao = (questao: QuestaoRegraDeTres) => {
    const doseDisponivel = converterDoseDisponivel(questao);

    return {
        dosePrescrita: questao.prescricao.toString(),
        doseDisponivel: doseDisponivel.toString(),
        volumeDisponível: questao.diluente.toString(),
        volumeAdministrado: 'x',
    };
}

const IdentificarValores = ({ questao, quandoResponder }: EtapaProps) => {
    const valoresPrescritos = gerarRespostas(questao.prescricao, questao.prescricao.valor * 2, 3);
    const valoresMedicacoes = gerarRespostas(questao.medicamento, questao.medicamento.valor * 2, 3);
    const valoresDiluentes = gerarRespostas(questao.diluente, questao.diluente.valor * 2, 3);

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium"> Arraste os valores para montar a fórmula na ordem correta.</p>

            <SwapyContainer animation="spring" className='equacao-container' >
                {
                    valoresPrescritos.valores.map((valor, index) => 
                        <PickSlot key={index} slotID={index} itemID={index} content={valor} />
                    )
                }
                {
                    valoresMedicacoes.valores.map((valor, index) => 
                        <PickSlot key={index} slotID={index} itemID={index} content={valor} />
                    )
                }
                {
                    valoresDiluentes.valores.map((valor, index) => 
                        <PickSlot key={index} slotID={index} itemID={index} content={valor} />
                    )
                }
            </SwapyContainer>
        </div>
    );
};

const EquacaoParte1 = ({ questao, quandoResponder }: EtapaProps) => {
    // transformar os valores da questão em texto.
    const { dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado } = extrairValoresDaQuestao(questao);

    // a lista de valores na ordem que vão aparecer.
    // todo: podia ser aleatório para o jogador não conseguir decorar a orderm.
    const valores = [dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado];

    // guarda as valores que foram colocados no slots de resposta.
    const [slotData, setSlotData] = useState<SlotData[]>([]);

    // o slot precisa ter um id que possa ser reconhecido para buscar o valor depois.
    const dropSlots = ['slotTL', 'slotTR', 'slotBL', 'slotBR'];

    const handleOnSwap = (data: any) => {
        // toda vez q algum slot é trocado, guarda os valores que foram colocados dentro 
        // do slots de resposta. o 'data.object.slotXX' retorna o id do slot que é um 
        // index para a array de valores, mas como o 'swapy' salva o id do slot como
        // texto, precisa ser convertido para número de novo.
        setSlotData([
            valores[parseInt(data.object.slotTL)],
            valores[parseInt(data.object.slotTR)],
            valores[parseInt(data.object.slotBL)],
            valores[parseInt(data.object.slotBR)]]);
    };

    const handleQuandoResponder = () => {
        // uma lista que representa a ordem correta dos valores do slot.
        const respostas = [
            [dosePrescrita, doseDisponivel, volumeAdministrado, volumeDisponível],
            [dosePrescrita, volumeAdministrado, doseDisponivel, volumeDisponível],

            // deixei só os dois modelos de fórmula, ver depois se tem outros jeitos de 
            // organizar a fórmula.
        ];

        // está correto se a ordem de alguma das resposta for exatamente igual a ordem 
        // que o jogador respondeu.
        let estaCorreto = respostas.some(resposta => {
            return slotData.every((value, index) => value === resposta[index]);
        });

        // salva a resposta no localStorage para ser usado pela próxima etapa.
        localStorage.setItem('respostaEquacao1', JSON.stringify(slotData));

        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium"> Arraste os valores para montar a fórmula na ordem correta.</p>

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <SwapyGroup className="equacao-values-container">
                    {
                        valores.map((valor, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={valor} className='w-0 flex-grow flex-shrink basis-1/3 h-12' />
                        )
                    }
                </SwapyGroup>

                <hr className="my-1 w-full" />

                <SwapyGroup className="relative flex flex-wrap gap-x-16 gap-y-4 justify-center w-full">
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <p className='text-5xl font-light'>×</p>
                    </div>
                    {
                        dropSlots.map((slot, index) =>
                            <DropSlot key={index} slotID={slot} className='w-0 flex-grow flex-shrink basis-1/3 h-12' />
                        )
                    }
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

const EquacaoParte2 = ({ questao, quandoResponder }: EtapaProps) => {
    // transformar os valores da questão em texto.
    const { dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado } = extrairValoresDaQuestao(questao);

    // busca a resposta da etapa anterior no localStorage e tranforma em uma lista de 
    // valores. se não encontrar (provavelmente por algum erro) usa um valor padrão.
    const repostaAnterior = localStorage.getItem('respostaEquacao1');
    const valores: string[] = !repostaAnterior
        ? [dosePrescrita, doseDisponivel, volumeAdministrado, volumeDisponível]
        : JSON.parse(repostaAnterior);

    // guarda as valores que foram colocados no slots de resposta.
    const [slotData, setSlotData] = useState<SlotData[]>([]);

    // o slot precisa ter um id que possa ser reconhecido para buscar o valor depois.
    const dropSlots = ['slotL1', 'slotL0', 'slotR0', 'slotR1'];

    const handleOnSwap = (data: any) => {
        // toda vez q algum slot é trocado, guarda os valores que foram colocados dentro 
        // do slots de resposta. o 'data.object.slotXX' retorna o id do slot que é um 
        // index para a array de valores, mas como o 'swapy' salva o id do slot como
        // texto, precisa ser convertido para número de novo.
        setSlotData([
            valores[parseInt(data.object.slotL1)],
            valores[parseInt(data.object.slotL0)],
            valores[parseInt(data.object.slotR0)],
            valores[parseInt(data.object.slotR1)]]);
    };

    const handleQuandoResponder = () => {
        // uma lista que representa a ordem correta dos valores do slot. como o jogador
        // pode colocar as respostas de várias maneiras e ainda estarem corretas, precisa
        // de todas as combinações certas possíveis.
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

        // está correto se a ordem de alguma das resposta for exatamente igual a ordem 
        // que o jogador respondeu.
        let estaCorreto = respostas.some(resposta => {
            return slotData.every((value, index) => value === resposta[index]);
        });

        // salva a resposta no localStorage para ser usado pela próxima etapa.
        localStorage.setItem('respostaEquacao2', JSON.stringify(slotData));

        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium"> Arraste os valores para montar a fórmula na ordem correta.</p>

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <SwapyGroup className="relative flex flex-wrap gap-x-8 gap-y-4 justify-center w-full">
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                        <p className='text-5xl font-light'>×</p>
                    </div>
                    {
                        valores.map((slot, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={slot} className='w-0 flex-grow basis-1/3 h-12' />
                        )
                    }
                </SwapyGroup>

                <hr className="my-1 w-full" />

                <SwapyGroup className="equacao-parte-2">
                    {
                        dropSlots.slice(0, 2).map((slot, index) =>
                            <DropSlot className='w-0 flex-grow h-12 drop-slot' key={index + 3} slotID={slot} />
                        )
                    }
                    <p className='text-4xl m-2'>=</p>
                    {
                        dropSlots.slice(2, 4).map((slot, index) =>
                            <DropSlot className='w-0 flex-grow h-12 drop-slot' key={index + 5} slotID={slot} />
                        )
                    }
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

const EquacaoParte3 = ({ questao, quandoResponder }: EtapaProps) => {
    // transformar os valores da questão em texto.
    const { dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado } = extrairValoresDaQuestao(questao);

    // busca a resposta da etapa anterior no localStorage e tranforma em uma lista de 
    // valores. se não encontrar (provavelmente por algum erro) usa um valor padrão.
    const repostaAnterior = localStorage.getItem('respostaEquacao2');
    const valores: string[] = !repostaAnterior
        ? [dosePrescrita, volumeDisponível, volumeAdministrado, doseDisponivel]
        : JSON.parse(repostaAnterior);

    // usado para inverter a posição dos slots de resposta.
    // verifica se a solução ('x') está na direita ou esquerda da fórmula, antes ou depois 
    // do '='. como a ordem dos valores é conhecida (v0 * v1 = v2 * v3) se o index de 'x' 
    // for >= 2 ele vai estar posicionado depois do '='.
    const solucaoEstaNaDireita = valores.indexOf(volumeAdministrado) >= 2;

    // guarda as valores que foram colocados no slots de resposta.
    const [slotData, setSlotData] = useState<SlotData[]>([]);

    // o slot precisa ter um id que possa ser reconhecido para buscar o valor depois.
    const dropSlots = ['slotX0', 'slotT0', 'slotT1', 'slotB0'];

    const handleOnSwap = (data: any) => {
        // toda vez q algum slot é trocado, guarda os valores que foram colocados dentro 
        // do slots de resposta. o 'data.object.slotXX' retorna o id do slot que é um 
        // index para a array de valores, mas como o 'swapy' salva o id do slot como
        // texto, precisa ser convertido para número de novo.
        setSlotData([
            valores[parseInt(data.object.slotX0)],
            valores[parseInt(data.object.slotT0)],
            valores[parseInt(data.object.slotT1)],
            valores[parseInt(data.object.slotB0)]]);
    };

    const handleQuandoResponder = () => {
        // uma lista que representa a ordem correta dos valores do slot. como o jogador só 
        // pode inverter o valor da dose prescrita e do volume disponível, não precisa de
        // tantas respostas como na etapa anterior.
        const respostas = [
            [volumeAdministrado, dosePrescrita, volumeDisponível, doseDisponivel], // x = (dp * vd) / dd,
            [volumeAdministrado, volumeDisponível, dosePrescrita, doseDisponivel], // x = (vd * dp) / dd,
        ]

        // está correto se a ordem de alguma das resposta for exatamente igual a ordem 
        // que o jogador respondeu.
        let estaCorreto = respostas.some(resposta => {
            return slotData.every((value, index) => value === resposta[index]);
        });

        // salva a resposta no localStorage para ser usado pela próxima etapa.
        localStorage.setItem('respostaEquacao3', JSON.stringify(slotData));

        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium"> Arraste os valores para montar a fórmula na ordem correta.</p>

            <SwapyContainer animation="spring" className='flex flex-col w-full' onSwap={handleOnSwap}>
                <SwapyGroup className="flex gap-2 w-full items-center">
                    {
                        valores.slice(0, 2).map((slot, index) =>
                            <PickSlot key={index} slotID={index} itemID={index} content={slot} className='w-0 flex-grow h-12' />
                        )
                    }
                    <p className='text-2xl mx-1'>=</p>
                    {
                        valores.slice(2, 4).map((slot, index) =>
                            <PickSlot key={index + 2} slotID={index + 2} itemID={index + 2} content={slot} className='w-0 flex-grow h-12' />
                        )
                    }
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <SwapyGroup className={`flex gap-2 w-full items-center ${solucaoEstaNaDireita ? 'flex-row-reverse' : ''}`}>
                    <DropSlot className='w-0 flex-grow h-12 basis-1/3' slotID={dropSlots[0]} />
                    <p className='text-4xl mx-2'>=</p>

                    <SwapyGroup className='flex flex-col w-0 flex-grow basis-2/3 items-center'>
                        <SwapyGroup className='flex w-full flex-grow items-center'>
                            <SwapySlot className='w-0 flex-grow h-12 drop-slot' slotID={dropSlots[1]}></SwapySlot>
                            <p className='text-2xl mx-4'>x</p>
                            <SwapySlot className='w-0 flex-grow h-12 drop-slot' slotID={dropSlots[2]}></SwapySlot>
                        </SwapyGroup>

                        <hr className="my-2 w-full" />

                        <SwapySlot className='flex-grow w-1/2 h-12 drop-slot' slotID={dropSlots[3]}></SwapySlot>
                    </SwapyGroup>
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <Button className='w-full' onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

const EquacaoParte4 = ({ questao, quandoResponder }: EtapaProps) => {
    // transformar os valores da questão em texto.
    const { dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado } = extrairValoresDaQuestao(questao);

    // busca a resposta da etapa anterior no localStorage e tranforma em uma lista de 
    // valores. se não encontrar (provavelmente por algum erro) usa um valor padrão.
    const repostaAnterior = localStorage.getItem('respostaEquacao3');
    const valores: string[] = !repostaAnterior
        ? [volumeAdministrado, dosePrescrita, volumeDisponível, doseDisponivel]
        : JSON.parse(repostaAnterior);

    // salva os valores inseridos pelo jogador.
    const [multiplicacao, setMultiplicacao] = useState<number>();
    const [divisao, setDivisao] = useState<number>();

    const handleQuandoResponder = () => {
        // se as unidades forem diferentes precisa converter o valor.
        const doseDisponivel = converterDoseDisponivel(questao);

        // o valor esperado.
        const resposta = (questao.prescricao.valor * questao.diluente.valor) / doseDisponivel.valor;

        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(resposta === divisao);
    }

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center'>
            <p className="font-medium">Calcule o valor da equação para descobrir a dose que deve ser administrada</p>

            <div className='flex flex-col w-full gap-2'>
                <div className='flex gap-2 w-full items-center'>
                    <FakeSlot content={valores[0]} className='w-0 flex-grow basis-1/3 h-12' />
                    <p className='text-4xl mx-2'>=</p>

                    <div className='flex flex-col w-0 flex-grow basis-2/3 items-center'>
                        <div className='flex w-full flex-grow items-center'>
                            <FakeSlot content={valores[1]} className='w-0 flex-grow h-12' />
                            <p className='text-2xl mx-4'>x</p>
                            <FakeSlot content={valores[2]} className='w-0 flex-grow h-12' />
                        </div>

                        <hr className="my-2 w-full" />
                        <FakeSlot content={valores[3]} className='w-1/2 flex-grow h-12' />
                    </div>
                </div>
                <hr className="my-1 w-full" />

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={10} content={valores[1]} className='w-0 flex-grow h-12' />
                    <p>x</p>
                    <FakeSlot key={11} content={valores[2]} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <Input className='w-1/3' type='number' onChange={e => setMultiplicacao(e.target.valueAsNumber)} />
                </div>

                <div className='flex gap-4 items-center'>
                    <FakeSlot key={12} content={multiplicacao} className='w-0 flex-grow h-12' />
                    <p>/</p>
                    <FakeSlot key={13} content={valores[3]} className='w-0 flex-grow h-12' />
                    <p>=</p>
                    <Input className='w-1/3' type='number' onChange={e => setDivisao(e.target.valueAsNumber)} />
                </div>

                <hr className="my-1 w-full" />
                <Button onClick={handleQuandoResponder}>Responder</Button>
            </div>
        </div>
    );
};

const EquacaoParte5 = ({ questao, quandoResponder }: EtapaProps) => {
    const doseDisponivel = converterDoseDisponivel(questao);
    const resposta = (questao.prescricao.valor * questao.diluente.valor) / doseDisponivel.valor;
    const grandeza = new Grandeza(resposta, questao.diluente.unidade);

    return (
        <div className='flex flex-col gap-2 w-full h-full justify-center items-center'>
            <p className="font-medium">A quantidade de medicamento a ser administrada é de:</p>
            <div className='flex w-full gap-4 justify-center'>
                <FakeSlot key={12} content={grandeza.toString()} className='flex-grow max-w-[50%] h-12' />
            </div>
        </div>
    );
}


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

export {
    EquacaoParte1,
    EquacaoParte2,
    EquacaoParte3,
    EquacaoParte4,
    EquacaoParte5,
};

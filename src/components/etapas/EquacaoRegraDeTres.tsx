import './EquacaoRegraDeTres.css'

import { EtapaProps } from "../GameRegraDeTres";

import SwapyContainer, { SwapyGroup } from "../swapy/SwapyContainer";
import { FakeSlot, PickSlot, DropSlot } from '../game/game-slots';
import { GameButton } from '../game/game-button';
import { Input } from '../ui/input';
import { useState } from 'react';

import { QuestaoRegraDeTres } from '@/models/questoes-regradetres';
import { gerarGrandeza, Grandeza } from '@/models/grandeza';
import * as conversoes from '@/models/conversao';

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

const embaralharLista = (lista: any[]) => {
    let resultado = [...lista];
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

const gerarRespostas = (questao: QuestaoRegraDeTres) => {
    const prescricaoGerada = gerarGrandeza(questao.prescricao, questao.prescricao.valor * 1.5, true, true);
    const medicacaoGerada = gerarGrandeza(questao.medicamento, questao.medicamento.valor * 1.5, true, true);
    const diluenteGerado = gerarGrandeza(questao.diluente, questao.diluente.valor * 1.5, true, true);

    return embaralharLista([
        questao.prescricao, questao.medicamento, questao.diluente,
        prescricaoGerada, medicacaoGerada, diluenteGerado]);
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
            valores[parseInt(data.object.slotPrescrito)],
            valores[parseInt(data.object.slotMedicamento)],
            valores[parseInt(data.object.slotDiluente)]
        ]);
    };

    const handleQuandoResponder = () => {
        const resposta = [questao.prescricao, questao.medicamento, questao.diluente];
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
                        <p className="text-sm mb-2">Dose<br />prescrita</p>
                        <DropSlot slotID={'slotPrescrito'} className='w-full h-12' />
                    </SwapyGroup>
                    <SwapyGroup className='w-0 flex-grow basis-1/4'>
                        <p className="text-sm mb-2">Dose<br />disponível</p>
                        <DropSlot slotID={'slotMedicamento'} className='w-full h-12' />
                    </SwapyGroup>
                    <SwapyGroup className='relative w-0 flex-grow basis-1/4'>
                        <p className="text-sm mb-2">Diluente<br />disponível</p>
                        <DropSlot slotID={'slotDiluente'} className='w-full h-12' />
                    </SwapyGroup>
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <GameButton className='w-full' onClick={handleQuandoResponder}>Responder</GameButton>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Identificar Conversão ----------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

const IdentificarConvercao = ({ questao, quandoResponder }: EtapaProps) => {

    const handleQuandoResponder = (respondeuSim: boolean) => {
        const unidadesSaoDiferentes = questao.prescricao.unidade !== questao.medicamento.unidade;

        const estaCorreto = respondeuSim
            ? unidadesSaoDiferentes
            : !unidadesSaoDiferentes;

        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="w-full font-medium">
                Observe as informações abaixo sobre o medicamento prescrito e o medicamento disponível.
            </p>

            <hr className="my-1 w-full" />

            <div className='flex flex-col w-full gap-2'>

                <div className='flex w-full gap-4 flex-grow items-center'>
                    <p className='text-right text-sm flex-grow w-0 basis-1/3'>Dose prescrita: </p>
                    <FakeSlot content={questao.prescricao.toString()} className='flex-grow w-0 basis-1/3 h-12' />
                </div>

                <div className='flex w-full gap-4 flex-grow items-center'>
                    <p className='text-right text-sm flex-grow w-0 basis-1/3'>Medicamento disponível: </p>
                    <FakeSlot content={questao.medicamento.toString()} className='flex-grow w-0 basis-1/3 h-12' />
                </div>

            </div>

            <hr className="my-1 w-full" />

            <p className="w-full font-medium">
                Observando as unidades de medida, o valor do medicamento disponível precisa ser convertido?
            </p>

            <div className='flex gap-2'>
                <GameButton className='flex-grow' onClick={() => handleQuandoResponder(true)}>Sim</GameButton>
                <GameButton className='flex-grow' onClick={() => handleQuandoResponder(false)}>Não</GameButton>
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
    const unidadeOrigem = questao.medicamento.unidade;
    const unidadeDestino = questao.prescricao.unidade;

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

            <SwapyContainer animation="spring" className='flex flex-col gap-4' onSwap={handleOnSwap}>
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
            <GameButton className='w-full' onClick={handleQuandoResponder}>Responder</GameButton>
        </div>
    );
};


/* ---------------------------------------------------------------------------------------------------------------------
--------- Equação Parte 01 ---------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

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
            return slotData.length > 0 && slotData.every((value, index) => value === resposta[index]);
        });

        // salva a resposta no localStorage para ser usado pela próxima etapa.
        localStorage.setItem('respostaEquacao1', JSON.stringify(slotData));

        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(estaCorreto);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Monte a equação na ordem correta.</p>

            <hr className="my-1 w-full" />

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>

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
            <GameButton className='w-full' onClick={handleQuandoResponder}>Responder</GameButton>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Equação Parte 02 ---------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

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
            return slotData.length > 0 && slotData.every((value, index) => value === resposta[index]);
        });

        // salva a resposta no localStorage para ser usado pela próxima etapa.
        localStorage.setItem('respostaEquacao2', JSON.stringify(slotData));

        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Monte a equação na ordem correta.</p>

            <hr className="my-1 w-full" />

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>

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
            <GameButton className='w-full' onClick={handleQuandoResponder}>Responder</GameButton>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Equação Parte 03 ---------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

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
            return slotData.length > 0 && slotData.every((value, index) => value === resposta[index]);
        });

        // salva a resposta no localStorage para ser usado pela próxima etapa.
        localStorage.setItem('respostaEquacao3', JSON.stringify(slotData));

        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Monte a equação na ordem correta.</p>

            <hr className="my-1 w-full" />

            <SwapyContainer animation="spring" className='equacao-container' onSwap={handleOnSwap}>
                <p className="font-light text-sm">Arraste e solte os valores corretos nos campos marcados.</p>

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
                            <DropSlot className='w-0 flex-grow h-12 drop-slot' slotID={dropSlots[1]}></DropSlot>
                            <p className='text-2xl mx-4'>x</p>
                            <DropSlot className='w-0 flex-grow h-12 drop-slot' slotID={dropSlots[2]}></DropSlot>
                        </SwapyGroup>

                        <hr className="my-2 w-full" />

                        <DropSlot className='flex-grow w-1/2 h-12 drop-slot' slotID={dropSlots[3]}></DropSlot>
                    </SwapyGroup>
                </SwapyGroup>
            </SwapyContainer>

            <hr className="my-1 w-full" />
            <GameButton className='w-full' onClick={handleQuandoResponder}>Responder</GameButton>
        </div>
    );
};

/* ---------------------------------------------------------------------------------------------------------------------
--------- Equação Parte 04 ---------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------- */

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
        const respostaCorreta = (questao.prescricao.valor * questao.diluente.valor) / doseDisponivel.valor;
        const estaCorreto = respostaCorreta === divisao;
        // chama o evento que avisa o jogo se o usuário respondeu a pergunta.
        quandoResponder(estaCorreto);
    }

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center'>
            <p className="font-medium">Calcule o valor da equação para descobrir a dose que deve ser administrada</p>

            <hr className="my-1 w-full" />

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

                        <hr className="my-1 w-full" />
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

            </div>

            <hr className="my-1 w-full" />
            <GameButton className='w-full' onClick={handleQuandoResponder}>Responder</GameButton>
        </div>
    );
};

const EquacaoParte5 = ({ questao, quandoResponder }: EtapaProps) => {
    const doseDisponivel = converterDoseDisponivel(questao);
    const resposta = (questao.prescricao.valor * questao.diluente.valor) / doseDisponivel.valor;
    const grandeza = new Grandeza(resposta, questao.diluente.unidade);

    return (
        <div className='flex flex-col gap-4 w-full h-full justify-center items-center'>
            <p className="font-medium">Parabéns você completou o cálculo!</p>
            <hr className="my-1 w-full" />

            <p >A quantidade de medicamento a ser administrada é de:</p>
            <div className='flex w-full gap-4 justify-center'>
                <FakeSlot key={12} content={grandeza.toString()} className='flex-grow max-w-[50%] h-12' />
            </div>

            <hr className="my-1 w-full" />
            <GameButton className='w-full' onClick={() => quandoResponder(true)}>Continuar</GameButton>
        </div>
    );
}

export {
    IdentificarValores,
    IdentificarConvercao,
    RealizarConversao,
    EquacaoParte1,
    EquacaoParte2,
    EquacaoParte3,
    EquacaoParte4,
    EquacaoParte5,
};

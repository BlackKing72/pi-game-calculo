import { QuestaoRegraDeTres, gerarRespostas } from "@/services/perguntasService";
import { Grandeza } from "@/models/grandeza";

import MinigameConverterValor from "./minigames/MinigameConverterValor";
import MinigameSelecionarValor from "./minigames/MinigameSelecionarValor";
import MinigameEscolherOpcao from "./minigames/MinigameEscolherOpcao";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

// Como estou usando TypeScript preciso definir alguns tipos para facilitar.
// Alguns não precisam porque o TypeScript reconhece automaticamente.

// Um tipo que representa uma função '(argumentos...) => retorno';
// '?' é um argumento opcional, e o void diz que a função não retorna nada.
type CallbackResposta = (resposta: boolean, pularPaginas?: number) => void;

// Um tipo que representa um objeto, é bem parecido com um objeto normal, mas
// no lugar do valor está o tipo. 'nomeDaPropriedade: tipo';
// Ele representa as propriedades de um componente do react.
type GameStepProps = {
    questao: QuestaoRegraDeTres,
    quandoResponder: CallbackResposta,
};

type SelecionarValorProps = {
    titulo: string
    valores: Grandeza[],
    resposta: number,
    quandoResponder: CallbackResposta,
};

const SelecionarValor = ({ titulo, valores, resposta, quandoResponder }: SelecionarValorProps) => {
    const handleQuandoResponder = (e: number) => {
        quandoResponder(e === resposta);
    }

    return (
        <MinigameSelecionarValor
            titulo={titulo}
            quandoResponder={handleQuandoResponder}
            valores={valores.map(valor => valor.toString())} />
    );
};

const SelecionarMedicamentoPrescrito = ({ questao, quandoResponder }: GameStepProps) => {
    const valoresPrescritos = gerarRespostas(questao.prescricao, questao.prescricao.valor * 2, 3);

    return (
        <SelecionarValor
            titulo="Qual é o medicamento prescrito pelo médico?"
            resposta={valoresPrescritos.resposta}
            valores={valoresPrescritos.valores}
            quandoResponder={quandoResponder} />
    );
};

const SelecionarMedicamentoDisponivel = ({ questao, quandoResponder }: GameStepProps) => {
    const valoresMedicamentos = gerarRespostas(questao.medicamento, questao.medicamento.valor * 2, 3);

    return (
        <SelecionarValor
            titulo="Qual medicamento está disponível?"
            resposta={valoresMedicamentos.resposta}
            valores={valoresMedicamentos.valores}
            quandoResponder={quandoResponder} />
    );
};

const SelecionarDiluenteDisponivel = ({ questao, quandoResponder }: GameStepProps) => {
    const valoresDiluentes = gerarRespostas(questao.diluente, questao.diluente.valor * 2, 3);

    const handleQuandoResponder = (e: number) => {
        console.log(`SelecionarDiluenteDisponivel() => ${e} ${valoresDiluentes.resposta}`);
        quandoResponder(e == valoresDiluentes.resposta);
    };

    return (
        <MinigameSelecionarValor
            titulo='Qual diliuente está disponível?'
            valores={valoresDiluentes.valores.map(valor => valor.toString())}
            quandoResponder={handleQuandoResponder} />
    );
};

const VerificarConversaoUnidades = ({ questao, quandoResponder }: GameStepProps) => {
    const handleQuandoResponder = (e: number) => {
        const respondeuSim = e === 0;
        const unidadesSaoDiferentes = questao.prescricao.unidade !== questao.medicamento.unidade;

        // se respondeu sim -> as unidades devem ser diferentes.
        // se respondeu não -> as unidades devem ser iguais.
        const resposta = respondeuSim
            ? unidadesSaoDiferentes
            : !unidadesSaoDiferentes;

        // se unidades são diferentes -> precisa passar pela conversão (pula 1 etapa).
        // se unidades são iguais -> ignora a conversão (pula 2 etapas).
        // isso vai ser ignorado se a resposta estiver errada
        // const pularPaginas = unidadesSaoDiferentes ? 1 : 2;

        quandoResponder(resposta, 1);
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="font-medium">Observer o medicamento prescrito pelo médico e o medicamento disponível.</p>
            <hr className='my-2 w-full' />
            <div className="flex gap-4 flex-wrap items-center justify-center">
                <p >Valor prescrito:</p>
                <p className="w-24 h-8 flex items-center justify-center rounded-lg font-bold bg-orange-400 text-slate-950">
                    {questao.prescricao.toString()}
                </p>
                <p >Valor possuído:</p>
                <p className="w-24 h-8 flex items-center justify-center rounded-lg font-bold bg-orange-400 text-slate-950">
                    {questao.medicamento.toString()}
                </p>
            </div>

            <hr className='my-2 w-full' />

            <MinigameEscolherOpcao
                opcoes={['Sim', 'Não']}
                titulo='Eles precisam ser converidos?'
                quandoResponder={handleQuandoResponder} />
        </div>
    );
};

const ConverterUnidades = ({ questao, quandoResponder }: GameStepProps) => {
    const unidadeOrigem = questao.medicamento.unidade;
    const unidadeDestino = questao.prescricao.unidade;

    const [resultado, setResultado] = useState(new Grandeza(0, unidadeDestino));
    const [operacao, setOperacao] = useState(0);
    const [operacaoDisplay, setOperacaoDisplay] = useState(' ')

    const atualizarResultado = (valor: number) => {
        setResultado(new Grandeza(valor, unidadeDestino));
    }

    const quandoMultiplicarMudar = (valor: number) => {
        let resultado = 0; 

        switch (operacao) {
            case 0: resultado = 0.0;
            case 1: resultado = questao.medicamento.valor * valor;
            case 2: resultado = questao.medicamento.valor / valor;
        }
        
        atualizarResultado(resultado);
    }

    const quandoOpcaoMudar = (opcao: number) => {
        let operacaoDisplay = ' ';
        let operacao = 0;

        switch (opcao) {
            case 0: 
                operacao = 1;
                operacaoDisplay = '×'; 
                break;
            case 1: 
                operacao = 2;
                operacaoDisplay = '÷'; 
                break;
        }


        setOperacao(operacao);
        setOperacaoDisplay(operacaoDisplay)
        atualizarResultado(resultado.valor);
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <p className="font-medium">
                {`Para converter de ${unidadeOrigem.nome} para ${unidadeDestino.nome} você precisa? `}
            </p>
            <hr className='my-2 w-full' />

            <div className="text-4xl">
                    <Select onValueChange={e => quandoOpcaoMudar(parseInt(e))}>
                        <SelectTrigger className="gap-2">
                            <SelectValue placeholder='Selecionar uma opção' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='0'>Multiplicar valor por</SelectItem>
                            <SelectItem value='1'>Dividir valor por</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            <div className='flex gap-4 items-center w-full'>
                <input type='text' defaultValue={questao.medicamento.toString()}
                    className='w-0 flex-grow flex-shrink text-center h-8 rounded-lg bg-transparent' />
                
                <input type='text' value={operacaoDisplay} readOnly
                    className='text-center text-3xl w-[1ch] h-8 rounded-lg bg-transparent' />

                <input type='number' placeholder='0' onChange={e => quandoMultiplicarMudar(e.target.valueAsNumber)}
                    className='w-0 flex-grow flex-shrink text-center h-8 rounded-lg bg-slate-200' />

                <input type='text' defaultValue='='
                    className=' text-3xl w-[1ch] h-8 bg-transparent' />

                <input type='text' value={resultado.toString()}
                    className='w-0 flex-grow flex-shrink text-center h-8 rounded-lg bg-transparent' />
            </div>
        </div>
    )
}

export const buscarConteudoParaRegraDeTres = (questao: QuestaoRegraDeTres) => {
    const unidadesSaoIguais = questao.prescricao.unidade === questao.medicamento.unidade;

    // A lista de etapas que precisam ser passadas para completar o game.
    //
    // É uma função que aceita um evento como argumento e retorna um componente 
    // do react. Dessa maneira posso ter uma lista pre-definida de componentes e
    // ainda poder passar valores para modificar eles.
    const inicio = [
        (quandoResponder: CallbackResposta) => (
            <SelecionarMedicamentoPrescrito key={0} questao={questao} quandoResponder={quandoResponder} />
        ),

        (quandoResponder: CallbackResposta) => (
            <SelecionarMedicamentoDisponivel key={1} questao={questao} quandoResponder={quandoResponder} />
        ),

        (quandoResponder: CallbackResposta) => (
            <SelecionarDiluenteDisponivel key={2} questao={questao} quandoResponder={quandoResponder} />
        ),

        (quandoResponder: CallbackResposta) => (
            <VerificarConversaoUnidades key={3} questao={questao} quandoResponder={quandoResponder} />
        )
    ];

    // Se as unidades forem iguais não precisa da etapa de conversão (por isso a lista vazia).
    const convercao = unidadesSaoIguais ? []
        : [(quandoResponder: CallbackResposta) => (
            <ConverterUnidades key={4} questao={questao} quandoResponder={quandoResponder} />
        )];

    const equacao = [
        (quandoResponder: CallbackResposta) => (
            <p>Iniciar conta</p>
        ),
    ];

    // Usando lista é possível junta-las, e as listas que forem vazias são ignoradas.
    return [...inicio, ...convercao, ...equacao];
};

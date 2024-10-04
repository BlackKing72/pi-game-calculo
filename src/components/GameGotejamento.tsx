import { QuestaoGotejamento } from "@/services/perguntasService";
import {
    IdentificarValores
} from '@/components/etapas/EquacaoGotejamento';


// Como estou usando TypeScript preciso definir alguns tipos para facilitar.
// Alguns não precisam porque o TypeScript reconhece automaticamente.

// Um tipo que representa uma função (callback ou lambda);
export type CallbackResposta = (resposta: boolean) => void;

// Um tipo que representa um objeto, é bem parecido com um objeto normal, mas
// no lugar do valor está o tipo. 'nomeDaPropriedade: tipo';
// Ele representa as propriedades de um componente do react.
export type EtapaProps = {
    questao: QuestaoGotejamento,
    quandoResponder: CallbackResposta,
};

export const buscarConteudoParaGotejamento = (questao: QuestaoGotejamento) => {


    // A lista de etapas que precisam ser passadas para completar o game.
    //
    // É uma função que aceita um evento como argumento e retorna um componente 
    // do react. Dessa maneira posso ter uma lista pre-definida de componentes e
    // ainda poder passar valores para modificar eles.
    const inicio = [
        (quandoResponder: CallbackResposta) => (
            <IdentificarValores key={0} questao={questao} quandoResponder={quandoResponder} />
        ),

        // (quandoResponder: CallbackResposta) => (
        //     <IdentificarConvercao key={1} questao={questao} quandoResponder={quandoResponder} />
        // )
    ];

    // Se as unidades forem iguais não precisa da etapa de conversão (por isso a lista vazia).
    const convercao: CallbackResposta[] = [];
    // const convercao = unidadesSaoIguais ? []
    //     : [(quandoResponder: CallbackResposta) => (
    //         <RealizarConversao key={4} questao={questao} quandoResponder={quandoResponder} />
    //     )];

    const equacao: CallbackResposta[] = [];
    //     (quandoResponder: CallbackResposta) => (
    //         <EquacaoParte1 questao={questao} quandoResponder={quandoResponder} />
    //     ),
    //     (quandoResponder: CallbackResposta) => (
    //         <EquacaoParte2 questao={questao} quandoResponder={quandoResponder} />
    //     ),
    //     (quandoResponder: CallbackResposta) => (
    //         <EquacaoParte3 questao={questao} quandoResponder={quandoResponder} />
    //     ),
    //     (quandoResponder: CallbackResposta) => (
    //         <EquacaoParte4 questao={questao} quandoResponder={quandoResponder} />
    //     ),
    //     (quandoResponder: CallbackResposta) => (
    //         <EquacaoParte5 questao={questao} quandoResponder={quandoResponder} />
    //     ),
    // ];

    // Usando lista é possível junta-las em uma unica lista, e as listas que forem vazias são ignoradas.
    return [...inicio, ...convercao, ...equacao];
};
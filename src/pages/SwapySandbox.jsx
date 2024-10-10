import './SwapySandbox.css';

import SwapyContainer from '../components/swapy/SwapyContainer';
import SwapySlot from '../components/swapy/SwapySlot';
import SwapyItem from '../components/swapy/SwapyItem';

import { useState } from 'react';
import { Button } from 'react-bootstrap';

/* 
Um exemplo de como usar o swapy para criar uma seleção de alternativas de uma pergunta.
O código principal está no 'SwapyAnswers'.
*/
const SwapySandbox = () => {
    // importante salvar a pergunta em um estado, porque senão o swapy recarrega
    // a página em cada alteração e o valor da variável seria perdido.
    const [pergunta] = useState(sortearPergunta());

    return (
        <div className='swapy-sandbox'>
            <h1>Quiz Monster Hunter</h1>
            <h3>{pergunta.titulo}</h3>
            <SwapyAnswers 
                alternativas={pergunta.alternativas}
                onSubmit={resposta => resposta == pergunta.resposta}/>
        </div>
    )
};

/* 
'alternativas': lista de alternativas disponíveis para essa pergunta.
'onSubmit': uma função que é executado quando o usuário responder. Ela precisa
retornar true ou false. ex: const onSubmit = (resposta) => resposta == '0'; 
*/
function SwapyAnswers({ alternativas, onSubmit }) {
    const [resposta, setResposta] = useState(null);

    const handleOnSwap = (data) => {
        // o onSwap acontece assim que um item entra dentro de um slot, mesmo antes
        // de soltar o click. Então é necessário salvar a resposta antes e acessa-la
        // somente quando clicar em responder. 
        setResposta(data.object.slotResposta);
    }

    const handleOnClickResponder = () => {
        // verifica se a pergunta está certa e recarrega a página para resetar e 
        // buscar uma pergunta nova.

        if (!resposta) {
            return;
        }

        // onSubmit é um evento onde é passado a resposta selecionada e esse evento
        // retorna true ou false se a resposta for certa ou não.
        if (onSubmit(resposta)) {
            alert('Resposta Correta!');
            window.location.reload(false); // recarrega a página. 'false' é para manter o cache.
        }
        else {
            alert('Resposta Errada!');
        }
    };

    return (
        <SwapyContainer animation="spring" onSwap={handleOnSwap}>
            <div className='swapy-alt-container'>
                {
                    alternativas.map((alternativa, index) =>
                        <SwapySlot key={index} slotID={`slot${index}`}>
                            <SwapyItem itemID={index}>
                                <p>{alternativa}</p>
                            </SwapyItem>
                        </SwapySlot>
                    )
                }
            </div>
            <div className='swapy-resposta-container'>
                <SwapySlot slotID={`slotResposta`}></SwapySlot>
                <Button onClick={handleOnClickResponder}>Responder</Button>
            </div>
        </SwapyContainer>
    );
}

class Pergunta {
    constructor(titulo, alternativas, resposta) {
        this.titulo = titulo;
        this.alternativas = alternativas;
        this.resposta = resposta;
    }
}

function sortearPergunta() {
    const perguntas = [
        new Pergunta('O dragão ancião Fatalis, segundo relatos históricos da guilda, destruiu um reino inteiro uma vez. Quantos anos levaram para a Guilda reconstruir esse reino após o ataque do Fatalis?', ['10 anos', '20 anos', '50 anos', '100 anos'], 3),
        new Pergunta('Segundo registros, quantos metros de comprimento tem um Lao-Shan Lung adulto?', ['20 metros', '40 metros', '60 metros', '100 metros'], 2),
        new Pergunta('Por quantos dias pode um furacão de Kushala Daora durar?', ['2 dias', '5 dias', '7 dias', '10 dias'], 1),
        new Pergunta('Zorah Magdaros é um enorme dragão ancião com a habilidade de transportar magma. Qual é a idade estimada de um Zorah Magdaros completamente desenvolvido?', ['100 anos', '500 anos', '1.000 anos', '2.000 anos'], 3),
    ];

    return perguntas[Math.floor(Math.random() * perguntas.length)];
}

export default SwapySandbox;
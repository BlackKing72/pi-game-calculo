import './SwapySandbox.css';

import { useEffect, useState } from 'react';
import { createSwapy } from 'swapy';
import { Button } from 'react-bootstrap';

const SwapySandbox = () => {
    const [pergunta] = useState(sortearPergunta());

    return (
        <div className='swapy-sandbox'>
            <h1>Quiz Monster Hunter</h1>
            <h3>{pergunta.titulo}</h3>
            <SwapyContainer 
                alternativas={pergunta.alternativas} 
                onSubmit={resposta => pergunta.resposta = resposta}/>
        </div>
    )
};

function SwapyContainer({ alternativas, onSubmit }) {
    const [resposta, setResposta] = useState(null);
    
    useEffect(() => {
        const container = document.querySelector('.swapy-container');

        const swapy = createSwapy(container, {
            animation: 'spring',
        });

        swapy.onSwap(({ data }) => {
            setResposta(data.object.slotResposta);
        });

        return () => swapy.destroy();
    }, []);

    const handleOnClickResponder = () => {
        if (!resposta) {
            return;
        }

        if (onSubmit(resposta)) {
            alert('Resposta Correta!');
            window.location.reload(false);
        }
        else {
            alert('Resposta Errada!');
        }
    };

    return (
        <div className='swapy-container'>
            <div className='swapy-alt'>
                {
                    alternativas.map((alternativa, index) =>
                        <SwapySlot key={index} slotID={`slot${index}`}>
                            <SwapyCard itemID={index} content={alternativa} />
                        </SwapySlot>
                    )
                }
            </div>
            <div className='swapy-resposta'>
                <SwapySlot slotID={`slotResposta`}></SwapySlot>
                <Button onClick={handleOnClickResponder}>Responder</Button>
            </div>
        </div>
    )
}

function SwapySlot({ slotID, children }) {
    return (
        <div className='swapy-slot' data-swapy-slot={slotID}>
            {children}
        </div>
    )
}

function SwapyCard({ itemID, content }) {
    return (
        <div className='swapy-item' data-swapy-item={itemID}>
            <p>{content}</p>
        </div>
    );
};

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
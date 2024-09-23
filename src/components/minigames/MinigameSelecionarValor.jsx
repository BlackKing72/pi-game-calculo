import SwapyContainer, { SwapyGroup } from '../swapy/SwapyContainer';
import SwapySlot from '../swapy/SwapySlot';
import SwapyItem from '../swapy/SwapyItem';

import './MinigameSelecionarValor.css';
import { Button } from '../ui/button';
import {  useState } from 'react';

const MinigameSelecionarValor = ({ titulo, valores, quandoResponder }) => {
    const [resposta, setResposta] = useState(null);

    const handleOnSwap = (data) => {
        const reposta = parseInt(data.object.resposta);
        console.log(`handleOnSwap() => ${reposta}`);
        setResposta(reposta);
    };

    const handleOnClick = () => {
        console.log(`handleOnClick() => ${resposta}`);
        
        if (resposta === null) {
            return;
        }

        if (quandoResponder) {
            quandoResponder(resposta);
        }
    }

    return (
        <div className='select-value'>
            <p className='h-[2lh] font-medium'>{titulo}</p>
            <hr className='my-2 w-full'/>
            <SwapyContainer animation='spring' onSwap={handleOnSwap} >
                <SwapyGroup className='select-content' >
                    <SwapyGroup className='select-options' >
                        {
                            valores.map((value, index) =>
                                <SwapySlot key={index} slotID={index}>
                                    <SwapyItem key={index} itemID={index}>
                                        <p>{value}</p>
                                    </SwapyItem>
                                </SwapySlot>
                            )
                        }
                    </SwapyGroup>
                    <SwapyGroup className='select-answer'>
                        <SwapySlot slotID='resposta'>
                            { /* Espaço para a resposta */}
                        </SwapySlot>
                    </SwapyGroup>
                </SwapyGroup>
                <Button onClick={handleOnClick}>Responder</Button>
            </SwapyContainer>
        </div>
    );
};

export default MinigameSelecionarValor;
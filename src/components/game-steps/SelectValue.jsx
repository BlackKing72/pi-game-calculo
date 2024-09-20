import SwapyContainer from '../swapy/SwapyContainer';
import SwapySlot from '../swapy/SwapySlot';
import SwapyItem from '../swapy/SwapyItem';

import './SelectValue.css';
import { Button } from '../ui/button';
import { useState } from 'react';

// const debounce = (func, timeout = 300) => {
//     let timer;
//     return (...args) => {
//         clearTimeout(timer);
//         timer = setTimeout(() => { func.apply(this, args); }, timeout)
//     }
// }

const SelectValue = ({ title, values, onAnswer }) => {
    const [answer, setAnswer] = useState(null);

    const handleOnSwap = (data) => {
        setAnswer(data.object.answer)
    };

    const handleOnClick = () => {
        if (!answer) {
            return;
        }

        onAnswer(answer);
    }

    return (
        <div className='select-value'>
            <h5>{title}</h5>
            <SwapyContainer onSwap={handleOnSwap}>
                <div className='select-options' >
                    {
                        values.map((value, index) =>
                            <SwapySlot slotID={index}>
                                <SwapyItem itemID={index}>
                                    <span>{value}</span>
                                </SwapyItem>
                            </SwapySlot>
                        )
                    }
                </div>
                <div className='select-answer'>
                    <SwapySlot slotID='answer'>
                        { /* Espaço para a resposta */}
                    </SwapySlot>
                </div>
                <Button onClick={handleOnClick}>Responder</Button>
            </SwapyContainer>
        </div>
    );
};

export default SelectValue;
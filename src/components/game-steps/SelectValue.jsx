import SwapyContainer from '../swapy/SwapyContainer';
import SwapySlot from '../swapy/SwapySlot';
import SwapyItem from '../swapy/SwapyItem';

import './SelectValue.css';

const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout)
    }
}

const SelectValue = ({ title, values, onSelect }) => {
    let lastAnswer = null;

    const handleOnSwap = debounce((data) => {
        const answer = data.object.answer;
        if (!answer || answer == lastAnswer) {
            return;
        }
        
        lastAnswer = answer;
        onSelect(answer);
    });

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
            </SwapyContainer>
        </div>
    );
};

export default SelectValue;
import './SwapyComponents.css';

/* 
Um espaço para colocar um 'SwapyItem' ou qualquer item do swapy. Pode iniciar 
vazio ou com um item dentro. 

O 'slotID' precisa ser unico. 
O 'children' é usado para renderizar/mostrar qualquer elemento que está dentro 
do SwapySlot, ele funciona automáticamente não precisa passar um valor para ele.                
    ex: <SwapySlot> <p>Isso é um children</p> </SwapySlot>. 
*/
const SwapySlot = ({ slotID, children }) => {
    return (
        <div className='swapy-slot' data-swapy-slot={slotID}>
            { children }
        </div>
    );
};

export default SwapySlot;
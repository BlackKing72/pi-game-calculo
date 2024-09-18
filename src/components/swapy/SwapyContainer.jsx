import './SwapyComponents.css';

import { useEffect } from "react";
import { createSwapy } from "swapy";

/*
Cria um container para o swapy. Dentro dele você pode criar slots e items.

O 'animation' pode ser 'spring', 'dynamic' e 'none', o padrão é dynamic.
O 'onSwap' é o evento que acontece quando troca um item de lugar.
O 'children' é usado para renderizar/mostrar qualquer elemento que está dentro 
do SwapyContainer, ele funciona automáticamente não precisa passar um valor para ele.                
    ex: <SwapyContainer> <p>Isso é um children</p> </SwapyContainer>. 
*/
const SwapyContainer = ({ animation, onSwap, children }) => {
    useEffect(() => {
        const container = document.querySelector('.swapy-container');
        const swapy = createSwapy(container, { 
            animation: animation || 'dynamic', 
        });

        swapy.onSwap(event => onSwap(event.data));

        return () => {
            swapy.destroy();
        }
    }, []);

    return (
        <div className='swapy-container'>
            {children}
        </div>
    );
};

export default SwapyContainer;
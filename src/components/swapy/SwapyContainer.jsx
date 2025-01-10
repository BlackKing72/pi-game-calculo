import './SwapyComponents.css';

import { useEffect, useRef } from "react";
import { createSwapy } from "swapy";

/*
Cria um container para o swapy. Dentro dele você pode criar slots e items.

O 'animation' pode ser 'spring', 'dynamic' e 'none', o padrão é dynamic.
O 'onSwap' é o evento que acontece quando troca um item de lugar.
O 'children' é usado para renderizar/mostrar qualquer elemento que está dentro 
do SwapyContainer, ele funciona automáticamente não precisa passar um valor para ele.                
    ex: <SwapyContainer> <p>Isso é um children</p> </SwapyContainer>. 
*/
/**
 * @param {import('react').PropsWithChildren<{
 *  className?, 
 *  animation?:'dynamic'|'spring'|'none', 
 *  onSwap?:
 * , setSwapy?}} param0 
 */
const SwapyContainer = ({ className, animation, onSwap, setSwapy, children }) => {
    const swapy = useRef();

    useEffect(() => {
        const container = document.querySelector('.swapy-container');
        swapy.current = createSwapy(container, { 
            animation: animation || 'dynamic', 
            swapMode: 'drop',
        });

        const items = [...container.querySelectorAll('.swapy-item')];
        items.forEach(item => {
            item.addEventListener('pointerdown', () => item.setAttribute('data-swapy-current', ''));
            item.addEventListener('pointerup', () => item.removeAttribute('data-swapy-current'));
        });

        swapy.current.onSwap(event => {
            if (onSwap) {
                onSwap(event.data);
            }
        });

        if (setSwapy) {
            setSwapy(swapy.current);
        }

        return () => {
            swapy.current?.destroy();
        }
    }, []);

    return (
        <div className={`swapy-container ${className || ''}`}>
            {children}
        </div>
    );
};

export const SwapyGroup = ({className = '', children}) => {
    return (
        <div className={`swapy-group ${className}`}>
            {children}
        </div>
    )
}

export default SwapyContainer;
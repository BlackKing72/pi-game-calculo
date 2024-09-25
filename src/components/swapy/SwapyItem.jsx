import './SwapyComponents.css';
import { Children } from 'react';
/* 
Um item padrão para usar com o swapy. Ele vem vazio por padrão, precisa passar
um item para ele

O 'itemID' precisa ser unico. 
O 'children' é usado para renderizar/mostrar qualquer elemento que está dentro 
do SwapyItem, ele funciona automáticamente não precisa passar um valor para ele.                
    ex: <SwapyItem> <p>Isso é um children</p> </SwapyItem>. 
*/

/**
 * @param {import('react').PropsWithChildren<{className?, itemID}} param0 
 */
const SwapyItem = ({ className, itemID, children }) => {
    return (
        <div className={`swapy-item ${className || ''}`} data-swapy-item={itemID}>
            {children}
        </div>
    );
};

export default SwapyItem;
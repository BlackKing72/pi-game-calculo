import './SwapyComponents.css';
import React from 'react';

import { cn } from "@/lib/utils"
/* 
Um espaço para colocar um 'SwapyItem' ou qualquer item do swapy. Pode iniciar 
vazio ou com um item dentro. 

O 'slotID' precisa ser unico. 
O 'children' é usado para renderizar/mostrar qualquer elemento que está dentro 
do SwapySlot, ele funciona automáticamente não precisa passar um valor para ele.                
    ex: <SwapySlot> <p>Isso é um children</p> </SwapySlot>. 
*/

/** @param {React.BaseHTMLAttributes<HTMLDivElement> & { slotID: any }} param0 */
const SwapySlot = ({ className, children, slotID, ...props }) => {
    return (
        <div className={cn('swapy-slot', className)} data-swapy-slot={slotID} {...props}>
            { children }
        </div>
    );
};

export default SwapySlot;
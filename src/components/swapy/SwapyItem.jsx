import './SwapyComponents.css';
import { cn } from "@/lib/utils"
/* 
Um item padrão para usar com o swapy. Ele vem vazio por padrão, precisa passar
um item para ele

O 'itemID' precisa ser unico. 
O 'children' é usado para renderizar/mostrar qualquer elemento que está dentro 
do SwapyItem, ele funciona automáticamente não precisa passar um valor para ele.                
    ex: <SwapyItem> <p>Isso é um children</p> </SwapyItem>. 
*/

/** @param {React.BaseHTMLAttributes<HTMLDivElement> & { itemID: any }} param0 */
const SwapyItem = ({ className, itemID, children, ...props }) => {

    const handleOnPointerEnter = (event) => {
        event.target.setAttribute('data-swapy-hover', '');
        if (props.onPointerEnter) props.onPointerEnter(event);
    }

    const handleOnPointerLeave = (event) => {
        event.target.removeAttribute('data-swapy-hover', '');
        if (props.onPointerLeave) props.onPointerLeave(event);
    }

    return (
        <div className={cn('swapy-item', className)} data-swapy-item={itemID} {...props}
            onPointerEnter={handleOnPointerEnter}
            onPointerLeave={handleOnPointerLeave}>
            {children}
        </div>
    );
};

export default SwapyItem;
import './EquacaoRegraDeTres.css'

import { EtapaProps } from "../GameRegraDeTres";
import SwapyContainer from "../swapy/SwapyContainer";
import { SwapyGroup } from "../swapy/SwapyContainer";
import SwapyItem from "../swapy/SwapyItem";
import SwapySlot from "../swapy/SwapySlot";
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { SwapEventArray, SwapEventMap, SwapEventObject, Swapy } from 'swapy';

type EquacaoSlotData = {
    slotTL: string|null,
    slotTR: string|null,
    slotBL: string|null,
    slotBR: string|null,
}
const EquacaoParte1 = ({ questao, quandoResponder }: EtapaProps) => {
    const dosePrescrita = questao.prescricao.toString();
    const doseDisponivel = questao.medicamento.toString();
    const volumeDisponível = questao.diluente.toString();
    const volumeAdministrado = 'x';

    const valores = [ dosePrescrita, doseDisponivel, volumeDisponível, volumeAdministrado ];

    const respostas = [
        [   dosePrescrita,      doseDisponivel,
            volumeAdministrado, volumeDisponível ],

        [   dosePrescrita,      volumeAdministrado,
            doseDisponivel,     volumeDisponível ],

        // Deixei só os dois modelos de fórmula, ver depois se tem outros jeitos de 
        // organizar a fórmula
    ];

    const [slotData, setSlotData] = useState<(string|null)[]>([null, null, null, null]);

    const handleOnSwap = (data: any) => {
        const slotTopLeft = valores[parseInt(data.object.slotTL)];
        const slotTopRight = valores[parseInt(data.object.slotTR)];
        const slotBottomLeft = valores[parseInt(data.object.slotBL)];
        const slotBottomRight = valores[parseInt(data.object.slotBR)];
        
        setSlotData([slotTopLeft, slotTopRight, slotBottomLeft, slotBottomRight]);
    };

    const handleQuandoResponder = () => {
        let estaCorreto = respostas.some(resposta => {
            return slotData.every((value, index) => value === resposta[index]);
        });

        quandoResponder(estaCorreto);
    };

    return (
        <div className="equacao-regra-tres w-full" >
            <SwapyContainer animation="spring" className='flex flex-col w-full' onSwap={handleOnSwap}>
                <SwapyGroup className="flex gap-2 w-full">
                    {
                        valores.map((valor, index) =>
                            <SwapySlot className='w-0 flex-grow h-12 p-1 bg-slate-200' key={index} slotID={index}>
                                <SwapyItem className='bg-orange-500' itemID={index}>
                                    <p>{valor}</p>
                                </SwapyItem>
                            </SwapySlot>
                        )
                    }
                </SwapyGroup>
                <hr className="my-1 w-full" />
                <SwapyGroup className="equacao-dropzone">
                    <div className="equacao-xmark">
                        <p>×</p>
                    </div>
                    <SwapySlot key={3} slotID='slotTL'></SwapySlot>
                    <SwapySlot key={5} slotID='slotTR'></SwapySlot>
                    <SwapySlot key={4} slotID='slotBL'></SwapySlot>
                    <SwapySlot key={6} slotID='slotBR'></SwapySlot>
                </SwapyGroup>
                <hr className="my-1 w-full" />
            <Button onClick={handleQuandoResponder}>Responder</Button>
            </SwapyContainer>
        </div>
    );
};

export {
    EquacaoParte1,
};
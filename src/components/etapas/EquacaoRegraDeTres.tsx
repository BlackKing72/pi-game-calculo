import './EquacaoRegraDeTres.css'

import { EtapaProps } from "../GameRegraDeTres";
import SwapyContainer from "../swapy/SwapyContainer";
import { SwapyGroup } from "../swapy/SwapyContainer";
import SwapyItem from "../swapy/SwapyItem";
import SwapySlot from "../swapy/SwapySlot";
import { Button } from '../ui/button';

const EquacaoParte1 = ({ questao, quandoResponder }: EtapaProps) => {
    const valores = [
        questao.prescricao, questao.medicamento, questao.diluente
    ];

    return (
        <div className="equacao-regra-tres w-full" >
            <SwapyContainer animation="spring" className='flex flex-col w-full'>
                <SwapyGroup className="flex gap-2">
                    {
                        valores.map((valor, index) =>
                            <SwapySlot className='w-28 h-16 p-1 bg-slate-200' key={index} slotID={index}>
                                <SwapyItem className='bg-orange-500' itemID={index}>
                                    <p>{valor.toString()}</p>
                                </SwapyItem>
                            </SwapySlot>
                        )
                    }
                </SwapyGroup>
                <hr className="my-2 w-full" />
                <SwapyGroup className="equacao-dropzone">
                    <div className="equacao-xmark">
                        <p>×</p>
                    </div>
                    <SwapySlot key={3} slotID={3}></SwapySlot>
                    <SwapySlot key={5} slotID={5}></SwapySlot>
                    <SwapySlot key={4} slotID={4}></SwapySlot>
                    <SwapySlot key={6} slotID={6}></SwapySlot>
                </SwapyGroup>
                <hr className="my-2 w-full" />
                <SwapyGroup className="equacao-dropzone">
                    <div className="equacao-xmark">
                        <p>×</p>
                    </div>
                    <p className='formula'>Medicamento prescrito</p>
                    <p className='formula'>Medicamento disponível</p>
                    <p className='formula'>Diluente disponível</p>
                    <p className='formula'>O que devo adiministrar</p>
                </SwapyGroup>
            </SwapyContainer>
            <Button>Responder</Button>
        </div>
    );
};

export {
    EquacaoParte1,
};
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";

const MinigameConverterValor = ({origem, destino}) => {
    const [opcaoSelecionada, setOpcaoSelecionada] = useState(0);

    return(
        <div className="flex flex-col gap-4">
            <p>Observer os valores prescrito e possuído.</p>

            <div className="flex gap-4 flex-wrap items-center justify-center">
                <p >Valor prescrito:</p>
                <p className="w-24 h-8 flex items-center justify-center rounded-lg font-bold bg-orange-400 text-slate-950">
                    {origem.toString()}
                </p>
                <p >Valor possuído:</p>
                <p className="w-24 h-8 flex items-center justify-center rounded-lg font-bold bg-orange-400 text-slate-950">
                    {destino.toString()}
                </p>
            </div>
            
            <hr />

            <p>Eles precisam ser convertidos?</p>

            <div className="flex gap-4">  
                <Select defaultValue={opcaoSelecionada} onValueChange={e => setOpcaoSelecionada(e)}>
                    <SelectTrigger>
                        <SelectValue placeholder='Selecionar uma opção'/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={0}>Não Converter</SelectItem>
                        <SelectItem value={1}>Multiplicar Por</SelectItem>
                        <SelectItem value={2}>Dividir Por</SelectItem>
                    </SelectContent>
                </Select>
                <input disabled={opcaoSelecionada == 0} type="number" className="w-28 text-center rounded-lg outline-none bg-slate-200 text-slate-950"/>
            </div>

            <Button className='flex-grow'>Responder</Button>
        </div>
    );
};

export default MinigameConverterValor
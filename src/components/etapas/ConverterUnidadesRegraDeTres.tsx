import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { useState, useMemo } from "react";

import { buscarConversao } from "@/models/conversao";
import { Grandeza } from "@/models/grandeza";

import { EtapaProps } from "../GameRegraDeTres";

const ConverterUnidades = ({ questao, quandoResponder }: EtapaProps) => {
    const unidadeOrigem = questao.medicamento.unidade;
    const unidadeDestino = questao.prescricao.unidade;

    const [operacao, setOperacao] = useState({ id: 0, display: '' });
    const [valor, setValor] = useState(0);

    const resultado = useMemo(() => {
        let resultado = 0;

        switch (operacao.id) {
            case 1: resultado = questao.medicamento.valor * valor; break;
            case 2: resultado = questao.medicamento.valor / valor; break;
        }

        return new Grandeza(resultado, unidadeDestino);

    }, [valor, operacao]);

    const quandoOpcaoMudar = (opcao: number) => {
        let operacao = { id: 0, display: '' };

        switch (opcao) {
            case 0: operacao = { id: 1, display: '×' }; break;
            case 1: operacao = { id: 2, display: '÷' }; break;
        }

        setOperacao(operacao);
    };

    const handleQuandoResponder = () => {
        const conversao = buscarConversao(unidadeOrigem, unidadeDestino);

        if (conversao === null) {
            console.warn(`Não foi possivel achar uma conversao para ${unidadeOrigem} -> ${unidadeDestino}`);
            return;
        }

        quandoResponder(conversao.validar(questao.medicamento.valor) === resultado.valor);
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <p className="font-medium">
                {`Para converter de ${unidadeOrigem.nome} para ${unidadeDestino.nome} você precisa? `}
            </p>
            <hr className='my-2 w-full' />

            <div className="text-4xl">
                <Select onValueChange={e => quandoOpcaoMudar(parseInt(e))}>
                    <SelectTrigger className="gap-2 justify-center">
                        <SelectValue placeholder='Selecionar uma opção' />
                    </SelectTrigger>
                    <SelectContent align="center" >
                        <SelectItem value='0'>Multiplicar valor</SelectItem>
                        <SelectItem value='1'>Dividir valor</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {
                operacao.id === 0
                    ? null
                    : <ConverterUnidadesEquacao 
                        origem={questao.medicamento}
                        destino={resultado}
                        operacao={operacao.display}
                        value={valor}
                        onChange={setValor}/>
            }

            <Button onClick={handleQuandoResponder}>Responder</Button>
        </div>
    );
};

export default ConverterUnidades;

type EquacaoProps = {
    origem: Grandeza,
    destino: Grandeza,
    operacao: string,
    value: number;
    onChange: (valor: number) => void;
};

function ConverterUnidadesEquacao({origem, destino, operacao, value, onChange} : EquacaoProps) {
    return (
        <div className='flex gap-4 items-center w-full'>
            <input type='text' value={origem.toString()} readOnly
                className='w-0 flex-grow flex-shrink text-center h-8 rounded-lg bg-transparent' />

            <input type='text' value={operacao} readOnly
                className='text-center text-3xl w-[1ch] h-8 rounded-lg bg-transparent' />

            <input type='number' value={value} onChange={e => onChange(e.target.valueAsNumber)}
                className='w-0 flex-grow flex-shrink text-center h-8 rounded-lg bg-slate-200' />

            <input type='text' value='=' readOnly
                className=' text-3xl w-[1ch] h-8 bg-transparent' />

            <input type='text' value={destino.toString()} readOnly
                className='w-0 flex-grow flex-shrink text-center h-8 rounded-lg bg-transparent' />
        </div>
    )
}
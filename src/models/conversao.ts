import { ValueNoneIcon } from '@radix-ui/react-icons';
import { Grandeza } from './grandeza.ts';
import { Gramas, Horas, Litros, Miligramas, Mililitros, Minutos, Unidade } from './unidade.ts';

/** Recebe um valor como argumento e retorna o valor convertido. */
type ValidarConversaoFn = (valor: number) => number;
export type Operacao = 'multiplicar'|'dividir';

export const operacaoToString = (operacao: Operacao) => {
    switch (operacao) {
        case 'multiplicar': return '×';
        case 'dividir': return '÷';
    }
}

export class Conversao {
    origem: Unidade;
    destino: Unidade;
    operacao: Operacao;
    constante: number;

    constructor(origem: Unidade, destino: Unidade, operacao: Operacao, constante: number) {
        this.origem = origem;
        this.destino = destino;
        this.operacao = operacao;
        this.constante = constante;
    }

    validar(valor: number) : number {
        let resultado = 0;

        switch (this.operacao) {
            case 'multiplicar': resultado = valor * this.constante; break;
            case 'dividir': resultado = valor / this.constante; break;
        }

        return resultado;
    }

    converter(de: Grandeza) : Grandeza {
        const valorConvertido = this.validar(de.valor);
        return new Grandeza(valorConvertido, this.destino);
    }
};

export const GramasParaMiligramas = new Conversao(Gramas, Miligramas, 'multiplicar', 1000);
export const MiligramasParaGramas = new Conversao(Miligramas, Gramas, 'dividir', 1000);
export const LitrosParaMililitros = new Conversao(Litros, Mililitros, 'multiplicar', 1000);
export const MililitrosParaLitros = new Conversao(Mililitros, Litros, 'dividir', 1000);
export const HorasParaMinutos     = new Conversao(Horas, Minutos, 'multiplicar', 60);
export const MinutosParaHoras     = new Conversao(Minutos, Horas, 'dividir', 60);

export const conversoes: Conversao[] = [
    GramasParaMiligramas,
    MiligramasParaGramas,
    LitrosParaMililitros,
    MililitrosParaLitros,
    HorasParaMinutos,
    MinutosParaHoras,
];

export const buscarConversao = (origem: Unidade, destino: Unidade) : Conversao|null => {
    const conversao = conversoes
        .filter(conversao => conversao.origem === origem)
        .find(conversao => conversao.destino === destino);

    return conversao ?? null;
};

export const buscarConversoesPorOrigem = (origem: Unidade) : Conversao[] => {
    return conversoes.filter(conversao => conversao.origem === origem);
}
import { ValueNoneIcon } from '@radix-ui/react-icons';
import { Grandeza } from './grandeza.ts';
import { Gramas, Litros, Miligramas, Mililitros, Unidade } from './unidade.ts';

/** Recebe um valor como argumento e retorna o valor convertido. */
type ValidarConversaoFn = (valor: number) => number;

export class Conversao {
    origem: Unidade;
    destino: Unidade;
    quandoConverter: ValidarConversaoFn;

    constructor(origem: Unidade, destino: Unidade, quandoConverter: ValidarConversaoFn) {
        this.origem = origem;
        this.destino = destino;
        this.quandoConverter = quandoConverter;
    }

    validar(valor: number) : number {
        return this.quandoConverter(valor);
    }

    converter(de: Grandeza) : Grandeza {
        const valorConvertido = this.quandoConverter(de.valor);
        return new Grandeza(valorConvertido, this.destino);
    }
};

export const GramasParaMiligramas = new Conversao(Gramas, Miligramas, (g) => g * 1000);
export const MiligramasParaGramas = new Conversao(Miligramas, Gramas, (mg) => mg / 1000);
export const LitrosParaMililitros = new Conversao(Litros, Mililitros, (l) => l * 1000);
export const MililitrosParaLitros = new Conversao(Mililitros, Litros, (ml) => ml / 1000);

export const conversoes: Conversao[] = [
    GramasParaMiligramas,
    MiligramasParaGramas,
    LitrosParaMililitros,
    MililitrosParaLitros,
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
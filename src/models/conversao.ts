import { Gramas, Litros, Miligramas, Mililitros, Unidade } from './unidade.ts';

/** Recebe um valor como argumento e retorna o valor convertido. */
type ValidarConversaoFn = (valor: number) => number;

export class Conversao {
    origem: Unidade;
    destino: Unidade;
    quandoValidar: ValidarConversaoFn;

    constructor(origem: Unidade, destino: Unidade, quandoValidar: ValidarConversaoFn) {
        this.origem = origem;
        this.destino = destino;
        this.quandoValidar = quandoValidar;
    }

    validar(valor: number) : number {
        return this.quandoValidar(valor);
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
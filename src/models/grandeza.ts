import { Unidade, buscarUnidadesAleatoria } from "./unidade.ts";

/** Representa uma grandeza (um valor com uma unidade definida). */
export class Grandeza {
    valor: number;
    unidade: Unidade;

    constructor(valor: number, unidade: Unidade) {
        this.valor = valor;
        this.unidade = unidade;
    }

    toString() : string {
        return `${this.valor}${this.unidade}`
    }
}

export const gerarGrandeza = (grandeza: Grandeza, variacaoMaxima: number, variacaoAleatoria: boolean, unidadeAleatoria: boolean) => {
    let valor: number = grandeza.valor; 

    if (variacaoAleatoria) {
        const temCasaDecimal = !Number.isInteger(valor);
        const valorGerado = grandeza.valor + (Math.max(Math.random(), 0.1) + variacaoMaxima);

        valor = temCasaDecimal                      
            ? Math.round(valorGerado * 10) / 10     // Truque para arredondar para uma casa decimal
            : Math.round(valorGerado);              // Arredonda normalmente
    }

    let unidade = grandeza.unidade;
    if (unidadeAleatoria) {
        const unidadeAleatoria = buscarUnidadesAleatoria(grandeza.unidade);

        if (unidadeAleatoria) {
            unidade = unidadeAleatoria;
        }
    }

    return new Grandeza(valor, unidade);
};

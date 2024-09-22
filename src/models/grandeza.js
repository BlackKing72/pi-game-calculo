import { Unidade, buscarUnidadesAleatoria } from "./unidades";

/* Representa uma grandeza (um valor com uma unidade definida). */
export class Grandeza {
    /**
     * Controi uma nova grandeza.
     * @param {Number} valor O valor da grandeza.
     * @param {Unidade} unidade A unidade da grandeza.
     */
    constructor(valor, unidade) {
        /** @type {Number} */
        this.valor = valor;

        /** @type {Unidade} */
        this.unidade = unidade;
    }

    toString() {
        const unidade = this.unidade.abreviacao !== null
            ? this.unidade.abreviacao 
            : this.unidade.nome;

        return `${this.valor}${unidade}`
    }
}


/**
 * Gera uma nova grandeza aleatória com base em outra grandeza.
 * @param {Grandeza} grandeza A grandeza que o valor vai ser baseado.
 * @param {Number} variacaoMaxima O máximo que o valor da grandeza pode variar.
 * @param {Boolean} variacaoAleatoria Se a variação do valor da grandeza vai ser aleatória.
 * @param {Boolean} unidadeAleatoria Se a variação da unidade da grandeza vai ser aleatória.
 * @returns Uma nova grandeza aleatória.
 */
export const gerarGrandeza = (grandeza, variacaoMaxima, variacaoAleatoria, unidadeAleatoria) => {
    let valor = grandeza.valor; 

    if (variacaoAleatoria) {
        const temCasaDecimal = !Number.isInteger(valor);
        const valorGerado = Math.random() * (grandeza.valor + variacaoMaxima);

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

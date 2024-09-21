/* 
Representa uma unidade em geral (gramas, litros, horas, etc) de um valor.
Como alguns valores não tem abreviação ela pode ser nula, então cheque antes de usar. 
*/
export class Unidade {
    /**
     * Cria uma nova Unidade.
     * @param {String} nome O nome completo da unidade.
     * @param {String|null} abreviacao A Abreviação usada para a unidade.
     */
    constructor(nome, abreviacao) {
        /** @type {String} */
        this.nome = nome;

        /** @type {String|null} */
        this.abreviacao = abreviacao;
    }
}

/*
Representa unidades de tempo (horas e minutos).

Ela extende a classe Unidade, então ela recebe todos os campos e metodos da classe
Unidade e adiciona suas proprias funções, é como se fosse uma especialização (uma
unidade especializada em tempo). 

Nesse caso não precisei adicionar nada nela, só queria diferenciar as unidades 
de tempo dos outros tipos de unidades.
*/
export class UnidadeTempo extends Unidade { }

/*
A mesma coisa com essas duas. Só precisava diferenciar as unidades.
*/
export class UnidadeVolume extends Unidade { }
export class UnidadePeso extends Unidade { }

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
}

/* As unidades mais usadas nos calculos. */
export const Litros = new UnidadeVolume('Litros', 'L');
export const Mililitros = new UnidadeVolume('Mililitros', 'ml');
export const Gramas = new UnidadePeso('Gramas', 'g');
export const Miligramas = new UnidadePeso('Miligramas', 'mg');
export const Horas = new UnidadeTempo('Horas', 'h');
export const Minutos = new UnidadeTempo('Minutos', 'min');

export const unidades = [
    Litros, Mililitros, Gramas, Miligramas, Horas, Minutos
];

/**
 * Busca todas as unidades disponíveis do mesmo tipo da unidade desejada.
 * @param {Unidade} unidade 
 * @returns Uma lista de unidades parecidas ou uma lista vazia se não encontrar.
 */
const buscarUnidadesDoMesmoTipo = (unidade) => {
    return unidades[Math.floor(Math.random() * unidades.length)];
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

    const unidade = unidadeAleatoria
        ? buscarUnidadesDoMesmoTipo(grandeza.unidade)
        : grandeza.unidade;

    return new Grandeza(valor, unidade);
};

/** @param {Grandeza} grandeza */
export const grandezaParaTexto = (grandeza) => {
    const unidade = grandeza.unidade.abreviacao !== null
        ? grandeza.unidade.abreviacao 
        : grandeza.unidade.nome;

    return `${grandeza.valor}${unidade}`;
};

/* 
Representa uma unidade em geral (gramas, litros, horas, etc) de um valor.
Como alguns valores não tem abreviação ela pode ser nula, então cheque antes de usar. 
*/
export class Unidade {
    nome: string;
    abreviacao: string | null;

    constructor(nome: string, abreviacao: string | null) {
        this.nome = nome;
        this.abreviacao = abreviacao;
    }

    toString() : string {
        return this.abreviacao ?? this.nome;
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



/* As unidades mais usadas nos calculos. */
export const Litros = new UnidadeVolume('Litros', 'L');
export const Mililitros = new UnidadeVolume('Mililitros', 'ml');
export const Gramas = new UnidadePeso('Gramas', 'g');
export const Miligramas = new UnidadePeso('Miligramas', 'mg');
export const Horas = new UnidadeTempo('Horas', 'h');
export const Minutos = new UnidadeTempo('Minutos', 'min');
export const Gotas = new UnidadeVolume('Gotas', 'gts');
export const Microgotas = new UnidadeVolume('Microgotas', 'mgts');

// unidadeDestino: 'gts/min'|'gts/hora'|'mgts/min'|'mgts/hora';
export const MicrogotasMin = new Unidade('Microgotas Por Minuto', 'mgts/min');
export const MicrogotasHora = new Unidade('Microgotas Por Hora', 'mgts/hora');
export const GotasMin = new Unidade('Gotas Por Minuto', 'gts/min');
export const GotasHora = new Unidade('Gotas Por Hora', 'gts/hora');

export const unidades = [
    Litros, Mililitros, Gramas, Miligramas, Horas, Minutos, Gotas, Microgotas
];

/**
 * Busca todas as unidades disponíveis do mesmo tipo e retorna uma unidade aleatória.
 * @param {Unidade} unidade 
 * @returns {Unidade|null} Uma unidades ou null se não encontrar.
 */
export const buscarUnidadesAleatoria = (unidade: Unidade) => {
    let resultado: Unidade[] = [];

    if (unidade instanceof UnidadePeso) {
        resultado = unidades.filter(unidade => unidade instanceof UnidadePeso);
    }
    else if (unidade instanceof UnidadeVolume) {
        resultado = unidades.filter(unidade => unidade instanceof UnidadeVolume);
    }
    else if (unidade instanceof UnidadeTempo) {
        resultado = unidades.filter(unidade => unidade instanceof UnidadeTempo);
    }

    return resultado[Math.floor(Math.random() * unidades.length)];
}

export const buscarUnidadePorNome = (nome: string) : Unidade | null => {
    const unidade = unidades.find(unidade => unidade.nome === nome);
    return unidade ?? null;
};

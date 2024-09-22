import { Miligramas, Mililitros, Horas, Minutos, Gramas, } from '../models/unidades';
import { Grandeza } from '@/models/grandeza';

export class QuestaoRegraDeTres {
    /**
     * Cria uma nova Questão para Regra de Tres.
     * @param {String} enunciado O enunciado da questão.
     * @param {Grandeza} prescricao A quantidade de medicamento prescrita.
     * @param {Grandeza} medicamento A quantidade de medicamento disponível.
     * @param {Grandeza} diluente A quantidade de diluente disponível.
     */
    constructor(enunciado, prescricao, medicamento, diluente) {
        this.enunciado = enunciado;
        this.prescricao = prescricao;
        this.medicamento = medicamento;
        this.diluente = diluente;
    }
}

export class QuestaoGotejamento {
    /**
     * Cria um nova Questão de Gotejamento.
     * @param {String} enunciado O enunciado da questão.
     * @param {Grandeza} volume O volume de medicamento para o gotejamento.
     * @param {Grandeza} tempo O tempo de duração do gotejamento.
     */
    constructor(enunciado, volume, tempo) {
        /** @type {String} */       this.enunciado = enunciado;
        /** @type {Grandeza} */     this.volume = volume;
        /** @type {Grandeza} */     this.tempo = tempo;
    }
}

const questoesRegraDeTres = [
    new QuestaoRegraDeTres(
        'O médico prescreveu 1,5mg de cloranfenicol. Mas o medicamento que existe na farmácia é de 1ml, contendo 2mg. Como proceder?',
        new Grandeza(1.5, Miligramas),
        new Grandeza(2, Miligramas),
        new Grandeza(1, Mililitros),
    ),

    new QuestaoRegraDeTres(
        'Foi prescrita para uma criança de 13 meses, acometida de pneumonia, a administração de 350 mg de Cefalotina - EV, de 6/6 horas. Na unidade só há frascos do medicamento contendo 1 g e diluentes de 5ml. Quanto irei administrar à criança?',
        new Grandeza(350, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(5, Mililitros),
    ),
];

const questoesGotejamento = [
    new QuestaoGotejamento(
        'Para uma solução de 200 ml em 30 minutos, utilizando equipo de microgotas, devem ser infundidas quantas microgotas por minuto?',
        new Grandeza(200, Mililitros),
        new Grandeza(30, Minutos)
    ),

    new QuestaoGotejamento(
        'Para que 500 ml de soro fisiológico seja administrado em 6 horas, devem ser infundidas quantas gotas por minuto?',
        new Grandeza(500, Mililitros),
        new Grandeza(6, Horas)
    ),
];

/*
Retorna todas as questões disponíveis, tanto as de regra de 3 como as de gotejamento 
(pq? sei lá... para min faz muito sentido, pq assim pelo menos o usuário não vai 
precisar ficar escolhendo um modo de jogo para cada tipo de questão).
*/
export const questoes = [...questoesRegraDeTres, ...questoesGotejamento];

/** Retorna uma questão aleatória */
export const sortearQuestão = () => {
    return questoes[Math.floor(Math.random() * questoes.length)];
};

/** 
 * Retorna se uma questão é ou não uma Questão de Regra de Três 
 * @param {QuestaoRegraDeTres | QuestaoGotejamento} questao
*/
export const isQuestaoRegraDeTres = (questao) => {
    return questao instanceof QuestaoRegraDeTres;
}
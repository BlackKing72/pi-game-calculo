import { 
    Miligramas, Gramas, Mililitros, Litros,
    Horas, Minutos, Microgotas, Gotas,
    Unidade, buscarUnidadePorNome 
} from '../models/unidade.ts';

import { Grandeza, gerarGrandeza } from './grandeza.ts'

import { QuestaoRegraDeTres } from './questoes-regradetres';
import { QuestaoGotejamento } from './quetoes-gotejamento';
import { Questao } from '../services/perguntasService';

/** Retorna todas as questões disponíveis offline, tanto as de regra de 3 como as 
 * de gotejamento (pq? sei lá... para min faz muito sentido, pq assim pelo menos o 
 * usuário não vai precisar ficar escolhendo um modo de jogo para cada tipo de 
 * questão). */
export const questoesOffline: Questao[] = [
    new QuestaoRegraDeTres(1,
        'O médico prescreveu 1,5mg de cloranfenicol. Mas o medicamento que existe na farmácia é de 1ml, contendo 2mg. Como proceder?',
        new Grandeza(1.5, Miligramas),
        new Grandeza(2, Miligramas),
        new Grandeza(1, Mililitros),
    ),

    new QuestaoRegraDeTres(2,
        'Foi prescrita para uma criança de 13 meses, acometida de pneumonia, a administração de 350 mg de Cefalotina - EV, de 6/6 horas. Na unidade só há frascos do medicamento contendo 1 g e diluentes de 5ml. Quanto irei administrar à criança?',
        new Grandeza(350, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(5, Mililitros),
    ),

    new QuestaoGotejamento(3,
        'Para uma solução de 200 ml em 30 minutos, utilizando equipo de microgotas, devem ser infundidas quantas microgotas por minuto?',
        new Grandeza(200, Mililitros),
        new Grandeza(30, Minutos),
        'mgts/min',
    ),

    new QuestaoGotejamento(4,
        'Para que 500 ml de soro fisiológico seja administrado em 6 horas, devem ser infundidas quantas gotas por minuto?',
        new Grandeza(500, Mililitros),
        new Grandeza(6, Horas),
        'gts/min'
    ),
];
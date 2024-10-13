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

    new QuestaoRegraDeTres(5,
        'J.C.S. foi internado na clínica médica para tratamento de uma infecção, sendo prescrito amoxicilina 500mg suspensão oral de 8/8 horas. Quantos ml serão administrados, considerando que a apresentação farmacêutica disponível é de 250mg / 5ml?',
        new Grandeza(500, Miligramas),
        new Grandeza(250, Miligramas),
        new Grandeza(5, Mililitros)
    ),

    new QuestaoGotejamento(6,
        'Foram prescritos 1800 ml de Soro Fisiológico a 0,9% em 12 horas. Calcule quantas gotas por minuto deverão ser administradas no paciente?',
        new Grandeza(1800, Mililitros),
        new Grandeza(12, Horas),
        'gts/min'
    ),

    new QuestaoRegraDeTres(7,
        'O médico prescreveu 400 mg de Keflex, suspensão via oral (VO), a cada 8 horas. Na farmácia, está disponível um frasco contendo 250 mg em cada 5 ml de suspensão. Quantos mL da suspensão devem ser administrados?',
        new Grandeza(400, Miligramas),
        new Grandeza(250, Miligramas),
        new Grandeza(5, Mililitros)
    ),

    new QuestaoRegraDeTres(8,
        'O médico prescreveu 250 mg de Cefalexina, suspensão via oral (VO), a cada 8 horas. Na farmácia, está disponível um frasco contendo 250 mg de Cefalexina em cada 5 mL de suspensão. Quantos mL da suspensão devem ser administrados?',
        new Grandeza(250, Miligramas),
        new Grandeza(250, Miligramas),
        new Grandeza(5, Mililitros)
    ),

    new QuestaoRegraDeTres(9,
        'O médico prescreveu 180 mg de Vancomicina, intravenosa (EV), a cada 12 horas. Na farmácia, está disponível um frasco de 500 mg, que deve ser diluído em 5 mL de água destilada (AD). Quantos mL da solução preparada devem ser administrados?',
        new Grandeza(180, Miligramas),
        new Grandeza(500, Miligramas),
        new Grandeza(5, Mililitros)
    ),

    new QuestaoRegraDeTres(10,
        'O médico prescreveu 10 mg de Decadron (Dexametasona), intravenosa (EV), a cada 8 horas. Na farmácia, está disponível uma ampola de 2,5 mL, contendo 4 mg/mL de Decadron. Quantos mL da solução da ampola devem ser administrados?',
        new Grandeza(10, Miligramas),
        new Grandeza(10, Miligramas),
        new Grandeza(2.5, Mililitros)
    ),

    new QuestaoGotejamento(11,
        'O médico prescreveu Metoclopramida (Plasil) 8 mg, intravenosa (IV), a ser administrada junto com 500 mL de soro glicosado (SG) 5%, infundido em 4 horas. Qual será a taxa de gotejamento, em gotas por minuto?',
        new Grandeza(500, Mililitros),
        new Grandeza(4, Horas),
        'gts/min'
    ),

    new QuestaoRegraDeTres(12,
        'Um frasco de Mefoxim de 1 g deve ser diluído em 6 mL. O médico prescreveu 200 mg. Quantos mL da solução diluída devem ser administrados?',
        new Grandeza(200, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(6, Mililitros)
    ),

    new QuestaoRegraDeTres(13,
        'Um frasco de Keflex de 500 mg deve ser diluído em 5 mL. O médico prescreveu 350 mg. Quantos mL da solução diluída devem ser administrados?',
        new Grandeza(350, Miligramas),
        new Grandeza(500, Miligramas),
        new Grandeza(5, Mililitros)
    ),

    new QuestaoRegraDeTres(14,
        'O médico prescreveu Fenobarbital 300 mg, via oral (VO), a cada 24 horas. Está disponível uma ampola contendo 200 mg/mL de Fenobarbital. Quantos mL da ampola devem ser administrados?',
        new Grandeza(300, Miligramas),
        new Grandeza(200, Miligramas),
        new Grandeza(1, Mililitros)
    ),
    
    new QuestaoRegraDeTres(15,
        'O médico prescreveu 60 mg de Ranitidina, via oral (VO), a cada 12 horas. Está disponível um frasco de Label (Ranitidina) com 120 mL, cuja bula indica uma concentração de 150 mg/10 mL.. Quantos mL devem ser administrados?',
        new Grandeza(60, Miligramas),
        new Grandeza(1800, Miligramas),
        new Grandeza(120, Mililitros)
    ),

    new QuestaoRegraDeTres(16,
        'O médico prescreveu 450 mg de Clindamicina, intravenosa (EV), a cada 8 horas. Está disponível um frasco ampola de 6 mL, contendo 150 mg/mL de Clindamicina. Quantos mL da solução devem ser administrados?',
        new Grandeza(450, Miligramas),
        new Grandeza(900, Miligramas),
        new Grandeza(6, Mililitros)
    ),

    new QuestaoRegraDeTres(17,
        'O médico prescreveu 400 mg de Dipirona, intravenosa (EV), a ser administrada imediatamente. Está disponível uma ampola de Dipirona contendo 1g / 2mL. Quantos mL da ampola devem ser administrados?',
        new Grandeza(400, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(2, Mililitros)
    ),

    new QuestaoRegraDeTres(18,
        'O médico prescreveu 750 mg de Dipirona, intravenosa (EV), a cada 6 horas. Está disponível uma ampola de Dipirona contendo 1 g/2 mL. Quantos mL da ampola devem ser administrados?',
        new Grandeza(750, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(2, Mililitros)
    ),

    new QuestaoRegraDeTres(19,
        'O médico prescreveu 200 mg de Keflin, intravenosa (EV), a cada 6 horas. Está disponível um frasco ampola de 1 g, que deve ser diluído em 10 mL de água destilada (AD).  Quantos mL devem ser administrados?',
        new Grandeza(200, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(10, Mililitros)
    ),

    new QuestaoRegraDeTres(20,
        'O médico prescreveu 750 mg de Keflin, intravenosa (EV), a cada 6 horas. Está disponível um frasco ampola de 1 g, que deve ser diluído em 10 mL de água destilada (AD).',
        new Grandeza(750, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(10, Mililitros)
    ),

    new QuestaoGotejamento(21,
        'O médico prescreveu 500 mL de soro fisiológico a ser administrado em 4 horas. Quantas gotas por minuto devem ser administradas?',
        new Grandeza(500, Mililitros),
        new Grandeza(4, Horas),
        'gts/min'
    ),

    new QuestaoGotejamento(22,
        'Um paciente precisa receber 1.000 mL de solução glicosada 5% em 8 horas. Qual será a taxa de gotejamento em gotas por hora?',
        new Grandeza(1000, Mililitros),
        new Grandeza(8, Horas),
        'gts/hora'
    ),

    new QuestaoGotejamento(23,
        'Um paciente deve receber 1.000 mL de soro fisiológico a ser infundido em 8 horas. Calcule a taxa de infusão em microgotas por minuto.',
        new Grandeza(1000, Mililitros),
        new Grandeza(8, Horas),
        'mgts/min'
    ),

    new QuestaoGotejamento(24,
        'Um soro de 500 mL deve ser administrado em 4 horas. Qual será a taxa de infusão em microgotas por minuto?',
        new Grandeza(500, Mililitros),
        new Grandeza(4, Horas),
        'mgts/min'
    ),

    new QuestaoGotejamento(25,
        'Uma solução de 750 mL deve ser infundida em 12 horas. Calcule a taxa de infusão em microgotas por hora.',
        new Grandeza(750, Mililitros),
        new Grandeza(12, Horas),
        'mgts/hora'
    ),

    new QuestaoGotejamento(26,
        'Um paciente deve receber 600 mL de soro em 24 horas. Qual será a taxa de gotejamento em microgotas por hora?',
        new Grandeza(600, Mililitros),
        new Grandeza(24, Horas),
        'mgts/hora'
    ),

    new QuestaoGotejamento(27,
        'Um soro de 300 mL deve ser infundido em 3 horas. Qual será a taxa de infusão em gotas por minuto?',
        new Grandeza(300, Mililitros),
        new Grandeza(3, Horas),
        'gts/min'
    ),

    new QuestaoGotejamento(28,
        'Um paciente precisa receber 500 mL de solução salina em 4 horas. Qual será a taxa de gotejamento em gotas por minuto?',
        new Grandeza(500, Mililitros),
        new Grandeza(4, Horas),
        'gts/min'
    ),

    new QuestaoGotejamento(29,
        'Um soro de 800 mL deve ser infundido em 6 horas. Calcule a taxa de gotejamento em gotas por hora.',
        new Grandeza(800, Mililitros),
        new Grandeza(6, Horas),
        'gts/hora'
    ),

    new QuestaoGotejamento(30,
        'O médico prescreveu 1.500 mL de solução intravenosa para ser administrada em 12 horas. Qual será a taxa de infusão em gotas por hora?',
        new Grandeza(1500, Mililitros),
        new Grandeza(12, Horas),
        'gts/hora'
    ),
];
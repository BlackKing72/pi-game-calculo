import { Miligramas, Mililitros, Horas, Minutos, Gramas, Unidade, Microgotas, Gotas, buscarUnidadePorNome, } from '../models/unidade.ts';
import { Grandeza, gerarGrandeza } from '@/models/grandeza.ts'

import axios from 'axios';

export class QuestaoRegraDeTres {
    id: number;
    enunciado: string;
    prescricao: Grandeza;
    medicamento: Grandeza;
    diluente: Grandeza;

    constructor(id: number, enunciado: string, prescricao: Grandeza, medicamento: Grandeza, diluente: Grandeza) {
        this.id = id;
        this.enunciado = enunciado;
        this.prescricao = prescricao;
        this.medicamento = medicamento;
        this.diluente = diluente;
    }
}

export class QuestaoGotejamento {
    id: number;
    enunciado: string;
    volume: Grandeza;
    tempo: Grandeza;
    unidadeDestino: Unidade;

    constructor(id: number, enunciado: string, volume: Grandeza, tempo: Grandeza, unidadeDestino: Unidade) {
        this.id = id;
        this.enunciado = enunciado;
        this.volume = volume;
        this.tempo = tempo;
        this.unidadeDestino = unidadeDestino;
    }
}

export type Questao = QuestaoRegraDeTres | QuestaoGotejamento;

const questoesRegraDeTres: QuestaoRegraDeTres[] = [
    new QuestaoRegraDeTres(0,
        'O médico prescreveu 1,5mg de cloranfenicol. Mas o medicamento que existe na farmácia é de 1ml, contendo 2mg. Como proceder?',
        new Grandeza(1.5, Miligramas),
        new Grandeza(2, Miligramas),
        new Grandeza(1, Mililitros),
    ),

    new QuestaoRegraDeTres(1,
        'Foi prescrita para uma criança de 13 meses, acometida de pneumonia, a administração de 350 mg de Cefalotina - EV, de 6/6 horas. Na unidade só há frascos do medicamento contendo 1 g e diluentes de 5ml. Quanto irei administrar à criança?',
        new Grandeza(350, Miligramas),
        new Grandeza(1, Gramas),
        new Grandeza(5, Mililitros),
    ),
];

const questoesGotejamento: QuestaoGotejamento[] = [
    new QuestaoGotejamento(0,
        'Para uma solução de 200 ml em 30 minutos, utilizando equipo de microgotas, devem ser infundidas quantas microgotas por minuto?',
        new Grandeza(200, Mililitros),
        new Grandeza(30, Minutos),
        Microgotas,
    ),

    new QuestaoGotejamento(1,
        'Para que 500 ml de soro fisiológico seja administrado em 6 horas, devem ser infundidas quantas gotas por minuto?',
        new Grandeza(500, Mililitros),
        new Grandeza(6, Horas),
        Gotas
    ),
];

/** Retorna todas as questões disponíveis, tanto as de regra de 3 como as de gotejamento 
(pq? sei lá... para min faz muito sentido, pq assim pelo menos o usuário não vai 
precisar ficar escolhendo um modo de jogo para cada tipo de questão). */
export const questoes: Questao[] = [...questoesRegraDeTres]; //, ...questoesGotejamento];

/** Retorna uma questão aleatória */
export const sortearQuestão = (): Questao => {
    return questoes[Math.floor(Math.random() * questoes.length)];
};

export const gerarRespostas = (valor: Grandeza, variacao: number, quantidade: number) => {
    const valores: Grandeza[] = [];

    for (let i = 0; i < quantidade - 1; i++) {
        const index = Math.floor(Math.random() * valores.length);
        const valorGerado = gerarGrandeza(valor, variacao, true, true);
        valores.splice(index, 0, ...[valorGerado]);
    }

    const index = Math.floor(Math.random() * valores.length);
    valores.splice(index, 0, ...[valor]);

    return {
        valores: valores,
        resposta: index,
    };
}

/** Retorna se uma questão é ou não uma Questão de Regra de Três */
export const isQuestaoRegraDeTres = (questao: Questao) => {
    return questao instanceof QuestaoRegraDeTres;
}

/* ----------------------------------------------------------------------------
--- API banco de dados
---------------------------------------------------------------------------- */

const api = `http://localhost:3000/calculo`;

const criarQuestaoUsandoDados = (dados: any) : Questao => {
    if (dados.prescricao && dados.medicacao && dados.diluente) {
        const prescricaoUnidade = buscarUnidadePorNome(dados.prescricaoUnidade);
        const medicacaoUnidade = buscarUnidadePorNome(dados.medicacaoUnidade);
        const diluenteUnidade = buscarUnidadePorNome(dados.diluenteUnidade);

        if (!prescricaoUnidade || !medicacaoUnidade || !diluenteUnidade) {
            throw new Error('Unidade não encontrada');
        }

        const prescricao = new Grandeza(dados.prescricao, prescricaoUnidade);
        const medicacao = new Grandeza(dados.medicacao, medicacaoUnidade);
        const diluente = new Grandeza(dados.diluente, diluenteUnidade);

        return new QuestaoRegraDeTres(dados.id, dados.enunciado, prescricao, medicacao, diluente);
    }
    else if (dados.volume && dados.tempo) {
        const volumeUnidade = buscarUnidadePorNome(dados.volumeUnidade);
        const tempoUnidade = buscarUnidadePorNome(dados.tempoUnidade);
        const destinoUnidade = buscarUnidadePorNome(dados.destinoUnidade);

        if (!volumeUnidade || !tempoUnidade || !destinoUnidade) {
            throw new Error('Unidade não encontrada');
        }

        const volume = new Grandeza(dados.volume, volumeUnidade);
        const tempo = new Grandeza(dados.tempo, tempoUnidade);

        return new QuestaoGotejamento(dados.id, dados.enunciado, volume, tempo, tempoUnidade);
    }
    else {
        console.log(dados);
        throw new Error('A questão parece estar corrompida');
    }
}

export const buscarQuestoes = async () : Promise<Questao[]> => {
    try {
        const resposta = await axios.get(api);
        return resposta.data.map((dados: any) => {
            return criarQuestaoUsandoDados(dados);
        });
    }
    catch (err) {
        console.log(`Erro ao buscar questões. erro: ${err}`);
        return [];
    };
};

export const buscarQuestoesPorID = async (id: number) : Promise<Questao|null> => {
    try {
        const resposta = await axios.get(api + `?id=${id}`);
        return criarQuestaoUsandoDados(resposta.data[0]);
    }
    catch (err) {
        console.log(`Erro ao buscar questão por id. erro: ${err}`);
        return null;
    };
};

/** Retorna todas as questões em ordem aleatória ou uma lista vazia se acontecer algum erro. */
export const buscarQuestoesAleatorias = async () : Promise<Questao[]> => {
    try {
        const resposta = await axios.get(api + `?random=true`);
        return resposta.data.map((dados: any) => {
            return criarQuestaoUsandoDados(dados);
        });
    }
    catch (err) {
        console.log(`Erro ao buscar questão por id. erro: ${err}`);
        return [];
    };
}

/** Retorna uma única questão aleatória ou null se acontecer algum erro. */
export const buscarQuestaoAleatoria = async () : Promise<Questao|null> => {
    try {
        const resposta = await axios.get(api + `?random=true&count=1`);
        return criarQuestaoUsandoDados(resposta.data[0]);
    }
    catch (err) {
        console.log(`Erro ao buscar questão por id. erro: ${err}`);
        return null;
    };
};


export const criarQuestaoRegraDeTres = async (enunciado: string, prescricao: Grandeza, medicamento: Grandeza, diluente: Grandeza) => {
    try {
        await axios.post(api, {
            tipo: 0,
            enunciado: enunciado,
            prescricao: prescricao.valor, 
            prescricaoUnidade: prescricao.unidade.nome, 
            medicacao: medicamento.valor, 
            medicacaoUnidade: medicamento.unidade.nome, 
            diluente: prescricao.valor, 
            diluenteUnidade: prescricao.unidade.nome,
        });
    }
    catch (err) {
        console.error(`Erro ao criar questão de regra de três. erro: ${err}`);
    };
}

export const criarQuestaoGotejamento = async (enunciado: string, volume: Grandeza, tempo: Grandeza, unidadeDestino: Unidade) => {
    try {
        await axios.post(api, {
            tipo: 1,
            enunciado: enunciado,
            volume: volume.valor, 
            volumeUnidade: volume.unidade.nome, 
            tempo: tempo.valor, 
            tempoUnidade: tempo.unidade.nome, 
            destinoUnidade: unidadeDestino.nome,
        });
    }
    catch (err) {
        console.error(`Erro ao criar questão de Gotejamento. erro: ${err}`);
    };
}

export const deletarQuestaoPorID = async (id: number) => {
    try {
        await axios.delete(api + `?id=${id}`);
    } 
    catch (err) {
        console.error(`Erro ao deletar uma questão. erro: ${err}`);
    }
}

export const atualizaQuestaoRegraDeTres = async (id: number, enunciado: string, prescricao: Grandeza, medicamento: Grandeza, diluente: Grandeza) => {
    try {
        await axios.patch(api, {
            id: id,
            tipo: 0,
            enunciado: enunciado,
            prescricao: prescricao.valor, 
            prescricaoUnidade: prescricao.unidade.nome, 
            medicacao: medicamento.valor, 
            medicacaoUnidade: medicamento.unidade.nome, 
            diluente: prescricao.valor, 
            diluenteUnidade: prescricao.unidade.nome,
        })
    }
    catch (err) {
        console.error(`Erro ao atualizar questão de regra de três. erro: ${err}`);
    }
}

export const atualizarQuestaoGotejamento = async (id: number, enunciado: string, volume: Grandeza, tempo: Grandeza, unidadeDestino: Unidade) => {
    try {
        await axios.patch(api, {
            id: id,
            tipo: 1,
            enunciado: enunciado,
            volume: volume.valor, 
            volumeUnidade: volume.unidade.nome, 
            tempo: tempo.valor, 
            tempoUnidade: tempo.unidade.nome, 
            destinoUnidade: unidadeDestino.nome,
        });
    }
    catch (err) {
        console.error(`Erro ao atualizar questão de regra de três. erro: ${err}`);
    };
}
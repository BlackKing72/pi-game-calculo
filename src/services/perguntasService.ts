import { Miligramas, Mililitros, Horas, Minutos, Gramas, Unidade, Microgotas, Gotas, buscarUnidadePorNome, } from '../models/unidade.ts';
import { Grandeza, gerarGrandeza } from '@/models/grandeza.ts'

import { QuestaoRegraDeTres } from '../models/questoes-regradetres.ts';
import { QuestaoGotejamento } from '../models/quetoes-gotejamento.ts';
import { questoesOffline } from '../models/questoes-offline.ts';

import axios from 'axios';

export type Questao = QuestaoRegraDeTres | QuestaoGotejamento;


/* -----------------------------------------------------------------------------
---- API Owlpost ---------------------------------------------------------------
----------------------------------------------------------------------------- */

// const api = `http://localhost:3000/calculo`;
// const api = `http://10.23.49.20:3000/calculo`;
// const urlAPI = `http://192.168.15.201:3000/calculo`;
const api = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const urlAPI = `${api}/calculo`;

/** Retorna todas as questões disponíveis, se algum erro ocorrer ao conectar com 
 * a api retorna uma lista de questões padrão.
 * 
 * Retorna tanto as de regra de 3 como as de gotejamento (pq? sei lá... para min faz 
 * muito sentido, pq assim pelo menos o usuário não vai precisar ficar escolhendo um 
 * modo de jogo para cada tipo de questão). */
export const buscarQuestoes = async (): Promise<Questao[]> => {
    try {
        const resposta = await axios.get(urlAPI);
        return resposta.data.map((dados: any) => {
            return criarQuestaoUsandoDados(dados);
        });
    }
    catch (err) {
        console.warn(`Erro ao buscar questões usando a api, trocando para recursos offline. erro: ${err}`);
        return questoesOffline;
    };
};

/** Busca uma questão por seu ID, se algum erro ocorrer ao conectar com 
 * a api busca uma questões usando as questões padrão. */
export const buscarQuestoesPorID = async (id: number): Promise<Questao | null> => {
    try {
        const resposta = await axios.get(urlAPI + `?id=${id}`);
        if (resposta.data.length === 0) {
            return questoesOffline.find(questao => questao.id === id) ?? null;    
        }
        return criarQuestaoUsandoDados(resposta.data[0]);
    }
    catch (err) {
        console.warn(`Erro ao buscar questão usando a api, trocando para recursos offline. erro: ${err}`);
        return questoesOffline.find(questao => questao.id === id) || null;
    };
};


/** Retorna todas as questões em ordem aleatória, se algum erro ocorrer ao conectar com 
 * a api retorna as questões padrão em ordem aleatória. */
export const buscarQuestoesAleatorias = async (): Promise<Questao[]> => {
    try {
        const resposta = await axios.get(urlAPI + `?random=true`);
        return resposta.data.map((dados: any) => {
            return criarQuestaoUsandoDados(dados);
        });
    }
    catch (err) {
        console.log(`Erro ao buscar questão usando a api, trocando para recursos offline. erro: ${err}`);
        return embaralharLista(questoesOffline);
    };
}

/** Retorna uma única questão aleatória, se algum erro ocorrer ao conectar com 
 * a api retorna uma questões aleatória das questões padrão. */
export const buscarQuestaoAleatoria = async (): Promise<Questao | null> => {
    try {
        const resposta = await axios.get(urlAPI + `?random=true&count=1`);
        return criarQuestaoUsandoDados(resposta.data[0]);
    }
    catch (err) {
        console.log(`Erro ao buscar questão por id. erro: ${err}`);
        return buscarItemAleatorio(questoesOffline);
    };
};


/** Cria uma nova questão de regra de três no banco de dados.
 * @param prescricao O medicamento que o médico prescreveu.
 * @param medicamento O medicamento disponível na farmácia/estoque.
 * @param diluente A quantidade de diluente do medicamento disponível. */
export const criarQuestaoRegraDeTres = async (enunciado: string, prescricao: Grandeza, medicamento: Grandeza, diluente: Grandeza) => {
    try {
        await axios.post(urlAPI, {
            tipo: 0, // questão regra de três
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

/** Cria uma nova questão de gotejamento no banco de dados.
 * @param volume O volume de soro que o médico prescreveu.
 * @param tempo O tempo total de administração.
 * @param unidadeDestino Qual tipo de equação vai ser usada nessa questão. */
export const criarQuestaoGotejamento = async (enunciado: string, volume: Grandeza, tempo: Grandeza, unidadeDestino: 'gts/min' | 'gts/hora' | 'mgts/min' | 'mgts/hora') => {
    try {
        await axios.post(urlAPI, {
            tipo: 1, // questão de gotejamento
            enunciado: enunciado,
            volume: volume.valor,
            volumeUnidade: volume.unidade.nome,
            tempo: tempo.valor,
            tempoUnidade: tempo.unidade.nome,
            destinoUnidade: unidadeDestino,
        });
    }
    catch (err) {
        console.error(`Erro ao criar questão de Gotejamento. erro: ${err}`);
    };
}

/** Deleta uma questão do banco usando o ID. */
export const deletarQuestaoPorID = async (id: number) => {
    try {
        await axios.delete(urlAPI + `?id=${id}`);
    }
    catch (err) {
        console.error(`Erro ao deletar uma questão. erro: ${err}`);
    }
}

/** Atualiza uma questão de regra de três  no banco de dados. 
 * @param prescricao O medicamento que o médico prescreveu.
 * @param medicamento O medicamento disponível na farmácia/estoque.
 * @param diluente A quantidade de diluente do medicamento disponível. */
export const atualizaQuestaoRegraDeTres = async (id: number, enunciado: string, prescricao: Grandeza, medicamento: Grandeza, diluente: Grandeza) => {
    try {
        await axios.patch(urlAPI, {
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


/** Atualiza uma questão de gotejamento no banco de dados.
 * @param volume O volume de soro que o médico prescreveu.
 * @param tempo O tempo total de administração.
 * @param unidadeDestino Qual tipo de equação vai ser usada nessa questão. */
export const atualizarQuestaoGotejamento = async (id: number, enunciado: string, volume: Grandeza, tempo: Grandeza, unidadeDestino: 'gts/min' | 'gts/hora' | 'mgts/min' | 'mgts/hora') => {
    try {
        await axios.patch(urlAPI, {
            id: id,
            tipo: 1,
            enunciado: enunciado,
            volume: volume.valor,
            volumeUnidade: volume.unidade.nome,
            tempo: tempo.valor,
            tempoUnidade: tempo.unidade.nome,
            destinoUnidade: unidadeDestino,
        });
    }
    catch (err) {
        console.error(`Erro ao atualizar questão de regra de três. erro: ${err}`);
    };
}

/** Gera uma nova grandeza com base na grandeza passada.
 * @param valor A grandeza usada como base para gerar uma nova.
 * @param variacao Quantidade que o valor pode variar.
 * @param quantidade A quantidade de grandezas para gerar. */
export const gerarRespostas = (valor: Grandeza, variacao: number, quantidade: number) => {
    const valores: Grandeza[] = [];

    for (let i = 0; i < quantidade - 1; i++) {
        const index = Math.floor(Math.random() * valores.length);
        let valorGerado = gerarGrandeza(valor, variacao, true, true);

        const valorDuplicado = valores.some(valor => valor.valor === valorGerado.valor);

        if (valorDuplicado)
            valorGerado = new Grandeza(
                Math.round((valorGerado.valor * (Math.random() + 0.25)) * 10 / 10),
                valorGerado.unidade);

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

/* -----------------------------------------------------------------------------
---- Funções de Ajuda ----------------------------------------------------------
----------------------------------------------------------------------------- */

/** Retorna a lista em ordem aleatória */
function embaralharLista<T>(lista: T[]): T[] {
    let resultado = [...lista];
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

/** Retorna um item aleatória da lista */
function buscarItemAleatorio<T>(lista: T[]): T {
    return lista[Math.floor(Math.random() * lista.length)];
}

/** Usa os dados que vem da api para criar ou uma questão de regra de três ou
 * uma questão de gotejamento */
function criarQuestaoUsandoDados(dados: any): Questao {
    if (dados.prescricao && dados.medicacao && dados.diluente) {
        // Se os dados possuem prescrição, medicação e diluente, provávelmente é uma 
        // questão de regra de três, senão aconteceu algum erro no banco de dados.

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
        // Se os dados possuem volume e tempo, provávelmente é uma questão de 
        // gotejamento, senão aconteceu algum erro no banco de dados.

        const volumeUnidade = buscarUnidadePorNome(dados.volumeUnidade);
        const tempoUnidade = buscarUnidadePorNome(dados.tempoUnidade);
        const destinoUnidade = dados.destinoUnidade;

        if (!volumeUnidade || !tempoUnidade || !destinoUnidade) {
            throw new Error('Unidade não encontrada');
        }

        const volume = new Grandeza(dados.volume, volumeUnidade);
        const tempo = new Grandeza(dados.tempo, tempoUnidade);

        return new QuestaoGotejamento(dados.id, dados.enunciado, volume, tempo, destinoUnidade);
    }
    else {
        // Algo de errado aconteceu no banco de dados. Possível pergunta corrompida.
        console.log(dados);
        throw new Error('A questão parece estar corrompida');
    }
}
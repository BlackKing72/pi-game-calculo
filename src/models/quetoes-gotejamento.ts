import { Grandeza } from '@/models/grandeza.ts'

export class QuestaoGotejamento {
    id: number;
    enunciado: string;
    volume: Grandeza;
    tempo: Grandeza;
    unidadeDestino: 'gts/min'|'gts/hora'|'mgts/min'|'mgts/hora';

    constructor(id: number, enunciado: string, volume: Grandeza, tempo: Grandeza, unidadeDestino: 'gts/min'|'gts/hora'|'mgts/min'|'mgts/hora') {
        this.id = id;
        this.enunciado = enunciado;
        this.volume = volume;
        this.tempo = tempo;
        this.unidadeDestino = unidadeDestino;
    }
}

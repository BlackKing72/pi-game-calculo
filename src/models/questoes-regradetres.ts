import { Grandeza } from '@/models/grandeza.ts'

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

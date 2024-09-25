import MinigameSelecionarValor from "../minigames/MinigameSelecionarValor";

import { EtapaProps, CallbackResposta } from "../GameRegraDeTres";
import { gerarRespostas } from "@/services/perguntasService";
import { Grandeza } from "@/models/grandeza";

type SelecionarValorProps = {
    titulo: string
    valores: Grandeza[],
    resposta: number,
    quandoResponder: CallbackResposta,
};

const SelecionarValor = ({ titulo, valores, resposta, quandoResponder }: SelecionarValorProps) => {
    const handleQuandoResponder = (e: number) => {
        quandoResponder(e === resposta);
    }

    return (
        <MinigameSelecionarValor
            titulo={titulo}
            quandoResponder={handleQuandoResponder}
            valores={valores.map(valor => valor.toString())} />
    );
};



const SelecionarMedicamentoPrescrito = ({ questao, quandoResponder }: EtapaProps) => {
    const valoresPrescritos = gerarRespostas(questao.prescricao, questao.prescricao.valor * 2, 3);

    return (
        <SelecionarValor
            titulo="Qual é o medicamento prescrito pelo médico?"
            resposta={valoresPrescritos.resposta}
            valores={valoresPrescritos.valores}
            quandoResponder={quandoResponder} />
    );
};

const SelecionarMedicamentoDisponivel = ({ questao, quandoResponder }: EtapaProps) => {
    const valoresMedicamentos = gerarRespostas(questao.medicamento, questao.medicamento.valor * 2, 3);

    return (
        <SelecionarValor
            titulo="Qual medicamento está disponível?"
            resposta={valoresMedicamentos.resposta}
            valores={valoresMedicamentos.valores}
            quandoResponder={quandoResponder} />
    );
};

const SelecionarDiluenteDisponivel = ({ questao, quandoResponder }: EtapaProps) => {
    const valoresDiluentes = gerarRespostas(questao.diluente, questao.diluente.valor * 2, 3);

    return (
        <SelecionarValor
            titulo="Qual diliuente está disponível?"
            resposta={valoresDiluentes.resposta}
            valores={valoresDiluentes.valores}
            quandoResponder={quandoResponder} />
    );
};

export default SelecionarValor;

export {
    SelecionarMedicamentoPrescrito,
    SelecionarMedicamentoDisponivel,
    SelecionarDiluenteDisponivel,
};
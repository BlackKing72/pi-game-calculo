import MinigameEscolherOpcao from "../minigames/MinigameEscolherOpcao";

import { EtapaProps } from "../GameRegraDeTres";

const VerificarConversaoUnidades = ({ questao, quandoResponder }: EtapaProps) => {
    const handleQuandoResponder = (e: number) => {
        const respondeuSim = e === 0;
        const unidadesSaoDiferentes = questao.prescricao.unidade !== questao.medicamento.unidade;

        // se respondeu sim -> as unidades devem ser diferentes.
        // se respondeu não -> as unidades devem ser iguais.
        const resposta = respondeuSim
            ? unidadesSaoDiferentes
            : !unidadesSaoDiferentes;

        // se unidades são diferentes -> precisa passar pela conversão (pula 1 etapa).
        // se unidades são iguais -> ignora a conversão (pula 2 etapas).
        // isso vai ser ignorado se a resposta estiver errada
        // const pularPaginas = unidadesSaoDiferentes ? 1 : 2;

        quandoResponder(resposta);
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="font-medium">Observer o medicamento prescrito pelo médico e o medicamento disponível.</p>
            <hr className='my-2 w-full' />
            <div className="flex gap-4 flex-wrap items-center justify-center">
                <p >Valor prescrito:</p>
                <p className="w-24 h-8 flex items-center justify-center rounded-lg font-bold bg-orange-400 text-slate-950">
                    {questao.prescricao.toString()}
                </p>
                <p >Valor possuído:</p>
                <p className="w-24 h-8 flex items-center justify-center rounded-lg font-bold bg-orange-400 text-slate-950">
                    {questao.medicamento.toString()}
                </p>
            </div>

            <hr className='my-2 w-full' />

            <MinigameEscolherOpcao
                opcoes={['Sim', 'Não']}
                titulo='Eles precisam ser converidos?'
                quandoResponder={handleQuandoResponder} />
        </div>
    );
};

export default VerificarConversaoUnidades;
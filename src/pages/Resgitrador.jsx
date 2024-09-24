import "./Registrador.css";

import {QuestaoGotejamento, gerarRespostas, QuestaoRegraDeTres} from "@/services/perguntasService";
import VisualizarPerguntas from "../components/VisualizarPerguntas";

const Registrador = () => {
    return(
        <div>
            <div className="TabelaResponsivo">
                <table className="flex flex-col gap-10">
                    <thead>
                        <tr className="gap-10">
                            <th>Id</th>
                            <th>Enunciado</th>
                            <th>tipo de pergunta</th>
                            <th>Data de alteração</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <VisualizarPerguntas/>
                        <VisualizarPerguntas />
                    </tbody>
                </table>
            
            </div>
        </div>
    )
}

export default Registrador
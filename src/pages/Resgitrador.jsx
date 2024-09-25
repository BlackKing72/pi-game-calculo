import "./Registrador.css";

import {QuestaoGotejamento, gerarRespostas, QuestaoRegraDeTres} from "@/services/perguntasService";
import VisualizarPerguntas from "../components/VisualizarPerguntas";

const Registrador = () => {
    return(
        <div>
            <div className="TabelaResponsivo">
                <table className="table-auto border-collapse border-spacing-2 border border-slate-500 border-spacing-2">
                    <thead>
                        <tr>
                            <th className="border border-slate-600">Id</th>
                            <th className="border border-slate-600">Enunciado</th>
                            <th className="border border-slate-600">tipo de pergunta</th>
                            <th className="border border-slate-600">Data de alteração</th>
                            <th className="border border-slate-600">Ações</th>
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
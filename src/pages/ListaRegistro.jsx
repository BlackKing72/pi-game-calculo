import { Button } from "../components/ui/button";

import {QuestaoGotejamento, gerarRespostas, QuestaoRegraDeTres} from "@/services/perguntasService";
import VisualizarPerguntas from "../components/VisualizarPerguntas";

const ListaRegistro = () => {
    return(
        <div>
            <div className="flex flex-row absolute top-0 left-0 w-screen p-0 m-0 bg-blue-600">
                 <Button>gs</Button>
            </div>
            <div className="TabelaResponsivo">
                <table className="table-auto border-collapse border-spacing-2 border border-slate-500">
                    <thead>
                        <tr>
                            <th className="border border-slate-600">Id</th>
                            <th className="border border-slate-600">Enunciado</th>
                            <th className="border border-slate-600">Data de alteração</th>
                            <th className="border border-slate-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <VisualizarPerguntas/>
                        <VisualizarPerguntas/>
                    </tbody>
                </table>
            
            </div>
        </div>
    )
}

export default ListaRegistro;
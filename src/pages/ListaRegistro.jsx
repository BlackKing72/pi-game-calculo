import { useNavigate } from "react-router-dom";
import { LoadingScreen } from '@/components/ui/loading';
import { useState } from "react";
import Navbar from "../components/Navbar";

import { Button } from "../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../components/ui/dropdown-menu"

import {QuestaoGotejamento, gerarRespostas, QuestaoRegraDeTres} from "@/services/perguntasService";
import VisualizarPerguntas from "../components/VisualizarPerguntas";
import { Link } from "react-router-dom";

const ListaRegistro = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    return loading
    ?<LoadingScreen/>
    :(
        <div>
            <div className="absolute top-0 left-0 right-0">
                <Navbar/>
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
};

export default ListaRegistro;
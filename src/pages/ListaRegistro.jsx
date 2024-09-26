import { useNavigate } from "react-router-dom";
import { LoadingScreen } from '@/components/ui/loading';
import { useState } from "react";

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

    const NavGotejamento = async () => {
        setLoading(true);
        navigate("/registrarGotejamento/")
    }

    const NavRegraTres = async () => {
        setLoading(true);
        navigate("/registrarRegraTres/")
    }

    return loading
    ?<LoadingScreen/>
    :(
        <div>
            <div className="flex flex-row-reverse absolute top-0 left-0 w-screen p-0 m-0 bg-blue-600">
            <DropdownMenu>
                <DropdownMenuTrigger className="text-white">Criar nova questão</DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuLabel>Usando</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={NavRegraTres}>Regra de três</DropdownMenuItem>
                  <DropdownMenuItem onClick={NavGotejamento}>Gotejamento</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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
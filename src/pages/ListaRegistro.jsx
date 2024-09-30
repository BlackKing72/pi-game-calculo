import { useNavigate } from "react-router-dom";
import { LoadingScreen } from '@/components/ui/loading';
import { useEffect, useState } from "react";
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
import * as perguntasService from '../services/perguntasService'
const ListaRegistro = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [questoes, setQuestoes] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            const questoes = await perguntasService.buscarQuestoes();
            setQuestoes(questoes);
        };

        carregarDados();
        setLoading(false);
    }, []);

    const handleDeletarQuestao = () => {
        // chamo a api
    }

    return loading
    ? <LoadingScreen/>
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
                        {
                            questoes.map((questao, index) => 
                                <VisualizarPerguntas key={index} questao={questao}/>
                            )
                        }
                        {/* <VisualizarPerguntas/>
                        <VisualizarPerguntas/> */}
                    </tbody>
                </table>
            
            </div>
        </div>
    )
};

export default ListaRegistro;
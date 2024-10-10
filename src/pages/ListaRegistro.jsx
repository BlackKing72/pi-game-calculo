import { useNavigate } from "react-router-dom";
import { LoadingScreen } from '@/components/ui/loading';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import * as perguntasService from '../services/perguntasService'

const ListaRegistro = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [questoes, setQuestoes] = useState([]);

    const carregarDados = async () => {
        const questoes = await perguntasService.buscarQuestoes();
        setQuestoes(questoes);
    };
    useEffect(() => {

        carregarDados();
        setLoading(false);
    }, []);

    const handleDeletarQuestao = async (id) => {
        // chamo a api

        await perguntasService.deletarQuestaoPorID(id);
        await carregarDados();

    }

    const handleAlterarQuestao = async (id) => {

        const questao = await perguntasService.buscarQuestoesPorID(id)

        if (perguntasService.isQuestaoRegraDeTres(questao)) {
            navigate //regratres
        }
        else {
            navigate //gotejamento
        }
    }

    return loading
        ? <LoadingScreen />
        : (
            <div className="w-screen">
                <div className="absolute top-0 left-0 right-0">
                    <Navbar />
                </div>
                <Table className="rounded-lg overflow-hidden">
                    <TableHeader>
                        <TableRow className="w-screen">
                            <TableHead className="bg-slate-300 font-bold text-slate-900 text-center w-20">ID</TableHead>
                            <TableHead className="bg-slate-300 font-bold text-slate-900 text-center w-1/2">Enunciado</TableHead>
                            <TableHead className="bg-slate-300 font-bold text-slate-900 text-center ">Data de Alteração</TableHead>
                            <TableHead colSpan={2} className="bg-slate-300 font-bold text-slate-900 text-center">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questoes.map(questao =>
                            <TableRow key={questao.id} className="h-20">
                                <TableCell className="bg-slate-200 border-t border-l border-slate-300 px-4">{questao.id}</TableCell>
                                <TableCell className="bg-slate-200 border-t border-l text-left border-slate-300 px-4">{questao.enunciado}</TableCell>
                                <TableCell className="bg-slate-200 border-t border-l border-slate-300 px-4">35/13/3668</TableCell>
                                <TableCell className="bg-slate-200 border-t border-l border-slate-300 px-4">
                                    <Button className="w-24 mx-1" onClick={() => handleAlterarQuestao(questao.id)}>Alterar</Button>
                                    <Button className="w-24 mx-1" onClick={() => handleDeletarQuestao(questao.id)}>Excluir</Button>
                                </TableCell>
                            </TableRow>
                        )

                        }
                    </TableBody>
                </Table>
            </div>
        )
};

export default ListaRegistro;
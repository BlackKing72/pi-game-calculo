import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

import * as perguntasService from '../services/perguntasService'
import * as unidade from '../models/unidade'
import * as grandeza from '../models/grandeza'

const RegistrarRegraTres = () => {

    const [enunciado, setEnunciado] = useState();
    const [prescricao, setPrescricao] = useState(new grandeza.Grandeza(0, unidade.Gotas));
    const [prescricaoUnidade, setPrescricaoUnidade] = useState();

    const handleEnviar = async () => {
        await perguntasService.criarQuestaoRegraDeTres(enunciado,)
    };

    return (
        <>
            <div className="absolute top-0 left-0 right-0">
                <Navbar />
            </div>
            <div className="mb-10">
                <h1>Criar Pergunta usando Regra de Três</h1>
            </div>
            <div className="flex flex-col gap-5">
                <Input placeholder="Enunciado" value={enunciado} onChange={e => setEnunciado(e.target.value)}></Input>
                <div className="flex gap-5">
                    <Input type="number" placeholder="Valor Prescrição" onChange={e => setPrescricao(e.target.valueAsNumber)}/>
                    <Select onValueChange={index => setPrescricaoUnidade(unidade.unidades[index])}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecionar um valor" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                unidade.unidades.map((unidade, index) =>
                                    <SelectItem key={index} value={index} >{unidade.nome}</SelectItem>
                                )
                            }
                        </SelectContent>
                    </Select>
                </div>
                <Input type="number" placeholder="Valor Medicamento"></Input>
                <Input type="number" placeholder="Valor Diluente"></Input>
                <Button onClick={handleEnviar}>Enviar</Button>
            </div>
        </>
    )
}

export default RegistrarRegraTres;
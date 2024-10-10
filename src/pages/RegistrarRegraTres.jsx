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
    const [prescricao, setPrescricao] = useState(new grandeza.Grandeza(0, unidade.UnidadeVolume));
    const [prescricaoUnidade, setPrescricaoUnidade] = useState();
    const [medicamento, setMedicamento] = useState(new grandeza.Grandeza(0, unidade.UnidadeVolume));
    const [medicamentoUnidade, setMedicamentoUnidade] = useState();
    const [diluente, setDiluente] = useState(new grandeza.Grandeza(0, unidade.UnidadeVolume));
    const [diluenteUnidade, setDiluenteUnidade] = useState();

    const handleEnviar = async () => {
     await perguntasService.criarQuestaoRegraDeTres(
        enunciado,
        new grandeza.Grandeza(prescricao, prescricaoUnidade),
        new grandeza.Grandeza(medicamento, medicamentoUnidade),
        new grandeza.Grandeza(diluente, diluenteUnidade));

    // console.log(prescricaoUnidade)
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
                <Input placeholder="Enunciado" value={enunciado} on onChange={e => setEnunciado(e.target.value)}/>
                <h3 className="text-left pl-5">Prescrição</h3>
                <div className="flex gap-5">
                    <Input type="number" value={prescricao} placeholder="Valor Prescrição" onChange={e => setPrescricao(e.target.valueAsNumber)}/>
                    <Select onValueChange={index => setPrescricaoUnidade(unidade.unidades[index])}>
                        <SelectTrigger >
                            <SelectValue value={prescricaoUnidade} placeholder="Selecionar uma unidade" />
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
                <h3 className="text-left pl-5">Medicamento</h3>
                <div className="flex gap-5">
                    <Input type="number" value={medicamento} placeholder="Valor Medicamento" onChange={m => setMedicamento(m.target.valueAsNumber)}/>
                    <Select onValueChange={index => setMedicamentoUnidade(unidade.unidades[index])}>
                        <SelectTrigger >
                            <SelectValue value={medicamentoUnidade} placeholder="Selecionar uma unidade"/>
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
                <h3 className="text-left pl-5">Diluente</h3>
                <div className="flex gap-5">
                    <Input type="number" value={diluente} placeholder="Valor Diluente" onChange={e => setDiluente(e.target.valueAsNumber)}/>
                    <Select onValueChange={index => setDiluenteUnidade(unidade.unidades[index])}>
                        <SelectTrigger>
                            <SelectValue value={diluenteUnidade} placeholder="Selecionar uma unidade" />
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
                <Button onClick={handleEnviar}>Enviar</Button>
            </div>
        </>
    )
}

export default RegistrarRegraTres;
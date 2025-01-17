import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useState } from "react";
import * as grandeza from '../models/grandeza'
import * as unidade from '../models/unidade'
import Navbar from "../components/Navbar";
import * as perguntasService from '../services/perguntasService'
import { Horas, Minutos } from "../models/unidade";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

const RegistrarGotejamento = () => {
    const navigate = useNavigate();

    const [enunciado, setEnunciado] = useState();
    const [tempo, setTempo] = useState(new grandeza.Grandeza(0, unidade.UnidadeVolume));
    const [tempoUnidade, setTempoUnidade] = useState();
    const [volume, setVolume] = useState(new grandeza.Grandeza(0, unidade.UnidadeVolume));
    const [volumeUnidade, setVolumeUnidade] = useState();
    const [infusaoUnidade, setInfusaoUnidade] = useState();

    const infusaoUnidades = [
        { value: 'gts/min', display: 'Gotas por Minuto' },
        { value: 'gts/hora', display: 'Gotas por Hora' },
        { value: 'mgts/min', display: 'Microgotas por Minuto' },
        { value: 'mgts/hora', display: 'Microgotas por Hora' }]

    const handleEnviar = async () => {
        try {
            await perguntasService.criarQuestaoGotejamento(
                enunciado,
                new grandeza.Grandeza(volume, volumeUnidade),
                new grandeza.Grandeza(tempo, tempoUnidade),
                infusaoUnidade);

            navigate('/registro');
        }
        catch (err) {
            alert('Ops! Algo não ocorreu como planejado. Tente novamente mais tarde.');
        }
    }

    return (
        <div className="w-screen min-h-dvh max-h-dvh flex flex-col items-center">
            <div className="w-full h-20">
                <Navbar />
            </div>
            <div className="mb-10 mt-10">
                <h1>Criar Pergunta de Gotejamento</h1>
            </div>
            <div className="flex flex-col w-full gap-5 max-w-[95%] xl:max-w-[1024px]">
                <Textarea className="resize-none" placeholder="Enunciado" value={enunciado} on onChange={e => setEnunciado(e.target.value)} />
                <h3 className="text-left pl-5">Volume</h3>
                <div className="flex flex-row gap-5">
                    <Input type="number" value={volume} placeholder="Valor Volume" onChange={(e) => setVolume(e.target.valueAsNumber)} />
                    <Select onValueChange={nome => setVolumeUnidade(unidade.buscarUnidadePorNome(nome))}>
                        <SelectTrigger>
                            <SelectValue value={volumeUnidade} placeholder="Unidade de Medida" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                unidade.unidades.map((unidade, index) =>
                                    <SelectItem key={index} value={unidade.nome} >{unidade.nome}</SelectItem>
                                )
                            }
                        </SelectContent>
                    </Select>
                </div>
                <h3 className="text-left pl-5">Tempo</h3>
                <div className="flex flex-row gap-5">
                    <Input value={tempo} type="number" placeholder="Valor Tempo" onChange={e => setTempo(e.target.valueAsNumber)} />
                    <Select onValueChange={nome => setTempoUnidade(unidade.buscarUnidadePorNome(nome))}>
                        <SelectTrigger>
                            <SelectValue value={tempoUnidade} placeholder="Unidade de Tempo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={Minutos.nome}>{Minutos.nome}</SelectItem>
                            <SelectItem value={Horas.nome}>{Horas.nome}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <h3 className="text-left pl-5">Unidade de infusão</h3>
                <Select onValueChange={nome => setInfusaoUnidade(nome)}>
                    <SelectTrigger>
                        <SelectValue value={infusaoUnidade} placeholder="Unidade de infusão" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            infusaoUnidades.map((unidade, index) =>
                                <SelectItem key={index} value={unidade.value}>{unidade.display}</SelectItem>
                            )
                        }
                    </SelectContent>
                </Select>
                <Button onClick={handleEnviar}>Enviar</Button>
            </div>
        </div>
    )
}

export default RegistrarGotejamento;
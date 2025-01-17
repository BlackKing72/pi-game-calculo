import { useState } from "react";
import * as grandeza from '@/models/grandeza';
import * as unidade from '@/models/unidade';
import * as perguntasService from '@/services/perguntasService';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { Minutos, Horas, Gotas, Microgotas } from "@/models/unidade";

const AlterarGotejamento = () => {
    
    const [enunciado, setEnunciado] = useState();
    const [tempo, setTempo] = useState(new grandeza.Grandeza(0, unidade.UnidadeVolume));
    const [tempoUnidade, setTempoUnidade] = useState();
    const [volume, setVolume] = useState(new grandeza.Grandeza(0, unidade.UnidadeVolume));
    const [volumeUnidade, setVolumeUnidade] = useState();
    const [infusaoUnidade, setInfusaoUnidade] = useState();

    const handleEnviar = async () =>{

        console.log(tempoUnidade, volumeUnidade, infusaoUnidade);

        await perguntasService.criarQuestaoGotejamento(
            enunciado,
            new grandeza.Grandeza(tempo, tempoUnidade),
            new grandeza.Grandeza(volume, volumeUnidade),
            infusaoUnidade);
    }

    return(
        <>
        <div className="absolute top-0 left-0 right-0">
            <Navbar/>
        </div>     
        <div className="mb-10 mt-10">
            <h1>Criar Pergunta de Gotejamento</h1>
        </div>
        <div className="flex flex-col gap-5">
            <Input placeholder="Enunciado" value={enunciado} on onChange={e => setEnunciado(e.target.value)}/>
            <h3 className="text-left pl-5">Volume</h3>
            <div className="flex flex-row gap-5">
                <Input type="number" value={volume} placeholder="Valor Volume" onChange={(e) => setVolume(e.target.valueAsNumber)}/>
                <Select onValueChange={nome => setVolumeUnidade(unidade.buscarUnidadePorNome(nome))}>
                    <SelectTrigger>
                        <SelectValue value={volumeUnidade} placeholder="Unidade de Medida"/>
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
                <Input value={tempo} type="number" placeholder="Valor Tempo" onChange={e => setTempo(e.target.valueAsNumber)}/>
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
            <Select onValueChange={nome => setInfusaoUnidade(unidade.buscarUnidadePorNome(nome))}>
                    <SelectTrigger>
                        <SelectValue value={infusaoUnidade} placeholder="Unidade de infusão"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={Gotas.nome}>{Gotas.nome}</SelectItem>
                        <SelectItem value={Microgotas.nome}>{Microgotas.nome}</SelectItem>
                    </SelectContent>
                </Select>
            <Button onClick={handleEnviar}>Enviar</Button>
        </div>
        </>
    )
};

export default AlterarGotejamento;
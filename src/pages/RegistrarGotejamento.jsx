import {Input} from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import Navbar from "../components/Navbar";

const RegistrarGotejamento = () => {
    return(
        <>
        <div className="absolute top-0 left-0 right-0">
        <Navbar/>
        </div>     
        <div className="mb-10 mt-10">
            <h1>Criar Pergunta de Gotejamento</h1>
        </div>
        <div className="flex flex-col gap-5">
            <Input placeholder="Enunciado"></Input>
            <Input type="number" placeholder="Valor Volume"></Input>
            <Select>
                <h3 className="flex">Unidade de Tempo</h3>
                <SelectTrigger>
                    <SelectValue placeholder="Unidade de Tempo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Minutos">Minutos</SelectItem>
                    <SelectItem value="Horas">Horas</SelectItem>
                </SelectContent>
            </Select>
            <h3 className="flex">Unidade de Medida</h3>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Unidade de Medida" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Gotas">Gotas</SelectItem>
                    <SelectItem value="Micro_Gotas">Micro Gotas</SelectItem>
                </SelectContent>
            </Select>
            <Button>Enviar</Button>
        </div>
        </>
    )
}

export default RegistrarGotejamento;
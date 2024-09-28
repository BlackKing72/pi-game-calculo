import {Input} from "../components/ui/input";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";

const RegistrarRegraTres = () => {
    return(
        <>
            <div className="absolute top-0 left-0 right-0">
                <Navbar/>
            </div>     
            <div className="mb-10">
                <h1>Criar Pergunta usando Regra de Três</h1>
            </div>
            <div className="flex flex-col gap-5">
                <Input placeholder="Enunciado"></Input>
                <Input type="number" placeholder="Valor Prescrição"></Input>
                <Input type="number" placeholder="Valor Medicamento"></Input>
                <Input type="number" placeholder="Valor Diluente"></Input>
                <Button>Enviar</Button>
            </div>
        </>
    )
}

export default RegistrarRegraTres;
import {Input} from "../components/ui/input";
import { Button } from "../components/ui/button";

const RegistrarRegraTres = () => {
    return(
        <div className="flex flex-col gap-5">
            <Input placeholder="Enunciado"></Input>
            <Input type="number" placeholder="Valor Prescrição"></Input>
            <Input type="number" placeholder="Valor Medicamento"></Input>
            <Input type="number" placeholder="Valor Diluente"></Input>
            <Button>Enviar</Button>
        </div>
    )
}

export default RegistrarRegraTres;
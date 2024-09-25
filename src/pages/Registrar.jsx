import {Input} from "../components/ui/input";
import { Button } from "../components/ui/button";

const Registrar = () => {
    return(
        <div className="flex flex-col gap-5">
            <Button>Criar pergunta usando regra de três</Button>
            <Button>Criar pergunta de Gotejamento</Button>
        </div>
    )
}

export default Registrar;
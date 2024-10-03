import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress"

const Resultados = () => {
    const navigate = useNavigate();
    const resultados = JSON.parse(localStorage.getItem('resultadoFinal'));

    // if (!resultados) {
    //     navigate('/');
    // }

    return (
        <div className="">
            <div>
                <p>Você completou a equação em {resultados.tempoGasto}</p>
                <p>Acertou {resultados.acertos}/{resultados.totalTentativas}</p>
                <p>Precisão {Math.round(resultados.precisao)}%</p>
                <Progress value={resultados.precisao} className="w-full bg-slate-300 *:bg-orange-500" />
            </div>
        </div>
    )
};

export default Resultados;
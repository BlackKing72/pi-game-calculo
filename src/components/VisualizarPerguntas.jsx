import { Button } from "./ui/button";

const VisualizarPerguntas = ({questao}) => {
  return (
    <tr>
      <td className="border border-slate-700 w-20">{questao.id}</td>
      <td className="border border-slate-700 w-44 text-ellipsis line-clamp-2">{questao.enunciado}</td>
      <td className="border border-slate-700 w-44">Data de alteração</td>
      <td className="border border-slate-700">
        <Button className="rounded-none">Alterar</Button>
        <Button className="rounded-none">Excluir</Button>
      </td>
    </tr>
  );
};

export default VisualizarPerguntas;

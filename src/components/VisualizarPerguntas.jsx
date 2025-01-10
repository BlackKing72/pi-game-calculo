import { Button } from "./ui/button";

const VisualizarPerguntas = ({ questao }) => {
  return (
    <tr>
      <td className="border border-slate-700 px-4">
        <p>{questao.id}</p>
      </td>
      <td className="border border-slate-700 ">
        <p className="text-ellipsis line-clamp-2">asdasdasdas</p>
      </td>
      <td className="border border-slate-700 ">Data de alteração</td>
      <td className="border border-slate-700 flex gap-2 w-min">
        <Button className="rounded-none">Alterar</Button>
        <Button className="rounded-none">Excluir</Button>
      </td>
    </tr>
  );
};

export default VisualizarPerguntas;

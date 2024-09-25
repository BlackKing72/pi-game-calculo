import { Button } from "./ui/button";

const VisualizarPerguntas = () => {
  return (
    <tr>
      <td className="border border-slate-700 w-20">Id</td>
      <td className="border border-slate-700 w-44">Enunciado</td>
      <td className="border border-slate-700 w-44">Data de alteração</td>
      <td className="border border-slate-700">
        <Button className="rounded-none">Alterar</Button>
        <Button className="rounded-none">Excluir</Button>
      </td>
    </tr>
  );
};

export default VisualizarPerguntas;

import {Button} from './ui/button'

const VisualizarPerguntas = () =>{
 return(
    <div>
        <tr className='flex gap-10'>
            <td>Id</td>
            <td>Enunciado</td>
            <td>Tipo de pergunta</td>
            <td>Data de alteração</td>
            <td><Button className='w-24 h-8'>Alterar</Button></td>
            <td><Button className='w-24 h-8'>Excluir</Button></td>
        </tr>
    </div>
    )
};

export default VisualizarPerguntas;
import { Button } from "../ui/button";

const MinigameEscolherOpcao = ({titulo, opcoes, quandoResponder}) => {
    return(
        <div className="select-options flex flex-col w-full gap-8 max-w-prose">
            <p className="font-medium">{titulo}</p>
            <div className="flex gap-4 flex-wrap">
            {
                opcoes.map((opcao, index) => 
                    <Button key={index}  
                        className='flex-grow basis-1/3' 
                        onClick={() => quandoResponder(index)}>{opcao}</Button>
                )
            }
            </div>
        </div>
    );
};

export default MinigameEscolherOpcao;
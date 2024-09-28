import Logo from '../assets/images/Group.svg';
import './Navbar.css';
import NomeLogo from '../assets/images/NameLogo.svg';
import {QuestaoGotejamento, gerarRespostas, QuestaoRegraDeTres} from "@/services/perguntasService";
import { Link } from 'react-router-dom';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const NavGotejamento = async () => {
    setLoading(true);
    navigate("/registrarGotejamento/")
}

const NavRegraTres = async () => {
    setLoading(true);
    navigate("/registrarRegraTres/")
}

  return (
    <nav className="navbar">
      <div className="logo" onClick={()=> navigate('/')}>
        <img src={Logo} alt="" className="logo-image"/>
        <img src={NomeLogo} className='logo-name'/>
      </div>
      <div>
        <DropdownMenu>
            <DropdownMenuTrigger className="text-white">Navegar</DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel className='bg-neutral-300 cursor-default'>Criar Pergunta</DropdownMenuLabel>
              <DropdownMenuItem className='cursor-pointer' onClick={() => navigate('/registrarRegraTres')}>Regra de três</DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'  onClick={() => navigate('/registrarGotejamento')}>Gotejamento</DropdownMenuItem>
              <DropdownMenuSeparator />
            <DropdownMenuLabel className='bg-neutral-300 cursor-default'>Visualizar</DropdownMenuLabel>
              <DropdownMenuItem className='cursor-pointer'  onClick={() => navigate('/listaregistro')}>Perguntas</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
export default Navbar;
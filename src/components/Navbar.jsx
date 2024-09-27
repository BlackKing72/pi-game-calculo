import Logo from '../assets/images/Group.svg';
import './Navbar.css';
import Profile from '../assets/images/Profile.svg';
import NomeLogo from '../assets/images/NameLogo.svg';
import {QuestaoGotejamento, gerarRespostas, QuestaoRegraDeTres} from "@/services/perguntasService";


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
        <img 
          src={Logo}
          alt="" 
          className="logo-image"
        />
        <img
          src={NomeLogo}
          className='logo-name'
        />

<div className="flex flex-row-reverse absolute top-0 left-0 w-screen p-0 m-0 bg-blue-600">
            <DropdownMenu>
                <DropdownMenuTrigger className="text-white">Criar nova questão</DropdownMenuTrigger>
                <DropdownMenuContent>
                <DropdownMenuLabel>Usando</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={NavRegraTres}>Regra de três</DropdownMenuItem>
                  <DropdownMenuItem onClick={NavGotejamento}>Gotejamento</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
      </div>
    </nav>
  );
};
export default Navbar;
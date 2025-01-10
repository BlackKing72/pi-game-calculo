import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';

import './App.css';

import MinigamePage from './pages/MinigamePage';
import SwapySandbox from './pages/SwapySandbox';
import Resultados from './pages/Resultados';
import ListaRegistro from './pages/ListaRegistro';
import RegistrarGotejamento from './pages/RegistrarGotejamento';
import RegistrarRegraTres from './pages/RegistrarRegraTres';
import AlterarGotejamento from './pages/AlterarGotejamento';
import AlterarRegraTres from './pages/AlterarRegraTres';
import { useEffect } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/swapy',
    element: <SwapySandbox />
  },
  {
    path: '/app/:idQuestao',
    element: <MinigamePage />
  },
  {
    path: '/app/resultados',
    element: <Resultados />
  },
  {
    path: '/registro',
    element: <ListaRegistro />
  },
  {
    path: '/gotejamento',
    element: <RegistrarGotejamento />
  },
  {
    path: '/regraTres',
    element: <RegistrarRegraTres />
  },
  {
    path: '/gotejamento/:id',
    element: <AlterarGotejamento />
  },
  {
    path: '/regraTres/:id',
    element: <AlterarRegraTres />
  }
])

class DebugEvent extends Event {
  constructor(enabled) {
    super('debug-changed');
    this.enabled = enabled;
  }
}

function App() {

  const handleKeyDown = (e) => {
    if (!e.repeat && e.ctrlKey && e.shiftKey && e.key === '"') {
      if (localStorage.getItem('enableDebugMode')) {
        alert('Desativando modo de desenvolverdor');
        localStorage.removeItem('enableDebugMode');
        window.dispatchEvent(new DebugEvent(false));
      }
      else {
        alert('Ativando modo de desenvolvedor');
        localStorage.setItem('enableDebugMode', true);
        window.dispatchEvent(new DebugEvent(true));
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <RouterProvider router={router} />
  )
}

export default App

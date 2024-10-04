import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';

import './App.css';

import MinigamePage from './pages/MinigamePage';
import SwapySandbox from './pages/SwapySandbox';
import ListaRegistro from './pages/ListaRegistro';
import RegistrarGotejamento from './pages/RegistrarGotejamento';
import RegistrarRegraTres from './pages/RegistrarRegraTres';
import AlterarGotejamento from './pages/AlterarGotejamento';
import AlterarRegraTres from './pages/AlterarRegraTres';

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
    path: '/listaregistro',
    element: <ListaRegistro/>
  },
  {
    path: '/gotejamento',
    element: <RegistrarGotejamento/>
  },
  {
    path: '/regraTres',
    element: <RegistrarRegraTres/>
  },
  {
    path: '/gotejamento/:id',
    element: <AlterarGotejamento/>
  },
  {
    path: '/regraTres/:id',
    element: <AlterarRegraTres/>
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App

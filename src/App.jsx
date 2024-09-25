import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';

import './App.css';

import MinigamePage from './pages/MinigamePage';
import SwapySandbox from './pages/SwapySandbox';
import ListaRegistro from './pages/ListaRegistro';
import Registrar from './pages/Registrar';

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
    path: '/app',
    element: <MinigamePage />
  },
  {
    path: '/listaregistro',
    element: <ListaRegistro/>
  },
  {
    path: '/registrar',
    element: <Registrar/>
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';

import './App.css';

import GamePage from './pages/GamePage';
import SwapySandbox from './pages/SwapySandbox';
import OkamiTeste from './pages/teste';

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
    element: <GamePage />
  },
  {
    path: '/okami',
    element: <OkamiTeste/>
  }
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App

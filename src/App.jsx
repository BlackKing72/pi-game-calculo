import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';

import './App.css';

import MinigamePage from './pages/MinigamePage';
import SwapySandbox from './pages/SwapySandbox';

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
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App

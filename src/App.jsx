import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GamePage from './pages/GamePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/app',
    element: <GamePage />
  },
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App

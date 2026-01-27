import { Route, Routes } from 'react-router'
import './App.css'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import { Box } from '@mantine/core'
import AddJokePage from './pages/AddJokePage'
import Navbar from './components/Navbar'

function App() {
  const { user, loading } = useAuth()

  return (
    <>
      { loading || !user ?
        <AuthPage /> :
        <>
        <Box>
          <Navbar />
          
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/new-joke' element={<AddJokePage />} />
          </Routes>
        </Box>
        </>
      }
    </>
  )
}

export default App

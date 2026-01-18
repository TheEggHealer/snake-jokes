import { Route, Routes } from 'react-router'
import './App.css'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import { Title } from '@mantine/core'

function App() {
  const { user, loading } = useAuth()

  return (
    <>
      { loading || !user ?
        <AuthPage /> :
        <>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/new-joke' element={<Title>Add Joke</Title>} />
        </Routes>
        </>
      }
    </>
  )
}

export default App

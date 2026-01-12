import './App.css'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'

function App() {
  const { user, loading } = useAuth()

  return (
    <>
      { loading || !user ?
       <AuthPage /> :
       <HomePage /> }
    </>
  )
}

export default App

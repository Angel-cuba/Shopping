import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Navigation from './router/Navigation'
import { useTheme } from './context/ThemeProvider'
import { darkTheme, lightTheme } from './styles/styles'

function App() {
  const { theme } = useTheme()
  return (
    <div style={{
      backgroundColor: theme === 'light' ? lightTheme.bg : darkTheme.bg,
      minHeight: '100vh',
    }}>
      <Navbar />
      <Navigation />
    </div>
  )
}

export default App

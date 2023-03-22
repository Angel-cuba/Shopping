import { useDispatch, useSelector } from 'react-redux'

import { RootState } from './redux/store'
import Navbar from './components/Navbar/Navbar'
import Navigation from './router/Navigation'

function App() {
  const dispatch = useDispatch()

  return (
    <>
      <Navbar />
      <Navigation />
    </>
  )
}

export default App

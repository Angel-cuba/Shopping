import { useDispatch, useSelector } from 'react-redux'

import { RootState } from './redux/store'
import { handleDecrement, handleIncrement } from './redux/actions/counter'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { count } = useSelector((state: RootState) => state)

  return (
    <div className="App">
      <h1>Vite + React + Redux Vanilla + Tailwind</h1>
      <div className="card">
        <button onClick={() => dispatch(handleIncrement())}>Increment</button>
        <span className="px-10">{count}</span>
        <button onClick={() => dispatch(handleDecrement())}>Decrement</button>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import RealtimeData from './components/RealtimeData'
import Logs from './components/Logs'
import SavedData from './components/SavedData'
import Switches from './components/Switches'
import Spacer from './components/Spacer'

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <div className='w-full min-h-screen bg-slate-900 text-white flex flex-col'>

      <Header/>

      <RealtimeData/>

      <SavedData />

      <Spacer/>


      <Switches/>
      <Logs/>

    </div>
  )
}

export default App

import './App.css'
import LeftNav from './components/nav/LeftNav'
import RightNav from './components/nav/RightNav'
import TopNav from './components/nav/TopNav'
import TestContainer from './components/playground/TestContainer'

function App() {

  return (
    <div style={{height: "100svh"}}>
      <TopNav />
      <LeftNav />
      <RightNav />
      <TestContainer />
    </div>
  )
}

export default App

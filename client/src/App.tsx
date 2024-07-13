import './App.css'
import CandidateInterface from './components/candidate-view/candidate-interface'
import LeftNav from './components/nav/LeftNav'
import RightNav from './components/nav/RightNav'
import TopNav from './components/nav/TopNav'
import TestContainer from './components/playground/TestContainer'

function App() {

  return (
    <div style={{height: "100svh"}}>
      {/* <TopNav />
      <LeftNav />
      <RightNav /> */}
      
      {/* <TestContainer /> */}

      < CandidateInterface />
    </div>
  )
}

export default App

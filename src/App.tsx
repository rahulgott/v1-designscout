import './App.css'
import TopNav from './components/TopNav'
import TestContainer from './components/playground/TestContainer'

function App() {

  return (
    <div style={{
      height: "100svh",
      backgroundImage: `url("src/assets/background-dots.png")`,
      backgroundRepeat: "repeat",
      backgroundSize: "50px",
      boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.2)",
      }}>
      <TopNav />
      <TestContainer />
    </div>
  )
}

export default App

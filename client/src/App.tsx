import "./App.css"
import CandidateInterface from "./components/candidate-view/candidate-interface"
import { QuestionProvider } from "./contexts/questionContext"

function App() {
  return (
    <div style={{ height: "100svh" }}>
      <QuestionProvider>
        <CandidateInterface />
      </QuestionProvider>
    </div>
  )
}

export default App

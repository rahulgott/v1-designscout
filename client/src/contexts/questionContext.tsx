import React, { createContext, useContext, useState, ReactNode } from "react"
import { MockCommentData } from "../interfaces/types"

interface QuestionContextType {
  currentQuestion: number
  setCurrentQuestion: (index: number) => void
  commentData: MockCommentData
  setCommentData: (update: React.SetStateAction<MockCommentData>) => void
}

const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
)

export const useQuestion = () => {
  const context = useContext(QuestionContext)
  if (!context) {
    throw new Error("useQuestion must be used within a QuestionProvider")
  }
  return context
}

export const QuestionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [commentData, setCommentData] = useState<MockCommentData>({
    lastUpdated: Date.now(),
    scale: "100%",
    devicePixelRatio: 1,
    displayDimensions: {
      width: 1920,
      height: 1080,
    },
    data: [],
  })

  return (
    <QuestionContext.Provider
      value={{
        currentQuestion,
        setCurrentQuestion,
        commentData,
        setCommentData,
      }}
    >
      {children}
    </QuestionContext.Provider>
  )
}

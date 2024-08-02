import CanvasArea from "../canvas-area"
import { MockData } from "../../../interfaces/types"
import styles from "./styles.module.css"
import HeadingNav from "../nav/HeadingNav"
import LeftNav from "../nav/LeftNav"
import Timer from "../ui/Timer"
import CommentNav from "../nav/CommentNav"
import { useQuestion } from "../../../contexts/questionContext"
import ToolBarNav from "../nav/ToolBarNav"
import InstructionsNav from "../nav/Instructions"

export default function CandidateInterface() {
  const { currentQuestion } = useQuestion()

  const mockData: MockData = {
    assessmentName: "AirBnB Product Design Intern Assessment",
    timeLimit: 60,
    productBrief: {
      background: [
        "Airbnb is a global online marketplace for lodging, primarily home stays for vacation rentals, and tourism activities.",
      ],
      targetUsers: [
        "Demographics: Users aged between 25-45 years, primarily consisting of millennial travellers and small families.",
        "Psychographics: Users who value unique travel experiences, convenience, and value for money.",
        "Behavioural Characteristics: Users who prefer online bookings, are tech-savvy, and often rely on mobile devices for travel planning.",
      ],
      businessGoals: [
        "Increase the booking conversion rate.",
        "Enhance user engagement by improving the ease of use and functionality of the mobile app.",
        "Retain existing customers and attract new ones by ensuring a seamless user experience.",
      ],
      challenges: [
        "Managing Multiple Projects: Prioritising tasks across multiple projects to ensure deadlines are met.",
        "Communication gaps",
      ],
    },
    questions: [
      {
        question: "What would you change to increase user engagement?",
        imageMockup: "./img-mockup.png",
      },
      {
        question: "Question 2?",
        imageMockup:
          "https://cdsassets.apple.com/live/7WUAS350/images/ios/ios-17-iphone-15-pro-app-library.png",
      },
      {
        question: "Question 3?",
        imageMockup:
          "https://play-lh.googleusercontent.com/z1ynNM1nPd7JOOGYRK16qcrX7KZpK0CrnNUUyQXOCxfuxtVcA5lu3qPKWK7ZR_Pp4Q",
      },
    ],
    comments: [],
  }

  return (
    <div className={styles.candidateInterface}>
      {/* 
      Check state of question selection here. 
      Props to pass: 
        - product brief and question for left nav,
        - image for canvas area
        - all comments for right nav   
    */}

      <HeadingNav assessmentName={mockData.assessmentName} />
      <LeftNav
        questions={mockData.questions}
        productBrief={mockData.productBrief}
      />
      <InstructionsNav />
      <Timer timerMinutes={mockData.timeLimit} />
      <CommentNav />
      <ToolBarNav />
      <CanvasArea
        imageMockup={mockData.questions[currentQuestion].imageMockup}
      />
    </div>
  )
}

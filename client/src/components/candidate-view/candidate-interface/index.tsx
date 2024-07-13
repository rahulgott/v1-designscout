import { useState } from 'react'
import CanvasArea from '../canvas-area'
import { MockData } from '../../../interfaces/types'
import styles from "./styles.module.css"

export default function CandidateInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const mockData: MockData = {
    assessmentName: "AirBnB Product Design Intern Assessment",
    timeLimit: 60,
    imageMockup: "./img-mockup.png",
    assessmentInfo: [
      {
        question: "What would you change to increase user engagement?",
        productBrief: {
          background: ["Airbnb is a global online marketplace for lodging, primarily home stays for vacation rentals, and tourism activities."],
          targetUsers: [
            "Demographics: Users aged between 25-45 years, primarily consisting of millennial travellers and small families.",
            "Psychographics: Users who value unique travel experiences, convenience, and value for money.",
            "Behavioural Characteristics: Users who prefer online bookings, are tech-savvy, and often rely on mobile devices for travel planning."
          ],
          businessGoals: [
            "Increase the booking conversion rate.",
            "Enhance user engagement by improving the ease of use and functionality of the mobile app.",
            "Retain existing customers and attract new ones by ensuring a seamless user experience." 
          ],
          challenges: [
            "Managing Multiple Projects: Prioritising tasks across multiple projects to ensure deadlines are met.",
            "Communication gaps"
          ]
        }
      }
    ],
    comments: []
  }

  return (
    <div className={styles.candidateInterface}>
    {/* 
      Checck state of question selection here. 
      Props to pass: 
        - product brief and question for left nav,
        - image for canvas area
        - all comments for right nav   
    */}

    




      <CanvasArea imageMockup = {mockData.imageMockup} />
    </div>
  )
}

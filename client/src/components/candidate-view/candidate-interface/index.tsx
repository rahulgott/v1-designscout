import { useState } from 'react'
import CanvasArea from '../canvas-area'
import { MockData } from '../../../interfaces/types'
import styles from "./styles.module.css"
import HeadingNav from '../nav/HeadingNav'
import LeftNav from '../nav/LeftNav'
import Timer from '../ui/Timer'
import CommentNav from '../nav/CommentNav'
import { useQuestion } from '../../../contexts/questionContext'
import ToolBarNav from '../nav/ToolBarNav'
import InstructionsNav from '../nav/Instructions'

export default function CandidateInterface() {
  const { currentQuestion } = useQuestion();

  const mockData: MockData = {
    assessmentName: "AirBnB Product Design Intern Assessment",
    timeLimit: 60,
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
        },
        imageMockup: "./img-mockup.png",
      },
      {
        question: "Question 2?",
        productBrief: {
          background: ["Second background"],
          targetUsers: [
            "Demographics details 1.",
            "Psychographics details 1"
          ],
          businessGoals: [
            "Increased rates",
            "Enhance user engagement" 
          ],
          challenges: [
            "Managing Multiple Projects"
          ]
        },
        imageMockup: "https://cdsassets.apple.com/live/7WUAS350/images/ios/ios-17-iphone-15-pro-app-library.png",
      },
      {
        question: "Question 3?",
        productBrief: {
          background: ["background 3"],
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
        },
        imageMockup: "https://helpguide.sony.net/mobile/xperia-1/v1/en-us/contents/images/SCR-SONY-19GN-GENERIC-APPLICATION-SCREEN.png",
      }
    ],
    comments: []
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
      <LeftNav  assessmentInfo={mockData.assessmentInfo} />
      <InstructionsNav />
      <Timer timerMinutes={mockData.timeLimit}/>
      <CommentNav />
      <ToolBarNav />
      <CanvasArea imageMockup={mockData.assessmentInfo[currentQuestion].imageMockup} />
    </div>
  )
}

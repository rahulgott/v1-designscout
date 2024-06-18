import Button from '../../ui/Button'
import Timer from '../../ui/Timer'
import styles from './styles.module.css'

export default function QuestionContainer() {

    function handleTestSubmit() {
        console.log("Submit")
    }

    return (
        <div className={styles.questionContainer}>
            <div className={styles.questions}>
                <span>Question 1</span>
                <p>What would you change to increase user engagement?</p>
            </div>
            <div>
                <Timer />
                <Button text={"Submit"} size={"md"} color={"primary"} onClick={handleTestSubmit}/>
            </div>
        </div>
  )
}

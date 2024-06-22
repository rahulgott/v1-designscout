import Button from '../../ui/Button'
import styles from './styles.module.css'

export default function QuestionContainer() {

    function handleTestSubmit() {
        console.log("Submit")
    }

    return (
        <div className={styles.questionContainer}>
            <div className={styles.questions}>
                <p><span>Question 1 of 1 : </span>What would you change to increase user engagement?</p>
            </div>
            <div>
                <Button text={"Submit"} size={"md"} color={"primary"}onClick={handleTestSubmit}/>
            </div>
        </div>
  )
}

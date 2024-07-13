import styles from './styles.module.css'
import QuestionContainer from '../../playground/QuestionContainer'
import Timer from '../../ui/Timer'
import DropdownMenu from '../../ui/DropdownMenu'

export default function TopNav() {

  const assessmentName:string = "AirBnB UX Design Assessment"

  return (
    <div className={styles.topNav}>
      <div className={styles.topNav1}>
        <DropdownMenu />
        <div className="question-area">{assessmentName}</div>
      </div>
      <div className={styles.topNav2}>
        <QuestionContainer />
      </div>
      <div className={styles.topNav3}>
        <Timer />
      </div>
    </div>
  )
}

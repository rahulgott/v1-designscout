import styles from './styles.module.css';
import { LeftNavProps } from '../../../../interfaces/types';
import DropdownMenu from '../../../ui/DropdownMenu';
import toggleMenuIcon from '../../../../../public/toggle-menu-icon.png';
import { useQuestion } from '../../../../contexts/questionContext';

export default function LeftNav({ assessmentInfo }: LeftNavProps) {
  const { currentQuestion, setCurrentQuestion } = useQuestion();

  const handleNext = () => {
    if (currentQuestion < assessmentInfo.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
      if (currentQuestion > 0) {
          setCurrentQuestion(currentQuestion - 1);
      }
  };

  return (
    <div className={styles.leftNav}>
      <div className={styles.toggleSection}>
        <DropdownMenu />
        <div className={styles.toggleMenuIcon}>
          <img src={toggleMenuIcon} alt="" />
        </div>
      </div>
      <div className={styles.assessmentInfo}>
        <div className={styles.questionsSection}>
          <h2>{assessmentInfo[currentQuestion].question}</h2>
          {assessmentInfo.length > 0 && (
            <div className={styles.buttonContainer}>
              <button onClick={handleBack} disabled={currentQuestion === 0}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={handleNext} disabled={currentQuestion === assessmentInfo.length - 1}>
                Next
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.75 13.5L11.25 9L6.75 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        <div className={styles.briefSection}>
          <h3>Product Brief</h3>
          <div>
            <h4>Background</h4>
            {assessmentInfo[currentQuestion].productBrief.background.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
          <div>
            <h4>Target Users</h4>
            <ul>
              {assessmentInfo[currentQuestion].productBrief.targetUsers.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Business Goals</h4>
            <ul>
              {assessmentInfo[currentQuestion].productBrief.businessGoals.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Challenges</h4>
            <ul>
              {assessmentInfo[currentQuestion].productBrief.challenges.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

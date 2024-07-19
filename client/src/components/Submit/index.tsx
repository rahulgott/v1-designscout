import styles from './styles.module.css'

export default function Submit() {
  return (
    <div className={styles.submitPage}>
        <div className={styles.card}>
            <h1>Submitted</h1>
            <p>Congratulations on completing the assessment! You're now one step closer to landing your dream job.</p>
        </div>
        
        <div className={styles.backButton}>
            <button>Back</button>
        </div>
    </div>
  )
}

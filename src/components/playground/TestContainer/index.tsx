import ImageCard from '../../ui/ImageCard'
import styles from './styles.module.css'
import mockImageSrc from '../../../assets/mock-image.png'
import QuestionContainer from '../QuestionContainer'

export default function TestContainer() {
  const altText = "some alt text"

  return (
    <div className={styles.testContainer}>
      <div className={styles.mainArea}>
        <QuestionContainer />
        <ImageCard src={mockImageSrc} altText={altText}/>
      </div>
    </div>
  )
}

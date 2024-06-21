import ImageCard from '../../ui/ImageCard';
import styles from './styles.module.css';
import mockImageSrc from '../../../assets/mock-image.png';
import QuestionContainer from '../QuestionContainer';

export default function TestContainer() {
  const altText = "some alt text";

  return (
    <div className={styles.testContainer}>
      <div className={styles.mainArea}>
        <div className={styles.imageArea} style={{ position: 'relative' }}>
          <ImageCard src={mockImageSrc} altText={altText} />
        </div>
        <div className={styles.sideNav}>
          <QuestionContainer />
        </div>
      </div>
    </div>
  );
}

import styles from './styles.module.css'

interface ImageCardProps {
  src: string,
  altText: string
}

export default function ImageCard({ src, altText }: ImageCardProps ) {
  return (
    <div className={styles.card}>
      <img src={src} alt={altText} className={styles.image} />
    </div>
  )
}

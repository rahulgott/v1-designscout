import styles from './styles.module.css'

interface ButtonProps {
    text: string,
    color: string,
    size: string,
    onClick?: any
}

export default function Button({text, color, size, onClick}: ButtonProps) {
  return (
    <button className={styles.button} onClick={onClick}>{text}</button>
  )
}

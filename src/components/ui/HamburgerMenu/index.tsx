import { useState } from 'react'
import styles from './styles.module.css'

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)
  
    return (
        <div>
            <button className={styles.hamburger} onClick={toggleMenu}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </button>
            {isOpen && (
                <div className={styles.menu}>
                <ul>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">About Us</a></li>
                </ul>
                </div>
            )}
        </div>
    )
}

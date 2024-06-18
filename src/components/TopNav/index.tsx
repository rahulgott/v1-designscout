import styles from './styles.module.css'
import logo from '../../../src/assets/logo.png'
import HamburgerMenu from '../ui/HamburgerMenu'

export default function TopNav() {

  return (
    <div className={styles.topNav}>
      <div className={styles.logo}>
        <img src={logo} alt="designscout logo" />
      </div>
      <div className="question-area">
        Junior UX Design Assessment 
      </div>
      <HamburgerMenu />
    </div>
  )
}

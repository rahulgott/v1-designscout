import styles from './styles.module.css'

export default function RightNav() {
  return (
    <div className={styles.rightNav}>
        <div className={styles.navContainer}>
            <p className={styles.heading}>Product Brief</p>
            <div className={styles.navContent}>
                <div>
                    <p className={styles.sideHeading}>
                        About AirBnB:
                    </p>
                    <p className={styles.content}>
                        Airbnb is a global online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities. It connects people looking to rent out their homes with people who are looking for accommodations in that locale. The platform allows users to create a listing for their property, manage bookings, and interact with guests directly.
                    </p>
                </div>
                <div>
                    <p className={styles.sideHeading}>
                        Business Goals:
                    </p>
                    <p className={styles.content}>
                        <ul>
                            <li>
                                Increase the booking conversion rate.
                            </li>
                            <li>
                                Enhance user engagement by improving the ease of use and functionality of the mobile app.
                            </li>
                            <li>
                                Retain existing customers and attract new ones by ensuring a seamless user experience.
                            </li>
                        </ul>    
                    </p>
                </div>
                <div>
                <p className={styles.sideHeading}>
                        Challenges:
                    </p>
                    <p className={styles.content}>
                        <ul>
                            <li>
                            The market is highly competitive with other booking platforms vying for user attention.
                            </li>
                            <li>
                            Balancing the simplicity of the user interface while providing all necessary information and functionalities can be complex.
                            </li>
                            <li>
                            Adapting the design to cater to a diverse, global user base.
                            </li>
                        </ul>    
                    </p>
                </div>
                <div>
                    <p className={styles.sideHeading}>
                        Target Users:
                    </p>
                    <p className={styles.content}>
                        <ul>
                            <li>
                            Demographics: Users aged between 25-45 years, primarily consisting of millennial travelers and small families.
                            </li>
                            <li>
                            Psychographics: Users who value unique travel experiences, convenience, and value for money.
                            </li>
                            <li>
                            Behavioral Characteristics: Users who prefer online bookings, are tech-savvy, and often rely on mobile devices for travel planning.
                            </li>
                        </ul> 
                    </p>
                </div>
                <div>
                    <p className={styles.sideHeading}>
                        Past Research:
                    </p>
                    <p className={styles.content}>
                        <ul>
                            <li>
                            Navigation Issues: Some users find the navigation between listing details and booking options confusing.
                            </li>
                            <li>
                            Information Overload: Users often feel overwhelmed by the amount of information presented at one time.
                            </li>
                            <li>
                            Trust Factors: New users sometimes express concerns over the trustworthiness of listings without sufficient reviews.
                            </li>
                            <li>
                            Visual Appeal: Users prefer a more visually appealing layout that highlights important features of the listings.
                            </li>
                        </ul> 
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

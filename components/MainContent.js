import Image from 'next/image';
import styles from './MainContent.module.css';

export default function MainContent() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <h2 className={styles.subTitle}>EDUWEAVER</h2>
          <h1 className={styles.mainTitle}>
            THE SCHOOL <br />
            AT HOME
          </h1>
          <p className={styles.description}>
            LOREM IPSUM HAS BEEN THE INDUSTRY'S STANDARD DUMMY TEXT 
            EVER SINCE THE 1500S
          </p>
          <button className={styles.exploreBtn}>
            Explore
          </button>
        </div>

        <div className={styles.illustrationWrapper}>
           <div className={styles.wavesContainer}>
              <svg viewBox="0 0 800 800" className={styles.waveSvg}>
                <path 
                  fill="currentColor" 
                  d="M400,0 C179.1,0 0,179.1 0,400 C0,620.9 179.1,800 400,800 C620.9,800 800,620.9 800,400 C800,179.1 620.9,0 400,0 Z M400,100 C565.7,100 700,234.3 700,400 C700,565.7 565.7,700 400,700 C234.3,700 100,565.7 100,400 C100,234.3 234.3,100 400,100 Z" 
                  className={styles.outerCircle} 
                />
                <circle cx="400" cy="400" r="300" className={styles.innerCircle} />
              </svg>
           </div>
           <div className={styles.imageContainer}>
                <Image 
                src="/illustration.png" 
                alt="Online Learning Illustration" 
                width={800} 
                height={600} 
                layout="responsive"
                priority
                />
           </div>
        </div>
      </div>
    </main>
  );
}

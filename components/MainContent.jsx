import Image from 'next/image';
import styles from './MainContent.module.css';

export default function MainContent() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div>
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
          <div className={styles.imageContainer}>
            <Image
              src="/illustration.png"
              alt="Online Learning Illustration"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}

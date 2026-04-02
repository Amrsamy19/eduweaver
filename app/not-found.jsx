'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.illustrationWrapper}>
        <div className={styles.scallopedBg}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.mainTitle}>PAGE NOT<br />FOUND</h1>
        <p className={styles.description}>
          THE LESSON YOU ARE LOOKING FOR DOESN'T EXIST YET 
          OR HAS BEEN MOVED TO ANOTHER CLASS.
        </p>
        <Link href="/" className={styles.homeBtn}>
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.topLogo}>
        <Image
          src="https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/public/quiz-media/logotype-08.png"
          alt="Logo"
          width={220}
          height={48}
          priority
        />
      </div>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src="https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/public/quiz-media/home.png"
            alt="Meditation illustration"
            width={200}
            height={200}
            priority
            className={styles.heroImage}
          />
        </div>
        
        <h1 className={styles.heading}>How do you find your calm?</h1>
        
        <p className={styles.subheading}>
          Discovering your meditation personality in just 8 friendly questions.
        </p>
        
        <div className={styles.duration}>
          <svg 
            className={styles.timeIcon}
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className={styles.durationText}>takes 1 minute</span>
        </div>
        
        <Link href="/question" className={styles.ctaButton}>
          Start Quiz
        </Link>
      </div>
    </main>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.topLogo}>
        <Image
          src="https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/sign/quiz-media/logotype-08.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZTEwODBmZS01ZmI1LTRkYjAtOWYwMy1iNWVhYmUxN2E1NjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJxdWl6LW1lZGlhL2xvZ290eXBlLTA4LnBuZyIsImlhdCI6MTc2MjQyOTQ5MSwiZXhwIjoxNzkzOTY1NDkxfQ.8avYK0kagqMdnOXDushjWskA4HKf0o-tPMkz1XUYDJg"
          alt="Logo"
          width={220}
          height={48}
          priority
        />
      </div>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <Image
            src="https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/sign/quiz-media/home.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZTEwODBmZS01ZmI1LTRkYjAtOWYwMy1iNWVhYmUxN2E1NjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJxdWl6LW1lZGlhL2hvbWUucG5nIiwiaWF0IjoxNzYyNDEwNzk0LCJleHAiOjE3OTM5NDY3OTR9.560e3GpiBSpJN2XahwCfhlYl_8WKqPRbH7oEHAdZQWs"
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

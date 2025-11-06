'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from './question.module.css';

interface Option {
  option_letter: string;
  option_text: string;
  personality_type_id: number;
}

interface Question {
  sno: number;
  question_text: string;
  options: Option[];
}

interface RawQuestion {
  sno: number;
  question_text: string;
  options: Option[];
}

export default function Question() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [personalities, setPersonalities] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const router = useRouter();

  const logoUrl = 'https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/public/quiz-media/logo_no_back.png';

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await supabase
        .from('questions')
        .select('sno, question_text, options(option_letter, option_text, personality_type_id)')
        .order('sno');

      const { data, error } = res as { data: RawQuestion[] | null; error: unknown };
      if (error) {
        console.error('Error fetching questions:', error);
      } else if (data) {
        const qs = data.map((q: RawQuestion) => ({
          sno: q.sno,
          question_text: q.question_text,
          options: q.options.sort((a, b) => a.option_letter.localeCompare(b.option_letter)),
        }));
        setQuestions(qs);
        setSelections(new Array(qs.length).fill(''));
        setPersonalities(new Array(qs.length).fill(0));
        setIsLoaded(true);
      }
    };

    fetchQuestions();

    // Preload logo image
    const img = new window.Image();
    img.src = logoUrl;
    img.onload = () => setLogoLoaded(true);
  }, []);

  const selectOption = (index: number, letter: string) => {
    const selectedOption = questions[index].options.find(opt => opt.option_letter === letter);
    if (selectedOption) {
      setSelections((prev) => {
        const next = [...prev];
        next[index] = letter;
        return next;
      });
      setPersonalities((prev) => {
        const next = [...prev];
        next[index] = selectedOption.personality_type_id;
        return next;
      });
    }
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      return;
    }
    // if we're on the last question, save selections and personalities, go to email input page
    localStorage.setItem('quizSelections', JSON.stringify(selections));
    localStorage.setItem('quizPersonalities', JSON.stringify(personalities));
    router.push('/email');
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      return;
    }
    // if first question and user pressed back, go to home
    router.push('/');
  };

  if (questions.length === 0) {
    return <div className={styles.wrap}>Loading...</div>;
  }

  const q = questions[current];
  const percent = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <button onClick={prev} className={styles.backBtn} type="button" aria-label="Back">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${percent}%` }} />
          </div>

          <div className={styles.counter}>{current + 1} of {questions.length}</div>
        </div>

        <motion.div 
          key={current} 
          initial={isLoaded ? { opacity: 0, x: 40 } : { opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -40 }}
          transition={{ 
            duration: 0.45, 
            ease: "easeOut",
            opacity: { duration: 0.3 },
            x: { duration: 0.45 }
          }}
          layout
        >
          <div className={styles.dialogRow}>
            <div className={styles.logoWrap}>
              <Image 
                src={logoUrl} 
                alt="logo" 
                className={`${styles.logo} ${!logoLoaded ? styles.loading : ''}`} 
                width={56} 
                height={56} 
                priority
                onLoad={() => setLogoLoaded(true)}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
              />
            </div>
            <div className={styles.bubble}>
              {q.question_text}
            </div>
          </div>

          <div className={styles.options}>
            {q.options.map((opt) => (
              <button
                key={opt.option_letter}
                className={
                  styles.optionBtn + (selections[current] === opt.option_letter ? ` ${styles.selected}` : '')
                }
                onClick={() => selectOption(current, opt.option_letter)}
                type="button"
              >
                <div className={styles.letter}>
                  <span>{opt.option_letter}</span>
                </div>
                <div>{opt.option_text}</div>
                {selections[current] === opt.option_letter ? (
                  <i className={`gg-check ${styles.checkIcon}`} aria-hidden />
                ) : null}
              </button>
            ))}
          </div>
        </motion.div>

        {selections[current] ? (
          <div className={styles.okRow}>
            <button
              className={styles.continueBtn}
              type="button"
              onClick={next}
            >
              Continue
            </button>
          </div>
        ) : null}

        {/* bottom navigation removed - using top back arrow + OK */}
      </div>
    </div>
  );
}
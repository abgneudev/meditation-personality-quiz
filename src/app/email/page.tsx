"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import styles from './page.module.css';

export default function Email() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateName = (value: string) => {
    if (!value || value.trim() === '') return 'This field is required.';
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value || value.trim() === '') return 'This field is required.';
    if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address.";
    return '';
  };

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nMsg = validateName(name);
    const eMsg = validateEmail(email);
    setNameError(nMsg);
    setError(eMsg);
    if (nMsg || eMsg) return;

    // Get selections and personalities from localStorage
    const selectionsStr = localStorage.getItem('quizSelections');
    const personalitiesStr = localStorage.getItem('quizPersonalities');
    if (!selectionsStr || !personalitiesStr) {
      alert('No quiz data found. Please start over.');
      router.push('/');
      return;
    }
    const selections: string[] = JSON.parse(selectionsStr);
    const personalities: number[] = JSON.parse(personalitiesStr);

    // Calculate personality_result
    const counts: { [key: number]: number } = {};
    personalities.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    const personalityResult = Object.keys(counts).reduce((a, b) => counts[Number(a)] > counts[Number(b)] ? a : b);

    // Store in database and capture the inserted id so reviews can reference it
  let insertData: unknown = null;
  let dbError: unknown = null;
    try {
      const res = await supabase
        .from('responses')
        .insert([{
          name,
          email,
          q1: selections[0],
          q2: selections[1],
          q3: selections[2],
          q4: selections[3],
          q5: selections[4],
          q6: selections[5],
          q7: selections[6],
          q8: selections[7],
          personality_result: Number(personalityResult)
        }])
        .select('id');

      insertData = res.data;
      dbError = res.error;
    } catch (err) {
      console.error('Exception while saving response to Supabase:', err);
      alert('Unexpected error while saving your response. See console for details.');
      return;
    }

    if (dbError) {
      // supabase errors can be objects; stringify for clearer console output
      try {
        console.error('Error saving response:', dbError, 'insertData:', insertData);
      } catch {
        console.error('Error saving response (stringify failed):', dbError);
      }
      // Show more helpful alert including message when available
      let errMsg = 'Unknown error';
      if (dbError) {
        if (typeof dbError === 'string') errMsg = dbError;
        else {
          try {
            const obj = dbError as Record<string, unknown>;
            if (obj && typeof obj['message'] === 'string') errMsg = obj['message'] as string;
            else if (obj && typeof obj['error'] === 'string') errMsg = obj['error'] as string;
            else errMsg = JSON.stringify(dbError);
          } catch {
            errMsg = String(dbError);
          }
        }
      }

      alert('Error saving your response: ' + errMsg + '. Please try again.');
      return;
    }

    // save the response id locally so results page can attach reviews
    try {
      if (insertData && Array.isArray(insertData) && insertData[0]?.id) {
        localStorage.setItem('quizResponseId', String(insertData[0].id));
      }
    } catch (e) {
      console.warn('Could not save response id to localStorage', e);
    }

    // Save to localStorage for results page
    localStorage.setItem('quizName', name);
    localStorage.setItem('quizPersonalityId', personalityResult);

    router.push('/results');
  };

  const onEmailBlur = () => {
    setError(validateEmail(email));
  };

  const onEmailChange = (value: string) => {
    setEmail(value);
    if (error) {
      setError(validateEmail(value));
    }
  };

  const onNameBlur = () => {
    setNameError(validateName(name));
  };

  const onNameChange = (value: string) => {
    setName(value);
    if (nameError) {
      setNameError(validateName(value));
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>

        <form className={styles.content} onSubmit={submit}>
          <div className={styles.questionRow}>
            <div>
              <div className={styles.questionText}>
                You made it! Let&apos;s get your results to you
                <span className={styles.requiredStar} aria-hidden>*</span>
              </div>
              <div className={styles.requiredLabel}>* means required field</div>
            </div>
          </div>

          <label className={styles.inputWrap} htmlFor="name">
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={onNameBlur}
              className={styles.emailInput + (nameError ? ` ${styles.invalid}` : '')}
              aria-label="Full name"
            />
          </label>
          {nameError ? <div className={styles.errorText}>{nameError}</div> : null}

          <label className={styles.inputWrap} htmlFor="email">
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onBlur={onEmailBlur}
              className={styles.emailInput + (error ? ` ${styles.invalid}` : '')}
              aria-label="Email address"
            />
          </label>
          {error ? <div className={styles.errorText}>{error}</div> : null}

          <div className={styles.controls}>
            <button type="submit" className={styles.okBtn}>OK</button>
          </div>
        </form>

        {/* Footer branding removed per request */}
      </div>
    </div>
  );
}
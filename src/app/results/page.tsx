'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './results.module.css';
import { supabase } from '../../../lib/supabase';

const personalityData = {
  quiet: {
    name: 'The Quiet Observer',
    image: 'https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/public/quiz-media/quiet.PNG',
    description: 'You have a natural gift for turning inward and finding calm within yourself. When life feels overwhelming, your sensitivity to your inner world allows you to pause and reflect rather than react. This quiet strength is a sign of deep emotional awareness'
  },
  action: {
    name: 'The Action Driver',
    image: 'https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/public/quiz-media/action.PNG',
    description: 'You feel most at ease when you can move with purpose. Channeling stress into action is not just your coping style, it is a form of resilience. Your energy helps you stay grounded even when things feel tough.'
  },
  imagine: {
    name: 'The Imaginative Dreamer',
    image: 'https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/public/quiz-media/imagine.JPG',
    description: 'Your creativity is more than just a talent, it is a way of healing. By reframing experiences through imagination and artistry, you transform challenges into stories, images, and new perspectives. This is your quiet form of emotional resilience.'
  },
  social: {
    name: 'The Social Connector',
    image: 'https://trritavoaewykjuyzjty.supabase.co/storage/v1/object/public/quiz-media/social.PNG',
    description: 'For you, well-being blossoms in connection. When life feels heavy, you lean on the strength of relationships, compassion, and shared understanding. This capacity for empathy makes you not only resilient yourself but also a source of comfort to others.'
  }
};

const idToKey = { 1: 'quiet', 2: 'action', 3: 'imagine', 4: 'social' };

export default function Results() {
  const data = useState<{name: string, personalityId: number} | null>(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('quizName');
      const storedPersonalityId = localStorage.getItem('quizPersonalityId');
      if (storedName && storedPersonalityId) {
        return { name: storedName, personalityId: Number(storedPersonalityId) };
      }
    }
    return null;
  })[0];

  useEffect(() => {
    if (!data) {
      // Redirect if no data
      window.location.href = '/';
    }
  }, [data]);
  const [review, setReview] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  async function handleSubmit() {
    if (!review.trim()) return;
    setSubmitting(true);
    setSubmitMessage('');

    try {
      // Prefer explicit response id saved at submission time
      let responseId = localStorage.getItem('quizResponseId');

      // If we don't have responseId, attempt a best-effort lookup by name + personality
      if (!responseId) {
        const name = localStorage.getItem('quizName') || undefined;
        const personalityId = localStorage.getItem('quizPersonalityId') || undefined;
        if (name && personalityId) {
          const { data: found, error: findErr } = await supabase
            .from('responses')
            .select('id')
            .eq('name', name)
            .eq('personality_result', Number(personalityId))
            .order('created_at', { ascending: false })
            .limit(1);

          if (!findErr && Array.isArray(found) && found.length > 0) {
            responseId = found[0].id;
            // cache it for future
            try { if (responseId) localStorage.setItem('quizResponseId', responseId); } catch { /* ignore */ }
          }
        }
      }

      if (!responseId) {
        setSubmitMessage('Could not find an associated response record. Please submit your email/results first.');
        setSubmitting(false);
        return;
      }

      // basic UUID sanity check (v4-ish)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(responseId)) {
        console.error('Invalid responseId before inserting review:', responseId);
        setSubmitMessage('Associated response id looks invalid. Please re-submit the quiz/email form.');
        setSubmitting(false);
        return;
      }

      // Insert into reviews table with better error reporting
      try {
        const { data: reviewData, error: insertErr } = await supabase.from('reviews').insert([
          {
            response_id: responseId,
            review_text: review,
          },
        ]);

        if (insertErr) {
          console.error('Error inserting review:', insertErr, 'responseId:', responseId);
          let msg = 'Error saving review. ';
          try {
            const obj = insertErr as unknown as Record<string, unknown>;
            if (obj && typeof obj['message'] === 'string') msg += obj['message'];
            else msg += JSON.stringify(insertErr);
          } catch {
            msg += String(insertErr);
          }
          setSubmitMessage(msg);
          setSubmitting(false);
          return;
        }

        console.log('Inserted review:', reviewData);
      } catch (e) {
        console.error('Exception inserting review:', e);
        setSubmitMessage('Unexpected error saving review. See console for details.');
        setSubmitting(false);
        return;
      }

      setReview('');
      setSubmitMessage('Thanks — your review was saved.');
    } catch (e) {
      console.error(e);
      setSubmitMessage('Unexpected error saving review.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const key = idToKey[data.personalityId as keyof typeof idToKey];
  const personalityInfo = personalityData[key as keyof typeof personalityData];

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.card}>
            <Image className={styles.image} src={personalityInfo.image} alt={`${personalityInfo.name} personality`} width={320} height={320} />
          </div>
        </div>

        <div className={styles.right}>
          <h1 className={styles.titleLeft}>{data.name}, your meditation personality is {personalityInfo.name}</h1>

          <p className={styles.description}>{personalityInfo.description}</p>

          <div className={styles.reviewWrap}>
            <label htmlFor="review" className={styles.reviewLabel}>Share your review</label>
            <textarea
              id="review"
              className={styles.reviewInput}
              placeholder="Tell us how this result resonates with you..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Saving...' : 'Submit'}
            </button>
            {submitMessage ? <div className={styles.submitMessage}>{submitMessage}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
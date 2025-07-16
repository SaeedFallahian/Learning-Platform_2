'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '@/app/courses/[courseId]/CourseDetail.module.css';
import { Lesson } from '@/types';

export default function LessonDetail() {
  const router = useRouter();
  const params = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newThumbnail, setNewThumbnail] = useState<string>('');
  const [newVideoEmbed, setNewVideoEmbed] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.courseId || !params?.lessonId) return;

    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/courses/${params.courseId}/lessons/${params.lessonId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch lesson');
        }
        const data = await res.json();
        setLesson(data);
        setNewTitle(data.title);
        setNewContent(data.content);
        setNewThumbnail(data.thumbnail);
        setNewVideoEmbed(data.videoEmbed);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchLesson();
  }, [params?.courseId, params?.lessonId]);

  const updateLesson = async () => {
    try {
      const res = await fetch(`/api/courses/${params.courseId}/lessons/${params.lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          thumbnail: newThumbnail,
          videoEmbed: newVideoEmbed,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update lesson');
      }

      setSuccess('Lesson updated successfully!');
      setTimeout(() => {
        setSuccess(null);
        router.push(`/courses/${params.courseId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const goBack = () => {
    router.push(`/courses/${params.courseId}`);
  };

  if (!lesson) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lesson Details</h1>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.formContainer}>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Lesson Title</label>
            <input
              type="text"
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="thumbnail">Thumbnail URL</label>
            <input
              type="url"
              id="thumbnail"
              value={newThumbnail}
              onChange={(e) => setNewThumbnail(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="videoEmbed">Video Embed URL</label>
            <input
              type="url"
              id="videoEmbed"
              value={newVideoEmbed}
              onChange={(e) => setNewVideoEmbed(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={updateLesson}
              disabled={!newTitle.trim() || !newContent.trim() || !newThumbnail.trim() || !newVideoEmbed.trim()}
              className={styles.button}
            >
              Update Lesson
            </button>
            <button onClick={goBack} className={styles.deleteButton}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
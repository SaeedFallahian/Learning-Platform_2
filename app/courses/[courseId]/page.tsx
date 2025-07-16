'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import styles from './CourseDetail.module.css';
import { Course, Lesson } from '@/types';

export default function CourseDetail() {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useUser();
  const params = useParams();

  useEffect(() => {
    async function fetchCourseAndLessons() {
      try {
        const courseId = params.courseId;
        console.log('Fetching course with ID:', courseId);

        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course');
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);

        const lessonsResponse = await fetch(`/api/courses/${courseId}/lessons`);
        if (!lessonsResponse.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const lessonsData = await lessonsResponse.json();
        console.log('Fetched lessons:', lessonsData);
        setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      } catch (err: any) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourseAndLessons();
  }, [params.courseId]);

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${params.courseId}/lessons/${lessonId}/delete`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSuccess('Lesson deleted successfully');
        setLessons((prev) => prev.filter((lesson) => {
          const id = typeof lesson.id === 'string'
            ? lesson.id.includes(':') ? lesson.id.split(':').pop() : lesson.id
            : String(lesson.id);
          return id !== lessonId;
        }));
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to delete lesson');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete lesson');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!course) return <div className={styles.error}>Course not found</div>;

  return (
    <div className={styles.container}>
      <SignedIn>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>
        <div className={styles.grid}>
          {lessons.length === 0 && (
            <div className={styles.empty}>No lessons available.</div>
          )}
          {lessons.map((lesson) => {
            let lessonId = '';
            if (typeof lesson.id === 'string') {
              const parts = lesson.id.split(':');
              lessonId = parts[parts.length - 1].replace(/⟩$/, '');
            } else {
              lessonId = String(lesson.id);
            }
            console.log('Rendering lesson:', lesson, 'Extracted lessonId:', lessonId);
            return (
              <div key={lessonId} className={styles.card}>
                <Link
                  href={`/courses/${params.courseId}/lessons/${lessonId}`}
                  className={styles.cardLink}
                >
                  <img
                    src={lesson.thumbnail}
                    alt={lesson.title}
                    className={styles.image}
                  />
                  <div className={styles.cardContent}>
                    <h2 className={styles.cardTitle}>{lesson.title}</h2>
                    <p className={styles.description}>{lesson.content}</p>
                  </div>
                </Link>
                {user && user.publicMetadata?.role === 'admin' && (
                  <div className={styles.buttonContainer}>
                    <Link href={`/courses/${params.courseId}/lessons/${lessonId}/edit`}>
                      <button className={styles.button}>Update Lesson</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteLesson(lessonId)}
                      className={styles.deleteButton}
                    >
                      Delete Lesson
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SignedIn>
      <SignedOut>
        <div className={styles.signInPrompt}>
          <h2>Please sign in to view course details</h2>
          <SignInButton mode="modal">
            <button className={styles.signInButton}>Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import styles from '../../../../styles/LessonDetail.module.css';
import Link from 'next/link';
import { Course, Lesson } from '@/types';

export default function LessonDetail({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { courseId, lessonId } = await params;
        const courseRes = await fetch(`/api/courses/${courseId}`);
        if (!courseRes.ok) {
          const errorData = await courseRes.json();
          throw new Error(errorData.error || 'Course not found');
        }
        const courseData = await courseRes.json();
        setCourse(courseData);

        const lessonRes = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`);
        if (!lessonRes.ok) {
          const errorData = await lessonRes.json();
          throw new Error(errorData.error || 'Lesson not found');
        }
        const lessonData = await lessonRes.json();
        setLesson(lessonData);
      } catch (err: any) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!course || !lesson) return <div className={styles.container}>Lesson or Course not found</div>;

  const courseId = typeof course.id === 'string' 
    ? course.id.includes(':') 
      ? course.id.split(':').pop() || course.id // حذف پیشوند course:
      : course.id
    : String(course.id);

  const lessonCourseId = typeof lesson.course === 'string' 
    ? lesson.course.includes(':') 
      ? lesson.course.split(':').pop() || lesson.course // حذف پیشوند course:
      : lesson.course
    : String(lesson.course);

  console.log('Client-side comparison - lessonCourseId:', lessonCourseId, 'courseId:', courseId);


  return (
    <div className={styles.container}>
      <div className={styles.thumbnailBackground} style={{ backgroundImage: `url(${lesson.thumbnail})` }}></div>
      <div className={styles.contentWrapper}>
        <Link href={`/courses/${courseId}`} className={styles.backLink}>
          Back to {course.title}
        </Link>
        <div className={styles.lessonHeader}>
          <h1 className={styles.title}>{lesson.title}</h1>
        </div>
        <div className={styles.lessonContent}>
          <div className={styles.videoWrapper}>
            <iframe
              frameBorder="0"
              width="100%"
              height="400px"
              src={lesson.videoEmbed}
              allowFullScreen={true}
              webkitallowfullscreen={true}
              mozallowfullscreen={true}
            ></iframe>
          </div>
          <p className={styles.content}>{lesson.content}</p>
        </div>
      </div>
    </div>
  );
}
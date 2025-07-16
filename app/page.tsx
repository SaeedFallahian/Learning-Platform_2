'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './styles/Home.module.css';
import { Course } from '@/types';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses?limit=3', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Welcome to EduPlatform!</h1>
        <p>Learn new skills with our diverse online courses.</p>
        <Link href="/courses" className={styles.ctaButton}>
          Explore Courses
        </Link>
      </section>
      <section className={styles.coursesPreview}>
        <h2>Featured Courses</h2>
        {loading && <div className={styles.courseGrid}>Loading...</div>}
        {error && <div className={styles.courseGrid}>Error: {error}</div>}
        {!loading && !error && courses.length === 0 && (
          <div className={styles.courseGrid}>No courses available.</div>
        )}
        {!loading && !error && courses.length > 0 && (
          <div className={styles.courseGrid}>
            {courses.map((course) => {
              const courseId = typeof course.id === 'string'
                ? course.id.includes(':')
                  ? course.id.split(':').pop()?.replace(/[^\w\-]/g, '') || course.id
                  : course.id
                : String(course.id);
              return (
                <Link href={`/courses/${courseId}`} key={courseId} className={styles.courseCard}>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
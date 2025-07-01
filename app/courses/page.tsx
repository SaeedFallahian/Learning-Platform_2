
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import styles from './Courses.module.css';
import { Course } from '@/types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Fetch response status:', response.status); // لاگ برای دیباگ
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        console.log('Fetched courses:', data); // لاگ برای دیباگ

        // اطمینان از اینکه داده‌ها آرایه هستند
        const coursesArray = Array.isArray(data) ? data : [];
        setCourses(coursesArray);
      } catch (err: any) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className={styles.container}>
      <SignedIn>
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!loading && !error && courses.length === 0 && (
          <div className={styles.empty}>No courses available.</div>
        )}
        {!loading && !error && courses.length > 0 && (
          <div className={styles.grid}>
            {courses.map((course) => {
              // استخراج courseId با مدیریت فرمت‌های مختلف id
              let courseId = '';
              if (typeof course.id === 'string') {
                // حذف هر چیزی قبل از آخرین ':'
                const parts = course.id.split(':');
                courseId = parts[parts.length - 1].replace(/⟩$/, ''); // حذف کاراکترهای اضافی
              } else {
                courseId = String(course.id);
              }
              console.log('Rendering course:', course, 'Extracted courseId:', courseId); // لاگ برای دیباگ
              return (
                <Link
                  href={`/courses/${courseId}`}
                  key={courseId}
                  className={styles.card}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className={styles.courseImage}
                  />
                  <div className={styles.cardContent}>
                    <h2 className={styles.title}>{course.title}</h2>
                    <p className={styles.description}>{course.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <div className={styles.signInPrompt}>
          <h2>Please sign in to view courses</h2>
          <SignInButton mode="modal">
            <button className={styles.signInButton}>Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}

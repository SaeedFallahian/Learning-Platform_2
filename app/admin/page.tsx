'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import styles from '../courses/Courses.module.css';
import { Course } from '@/types';

export default function AdminPanel() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    content: '',
    thumbnail: '',
    videoEmbed: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata?.role !== 'admin')) {
      router.push('/courses');
    }

    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses');
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
  }, [isLoaded, user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/courses/${formData.courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          thumbnail: formData.thumbnail,
          videoEmbed: formData.videoEmbed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lesson');
      }

      setSuccess('Lesson created successfully!');
      setFormData({
        courseId: formData.courseId,
        title: '',
        content: '',
        thumbnail: '',
        videoEmbed: '',
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!user || user.publicMetadata?.role !== 'admin') return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel - Create New Lesson</h1>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="courseId">Select Course</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            required
          >
            <option value="">-- Select a Course --</option>
            {courses.map((course) => {
              const courseId =
                typeof course.id === 'string'
                  ? course.id.split(':').pop() || course.id
                  : String(course.id);
              return (
                <option key={courseId} value={courseId}>
                  {course.title}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="title">Lesson Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Lesson Content</label>
          <input
            type="text"
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="thumbnail">Thumbnail URL</label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="videoEmbed">Video Embed URL</label>
          <input
            type="url"
            id="videoEmbed"
            name="videoEmbed"
            value={formData.videoEmbed}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Create Lesson
        </button>
      </form>
    </div>
  );
}
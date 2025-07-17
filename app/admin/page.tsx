'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import styles from './AdminPanel.module.css';
import { Course } from '@/types';
import { CourseSchema, LessonSchema } from '@/lib/schemas';
import { z } from 'zod';

export default function AdminPanel() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
  });
  const [lessonFormData, setLessonFormData] = useState({
    courseId: '',
    title: '',
    content: '',
    thumbnail: '',
    videoEmbed: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'course' | 'lesson' | null>(null);
  const [courseFormErrors, setCourseFormErrors] = useState<Record<string, string>>({});
  const [lessonFormErrors, setLessonFormErrors] = useState<Record<string, string>>({});

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

  const handleCourseInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseFormData((prev) => ({ ...prev, [name]: value }));
    setCourseFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleLessonInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLessonFormData((prev) => ({ ...prev, [name]: value }));
    setLessonFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCourseFormErrors({});

    const parsedData = CourseSchema.safeParse(courseFormData);
    if (!parsedData.success) {
      const errors: Record<string, string> = {};
      parsedData.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0]] = issue.message;
        }
      });
      setCourseFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      setSuccess('Course created successfully!');
      setCourseFormData({
        title: '',
        description: '',
        image: '',
        icon: '',
      });

      const updatedResponse = await fetch('/api/courses');
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setCourses(Array.isArray(updatedData) ? updatedData : []);
      }

      setActiveForm(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLessonFormErrors({});

    const parsedData = LessonSchema.safeParse(lessonFormData);
    if (!parsedData.success) {
      const errors: Record<string, string> = {};
      parsedData.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0]] = issue.message;
        }
      });
      setLessonFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`/api/courses/${lessonFormData.courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: parsedData.data.title,
          content: parsedData.data.content,
          thumbnail: parsedData.data.thumbnail,
          videoEmbed: parsedData.data.videoEmbed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create lesson');
      }

      setSuccess('Lesson created successfully!');
      setLessonFormData({
        courseId: lessonFormData.courseId,
        title: '',
        content: '',
        thumbnail: '',
        videoEmbed: '',
      });

      setActiveForm(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!user || user.publicMetadata?.role !== 'admin') return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Panel</h1>

      <div className={styles.actionButtons}>
        <button
          className={`${styles.actionButton} ${activeForm === 'course' ? styles.activeButton : ''}`}
          onClick={() => setActiveForm(activeForm === 'course' ? null : 'course')}
        >
          Create New Course
        </button>
        <button
          className={`${styles.actionButton} ${activeForm === 'lesson' ? styles.activeButton : ''}`}
          onClick={() => setActiveForm(activeForm === 'lesson' ? null : 'lesson')}
        >
          Create New Lesson
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {activeForm === 'course' && (
        <div className={styles.formContainer}>
          <h2 className={styles.subtitle}>Create New Course</h2>
          <form onSubmit={handleCourseSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Course Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={courseFormData.title}
                onChange={handleCourseInputChange}
                required
              />
              {courseFormErrors.title && (
                <span className={styles.error}>{courseFormErrors.title}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={courseFormData.description}
                onChange={handleCourseInputChange}
                required
              />
              {courseFormErrors.description && (
                <span className={styles.error}>{courseFormErrors.description}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={courseFormData.image}
                onChange={handleCourseInputChange}
                required
              />
              {courseFormErrors.image && (
                <span className={styles.error}>{courseFormErrors.image}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="icon">Icon URL</label>
              <input
                type="url"
                id="icon"
                name="icon"
                value={courseFormData.icon}
                onChange={handleCourseInputChange}
                required
              />
              {courseFormErrors.icon && (
                <span className={styles.error}>{courseFormErrors.icon}</span>
              )}
            </div>
            <button type="submit" className={styles.button}>
              Create Course
            </button>
          </form>
        </div>
      )}

      {activeForm === 'lesson' && (
        <div className={styles.formContainer}>
          <h2 className={styles.subtitle}>Create New Lesson</h2>
          <form onSubmit={handleLessonSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="courseId">Select Course</label>
              <select
                id="courseId"
                name="courseId"
                value={lessonFormData.courseId}
                onChange={handleLessonInputChange}
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
              {lessonFormErrors.courseId && (
                <span className={styles.error}>{lessonFormErrors.courseId}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="title">Lesson Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={lessonFormData.title}
                onChange={handleLessonInputChange}
                required
              />
              {lessonFormErrors.title && (
                <span className={styles.error}>{lessonFormErrors.title}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="content">Lesson Content</label>
              <input
                type="text"
                id="content"
                name="content"
                value={lessonFormData.content}
                onChange={handleLessonInputChange}
                required
              />
              {lessonFormErrors.content && (
                <span className={styles.error}>{lessonFormErrors.content}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="thumbnail">Thumbnail URL</label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                value={lessonFormData.thumbnail}
                onChange={handleLessonInputChange}
                required
              />
              {lessonFormErrors.thumbnail && (
                <span className={styles.error}>{lessonFormErrors.thumbnail}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="videoEmbed">Video Embed URL</label>
              <input
                type="url"
                id="videoEmbed"
                name="videoEmbed"
                value={lessonFormData.videoEmbed}
                onChange={handleLessonInputChange}
                required
              />
              {lessonFormErrors.videoEmbed && (
                <span className={styles.error}>{lessonFormErrors.videoEmbed}</span>
              )}
            </div>
            <button type="submit" className={styles.button}>
              Create Lesson
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
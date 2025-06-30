import { courses } from '@/data/courses';
import styles from '../../styles/CourseDetail.module.css';
import Link from 'next/link';

export default function CourseDetail({ params }: { params: { courseId: string } }) {
  const course = courses.find((c) => c.id === params.courseId);

  if (!course) {
    return <div className={styles.container}>Course not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.courseHeader}>
        <img src={course.icon} alt={`${course.title} icon`} className={styles.courseIcon} />
        <img src={course.image} alt={course.title} className={styles.courseImage} />
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>
      <h2>Lessons</h2>
      <ul className={styles.lessonList}>
        {course.lessons.map((lesson) => (
          <li key={lesson.id} className={styles.lessonItem}>
            <img src={lesson.thumbnail} alt={lesson.title} className={styles.lessonThumbnail} />
            <div className={styles.lessonContent}>
              <h3>{lesson.title}</h3>
              <p>{lesson.content}</p>
              <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className={styles.lessonLink}>
                View Lesson
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}